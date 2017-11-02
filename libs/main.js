window.onload = function(){
    var fontScrpt = appendScript('://ajax.googleapis.com/ajax/libs/webfont/1/webfont.js');
    fontScrpt.onload = function(){startState();}
}
function startState(){
    PIXI.utils.sayHello("FYNSY");
    //PIXI.utils.skipHello();
    var canvas = document.getElementById("stage");
    app = new PIXI.Application(canvas.width, canvas.height, {view: canvas, antialias: false, transparent: true, resolution: 1}, false);
    scaleToWindow(document.getElementById("mainContainer"));
    window.addEventListener('orientationchange', resizeGame, false);
    window.addEventListener('resize', resizeGame, false);
    preloader = new Preloader();
    preview = new Preview();
    splash = new Splash();
    soundBt = new SoundBt();
    gameUI = new GameUI();
    game = new Game();
    share = new Share();
    app.stage.addChild(game.cont, gameUI.cont, splash.cont, soundBt.cont, preview.cont, preloader.cont, share.cont);
}
function startPrev(){
    isvisible = true;
    document.addEventListener("visibilitychange", handleVisibilityChange, false);
    preview.cont.visible = true;
    preloader.cont.interactiveChildren = false;
    preloader.tween = PIXI.tweenManager.createTween(preloader.cont);
    preloader.tween.time = 500;
    preloader.tween.to({alpha: 0});
    preloader.tween.start();
    preloader.tween.on('end', function(){
        if(preloader){
            delete preloader.tween;
            preloader.cont.visible = false;
            preloader.stop();
            preloader = undefined;
        }
        preview.play();
    });
}
function startSplash(_this){
    splash.cont.visible = true;
    splash.play();
    if(_this instanceof GameUI || _this instanceof Share){
        gameUI.finalStageManag();
        gameUI.cont.interactiveChildren = false;
        share.cont.interactiveChildren = false;
        splash.tween = PIXI.tweenManager.createTween(splash.cont);
        splash.tween.time = 500;
        splash.tween.to({alpha: 1});
        splash.tween.start();
        splash.tween.on('end', function(){
            delete splash.tween;
            _this.cont.visible = false;
            splash.cont.interactiveChildren = true;
            splash.play();
        });
    }else{
        preview.tween = PIXI.tweenManager.createTween(preview.cont);
        preview.tween.time = 500;
        preview.tween.to({alpha: 0});
        preview.tween.start();
        preview.tween.on('end', function(){
            delete preview.tween;
            preview.cont.interactive = false;
            preview.cont.visible = false;
            splash.cont.interactiveChildren = true;
            splash.play();
        });
    }
}
function startGame(){
    game.finalStageManag("show");
    game.onStartPrepar();
    game.cont.visible = true;
    gameUI.cont.visible = true;
    splash.cont.interactiveChildren = false;
    splash.tween = PIXI.tweenManager.createTween(splash.cont);
    splash.tween.time = 500;
    splash.tween.to({alpha: 0});
    splash.tween.start();
    splash.tween.on('end', function(){
        splash.stop();
        delete splash.tween;
        game.cont.interactiveChildren = true;
        gameUI.cont.interactiveChildren = true;
        splash.cont.visible = false;
    });
}







