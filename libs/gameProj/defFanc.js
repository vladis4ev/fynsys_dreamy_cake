function appendScript(str) {
    var wf = document.createElement('script');
    wf.src = ('https:' === document.location.protocol ? 'https' : 'http') + str;
    wf.type = 'text/javascript';
    wf.async = 'true';
    var s = document.getElementsByTagName('script')[0];
    s.parentNode.insertBefore(wf, s);
    return wf;
}
function resizeGame(event){
    scaleToWindow(document.getElementById("mainContainer"));
}
function handleVisibilityChange() {
    if(isvisible) {
        isvisible = false;
        if(soundBt.bgSound)soundBt.bgSound.toggleMute = true;
        var stopTime = setTimeout(function(){
            PIXI.sound.muteAll();
            clearTimeout(stopTime);
        }, 50);
    } else {
        isvisible = true;
        if(!soundBt)PIXI.sound.unmuteAll();
        else{
            if(soundBt.iconON.visible){
                PIXI.sound.unmuteAll();
                if(soundBt.bgSound)soundBt.bgSound.toggleMute = false;
            }
        }
    }
}
function hex2rgb(hexCol){
    var tmpArray = [];
    var hexNum = parseInt(hexCol, 16);
    PIXI.utils.hex2rgb(hexNum, tmpArray);
    tmpArray[0] = tmpArray[0]*255;
    tmpArray[1] = tmpArray[1]*255;
    tmpArray[2] = tmpArray[2]*255;
    return tmpArray;
}
function getPoligon(textureVertices){
    var poligon = [];
    var maxI = textureVertices.length;
    for(var i = 0; i< maxI; i++)
        poligon.push(new PIXI.Point(textureVertices[i][0], textureVertices[i][1]));
    return poligon;
}
function setPivotPoint(sprite, predef){
    var pos, obj;
    sprite.texture.trim === null ? obj = sprite : obj = sprite.texture.trim;
    switch (predef){
        case "bottomCenter":
            pos = {x:obj.x + obj.width/2, y:obj.y + obj.height};
            break;
        case "custom":
            pos = {x:obj.x + obj.width*customParam.x, y:obj.y + obj.height*customParam.y};
            break;
        default://center
            pos = {x:obj.x + obj.width/2, y:obj.y + obj.height/2};
            break;
    }
    sprite.pivot.set(pos.x, pos.y);
    sprite.position.set(pos.x, pos.y);
}
var getRandomInt = function(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}
function UniqueRandom(min, max){
    var _this = this;
    var array = [];
    this.rewriteArray = function(){
        for(var i = min; i < max+1; i++)
            array.push(i);
        return array;
    }
    this.generNum = function(){
        var maxNum = array.length;
        var num = getRandomInt(1, maxNum);
        res = array[num-1];
        array.splice(num-1, 1);
        return res;
    }
    this.getNum = function(){
        if(array.length == 0)
            array = _this.rewriteArray();
        return _this.generNum();
    }
    this.rewriteArray();
}
function DefaultButton(sprite, position, onButtonClick){
    var bt;
    this.filter = new PIXI.filters.ColorMatrixFilter();
    sprite.pluginName==="sprite"?bt = sprite:bt = new Sprite(resources[sprite[0]].textures[sprite[1]]);
    this.lastBt = bt;
    bt.buttonMode = true;
    bt.interactive = true;
    if(bt.texture.trim){
        bt.hitArea = new PIXI.Polygon(getPoligon(resources[sprite[0]].data.frames[(sprite[1])].vertices));
        setPivotPoint(bt);
        this.relScale = Math.floor(stateWidth/bt.texture.trim.width)/100;
    }else{
        bt.anchor.set(.5,.5);
        if(position){
            bt.position.set(position.x, position.y);
            if("rotation" in position)bt.rotation = position.rotation;
            if("scaleX" in position)bt.scale.x = position.scaleX;
        }
        this.relScale = Math.floor(stateWidth/bt.width)/100;
    }
    var detectMob = PIXI.utils.isMobile;
    if(!detectMob.phone && !detectMob.tablet){
        bt
            .on('mousedown', this.onButtonHandler.bind(this))
            .on('touchstart', this.onButtonHandler.bind(this))
            .on('mouseup', this.onButtonHandler.bind(this))
            .on('touchend', this.onButtonHandler.bind(this))
            .on('mouseupoutside', this.onButtonHandler.bind(this))
            .on('touchendoutside', this.onButtonHandler.bind(this))
            .on('mouseover', this.onButtonHandler.bind(this))
            .on('mouseout', this.onButtonHandler.bind(this));
        if(onButtonClick!==undefined)
            bt
                .on('click', onButtonClick)
    }else{
        if(onButtonClick!==undefined)
            bt
                .on('tap', onButtonClick);
    }
    return bt;
}
DefaultButton.prototype.onButtonHandler = function(e){
    switch(e.type){
        case "touchstart":
        case "mousedown":
            this.filter.brightness(.9, false);
            e.target.filters = [this.filter];
            e.target.scale.x>0?e.target.scale.set(e.target.scale.x-this.relScale, e.target.scale.y-this.relScale):e.target.scale.set(-.95,.95);
            break;
        case "mouseup":
        case "touchend":
        case "mouseupoutside":
        case "touchendoutside":
            this.lastBt.filters = null;
            this.lastBt.scale.x>0?this.lastBt.scale.set(1,1):this.lastBt.scale.set(-1,1);
            break;
        case "mouseover":
            this.filter.brightness(1.1, false);
            e.target.filters = [this.filter];
            e.target.scale.x>0?e.target.scale.set(e.target.scale.x+this.relScale, e.target.scale.y+this.relScale):e.target.scale.set(-1.05, 1.05);
            break;
        case "mouseout":
            this.lastBt.filters = null;
            this.lastBt.scale.x>0?this.lastBt.scale.set(1, 1):this.lastBt.scale.set(-1, 1);
            break;
    }
}