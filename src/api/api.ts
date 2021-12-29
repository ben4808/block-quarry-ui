import { mapValues } from "../lib/utils";
import { Entry } from "../models/Entry";
import { ModifiedEntry } from "../models/ModifiedEntry";

const baseUrl = "http://localhost:3001/api";

export async function exploredQuery(query: string): Promise<Entry[]> {
    try {
        let url = baseUrl + "/exploredQuery?query=" + query;
        let response = await fetch(url, {credentials: 'include'});
        let jsonResponse = await response.json();
        
        return jsonResponse as Entry[];
    }
    catch (e: any) {
        console.log("Error calling exploredQuery: " + e.message);
        throw e;
    }
}

export async function frontierQuery(query: string, dataSource: string, page?: number): Promise<Entry[]> {
    try {
        if (!page) page = 1;
        let url = `${baseUrl}/frontierQuery?query=${query}&dataSource=${dataSource}&page=${page}`;
        let response = await fetch(url, {credentials: 'include'});
        let jsonResponse = await response.json();
        
        return jsonResponse as Entry[];
    }
    catch (e: any) {
        console.log("Error calling frontierQuery: " + e.message);
        throw e;
    }
}

export async function discoverEntries(entries: ModifiedEntry[]): Promise<void> {
    try {
        console.log("Discover Entries...");

        let payloadMap = new Map<string, Entry>();
        for (let entry of entries) {
            payloadMap.set(entry.entry, {
                entry: entry.entry,
                displayText: entry.displayText,
                qualityScore: entry.qualityScore,
                obscurityScore: entry.obscurityScore,
            } as Entry);
        }

        let url = `${baseUrl}/discoverEntries`;
        let response = await fetch(url, {
            method: 'post',
            credentials: 'include',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(mapValues(payloadMap)),
        });

        await response.json();
    }
    catch (e: any) {
        console.log("Error calling frontierQuery: " + e.message);
        throw e;
    }
}

export async function getAllExplored(minQuality: number, minObscurity: number): Promise<Entry[]> {
    try {
        let url = `${baseUrl}/getAllExplored?minQuality=${minQuality}&minObscurity=${minObscurity}`;
        let response = await fetch(url, {credentials: 'include'});
        let jsonResponse = await response.json();
        
        return jsonResponse as Entry[];
    }
    catch (e: any) {
        console.log("Error calling frontierQuery: " + e.message);
        throw e;
    }
}
