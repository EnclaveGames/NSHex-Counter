class Game extends Phaser.Scene {
    constructor() {
        super('Game');
    }
    create() {
        this.add.sprite(0, 0, 'background').setOrigin(0, 0);
        this.seethru = this.add.sprite(0, 190, 'img-seethru').setOrigin(0, 0);

        // EPT._currentTileCounts = [];
        // for(var i=0; i<EPT._tileCounts.length; i++) {
        //     EPT._currentTileCounts[i] = [];
        //     for(var j=0; j<EPT._tileCounts[i].length; j++) {
        //         EPT._currentTileCounts[i][j] = EPT._tileCounts[i][j];
        //     }
        // }
        EPT._currentTileCounts = JSON.parse(JSON.stringify(EPT._tileCounts));

        var fontTitle = { font: '46px '+EPT.text['FONT'], fill: '#fff', stroke: '#000', strokeThickness: 7, align: 'center' };
        this.fontSmall = { font: '28px '+EPT.text['FONT'], fill: '#fff', stroke: '#000', strokeThickness: 4, align: 'center' };
        this.fontMedium = { font: '36px '+EPT.text['FONT'], fill: '#fff', stroke: '#000', strokeThickness: 5, align: 'center' };
        var oneX = 200, oneY = 80;
        var oneID = EPT._player[1];
        this.oneName = EPT._armies[EPT._player[1]];
        var twoX = 500, twoY = 80;
        var twoID = EPT._player[2];
        var twoName = EPT._armies[EPT._player[2]];
        this.playerTileCount = [0, 34, 34];
        for(var c=1; c<=2; c++) {
            if(EPT._armies[EPT._player[c]] == 'dancer') {
                this.playerTileCount[c] = 32;
            }
        }

        this.allTiles = [];
        this.tile = [];
        this.showAllTiles(1);
        this.showAllTiles(2);

        this.tabbar = this.add.sprite(0, -90, 'img-tabbar').setOrigin(0, 0);

		this.buttonBack = new Button(20, 20, 'button-home', this.clickBack, this, 'noframes');
        this.buttonBack.setOrigin(0, 0);

        this.visibleScreen = 1; // or 2
        this.countNum = [];

        this.itemOne = this.add.container().setScale(0.5);
        var borderOne = this.add.sprite(oneX, oneY, 'hex-shadow').setOrigin(0.5);//.setScale(0.5);
        var tileOne = new Button(oneX, oneY, 'army-'+this.oneName, function(){
            this.tweens.add({targets: this.allTiles[1], x: 0, duration: 500, ease: 'Back'});
            this.tweens.add({targets: this.allTiles[2], x: EPT.world.width, duration: 500, ease: 'Back'});
            this.visibleScreen = 1;
            // this.tweens.add({targets: this.itemOne, scaleX: 0.75, scaleY: 0.75, duration: 500, ease: 'Back'});
            // this.tweens.add({targets: this.itemTwo, scaleX: 0.5, scaleY: 0.5, duration: 500, ease: 'Back'});

            this.tweens.add({targets: this.itemOne, scaleX: 1, scaleY: 1, duration: 500, ease: 'Back'});
            this.tweens.add({targets: this.itemTwo, scaleX: 0.75, scaleY: 0.75, duration: 500, ease: 'Back'});

        }, this, 'noframes').setOrigin(0.5);//.setScale(0.5);
        var labelOne = this.add.sprite(oneX, oneY+75, 'hex-labels', oneID+1).setOrigin(0.5);//.setScale(0.5);
        this.countNum[1] = this.add.text(oneX+65, oneY-45, this.playerTileCount[1], fontTitle).setOrigin(0.5);//.setScale(0.5);
        this.itemOne.add([borderOne,tileOne,labelOne,this.countNum[1]]);

        var versus = this.add.text(EPT.world.centerX+50, 100, 'vs', this.fontMedium).setOrigin(0.5);

        this.itemTwo = this.add.container().setScale(0.5);
        var borderTwo = this.add.sprite(twoX, twoY, 'hex-shadow').setOrigin(0.5);//.setScale(0.5);
        var tileTwo = new Button(twoX, twoY, 'army-'+twoName, function(){
            this.tweens.add({targets: this.allTiles[1], x: -EPT.world.width, duration: 500, ease: 'Back'});
            this.tweens.add({targets: this.allTiles[2], x: 0, duration: 500, ease: 'Back'});
            this.visibleScreen = 2;
            // this.tweens.add({targets: this.itemOne, scaleX: 0.5, scaleY: 0.5, duration: 500, ease: 'Back'});
            // this.tweens.add({targets: this.itemTwo, scaleX: 0.75, scaleY: 0.75, duration: 500, ease: 'Back'});

            this.tweens.add({targets: this.itemOne, scaleX: 0.75, scaleY: 0.75, duration: 500, ease: 'Back'});
            this.tweens.add({targets: this.itemTwo, scaleX: 1, scaleY: 1, duration: 500, ease: 'Back'});

        }, this, 'noframes').setOrigin(0.5);//.setScale(0.5);
        var labelTwo = this.add.sprite(twoX, twoY+75, 'hex-labels', twoID+1).setOrigin(0.5);
        this.countNum[2] = this.add.text(twoX+65, twoY-45, this.playerTileCount[2], fontTitle).setOrigin(0.);
        this.itemTwo.add([borderTwo,tileTwo,labelTwo,this.countNum[2]]);
        // this.itemTwo.setScale(0.75, 0.75);

        // this.itemOne.setOrigin(0.5).setScale(0.5);
        // this.tweens.add({targets: borderOne, scaleX: 1, scaleY: 1, duration: 500, ease: 'Back'});
        // this.tweens.add({targets: tileOne, scaleX: 1, scaleY: 1, duration: 500, ease: 'Back'});
        // this.tweens.add({targets: labelOne, scaleX: 1, scaleY: 1, duration: 500, ease: 'Back'});
        // this.tweens.add({targets: this.countNum[1], scaleX: 1, scaleY: 1, duration: 500, ease: 'Back'});
        this.tweens.add({targets: this.itemOne, scaleX: 1, scaleY: 1, duration: 500, ease: 'Back'});
        this.tweens.add({targets: this.itemTwo, scaleX: 0.75, scaleY: 0.75, duration: 500, ease: 'Back'});

        // this.navbar = this.add.sprite(0, EPT.world.height, 'img-navbar').setOrigin(0, 1);
        this.buttonUp = new Button(10, EPT.world.height-40, 'button-down', function(){
            this.tweens.add({targets: this.allTiles[this.visibleScreen], y: this.allTiles[this.visibleScreen].y-190, duration: 500, ease: 'Back'});
        }, this, 'noframes').setOrigin(0, 1);
		this.buttonDown = new Button(EPT.world.width-10, EPT.world.height-40, 'button-up', function(){
            this.tweens.add({targets: this.allTiles[this.visibleScreen], y: this.allTiles[this.visibleScreen].y+190, duration: 500, ease: 'Back'});
        }, this, 'noframes').setOrigin(1, 1);

        this.cameras.main.fadeIn(250);

        this.seethru.setInteractive({draggable:true});
        var that = this;
        this.input.on('drag', function (pointer, gameObject, dragX, dragY) {
        //     // gameObject.x = dragX;
            // console.log(gameObject.y, dragY, pointer.y);
            // this.allTiles[1].iterate(function(item){
            //     // item.y += pointer.velocity.y/10;
            // }, this);
            // if(gameObject.y < 280) {
                gameObject.y = dragY;
                // for(var n = 1; n <= 2; n++) {
                    var n = that.visibleScreen;
                    for(var i = 1; i < that.tile[n].length-1; i++) {
                        that.tile[n][i].button.y = that.tile[n][i].offsetTop-190+dragY;
                        that.tile[n][i].dummy.y = that.tile[n][i].offsetTop-190+dragY;
                        that.tile[n][i].border.y = that.tile[n][i].offsetTop-190+dragY;
                        that.tile[n][i].percent.y = that.tile[n][i].offsetTop-60-190+dragY;
                        that.tile[n][i].bar.y = that.tile[n][i].offsetTop+70-190+dragY;
                        that.tile[n][i].count.y = that.tile[n][i].offsetTop+67-190+dragY;
                        that.tile[n][i].undo.y = that.tile[n][i].offsetTop-30-190+dragY;
                        that.tile[n][i].placeholder.y = that.tile[n][i].offsetTop-30-190+dragY;
                    }
                // }
            // }
        });
    }
    showAllTiles(n) {
        this.allTiles[n] = this.add.container();
        this.allTiles[n].x = EPT.world.width*(n-1);//+(this.visibleScreen-1)*EPT.world.width;
        this.tile[n] = [];
        var offsetLeft = 130, offsetTop = 280;
        var armyName = EPT._armies[EPT._player[n]];
        var i = 1;
        for(var w = 0; w < 8; w++) {
            for(var h = 0; h < 3; h++) {
                this.tile[n][i] = {};
                var tileCount = EPT._currentTileCounts[EPT._player[n]];
                if(i <= EPT._armyCounts[EPT._player[n]]) {
                    var newX = offsetLeft + h * 190;
                    var newY = offsetTop + w * 190;
                    this.tile[n][i].offsetTop = newY;

                    // if(tileCount[i-1] == 0) {
                    //     var armyTexture = 'army-'+armyName+'-grey';
                    // }
                    // else {
                        var armyTexture = 'army-'+armyName;
                    // }
                    this.tile[n][i].button = new Button(newX, newY, armyTexture, function(i){
                        return function(){ // REMOVE i tile
                            if(tileCount[i-1] > 0) {
                                tileCount[i-1] -= 1;
                                this.playerTileCount[n] -= 1;
                                this.countNum[n].setText(this.playerTileCount[n]);
                                
                                this.tile[n][i].count.setText(tileCount[i-1]+' / '+EPT._tileCounts[EPT._player[n]][i-1]);// = this.add.text(newX, newY+67, , this.fontSmall).setOrigin(0.5, 0.5);
                                
                                var chance = Math.floor(((tileCount[i-1])/this.playerTileCount[n]).toFixed(2)*100);
                                if(isNaN(chance)) { chance = 0; }
                                this.tile[n][i].percent.setText(chance+'%');

                                // this.tweens.add({targets: this.tile[n][i].dummy, scaleX: 1.5, scaleY: 1.5, duration: 250, ease: 'Back'});
                                this.tweens.add({targets: this.tile[n][i].dummy, scaleX: 2, scaleY: 2, alpha: 0, duration: 500, ease: 'Linear', onComplete: function(){
                                    this.tile[n][i].dummy.setScale(1);
                                    this.tile[n][i].dummy.setAlpha(1);
                                    if(tileCount[i-1] == 0) {
                                        this.tile[n][i].button.setTexture('army-'+armyName+'-grey', i);
                                        this.tweens.add({targets: this.tile[n][i].dummy, alpha: 0, duration: 500, ease: 'Linear'});
                                        this.tile[n][i].bar.setFrame(3);
                                    }
                                    // this.tile[n][i].dummy = this.add.sprite(newX, newY, 'army-'+armyName, i);
                                }, onCompleteScope: this});

                                this.tile[n][i].undo.input.enabled = true;
                                this.tile[n][i].undo.setAlpha(1);
                                this.tile[n][i].placeholder.setAlpha(0);
                            }
                            // this.rerenderTiles();
                            this.recalculatePercentages(n);
                        }
                    }(i), this, 'noframes').setFrame(i);
                    this.tile[n][i].dummy = this.add.sprite(newX, newY, 'army-'+armyName, i);//.setInteractive({draggable:true});
                    // this.tile[n][i].dummy.setTint(0x55ff55);
                    this.tile[n][i].border = this.add.sprite(newX, newY, 'hex-border-color');//.setInteractive({draggable:true});
                    var chance = Math.floor(((tileCount[i-1])/this.playerTileCount[n]).toFixed(2)*100);
                    this.tile[n][i].percent = this.add.text(newX-30, newY-60, chance+'%', this.fontMedium).setOrigin(0.5, 0.5);
                    this.tile[n][i].bar = this.add.sprite(newX, newY+70, 'button-small', 0);
                    this.tile[n][i].count = this.add.text(newX, newY+67, tileCount[i-1]+' / '+EPT._tileCounts[EPT._player[n]][i-1], this.fontSmall).setOrigin(0.5, 0.5);
                    this.tile[n][i].undo = new Button(newX+60, newY-30, 'button-undo', function(i){
                        return function(){ // UNDO i tile
                            if(tileCount[i-1] < EPT._tileCounts[EPT._player[n]][i-1]) {
                                tileCount[i-1] += 1;
                                this.playerTileCount[n] += 1;
                                this.countNum[n].setText(this.playerTileCount[n]);

                                this.tile[n][i].count.setText(tileCount[i-1]+' / '+EPT._tileCounts[EPT._player[n]][i-1]);
                                // var chance = Math.floor(((tileCount[i-1])/this.playerTileCount[n]).toFixed(2)*100);
                                var chance = Math.floor(((tileCount[i-1])/this.playerTileCount[n]).toFixed(2)*100);
                                if(isNaN(chance)) { chance = 0; }
                                this.tile[n][i].percent.setText(chance+'%');

                                this.tile[n][i].dummy.setScale(1.5);
                                this.tile[n][i].dummy.setAlpha(0);
                                this.tweens.add({targets: this.tile[n][i].dummy, scaleX: 1, scaleY: 1, alpha: 1, duration: 250, ease: 'Linear', onComplete: function(){

                                    // this.tile[n][i].dummy = this.add.sprite(newX, newY, 'army-'+armyName, i);
                                }, onCompleteScope: this});

                                this.tile[n][i].button.setTexture('army-'+armyName, i);
                                this.tile[n][i].bar.setFrame(0);
                            }
                            if(tileCount[i-1] == EPT._tileCounts[EPT._player[n]][i-1]) {
                                this.tile[n][i].undo.input.enabled = false;
                                this.tile[n][i].undo.setAlpha(0);
                                this.tile[n][i].placeholder.setAlpha(1);
                            }
                            // this.rerenderTiles();
                            this.recalculatePercentages(n);
                        }
                    }(i), this);
                    this.tile[n][i].undo.input.enabled = false;
                    this.tile[n][i].undo.setAlpha(0);
                    this.tile[n][i].placeholder = this.add.sprite(newX+60, newY-30, 'button-undo', 3);
                    this.allTiles[n].add([
                        this.tile[n][i].button,this.tile[n][i].dummy,this.tile[n][i].border,
                        this.tile[n][i].percent,this.tile[n][i].bar,this.tile[n][i].count,
                        this.tile[n][i].undo,this.tile[n][i].placeholder]);
                    i++;
                }
            }
        }
    }
    rerenderTiles() {
        // BUT include a tween and which army is currently visible
        this.allTiles[1].destroy();
        this.allTiles[2].destroy();
        this.allTiles = [];
        this.showAllTiles(1);
        this.showAllTiles(2);
    }
    recalculatePercentages(n) {
        var i = 1;
        for(var w = 0; w < 8; w++) {
            for(var h = 0; h < 3; h++) {
                if(i <= EPT._armyCounts[EPT._player[n]]) {
                    var tileCount = EPT._currentTileCounts[EPT._player[n]];
                    var chance = Math.floor(((tileCount[i-1])/this.playerTileCount[n]).toFixed(2)*100);
                    if(isNaN(chance)) { chance = 0; }
                    this.tile[n][i].percent.setText(chance+'%');
                    i++;
                }
            }
        }
    }
	stateRestart() {
		EPT.Sfx.play('click');
        EPT.fadeOutScene('Game', this);
	}
	clickBack() {
        EPT.Sfx.play('click');
        if(confirm('Are you sure?')) {
            EPT.fadeOutScene('MainMenu', this);
        } 
	}
};