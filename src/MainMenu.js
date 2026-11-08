class MainMenu extends Phaser.Scene {
    constructor() {
        super('MainMenu');
        this.bgFilesLoaded = false;
    }
    create() {
        EPT.setWorldSize(this, EPT.isWide());
        EPT.watchLayout(this);
        var wide = EPT.world.width > 640;
        var cx = EPT.world.centerX;
        // everything on the left/right half in landscape, one column in portrait
        this.pos = wide ? {
            logo: {x: 320, y: 200}, intro: {x: 320, y: 300}, tiles: {x: 320, y: 560},
            player1: {x: 960, y: 230}, player2: {x: 960, y: 350}, start: {x: 960, y: 520}
        } : {
            logo: {x: cx, y: 150}, intro: {x: cx, y: 250}, tiles: {x: cx, y: EPT.world.height-100},
            player1: {x: cx, y: 420}, player2: {x: cx, y: 540}, start: {x: cx, y: EPT.world.height-250}
        };

        EPT.strip(this, 'background', 0, true);
        EPT.strip(this, 'img-topbar', 0);

        this.player1Selected = false;
        this.player2Selected = false;
        this.waitingForSettings = false;

        this.logoCounter = this.add.sprite(this.pos.logo.x, this.pos.logo.y, 'logo-counter', 1);
        this.logoCounter.setOrigin(0.5, 0.5);

		var fontMenuIntro = { font: EPT.text['STYLE']+'30px '+EPT.text['FONT'], fill: '#000', align: 'center' };
		this.add.text(this.pos.intro.x, this.pos.intro.y, EPT.text['menu-intro'], fontMenuIntro).setOrigin(0.5, 0);

        this.buttonPlayer1 = new Button(this.pos.player1.x, this.pos.player1.y, 'button-player1-'+EPT.Lang.current, this.clickPlayer1, this).setOrigin(0.5);
        this.buttonPlayer2 = new Button(this.pos.player2.x, this.pos.player2.y, 'button-player2-'+EPT.Lang.current, this.clickPlayer2, this).setOrigin(0.5);

        this.buttonStart = new Button(this.pos.start.x, this.pos.start.y, 'button-start-'+EPT.Lang.current, this.clickStart, this, 'noframes');
        this.buttonStart.setOrigin(0.5, 0.5).setAlpha(0.5);
        this.buttonStart.setFrame(3);
        this.buttonStart.input.enabled = false;

        if(EPT._player[1] != undefined) {
            this.buttonPlayer1.setTexture('button-change-'+EPT.Lang.current);
            this.buttonPlayer1ArmyBorder = this.add.sprite(this.buttonPlayer1.x-100, this.buttonPlayer1.y-5, 'hex-border-color');
            this.buttonPlayer1ArmyBorder.setScale(0.4);
            this.buttonPlayer1Army = this.add.sprite(this.buttonPlayer1.x-100, this.buttonPlayer1.y-5, 'tiles-hqs', EPT._player[1]);
            this.buttonPlayer1Army.setScale(0.4);
            this.player1Selected = true;

            this.buttonPlayer1ArmyBorder.setScale(0.2);
            this.tweens.add({targets: this.buttonPlayer1ArmyBorder, scaleX: 0.4, scaleY: 0.4, duration: 500, ease: 'Cubic.easeOut' });
            this.buttonPlayer1Army.setScale(0.2);
            this.tweens.add({targets: this.buttonPlayer1Army, scaleX: 0.4, scaleY: 0.4, duration: 500, ease: 'Cubic.easeOut' });
        }
		this.buttonPlayer1.setScale(0.5);
        this.tweens.add({targets: this.buttonPlayer1, scaleX: 1, scaleY: 1, duration: 500, delay: 0, ease: 'Cubic.easeOut' });

        if(EPT._player[2] != undefined) {
            this.buttonPlayer2.setTexture('button-change-'+EPT.Lang.current);
            this.buttonPlayer2ArmyBorder = this.add.sprite(this.buttonPlayer2.x-100, this.buttonPlayer2.y-5, 'hex-border-color');
            this.buttonPlayer2ArmyBorder.setScale(0.4);
            this.buttonPlayer2Army = this.add.sprite(this.buttonPlayer2.x-100, this.buttonPlayer2.y-5, 'tiles-hqs', EPT._player[2]);
            this.buttonPlayer2Army.setScale(0.4);
            this.player2Selected = true;
            if(this.player1Selected && this.player2Selected) {
                this.buttonStart.destroy();
                this.buttonStart = new Button(this.pos.start.x, this.pos.start.y, 'button-start-'+EPT.Lang.current, this.clickStart, this).setOrigin(0.5);
                this.buttonStart.setScale(0.5);
                this.tweens.add({targets: this.buttonStart, scaleX: 1, scaleY: 1, duration: 500, delay: 250, ease: 'Cubic.easeOut' });
            }
            this.buttonPlayer2ArmyBorder.setScale(0.2);
            this.tweens.add({targets: this.buttonPlayer2ArmyBorder, scaleX: 0.4, scaleY: 0.4, duration: 500, delay: 125, ease: 'Cubic.easeOut' });
            this.buttonPlayer2Army.setScale(0.2);
            this.tweens.add({targets: this.buttonPlayer2Army, scaleX: 0.4, scaleY: 0.4, duration: 500, delay: 125, ease: 'Cubic.easeOut' });
        }
		this.buttonPlayer2.setScale(0.5);
        this.tweens.add({targets: this.buttonPlayer2, scaleX: 1, scaleY: 1, duration: 500, delay: 125, ease: 'Cubic.easeOut' });

        this.initResume(wide);

        var tiles = this.add.sprite(this.pos.tiles.x, this.pos.tiles.y, 'img-tiles');
        tiles.setOrigin(0.5, 0.5);

        this.buttonSettings = new Button(EPT.world.width-20, EPT.world.height-20, 'button-settings', this.clickSettings, this, 'noframes').setOrigin(1, 1);

        this.cameras.main.fadeIn(250);

        if(!this.bgFilesLoaded) {
            this.time.addEvent({
                delay: 500,
                callback: function() {
                    this.startPreloadInTheBackground();
                },
                callbackScope: this
            }, this);
        }
    }
    initResume(wide) {
        this.saved = EPT.SaveGame.load();
        if(!this.saved) { return; }
        var w = 400, h = 60;
        if(!this.textures.exists('btn-resume')) {
            var g = this.make.graphics({x: 0, y: 0, add: false});
            g.fillStyle(0x1b1b1d, 1).fillRoundedRect(0, 0, w, h, 16);
            g.lineStyle(4, 0xfdb535, 1).strokeRoundedRect(2, 2, w-4, h-4, 14);
            g.generateTexture('btn-resume', w, h);
            g.destroy();
        }
        var x = wide ? 960 : EPT.world.centerX;
        var y = wide ? 620 : 612;
        this.buttonResume = new Button(x, y, 'btn-resume', this.clickResume, this, 'noframes').setOrigin(0.5);
        var font = { font: EPT.text['STYLE']+'30px '+EPT.text['FONT'], fill: '#fff', align: 'center' };
        this.resumeParts = [this.buttonResume, this.add.text(x, y, EPT.text['menu-resume'], font).setOrigin(0.5)];
        for(var n = 1; n <= 2; n++) {
            var hx = x+(n == 1 ? -1 : 1)*(w/2-45);
            this.resumeParts.push(this.add.sprite(hx, y-1, 'hex-border-color').setScale(0.36));
            this.resumeParts.push(this.add.sprite(hx, y-1, 'tiles-hqs', this.saved.player[n]).setScale(0.36));
        }
        this.setResumeReady(this.bgFilesLoaded);
    }
    setResumeReady(ready) {
        if(!this.buttonResume || !this.buttonResume.scene) { return; }
        this.resumeParts.forEach(function(part) { part.setAlpha(ready ? 1 : 0.5); });
        this.buttonResume.input.enabled = ready;
    }
    clickResume() {
        if(!this.bgFilesLoaded || !this.saved) { return; }
        EPT.Sfx.play('click');
        EPT._player[1] = this.saved.player[1];
        EPT._player[2] = this.saved.player[2];
        EPT._resume = this.saved;
        EPT.fadeOutScene('Game', this);
    }
    initArmySelection(number) {
        this.selection = this.add.container(EPT.world.centerX, EPT.world.centerY-200+number*100);
        this.selection.setScale(0);
        this.buttonPlayer1.input.enabled = false;
        this.buttonPlayer2.input.enabled = false;
        if(this.buttonResume) { this.buttonResume.input.enabled = false; }
        this.selectionBackground = EPT.strip(this, 'background', 0, true);
        this.selectionNavbar = EPT.strip(this, 'img-navbar', 0);
        var fontTitle = { font: EPT.text['STYLE']+'40px '+EPT.text['FONT'], fill: '#fff', align: 'center' };
		this.selectionTitle = this.add.text(EPT.world.centerX, 45, EPT.text['selection'+number], fontTitle).setOrigin(0.5, 0.5);
        this.selection.add(this.selectionBackground.concat(this.selectionNavbar, [this.selectionTitle]));
        this.showTiles(number);
        if(this.bgFilesLoaded) {
            this.tweens.add({targets: this.selection, x: 0, y: 0, scaleX: 1, scaleY: 1, duration: 350, ease: 'Back' }); // Cubic.easeOut
        }
        else {
            this.selection.x = 0;
            this.selection.y = 0;
            this.selection.setScale(1, 1);
        }
    }
    showTiles(number) {
        this.tiles = this.add.container();
        var wide = EPT.world.width > 640;
        var cols = wide ? 9 : 5;
        var stepX = wide ? 138 : 124, stepY = wide ? 190 : 135;
        var sc = wide ? 0.75 : 0.72;
        var total = EPT._armies.length;
        var offsetTop = wide ? 230 : 180;
        for(var i = 0; i < total; i++) {
            var row = Math.floor(i/cols);
            var inRow = Math.min(cols, total-row*cols);
            var x = EPT.world.width/2+((i%cols)-(inRow-1)/2)*stepX;
            var y = offsetTop+row*stepY;
            var newButton = new Button(x, y, 'tiles-hqs', function(i){
                return function(){
                    EPT._player[number] = i;
                    this.clickReturn(number);
                }
            }(i), this, 'noframes').setFrame(i).setScale(sc);
            var newBorder = this.add.sprite(x, y, 'hex-border-pattern').setScale(sc);
            var newLabel = this.add.image(x, y+80*sc, EPT.labelKey(this, i)).setScale(sc);
            this.selection.add([newButton,newBorder,newLabel]);
        }
    }
    clickReturn(number) {
        if(this.bgFilesLoaded) {
            EPT.Sfx.play('heal');
        }
        this.clickBack(number);
        if(number == 1) {
            this.buttonPlayer1.setTexture('button-change-'+EPT.Lang.current);
            this.time.addEvent({
                delay: 200,
                callback: function() {
                    this.buttonPlayer1ArmyBorder = this.add.sprite(this.buttonPlayer1.x-100, this.buttonPlayer1.y-5, 'hex-border-color');
                    this.buttonPlayer1ArmyBorder.setScale(0.4);
                    this.buttonPlayer1Army = this.add.sprite(this.buttonPlayer1.x-100, this.buttonPlayer1.y-5, 'tiles-hqs', EPT._player[number]);
                    this.buttonPlayer1Army.setScale(0.4);
                    this.player1Selected = true;

                    if(this.player1Selected && this.player2Selected) {
                        this.bothPlayersSelected();
                    }
                },
                callbackScope: this
              }, this);
        }
        else if(number == 2) {
            this.buttonPlayer2.setTexture('button-change-'+EPT.Lang.current);
            this.time.addEvent({
                delay: 200,
                callback: function() {
                    this.buttonPlayer2ArmyBorder = this.add.sprite(this.buttonPlayer2.x-100, this.buttonPlayer2.y-5, 'hex-border-color');
                    this.buttonPlayer2ArmyBorder.setScale(0.4);                    
                    this.buttonPlayer2Army = this.add.sprite(this.buttonPlayer2.x-100, this.buttonPlayer2.y-5, 'tiles-hqs', EPT._player[number]);
                    this.buttonPlayer2Army.setScale(0.4);
                    this.player2Selected = true;

                    if(this.player1Selected && this.player2Selected) {
                        this.bothPlayersSelected();
                    }
                },
                callbackScope: this
              }, this);
        }
    }
    clickPlayer1() {
        if(this.bgFilesLoaded) {
            EPT.Sfx.play('click');
        }
        this.initArmySelection(1);
    }
    clickPlayer2() {
        if(this.bgFilesLoaded) {
            EPT.Sfx.play('click');
        }
        this.initArmySelection(2);
    }
    bothPlayersSelected() {
        if(this.bgFilesLoaded) {
            this.time.addEvent({
                delay: 300,
                callback: function() {
                    this.buttonStart.destroy();
                    this.buttonStart = new Button(this.pos.start.x, this.pos.start.y, 'button-start-'+EPT.Lang.current, this.clickStart, this);
                    this.buttonStart.setOrigin(0.5, 0.5);
                    this.buttonStart.setAlpha(0.5);
                    var dummyStart = this.add.sprite(this.pos.start.x, this.pos.start.y, 'button-start-'+EPT.Lang.current, 3);
                    dummyStart.setAlpha(0.5);
                    this.tweens.add({targets: dummyStart, alpha: 0, duration: 350, ease: 'Linear', onComplete: function(){
                        dummyStart.destroy();
                    }, callbackScope: this});
                    this.tweens.add({targets: this.buttonStart, alpha: 1, duration: 350, ease: 'Linear'});
                },
                callbackScope: this
            }, this);
        }
        else {
            this.time.addEvent({
                delay: 500,
                callback: function() {
                    this.bothPlayersSelected();
                },
                callbackScope: this
            }, this);
        }
    }
    clickSettings() {
        if(this.bgFilesLoaded) {
            EPT.Sfx.play('click');
            if(this.loadImage) {
                this.loadImage.destroy();
            }
            EPT.fadeOutScene('Settings', this);
        }
        else {
            var animationFrames = this.anims.generateFrameNumbers('loader');
            animationFrames.pop();
            this.waitingForSettings = true;
            this.buttonSettings.setAlpha(0.1);
            var loadAnimation = this.anims.create({
                key: 'loading',
                frames: animationFrames,
                frameRate: 12,
                repeat: -1
            });
            this.loadImage = this.add.sprite(EPT.world.width-30, EPT.world.height-30, 'loader').setOrigin(1,1).setScale(1.25);
            this.loadImage.play('loading');
        }
    }
    clickStart() {
        if(this.bgFilesLoaded) {
            EPT.Sfx.play('click');
        }
        EPT.fadeOutScene('Game', this);
    }
    clickBack(number) {
        if(this.bgFilesLoaded) {
            this.tweens.add({targets: this.selection, x: EPT.world.centerX, y: EPT.world.centerY-150+number*100, scaleX: 0, scaleY: 0, duration: 350, ease: 'Cubic.easeOut' });
        }
        else {
            this.selection.x = EPT.world.centerX;
            this.selection.y = EPT.world.centerY-150+number*100;
            this.selection.setScale(0, 0);
        }
        this.buttonPlayer1.input.enabled = true;
        this.buttonPlayer2.input.enabled = true;
        this.setResumeReady(this.bgFilesLoaded);
    }
    startPreloadInTheBackground() {
        this.load.image('img/button-home');
        this.load.once('filecomplete', this.addFiles, this);
        this.load.start();
    }
    addFiles() {
		var resources = {
            'image': [
				['button-beer', 'img/button-beer.png'],
                ['banner-beer', 'img/banner-beer.png'],
				['button-back', 'img/button-back.png'],
                ['button-home', 'img/button-home.png'],
				['img-tabbar', 'img/img-tabbar.png'],
                ['overlay', 'img/overlay.png'],
                ['popup-bg', 'img/popup-bg.png'],
                ['logo-portalgames', 'img/logo-portalgames.png'],
				['logo-neuroshimahexpl', 'img/logo-neuroshimahexpl.png'],
                ['logo-enclavegames', 'img/logo-enclave-black.png'],
                
                ['text-areyousure-pl', 'img/lang/pl/text-areyousure.png'],
                ['text-areyousure-en', 'img/lang/en/text-areyousure.png']
            ],
			'spritesheet': [

				['army-moloch', 'img/army-moloch.webp', {frameWidth:150,frameHeight:130}],
				['army-hegemony', 'img/army-hegemony.webp', {frameWidth:150,frameHeight:130}],
				['army-borgo', 'img/army-borgo.png', {frameWidth:150,frameHeight:130}],
				['army-outpost', 'img/army-outpost.webp', {frameWidth:150,frameHeight:130}],
				['army-dancer', 'img/army-dancer.png', {frameWidth:150,frameHeight:130}],
				['army-vegas', 'img/army-vegas.webp', {frameWidth:150,frameHeight:130}],
				['army-smart', 'img/army-smart.webp', {frameWidth:150,frameHeight:130}],
				['army-steelpolice', 'img/army-steelpolice.webp', {frameWidth:150,frameHeight:130}],
				['army-neojungle', 'img/army-neojungle.webp', {frameWidth:150,frameHeight:130}],
				['army-newyork', 'img/army-newyork.webp', {frameWidth:150,frameHeight:130}],
				['army-sharrash', 'img/army-sharrash.webp', {frameWidth:150,frameHeight:130}],
				['army-mephisto', 'img/army-mephisto.webp', {frameWidth:150,frameHeight:130}],
				['army-doomsday', 'img/army-doomsday.webp', {frameWidth:150,frameHeight:130}],
				['army-mississippi', 'img/army-mississippi.webp', {frameWidth:150,frameHeight:130}],
				['army-uranopolis', 'img/army-uranopolis.webp', {frameWidth:150,frameHeight:130}],
				['army-deathbreath', 'img/army-deathbreath.webp', {frameWidth:150,frameHeight:130}],
				['army-irongang', 'img/army-irongang.png', {frameWidth:150,frameHeight:130}],
                ['army-sandrunners', 'img/army-sandrunners.png', {frameWidth:150,frameHeight:130}],
                ['army-troglodytes', 'img/army-troglodytes.png', {frameWidth:150,frameHeight:130}],
                ['army-beasts', 'img/army-beasts.webp', {frameWidth:150,frameHeight:130}],
                ['army-pirates', 'img/army-pirates.webp', {frameWidth:150,frameHeight:130}],
                ['army-merchantsguild', 'img/army-merchantsguild.webp', {frameWidth:150,frameHeight:130}],
                ['army-partisans', 'img/army-partisans.png', {frameWidth:150,frameHeight:130}],
                ['army-deserttribes', 'img/army-deserttribes.png', {frameWidth:150,frameHeight:130}],
                ['army-wiremen', 'img/army-wiremen.webp', {frameWidth:150,frameHeight:130}],
                ['army-purifiers', 'img/army-purifiers.webp', {frameWidth:150,frameHeight:130}],
                
				['button-support-en', 'img/lang/en/button-support.png', {frameWidth:300,frameHeight:85}],
				['button-more-en', 'img/lang/en/button-more.png', {frameWidth:300,frameHeight:85}],
				['button-language-en', 'img/lang/en/button-language.png', {frameWidth:300,frameHeight:85}],
				['button-credits-en', 'img/lang/en/button-credits.png', {frameWidth:300,frameHeight:85}],
				['button-copyright-en', 'img/lang/en/button-copyright.png', {frameWidth:300,frameHeight:85}],
                ['button-yes-en', 'img/lang/en/button-yes.png', {frameWidth:160,frameHeight:85}],
                ['button-no-en', 'img/lang/en/button-no.png', {frameWidth:160,frameHeight:85}],

                ['button-support-pl', 'img/lang/pl/button-support.png', {frameWidth:300,frameHeight:85}],
				['button-more-pl', 'img/lang/pl/button-more.png', {frameWidth:300,frameHeight:85}],
				['button-language-pl', 'img/lang/pl/button-language.png', {frameWidth:300,frameHeight:85}],
				['button-credits-pl', 'img/lang/pl/button-credits.png', {frameWidth:300,frameHeight:85}],
				['button-copyright-pl', 'img/lang/pl/button-copyright.png', {frameWidth:300,frameHeight:85}],
                ['button-yes-pl', 'img/lang/pl/button-yes.png', {frameWidth:160,frameHeight:85}],
                ['button-no-pl', 'img/lang/pl/button-no.png', {frameWidth:160,frameHeight:85}],

				['button-sound-on', 'img/button-sound-on.png', {frameWidth:160,frameHeight:85}],
				['button-sound-off', 'img/button-sound-off.png', {frameWidth:160,frameHeight:85}],
				['button-music-on', 'img/button-music-on.png', {frameWidth:160,frameHeight:85}],
				['button-music-off', 'img/button-music-off.png', {frameWidth:160,frameHeight:85}],
				['button-language-english-on', 'img/button-language-english-on.png', {frameWidth:300,frameHeight:85}],
				['button-language-english-off', 'img/button-language-english-off.png', {frameWidth:300,frameHeight:85}],
				['button-language-polish-on', 'img/button-language-polish-on.png', {frameWidth:300,frameHeight:85}],
				['button-language-polish-off', 'img/button-language-polish-off.png', {frameWidth:300,frameHeight:85}],
				['button-small', 'img/button-small2.png', {frameWidth:120,frameHeight:44}],
				['button-undo', 'img/button-undo.png', {frameWidth:45,frameHeight:49}],

            ],
			'audio': [
				['sound-click', ['sfx/audio-click.m4a','sfx/audio-click.mp3','sfx/audio-click.ogg']],
				['sound-heal', ['sfx/audio-heal.m4a','sfx/audio-heal.mp3','sfx/audio-heal.ogg']],
				['sound-kill', ['sfx/audio-kill.m4a','sfx/audio-kill.mp3','sfx/audio-kill.ogg']],
				['sound-change', ['sfx/audio-change.m4a','sfx/audio-change.mp3','sfx/audio-change.ogg']],
				['music-theme', ['sfx/music-battle.m4a','sfx/music-battle.mp3','sfx/music-battle.ogg']]
			]
		};
		for(var method in resources) {
			resources[method].forEach(function(args) {
				var loader = this.load[method];
				loader && loader.apply(this.load, args);
			}, this);
        };
        this.load.on('complete', function(){
            console.log('[NSHex Counter] All files loaded in the background.');
            this.bgFilesLoaded = true;
            this.setResumeReady(true);
            EPT.Sfx.manage('music', 'init', this);
            EPT.Sfx.manage('sound', 'init', this);
            if(this.waitingForSettings) {
                this.clickSettings();
            }
        }, this);
    }
}