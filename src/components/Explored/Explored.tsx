import { useEffect, useRef, useState } from 'react';
import { discoveredQuery } from '../../api/api';
import { deepClone, getDictScoreForEntry, mapKeys, mapValues, updateEntriesWithKeyPress } from '../../lib/utils';
import { Entry } from '../../models/Entry';
import EntryComp from '../EntryComp/EntryComp';
import './Explored.scss';
import { ExploredProps } from './ExploredProps';

function Explored(props: ExploredProps) {
    const [entries, setEntries] = useState(new Map<string, Entry>());
    const [lastSelectedKey, setLastSelectedKey] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [exportOnlyChanges, setExportOnlyChanges] = useState(true);
    const [exportOnlySelected, setExportOnlySelected] = useState(false);

    const entryArray = useRef([] as Entry[]);

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
            setEntries(newEntries);
            generateEntryArray(newEntries);
            setIsLoading(false);
        }

        doDiscoveredQuery();
    }, [props.query]);

    function generateEntryArray(newEntries: Map<string, Entry>) {
        let ret = [] as Entry[];
        if (newEntries.size === 0) return ret;

        let scoreDict = new Map<string, number>();
        for (let key of mapKeys(newEntries)) {
            let entry = newEntries.get(key)!;
            scoreDict.set(entry.entry, getDictScoreForEntry(entry));
        }

        let sorted = mapKeys(scoreDict).sort((a, b) => scoreDict.get(b)! - scoreDict.get(a)!);
        for (let key of sorted) {
            ret.push(newEntries.get(key)!);
        }

        entryArray.current = ret;
    }

    function handleEntryClick(event: any) {
        let target = event.target;
        while (target.classList.length < 1 || target.classList[0] !== "entry-shell") {
            target = target.parentElement;
            if (!target) return;
        }

        if (entryArray.current.length === 0) return;

        let targetEntry = entries.get(target.dataset["entrykey"])!;
        let newEntries = [] as Entry[];
        if (lastSelectedKey && event.shiftKey) {
            let lastSelectedIndex = entryArray.current.findIndex(x => x.entry === lastSelectedKey);
            let targetIndex = entryArray.current.findIndex(x => x.entry === targetEntry.entry);
            let minIndex = Math.min(lastSelectedIndex, targetIndex);
            let maxIndex = Math.max(lastSelectedIndex, targetIndex);
            for (let i = minIndex; i <= maxIndex; i++ ) {
                let entry = entries.get(entryArray.current[i].entry)!;
                if (!entry.isSelected) {
                    entry.isSelected = true;
                    newEntries.push(entry);
                }
            }
        }
        else { 
            if (!event.ctrlKey) {
                for (let i = 0; i < entryArray.current.length; i++) {
                    let entry = entries.get(entryArray.current[i].entry)!;
                    if (entry.isSelected) {
                        entry.isSelected = false;
                        newEntries.push(entry);
                    }
                }
            }

            targetEntry.isSelected = !targetEntry.isSelected;
            newEntries.push(targetEntry);
            setLastSelectedKey(targetEntry.entry);
        }
        
        updateEntries(newEntries);
    }

    function handleDeselect(event: any) {
        let target = event.target;
        while (true) {
            if (!target) break;
            if (target.classList[0] === "entry-shell") return;
            target = target.parentElement;
        }

        let newEntries = [] as Entry[];
        mapValues(entries).forEach(entry => {
            if (entry.isSelected) {
                entry.isSelected = false;
                newEntries.push(entry);
            }
        });

        updateEntries(newEntries);
    }

    function updateEntries(newEntries: Entry[]) {
        let newEntriesMap = deepClone(entries) as Map<string, Entry>;

        for (let entry of newEntries) {
            let existingEntry = newEntriesMap.get(entry.entry);
            if (existingEntry?.isModified) entry.isModified = true;
            if (!existingEntry || wasEntryModified(existingEntry, entry)) {
                entry.isModified = true;
                props.entryChanged(entry);
            }

            newEntriesMap.set(entry.entry, entry);
        }

        setEntries(newEntriesMap);
        generateEntryArray(newEntriesMap);
    }

    function wasEntryModified(oldEntry: Entry, newEntry: Entry): boolean {
        return (
            oldEntry.displayText !== newEntry.displayText ||
            oldEntry.qualityScore !== newEntry.qualityScore ||
            oldEntry.obscurityScore !== newEntry.obscurityScore
        );
    }

    function handleKeyDown(event: any) {
        let key: string = event.key.toUpperCase();

        let selectedEntries = deepClone(mapValues(entries).filter(x => x.isSelected));
        if (selectedEntries.length === 0) return;

        updateEntriesWithKeyPress(selectedEntries, key);

        if (selectedEntries.length === 1 && key === 'R') {
            let newText = prompt("Enter new display text:", selectedEntries[0].displayText);
            if (!newText) return;
            let normalized = newText.replaceAll(/[^A-Za-z]/g, "");
            if (normalized.toUpperCase() !== selectedEntries[0].entry) return;
            selectedEntries[0].displayText = newText;
        }

        updateEntries(selectedEntries);
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
            let newEntry = {
                entry: normalized,
                displayText: newText,
                qualityScore: 3,
                obscurityScore: 3,
            } as Entry;

            updateEntries([newEntry]);
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
                {!isLoading && entryArray.current.map(entry => (
                    <EntryComp isFrontier={false} key={entry.entry} entry={entry}></EntryComp>
                ))}
            </div>
        </div>
    );
}

export default Explored;
