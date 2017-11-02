function Preview(){
    this.cont = new Container();
    this.cont.interactiveChildren = false;
    this.cont.visible = false;
    return this;
}
extend(Preview, State);
Preview.prototype.init = function(){
    this.cont.name = "in_game_logo";
    this.beam = new Sprite(resources.beam.texture);
    this.beam.anchor.set(.5,.5);
    this.beam.position.set(stateWidth/2, stateHeight/2);
    this.logo = new PIXI.spine.Spine(resources.preview.spineData);
    this.logo.position.set(stateWidth/2, stateHeight/2+65);
    this.logo.state.setAnimation(0, 'animation', false);
    var slotName = "ru";
    if(slotName !== this.determLang())slotName = "com";
    this.logo.skeleton.setAttachment("com2", slotName);
    this.logo.state.timeScale = 0;
    this.cont.addChild(new Sprite(resources.prev_bg.texture), this.beam, this.logo);
    this.beam.t = PIXI.tweenManager.createTween(this.beam);
    this.beam.t.from({rotation: 0});
    this.beam.t.to({rotation: PIXI.DEG_TO_RAD * 359});
    this.beam.t.time = 5000;
    this.beam.t.loop = true;
    this.cont.interactive = true;
    this.cont
        .on("click", this.getMoreGame.bind(this))
        .on("tap", this.getMoreGame.bind(this));
}
Preview.prototype.play = function(){
    var _this = this;
    this.cont.interactiveChildren = true;
    this.beam.t.start();
    this.logo.state.timeScale = 1;
    this.logo.state.tracks[0].listener = {
        complete: function(entry, event) {
            const instance = resources.prevFynsyVoice.sound.play();
            instance.on('end', function() {
                soundBt.bgSound.play({loop:true});
                soundBt.cont.visible = true;
                startSplash();
            });
        }
    }
}

