import { Entry } from "../../models/Entry";
import { ModifiedEntry } from "../../models/ModifiedEntry";

export interface ExploredProps {
    query: string;
    exploredEntries: Map<string, Entry>;

    entriesModified: (newEntries: ModifiedEntry[]) => void;
    updateExploredEntries: (newEntries: Map<string, Entry>) => void;
}
