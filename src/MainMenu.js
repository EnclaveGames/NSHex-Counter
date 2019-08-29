class MainMenu extends Phaser.Scene {
    constructor() {
        super('MainMenu');
    }
    create() {
        this.add.sprite(0, 0, 'background').setOrigin(0, 0);
        var topbar = this.add.sprite(0, 0, 'img-topbar').setOrigin(0, 0);

        // topbar.y = -topbar.height;
		// this.tweens.add({targets: topbar, y: 0, duration: 250, ease: 'Linear'});

        this.player1Selected = false;
        this.player2Selected = false;

        this.logoCounter = this.add.sprite(EPT.world.centerX, 150, 'logo-counter', 1);
        this.logoCounter.setOrigin(0.5, 0.5);

		// EPT.Storage.initUnset('EPT-highscore', 0);
        // var highscore = EPT.Storage.get('EPT-highscore');
        // this.input.keyboard.on('keydown', this.handleKey, this);

		var fontHighscore = { font: '30px '+EPT.text['FONT'], fill: '#000', align: 'center' };
		var textHighscore = this.add.text(EPT.world.centerX, 250, EPT.text['menu-intro'], fontHighscore);
		textHighscore.setOrigin(0.5, 0);

        this.buttonPlayer1 = new Button(EPT.world.centerX, 420, 'button-player1', this.clickPlayer1, this).setOrigin(0.5);
        this.buttonPlayer2 = new Button(EPT.world.centerX, 540, 'button-player2', this.clickPlayer2, this).setOrigin(0.5);

        this.buttonStart = new Button(EPT.world.centerX, EPT.world.height-250, 'button-start', this.clickStart, this, 'noframes');
        this.buttonStart.setOrigin(0.5, 0.5);
        this.buttonStart.setFrame(3);
        this.buttonStart.input.enabled = false;

        if(EPT._player[1] != undefined) {
            this.buttonPlayer1.setTexture('button-change');
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
            this.buttonPlayer2.setTexture('button-change');
            this.buttonPlayer2ArmyBorder = this.add.sprite(this.buttonPlayer2.x-100, this.buttonPlayer2.y-5, 'hex-border-color');
            this.buttonPlayer2ArmyBorder.setScale(0.4);
            this.buttonPlayer2Army = this.add.sprite(this.buttonPlayer2.x-100, this.buttonPlayer2.y-5, 'tiles-hqs', EPT._player[2]);
            this.buttonPlayer2Army.setScale(0.4);
            this.player2Selected = true;
            if(this.player1Selected && this.player2Selected) {
                this.buttonStart.destroy();
                this.buttonStart = new Button(EPT.world.centerX, EPT.world.height-250, 'button-start', this.clickStart, this).setOrigin(0.5);
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

		// buttonStart.setScale(0.5);
        // this.tweens.add({targets: buttonStart, scaleX: 1, scaleY: 1, duration: 500, delay: 500, ease: 'Cubic.easeOut' });  

        var tiles = this.add.sprite(EPT.world.centerX, EPT.world.height-100, 'img-tiles');
        tiles.setOrigin(0.5, 0.5);

        var buttonSettings = new Button(EPT.world.width-30, EPT.world.height-30, 'button-settings', this.clickSettings, this, 'noframes');
        buttonSettings.setOrigin(1, 1);

        // var buttonEnclave = new Button(20, EPT.world.height-40, 'logo-enclave', this.clickEnclave, this, 'static');
        // buttonEnclave.setOrigin(0, 1);

		// var fontHighscore = { font: '38px '+EPT.text['FONT'], fill: '#ffde00', stroke: '#000', strokeThickness: 5 };
		// var textHighscore = this.add.text(EPT.world.width-30, 60, EPT.text['menu-highscore']+highscore, fontHighscore);
		// textHighscore.setOrigin(1, 0);

		// buttonStart.x = EPT.world.width+buttonStart.width+20;
        // this.tweens.add({targets: buttonStart, x: EPT.world.width-20, duration: 500, ease: 'Back'});

		// buttonEnclave.x = -buttonEnclave.width-20;
        // this.tweens.add({targets: buttonEnclave, x: 20, duration: 500, ease: 'Back'});

        // buttonSettings.y = -buttonSettings.height-20;
        // this.tweens.add({targets: buttonSettings, y: 20, duration: 500, ease: 'Back'});

        // textHighscore.y = -textHighscore.height-30;
        // this.tweens.add({targets: textHighscore, y: 40, duration: 500, delay: 100, ease: 'Back'});

        this.cameras.main.fadeIn(250);
    }
    // handleKey(e) {
    //     switch(e.code) {
    //         case 'KeyS': {
    //             this.clickSettings();
    //             break;
    //         }
    //         case 'Enter': {
    //             this.clickStart();
    //             break;
    //         }
    //         default: {}
    //     }
    // }
    initArmySelection(number) {
        this.selection = this.add.container(EPT.world.centerX, EPT.world.centerY-200+number*100);
        this.selection.setScale(0);
        this.buttonPlayer1.input.enabled = false;
        this.buttonPlayer2.input.enabled = false;
        this.selectionBackground = this.add.sprite(0, 0, 'background').setOrigin(0, 0);

        this.selectionNavbar = this.add.sprite(0, 0, 'img-navbar').setOrigin(0, 0);
		// this.selectionButtonBack = new Button(20, 25, 'button-back', function(){this.clickBack(number);}, this, 'noframes').setOrigin(0, 0);
        // this.buttonBack.y = -this.buttonBack.height-20;

        var fontTitle = { font: '40px '+EPT.text['FONT'], fill: '#fff', align: 'center' };
		var fontSubtitle = { font: '38px '+EPT.text['FONT'], fill: '#000', align: 'center' };
		var fontSmall = { font: '28px '+EPT.text['FONT'], fill: '#000', align: 'center' };
		this.selectionTitle = this.add.text(EPT.world.centerX, 45, EPT.text['selection'+number], fontTitle).setOrigin(0.5, 0.5);

        this.selection.add([this.selectionBackground,this.selectionNavbar,this.selectionTitle]);
        this.showTiles(number);

        // this.selection.setOrigin(0.5,0.5);
        // this.selection.setScale(0.1);
        // this.tweens.add({targets: this.selection, scaleX: 1, scaleY: 1, duration: 500, ease: 'Cubic.easeOut' });
        this.tweens.add({targets: this.selection, x: 0, y: 0, scaleX: 1, scaleY: 1, duration: 500, ease: 'Cubic.easeOut' });
    }
    // showHideArmySelection() {
    // }
    showTiles(number) {
        this.tiles = this.add.container();
        var offsetLeft = 110;
        var offsetTop = 200;
        var offsetLastLine = 0;
        var i=0;
        for(var w=0; w<5; w++) {
            for(var h=0; h<4; h++) {
                if(i<18) {
                    if(i > 15) {
                        offsetLastLine = 140;
                    }
                    var newButton = new Button(offsetLastLine+offsetLeft+h*140, offsetTop+w*160, 'tiles-hqs', function(i){
                        return function(){
                            // EPT._currentPlayer = i;
                            EPT._player[number] = i;
                            if(i != 17) { // Sand Runners
                                this.clickReturn(number);
                            }
                        }
                    }(i), this, 'noframes').setFrame(i).setScale(0.85);
                    var newBorder = this.add.sprite(offsetLastLine+offsetLeft+h*140, offsetTop+w*160, 'hex-border-pattern').setScale(0.85);
                    var newLabel = this.add.sprite(offsetLastLine+offsetLeft+h*140, offsetTop+w*160+65, 'hex-labels', i+1).setScale(0.75);
                    this.selection.add([newButton,newBorder,newLabel]);
                    i++;
                }
            }
        }
    }
    clickReturn(number) {
        this.clickBack(number);
        if(number == 1) {
            this.buttonPlayer1.setTexture('button-change');
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
            this.buttonPlayer2.setTexture('button-change');
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
        this.initArmySelection(1);
    }
    clickPlayer2() {
        this.initArmySelection(2);
        // alert('Player2\'s army selected');
        // // do stuff
        // this.buttonPlayer2.setTexture('button-change');
        // // add selected army image

        // this.player2Selected = true;
        // if(this,this.player1Selected && this.player2Selected) {
        //     this.bothPlayersSelected();
        // }
    }
    bothPlayersSelected() {
        // wait 750 miliseconds
        // this.buttonStart.destroy();
        // this.buttonStart = new Button(EPT.world.centerX, EPT.world.height-250, 'button-start', this.clickStart, this);
        // this.buttonStart.setOrigin(0.5, 0.5);

        this.time.addEvent({
            delay: 300,
            callback: function() {
                // this.tweens.add({targets: this.buttonStart, scaleX: 1, scaleY: 1, duration: 500, delay: 0, ease: 'Cubic.easeOut' });
                this.buttonStart.destroy();
                this.buttonStart = new Button(EPT.world.centerX, EPT.world.height-250, 'button-start', this.clickStart, this);
                this.buttonStart.setOrigin(0.5, 0.5);
            },
            callbackScope: this
          }, this);
    }
    clickEnclave() {
        console.log('Enclave clicked!');
        EPT.Sfx.play('click');
        window.top.location.href = 'https://enclavegames.com/';
    }
    clickSettings() {
        EPT.Sfx.play('click');
        EPT.fadeOutScene('Settings', this);
    }
    clickStart() {
        EPT.Sfx.play('click');
        EPT.fadeOutScene('Game', this);
    }
    clickBack(number) {
        this.tweens.add({targets: this.selection, x: EPT.world.centerX, y: EPT.world.centerY-150+number*100, scaleX: 0, scaleY: 0, duration: 500, ease: 'Cubic.easeOut' });
        // on complete = hide selection
        this.buttonPlayer1.input.enabled = true;
        this.buttonPlayer2.input.enabled = true;
    }
}