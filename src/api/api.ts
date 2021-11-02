import { Entry } from "../models/Entry";

const asteroids = ["Ceres", "Pallas", "Juno", "Vesta", "Astraea", "Hebe", "Iris", "Flora", "Metis", "Hygiea"];

export async function discoveredQuery(query: string): Promise<Entry[]> {
    return asteroids.map((x, i) => ({
        entry: x.toUpperCase(),
        displayText: x,
        qualityScore: 5 - ((i+1) / 2),
        obscurityScore: (i+1) / 2,
        isExplored: true,
    }) as Entry);
}

export async function frontierQuery(query: string, dataSource: string): Promise<Entry[]> {
    return asteroids.map((x, i) => ({
        entry: x.toUpperCase(),
        displayText: x,
        dataSourceScore: i,
    }) as Entry);
}

export async function discoverEntries(username: string, entries: Entry[]): Promise<void> {
    
}
