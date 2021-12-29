import { discoverEntries } from "../../api/api";
import { Entry } from "../../models/Entry";

function AddBulkEntries() {
    
    async function submitClicked() {
        let data = (document.getElementById("theTextarea") as any)?.value;

        let lines = data.split("\n");
        let entries = [] as Entry[];
        for (let line of lines) {
            let entry = parseLine(line);
            if (entry)
                entries.push(entry);
        }

        await discoverEntries(entries);
    }

    function parseLine(line: string): Entry | undefined {
        let normalized = "";
        let displayText = "";
        let score = 3;

        line = line.trim();
  
        let regex1 = line.match(/^"?(.+?)"?$/);
        let regex2_noScore = line.match(/^([a-zA-Z]+?)[;,]"?(.+?)"?$/);
        let regex2_score = line.match(/^"?(.+?)\?[;,]([0-9]+)$/);
        let regex3 = line.match(/^([a-zA-Z]+?)[;,]"?(.+?)"?[;,]([0-9]+)$/);

        if (regex3) {
            normalized = normalize(regex3[1]);
            displayText = regex3[2];
            score = getQualityScore(+regex3[3]);
        }
        else if(regex2_score) {
            let token1 = regex2_score[1];
            normalized = normalize(token1);
            displayText = token1;
            score = getQualityScore(+regex2_score[2]);
        }
        else if(regex2_noScore) {
            normalized = normalize(regex2_noScore[1]);
            displayText = regex2_noScore[2];
        }
        else if(regex1) {
            let token1 = regex1[1];
            normalized = normalize(token1);
            displayText = token1;
        }
        else {
            return undefined;
        }

        return {
            entry: normalized,
            displayText: displayText,
            qualityScore: score,
            obscurityScore: 3,
        } as Entry;
    }

    function normalize(input: string): string {
        return input.toUpperCase().replaceAll(/[^A-Z]/g, "");
    }

    function getQualityScore(inputScore: number): number {
        return inputScore <= 25 ? 1 :
            inputScore <= 40 ? 2 :
            inputScore <= 50 ? 3 :
            inputScore <= 60 ? 4 : 5;
    }

    return (
        <div style={{margin:'25px'}}>
            <textarea id="theTextarea" style={{height: '300px', width: '300px'}}>

            </textarea>
            <br />
            <button style={{padding: '5px 20px'}} onClick={submitClicked}>Submit</button>
        </div>
    );
}

export default AddBulkEntries;
