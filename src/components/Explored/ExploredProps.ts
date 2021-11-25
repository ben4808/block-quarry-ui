import { Entry } from "../../models/Entry";

export interface ExploredProps {
    query: string;

    entryChanged: (newEntry: Entry) => void;
}
