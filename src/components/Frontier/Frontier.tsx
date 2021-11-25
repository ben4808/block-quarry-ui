import { useState } from 'react';
import { frontierQuery } from '../../api/api';
import { deepClone, updateEntriesWithKeyPress } from '../../lib/utils';
import { Entry } from '../../models/Entry';
import EntryComp from '../EntryComp/EntryComp';
import "../Explored/Explored.scss"
import "./Frontier.scss";
import { FrontierProps } from './FrontierProps';

function Frontier(props: FrontierProps) {
    const [entries, setEntries] = useState([] as Entry[]);
    const [isLoading, setIsLoading] = useState(false);
    const [page, setPage] = useState(1);

    const results_per_page = 100;

    async function loadData() {
        setIsLoading(true);
        let dataSource = (document.getElementById("data-source-select") as HTMLSelectElement)!.value;
        let results = await frontierQuery(props.query, dataSource, page);
        setEntries(results);
        setPage(1);
        setIsLoading(false);
    }

    function incrementPage() {
        if (entries.length < results_per_page)
            return;

        setPage(page + 1);
    }

    function decrementPage() {
        if (page <= 0)
            return;

        setPage(page - 1);
    }

    function handleEntryClick(event: any) {
        let target = event.target;
        while (target.classList.length < 1 || target.classList[0] !== "entry") {
            target = target.parentElement;
            if (!target) return;
        }
        
        let newEntries = deepClone(entries) as Entry[];
        let targetEntry = newEntries.find(x => x.entry === target.dataset["entrykey"])!;

        for (let entry of newEntries) entry.isSelected = false;
        targetEntry.isSelected = true;
        
        setEntries(newEntries);
    }

    function handleKeyDown(event: any) {
        let key: string = event.key.toUpperCase();

        let newEntries = deepClone(entries) as Entry[];

        let selectedEntry = newEntries.find(x => x.isSelected);
        if (!selectedEntry) return;

        updateEntriesWithKeyPress([selectedEntry], key);
        setEntries(newEntries);
        props.entryChanged(selectedEntry);
    }

    return (
        <div id="Frontier">
            <div id="topbar">
                <label htmlFor="data-source-select">Data Source</label>
                <select id="data-source-select">
                    <option value="Ginsberg">Ginsberg clues</option>
                    <option value="Podcasts" selected>Podcast database</option>
                </select>
                <div className="fill-list-button" onClick={loadData}>Load</div>

                <label id="page-label">Page</label>
                <div className="fill-list-button" onClick={decrementPage}>&lt;</div>
                <label id="page">{page}</label>
                <div className="fill-list-button" onClick={incrementPage}>&gt;</div>
            </div>
            <div onKeyDown={handleKeyDown} onClick={handleEntryClick} tabIndex={0}>
                {isLoading &&
                    <div>Loading...</div>
                }
                {entries.map(entry => (
                    <EntryComp isFrontier={true} key={entry.entry} entry={entry}></EntryComp>
                ))}
            </div>
        </div>
    );
}

export default Frontier;
