function Game(){
    this.cont = new Container();
    this.cont.interactiveChildren = false;
    this.cont.visible = false;
    this.catColor = ["ffb3c9", "ff7f43", "00bbb9", "ad6dee", "8986ff", "ffd823", "97e773", "00fff6", "ff67f6", "86e1ff"];
    this.catName = ["shape", "col", "pr", "gr", "fr", "sw", "flower", "cookie", "candle", "top"];
    this.shapeColor = ["efe8d2", "fea8ff", "e8069b", "ebf107", "3cb450", "1aa7f1", "ffca08", "ffc3a2", "381400", "d62722",
        "b85c8d", "b18362", "8805c5", "fff200", "fc7d00", "5e79ff", "a1ffe8", "eda57d", "ffefad", "f0c3ff"];
    this.decorBord = new PIXI.filters.OutlineFilter(3, 0x99ff99);
    this.decorBord.padding = stateWidth;
    //this.decorBord = new PIXI.filters.GlowFilter(4, 2, 2, 0x99ff99, 1);
    this.countVoice = 0;
    this.voice = null;
    return this;
}
extend(Game, State);
Game.prototype.init = function(texture){
    var _this = this;
    var animCount = 0;
    this.selectCat = function (e){
        if(_this.cakeCont.visible){
            resources.selectCat.sound.play();
            if(_this.lastCat)
                _this.scaleBt(_this.lastCat, 0, 1, true);
            _this.lastCat = e.target;
            _this.scaleBt(e.target, 5, 1.4, false);
            _this.changeCat(e.target.name);
            if(_this.btContDecor.interactiveChildren){
                _this.btContDecor.filters = [_this.btContDecor.darcFilter];
                _this.btContDecor.alpha = .7;
                _this.btContDecor.interactiveChildren = false;
                _this.lastDecor.filters = null;
                _this.lastDecor = null;
            }
            animCount+=1;
            _this.persMood('happy_0'+animCount);
            if(animCount===3)animCount = 0;
        }
    }
    this.scaleBt = function(bt, dist, scale, interact){
        var getIndex = + bt.name - 1;
        var newRot = 95 + 9 * getIndex;
        var _x = - (325+dist) * Math.cos((Math.PI * newRot) / 180);
        var _y = - (320+dist) * Math.sin((Math.PI * newRot) / 180);
        bt.position.set(_x, _y);
        bt.scale.set(scale, scale);
        _this.lastCat.interactive = interact;
        bt.filters = null;
    }
    this.changeCat = function(name){
        var index = + name - 1;
        name<10?name = "catBg_0" + name: name = "catBg_" + name;
        _this.cat.texture = PIXI.utils.TextureCache[name];
        _this.catBg.tint = "0x" + _this.catColor[index];
        _this.btContMenu.children.forEach(function(item, i, arr) {
            if(item.name){
                var  newIndex = i;
                if(newIndex<10)newIndex = "0" + newIndex;
                item.texture = PIXI.utils.TextureCache[_this.catName[index] + "_" + newIndex];
            }else{
                item.visible = false;
            }
        });
    }
    this.winManag = function(){
        _this.winCont.visible?_this.winCont.visible = false:_this.winCont.visible = true;
        var max = _this.cont.children.length-1;
        for(var i = 0; i < max; i++){
            if(_this.winCont.visible){
                _this.cont.getChildAt(i).interactiveChildren = false;
                if(_this.lastDecor){
                    _this.lastDecor.filters = null;
                    _this.lastDecor = null;
                    _this.btContDecor.filters = [_this.btContDecor.darcFilter];
                    _this.btContDecor.alpha = .8;
                }
            }else{
                if(_this.cont.getChildAt(i)!==_this.btContDecor)
                    _this.cont.getChildAt(i).interactiveChildren = true;
            }
        }
    }
    this.texturs = texture[0];
    this.texturs2 = texture[1];
    this.texturs3 = texture[2];
    this.btOk = new DefaultButton(["preloData","gameUI/btns/btOk"]);
    function btOkFn(){
        if(!_this.brush.visible){
            resources.toFinSnd.sound.play();
            gameUI.finalStageManag();
            _this.persMood();
        }else{
            resources.stopBtIfPaint.sound.play();
        }
    }
    this.btOk
        .on('click', btOkFn)
        .on('tap', btOkFn);
    this.btTrash = new DefaultButton(["preloData","gameUI/btns/btTrash"]);
    function btTrashFn(){
        if(!_this.brush.visible){
            this.interactive = _this.btOk.interactive = false;
            _this.plateAnimation("show");
            //, n.winManag()
        }else{
            resources.stopBtIfPaint.sound.play();
        }
    }
    this.btTrash
        .on('click', btTrashFn)
        .on('tap', btTrashFn);
    this.plateAnimation = function(visibility){
        _this.bgWinTween = PIXI.tweenManager.createTween(_this.winCont.getChildAt(0));
        _this.bgWinTween.time = 400;
        _this.plateTween = PIXI.tweenManager.createTween(_this.plateCont);
        _this.plateTween.delay = 200;
        if(!_this.picTween){
            _this.winPic.pivot.set(stateWidth/2, stateHeight/2+50);
            _this.winPic.position.set(stateWidth/2, stateHeight/2+50);
            _this.picTween = PIXI.tweenManager.createTween(_this.winPic);
            _this.picTween.time = 800;
            _this.picTween.pingPong = true;
            _this.picTween.loop = true;
            _this.picTween.from({scale:{x:1,y:1}});
            _this.picTween.to({scale:{x:.95,y:.95}});
        }
        if(visibility==="show"){
            _this.winManag();
            resources.winSnd.sound.play();
            _this.winCont.interactiveChildren = true;
            _this.plateTween.time = 800;
            _this.plateTween.easing = PIXI.tween.Easing.outElastic();
            _this.winCont.getChildAt(0).alpha = 0;
            _this.bgWinTween.to({alpha: 1});
            _this.plateCont.scale.set(.01);
            _this.plateCont.position.set(_this.btTrash.x, _this.btTrash.y);
            _this.plateTween.from({scale:{x:.01,y:.01}, x:_this.btTrash.x, y:_this.btTrash.y});
            _this.plateTween.to({scale:{x:1,y:1}, x:stateWidth/2, y:stateHeight/2-50});
            _this.picTween.start();
        }else{
            visibility==="hide"?resources.winHidSnd.sound.play():resources.clickIn.sound.play();
            _this.winCont.interactiveChildren = false;
            _this.plateTween.time = 200;
            _this.winCont.getChildAt(0).alpha = 1;
            _this.bgWinTween.to({alpha: 0});
            _this.plateCont.scale.set(1);
            _this.plateCont.position.set(stateWidth/2, stateHeight/2-50);
            _this.plateTween.from({scale:{x:1,y:1}, x:stateWidth/2, y:stateHeight/2-50});
            _this.plateTween.to({scale:{x:.01,y:.01}, x:_this.btTrash.x, y:_this.btTrash.y});
            _this.picTween.stop();
            _this.plateTween.on('end', function(){
                if(visibility==="clear"){
                    resources.garbageSnd.sound.play();
                    _this.cakeStartPos.x = _this.cakeCont.x;
                    _this.cakeStartPos.y = _this.cakeCont.y;
                    _this.twistFilter = new PIXI.filters.TwistFilter();
                    _this.twistFilter.offset = new PIXI.Point(500,300);
                    _this.cakeCont.filters = [_this.twistFilter];
                    _this.decorCont.filters = [_this.twistFilter];
                    var tween = PIXI.tweenManager.createTween(_this.decorCont);
                    tween.time = 1000;
                    tween.from({scale:{x:1, y:1}, x:0, y:0});
                    tween.to({scale:{x:.01, y:.01}, x:500, y:300});
                    tween.start();
                    var tween2 = PIXI.tweenManager.createTween(_this.cakeCont);
                    tween2.time = 1000;
                    tween2.from({scale:{x:1, y:1}, x:_this.cakeStartPos.x, y:_this.cakeStartPos.y});
                    tween2.to({scale:{x:.01, y:.01}, x:500, y:300});
                    tween2.start();
                    tween2.on("end", function(){
                        _this.winManag();
                        _this.onStartPrepar();
                    })
                }else{
                    _this.winManag();
                }
            });
        }
        _this.bgWinTween.start();
        _this.plateTween.start();
    }
    this.stand = new Sprite(this.texturs2["stand"]);
    this.winCont = new Container();
    this.plateCont = new Container();
    var bg = new PIXI.Graphics();
    bg.beginFill(0x000000,.7);
    bg.drawRect(0,0,stateWidth, stateHeight);
    bg.endFill();
    this.winPic = new Sprite(texture[1]["win_pic"]);
    this.btOk_win = new DefaultButton(["preloData","gameUI/btns/btOk_win"]);
    this.btOk_win
        .on('click', function(){_this.plateAnimation("clear");})
        .on('tap', function(){_this.plateAnimation("clear");});
    this.btClose = new DefaultButton(["preloData","gameUI/btns/btClose"]);
    function btCloseFn(){
        _this.btOk.interactive = _this.btTrash.interactive = true;
        _this.plateAnimation("hide");
    }
    this.btClose
        .on('click', btCloseFn)
        .on('tap', btCloseFn);
    this.plateCont.addChild(new Sprite(texture[1]["win"]), this.winPic, this.btOk_win, this.btClose);
    this.plateCont.pivot.set(stateWidth/2, stateHeight/2-50);
    this.winCont.addChild(bg, this.plateCont);
    this.winCont.visible = false;
    this.cakeCont = new Container();
    this.cakeStartPos = {x:410, y:115};
    this.cakeCont.position.set(this.cakeStartPos.x, this.cakeStartPos.y);
    this.decorCont = new Container();
    this.lastDecor = null;
    this.rouletteCont = new Container();
    this.rouletteCont.y = stateHeight;
    this.cat = new Sprite(texture[1]["catBg_01"]);
    this.cat.anchor.y = 1;
    var catLine = new Sprite(this.texturs2["catLine"]);
    catLine.anchor = this.cat.anchor;
    catLine.scale.set(1.33,1.33);
    var r = 293;
    this.catBg = new PIXI.Graphics();
    this.catBg.beginFill(0xffffff,.6);
    this.catBg.moveTo(0, 0);
    this.catBg.lineTo(r, 0);
    this.catBg.arc(r, 0, r, Math.PI*90/180, Math.PI);
    this.catBg.pivot.set(r, 0);
    this.catBg.rotation = -Math.PI;
    this.catBg.y = this.rouletteCont.y;
    this.btContMenu = new Container();
    this.btContTween = null;
    var arrow = new Sprite(this.texturs2["arrow_cat"]);
    this.arrow_prev = new DefaultButton(arrow, {x:arrow.width/2, y:-240}, this.rotBtCont.bind(this));
    arrow = new Sprite(this.texturs2["arrow_cat"]);
    this.arrow_next = new DefaultButton(arrow, {x:240, y:-arrow.width/2, rotation:-Math.PI*90/180}, this.rotBtCont.bind(this));
    this.btGlow = new PIXI.Graphics();
    this.btGlow.lineStyle(0);
    this.btGlow.beginFill(0xFFFFFF, 1);
    this.btGlow.drawCircle(0, 0, 35);
    this.btGlow.endFill();
    var btGlowFilter = new PIXI.filters.BlurFilter();
    btGlowFilter.blur = 2;
    this.btGlow.filters = [btGlowFilter];
    this.btContMenu.addChild(this.btGlow);
    this.rouletteCont.addChild(this.cat, catLine, this.btContMenu, this.arrow_next, this.arrow_prev);
    var totalCat = 10;
    for(var i = 0; i < totalCat; i++){
        var frame = "cat_0" + (i + 1);
        if(i + 1===totalCat)frame = "cat_" + (i + 1);
        var newRot = 95 + 9 *i;
        var btCat =  new DefaultButton(new Sprite(this.texturs3[frame]), {x: - 325 * Math.cos((Math.PI * newRot) / 180), y: - 320 * Math.sin((Math.PI * newRot) / 180)}, this.selectCat);
        btCat.name = i + 1;
        this.rouletteCont.addChild(btCat);
        if(i>=3 && i<=9)btCat.dragEll = true;
        if(i===0){
            this.lastCat = btCat;
            this.scaleBt(btCat, 5, 1.4, false);
        }
    }
    var totalBtnsInSegment = 5;
    var totalSegments = 4;
    var distRotBtn = 15;
    var dist = 240;
    this.startDrag = function(e){
        var num = e.target.name + _this.lastCat.name;
        if(_this.lastCat.dragEll){
            gameUI.cont.interactiveChildren = false;
            soundBt.cont.interactiveChildren = false;
            _this.rouletteCont.interactiveChildren = false;
            _this.btContMenu.interactiveChildren = false;
            _this.btContDecor.interactiveChildren = false;
            _this.btOk.interactive = false;
            _this.btTrash.interactive = false;
            e.target.filters = null;
            e.target.scale.set(1, 1);
            new DecorPart("objcts/" + _this.catName[+ _this.lastCat.name - 1] + "_" + e.target.name.split("_")[1], e);
        }else{
            _this.selectElement(e);
            resources.selectBt.sound.play();
        }
    }
    for(var i = 0 ;i < totalSegments; i++){
        for(var j = 0 ;j < totalBtnsInSegment; j++) {
            var getNum = j + totalBtnsInSegment*i + 1;
            var frame = "_0" + getNum;
            if(getNum>=10)frame = "_" + getNum;
            var newRot = 90*i + distRotBtn*(j+1);
            var _x = - dist * Math.cos((Math.PI * newRot) / 180);
            var _y = - dist * Math.sin((Math.PI * newRot) / 180);
            var bt =  new DefaultButton(new Sprite(texture[2]["shape" + frame]), {x:_x, y:_y});
            bt
                .on('mousedown', this.startDrag)
                .on('touchstart', this.startDrag);
            bt.name = "bt"+frame;
            this.btContMenu.addChild(bt);
        }
    }
    this.btContDecor = new Container();
    var plateDist = 2;
    var totalBtns = 6;
    for(var i = 0; i < totalBtns; i++){
        var bt, plate =  new Sprite(this.texturs2["plateForBt"]);
        this.btContDecor.addChild(plate);
        plate.position.set((stateWidth-(plate.width+plateDist)*totalBtns-7) + i*(plate.width+plateDist), stateHeight-(plate.height+plateDist));
        var ind = "btn_0"+(i+1);
        if(i+1===4)ind = "btn_03";
        bt = new Sprite(this.texturs2[ind]);
        bt.name = i+1;
        i+1!==4?this.btContDecor.addChild(new DefaultButton(bt, {x:plate.x+plateDist+1+bt.width/2, y:plate.y+plateDist+bt.height/2}, this.decorControl.bind(this))):this.btContDecor.addChild(new DefaultButton(bt, {x:plate.x+bt.width/2, y:plate.y+plateDist+bt.height/2, scaleX:-1}, this.decorControl.bind(this)));
    }
    this.drawMask = new PIXI.Graphics();
    this.brush = new Sprite(this.texturs2["print_brush"]);
    this.brush.anchor.set(.75, 0);
    this.paintProp = {totalPart: 10, totalTime: 450, rectWidth: 0, counter: 0, lastPrint: null};
    this.shapeMask = new Sprite(resources.shape_01.texture);
    this.print = new Sprite(this.texturs["objcts/pr_01"]);
    this.printCont = new Container();
    this.shape = new Sprite(this.texturs["objcts/shape_01"]);
    this.printCont.addChild(this.print, this.shapeMask);
    this.print.mask = this.shapeMask;
    this.cakeCont.addChild(this.shape, this.printCont, this.drawMask);
    this.printCont.mask = this.drawMask;
    this.btContDecor.darcFilter = new PIXI.filters.ColorMatrixFilter();
    this.btContDecor.darcFilter.brightness(.8, false);
    this.particleCont = new Container();
    this.decorParticleCont = new Container();
    this.emitter = new PIXI.particles.Emitter(this.particleCont, [resources.particle.texture], resources.colorPouffe.data);
    this.emitter.updateOwnerPos(this.cakeCont.x+this.cakeCont.width/2, this.cakeCont.y+this.cakeCont.height/2);
    this.emitter.emit = false;
    this.emitter2 = new PIXI.particles.Emitter(this.particleCont, [resources.particle2.texture], resources.shapePouffe.data);
    this.emitter2.updateOwnerPos(this.cakeCont.x+this.cakeCont.width/2, this.cakeCont.y+this.cakeCont.height/2);
    this.emitter2.emit = false;
    this.emitter3 = new PIXI.particles.Emitter(this.cont, [resources.bubb_01.texture, resources.bubb_02.texture, resources.bubb_03.texture, resources.bubb_04.texture, resources.bubb_05.texture], resources.bubblesVert.data);
    this.emitter3.emit = false;
    this.pers = new PIXI.spine.Spine(resources.fynsy.spineData);
    this.pers.skeleton.setSkinByName("full_face");
    this.pers.position.set(275, 450);
    this.pers.state.setAnimation(0, 'idle_01', true);
    this.pers.state.timeScale = 0;
    this.table = new Container();
    var tabletop = new Sprite(resources.tabletop.texture);
    tabletop.y = stateHeight-tabletop.height;
    this.table.addChild(tabletop, this.stand, this.pers, this.cakeCont);
    this.cont.addChild(new Sprite(resources.game_bg.texture), this.table, this.catBg, this.rouletteCont, this.btContDecor/*, this.decorParticleCont*/, this.decorCont, this.brush, this.particleCont, this.btTrash, this.btOk, this.winCont);
    this.brush.position = this.cakeCont.position;
    this.brush.visible = false;
}
Game.prototype.onStartPrepar = function(){
    this.drawMask.clear();
    this.paintProp.lastPrint = null;
    this.shape.tint = "0xffffff";
    this.changeCat(1);
    this.btContMenu.interactiveChildren = true;
    this.btContMenu.rotation = Math.PI * 0 / 180;
    while(this.decorCont.children.length>0)
        removeDecor(this.decorCont.getChildAt(0));
    this.btContMenu.children.forEach(function(item, i, arr) {
        if(item.name) item.rotation = Math.PI * 0 / 180;
    });
    this.scaleBt(this.lastCat, 0, 1, true);
    this.lastCat = this.rouletteCont.getChildByName(1);
    this.scaleBt(this.rouletteCont.getChildByName(1), 5, 1.4, false);
    this.btGlow.visible = false;
    this.pers.state.clearListeners();
    this.pers.state.timeScale = .75;
    this.drawPrint = null;
    this.catBg.tint = "0x"+this.catColor[0];
    this.cakeCont.filters = null;
    this.decorCont.filters = null;
    this.cakeCont.position.set(this.cakeStartPos.x, this.cakeStartPos.y);
    this.decorCont.position.set(0,0);
    this.cakeCont.scale.set(1);
    this.decorCont.scale.set(1);
    this.cakeCont.visible = false;
    this.btContDecor.filters = [this.btContDecor.darcFilter];
    this.btTrash.filters = [this.btContDecor.darcFilter];
    this.btOk.filters = [this.btContDecor.darcFilter];
    this.btContDecor.interactiveChildren = false;
    this.btTrash.interactive = false;
    this.btOk.interactive = false;
    this.btContDecor.alpha = this.btTrash.alpha = this.btOk.alpha = .8;
}
Game.prototype.decorControl = function(e){
    switch(e.target.name){
        case 1:
            if(this.lastDecor.scale.y<=1.4){
                resources.transformDecor.sound.play();
                this.lastDecor.scale.x<0?this.lastDecor.scale.x -= .1:this.lastDecor.scale.x += .1;
                this.lastDecor.scale.y += .1;
            }else{
                resources.stopBtIfPaint.sound.play();
            }
            break;
        case 2:
            if(this.lastDecor.scale.y>.3){
                resources.transformDecor.sound.play();
                this.lastDecor.scale.x>0?this.lastDecor.scale.x -= .1:this.lastDecor.scale.x += .1;
                this.lastDecor.scale.y -= .1;
            }else{
                resources.stopBtIfPaint.sound.play();
            }
            break;
        case 3:
            resources.transformDecor.sound.play();
            this.lastDecor.rotation -= Math.PI*15/180;
            break;
        case 4:
            resources.transformDecor.sound.play();
            this.lastDecor.rotation += Math.PI*15/180;
            break;
        case 5:
            resources.transformDecor.sound.play();
            this.lastDecor.scale.x = - this.lastDecor.scale.x;
            break;
        case 6:
            removeDecor(this.lastDecor);
            resources.removeDecorSnd.sound.play();
            return;
            break;
    }
    if(this.lastDecor.y < stateHeight-(this.btContDecor.height+ this.lastDecor.height/2)){
        this.btContDecor.filters = null;
        this.btContDecor.alpha = 1;
        this.btContDecor.interactiveChildren = true;
    }else{
        this.btContDecor.filters = [this.btContDecor.darcFilter];
        this.btContDecor.alpha = .8;
        this.btContDecor.interactiveChildren = false;
    }
}
Game.prototype.rotBtCont = function(e){
    if(this.btContTween === null || !this.btContTween.active){
        resources.arrowSnd.sound.play();
        this.btContTween = PIXI.tweenManager.createTween(this.btContMenu);
        this.btContTween.time = 1000;
        var PI = Math.PI;
        if(e.target.rotation === 0)PI = -PI;
        var rad = game.btContMenu.rotation - PI * 90 / 180;
        this.btContTween.to({rotation: rad});
        this.btContTween.start();
        this.btContMenu.children.forEach(function(item, i, arr) {
            if(item.name){
                var btTween = PIXI.tweenManager.createTween(item);
                btTween.time = 1000;
                var btRad = item.rotation + PI * (90-360) / 180;
                btTween.to({rotation: btRad});
                btTween.start();
            }
        });
    }
}
Game.prototype.selectElement = function(e){
    var _this = this;
    this.btGlow.position.set(e.target.x, e.target.y);
    this.btGlow.visible = true;
    switch(this.catName[+ this.lastCat.name - 1]){
        case "shape":
            resources.shapeSnd.sound.play();
            if(!this.cakeCont.visible){
                this.cakeCont.visible = true;
                this.btTrash.filters = null;
                this.btOk.filters = null;
                this.btTrash.interactive = true;
                this.btOk.interactive = true;
                this.btTrash.alpha = this.btOk.alpha = 1;
            }
            this.emitter2.emit = true;
            this.emitter2.startColor = hex2rgb(this.shape.tint);
            this.shape.texture = PIXI.utils.TextureCache["objcts/" + this.catName[+ this.lastCat.name - 1] + "_" + e.target.name.split("_")[1]];
            this.shape.textureName = this.catName[+ this.lastCat.name - 1] + "_" + e.target.name.split("_")[1];
            this.shapeMask.texture = PIXI.utils.TextureCache[resources[("shape_" + e.target.name.split("_")[1])].url];
            var _x = (this.stand._texture.trim.x + this.stand._texture.trim.width/2) - this[(this.catName[+ this.lastCat.name - 1])].width/2;
            var _y = this.stand._texture.trim.y + this.stand._texture.trim.height/1.2 - (this[(this.catName[+ this.lastCat.name - 1])].height+15);
            this.cakeCont.position.set(_x, _y);
            break;
        case "col":
            resources.colorSnd.sound.play();
            this.emitter.emit = true;
            this.emitter.startColor = hex2rgb(this.shapeColor[+ e.target.name.split("_")[1] - 1]);
            this.shape.tint = "0x"+this.shapeColor[+ e.target.name.split("_")[1] - 1];
            break;
        case "pr":
            if(this.paintProp.lastPrint !== "objcts/pr_" + e.target.name.split("_")[1]){
                this.drawMask.clear();
                if(this.brush.visible && this.brush.tween.active){
                    _this.brush.tween.stop().reset();
                    clearInterval(this.drawPrint);
                }
                this.paintProp.lastPrint = "objcts/pr_" + e.target.name.split("_")[1];
                this.print.texture = PIXI.utils.TextureCache[this.paintProp.lastPrint];
                this.paintProp.rectWidth = this.shape.width/this.paintProp.totalPart;
                this.paintProp.counter = 0;
                this.brush.scale.y = 1;
                this.brush.position.set(this.cakeCont.x + this.paintProp.rectWidth/2,  this.cakeCont.y);
                this.brush.visible = true;
                if(!this.brush.tween){
                    this.brush.tween = PIXI.tweenManager.createTween(this.brush);
                    this.brush.tween.time = this.paintProp.totalTime*2;
                    this.brush.tween.pingPong = true;
                    this.brush.tween.loop = true;
                    this.brush.tween.to({y: this.cakeCont.y + this.cakeCont.height});
                }
                this.brush.tween.start();
                this.drawPrint = setInterval(function(){
                    resources.paintSnd.sound.play();
                    _this.drawMask.beginFill(0xffffff, 1);
                    _this.drawMask.drawRect(_this.paintProp.rectWidth*_this.paintProp.counter, 0, _this.paintProp.rectWidth, 350);
                    _this.drawMask.endFill();
                    _this.brush.x += _this.paintProp.rectWidth;
                    _this.brush.scale.y = -_this.brush.scale.y;
                    _this.paintProp.counter += 1;
                    if(_this.paintProp.counter===_this.paintProp.totalPart){
                        _this.brush.visible = false;
                        _this.brush.tween.stop().reset();
                        clearInterval(_this.drawPrint);
                    }
                }, this.paintProp.totalTime);
            }
            break;
    }
}
Game.prototype.finalStageManag = function(visibility){
    if(visibility === "hide"){
        if(this.lastDecor) {
            this.lastDecor.filters = null;
            //this.lastDecor.shine.visible = false;
            this.lastDecor = null;
            this.btContDecor.filters = [this.btContDecor.darcFilter];
            this.btContDecor.alpha = .8;
            this.btContDecor.interactiveChildren = false;
        }
        this.cont.interactiveChildren = false;
        this.objTween(this.catBg, {x:-stateWidth/2});
        this.objTween(this.rouletteCont, {x:-stateWidth/2});
        this.objTween(this.btContDecor, {y:this.btContDecor.height*1.05});
        this.objTween(this.cont.getChildAt(0), {x:stateWidth-this.cont.getChildAt(0).width});
        this.objTween(this.table, {x:stateWidth-this.table.getChildAt(0).width});
        this.objTween(this.decorCont, {x:stateWidth-this.table.getChildAt(0).width});
    }else{//"show"
        this.winCont.visible = true;
        this.winManag();
        this.cont.interactiveChildren = true;
        this.catBg.x = this.rouletteCont.x = -stateWidth/2;
        this.btContDecor.y = this.btContDecor.height*1.05;
        this.cont.getChildAt(0).x = stateWidth-this.cont.getChildAt(0).width;
        this.table.x = this.decorCont.x = stateWidth-this.table.getChildAt(0).width;
        this.objTween(this.catBg, {x:.1});
        this.objTween(this.rouletteCont, {x: .1});
        this.objTween(this.btContDecor, {y:.1});
        this.objTween(this.cont.getChildAt(0), {x:.1});
        this.objTween(this.table, {x:.1});
        this.objTween(this.decorCont, {x:.1});
        this.pers.state.clearListeners();
        this.pers.state.timeScale = .75;
        this.pers.state.setAnimation(0, 'idle_01', true);
    }
}
Game.prototype.objTween = function(obj, pos){
    if(obj.t)delete obj.t;
    obj.t = PIXI.tweenManager.createTween(obj);
    obj.t.time = 1000;
    if(pos.x)obj.t.to({x:pos.x});
    if(pos.y)obj.t.to({y:pos.y});
    obj.t.start();
}
Game.prototype.persMood = function(animName){
    var _this = this;
    this.pers.state.clearListeners();
    if(animName){
        this.countVoice += 1;
        if(this.countVoice>=6)_this.countVoice = 1;
        this.voice = resources[("persVoice_0"+_this.countVoice)].sound.play();
        this.pers.state.setAnimation(0, animName, true);
        this.pers.state.addListener({ complete: function(track, event) {
            _this.pers.state.setAnimation(0, 'idle_01', true);
        }});
    }else{
        this.pers.state.timeScale = 1.5;
        this.pers.state.addListener({ complete: function(track, event) {
            _this.pers.state.clearListeners();
            if(_this.shape.tint !== "0xffffff" && _this.paintProp.lastPrint && _this.decorCont.children.length >= 3){
                _this.pers.state.timeScale = .75;
                resources.happyFinal.sound.play();
                _this.emitter3.emit = true;
                _this.pers.state.setAnimation(0, 'idle_02', true);
                _this.emitter3.frequency = 0.07;
                _this.emitter3.maxParticles = 100;
                var bubbTime = setTimeout(function(){
                    _this.countVoice += 1;
                    if(_this.countVoice>=3/*4*/)_this.countVoice = 1;
                    resources[("finalVoice_0"+_this.countVoice)].sound.play();
                    clearTimeout(bubbTime);
                    _this.emitter3.frequency = 0.5;
                    _this.emitter3.maxParticles = 10;
                }, 1000);
            }else{
                _this.pers.state.timeScale = .5;
                _this.pers.state.setAnimation(0, 'sad_01', true);
                _this.countVoice += 1;
                if(_this.countVoice>=3/*4*/)_this.countVoice = 1;
                resources[("sadVoice_0"+_this.countVoice)].sound.play();
            }
        }});
    }
}
function DecorPart (textureName, event){
    resources.selectDecor.sound.play();
    if(game.lastDecor)game.lastDecor.filters = null;
    var decor = new Sprite(game.texturs2[textureName]);
    game.decorCont.addChild(decor);
    setPivotPoint(decor);
    var mouseData = event.data.global;
    decor.position.set(mouseData.x, mouseData.y);
    decor.interactive = true;
    decor.data = event.data;
    decor.alpha = 0.75;
    decor.dragging = true;
    decor
        .on('mouseup', onDragEnd)
        .on('mouseupoutside', onDragEnd)
        .on('touchend', onDragEnd)
        .on('touchendoutside', onDragEnd)

        .on('mousemove', onDragMove)
        .on('touchmove', onDragMove);
    function onDragStart(event){
        resources.selectDecor.sound.play();
        gameUI.cont.interactiveChildren = false;
        soundBt.cont.interactiveChildren = false;
        game.rouletteCont.interactiveChildren = false;
        game.btContMenu.interactiveChildren = false;
        game.btContDecor.interactiveChildren = false;
        game.btOk.interactive = false;
        game.btTrash.interactive = false;
        if(game.lastDecor)game.lastDecor.filters = null;
        this.data = event.data;
        this.alpha = 0.75;
        this.dragging = true;
        this.parent.setChildIndex(this, this.parent.children.length-1);
        this.filters = null;
    }
    function onDragEnd(e) {
        if(e.target && e.target.data){
            var newPosition = {x: e.target.x, y: e.target.y};
            if(newPosition.x < stateWidth/2 || newPosition.x > stateWidth || newPosition.y > stateHeight || newPosition.y < 0){
                resources.removeDecorSnd.sound.play();
                removeDecor(e.target);
            }else{
                resources.putDecor.sound.play();
                e.target.alpha = 1;
                e.target.dragging = false;
                e.target.data = null;
                    e.target.filters = [game.decorBord];
                if(!e.target.buttonMode){
                    e.target.hitArea = new PIXI.Polygon(getPoligon(resources.dataGame2.data.frames[(textureName)].vertices));
                    e.target.buttonMode = true;
                    e.target
                        .on('mousedown', onDragStart)
                        .on('touchstart', onDragStart);
                }
                game.lastDecor = e.target;
                if(!game.btContDecor.interactiveChildren ){
                    if(newPosition.y < stateHeight-(game.btContDecor.height+ e.target.height/2)){
                        game.btContDecor.filters = null;
                        game.btContDecor.alpha = 1;
                        game.btContDecor.interactiveChildren = true;
                    }else{
                        game.btContDecor.filters = [game.btContDecor.darcFilter];
                        game.btContDecor.alpha = .8;
                    }
                }
            }
            gameUI.cont.interactiveChildren = true;
            soundBt.cont.interactiveChildren = true;
            game.rouletteCont.interactiveChildren = true;
            game.btContMenu.interactiveChildren = true;
            game.btOk.interactive = true;
            game.btTrash.interactive = true;
        }
    }
    function onDragMove(e) {
        if (this.dragging){
            var newPosition = this.data.getLocalPosition(this.parent);
            this.x = newPosition.x;
            this.y = newPosition.y;
        }
    }
    return this;
}
function removeDecor(decor){
    decor.dragging = false;
    decor.data = null;
    decor.filters = null;
    decor.parent.removeChild(decor);
    decor = undefined;

    game.lastDecor = null;
    game.btContDecor.filters = [game.btContDecor.darcFilter];
    game.btContDecor.alpha = .8;
    game.btContDecor.interactiveChildren = false;
}

