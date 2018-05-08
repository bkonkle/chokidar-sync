"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var chalk_1 = require("chalk");
exports.log = {
    info: function (message) {
        console.log(chalk_1.default.cyan('[chokidar-sync]'), message);
    },
    error: function (message) {
        console.log(chalk_1.default.red('[chokidar-sync]'), message);
    }
};
//# sourceMappingURL=Utils.js.map