export declare const dir: (p: any) => any;
export declare const syncAll: (dest: string, source: string, exclude?: string[] | undefined) => Promise<{}>;
export declare const syncFile: (event: string, filename: string, source: string, rootPath: string) => void;
