import { useEffect, useRef, useState } from 'react';
import { discoverEntries, exploredQuery } from './api/api';
import './App.scss';
import Explored from './components/Explored/Explored';
import Frontier from './components/Frontier/Frontier';
import Menu from './components/Menu/Menu';
import { deepClone, mapValues, setUserId, useInterval } from './lib/utils';
import { Entry } from './models/Entry';
import { ModifiedEntry } from './models/ModifiedEntry';

function App() {
    const [query, setQuery] = useState("");
    const [exploredLoading, setExploredLoading] = useState(false);
    const [exploredEntries, setExploredEntries] = useState(new Map<string, Entry>());
    let editBuffer = useRef([] as ModifiedEntry[]);

    useEffect(() => {
        setUserId();
    }, []);

    async function onNewQuery(query: string) {
        if (query.length === 0) return;

        setQuery(query);
        setExploredLoading(true);

        let results = await exploredQuery(query);
        let newEntries = new Map<string, Entry>();
        for (let result of results) {
            result.isExplored = true;
            newEntries.set(result.entry, result);
        }
        setExploredEntries(newEntries);

        setExploredLoading(false);
    }

    function entriesSelected(newSelectedKeys: string[]) {
        let newEntriesMap = deepClone(exploredEntries) as Map<string, Entry>;

        for (let entry of mapValues(newEntriesMap)) {
            entry.isSelected = newSelectedKeys.includes(entry.entry);
        }

        setExploredEntries(newEntriesMap);
    }

    function entriesModified(modifiedEntries: ModifiedEntry[]) {
        let newEntriesMap = deepClone(exploredEntries) as Map<string, Entry>;

        for (let modifiedEntry of modifiedEntries) {
            let existingBufferEntry = editBuffer.current.find(x => x.entry === modifiedEntry.entry);
            if (existingBufferEntry) {
                modifiedEntry.displayText = modifiedEntry.displayText || existingBufferEntry.displayText;
                modifiedEntry.qualityScore = modifiedEntry.qualityScore || existingBufferEntry.qualityScore;
                modifiedEntry.obscurityScore = modifiedEntry.obscurityScore || existingBufferEntry.obscurityScore;
            }

            let existingEntry = newEntriesMap.get(modifiedEntry.entry);
            if (!existingEntry) {
                existingEntry = {
                    entry: modifiedEntry.entry,
                    displayText: modifiedEntry.displayText!,
                    qualityScore: 3,
                    obscurityScore: 3,
                    isExplored: true,
                } as Entry;
                newEntriesMap.set(existingEntry.entry, existingEntry);

                modifiedEntry.qualityScore = modifiedEntry.qualityScore || 3;
                modifiedEntry.obscurityScore = modifiedEntry.obscurityScore || 3;
            }
            existingEntry.displayText = modifiedEntry.displayText || existingEntry.displayText;
            existingEntry.qualityScore = modifiedEntry.qualityScore || existingEntry.qualityScore;
            existingEntry.obscurityScore = modifiedEntry.obscurityScore || existingEntry.obscurityScore;
            existingEntry.isModified = true;
            editBuffer.current.push(modifiedEntry);
        }

        setExploredEntries(newEntriesMap);
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
            <Explored exploredEntries={exploredEntries} exploredLoading={exploredLoading}
                entriesModified={entriesModified} entriesSelected={entriesSelected}></Explored>
            <Frontier query={query} exploredEntries={exploredEntries} 
                entriesModified={entriesModified} entriesSelected={entriesSelected}></Frontier>
        </>
    );
}

export default App;
