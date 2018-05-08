export interface SyncMap {
    [relative: string]: {
        src: string;
        dest: string;
    };
}
export declare const watchPaths: (paths: string[], syncMap: SyncMap, exclude?: string[] | undefined) => void;
export declare const start: (sync: {
    src: string;
    dest: string;
}[], exclude?: string[] | undefined) => void;
