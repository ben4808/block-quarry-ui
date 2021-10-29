import { Entry } from "./Entry";

export interface GlobalsObj {
    query?: string;

    exploredEntries: Entry[];
    frontierEntries: Entry[];
}