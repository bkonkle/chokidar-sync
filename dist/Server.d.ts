export interface SyncMap {
    [relative: string]: {
        src: string;
        dest: string;
    };
}
export declare const watchPaths: (sync: {
    src: string;
    dest: string;
}[], exclude?: string[] | undefined) => void;
/**
 * Runs the sync operation once for all files. Used at the beginning of the
 * service.
 */
export declare const once: (sync: {
    src: string;
    dest: string;
}[], exclude?: string[] | undefined) => Promise<{}[]>;
export declare const start: (sync: {
    src: string;
    dest: string;
}[], exclude?: string[] | undefined) => Promise<void>;
