"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Filterable_1 = require("./Filterable");
var SoundNodes = (function (_super) {
    __extends(SoundNodes, _super);
    function SoundNodes(context) {
        var _this = this;
        var audioContext = context.audioContext;
        var bufferSource = audioContext.createBufferSource();
        var script = audioContext.createScriptProcessor(SoundNodes.BUFFER_SIZE);
        var gain = audioContext.createGain();
        var analyser = audioContext.createAnalyser();
        bufferSource.connect(analyser);
        analyser.connect(gain);
        gain.connect(context.destination);
        script.connect(context.destination);
        _this = _super.call(this, analyser, gain) || this;
        _this.context = context;
        _this.bufferSource = bufferSource;
        _this.script = script;
        _this.gain = gain;
        _this.analyser = analyser;
        return _this;
    }
    SoundNodes.prototype.destroy = function () {
        _super.prototype.destroy.call(this);
        this.bufferSource.disconnect();
        this.script.disconnect();
        this.gain.disconnect();
        this.analyser.disconnect();
        this.bufferSource = null;
        this.script = null;
        this.gain = null;
        this.analyser = null;
        this.context = null;
    };
    SoundNodes.prototype.cloneBufferSource = function () {
        var orig = this.bufferSource;
        var clone = this.context.audioContext.createBufferSource();
        clone.buffer = orig.buffer;
        clone.playbackRate.value = orig.playbackRate.value;
        clone.loop = orig.loop;
        clone.connect(this.destination);
        return clone;
    };
    return SoundNodes;
}(Filterable_1.default));
SoundNodes.BUFFER_SIZE = 256;
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = SoundNodes;
//# sourceMappingURL=SoundNodes.js.map