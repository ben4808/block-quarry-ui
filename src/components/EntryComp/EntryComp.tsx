import './EntryComp.scss';
import { EntryCompProps } from './EntryCompProps';

function EntryComp(props: EntryCompProps) {
    function getScoreColor(score: number, lightColor: boolean): string {
        let lightGray = [0xee, 0xee, 0xee];
        let lightRed = [0xfc, 0xbf, 0xc3];
        let lightGreen = [0xbd, 0xf0, 0xd2];

        let darkGray = [0x80, 0x80, 0x80];
        let darkRed = [0xc8, 0x08, 0x15];
        let darkGreen = [0x27, 0xae, 0x60];

        let gray = lightColor ? lightGray : darkGray;
        let red = lightColor ? lightRed : darkRed;
        let green = lightColor ? lightGreen : darkGreen;

        let ret = "#";
        if (score <= 3) {
            let pct = Math.max(0, (score - 1) / 2);
            for (let i = 0; i < 3; i++) {
                let val = Math.floor((1 - pct) * red[i] + pct * gray[i]);
                ret += val.toString(16).padStart(2, '0');
            }
        }
        if (score > 3) {
            let pct = (score - 3) / 2;
            for (let i = 0; i < 3; i++) {
                let val = Math.floor((1 - pct) * gray[i] + pct * green[i]);
                ret += val.toString(16).padStart(2, '0');
            }
        }

        return ret;
    }

    let entry = props.entry;

    return (
        <div data-entrykey={entry.entry} className={"entry" + 
            (props.isFrontier ? "frontier-entry" : "") +
            (props.isFrontier ? (
                props.entry.views! > 100 ? "views-100 " :
                props.entry.views! > 25 ? "views-25 " :
                props.entry.views! > 5 ? "views-5" :
                props.entry.views! > 0 ? "views-1" : ""
            ) : "") +
            (entry.isSelected ? " entry-selected" : "")}>
            <div className="entry-modified-bar"
                style={{backgroundColor: entry.isModified ? "green" : "transparent"}}>
            </div>
            <div style={{
                    backgroundColor: entry.isExplored ? getScoreColor(entry.qualityScore!, true) : undefined,
                    borderColor: entry.isExplored ? getScoreColor(entry.obscurityScore!, false) : undefined,
                    borderWidth: entry.isExplored ? 1.5 : undefined,
                }}>
                {entry.displayText}
                {entry.dataSourceScore &&
                    <div className="entry-data-score">{entry.dataSourceScore}</div>
                }
            </div>
        </div>
    );
};

export default EntryComp;
