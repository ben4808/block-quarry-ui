import './EntryComp.scss';
import { EntryCompProps } from './EntryCompProps';

function EntryComp(props: EntryCompProps) {
    function getScoreColor(score: number, lightColor: boolean): string {
        let lightGray = [0xf5, 0xf5, 0xf5];
        let lightRed = [0xfa, 0x8e, 0x95];
        let lightGreen = [0x93, 0xe7, 0xb6];

        let darkGray = [0xa0, 0xa0, 0xa0];
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
                    props.entry.views! > 100 ? " views-100" :
                    props.entry.views! > 25 ? " views-25" :
                    props.entry.views! > 5 ? " views-5" :
                    props.entry.views! > 0 ? " views-1" : ""
                ) : "") }
                style={{
                    backgroundColor: props.entry.isExplored ? getScoreColor(props.entry.qualityScore!, true) : undefined,
                    borderColor: props.entry.isExplored ? getScoreColor(props.entry.obscurityScore!, false) : undefined,
                }}>
                {props.entry.displayText}
            </div>
        </div>
    );
};

export default EntryComp;
