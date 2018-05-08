import * as Server from './src/Server';
import * as Sync from './src/Sync';
import * as Utils from './src/Utils';
declare const _default: {
    Server: typeof Server;
    Sync: typeof Sync;
    Utils: typeof Utils;
    start: (sync: {
        src: string;
        dest: string;
    }[], exclude?: string[] | undefined) => void;
};
export default _default;
