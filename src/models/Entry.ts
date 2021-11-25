export interface Entry {
    entry: string;
    displayText: string;
    qualityScore?: number;
    obscurityScore?: number;
    dataSourceScore?: number;
    views?: number;
    isExplored?: boolean;
    isModified?: boolean;
    isSelected?: boolean;
    tags?: Map<string, boolean>;
}
