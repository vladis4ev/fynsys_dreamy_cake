"use strict";
var LoaderMiddleware_1 = require("./LoaderMiddleware");
var SoundLibrary_1 = require("./SoundLibrary");
require("./deprecations");
var sound = new SoundLibrary_1.default();
if (global.PIXI === undefined) {
    throw new Error("pixi.js is required");
}
if (PIXI.loaders !== undefined) {
    LoaderMiddleware_1.install();
}
Object.defineProperty(PIXI, "sound", {
    get: function () { return sound; },
});
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = sound;
//# sourceMappingURL=index.js.map