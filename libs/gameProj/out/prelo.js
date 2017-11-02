function State(){}
State.prototype.getSoundManifest = function(){
    var manifest = [
        {id: "bgMusic", src: "sound/bgMusic.mp3"},
        {id: "clickOut", src: "sound/click1.mp3"},
        {id: "clickIn", src: "sound/click2.mp3"},
        {id: "prevFynsyVoice", src: "sound/prevFynsyVoice.mp3"},
        {id: "photo", src: "sound/photo.mp3"}
    ];
    return manifest;
}
State.prototype.getManifest = function(){
    var manifest = [
        {name: "preview", url: "json/skeleton.json"},
        {name: "prev_bg", url: "img/preview_bg_" + this.determLang() + ".png"},
        {name: "tabletop", url: "img/tabletop.jpg"},
        {name: "game_bg", url: "img/game_bg.jpg"},
        {name: "beam", url: "img/beam.png"},
        {name: "splash_bg", url: "img/splash_bg.jpg"},
        {name: "fynsyLogo", url: "json/head_logo_small_new_fynsy.json"},
        {name: "bg", url: "img/game_bg.jpg"},
        {name: "dataGame", url: "json/dataGame.json?rand=<?=time()?>"},
        {name: "dataGame2", url: "json/dataGame2.json?rand=<?=time()?>"},
        {name: "dataGame3", url: "json/dataGame3.json?rand=<?=time()?>"},
        {name: "shape_01", url: "img/shape_01.png"},
        {name: "shape_02", url: "img/shape_02.png"},
        {name: "shape_03", url: "img/shape_03.png"},
        {name: "shape_04", url: "img/shape_04.png"},
        {name: "shape_05", url: "img/shape_05.png"},
        {name: "shape_06", url: "img/shape_06.png"},
        {name: "shape_07", url: "img/shape_07.png"},
        {name: "shape_08", url: "img/shape_08.png"},
        {name: "shape_09", url: "img/shape_09.png"},
        {name: "shape_10", url: "img/shape_10.png"},
        {name: "shape_11", url: "img/shape_11.png"},
        {name: "shape_12", url: "img/shape_12.png"},
        {name: "shape_13", url: "img/shape_13.png"},
        {name: "shape_14", url: "img/shape_14.png"},
        {name: "shape_15", url: "img/shape_15.png"},
        {name: "shape_16", url: "img/shape_16.png"},
        {name: "shape_17", url: "img/shape_17.png"},
        {name: "shape_18", url: "img/shape_18.png"},
        {name: "shape_19", url: "img/shape_19.png"},
        {name: "shape_20", url: "img/shape_20.png"},
        {name: "particle", url: "img/particle.png"},
        {name: "particle2", url: "img/CartoonSmoke.png"},
        {name: "bubb_01", url: "img/bubb_01.png"},
        {name: "bubb_02", url: "img/bubb_02.png"},
        {name: "bubb_03", url: "img/bubb_03.png"},
        {name: "bubb_04", url: "img/bubb_04.png"},
        {name: "bubb_05", url: "img/bubb_05.png"},
        {name: "colorPouffe", url: "json/emitter1.json"},
        {name: "shapePouffe", url: "json/emitter2.json"},
        {name: "bubblesVert", url: "json/emitter3.json"},
        {name: "fynsy", url: "json/Fynsy_main.json"},
        {name: "bgMusic", url: "sound/bgMusic.mp3"},
        {name: "clickOut", url: "sound/click1.mp3"},
        {name: "clickIn", url: "sound/click2.mp3"},
        {name: "prevFynsyVoice", url: "sound/prevFynsyVoice.mp3"},
        {name: "photo", url: "sound/photo.mp3"},
        {name: "stopBtIfPaint", url: "sound/KeyPress.mp3"},
        {name: "paintSnd", url: "sound/swap.mp3"},
        {name: "colorSnd", url: "sound/force1.mp3"},
        {name: "garbageSnd", url: "sound/garbage.mp3"},
        {name: "selectCat", url: "sound/down.mp3"},
        {name: "winSnd", url: "sound/soundBack.mp3"},
        {name: "backGameSnd", url: "sound/replay.mp3"},
        {name: "toFinSnd", url: "sound/toFin.mp3"},
        {name: "winHidSnd", url: "sound/1_Click.mp3"},
        {name: "shapeSnd", url: "sound/air-shot.mp3"},
        {name: "removeDecorSnd", url: "sound/needles.mp3"},
        {name: "selectDecor", url: "sound/minisht1.mp3"},
        {name: "happyFinal", url: "sound/flowers.mp3"},
        {name: "putDecor", url: "sound/skaki.mp3"},
        {name: "transformDecor", url: "sound/takeScr.mp3"},
        {name: "arrowSnd", url: "sound/SelectTrack.mp3"},
        {name: "selectBt", url: "sound/Plopp.mp3"},
        {name: "finalVoice_01", url: "sound/s-55.mp3"},
        {name: "finalVoice_02", url: "sound/s-56.mp3"},
        {name: "sadVoice_01", url: "sound/s-60.mp3"},
        {name: "sadVoice_02", url: "sound/s-70.mp3"},
        {name: "persVoice_01", url: "sound/s-24.mp3"},
        {name: "persVoice_02", url: "sound/s-39.mp3"},
        {name: "persVoice_03", url: "sound/s-58.mp3"},
        {name: "persVoice_04", url: "sound/s-71.mp3"},
        {name: "persVoice_05", url: "sound/s-73.mp3"}
    ];
    return manifest;
}
State.prototype.determLang = function(){
    var lang = "en";//ru
    return lang;
}
State.prototype.getMoreGame = function(e){
    //resources.clickOut.sound.play();
    createjs.Sound.play("clickOut");
    var domen = "ru";
    if(domen !== this.determLang())domen = "com";
    var newHref = "http://fynsy." + domen + "/?utm_source="+location.hostname+"&utm_medium=" + e.target.name + "&utm_campaign="+document.title;
    window.open(newHref);
    return false;
}
State.prototype.getHotGame = function(ind){
    if(this instanceof Preloader){
        if(this.urlArray.length > 3){
            window.open(this.urlArray[ind*2-1][1]);
        }else{
            window.open("http://www.fynsy.ru/game/" + this.urlArray[ind-1][1]);
        }
    }else{
        var getArr = resources[("tit_hot"+ind)].url.split("/");
        var getTit = getArr[getArr.length-1].split(".");
        this.determLang()==="ru"?window.open("http://www.fynsy.ru/game/" + getTit[0]): window.open("http://www.fynsy.com/game/" + getTit[0]);
    }
    return false;
};
window.WebFontConfig = {
    google: {
        families: ['Rubik:900&amp;subset=cyrillic']
    },
    listeners: [],
    active: function() {
        this.called_ready = true;
        for(var i = 0; i < this.listeners.length; i++) {
            this.listeners[i]();
        }
    },
    ready: function(callback) {
        if (this.called_ready) {
            callback();
        } else {
            this.listeners.push(callback)
        }
    }
};
function Preloader(){
    var _this = this;
    this.cont = new Container();
    this.cont.visible = false;
    this.progField = null;
    WebFontConfig.ready(function(){
        _this.progField = new PIXI.Text("0%", {
            fontSize: 22,
            fill: 'white',
            fontFamily: 'Rubik',
            fontWeight: '900'
         });
         _this.progField.scale.set(.75,1);
         Loader
         .add([
             {name: "prelo_bg", url: "img/preloader_bg.png"},
             {name: "pbP_mask", url: "img/pbP_mask.png"},
             {name: "hG_mask", url: "img/hG_mask.png"},
             {name: "preloData", url:"json/dataDefault.json?rand=<?=time()?>"},
             {name: "hotGame", url: "json/get_games_preload_en.txt"}
             //{name: "hotGame", url: "http://games.fynsy.ru/get_games_preload.php"}
         ])
         .load(_this.init.bind(_this));
    });
    return this;
}
extend(Preloader, State);
State.prototype.createHot = function(num, position){
    this.roundRect = function(w, h){
        var rR = new PIXI.Graphics();
        rR.lineStyle(2, 0xffffff);
        rR.drawRoundedRect(0, 0, w, h, 14);
        rR.endFill();
        return rR;
    }
    this.circle = function(r, x, y){
        var c = new PIXI.Graphics();
        c.beginFill(0xffffff);
        c.drawCircle(0, 0, r*1.3);
        c.endFill();
        c.position.set(x, y);
        c.f = new PIXI.filters.BlurFilter();
        c.f.blur = 20;
        c.filters = [c.f];
        c.t = PIXI.tweenManager.createTween(c);
        c.t.time = 1000;
        c.t.pingPong = true;
        c.t.loop = true;
        c.t.from({scale: {x:.8, y:.8}});
        c.t.to({scale: {x:1.2, y:1.2}});
        if(!position)c.t.start();
        return c;
    }
    this.init = function(i){
        this[("hotCont_0"+(i+1))] = new Container();
        var mask = new Sprite(resources.hG_mask.texture);
        var tN = "tit_hot"+(i+1);
        if(this.determLang()==="en" && this instanceof Preloader)tN = "game"+(i+1)+"_img";
        var img = new Sprite(resources[(tN)].texture);
        var icon = new Sprite(resources.preloData.textures["preloader/icon/iconS_"+this.determLang()]);//"preloader/icon/iconS_ru"
        icon.position.set(3, mask.height-(icon.height+3));
        this[("hotCont_0"+(i+1))].hitArea =  new PIXI.Rectangle(0,0, mask.width, mask.height);
        this[("hotCont_0"+(i+1))].pivot.set(mask.width/2, mask.height/2);
        if(position){
            if(position==="horiz"){
                i===0?this[("hotCont_0"+(i+1))].position.set(-(mask.width/2+10), 0):this[("hotCont_0"+(i+1))].position.set(mask.width/2+10, 0);
            }else{
                i===0?this[("hotCont_0"+(i+1))].position.set(0, -(mask.height/2+10)):this[("hotCont_0"+(i+1))].position.set(0, mask.height/2+10);
            }
        }else{
            this[("hotCont_0"+(i+1))].position.set(38+mask.width/2+(mask.width+45)*i, 20+mask.height/2);
        }
        this[("hotCont_0"+(i+1))].addChild(this.circle(mask.height/2, mask.width/2, mask.height/2), img, mask, this.roundRect(mask.width,mask.height), icon);
        img.mask = mask;
        this instanceof Preloader?this.cont.addChild(this[("hotCont_0"+(i+1))]):this.hotCont.addChild(this[("hotCont_0"+(i+1))]);
        this[("hotCont_0"+(i+1))].filter = new PIXI.filters.ColorMatrixFilter();
        this[("hotCont_0"+(i+1))].buttonMode = true;
        this[("hotCont_0"+(i+1))].interactive = true;
        this[("hotCont_0"+(i+1))].name = "hotGame_"+(i+1);
        var detectMob = PIXI.utils.isMobile;
        if(!detectMob.phone && !detectMob.tablet){
            this[("hotCont_0"+(i+1))]
                .on('click', this.onBtPlayContHandler.bind(this))
                .on('mouseup', this.onBtPlayContHandler.bind(this))
                .on('touchend', this.onBtPlayContHandler.bind(this))
                .on('mouseupoutside', this.onBtPlayContHandler.bind(this))
                .on('touchendoutside', this.onBtPlayContHandler.bind(this))
                .on('mouseover', this.onBtPlayContHandler.bind(this))
                .on('mouseout', this.onBtPlayContHandler.bind(this));
        }else{
            this[("hotCont_0"+(i+1))]
                .on('tap', this.onBtPlayContHandler.bind(this));
        }
    }
    for(var i = 0 ; i < num; i++)
        this.init(i);
}
Preloader.prototype.init = function(){
    var _this = this;
    this.btPlayCont = new Container();
    this.pbG = new Sprite(resources.preloData.textures["preloader/pbG"]);
    this.pbP = new Sprite(resources.preloData.textures["preloader/btns/pbP"]);
    this.pbP_mask = new Sprite(resources.pbP_mask.texture);
    this.logoB = new DefaultButton(["preloData","preloader/btns/logoB_"+this.determLang()]);
    this.logoB
        .on("tap", this.getMoreGame.bind(this))
        .on("click", this.getMoreGame.bind(this));
    this.logoB.name = "in_game_logo";
    this.btMG = new DefaultButton(["preloData","preloader/btns/btMG_"+this.determLang()]);
    this.btMG
        .on("tap", this.getMoreGame.bind(this))
        .on("click", this.getMoreGame.bind(this));
    this.btMG.name = "splash_more_games";
    this.pbP.anchor.set(.5,.5);
    this.pbP.position.set(this.pbG.texture.trim.x+this.pbG.texture.trim.width/2, this.pbG.texture.trim.y+this.pbG.texture.trim.height/2);
    this.pbP_mask.anchor = this.pbP.anchor;
    this.pbP_mask.position = this.pbP.position;
    this.progField.position.set(this.pbG.texture.trim.x+(this.pbG.texture.trim.width/2-this.progField.width/2), this.pbG.texture.trim.y+2);
    this.pbP.x -= this.pbP.texture.width;
    this.pbP.mask = this.pbP_mask;
    this.btPlayCont.addChild(
        this.pbG,
        this.pbP,
        this.pbP_mask,
        this.progField
    );
    this.btPlayCont.pivot.set(this.pbG.texture.trim.x+this.pbG.texture.trim.width/2, this.pbG.texture.trim.y+this.pbG.texture.trim.height/2);
    this.btPlayCont.position = this.btPlayCont.pivot;
    this.cont.addChild(
        new Sprite(resources.prelo_bg.texture),
        this.btPlayCont,
        this.btMG,
        this.logoB
    );
    this.urlArray = resources.hotGame.data.split('&');
    var urlImgArray = [];
    var max = this.urlArray.length;
    for (var i = 0; i < max; i++){
        this.urlArray[i] = this.urlArray[i].split('=');
        if(max > 3){
            if(i%2===0 && i<6){
                var getTit = this.urlArray[i][1].split("/");
                urlImgArray.push({name:this.urlArray[i][0], url:"img/" + getTit[getTit.length-1], crossOrigin: false});
                //urlImgArray.push({name:this.urlArray[i][0], url:this.urlArray[i][1], crossOrigin: false});
            }
            if(i>=6)urlImgArray.push({name: this.urlArray[i][0], url:"img/" + this.urlArray[i][1] + ".jpg"});
            //if(i>=6)urlImgArray.push({name: this.urlArray[i][0], url:"http://files.fynsy.com/pictures/" + this.urlArray[i][1] + ".jpg", crossOrigin: true, anonymous: true});
        }else{
            urlImgArray.push({name: this.urlArray[i][0], url:"http://files.fynsy.ru/pictures/" + this.urlArray[i][1] + ".jpg", crossOrigin: true, anonymous: true});
        }
    }
    var assetsPath = "sound/";
    var manifest = [
        {id: "bgMusic", src: "bgMusic.mp3"},
        {id: "clickOut", src: "click1.mp3"},
        {id: "clickIn", src: "click2.mp3"},
        {id: "prevFynsyVoice", src: "prevFynsyVoice.mp3"},
        {id: "photo", src: "photo.mp3"}
    ];
    createjs.Sound.alternateExtensions = ["mp3"];
    var preload = new createjs.LoadQueue(true, assetsPath);
    preload.installPlugin(createjs.Sound);
    preload.addEventListener("complete", function(){
        //createjs.Sound.play("prevFynsyVoice", {interrupt: createjs.Sound.INTERRUPT_NONE, loop: -1, volume: 0.4})
    }); // add an event listener for when load is completed
    //preload.addEventListener("progress", updateLoading);
    preload.loadManifest(manifest);

    Loader
        .add(urlImgArray)
        .load(function(){
            _this.createHot(3);
            elapsed = Date.now();
            app.ticker.add(function() {
                PIXI.tweenManager.update();
                var now = Date.now();
                if(game.emitter)game.emitter.update((now - elapsed) * 0.001);
                if(game.emitter2)game.emitter2.update((now - elapsed) * 0.001);
                if(game.twistFilter){
                    game.twistFilter.angle += 1;
                    if(game.twistFilter.angle>=20)
                        delete game.twistFilter;
                }
                if(game.emitter3)game.emitter3.update((now - elapsed) * 0.001);
                elapsed = now;
            });
            _this.cont.visible = true;
            document.getElementById('preloAnim').style.display = "none";
            _this.startLoad();
        });
}
Preloader.prototype.startLoad = function(){
    var _this = this;
    var manifest = this.getManifest();
    var increment = null;
    var firstPosX = this.pbP.x;
    Loader
        .add(manifest)
        .on("progress", loadProgressHandler)
        .load(setup);
    function loadProgressHandler(loader, resource) {
        increment = Math.floor(loader.progress-100);
        _this.pbP.x = _this.pbP.width*increment/100 + firstPosX;
        _this.progField.text = increment + '%';
        _this.progField.position.set(_this.pbG.texture.trim.x+(_this.pbG.texture.trim.width/2-_this.progField.width/2), _this.pbG.texture.trim.y+2);
    }
    function setup() {
        share.init();
        game.init([resources.dataGame.textures, resources.dataGame2.textures, resources.dataGame3.textures]);
        gameUI.init();
        splash.init();
        soundBt.init();
        preview.init();
        _this.pbP.x = _this.pbP.width + firstPosX;
        var text = 'ИГРАТЬ';
        if(_this.determLang() !== "ru")text = 'PLAY';
        _this.progField.text = text;
        _this.progField.position.set(_this.pbG.texture.trim.x+(_this.pbG.texture.trim.width/2-_this.progField.width/2), _this.pbG.texture.trim.y+2);
        _this.btPlayCont.hitArea =  new PIXI.Rectangle(_this.btPlayCont.x-_this.pbG.texture.trim.width/2, _this.btPlayCont.y-_this.pbG.texture.trim.height/2, _this.pbG.texture.trim.width,  _this.pbG.texture.trim.height);
        _this.btPlayCont.interactive = true;
        _this.btPlayCont.buttonMode = true;
        _this.btPlayCont.filter = new PIXI.filters.ColorMatrixFilter();
        _this.btPlayCont
        var detectMob = PIXI.utils.isMobile;
        if(!detectMob.phone && !detectMob.tablet){
            _this.btPlayCont
                .on('click', _this.onBtPlayContHandler.bind(_this))
                .on('mouseup', _this.onBtPlayContHandler.bind(_this))
                .on('touchend', _this.onBtPlayContHandler.bind(_this))
                .on('mouseupoutside', _this.onBtPlayContHandler.bind(_this))
                .on('touchendoutside', _this.onBtPlayContHandler.bind(_this))
                .on('mouseover', _this.onBtPlayContHandler.bind(_this))
                .on('mouseout', _this.onBtPlayContHandler.bind(_this));
        }else{
            _this.btPlayCont
                .on('tap', _this.onBtPlayContHandler.bind(_this));
        }
    }
}
Preloader.prototype.stop = function(){
    this.hotCont_01.getChildAt(0).t.stop();
    this.hotCont_02.getChildAt(0).t.stop();
    this.hotCont_03.getChildAt(0).t.stop();
    app.stage.removeChild(this.cont);
}
State.prototype.onBtPlayContHandler = function(e){
    var _this = this;
    switch(e.type){
        case "mouseup":
        case "touchend":
        case "mouseupoutside":
        case "touchendoutside":
            this.lastBt.filters = null;
            this.lastBt.scale.set(1,1);
            break;
        case "mouseover":
            e.target.filter.brightness(1.15, false);
            e.target.filters = [e.target.filter];
            e.target.scale.set(1.03, 1.03);
            if("t" in e.target.getChildAt(0))e.target.getChildAt(0).visible = false;
            this.lastBt = e.target;
            break;
        case "mouseout":
            this.lastBt.scale.set(1, 1);
            this.lastBt.filters = null;
            if("t" in this.lastBt.getChildAt(0))this.lastBt.getChildAt(0).visible = true;
            break;
        case "tap":
        case "click":
            e.target.filter.brightness(.8, false);
            e.target.filters = [e.target.filter];
            e.target.scale.set(.97,.97);
            this.lastBt = e.target;
            if(e.target.name && e.target.name.split('_')[0] === "hotGame"){
                //resources.clickOut.sound.play();
                createjs.Sound.play("clickOut");
                this.getHotGame(+e.target.name.split('_')[1]);
                if(PIXI.utils.isMobile.phone || PIXI.utils.isMobile.tablet){
                    var uptdTarget = setTimeout(updtFun(e.target), 100);
                    function updtFun(targ){
                        clearTimeout(uptdTarget);
                        targ.filters = null;
                        targ.scale.set(1, 1);
                    }
                }
            } else{
                createjs.Sound.play("clickIn");
                //resources.clickIn.sound.play();
                startPrev();
            }
            break;
    }
}

