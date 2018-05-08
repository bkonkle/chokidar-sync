"use strict";
var __assign = (this && this.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
var path_1 = require("path");
var is_symlink_1 = require("is-symlink");
var fs_extra_1 = require("fs-extra");
var chokidar_1 = require("chokidar");
var Sync_1 = require("./Sync");
var createSyncMap = function (sync) { return sync.reduce(function (map, config) {
    var relative = path_1.resolve(process.cwd(), config.src);
    return __assign({}, map, (_a = {}, _a[relative] = {
        src: config.src,
        dest: path_1.resolve(process.cwd(), config.dest),
    }, _a));
    var _a;
}, {}); };
exports.watchPaths = function (sync, exclude) {
    var syncMap = createSyncMap(sync);
    // The relative paths to each sync source
    var paths = Object.keys(syncMap);
    var watcher = chokidar_1.watch(paths, {
        ignoreInitial: true,
        ignored: exclude
    });
    watcher.on('all', function (event, changedPath) {
        var sourcePath = path_1.resolve(path_1.dirname(changedPath));
        var sourceFile = path_1.basename(changedPath);
        var result = paths.reduce(function (memo, key) {
            if (memo)
                return memo;
            if (Sync_1.dir(sourcePath).startsWith(Sync_1.dir(key))) {
                return { root: key, name: path_1.basename(key), dest: syncMap[key].dest };
            }
            return memo;
        }, null);
        if (result) {
            var root = result.root, dest = result.dest, name = result.name;
            var relativePath = path_1.relative(path_1.resolve(root), sourcePath);
            var targetPath = path_1.join(dest, name, relativePath);
            Sync_1.syncFile(event, sourceFile, sourcePath, targetPath);
        }
    });
};
/**
 * Runs the sync operation once for all files. Used at the beginning of the
 * service.
 */
exports.once = function (sync, exclude) {
    var syncMap = createSyncMap(sync);
    // The relative paths to each sync source
    var paths = Object.keys(syncMap);
    // initial sync
    return Promise.all(paths.map(function (key) {
        if (is_symlink_1.sync(key))
            fs_extra_1.removeSync(key);
        return Sync_1.syncAll(syncMap[key].dest, key, exclude);
    }));
};
/*
 * Starts the file watching service. Syncs the whole directories when the
 * service is started, and as files are changed, copies individual file
 * modifications one by one
 */
exports.start = function (sync, exclude) {
    return exports.once(sync, exclude)
        .then(function () { return exports.watchPaths(sync, exclude); })
        .catch(function (error) { throw error; });
};
//# sourceMappingURL=Server.js.map