"use strict";
var uuid = require("uuid/v4");
var index_1 = require("./index");
var Sound_1 = require("./Sound");
var SoundUtils = (function () {
    function SoundUtils() {
    }
    SoundUtils.sineTone = function (hertz, seconds) {
        if (hertz === void 0) { hertz = 200; }
        if (seconds === void 0) { seconds = 1; }
        var soundContext = index_1.default.context;
        var soundInstance = new Sound_1.default(soundContext, {
            singleInstance: true,
        });
        var nChannels = 1;
        var sampleRate = 48000;
        var amplitude = 2;
        var buffer = soundContext.audioContext.createBuffer(nChannels, seconds * sampleRate, sampleRate);
        var fArray = buffer.getChannelData(0);
        for (var i = 0; i < fArray.length; i++) {
            var time = i / buffer.sampleRate;
            var angle = hertz * time * Math.PI;
            fArray[i] = Math.sin(angle) * amplitude;
        }
        soundInstance.buffer = buffer;
        soundInstance.isLoaded = true;
        return soundInstance;
    };
    SoundUtils.render = function (sound, options) {
        options = Object.assign({
            width: 512,
            height: 128,
            fill: "black",
        }, options || {});
        console.assert(!!sound.buffer, "No buffer found, load first");
        var canvas = document.createElement("canvas");
        canvas.width = options.width;
        canvas.height = options.height;
        var context = canvas.getContext("2d");
        context.fillStyle = options.fill;
        var data = sound.buffer.getChannelData(0);
        var step = Math.ceil(data.length / options.width);
        var amp = options.height / 2;
        for (var i = 0; i < options.width; i++) {
            var min = 1.0;
            var max = -1.0;
            for (var j = 0; j < step; j++) {
                var datum = data[(i * step) + j];
                if (datum < min) {
                    min = datum;
                }
                if (datum > max) {
                    max = datum;
                }
            }
            context.fillRect(i, (1 + min) * amp, 1, Math.max(1, (max - min) * amp));
        }
        return PIXI.BaseTexture.fromCanvas(canvas);
    };
    SoundUtils.playOnce = function (src, callback) {
        var alias = uuid();
        index_1.default.add(alias, {
            src: src,
            preload: true,
            autoPlay: true,
            loaded: function (err) {
                if (err) {
                    console.error(err);
                    index_1.default.remove(alias);
                    if (callback) {
                        callback(err);
                    }
                }
            },
            complete: function () {
                index_1.default.remove(alias);
                if (callback) {
                    callback(null);
                }
            },
        });
        return alias;
    };
    return SoundUtils;
}());
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = SoundUtils;
//# sourceMappingURL=SoundUtils.js.map