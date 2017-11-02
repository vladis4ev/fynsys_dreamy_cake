function Story(){
    this.cont = new createjs.Container();
    this.cont.mouseEnabled = false;
    this.cont.visible = false;
    return this;
}
extend(Story, State);
Story.prototype.init = function(){
    this.mainTL = new createjs.Timeline();
    this.cont.addChildAt(new createjs.Bitmap(preloader.res[("gameDef_bg")]), 0);
    this.animBg = new Animation.initArmature("podiumTextureImg", "podiumTextureData", "podiumSkeletonData", this.cont);
    this[("start_" + this.determLang())].visible = false;
    this[("start_" + this.determLang())] = redefRegPoint(this[("start_" + this.determLang())]);
    this[("start_" + this.determLang())].on("click", startGame);
    this[("talk_" + this.determLang())].visible = false;
    this[("talk_" + this.determLang())] = redefRegPoint(this[("talk_" + this.determLang())], "right_bottom");

    this.fynsy = new Animation.initArmature("fynsyTextureImg", "fynsyTextureData", "fynsySkeletonData", this.cont);
    this.fynsy.getDisplay().x = 590;
    this.fynsy.getDisplay().y = 518;
    this.fynsy.animation.gotoAndPlay(this.fynsy.animation._animationList[0]);

    this.cont.setChildIndex(this.pr_cont, this.cont.numChildren-1);
    this.cont.setChildIndex(this.fynsy.getDisplay(), this.cont.numChildren-1);
    this.cont.setChildIndex(this[("talk_" + this.determLang())], this.cont.numChildren-1);
    this.cont.setChildIndex(this[("start_" + this.determLang())], this.cont.numChildren-1);
}
Story.prototype.play = function(){
    this.cont.visible = true;
    this.cont.mouseEnabled = true;
    this.rotatePrincess();
    this.animBg.animation.play();
}
var mainTL;
State.prototype.rotatePrincess = function(){
    var y = 400;
    var h = 60;
    var ym = y + h / 2;
    var max = 6//this.pr_cont.numChildren+1;
    for(var i = 1; i < max; i++){
        this[("p"+i)] = redefRegPoint(this[("p"+i)], "bottom");
        this[("p"+i)].scaleX = this[("p"+i)].scaleY = .95;
        this[("p"+i)].x = 0;
        this[("p"+i)].y = ym;
        this[("p"+i)].alpha = 0;
        this[("p"+i)].name = "p"+i;
    }
    var _this = this;
    var i = 1;
    var numPrin = 5;
    this.timLoop = 6000//12000
    mainTL = new createjs.Timeline();
    //this.mainTL.loop = true;
    this.looping.bind(_this)(i);
    var runWaltz = setInterval(function(){
        if(i===numPrin){
            clearInterval(runWaltz);
            if(_this instanceof Story){
                _this[("talk_" + _this.determLang())].visible = true;
                TweenMax.from(_this[("talk_" + _this.determLang())],.75, {scaleX:.1, scaleY:.1, ease:Elastic.easeOut.config(1, 0.3), onComplete: function(p){
                    TweenMax.to(p, 1, {y: p.y-10, repeat:-1, yoyo:true, ease:Linear.easeNone});
                    _this[("start_" + _this.determLang())].visible = true;
                    TweenMax.from(_this[("start_" + _this.determLang())],.75, {delay: 2, scaleX:.01, scaleY:.01, ease:Elastic.easeOut.config(1, 0.3)});
                }, onCompleteParams:[_this[("talk_" + _this.determLang())]]});
            }
        } else {
            i += 1;
            _this.looping.bind(_this)(i);
        }
    }, this.timLoop/numPrin);
};
State.prototype.looping = function(i){
    var x = 90;
    var y = 400;
    var w = gameWidth - 180;
    var h = 60;
    var k = 0.5522848;
    var ox = (w / 2) * k;
    var oy = (h / 2) * k;
    var xe = x + w;
    var ye = y + h;
    var xm = x + w / 2;
    var ym = y + h / 2;
    var max = this.pr_cont.numChildren+1;
    var _this = this;
    var _p = _this[("p" + i)];
    _p.alpha = 1;
    _p.x = x;
    //var curPr = _this[("p" + i)];
    _p.parent.setChildIndex(_p, 0);
    //createjs.Tween.get(curPr).to({x: x, alpha: 1}, 250).call(function(_p){////!!!!!!!!!!!! straying time
        //_this[("tlPr" + i)] = new createjs.Timeline();
        //_this[("tlPr" + i)].loop = true;
    //mainTL = new createjs.Timeline();
    //mainTL.loop = true;
        /*this.*/mainTL.addTween(
            createjs.Tween.get(_p)
                .to({guide: {path: [x, ym, x, ym - oy, xm - ox, y, xm, y, xm + ox, y, xe, ym - oy, xe, ym, xe, ym + oy, xm + ox, ye, xm, ye, xm - ox, ye, x, ym + oy, x, ym]}}, _this.timLoop)
        );
        /*this.*/mainTL.addTween(
            createjs.Tween.get(_p)
                .to({scaleX:.85, scaleY:.85}, _this.timLoop/4)
                .to({scaleX: 1, scaleY:1}, _this.timLoop/4-1)
                .to({scaleX: -.95}, 1)
                .to({scaleX: -1.05, scaleY:1.05}, _this.timLoop/4).call(function(_p){
                    _p.parent.setChildIndex(_p, _p.parent.numChildren-1);
                    if(_this instanceof Final/*Story*/ /*&& "tlPr5" in _this*/){
                         /*_this.*/mainTL.paused = true;
                         /*_this.*/mainTL.setPaused(true);
                         TweenMax.to(_p, .5, {scaleX:-1.25, scaleY:1.25, onComplete: function(){
                             game.prArr.forEach(function(item, i, arr) {
                                 if(_p.getChildAt(0).name === item){
                                     _this[("prAnim" + item)].animation.gotoAndPlay(_this[("prAnim" + item)].animation._animationList[0], 0, -1, -1);
                                     _this[("prAnim" + item)].addEventListener(dragonBones.AnimationEvent.COMPLETE, function(e){
                                         _this[("prAnim" + item)].removeEventListener(dragonBones.AnimationEvent.COMPLETE);
                                         TweenMax.to(_p, .5, {scaleX:-1.05, scaleY:1.05, onComplete: function(){
                                             /*_this.*/mainTL.paused = false;
                                             /*_this.*/mainTL.setPaused(false);
                                         }});
                                     }, _this[("prAnim" + item)]);
                                     return;
                                 }
                             });
                         }});
                     }
                }, [_p])
                .to({scaleX: -.95, scaleY:1}, _this.timLoop/4).call(function(_p){
                    _p.parent.setChildIndex(_p, 0);
                }, [_p])
        );
    //}, [curPr]);
}
State.prototype.stop = function(){
    this.pr_cont.visible = false;
    createjs.Tween.removeAllTweens();
}
