import { useEffect, useState } from 'react';
import { discoverEntries } from './api/api';
import './App.scss';
import Explored from './components/Explored/Explored';
import Frontier from './components/Frontier/Frontier';
import Menu from './components/Menu/Menu';
import { getUserId, setUserId, useInterval } from './lib/utils';
import { Entry } from './models/Entry';

function App() {
    const [query, setQuery] = useState("");
    let editBuffer = [] as Entry[];

    useEffect(() => {
        setUserId();
    }, []);

    function onNewQuery(query: string) {
        setQuery(query);
    }

    function entryChanged(newEntry: Entry) {
        editBuffer.push(newEntry);
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
            <Explored query={query} entryChanged={entryChanged}></Explored>
            <Frontier query={query} entryChanged={entryChanged}></Frontier>
        </>
    );
}

export default App;
