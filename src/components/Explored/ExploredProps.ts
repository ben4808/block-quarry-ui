import { Entry } from "../../models/Entry";

export interface ExploredProps {
    query: string;
    exploredEntries: Map<string, Entry>;

    entriesModified: (newEntries: Entry[], initialLoad?: boolean) => void;
}
