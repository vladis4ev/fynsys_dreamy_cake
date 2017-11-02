function SoundBt(){
    this.cont = new Container();
    this.cont.visible = false;
    return this;
}
SoundBt.prototype.init = function(){
    var _this = this;
    this.dist = 60;
    this.iconON = new DefaultButton(["preloData", "soundBt/btns/sound_on"]);
    this.iconOFF = new DefaultButton(["preloData", "soundBt/btns/sound_off"]);
    this.iconPlate = new Sprite(resources.preloData.textures["soundBt/btns/sound_plate"]);
    this.iconBagBearer = new Sprite(resources.preloData.textures["soundBt/btns/sound_bag"]);
    this.bgSound = resources.bgMusic.sound;
    this.iconOFF.visible = false;
    this.cont.interactive = true;
    this.iconBagBearer.interactive = true;
    this.iconBagBearer.buttonMode = true;
    this.iconBagBearer.hitArea = new PIXI.Circle(this.iconBagBearer.texture.trim.x+this.iconBagBearer.texture.trim.width/2, this.iconBagBearer.texture.trim.y+this.iconBagBearer.texture.trim.height/2, this.iconBagBearer.texture.trim.width/2);
    setPivotPoint(this.iconBagBearer);
    this.bgSound.volume = .5;
    this.iconBagBearer.x +=  this.dist/2;
    var detectMob = PIXI.utils.isMobile;
    if(!detectMob.phone && !detectMob.tablet){
        this.iconON
            .on("click", this.soundOn_Off.bind(this));
        this.iconOFF
            .on("click", this.soundOn_Off.bind(this));
        this.cont
            .on('mouseover', showPlate.bind(this))
            .on('mouseout', showPlate.bind(this));
        this.iconBagBearer
            .on('mousedown', startDrag)
            .on('mouseup', stopDrag)
            .on('mouseupoutside', stopDrag)
            .on('mousemove', dragMove);
    }else{
        this.cont
            .on("tap", this.soundOn_Off.bind(this));
    }

    this.cont.addChild(this.iconPlate, this.iconON, this.iconOFF, this.iconBagBearer);
    this.iconPlate.visible = false;
    this.iconBagBearer.visible = false;
    function showPlate (event){
        if(event.type === "mouseover"){
            this.iconPlate.visible = true;
            this.iconBagBearer.visible = true;
            this.cont.hitArea = new PIXI.Rectangle(this.iconPlate.texture.trim.x, this.iconPlate.texture.trim.y, stateWidth - this.iconPlate.texture.trim.x, this.iconPlate.texture.trim.height);
        }
        if(event.type === "mouseout"){
            this.iconPlate.visible = false;
            this.iconBagBearer.visible = false;
            this.cont.hitArea = null;
            this.iconBagBearer.dragging = false;
            this.iconBagBearer.alpha = 1;
        }
    }
    function startDrag (event){
        this.data = event.data;
        this.alpha = 0.75;
        this.dragging = true;
    }
    function stopDrag (event){
        this.alpha = 1;
        this.dragging = false;
        this.data = null;
    }
    function dragMove (event){
        if (this.dragging) {
            var newPosition = this.data.getLocalPosition(this.parent);
            this.x = newPosition.x;
            if(this.x<this.texture.trim.x+this.texture.trim.width/2)
                this.x=this.texture.trim.x+this.texture.trim.width/2;
            if(this.x>this.texture.trim.x+this.texture.trim.width/2+_this.dist)
                this.x=this.texture.trim.x+this.texture.trim.width/2+_this.dist;
            _this.bgSound.volume = 1-(this.x-(this.texture.trim.x+this.texture.trim.width/2))/_this.dist;
        }
    }
}
SoundBt.prototype.soundOn_Off = function(){
    resources.clickIn.sound.play();
    if(this.iconON.visible===true){
        this.cont.interactive = false;
        this.iconPlate.visible = false;
        this.iconBagBearer.visible = false;
        this.iconON.visible = false;
        this.iconOFF.visible = true;
        PIXI.sound.muteAll();
        isvisible = false;
    }else{
        this.cont.interactive = true;
        this.iconPlate.visible = true;
        this.iconBagBearer.visible = true;
        this.iconON.visible = true;
        this.iconOFF.visible = false;
        PIXI.sound.unmuteAll();
        isvisible = true;
    }
}


