import './EntryComp.scss';
import { EntryCompProps } from './EntryCompProps';

function EntryComp(props: EntryCompProps) {
    function getScoreColor(score: number, isBorderColor: boolean): string {
        let backGray = [0x50, 0x50, 0x50];
        let backRed = [0x65, 0x2d, 0x36];
        let backGreen = [0x2f, 0x73, 0x4c];

        let borderGray = [0x77, 0x77, 0x77];
        let borderRed = [0x95, 0x13, 0x1c];
        let borderGreen = [0x2d, 0x81, 0x50];

        let gray = isBorderColor ? borderGray : backGray;
        let red = isBorderColor ? borderRed : backRed;
        let green = isBorderColor ? borderGreen : backGreen;

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

    return (
        <div data-entrykey={props.entry.entry} className={"entry-shell" + 
        (props.isFrontier ? " entry-shell-frontier" : "") +
        (props.entry.isSelected ? " entry-shell-selected" : "")}>
            {!props.isFrontier && 
                <div className={"modified-bar" +
                (props.entry.isModified ? " modified-bar-green" : "")}></div>
            }
            <div className={"entry" + 
                (props.isFrontier ? " frontier-entry" : "") +
                (props.isFrontier ? (
                    props.entry.views! >= 100 ? " views-100" :
                    props.entry.views! >= 25 ? " views-25" :
                    props.entry.views! >= 5 ? " views-5" : ""
                ) : "") }
                style={{
                    backgroundColor: props.entry.isExplored ? getScoreColor(props.entry.qualityScore!, false) : "#383838",
                    borderColor: props.entry.isExplored ? getScoreColor(props.entry.obscurityScore!, true) : "#444",
                    color: props.entry.isExplored ? "white" : "#ccc",
                }}>
                {props.entry.displayText}
            </div>
            {!props.isFrontier && 
                <div className={"bfast-bar" +
                (props.entry.breakfastTestFailure ? " bfast-bar-red" : "")}></div>
            }
        </div>
    );
};

export default EntryComp;
