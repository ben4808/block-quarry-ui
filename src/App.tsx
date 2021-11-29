import { useEffect, useState } from 'react';
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
    let editBuffer = [] as Entry[];

    useEffect(() => {
        setUserId();
    }, []);

    function onNewQuery(query: string) {
        setQuery(query);
    }

    function entriesModified(newEntries: Entry[], initialLoad?: boolean) {
        let newEntriesMap = deepClone(exploredEntries) as Map<string, Entry>;

        for (let entry of newEntries) {
            let existingEntry = newEntriesMap.get(entry.entry);
            if (existingEntry?.isModified) entry.isModified = true;
            if (!initialLoad && (!existingEntry || wasEntryModified(existingEntry, entry))) {
                entry.isModified = true;
                editBuffer.push(entry);
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
        if (editBuffer.length === 0) return;

        let userId = getUserId();
        await discoverEntries(userId, editBuffer);
        editBuffer = [];
    }

    useInterval(sendEdits, 5000);

    return (
        <>
            <Menu onNewQuery={onNewQuery}></Menu>
            <Explored query={query} exploredEntries={exploredEntries} entriesModified={entriesModified}></Explored>
            <Frontier query={query} exploredEntries={exploredEntries} entriesModified={entriesModified}></Frontier>
        </>
    );
}

export default App;
