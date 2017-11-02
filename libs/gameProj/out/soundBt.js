function SoundBt(){
    this.cont = new createjs.Container();
    this.cont.mouseEnabled = false;
    this.cont.visible = false;
    this.bgSound = null;
}
extend(SoundBt, State);
SoundBt.prototype.soundOn_Off = function (e){
    createjs.Sound.play("clickIn");
    if(this.sound_on.visible===true){
        this.sound_on.visible = false;
        this.sound_off.visible = true;
        createjs.Sound.setMute(true);
        soundBt.bgSound.setMuted(true);
    }else{
        this.sound_on.visible = true;
        this.sound_off.visible = false;
        createjs.Sound.setMute(false);
        soundBt.bgSound.setMuted(false);
    }
}
SoundBt.prototype.init = function(){
    this.cont.setChildIndex(this.sound_off, 0);
    this.cont.on("click", this.soundOn_Off.bind(this));
}
SoundBt.prototype.play = function(soundId){
    if(this.bgSound !== null){
        this.bgSound.stop();
        this.bgSound = null;
    }
    this.bgSound = createjs.Sound.play(soundId, {interrupt: createjs.Sound.INTERRUPT_NONE, loop: -1, volume:.7});
}
