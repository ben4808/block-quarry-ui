import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import 'bootstrap/dist/css/bootstrap.css';
import GetAllExplored from './components/GetAllExplored/GetAllExplored';
import { deepClone, getQueryParam, mapKeys } from './lib/utils';
import AddBulkEntries from './components/AddBulkEntries/AddBulkEntries';

computeAnswer();

function computeAnswer() {
    let states = [{
        currentPoint: [0, 0],
        edges: new Map<string, boolean>(),
        badEdges: new Map<string, boolean>(),
    }];

    let state: any;

    function goalEdgesFromPoint(x: number, y:number) {
        if (x === 1 && y === 1) return 1;
        if (x === 8 && y === 5) return 1;
        return 2;
    }

    function edgeKey(x1: number, y1: number, x2: number, y2: number) {
        return `(${x1},${y1});(${x2},${y2})`;
    }

    function getEdgeCombosForPoint(state: any, x: number, y: number) {
        let currentEdges = [];
        let newEdges = [];

        let nEdge = y > 0 ? edgeKey(x, y-1, x, y) : undefined;
        let sEdge = y < 6 ? edgeKey(x, y, x, y+1) : undefined;
        let wEdge = x > 0 ? edgeKey(x-1, y, x, y) : undefined;
        let eEdge = x < 10 ? edgeKey(x, y, x+1, y) : undefined;
        for (let edgeKey of [nEdge, sEdge, wEdge, eEdge]) {
            if (edgeKey === undefined || state.badEdges.has(edgeKey)) continue;
            if (state.edges.has(edgeKey)) {
                currentEdges.push(edgeKey);
            }
            else {
                newEdges.push(edgeKey);
            }
        }

        if (goalEdgesFromPoint(state.currentPoint[0], state.currentPoint[1]) === 1) {
            if (currentEdges.length > 1)
                return [];
            else if (currentEdges.length === 1)
                return [[...currentEdges, ...newEdges]];
            else {
                let combos = [];
                for (let i = 0; i < newEdges.length; i++) {
                    let newCombo = [newEdges[i], undefined];
                    for (let j=0; j < newEdges.length; j++) {
                        if (j !== i) newCombo.push(newEdges[j]);
                    }
                    combos.push(newCombo);
                }
                return combos;
            }
        }

        if (currentEdges.length > 2)
            return [];
        else if (currentEdges.length === 2)
            return [[...currentEdges, ...newEdges]];
        else if (currentEdges.length === 1) {
            let combos = [];
            for (let i = 0; i < newEdges.length; i++) {
                let newCombo = [currentEdges[0], newEdges[i]];
                for (let j=0; j < newEdges.length; j++) {
                    if (j !== i) newCombo.push(newEdges[j]);
                }
                combos.push(newCombo);
            }
            return combos;
        }
        else {
            let combos = [];
            for (let i = 0; i < newEdges.length-1; i++) {
                for (let j = i+1; j < newEdges.length; j++) {
                    let newCombo = [newEdges[i], newEdges[j]];
                    for (let k = 0; k < newEdges.length; k++) {
                        if (k !== i && k !== j) newCombo.push(newEdges[k]);
                    }
                    combos.push(newCombo);
                }
            }
            return combos;
        }
    }

    states[0].edges.set(edgeKey(9,0,9,1), true);
    states[0].edges.set(edgeKey(2,1,3,1), true);
    states[0].edges.set(edgeKey(2,1,2,2), true);
    states[0].edges.set(edgeKey(5,1,5,2), true);
    states[0].edges.set(edgeKey(6,1,6,2), true);
    states[0].edges.set(edgeKey(7,2,7,3), true);
    states[0].edges.set(edgeKey(7,2,8,2), true);
    states[0].edges.set(edgeKey(10,2,10,3), true);
    states[0].edges.set(edgeKey(9,3,10,3), true);
    states[0].edges.set(edgeKey(1,3,1,4), true);
    states[0].edges.set(edgeKey(2,5,2,6), true);
    states[0].edges.set(edgeKey(2,5,3,5), true);
    states[0].edges.set(edgeKey(5,5,6,5), true);
    states[0].edges.set(edgeKey(5,5,6,6), true);

    states[0].badEdges.set(edgeKey(1,0,1,1), true);
    states[0].badEdges.set(edgeKey(3,2,4,2), true);
    states[0].badEdges.set(edgeKey(5,4,6,4), true);
    states[0].badEdges.set(edgeKey(7,5,7,6), true);
    states[0].badEdges.set(edgeKey(8,5,9,5), true);
    states[0].badEdges.set(edgeKey(9,3,9,4), true);
    states[0].badEdges.set(edgeKey(9,1,10,1), true);
    states[0].badEdges.set(edgeKey(3,1,4,1), true);
    //states[0].badEdges.set(edgeKey(0,2,1,2), true);
    states[0].badEdges.set(edgeKey(0,1,0,2), true);

    while(true) {
        state = states.pop()!;
        console.log(`(${state.currentPoint[0]},${state.currentPoint[1]}): ${states.length + 1}`);
        if (state.currentPoint[0] == 9 && state.currentPoint[1] == 0) {
            let a = 5;
        }
        if (!state || (state.currentPoint[0] === 10 && state.currentPoint[1] === 6)) break;
        let combos = getEdgeCombosForPoint(state, state.currentPoint[0], state.currentPoint[1]);

        for (let combo of combos) {
            if (combo!.length === 0) continue;
            let goodEdges = combo[1] ? [combo[0], combo[1]] : [combo[0]];
            let badEdges = combo.slice(2);

            let newState = deepClone(state);
            newState.currentPoint[0]++;
            if (newState.currentPoint[0] > 10) {
                newState.currentPoint[0] = 0;
                newState.currentPoint[1]++;
            }
            for (let edge of goodEdges) {
                newState.edges.set(edge, true);
            }
            for (let edge of badEdges) {
                newState.badEdges.set(edge, true);
            }
            states.push(newState);
        }
    }

    for (let edge of mapKeys(state.edges)) {
        console.log(edge);
    }

    return true;
}

if (document.location.href.match("getAllExplored")) {
    let minQuality = +getQueryParam("minQuality") || 0;
    let minObscurity = +getQueryParam("minObscurity") || 0;
    let outputFormat = getQueryParam("outputFormat") || "dict";

    ReactDOM.render(
        <React.StrictMode>
            <GetAllExplored minQuality={minQuality} minObscurity={minObscurity} outputFormat={outputFormat} />
        </React.StrictMode>,
        document.getElementById('root')
    );
}
else if (document.location.href.match("addBulkEntries")) {
    ReactDOM.render(
        <React.StrictMode>
            <AddBulkEntries />
        </React.StrictMode>,
        document.getElementById('root')
    );
}
else {
    ReactDOM.render(
        <React.StrictMode>
            <App />
        </React.StrictMode>,
        document.getElementById('root')
    );
}
