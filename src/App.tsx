import { useState } from 'react';
import './App.scss';
import Explored from './components/Explored/Explored';
import Frontier from './components/Frontier/Frontier';
import Menu from './components/Menu/Menu';

function App() {
    const [query, setQuery] = useState("");

    function onNewQuery(query: string) {
        setQuery(query);
    }

    return (
        <>
            <Menu onNewQuery={onNewQuery}></Menu>
            <Explored query={query}></Explored>
            <Frontier></Frontier>
        </>
    );
}

export default App;
