import { useEffect, useRef, useState } from "react";
import { getAllExplored } from "../../api/api";
import { getDictScoreForEntry, getDictScoreForEntryAlt } from "../../lib/utils";
import { GetAllExploredProps } from "./GetAllExploredProps";

function GetAllExplored(props: GetAllExploredProps) {
    const data = useRef("");
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
                lines.push(`${result.entry},"${result.displayText}",${getDictScoreForEntry(result)}`);
            else
                lines.push(`${result.entry};${getDictScoreForEntryAlt(result)}`);
        }
        
        data.current = lines.join("\n");
        setUpdateSemaphore(updateSemaphore + 1);
    }

    return (
        <pre>
            {data.current}
        </pre>
    );
}

export default GetAllExplored;
