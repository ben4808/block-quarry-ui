import { useEffect, useRef, useState } from 'react';
import { discoverEntries } from './api/api';
import './App.scss';
import Explored from './components/Explored/Explored';
import Frontier from './components/Frontier/Frontier';
import Menu from './components/Menu/Menu';
import { deepClone, mapValues, setUserId, useInterval } from './lib/utils';
import { Entry } from './models/Entry';
import { ModifiedEntry } from './models/ModifiedEntry';

function App() {
    const [query, setQuery] = useState("");
    const [exploredEntries, setExploredEntries] = useState(new Map<string, Entry>());
    let editBuffer = useRef([] as ModifiedEntry[]);

    useEffect(() => {
        setUserId();
    }, []);

    function onNewQuery(query: string) {
        setQuery(query);
    }

    function onUpdateExploredEntries(newEntries: Map<string, Entry>) {
        setExploredEntries(newEntries);
    }

    function entriesModified(modifiedEntries: ModifiedEntry[]) {
        let newEntriesMap = deepClone(exploredEntries) as Map<string, Entry>;

        for (let entry of mapValues(newEntriesMap)) {
            entry.isSelected = false;
        }

        for (let modifiedEntry of modifiedEntries) {
            let existingEntry = newEntriesMap.get(modifiedEntry.entry);
            if (!existingEntry) {
                existingEntry = {
                    entry: modifiedEntry.entry,
                    displayText: modifiedEntry.displayText!,
                    qualityScore: 3,
                    obscurityScore: 3,
                    isExplored: true,
                } as Entry;
            }
            existingEntry.displayText = modifiedEntry.displayText || existingEntry.displayText;
            existingEntry.qualityScore = modifiedEntry.qualityScore || existingEntry.qualityScore;
            existingEntry.obscurityScore = modifiedEntry.obscurityScore || existingEntry.obscurityScore;
            existingEntry.isModified = true;
            existingEntry.isSelected = true;
            editBuffer.current.push(modifiedEntry);

            newEntriesMap.set(existingEntry.entry, existingEntry);
        }

        setExploredEntries(newEntriesMap);
    }

    function wasEntryModified(oldEntry: Entry, newEntry: Entry): boolean {
        return (
            oldEntry.displayText !== newEntry.displayText ||
            oldEntry.qualityScore !== newEntry.qualityScore ||
            oldEntry.obscurityScore !== newEntry.obscurityScore
        );
    }

    async function sendEdits() {
        if (editBuffer.current.length === 0) return;

        await discoverEntries(editBuffer.current);
        editBuffer.current = [];
    }

    useInterval(sendEdits, 5000);

    return (
        <>
            <Menu onNewQuery={onNewQuery}></Menu>
            <Explored query={query} exploredEntries={exploredEntries} 
                entriesModified={entriesModified} updateExploredEntries={onUpdateExploredEntries}></Explored>
            <Frontier query={query} exploredEntries={exploredEntries} 
                entriesModified={entriesModified} updateExploredEntries={onUpdateExploredEntries}></Frontier>
        </>
    );
}

export default App;
