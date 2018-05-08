import * as Server from './Server';
import * as Sync from './Sync';
import * as Utils from './Utils';
export { Server, Sync, Utils };
declare const _default: {
    start: (sync: {
        src: string;
        dest: string;
    }[], exclude?: string[] | undefined) => void;
};
export default _default;
