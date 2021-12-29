import { useEffect, useState } from 'react';
import { frontierQuery } from '../../api/api';
import { calculateFrontierPriority, deepClone, mapValues, updateEntriesWithKeyPress } from '../../lib/utils';
import { Entry } from '../../models/Entry';
import EntryComp from '../EntryComp/EntryComp';
import "../Explored/Explored.scss"
import "./Frontier.scss";
import { FrontierProps } from './FrontierProps';

function Frontier(props: FrontierProps) {
    const [frontierEntries, setFrontierEntries] = useState([] as Entry[]);
    const [isLoading, setIsLoading] = useState(false);
    const [page, setPage] = useState(1);
    const [shouldLoadData, setShouldLoadData] = useState(false);

    const results_per_page = 100;

    useEffect(() => {
        setFrontierEntries([] as Entry[]);
        setIsLoading(false);
        setPage(1);
        // eslint-disable-next-line
    }, [props.query]);

    useEffect(() => {
        let newFrontierEntries = deepClone(frontierEntries) as Entry[];
        syncExploredEntries(newFrontierEntries);
        // eslint-disable-next-line
    }, [props.exploredEntries]);

    useEffect(() => {
        if (shouldLoadData) {
            loadData();
        }
        // eslint-disable-next-line
    }, [page]);

    async function loadData() {
        setIsLoading(true);
        let dataSource = (document.getElementById("data-source-select") as HTMLSelectElement)!.value;
        let results = await frontierQuery(props.query, dataSource, page);

        for (let result of results) {
            result.frontierPriority = calculateFrontierPriority(result);
        }
        results = results.sort((a, b) => b.frontierPriority! !== a.frontierPriority! ?
            b.frontierPriority! - a.frontierPriority! :
            b.entry < a.entry ? 1 : -1);

        syncExploredEntries(results);

        setIsLoading(false);
        setShouldLoadData(false);
    }

    function syncExploredEntries(newFrontierEntries: Entry[]) {
        for (let entry of newFrontierEntries) {
            if (props.exploredEntries.has(entry.entry)) {
                let exploredEntry = props.exploredEntries.get(entry.entry)!;
                entry.isExplored = true;
                entry.qualityScore = exploredEntry.qualityScore;
                entry.obscurityScore = exploredEntry.obscurityScore;
                entry.isSelected = exploredEntry.isSelected;
            }
        }

        setFrontierEntries(newFrontierEntries);
    }

    function incrementPage() {
        if (frontierEntries.length < results_per_page)
            return;

        setPage(page + 1);
        setShouldLoadData(true);
    }

    function resetPage(reload: boolean) {
        setPage(1);
        setShouldLoadData(reload);
    }

    function decrementPage() {
        if (page <= 1)
            return;

        setPage(page - 1);
        setShouldLoadData(true);
    }

    function handleEntryClick(event: any) {
        let target = event.target;
        while (target.classList.length < 1 || target.classList[0] !== "entry-shell") {
            target = target.parentElement;
            if (!target) return;
        }

        let targetKey = target.dataset["entrykey"];
        let newFrontierEntries = deepClone(frontierEntries) as Entry[];
        for (let entry of newFrontierEntries) {
            entry.isSelected = entry.entry === targetKey;
        }
        setFrontierEntries(newFrontierEntries);

        props.entriesSelected([targetKey]);
    }

    function handleKeyDown(event: any) {
        let key: string = event.key.toUpperCase();

        let newFrontierEntries = deepClone(frontierEntries) as Entry[];
        let selectedEntry = newFrontierEntries.find(x => x.isSelected);
        if (!selectedEntry) return;

        let modifiedEntries = updateEntriesWithKeyPress([selectedEntry], key);

        for (let mod of modifiedEntries) {
            if (!props.exploredEntries.has(mod.entry)) {
                mod.displayText = selectedEntry.displayText;
            }
        }

        setFrontierEntries(newFrontierEntries);
        props.entriesModified(modifiedEntries);
    }

    let entryBatches = [] as Entry[][];
    let i = 0;
    let entriesPerBatch = 23;
    while(i < frontierEntries.length) {
        let newBatch = [] as Entry[];
        for (let j = 0; j < entriesPerBatch; j++) {
            if ((i+j) >= frontierEntries.length) break;
            newBatch.push(frontierEntries[i+j]);
        }
        i += entriesPerBatch;
        entryBatches.push(newBatch);
    }

    return (
        <div id="Frontier">
            <div id="topbar">
                <label id="data-source-label" htmlFor="data-source-select">Data Source</label>
                <select id="data-source-select" defaultValue="Podcasts" onChange={() => resetPage(false)}>
                    <option value="Ginsberg">Ginsberg clues</option>
                    <option value="Podcasts">Podcast database</option>
                    <option value="Nutrimatic">Nutrimatic</option>
                    <option value="OneLook">OneLook</option>
                    <option value="Newspapers">Newspapers</option>
                    <option value="Husic">Spread the Word List</option>
                </select>
                <div className="frontier-button" onClick={loadData}>Load</div>

                <label id="page-label">Page</label>
                <div className="frontier-button" onClick={() => resetPage(true)}>|&lt;</div>
                <div className="frontier-button" onClick={decrementPage}>&lt;</div>
                <label id="page">{page}</label>
                <div className="frontier-button" onClick={incrementPage}>&gt;</div>
            </div>
            <div onKeyDown={handleKeyDown} onClick={handleEntryClick} tabIndex={0}>
                {isLoading &&
                    <div>Loading...</div>
                }
                {!isLoading && entryBatches.map((batch, i) => (
                    <div className="entry-batch" key={`batch${i}`}>
                        {batch.map(entry => (
                            <EntryComp isFrontier={true} key={entry.entry} entry={entry}></EntryComp>
                        ))}
                    </div>
                ))}
            </div>
        </div>
    );
}

export default Frontier;
