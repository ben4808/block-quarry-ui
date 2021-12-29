import { Entry } from "../../models/Entry";
import { ModifiedEntry } from "../../models/ModifiedEntry";

export interface FrontierProps {
    query: string;
    exploredEntries: Map<string, Entry>;

    entriesModified: (modifiedEntries: ModifiedEntry[]) => void;
    entriesSelected: (newSelectedKeys: string[]) => void;
}
