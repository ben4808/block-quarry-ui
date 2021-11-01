import { useEffect, useState } from 'react';
import { discoveredQuery } from '../../api/api';
import { deepClone, getDictScoreForEntry, mapKeys, mapValues } from '../../lib/utils';
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

    let entryArray = generateEntryArray();

    useEffect(() => {
        async function doDiscoveredQuery() {
            setIsLoading(true);
            let results = await discoveredQuery(props.query);
            let newEntries = new Map<string, Entry>();
            for (let result of results) {
                newEntries.set(result.entry, result);
            }
            setEntries(newEntries);
            setIsLoading(false);
        }

        doDiscoveredQuery();
    }, [props.query]);

    function generateEntryArray(): Entry[] {
        let ret = [] as Entry[];
        if (entries.size === 0) return ret;

        let scoreDict = new Map<string, number>();
        for (let key of mapKeys(entries)) {
            let entry = entries.get(key)!;
            scoreDict.set(entry.entry, getDictScoreForEntry(entry));
        }

        let sorted = mapKeys(scoreDict).sort((a, b) => scoreDict.get(b)! - scoreDict.get(a)!);
        for (let key of sorted) {
            ret.push(entries.get(key)!);
        }

        return ret;
    }

    function handleEntryClick(event: any) {
        let target = event.target;
        while (target.classList.length < 1 || target.classList[0] !== "entry") {
            target = target.parentElement;
            if (!target) return;
        }

        if (entryArray.length === 0) return;

        let targetEntry = entries.get(target.dataset["entrykey"])!;
        let newEntries = deepClone(entries) as Map<string, Entry>;

        if (lastSelectedKey && event.shiftKey) {
            let lastSelectedIndex = entryArray.findIndex(x => x.entry === lastSelectedKey);
            let targetIndex = entryArray.findIndex(x => x.entry === targetEntry.entry);
            let minIndex = Math.min(lastSelectedIndex, targetIndex);
            let maxIndex = Math.max(lastSelectedIndex, targetIndex);
            for (let i = minIndex; i <= maxIndex; i++ ) {
                let key = entryArray[i].entry;
                newEntries.get(key)!.isSelected = true;
            }
        }
        else if (!event.ctrlKey) {
            for (let i = 0; i < entryArray.length; i++) {
                newEntries.get(entryArray[i].entry)!.isSelected = false;
            }
        }
        else {
            newEntries.get(targetEntry.entry)!.isSelected = !newEntries.get(targetEntry.entry)!.isSelected;
            setLastSelectedKey(targetEntry.entry);
        }
        
        setEntries(newEntries);
    }

    function handleKeyDown(event: any) {
        let key: string = event.key.toUpperCase();

        let newEntries = deepClone(entries) as Map<string, Entry>;

        let selectedEntries = mapValues(newEntries).filter(x => x.isSelected);
        if (selectedEntries.length === 0) return;

        if (key === "W") {
            for (let entry of selectedEntries)
                entry.qualityScore = 5;
        }
        if (key === "A") {
            for (let entry of selectedEntries)
                entry.qualityScore = 2;
        }
        if (key === "S") {
            for (let entry of selectedEntries)
                entry.qualityScore = 3;
        }
        if (key === "D") {
            for (let entry of selectedEntries)
                entry.qualityScore = 4;
        }
        if (key === "Z") {
            for (let entry of selectedEntries)
                entry.qualityScore = 1;
        }
        if (key === "X") {
            for (let entry of selectedEntries)
                entry.qualityScore = 0;
        }
        if (key === "0") {
            for (let entry of selectedEntries)
                entry.obscurityScore = 0;
        }
        if (key === "1") {
            for (let entry of selectedEntries)
                entry.obscurityScore = 1;
        }
        if (key === "2") {
            for (let entry of selectedEntries)
                entry.obscurityScore = 2;
        }
        if (key === "3") {
            for (let entry of selectedEntries)
                entry.obscurityScore = 3;
        }
        if (key === "4") {
            for (let entry of selectedEntries)
                entry.obscurityScore = 4;
        }
        if (key === "5") {
            for (let entry of selectedEntries)
                entry.obscurityScore = 5;
        }

        setEntries(newEntries);
    }

    function handleOnlyChangesToggle() {
        setExportOnlyChanges(!exportOnlyChanges);
    }

    function handleOnlySelectedToggle() {
        setExportOnlySelected(!exportOnlySelected);
    }

    function exportEntries() {
        let lines = [] as string[];

        entryArray.forEach(entry => {
            if (exportOnlyChanges && !entry.isModified) return;
            if (exportOnlySelected && !entry.isSelected) return;

            lines.push(`${entry.entry};${getDictScoreForEntry(entry)}`);
        }); 
        
        window.open()!.document.write(`<pre>${lines.join("\n")}</pre>`);
    }

    return (
        <div id="Explored">
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
            <div onKeyDown={handleKeyDown} onClick={handleEntryClick} tabIndex={0}>
                {isLoading &&
                    <div>Loading...</div>
                }
                {entryArray.map(entry => (
                    <EntryComp key={entry.entry} entry={entry}></EntryComp>
                ))}
            </div>
        </div>
    );
}

export default Explored;
