"use strict"
var adsManager,
    adsLoader,
    adDisplayContainer,
    intervalTimer,
    videoContent,
    abp = false,
    adContainer,
    app,
    Container = PIXI.Container,
    Sprite = PIXI.Sprite,
    Loader = PIXI.loader,
    resources = PIXI.loader.resources,
    preloader,
    isvisible,
    preview,
    splash,
    soundBt,
    gameUI,
    game,
    share,
    stateWidth = 700,
    stateHeight = 525,
    elapsed,
    fullScreenDetect = false;
document.cancelFullScreen = document.cancelFullScreen || document.webkitCancelFullScreen || document.mozCancelFullScreen;
function extend(Child, Parent) {
    var F = function() { };
    F.prototype = Parent.prototype;
    Child.prototype = new F();
    Child.prototype.constructor = Child;
    Child.superclass = Parent.prototype;
}