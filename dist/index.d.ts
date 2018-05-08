import * as Server from './src/Server';
import * as Sync from './src/Sync';
import * as Utils from './src/Utils';
export { Server, Sync, Utils };
declare const _default: {
    start: (sync: {
        src: string;
        dest: string;
    }[], exclude?: string[] | undefined) => void;
};
export default _default;
