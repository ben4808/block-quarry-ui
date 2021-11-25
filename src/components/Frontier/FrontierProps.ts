import { Entry } from "../../models/Entry";

export interface FrontierProps {
    query: string;

    entryChanged: (newEntry: Entry) => void;
}
