import { useState } from 'react';
import { frontierQuery } from '../../api/api';
import { deepClone, updateEntriesWithKeyPress } from '../../lib/utils';
import { Entry } from '../../models/Entry';
import EntryComp from '../EntryComp/EntryComp';
import "../Explored/Explored.scss"
import "./Frontier.scss";
import { FrontierProps } from './FrontierProps';

function Frontier(props: FrontierProps) {
    const [frontierEntries, setFrontierEntries] = useState([] as Entry[]);
    const [isLoading, setIsLoading] = useState(false);
    const [page, setPage] = useState(1);

    const results_per_page = 100;

    async function loadData() {
        setIsLoading(true);
        let dataSource = (document.getElementById("data-source-select") as HTMLSelectElement)!.value;
        let results = await frontierQuery(props.query, dataSource, page);

        for (let entry of results) {
            if (props.exploredEntries.has(entry.entry)) {
                let exploredEntry = props.exploredEntries.get(entry.entry)!;
                entry.isExplored = true;
                entry.qualityScore = exploredEntry.qualityScore;
                entry.obscurityScore = exploredEntry.obscurityScore;
            }
        }

        setFrontierEntries(results);
        setIsLoading(false);
    }

    function incrementPage() {
        if (frontierEntries.length < results_per_page)
            return;

        setPage(page + 1);
        setTimeout(() => { loadData(); }, 500);
    }

    function resetPage() {
        setPage(1);
        setTimeout(() => { loadData(); }, 500);
    }

    function decrementPage() {
        if (page <= 1)
            return;

        setPage(page - 1);
        setTimeout(() => { loadData(); }, 500);
    }

    function handleEntryClick(event: any) {
        let target = event.target;
        while (target.classList.length < 1 || target.classList[0] !== "entry-shell") {
            target = target.parentElement;
            if (!target) return;
        }
        
        let newFrontierEntries = deepClone(frontierEntries) as Entry[];
        let targetEntry = newFrontierEntries.find(x => x.entry === target.dataset["entrykey"])!;

        for (let entry of newFrontierEntries) entry.isSelected = false;
        targetEntry.isSelected = true;
        
        setFrontierEntries(newFrontierEntries);
    }

    function handleKeyDown(event: any) {
        let key: string = event.key.toUpperCase();

        let newFrontierEntries = deepClone(frontierEntries) as Entry[];
        let selectedEntry = newFrontierEntries.find(x => x.isSelected);
        if (!selectedEntry) return;

        selectedEntry.isSelected = false;
        updateEntriesWithKeyPress([selectedEntry], key);
        setFrontierEntries(newFrontierEntries);
        props.entriesModified([selectedEntry]);
    }

    return (
        <div id="Frontier">
            <div id="topbar">
                <label id="data-source-label" htmlFor="data-source-select">Data Source</label>
                <select id="data-source-select" defaultValue="Podcasts">
                    <option value="Ginsberg">Ginsberg clues</option>
                    <option value="Podcasts">Podcast database</option>
                </select>
                <div className="frontier-button" onClick={loadData}>Load</div>

                <label id="page-label">Page</label>
                <div className="frontier-button" onClick={resetPage}>|&lt;</div>
                <div className="frontier-button" onClick={decrementPage}>&lt;</div>
                <label id="page">{page}</label>
                <div className="frontier-button" onClick={incrementPage}>&gt;</div>
            </div>
            <div onKeyDown={handleKeyDown} onClick={handleEntryClick} tabIndex={0}>
                {isLoading &&
                    <div>Loading...</div>
                }
                {!isLoading && frontierEntries.map(entry => (
                    <EntryComp isFrontier={true} key={entry.entry} entry={entry}></EntryComp>
                ))}
            </div>
        </div>
    );
}

export default Frontier;
