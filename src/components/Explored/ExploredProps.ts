import { Entry } from "../../models/Entry";
import { ModifiedEntry } from "../../models/ModifiedEntry";

export interface ExploredProps {
    exploredEntries: Map<string, Entry>;
    exploredLoading: boolean;

    entriesModified: (modifiedEntries: ModifiedEntry[]) => void;
    entriesSelected: (newSelectedKeys: string[]) => void;
}
