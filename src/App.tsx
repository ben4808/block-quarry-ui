import { useEffect, useRef, useState } from 'react';
import { discoverEntries } from './api/api';
import './App.scss';
import Explored from './components/Explored/Explored';
import Frontier from './components/Frontier/Frontier';
import Menu from './components/Menu/Menu';
import { deepClone, getUserId, setUserId, useInterval } from './lib/utils';
import { Entry } from './models/Entry';

function App() {
    const [query, setQuery] = useState("");
    const [exploredEntries, setExploredEntries] = useState(new Map<string, Entry>());
    let editBuffer = useRef([] as Entry[]);

    useEffect(() => {
        setUserId();
    }, []);

    function onNewQuery(query: string) {
        setQuery(query);
    }

    function onUpdateExploredEntries(newEntries: Map<string, Entry>) {
        setExploredEntries(newEntries);
    }

    function entriesModified(newEntries: Entry[]) {
        let newEntriesMap = deepClone(exploredEntries) as Map<string, Entry>;

        for (let entry of newEntries) {
            let existingEntry = newEntriesMap.get(entry.entry);
            if (existingEntry?.isModified) entry.isModified = true;
            if (!existingEntry || wasEntryModified(existingEntry, entry)) {
                entry.isModified = true;
                editBuffer.current.push(entry);
            }

            newEntriesMap.set(entry.entry, entry);
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

        let userId = getUserId();
        await discoverEntries(userId, editBuffer.current);
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
