import { Entry } from "../models/Entry";

const baseUrl = "http://localhost:3001";

export async function discoveredQuery(query: string): Promise<Entry[]> {
    try {
        let url = baseUrl + "/exploredQuery?query=" + query;
        let response = await fetch(url);
        let jsonResponse = await response.json();
        
        return jsonResponse as Entry[];
    }
    catch (e: any) {
        console.log("Error calling discoveredQuery: " + e.message);
        throw e;
    }
}

export async function frontierQuery(query: string, dataSource: string, page?: number): Promise<Entry[]> {
    try {
        if (!page) page = 1;
        let url = `${baseUrl}/frontierQuery?query=${query}&dataSource=${dataSource}&page=${page}`;
        let response = await fetch(url);
        let jsonResponse = await response.json();
        
        return jsonResponse as Entry[];
    }
    catch (e: any) {
        console.log("Error calling frontierQuery: " + e.message);
        throw e;
    }
}

export async function discoverEntries(username: string, entries: Entry[]): Promise<void> {
    try {
        let url = `${baseUrl}/discoverEntries`;
        let response = await fetch(url, {
            method: 'post',
            body: JSON.stringify(entries),
        });

        await response.json();
    }
    catch (e: any) {
        console.log("Error calling frontierQuery: " + e.message);
        throw e;
    }
}
