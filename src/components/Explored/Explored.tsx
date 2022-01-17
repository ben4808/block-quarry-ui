import { useEffect, useRef, useState } from 'react';
import { deepClone, getDictScoreForEntry, getDictScoreForEntryAlt, mapKeys, mapValues, updateEntriesWithKeyPress } from '../../lib/utils';
import { Entry } from '../../models/Entry';
import { ModifiedEntry } from '../../models/ModifiedEntry';
import EntryComp from '../EntryComp/EntryComp';
import './Explored.scss';
import { ExploredProps } from './ExploredProps';

function Explored(props: ExploredProps) {
    const [lastSelectedKey, setLastSelectedKey] = useState("");
    const [exportOnlyModified, setExportOnlyModified] = useState(false);
    const [exportExcludeLowRated, setExportExcludeLowRated] = useState(true);
    const [updateSemaphore, setUpdateSemaphore] = useState(0);

    const entryArray = useRef([] as Entry[]);
    const entryArrayMap = useRef(new Map<string, boolean>());

    useEffect(() => {
        entryArray.current = [];
        entryArrayMap.current = new Map<string, boolean>();
        // eslint-disable-next-line
    }, [props.query]);

    useEffect(() => {
        generateEntryArray(props.exploredEntries);
        setUpdateSemaphore(updateSemaphore + 1);
        // eslint-disable-next-line
    }, [props.exploredEntries]);

    function generateEntryArray(newEntries: Map<string, Entry>) {
        let newArray = [] as Entry[];
        let newArrayMap = new Map<string, boolean>();

        if (entryArray.current.length === 0) {
            let scoreDict = new Map<string, number>();
            let bfastDict = new Map<string, boolean>();
            for (let entry of mapValues(newEntries)) {
                scoreDict.set(entry.entry, getDictScoreForEntry(entry));
                bfastDict.set(entry.entry, entry.breakfastTestFailure);
            }

            let sorted = mapKeys(scoreDict).sort((a, b) => {
                let scoresEqual = scoreDict.get(b)! === scoreDict.get(a)!;
                let bfastEqual = bfastDict.get(b)! === bfastDict.get(a)!;
                if (scoresEqual && bfastEqual) return a < b ? -1 : 1;
                if (bfastEqual) return scoreDict.get(b)! - scoreDict.get(a)!;
                return bfastDict.get(b)! ? -1 : 1;
            });
            for (let key of sorted) {
                newArray.push(newEntries.get(key)!);
                newArrayMap.set(key, true);
            }
        }
        else {
            for (let curEntry of entryArray.current) {
                let key = curEntry.entry;
                let entry = newEntries.get(key)!;
                newArray.push(entry);
                newArrayMap.set(curEntry.entry, true);
            }
            for (let entry of mapValues(newEntries)) {
                if (!newArrayMap.has(entry.entry)) {
                    newArray.unshift(entry);
                    newArrayMap.set(entry.entry, true);
                }
            }
        }

        entryArray.current = newArray;
        entryArrayMap.current = newArrayMap;
    }

    function handleEntryClick(event: any) {
        let target = event.target;
        while (target.classList.length < 1 || target.classList[0] !== "entry-shell") {
            target = target.parentElement;
            if (!target) return;
        }

        if (entryArray.current.length === 0) return;

        let newSelectedKeys = [] as string[];
        let targetKey = target.dataset["entrykey"];

        if (event.ctrlKey) {
            for (let entry of mapValues(props.exploredEntries)) {
                if (entry.isSelected) newSelectedKeys.push(entry.entry);
            }
        }
        if (lastSelectedKey && event.shiftKey) {
            let lastSelectedIndex = entryArray.current.findIndex(x => x.entry === lastSelectedKey);
            let targetIndex = entryArray.current.findIndex(x => x.entry === targetKey);
            let minIndex = Math.min(lastSelectedIndex, targetIndex);
            let maxIndex = Math.max(lastSelectedIndex, targetIndex);
            for (let i = minIndex; i <= maxIndex; i++ ) {
                newSelectedKeys.push(entryArray.current[i].entry);
            }
        }
        else { 
            if (newSelectedKeys.includes(targetKey))
                newSelectedKeys = newSelectedKeys.filter(x => x !== targetKey);
            else
                newSelectedKeys.push(targetKey);

            setLastSelectedKey(targetKey);
        }
        
        props.entriesSelected(newSelectedKeys);
    }

    function handleDeselect(event: any) {
        let target = event.target;
        while (target.classList.length < 1 || target.classList[0] !== "entry-shell") {
            target = target.parentElement;
            if (!target) break;
        }

        if (!target)
            props.entriesSelected([]);
    }

    function handleKeyDown(event: any) {
        let key: string = event.key.toUpperCase();

        let selectedEntries = deepClone(mapValues(props.exploredEntries).filter(x => x.isSelected));
        if (selectedEntries.length === 0) return;

        let modifiedEntries = updateEntriesWithKeyPress(selectedEntries, key);
        props.entriesModified(modifiedEntries);
    }

    function handleOnlyModifiedToggle() {
        setExportOnlyModified(!exportOnlyModified);
    }

    function handleExcludeLowRatedToggle() {
        setExportExcludeLowRated(!exportExcludeLowRated);
    }

    function exportEntries() {
        let lines = [] as string[];

        entryArray.current.forEach(entry => {
            if (exportOnlyModified && !entry.isModified) return;
            if (exportExcludeLowRated && isEntryLowRated(entry)) return;

            lines.push(`${entry.entry};${getDictScoreForEntryAlt(entry)}`);
        }); 
        
        window.open()!.document.write(`<pre>${lines.join("\n")}</pre>`);
    }

    function isEntryLowRated(entry: Entry) {
        if (entry.qualityScore! < 2) return true;
        if (entry.obscurityScore! < 2 && entry.qualityScore! < 3) return true;
        if (entry.breakfastTestFailure) return true;

        return false;
    }

    function addNewEntry(event: any) {
        let key: string = event.key;
        let textbox = (document.getElementById("new-entry") as HTMLInputElement);

        let newText = textbox!.value;
        if (key === "Enter") {
            let normalized = newText.replaceAll(/[^A-Za-z]/g, "").toUpperCase();
            let newEntry = {
                entry: normalized,
                displayText: newText,
            } as ModifiedEntry;

            props.entriesModified([newEntry]);
            textbox.value = "";
        }
    }

    return (
        <div id="Explored" onClick={handleDeselect}>
            <div id="topbar">
                <div className="fill-list-button" onClick={exportEntries}>Export</div>
                <div className="fill-sec-checkboxes">
                    <input type="checkbox" className="section-checkbox" id="onlyModified"
                                checked={exportOnlyModified} onChange={handleOnlyModifiedToggle} />
                    <label htmlFor="onlyModified">Only Modified</label>
                    <br />
                    <input type="checkbox" className="section-checkbox" id="excludeLowRated"
                                checked={exportExcludeLowRated} onChange={handleExcludeLowRatedToggle} />
                    <label htmlFor="excludeLowRated">Exclude Low Rated</label>
                </div>
            </div>
            <div id="topbar2">
                <input type="text" id="new-entry" placeholder="Add Entry..." onKeyDown={addNewEntry}></input>
            </div>
            <div onKeyDown={handleKeyDown} onClick={handleEntryClick} tabIndex={0}>
                {props.exploredLoading &&
                    <div>Loading...</div>
                }
                {!props.exploredLoading && entryArray.current.length === 0 && 
                    <i>No results</i>
                }
                {!props.exploredLoading && entryArray.current.map(entry => (
                    <EntryComp isFrontier={false} key={entry.entry} entry={entry}></EntryComp>
                ))}
            </div>
        </div>
    );
}

export default Explored;
