export interface Entry {
    entry: string;
    displayText: string;
    qualityScore?: number;
    obscurityScore?: number;
    dataSourceScore?: number;
    isExplored?: boolean;
    isModified?: boolean;
    isSelected?: boolean;
    tags?: Map<string, boolean>;
}