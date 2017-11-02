function GameUI() {
    this.cont = new Container();
    this.cont.interactiveChildren = false;
    this.cont.visible = false;
    this.hotCont = new Container();
    this.hotCont.visible = false;
    this.lastBt = null;
    this.cont.addChild(this.hotCont);
    return this;
}
extend(GameUI, State);
GameUI.prototype.init = function(){
    var posHot = "horiz"//"upright" or "horiz"
    var _this = this;
    this.b = new PIXI.filters.BlurFilter();
    this.animLogo = new PIXI.spine.Spine(resources.fynsyLogo.spineData);
    this.animLogo.state.timeScale = .75;
    this.animLogo.state.setAnimation(0, 'animation', true);
    this.animLogo.position.set(this.animLogo.width *.65, this.animLogo.height*.8);
    this.animLogo.interactive = true;
    this.animLogo.buttonMode = true;
    this.animLogo.name = "in_game_logo";
    var logoGlow = new PIXI.Graphics();
    logoGlow.beginFill(0xffffff,1);
    logoGlow.drawCircle(0, 0, this.animLogo.width/2);
    logoGlow.endFill();
    logoGlow.x = this.animLogo.x;
    logoGlow.y = this.animLogo.y-this.animLogo.width/4;
    logoGlow.visible = false;
    this.animLogoHandler = function(e){
        switch(e.type){
            case "touchstart":
            case "mousedown":
                _this.animLogo.scale.set(.97,.97);
                break;
            case "mouseup":
            case "touchend":
            case "mouseupoutside":
            case "touchendoutside":
                _this.animLogo.scale.set(1,1);
                break;
            case "mouseover":
                _this.animLogo.scale.set(1.03, 1.03);
                if(_this.b.blur!==14){
                    _this.b.blur = 14;
                    logoGlow.filters = [_this.b];
                }
                logoGlow.visible = true;
                break;
            case "mouseout":
                logoGlow.visible = false;
                _this.animLogo.scale.set(1,1);
                break;
        }
    }
    var detectMob = PIXI.utils.isMobile;
    if(!detectMob.phone && !detectMob.tablet){
        this.animLogo
            .on("click", this.getMoreGame.bind(this))
            .on('mousedown', this.animLogoHandler)
            .on('touchstart', this.animLogoHandler)
            .on('mouseup', this.animLogoHandler)
            .on('touchend', this.animLogoHandler)
            .on('mouseupoutside', this.animLogoHandler)
            .on('touchendoutside',this.animLogoHandler)
            .on('mouseover', this.animLogoHandler)
            .on('mouseout',this.animLogoHandler);
    }else{
        this.animLogo
            .on("tap", this.getMoreGame.bind(this));
    }
    this.btPlay_more = new DefaultButton(["preloData","gameUI/btns/btPlay_more"]);
    this.btPlay_more.name = "splash_more_games";
    this.btPlay_more
        .on("click", this.getMoreGame.bind(this))
        .on("tap", this.getMoreGame.bind(this));
    this.btNext = new DefaultButton(["preloData","gameUI/btns/btNext"]);
    this.btNext.visible = false;
    this.btNext
        .on("click", this.finalStageManag.bind(this))
        .on("tap", this.finalStageManag.bind(this));
    this.btReplay = new DefaultButton(["preloData","gameUI/btns/btReplay"]);
    this.btReplay.visible = false;
    function btReplayFn(){
        resources.clickIn.sound.play();
        startSplash(_this);
    }
    this.btReplay
        .on("click", btReplayFn)
        .on("tap", btReplayFn);
    this.btShare = new DefaultButton(["preloData","gameUI/btns/btShare"]);
    this.btShare.visible = false;
    this.btShare
        .on("click", this.createShare.bind(this))
        .on("tap", this.createShare.bind(this));
    this.createHot(2, posHot);
    this.hotCont.scale.set(.8,.8);//set scale this.hotCont
    if(posHot==="upright"){
        this.hotCont.position.set(stateWidth-this.hotCont.width/1.8, stateHeight/2);//change the position of the container
    }else{//"horiz"
        this.hotCont.position.set(stateWidth/2, stateHeight-this.hotCont.height/2);//change the position of the container
    }
    var scaleHot = this.hotCont.scale.x;
    this.hotCont.t = PIXI.tweenManager.createTween(this.hotCont);
    this.hotCont.t.time = 1000;
    this.hotCont.t.pingPong = true;
    this.hotCont.t.loop = true;
    this.hotCont.t.from({scale: {x:scaleHot, y:scaleHot}});
    this.hotCont.t.to({scale: {x:scaleHot +.05, y:scaleHot +.05}});
    this.cont.addChild(logoGlow, this.animLogo, this.btPlay_more, this.btNext, this.btReplay, this.btShare);
}
GameUI.prototype.createShare = function(e){
    resources.photo.sound.play();
    share.show();
    this.cont.interactiveChildren = false;
    soundBt.cont.interactiveChildren = false;
    game.cont.interactiveChildren = false;
    if(this.b!==4)this.b.blur = 4;
    this.cont.filters = [this.b];
    soundBt.cont.filters = [this.b];
    game.cont.filters = [this.b];
}
GameUI.prototype.finalStageManag = function(){
    game.emitter3.emit = false;
    if(this.btNext.scale.x>0){
        resources.clickIn.sound.play();
        game.winCont.visible = false;
        game.btOk.visible = false;
        game.btTrash.visible = false;
        game.finalStageManag("hide");
        this.btNext.scale.x = -1;
        this.btNext.visible = true;
        this.btShare.visible = true;
        this.btReplay.visible = true;
        this.hotCont.visible = true;
        this.hotCont.t.start();
        this.hotCont_01.getChildAt(0).t.start();
        this.hotCont_02.getChildAt(0).t.start();
    }else{
        game.btOk.visible = true;
        game.btTrash.visible = true;
        if(!splash.cont.visible){
            game.finalStageManag("show");
            resources.backGameSnd.sound.play();
        }else{
            resources.clickIn.sound.play();
        }
        this.btNext.visible = false;
        this.btNext.scale.x = 1;
        this.btShare.visible = false;
        this.btReplay.visible = false;
        this.hotCont.visible = false;
        this.hotCont.t.stop();
        this.hotCont_01.getChildAt(0).t.stop();
        this.hotCont_02.getChildAt(0).t.stop();
    }
}
function Share(){
    this.cont = new Container();
    this.cont.visible = false;
    this.cont.interactiveChildren = false;
    var bg = new PIXI.Graphics();
    bg.beginFill(0x000000,.7);
    bg.drawRect(0,0,stateWidth, stateHeight);
    bg.endFill();
    var text1 = "Поделиться",
        text2 = "Сохранить\nизображение",
        fontSize1 = 40,
        fontSize2 = 30;
    if(this.determLang()!== "ru"){
        text1 = "Share";
        text2 = "Save image";
        fontSize1 = 60;
        fontSize2 = 50;
    }
    this.progField1 = new PIXI.Text(text1, {
        fontFamily: 'Rubik',
        fontSize: fontSize1,
        fill: 'white',
        fontWeight: '800',
        align: 'center'
    });
    this.progField1.scale.set(.75,1);
    this.progField2 = new PIXI.Text(text2, {
        fontFamily: 'Rubik',
        fontSize: fontSize2,
        fill: 'white',
        fontWeight: '800',
        align: 'center'
    });
    this.progField2.scale.set(.75,1);
    this.prevPicCont = new Container();
    var picBg = new PIXI.Graphics();
    picBg.beginFill(0xffffff,1);
    picBg.drawRect(0,0,stateWidth, stateHeight);
    picBg.endFill();
    var texture = picBg.generateCanvasTexture();
    var picBgSpr = new Sprite(texture);
    this.prevPicCont.addChild(picBgSpr);
    this.cont.addChild(bg, this.prevPicCont, this.progField1, this.progField2);
}
extend(Share, State);
Share.prototype.init = function(){
    var _this = this;
    this.closeShare = function(){
        resources.clickIn.sound.play();
        this.cont.interactiveChildren = false;
        this.shareTween =  PIXI.tweenManager.createTween(this.cont);
        this.shareTween.time = 200;
        this.shareTween.to({alpha: 0});
        this.shareTween.start();
        this.shareTween.on("end", function(){
            _this.cont.visible = false;
            _this.cont.alpha = 1;
            gameUI.cont.interactiveChildren = true;
            soundBt.cont.interactiveChildren = true;
            gameUI.cont.filters = null;
            soundBt.cont.filters = null;
            game.cont.filters = null;
            _this.prevPicCont.cacheAsBitmap = false;
            _this.prevPicCont.rotation = Math.PI*0/180;
            _this.prevPicCont.scale.set(1);
            _this.prevPicCont.position.set(0,0);
        })
    }
    this.btClose = new DefaultButton(["preloData","share/btns/btClose"]);
    this.btClose
        .on("click", this.closeShare.bind(this))
        .on("tap", this.closeShare.bind(this));
    this.btFb = new DefaultButton(["preloData","share/btns/btFb"]);
    this.btGoo = new DefaultButton(["preloData","share/btns/btGoo"]);
    this.btTw = new DefaultButton(["preloData","share/btns/btTw"]);
    this.btSave = new DefaultButton(["preloData","share/btns/btSave"]);
    this.btReplay = new DefaultButton(["preloData","share/btns/btReplay"]);
    var brt = new PIXI.BaseRenderTexture(stateWidth, stateHeight, PIXI.SCALE_MODES.LINEAR, 1);
    this.rt = new PIXI.RenderTexture(brt);
    var gameClon = new PIXI.Sprite(this.rt);
    gameClon.scale.set(.97,.96);
    gameClon.position.set((stateWidth-gameClon.width)/2,(stateHeight - gameClon.height)/2);
    this.logoShare = new Sprite(resources.preloData.textures["splash/btns/logoS_" + gameUI.determLang()]);
    this.logoShare.position.set(gameClon.x, stateHeight-((stateHeight - gameClon.height)/2+this.logoShare._texture.trim.height));
    this.prevPicCont.addChild(gameClon, this.logoShare);
    this.cont.addChild(this.btClose, this.btFb, this.btGoo, this.btTw, this.btSave, this.btReplay);
    this.progField1.position.set(this.btGoo._texture.trim.x-(this.progField1.width/2-this.btGoo._texture.trim.width/2), this.btGoo._texture.trim.y-(this.progField1.height/2+this.btGoo._texture.trim.height/2));
    this.progField2.position.set(this.btGoo._texture.trim.x-(this.progField2.width/2-this.btGoo._texture.trim.width/2), this.btSave._texture.trim.y-(this.progField2.height/2+this.btSave._texture.trim.height/2));
    var mainText = "Look what a game! %23Fynsy %23FynsyGames";
    var domen = "com";
    if(gameUI.determLang() === "ru")domen = "ru";
    function fbFn(){
        resources.clickOut.sound.play();
        var mainLink = "http://fynsy." + domen + "/?utm_source=facebook%26utm_medium=share_link";
        this.href = "https://www.facebook.com/sharer/sharer.php?s=100%20&p[title]="+mainText+"&p[url]="+mainLink;
        window.open(this.href, 'Опубликовать ссылку в Facebook', 'width=640,height=436,toolbar=0,status=0');
        return false;
    }
    this.btFb
        .on("click", fbFn)
        .on("tap", fbFn);
    function gooFn(){
        resources.clickOut.sound.play();
        var mainLink = "http://fynsy." + domen + "/?utm_source=google%26utm_medium=share_link";
        this.href ="https://plus.google.com/share?url="+mainLink;
        window.open(this.href, 'Опубликовать ссылку', 'width=640,height=436,toolbar=0,status=0');
    }
    this.btGoo
        .on("click", gooFn)
        .on("tap", gooFn);
    function twFn(){
        resources.clickOut.sound.play();
        var mainLink = "http://fynsy." + domen + "/?utm_source=twitter%26utm_medium=share_link";
        this.href = "https://twitter.com/intent/tweet?text="+mainText+"&url="+mainLink;
        window.open(this.href, 'Опубликовать ссылку', 'width=640,height=436,toolbar=0,status=0');
    }
    this.btTw
        .on("click", twFn)
        .on("tap", twFn);
    function saveFn(){
        resources.clickIn.sound.play();
        var pom = document.createElement('a');
        var newData = _this.dataUrl.replace(/^data:image\/png/, "data:application/octet-stream");
        pom.setAttribute("href", newData);
        pom.setAttribute('download', document.title+".png");
        pom.style.display = 'none';
        document.body.appendChild(pom);
        pom.click();
        document.body.removeChild(pom);
    }
    this.btSave
        .on("click", saveFn)
        .on("tap", saveFn);
    function replFn(){
        _this.closeShare();
        startSplash(_this);
    }
    this.btReplay
        .on("click", replFn)
        .on("tap", replFn);
}
Share.prototype.show = function(){
    var _this = this;
    app.renderer.render(game.cont, this.rt);
    var brt = new PIXI.BaseRenderTexture(stateWidth, stateHeight, PIXI.SCALE_MODES.LINEAR, 1);
    var rt = new PIXI.RenderTexture(brt);
    app.renderer.render(this.prevPicCont, rt);
    var canvas = app.renderer.extract.canvas(rt);
    this.dataUrl = canvas.toDataURL('image/png', 1);
    this.prevPicCont.rotation = -Math.PI*5/180;
    this.prevPicCont.scale.set(.6);
    this.prevPicCont.position.set(12,120);
    this.prevPicCont.cacheAsBitmap = true;
    this.cont.visible = true;
    this.cont.interactiveChildren = true;
}




