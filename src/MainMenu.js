class MainMenu extends Phaser.Scene {
    constructor() {
        super('MainMenu');
        this.bgFilesLoaded = false;
    }
    create() {
        this.add.sprite(0, 0, 'background').setOrigin(0, 0);
        var topbar = this.add.sprite(0, 0, 'img-topbar').setOrigin(0, 0);

        this.player1Selected = false;
        this.player2Selected = false;
        this.waitingForSettings = false;

        this.logoCounter = this.add.sprite(EPT.world.centerX, 150, 'logo-counter', 1);
        this.logoCounter.setOrigin(0.5, 0.5);

		var fontMenuIntro = { font: EPT.text['STYLE']+'30px '+EPT.text['FONT'], fill: '#000', align: 'center' };
		this.add.text(EPT.world.centerX, 250, EPT.text['menu-intro'], fontMenuIntro).setOrigin(0.5, 0);

        this.buttonPlayer1 = new Button(EPT.world.centerX, 420, 'button-player1-'+EPT.Lang.current, this.clickPlayer1, this).setOrigin(0.5);
        this.buttonPlayer2 = new Button(EPT.world.centerX, 540, 'button-player2-'+EPT.Lang.current, this.clickPlayer2, this).setOrigin(0.5);

        this.buttonStart = new Button(EPT.world.centerX, EPT.world.height-250, 'button-start-'+EPT.Lang.current, this.clickStart, this, 'noframes');
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
                this.buttonStart = new Button(EPT.world.centerX, EPT.world.height-250, 'button-start-'+EPT.Lang.current, this.clickStart, this).setOrigin(0.5);
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

        var tiles = this.add.sprite(EPT.world.centerX, EPT.world.height-100, 'img-tiles');
        tiles.setOrigin(0.5, 0.5);

        this.buttonSettings = new Button(EPT.world.width-20, EPT.world.height-20, 'button-settings', this.clickSettings, this, 'noframes').setOrigin(1, 1);

        this.cameras.main.fadeIn(250);

        this.time.addEvent({
            delay: 500,
            callback: function() {
                this.startPreloadInTheBackground();
            },
            callbackScope: this
          }, this);
    }
    initArmySelection(number) {
        this.selection = this.add.container(EPT.world.centerX, EPT.world.centerY-200+number*100);
        this.selection.setScale(0);
        this.buttonPlayer1.input.enabled = false;
        this.buttonPlayer2.input.enabled = false;
        this.selectionBackground = this.add.sprite(0, 0, 'background').setOrigin(0, 0);
        this.selectionNavbar = this.add.sprite(0, 0, 'img-navbar').setOrigin(0, 0);
        var fontTitle = { font: EPT.text['STYLE']+'40px '+EPT.text['FONT'], fill: '#fff', align: 'center' };
		this.selectionTitle = this.add.text(EPT.world.centerX, 45, EPT.text['selection'+number], fontTitle).setOrigin(0.5, 0.5);
        this.selection.add([this.selectionBackground,this.selectionNavbar,this.selectionTitle]);
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
        var offsetLeft = 110;
        var offsetTop = 200;
        var offsetLastLine = 0;
        var i=0;
        for(var w=0; w<5; w++) {
            for(var h=0; h<4; h++) {
                if(i<19) {
                    if(i > 15) {
                        offsetLastLine = 70; // 140
                    }
                    var newButton = new Button(offsetLastLine+offsetLeft+h*140, offsetTop+w*160, 'tiles-hqs', function(i){
                        return function(){
                            EPT._player[number] = i;
                            this.clickReturn(number);
                        }
                    }(i), this, 'noframes').setFrame(i).setScale(0.85);
                    var newBorder = this.add.sprite(offsetLastLine+offsetLeft+h*140, offsetTop+w*160, 'hex-border-pattern').setScale(0.85);
                    var newLabel = this.add.sprite(offsetLastLine+offsetLeft+h*140, offsetTop+w*160+65, 'hex-labels-'+EPT.Lang.current, i+1).setScale(0.75);
                    this.selection.add([newButton,newBorder,newLabel]);
                    i++;
                }
            }
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
                    this.buttonStart = new Button(EPT.world.centerX, EPT.world.height-250, 'button-start-'+EPT.Lang.current, this.clickStart, this);
                    this.buttonStart.setOrigin(0.5, 0.5);
                    this.buttonStart.setAlpha(0.5);
                    var dummyStart = this.add.sprite(EPT.world.centerX, EPT.world.height-250, 'button-start-'+EPT.Lang.current, 3);
                    dummyStart.setAlpha(0.5);
                    this.tweens.add({targets: dummyStart, alpha: 0, duration: 350, ease: 'Linear', onComplete: function(){
                        dummyStart.destroy();
                    }, onCompleteScope: this});
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
				['button-up', 'img/button-up.png'],
				['button-down', 'img/button-down.png'],
                ['button-home', 'img/button-home.png'],
				['img-tabbar', 'img/img-tabbar.png'],
                ['img-seethru', 'img/img-seethru.png'],
                ['overlay', 'img/overlay.png'],
                ['popup-bg', 'img/popup-bg.png'],
                ['logo-portalgames', 'img/logo-portalgames.png'],
				['logo-neuroshimahexpl', 'img/logo-neuroshimahexpl.png'],
                ['logo-enclavegames', 'img/logo-enclave-black.png'],
                ['logo-coil', 'img/logo-coil.png'],
                
                ['text-areyousure-pl', 'img/lang/pl/text-areyousure.png'],
                ['text-areyousure-en', 'img/lang/en/text-areyousure.png']
            ],
			'spritesheet': [
				['army-moloch-grey', 'img/army-moloch-grey.png', {frameWidth:150,frameHeight:130}],
				['army-hegemony-grey', 'img/army-hegemony-grey.png', {frameWidth:150,frameHeight:130}],
				['army-borgo-grey', 'img/army-borgo-grey.png', {frameWidth:150,frameHeight:130}],
				['army-outpost-grey', 'img/army-outpost-grey.png', {frameWidth:150,frameHeight:130}],
				['army-dancer-grey', 'img/army-dancer-grey.png', {frameWidth:150,frameHeight:130}],
				['army-vegas-grey', 'img/army-vegas-grey.png', {frameWidth:150,frameHeight:130}],
				['army-smart-grey', 'img/army-smart-grey.png', {frameWidth:150,frameHeight:130}],
				['army-steelpolice-grey', 'img/army-steelpolice-grey.png', {frameWidth:150,frameHeight:130}],
				['army-neojungle-grey', 'img/army-neojungle-grey.png', {frameWidth:150,frameHeight:130}],
				['army-newyork-grey', 'img/army-newyork-grey.png', {frameWidth:150,frameHeight:130}],
				['army-sharrash-grey', 'img/army-sharrash-grey.png', {frameWidth:150,frameHeight:130}],
				['army-mephisto-grey', 'img/army-mephisto-grey.png', {frameWidth:150,frameHeight:130}],
				['army-doomsday-grey', 'img/army-doomsday-grey.png', {frameWidth:150,frameHeight:130}],
				['army-mississippi-grey', 'img/army-mississippi-grey.png', {frameWidth:150,frameHeight:130}],
				['army-uranopolis-grey', 'img/army-uranopolis-grey.png', {frameWidth:150,frameHeight:130}],
				['army-deathbreath-grey', 'img/army-deathbreath-grey.png', {frameWidth:150,frameHeight:130}],
				['army-irongang-grey', 'img/army-irongang-grey.png', {frameWidth:150,frameHeight:130}],
                ['army-sandrunners-grey', 'img/army-sandrunners-grey.png', {frameWidth:150,frameHeight:130}],
                ['army-troglodytes-grey', 'img/army-troglodytes-grey.png', {frameWidth:150,frameHeight:130}],

				['army-moloch', 'img/army-moloch.png', {frameWidth:150,frameHeight:130}],
				['army-hegemony', 'img/army-hegemony.png', {frameWidth:150,frameHeight:130}],
				['army-borgo', 'img/army-borgo.png', {frameWidth:150,frameHeight:130}],
				['army-outpost', 'img/army-outpost.png', {frameWidth:150,frameHeight:130}],
				['army-dancer', 'img/army-dancer.png', {frameWidth:150,frameHeight:130}],
				['army-vegas', 'img/army-vegas.png', {frameWidth:150,frameHeight:130}],
				['army-smart', 'img/army-smart.png', {frameWidth:150,frameHeight:130}],
				['army-steelpolice', 'img/army-steelpolice.png', {frameWidth:150,frameHeight:130}],
				['army-neojungle', 'img/army-neojungle.png', {frameWidth:150,frameHeight:130}],
				['army-newyork', 'img/army-newyork.png', {frameWidth:150,frameHeight:130}],
				['army-sharrash', 'img/army-sharrash.png', {frameWidth:150,frameHeight:130}],
				['army-mephisto', 'img/army-mephisto.png', {frameWidth:150,frameHeight:130}],
				['army-doomsday', 'img/army-doomsday.png', {frameWidth:150,frameHeight:130}],
				['army-mississippi', 'img/army-mississippi.png', {frameWidth:150,frameHeight:130}],
				['army-uranopolis', 'img/army-uranopolis.png', {frameWidth:150,frameHeight:130}],
				['army-deathbreath', 'img/army-deathbreath.png', {frameWidth:150,frameHeight:130}],
				['army-irongang', 'img/army-irongang.png', {frameWidth:150,frameHeight:130}],
                ['army-sandrunners', 'img/army-sandrunners.png', {frameWidth:150,frameHeight:130}],
                ['army-troglodytes', 'img/army-troglodytes.png', {frameWidth:150,frameHeight:130}],
                
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

				['tiles-hqs-grey', 'img/tiles-hqs-grey.png', {frameWidth:150,frameHeight:130}]                
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
            EPT.Sfx.manage('music', 'init', this);
            EPT.Sfx.manage('sound', 'init', this);
            if(this.waitingForSettings) {
                this.clickSettings();
            }
        }, this);
    }
}