"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var path_1 = require("path");
var fs_extra_1 = require("fs-extra");
var rsync = require("rsyncwrapper");
var Utils_1 = require("./Utils");
exports.dir = function (p) { return p.endsWith('/') ? p : p + "/"; };
exports.syncAll = function (dest, source, exclude) {
    return new Promise(function (resolve, reject) {
        var options = {
            src: exports.dir(source),
            dest: exports.dir(dest),
            exclude: exclude,
            recursive: true
        };
        rsync(options, function (error) {
            if (error) {
                Utils_1.log.error(error);
                reject(error);
            }
            Utils_1.log.info("init " + source + " -> " + dest);
            resolve();
        });
    });
};
exports.syncFile = function (event, filename, source, rootPath) {
    var done = function (error) {
        if (error) {
            Utils_1.log.error(error);
            return;
        }
        Utils_1.log.info(event + " " + path_1.join(rootPath, filename));
    };
    if (event === 'unlink') {
        fs_extra_1.unlink(path_1.join(rootPath, filename), done);
    }
    else {
        fs_extra_1.copy(path_1.join(source, filename), path_1.join(rootPath, filename), done);
    }
};
//# sourceMappingURL=Sync.js.map