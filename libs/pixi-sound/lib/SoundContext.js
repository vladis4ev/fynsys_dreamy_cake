"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Filterable_1 = require("./Filterable");
var SoundContext = (function (_super) {
    __extends(SoundContext, _super);
    function SoundContext() {
        var _this = this;
        var ctx = new SoundContext.AudioContext();
        var gain = ctx.createGain();
        var compressor = ctx.createDynamicsCompressor();
        var analyser = ctx.createAnalyser();
        analyser.connect(gain);
        gain.connect(compressor);
        compressor.connect(ctx.destination);
        _this = _super.call(this, analyser, gain) || this;
        _this._ctx = ctx;
        _this._offlineCtx = new SoundContext.OfflineAudioContext(1, 2, ctx.sampleRate);
        _this._unlocked = false;
        _this.gain = gain;
        _this.compressor = compressor;
        _this.analyser = analyser;
        _this.volume = 1;
        _this.muted = false;
        _this.paused = false;
        if ("ontouchstart" in window && ctx.state !== "running") {
            _this._unlock();
            _this._unlock = _this._unlock.bind(_this);
            document.addEventListener("mousedown", _this._unlock, true);
            document.addEventListener("touchstart", _this._unlock, true);
            document.addEventListener("touchend", _this._unlock, true);
        }
        return _this;
    }
    SoundContext.prototype._unlock = function () {
        if (this._unlocked) {
            return;
        }
        this.playEmptySound();
        if (this._ctx.state === "running") {
            document.removeEventListener("mousedown", this._unlock, true);
            document.removeEventListener("touchend", this._unlock, true);
            document.removeEventListener("touchstart", this._unlock, true);
            this._unlocked = true;
        }
    };
    SoundContext.prototype.playEmptySound = function () {
        var source = this._ctx.createBufferSource();
        source.buffer = this._ctx.createBuffer(1, 1, 22050);
        source.connect(this._ctx.destination);
        source.start(0, 0, 0);
    };
    Object.defineProperty(SoundContext, "AudioContext", {
        get: function () {
            var win = window;
            return (win.AudioContext ||
                win.webkitAudioContext ||
                null);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(SoundContext, "OfflineAudioContext", {
        get: function () {
            var win = window;
            return (win.OfflineAudioContext ||
                win.webkitOfflineAudioContext ||
                null);
        },
        enumerable: true,
        configurable: true
    });
    SoundContext.prototype.destroy = function () {
        _super.prototype.destroy.call(this);
        var ctx = this._ctx;
        if (typeof ctx.close !== "undefined") {
            ctx.close();
        }
        this.analyser.disconnect();
        this.gain.disconnect();
        this.compressor.disconnect();
        this.gain = null;
        this.analyser = null;
        this.compressor = null;
        this._offlineCtx = null;
        this._ctx = null;
    };
    Object.defineProperty(SoundContext.prototype, "audioContext", {
        get: function () {
            return this._ctx;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(SoundContext.prototype, "offlineContext", {
        get: function () {
            return this._offlineCtx;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(SoundContext.prototype, "muted", {
        get: function () {
            return this._muted;
        },
        set: function (muted) {
            this._muted = !!muted;
            this.gain.gain.value = this._muted ? 0 : this._volume;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(SoundContext.prototype, "volume", {
        get: function () {
            return this._volume;
        },
        set: function (volume) {
            this._volume = volume;
            if (!this._muted) {
                this.gain.gain.value = this._volume;
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(SoundContext.prototype, "paused", {
        get: function () {
            return this._paused;
        },
        set: function (paused) {
            if (paused && this._ctx.state === "running") {
                this._ctx.suspend();
            }
            else if (!paused && this._ctx.state === "suspended") {
                this._ctx.resume();
            }
            this._paused = paused;
        },
        enumerable: true,
        configurable: true
    });
    SoundContext.prototype.toggleMute = function () {
        this.muted = !this.muted;
        return this._muted;
    };
    SoundContext.prototype.decode = function (arrayBuffer, callback) {
        this._offlineCtx.decodeAudioData(arrayBuffer, function (buffer) {
            callback(null, buffer);
        }, function () {
            callback(new Error("Unable to decode file"));
        });
    };
    return SoundContext;
}(Filterable_1.default));
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = SoundContext;
//# sourceMappingURL=SoundContext.js.map