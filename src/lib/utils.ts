import { useEffect, useRef } from "react";
import { Entry } from "../models/Entry";
import { Cookies } from 'react-cookie';
import { getEndingWordsToAvoid, getStartingWordsToAvoid } from "./wordsToAvoid";
import { ModifiedEntry } from "../models/ModifiedEntry";

export const cookieKey = "block_quarry_user";

// https://stackoverflow.com/questions/38416020/deep-copy-in-es6-using-the-spread-syntax
export function deepClone(obj: any): any {
    if(typeof obj !== 'object' || obj === null) {
        return obj;
    }
  
    if(obj instanceof Date) {
        return new Date(obj.getTime());
    }
  
    if(obj instanceof Map) {
        return new Map(Array.from(obj.entries()));
    }
  
    if(obj instanceof Array) {
        return obj.reduce((arr, item, i) => {
            arr[i] = deepClone(item);
            return arr;
        }, []);
    }
  
    if(obj instanceof Object) {
        return Object.keys(obj).reduce((newObj: any, key) => {
            newObj[key] = deepClone(obj[key]);
            return newObj;
        }, {})
    }
}
  
export function mapKeys<TKey, TVal>(map: Map<TKey, TVal>): TKey[] {
    return Array.from(map.keys()) || [];
}

export function mapValues<TKey, TVal>(map: Map<TKey, TVal>): TVal[] {
    return Array.from(map.values()) || [];
}

export function getDictScoreForEntry(entry: Entry): number {
    if (!entry.qualityScore || !entry.obscurityScore) return 0;
    let quality = entry.qualityScore ? (entry.qualityScore - 1)*25 : 25;
    let obscurity = entry.obscurityScore ? (entry.obscurityScore - 1)*25 : 25;
    let finalScore = (2*quality + obscurity) / 3;
    return Math.round(finalScore);
}

export function getDictScoreForEntryAlt(entry: Entry): number {
    if (!entry.qualityScore || !entry.obscurityScore) return 0;

    let qualityPart = entry.qualityScore < 2 ? 10 : 
        entry.qualityScore < 3 ? 30 :
        entry.qualityScore < 4 ? 50 : 
        entry.qualityScore < 5 ? 70 : 90;

    let obscurityPart = entry.obscurityScore < 2 ? -2 : 
        entry.obscurityScore < 3 ? -1 :
        entry.obscurityScore < 4 ? 0 : 
        entry.obscurityScore < 5 ? 1 : 2;

    return qualityPart + obscurityPart + (entry.breakfastTestFailure ? -5 : 0);
}

export function updateEntriesWithKeyPress(selectedEntries: Entry[], key: string): ModifiedEntry[] {
    let modifiedEntries = [] as ModifiedEntry[];

    for (let entry of selectedEntries) {
        entry.isExplored = true;
        let modifiedEntry = {
            entry: entry.entry,
        } as ModifiedEntry;

        let qualityMappings = {"Z": 1, "A": 2, "S": 3, "D": 4, "W": 5};
        let obscurityMappings = {"1": 1, "2": 2, "3": 3, "4": 4, "5": 5};

        for (let [k, v] of Object.entries(qualityMappings)) {
            if (k === key && entry.qualityScore !== v) {
                entry.qualityScore = v;
                modifiedEntry.qualityScore = v;
            }
        }

        for (let [k, v] of Object.entries(obscurityMappings)) {
            if (k === key && entry.obscurityScore !== v) {
                entry.obscurityScore = v;
                modifiedEntry.obscurityScore = v;
            }
        }

        if (key === "X") {
            entry.breakfastTestFailure = !entry.breakfastTestFailure;
            modifiedEntry.breakfastTestFailure = !modifiedEntry.breakfastTestFailure;
        }

        if (selectedEntries.length === 1 && key === 'R') {
            let newText = prompt("Enter new display text:", entry.displayText);
            if (newText) {
                let normalized = newText.replaceAll(/[^A-Za-z]/g, "");
                if (normalized.toUpperCase() === entry.entry && newText !== entry.displayText) {
                    if (entry.dataSourceScore !== undefined)
                        entry.displayText = newText;
                    modifiedEntry.displayText = newText;
                }
            }
        }

        if (modifiedEntry.displayText || modifiedEntry.qualityScore || modifiedEntry.obscurityScore
            || modifiedEntry.breakfastTestFailure !== undefined)
            modifiedEntries.push(modifiedEntry);
    }

    return modifiedEntries;
}

export function useInterval(callback: () => void, delay: number) {
    const savedCallback = useRef(callback);
  
    // Remember the latest callback.
    useEffect(() => {
        savedCallback.current = callback;
    }, [callback]);
  
    // Set up the interval.
    useEffect(() => {
        function tick() {
            savedCallback.current();
        }
        if (delay !== null) {
            let id = setInterval(tick, delay);
            return () => clearInterval(id);
        }
    }, [delay]);
}

export function getUserId(): string {
    let cookies = new Cookies();
    return cookies.get(cookieKey);
}

export function setUserId(id?: string) {
    let existingId = getUserId();
    let userId = id || existingId || generateId();

    let cookies = new Cookies();
    let oneYear = new Date(new Date().setFullYear(new Date().getFullYear() + 1));
    cookies.set(cookieKey, userId, {expires: oneYear, sameSite: 'none', secure: true});
}

export function generateId(): string {
    let charPool = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789_-';
    let id = "";
    for (let i=0; i<11; i++) {
        id += charPool[getRandomInt(64)];
    }
    return id;
}

export function getRandomInt(max: number) {
    return Math.floor(Math.random() * max);
}

export function calculateFrontierPriority(entry: Entry): number {
    let words = entry.displayText.toLowerCase().split(" ").map(x => x.replaceAll(/[^a-z]/g, ""));

    let startEndScore = 100;
    let startingWordsToAvoid = getStartingWordsToAvoid();
    if (startingWordsToAvoid.has(words[0]))
        startEndScore = Math.min(startEndScore, startingWordsToAvoid.get(words[0])!);
    let endingWordsToAvoid = getEndingWordsToAvoid();
    if (endingWordsToAvoid.has(words[words.length - 1]))
        startEndScore = Math.min(startEndScore, endingWordsToAvoid.get(words[words.length - 1])!);

    let wordCountScore = Math.max(0, 110 - words.length*10);

    let viewsScore = 100;
    let views = entry.views || 0;
    if (views >= 5) viewsScore = 66;
    if (views >= 25) viewsScore = 33;
    if (views >= 100) viewsScore = 0;

    return (startEndScore + wordCountScore) * (viewsScore/100);
}

export function getQueryParam(key: string, defaultValue?: string): string {
    let match = document.location.href.match(`[?&]${key}=([^&]+)`);
    let result = defaultValue || "";
    if (match)
        result = match[1];

    return result;
}
