import React from 'react';
import './EntryComp.css';
import { EntryCompProps } from './EntryCompProps';

function EntryComp(props: EntryCompProps) {
    function getScoreColor(score: number): string {
        let indianRed = [0xcd, 0x5c, 0x5c];
        let mediumGreen = [0x3c, 0xb3, 0x71];
        let gray = [0x80, 0x80, 0x80];

        if (score < 1) return "#C80815";

        let ret = "#";
        if (score <= 3) {
            let pct = (score - 1) / 2;
            for (let i = 0; i < 3; i++) {
                let val = Math.floor(((1 - pct) * indianRed[i] + pct * gray[i])/2);
                ret += val.toString(16).padStart(2, '0');
            }
        }
        if (score > 3) {
            let pct = (score - 3) / 2;
            for (let i = 0; i < 3; i++) {
                let val = Math.floor(((1 - pct) * gray[i] + pct * mediumGreen[i])/2);
                ret += val.toString(16).padStart(2, '0');
            }
        }

        return ret;
    }

    let entry = props.entry;

    return (
        <div key={entry.entry} data-entrykey={entry.entry} className={"entry" + 
        (entry.isModified ? " entry-modified" : "") +
        (entry.isSelected ? " entry-selected" : "")} 
        style={{
            color: entry.isExplored ? getScoreColor(entry.qualityScore!) : undefined,
            borderColor: entry.isExplored ? getScoreColor(entry.obscurityScore!) : undefined,
        }}>
        {entry.displayText}
        {entry.dataSourceScore &&
            <div className="entry-data-score">{entry.dataSourceScore}</div>
        }
        </div>
    );
};

export default EntryComp;
