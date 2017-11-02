function Splash(){
    this.cont = new Container();
    this.cont.interactiveChildren = false;
    this.cont.visible = false;
    return this;
}
extend(Splash, State);
Splash.prototype.init = function(){
    var logo = new DefaultButton(["preloData","splash/btns/logoS_"+this.determLang()]);
    logo
        .on("click", this.getMoreGame.bind(this))
        .on("tap", this.getMoreGame.bind(this));
    logo.name = "in_game_logo";
    var play_more = new DefaultButton(["preloData","splash/btns/play_more"]);
    play_more
        .on("click", this.getMoreGame.bind(this))
        .on("tap", this.getMoreGame.bind(this));
    play_more.name = "splash_more_games";
    var play_game = new DefaultButton(["preloData","splash/btns/play_game"]);
    function plGameFn(){
        resources.clickIn.sound.play();
        startGame();
    }
    play_game
        .on("click", plGameFn)
        .on("tap", plGameFn);
    this.pers = new PIXI.spine.Spine(resources.fynsy.spineData);
    this.pers.skeleton.setSkinByName("full_face");
    this.pers.position.set(this.pers.width/2-10, 450);
    this.pers.state.setAnimation(0, 'splash', true);
    this.pers.state.timeScale = 0;
    this.tit = new Sprite(resources.dataGame2.textures["name_" + this.determLang()]);
    this.cont.addChild(new Sprite(resources.splash_bg.texture), this.pers, this.tit, logo, play_more, play_game);
    this.tit.t = PIXI.tweenManager.createTween(this.tit);
    this.tit.t.time = 1750;
    this.tit.t.loop = true;
    this.tit.t.pingPong = true;
    this.tit.t.from({scale:{x:1, y:1}});
    this.tit.t.to({scale:{x:1.03, y:1.03}});
}
Splash.prototype.play = function(){
    this.tit.t.start();
    this.pers.state.timeScale = 1;
}
Splash.prototype.stop = function(){
    this.tit.t.stop();
    this.pers.state.timeScale = 0;
}
