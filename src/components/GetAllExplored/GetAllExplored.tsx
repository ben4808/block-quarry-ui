import { useEffect, useRef, useState } from "react";
import { getAllExplored } from "../../api/api";
import { getDictScoreForEntryAlt } from "../../lib/utils";
import { GetAllExploredProps } from "./GetAllExploredProps";

function GetAllExplored(props: GetAllExploredProps) {
    const status = useRef("Loading...");
    const [updateSemaphore, setUpdateSemaphore] = useState(0);

    useEffect(() => {
        loadData();
        // eslint-disable-next-line
    }, []);

    async function loadData() {
        let results = await getAllExplored(props.minQuality, props.minObscurity);

        let lines = [] as string[];
        for (let result of results) {
            if (props.outputFormat === "csv")
                lines.push(`${result.entry},"${result.displayText}",${result.qualityScore?.toFixed(2)},${result.obscurityScore?.toFixed(2)}`);
            else
                lines.push(`${result.entry};${getDictScoreForEntryAlt(result)}`);
        }

        let blob = new Blob([lines.join("\n")]);
        let filename = `AllExplored.${props.outputFormat}`;
        let file = new File([blob], filename);
        const url= window.URL.createObjectURL(file);
        let downloadLink = document.getElementById("download-link")!;
        downloadLink.setAttribute("href", url);
        downloadLink.setAttribute("download", filename);
        downloadLink.click();
        
        status.current = "Done.";
        setUpdateSemaphore(updateSemaphore + 1);
    }

    return (
        <>
            <a id="download-link" href="http://www.example.com" style={{display: "none"}}>stuff</a>
            <div>{status.current}</div>
        </>
    );
}

export default GetAllExplored;
