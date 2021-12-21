import { useEffect, useRef, useState } from 'react';
import { discoveredQuery } from '../../api/api';
import { deepClone, getDictScoreForEntry, mapKeys, mapValues, updateEntriesWithKeyPress } from '../../lib/utils';
import { Entry } from '../../models/Entry';
import EntryComp from '../EntryComp/EntryComp';
import './Explored.scss';
import { ExploredProps } from './ExploredProps';

function Explored(props: ExploredProps) {
    const [lastSelectedKey, setLastSelectedKey] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [exportOnlyChanges, setExportOnlyChanges] = useState(true);
    const [exportOnlySelected, setExportOnlySelected] = useState(false);
    const [updateSemaphore, setUpdateSemaphore] = useState(0);

    const entryArray = useRef([] as Entry[]);
    const entryArrayMap = useRef(new Map<string, boolean>());

    useEffect(() => {
        async function doDiscoveredQuery() {
            if (props.query.length === 0) return;

            setIsLoading(true);
            let results = await discoveredQuery(props.query);
            let newEntries = new Map<string, Entry>();
            for (let result of results) {
                result.isExplored = true;
                newEntries.set(result.entry, result);
            }
            props.updateExploredEntries(newEntries);
            generateEntryArray(newEntries);
            setIsLoading(false);
        }

        doDiscoveredQuery();
        // eslint-disable-next-line
    }, [props.query]);

    useEffect(() => {
        for (let entry of mapValues(props.exploredEntries)) {
            if (!entryArrayMap.current.has(entry.entry)) {
                entryArray.current.unshift(entry);
                entryArrayMap.current.set(entry.entry, true);
            }
            else {
                generateEntryArray(props.exploredEntries);
            }
        }

        setUpdateSemaphore(updateSemaphore + 1);
        // eslint-disable-next-line
    }, [props.exploredEntries]);

    function generateEntryArray(newEntries: Map<string, Entry>) {
        let newArray = [] as Entry[];
        let newArrayMap = new Map<string, boolean>();

        let scoreDict = new Map<string, number>();
        let modifiedDict = new Map<string, boolean>();
        for (let entry of mapValues(newEntries)) {
            scoreDict.set(entry.entry, getDictScoreForEntry(entry));
            modifiedDict.set(entry.entry, entry.isModified || false);
        }

        let sorted = mapKeys(scoreDict).sort((a, b) => {
            return modifiedDict.get(a)! ? -100 : modifiedDict.get(b)! ? 100 :
                scoreDict.get(b)! - scoreDict.get(a)!
        });
        for (let key of sorted) {
            newArray.push(newEntries.get(key)!);
            newArrayMap.set(key, true);
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

        let newEntriesMap = deepClone(props.exploredEntries) as Map<string, Entry>;
        if (!event.ctrlKey) {
            for (let entry of mapValues(newEntriesMap)) {
                entry.isSelected = false;
            }
        }

        let targetEntry = newEntriesMap.get(target.dataset["entrykey"])!;
        if (lastSelectedKey && event.shiftKey) {
            let lastSelectedIndex = entryArray.current.findIndex(x => x.entry === lastSelectedKey);
            let targetIndex = entryArray.current.findIndex(x => x.entry === targetEntry.entry);
            let minIndex = Math.min(lastSelectedIndex, targetIndex);
            let maxIndex = Math.max(lastSelectedIndex, targetIndex);
            for (let i = minIndex; i <= maxIndex; i++ ) {
                let entry = newEntriesMap.get(entryArray.current[i].entry)!;
                if (!entry.isSelected) {
                    entry.isSelected = true;
                }
            }
        }
        else { 
            targetEntry.isSelected = !targetEntry.isSelected;
            setLastSelectedKey(targetEntry.entry);
        }
        
        props.updateExploredEntries(newEntriesMap);
        generateEntryArray(newEntriesMap);
    }

    function handleDeselect(event: any) {
        let target = event.target;
        while (true) {
            if (!target) break;
            if (target.classList[0] === "entry-shell") return;
            target = target.parentElement;
        }

        let newEntriesMap = deepClone(props.exploredEntries) as Map<string, Entry>;
        for (let entry of mapValues(newEntriesMap)) {
            entry.isSelected = false;
        }

        props.updateExploredEntries(newEntriesMap);
        generateEntryArray(newEntriesMap);
    }

    function handleKeyDown(event: any) {
        let key: string = event.key.toUpperCase();

        let selectedEntries = deepClone(mapValues(props.exploredEntries).filter(x => x.isSelected));
        if (selectedEntries.length === 0) return;

        updateEntriesWithKeyPress(selectedEntries, key);

        if (selectedEntries.length === 1 && key === 'R') {
            let newText = prompt("Enter new display text:", selectedEntries[0].displayText);
            if (!newText) return;
            let normalized = newText.replaceAll(/[^A-Za-z]/g, "");
            if (normalized.toUpperCase() !== selectedEntries[0].entry) return;
            selectedEntries[0].displayText = newText;
        }

        props.entriesModified(selectedEntries);
    }

    function handleOnlyChangesToggle() {
        setExportOnlyChanges(!exportOnlyChanges);
    }

    function handleOnlySelectedToggle() {
        setExportOnlySelected(!exportOnlySelected);
    }

    function exportEntries() {
        let lines = [] as string[];

        entryArray.current.forEach(entry => {
            if (exportOnlyChanges && !entry.isModified) return;
            if (exportOnlySelected && !entry.isSelected) return;

            lines.push(`${entry.entry};${getDictScoreForEntry(entry)}`);
        }); 
        
        window.open()!.document.write(`<pre>${lines.join("\n")}</pre>`);
    }

    function addNewEntry(event: any) {
        let key: string = event.key;
        let textbox = (document.getElementById("new-entry") as HTMLInputElement);

        let newText = textbox!.value;
        if (key === "Enter") {
            let normalized = newText.replaceAll(/[^A-Za-z]/g, "").toUpperCase();
            let newEntries = [] as Entry[];
            let newEntry = {
                entry: normalized,
                displayText: newText,
                qualityScore: 3,
                obscurityScore: 3,
                isSelected: true,
                isExplored: true,
                isModified: true,
            } as Entry;

            newEntries.push(newEntry);
            mapValues(props.exploredEntries).forEach(entry => {
                if (entry.isSelected) {
                    entry.isSelected = false;
                    newEntries.push(entry);
                }
            });

            entryArray.current.unshift(newEntry);
            entryArrayMap.current.set(newEntry.entry, true);
            props.entriesModified(newEntries);
            textbox.value = "";
        }
    }

    return (
        <div id="Explored" onClick={handleDeselect}>
            <div id="topbar">
                <div className="fill-list-button" onClick={exportEntries}>Export</div>
                <div className="fill-sec-checkboxes">
                    <input type="checkbox" className="section-checkbox" id="onlyChanges"
                                checked={exportOnlyChanges} onChange={handleOnlyChangesToggle} />
                    <label htmlFor="onlyChanges">Only Changes</label>
                    <br />
                    <input type="checkbox" className="section-checkbox" id="onlySelected"
                                checked={exportOnlySelected} onChange={handleOnlySelectedToggle} />
                    <label htmlFor="onlySelected">Only Selected</label>
                </div>
            </div>
            <div id="topbar2">
                <input type="text" id="new-entry" placeholder="Add Entry..." onKeyDown={addNewEntry}></input>
            </div>
            <div onKeyDown={handleKeyDown} onClick={handleEntryClick} tabIndex={0}>
                {isLoading &&
                    <div>Loading...</div>
                }
                {!isLoading && entryArray.current.length === 0 && 
                    <i>No results</i>
                }
                {!isLoading && entryArray.current.map(entry => (
                    <EntryComp isFrontier={false} key={entry.entry} entry={entry}></EntryComp>
                ))}
            </div>
        </div>
    );
}

export default Explored;
