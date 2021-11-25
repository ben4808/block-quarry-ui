import { useEffect, useRef } from "react";
import { Entry } from "../models/Entry";
import { Cookies } from 'react-cookie';

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

export function updateEntriesWithKeyPress(selectedEntries: Entry[], key: string) {
    if (key === "W") {
        for (let entry of selectedEntries)
            entry.qualityScore = 5;
    }
    if (key === "A") {
        for (let entry of selectedEntries)
            entry.qualityScore = 2;
    }
    if (key === "S") {
        for (let entry of selectedEntries)
            entry.qualityScore = 3;
    }
    if (key === "D") {
        for (let entry of selectedEntries)
            entry.qualityScore = 4;
    }
    if (key === "Z") {
        for (let entry of selectedEntries)
            entry.qualityScore = 1;
    }
    if (key === "X") {
        for (let entry of selectedEntries)
            entry.qualityScore = 0;
    }
    if (key === "0") {
        for (let entry of selectedEntries)
            entry.obscurityScore = 0;
    }
    if (key === "1") {
        for (let entry of selectedEntries)
            entry.obscurityScore = 1;
    }
    if (key === "2") {
        for (let entry of selectedEntries)
            entry.obscurityScore = 2;
    }
    if (key === "3") {
        for (let entry of selectedEntries)
            entry.obscurityScore = 3;
    }
    if (key === "4") {
        for (let entry of selectedEntries)
            entry.obscurityScore = 4;
    }
    if (key === "5") {
        for (let entry of selectedEntries)
            entry.obscurityScore = 5;
    }
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
    cookies.set(cookieKey, userId);
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
