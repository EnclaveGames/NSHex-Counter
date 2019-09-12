class Game extends Phaser.Scene {
    constructor() {
        super('Game');
    }
    create() {
        this.add.sprite(0, 0, 'background').setOrigin(0, 0);
        this.gridSize = 190;
        this.gridTopOffset = 275;
        this.seethru = [];
        this.seethru[1] = this.add.sprite(0, this.gridSize, 'img-seethru').setOrigin(0, 0);
        this.seethru[2] = this.add.sprite(EPT.world.width, this.gridSize, 'img-seethru').setOrigin(0, 0);

        EPT._currentTileCounts = JSON.parse(JSON.stringify(EPT._tileCounts));

        this.fontTitle = { font: EPT.text['STYLE']+'46px '+EPT.text['FONT'], fill: '#fff', stroke: '#000', strokeThickness: 7, align: 'center' };
        var fontTitle = { font: EPT.text['STYLE']+'46px '+EPT.text['FONT'], fill: '#fff', stroke: '#000', strokeThickness: 7, align: 'center' };
        this.fontSmall = { font: EPT.text['STYLE']+'28px '+EPT.text['FONT'], fill: '#fff', stroke: '#000', strokeThickness: 4, align: 'center' };
        this.fontMedium = { font: EPT.text['STYLE']+'36px '+EPT.text['FONT'], fill: '#fff', stroke: '#000', strokeThickness: 5, align: 'center' };
        this.fontPopup  = { font: EPT.text['STYLE']+'24px '+EPT.text['FONT'], fill: '#000', stroke: '#fff', strokeThickness: 3, align: 'center' };

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

        this.tabbar = this.add.sprite(0, -100, 'img-tabbar').setOrigin(0, 0);

		this.buttonBack = new Button(0, 0, 'button-home', this.popupShow, this, 'noframes');
        this.buttonBack.setOrigin(0, 0);

        this.visibleScreen = 1; // or 2
        this.countNum = [];

        this.hq = [];
        this.activeHQ = [0, 'active', ''];
        this.add.text(EPT.world.centerX+40, 80, 'vs', this.fontMedium).setOrigin(0.5);

        this.renderHQ(1, this.activeHQ[1]);
        this.renderHQ(2, this.activeHQ[2]);

        this.cameras.main.fadeIn(250);

        this.rowThresholdCount = [];
        for(var r=1; r<=2; r++) {
            this.rowThresholdCount[r] = Math.ceil(EPT._armyCounts[EPT._player[r]]/3)-4;
            if(this.rowThresholdCount[r] < 0) {
                this.rowThresholdCount[r] = 0;
            }
        }

        this.seethru[1].setInteractive({draggable:true});
        this.seethru[2].setInteractive({draggable:true});
        var that = this;
        this.input.on('drag', function(pointer, gameObject, dragX, dragY) {
            if(that.rowThresholdCount[that.visibleScreen] > 0) {
                gameObject.y = dragY;
                var n = that.visibleScreen;
                for(var i = 1; i < that.tile[n].length-1; i++) {
                    that.tile[n][i].button.y = that.tile[n][i].offsetTop-that.gridSize+dragY;
                    that.tile[n][i].dummy.y = that.tile[n][i].offsetTop-that.gridSize+dragY;
                    that.tile[n][i].border.y = that.tile[n][i].offsetTop-that.gridSize+dragY;
                    that.tile[n][i].percent.y = that.tile[n][i].offsetTop-60-that.gridSize+dragY;
                    that.tile[n][i].bar.y = that.tile[n][i].offsetTop+70-that.gridSize+dragY;
                    that.tile[n][i].count.y = that.tile[n][i].offsetTop+67-that.gridSize+dragY;
                    that.tile[n][i].undo.y = that.tile[n][i].offsetTop-30-that.gridSize+dragY;
                    that.tile[n][i].placeholder.y = that.tile[n][i].offsetTop-30-that.gridSize+dragY;
                }
            }
        });

        this.dragStartPos = 0;
        this.dragEndPos = 0;
        this.dragDir = 0;
        this.input.on('dragstart', function(pointer, gameObject, dragX, dragY) {
            that.dragStartPos = pointer.y;
        });

        this.tilesTopPos = [];
        this.tilesTopPos[1] = 0;
        this.tilesTopPos[2] = 0;

        this.input.on('dragend', function(pointer, gameObject, dragX, dragY) {
            if(that.rowThresholdCount[that.visibleScreen] > 0) {
                var n = that.visibleScreen;
                that.dragEndPos = pointer.y;
                that.dragDir = that.dragEndPos-that.dragStartPos;
                that.dragStep = Math.round(that.dragDir/that.gridSize);
                that.tilesTopPos[n] -= that.dragStep;

                var newY = Math.floor(that.tile[n][1].button.y);
                var snappedY = Phaser.Math.Snap.To(newY-that.gridTopOffset, that.gridSize);
                var snappedYDiff = snappedY - newY + that.gridTopOffset;

                if(newY-that.gridTopOffset > 0 && that.dragDir > 0) {
                    snappedYDiff -= snappedY;
                }
                if(newY-that.gridTopOffset < -that.rowThresholdCount[n]*that.gridSize && that.dragDir < 0) {
                    snappedYDiff -= (snappedY+that.rowThresholdCount[n]*that.gridSize);
                }
                that.tweenAllTiles(n, snappedYDiff, that);
            }
        });

        this.buttonUp = new Button(-5, EPT.world.height+5, 'button-up', function(){
            if(this.rowThresholdCount[this.visibleScreen] && this.tilesTopPos[this.visibleScreen] < this.rowThresholdCount[this.visibleScreen]) {
                EPT.Sfx.play('click');
                this.tilesTopPos[this.visibleScreen]++;
                var snappedYDiff = -that.gridSize;
                var n = that.visibleScreen;
                that.tweenAllTiles(n, snappedYDiff, that);
            }
        }, this, 'noframes').setOrigin(0, 1);

		this.buttonDown = new Button(EPT.world.width+5, EPT.world.height+5, 'button-down', function(){
            if(this.rowThresholdCount[this.visibleScreen] && this.tilesTopPos[this.visibleScreen] > 0) {
                EPT.Sfx.play('click');
                this.tilesTopPos[this.visibleScreen]--;
                var snappedYDiff = that.gridSize;
                var n = that.visibleScreen;
                that.tweenAllTiles(n, snappedYDiff, that);
            }
        }, this, 'noframes').setOrigin(1, 1).setAlpha(0.25);

        if(this.rowThresholdCount[this.visibleScreen] <= 0) {
            this.buttonUp.setAlpha(0.25);
        }

        this.popupInit();
    }
    tweenAllTiles(n, snappedYDiff, that) {
        that.tweens.add({targets: that.seethru[n], y: that.seethru[n].y+snappedYDiff, duration: 100, ease: 'Linear'});
        for(var i = 1; i < that.tile[n].length-1; i++) {
            that.tweens.add({targets: that.tile[n][i].button, y: that.tile[n][i].button.y+snappedYDiff, duration: 100, ease: 'Linear'});
            that.tweens.add({targets: that.tile[n][i].dummy, y: that.tile[n][i].dummy.y+snappedYDiff, duration: 100, ease: 'Linear'});
            that.tweens.add({targets: that.tile[n][i].border, y: that.tile[n][i].border.y+snappedYDiff, duration: 100, ease: 'Linear'});
            that.tweens.add({targets: that.tile[n][i].percent, y: that.tile[n][i].percent.y+snappedYDiff, duration: 100, ease: 'Linear'});
            that.tweens.add({targets: that.tile[n][i].bar, y: that.tile[n][i].bar.y+snappedYDiff, duration: 100, ease: 'Linear'});
            that.tweens.add({targets: that.tile[n][i].count, y: that.tile[n][i].count.y+snappedYDiff, duration: 100, ease: 'Linear'});
            that.tweens.add({targets: that.tile[n][i].undo, y: that.tile[n][i].undo.y+snappedYDiff, duration: 100, ease: 'Linear'});
            that.tweens.add({targets: that.tile[n][i].placeholder, y: that.tile[n][i].placeholder.y+snappedYDiff, duration: 100, ease: 'Linear'});
        }
        this.updateScrollingButtons();
    }
    updateScrollingButtons() {
        var n = this.visibleScreen;
        // console.log('this.rowThresholdCount['+n+']: '+this.rowThresholdCount[n]);
        // adjustment from drag
        if(this.tilesTopPos[n] > this.rowThresholdCount[n]) {
            this.tilesTopPos[n] = this.rowThresholdCount[n];
        }
        if(this.tilesTopPos[n] < 0) {
            this.tilesTopPos[n] = 0;
        }
        // update buttons
        if(this.tilesTopPos[n] > 0) {
            this.buttonUp.setAlpha(1);
        }
        if(this.tilesTopPos[n] == this.rowThresholdCount[n]) {
            this.buttonUp.setAlpha(0.25);
            this.buttonDown.setAlpha(1);
        }
        if(this.tilesTopPos[n] < this.rowThresholdCount[n]) {
            this.buttonDown.setAlpha(1);
        }
        if(this.tilesTopPos[n] == 0) {
            this.buttonDown.setAlpha(0.25);
            this.buttonUp.setAlpha(1);
            if(this.rowThresholdCount[n] == 0) {
                this.buttonUp.setAlpha(0.25);
            }
        }
    }
    renderHQ(n, activeDefault) {
        var active = (activeDefault) ? activeDefault : this.activeHQ[n];
        var x = (n == 1) ? 200 : 500;
        var activeScaleX = 1, activeScaleY = 1;
        var inactiveScaleX = 1, inactiveScaleY = 1; // .75

        if(active) {
            var name = EPT._armies[EPT._player[n]];
            var borderStyle = 'pattern';
            var currentScaleX = activeScaleX;
            var currentScaleY = activeScaleY;
            var offsetLeft = 0;
            var offsetTop = 0;
        }
        else {
            var name = EPT._armies[EPT._player[n]]+'-grey';
            var borderStyle = 'color';
            var currentScaleX = inactiveScaleX;
            var currentScaleY = inactiveScaleY;
            var offsetLeft = 35
            var offsetTop = 30;
        }

        var tween = [];
        tween[1] = [], tween[2] = [];
        tween[1][1] = 0, tween[1][2] = EPT.world.width;
        tween[2][1] = -EPT.world.width, tween[2][2] = 0;

        var y = 80;
        var id = EPT._player[n];

        this.hqShadow = [];
        this.hqBorder = [];
        this.hqTile = [];
        this.hqLabel = [];

        this.hq[n] = this.add.container();//.setScale(currentScaleX, currentScaleY);
        this.hqShadow[n] = this.add.sprite(x, y, 'hex-shadow').setOrigin(0.5);
        this.hqBorder[n] = this.add.sprite(x, y, 'hex-border-'+borderStyle).setOrigin(0.5);
        this.hqTile[n] = new Button(x, y, 'army-'+name, function(){
            EPT.Sfx.play('change');
            this.tweens.add({targets: this.allTiles[1], x: tween[n][1], duration: 500, ease: 'Back'});
            this.tweens.add({targets: this.allTiles[2], x: tween[n][2], duration: 500, ease: 'Back'});
            this.visibleScreen = (this.visibleScreen == 1) ? 2 : 1;

            this.seethru[1].x = tween[n][1];
            this.seethru[2].x = tween[n][2];

            if(this.activeHQ[n] != 'active') {
                this.updateScrollingButtons();
                this.hq[1].destroy();
                this.hq[2].destroy();
                if(this.activeHQ[1] == '') {
                    this.activeHQ = [0, 'active', ''];
                }
                else {
                    this.activeHQ = [0, '', 'active'];
                }
                this.renderHQ(1, this.activeHQ[1]);
                this.renderHQ(2, this.activeHQ[2]);
            }
        }, this, 'noframes').setOrigin(0.5);
        this.hqLabel[n] = this.add.sprite(x, y+65, 'hex-labels-'+EPT.Lang.current, id+1).setOrigin(0.5);//.setScale(1.1);
        this.countNum[n] = this.add.text(x+65, y-45, this.playerTileCount[n], this.fontTitle).setOrigin(0.5);
        this.hq[n].add([this.hqShadow[n],this.hqBorder[n],this.hqTile[n],this.hqLabel[n],this.countNum[n]]);
        
        this.tweenHQ(n, this.activeHQ[n]);
    }
    tweenHQ(n, type) {
        if(type == 'active') {
            // tweenfrom - set to 0.85
            this.hqShadow[n].setScale(0.8);
            this.hqBorder[n].setScale(0.8);
            this.hqTile[n].setScale(0.8);
            this.hqLabel[n].setScale(0.8);
            this.countNum[n].setScale(0.8);
            var tweenTo = 1;
            var moveTo = 0;
        }
        else {
            // tweenfrom - set to 1
            this.hqShadow[n].setScale(1);
            this.hqBorder[n].setScale(1);
            this.hqTile[n].setScale(1);
            this.hqLabel[n].setScale(1);
            this.countNum[n].setScale(1);
            var tweenTo = 0.85;
            var moveTo = 0;
        }
        var tx = this.countNum[n].x;
        var ty = this.hqLabel[n].y;
        this.tweens.add({targets: this.hqShadow[n], scaleX: tweenTo, scaleY: tweenTo, duration: 150, ease: 'Linear'});
        this.tweens.add({targets: this.hqBorder[n], scaleX: tweenTo, scaleY: tweenTo, duration: 150, ease: 'Linear'});
        this.tweens.add({targets: this.hqTile[n], scaleX: tweenTo, scaleY: tweenTo, duration: 150, ease: 'Linear'});
        this.tweens.add({targets: this.hqLabel[n], y: ty+moveTo, scaleX: tweenTo, scaleY: tweenTo, duration: 150, ease: 'Linear'});
        this.tweens.add({targets: this.countNum[n], x: tx+moveTo, scaleX: tweenTo, scaleY: tweenTo, duration: 150, ease: 'Linear'});
    }
    showAllTiles(n) {
        this.allTiles[n] = this.add.container();
        this.allTiles[n].x = EPT.world.width*(n-1);//+(this.visibleScreen-1)*EPT.world.width;
        this.tile[n] = [];
        var offsetLeft = 130, offsetTop = this.gridTopOffset;
        var armyName = EPT._armies[EPT._player[n]];
        var i = 1;
        for(var w = 0; w < 8; w++) {
            for(var h = 0; h < 3; h++) {
                this.tile[n][i] = {};
                var tileCount = EPT._currentTileCounts[EPT._player[n]];
                if(i <= EPT._armyCounts[EPT._player[n]]) {
                    var newX = offsetLeft + h * this.gridSize;
                    var newY = offsetTop + w * this.gridSize;
                    this.tile[n][i].offsetTop = newY;
                    var armyTexture = 'army-'+armyName;
                    this.tile[n][i].button = new Button(newX, newY, armyTexture, function(i){
                        return function(){ // REMOVE i tile
                            EPT.Sfx.play('kill');
                            if(tileCount[i-1] > 0) {
                                tileCount[i-1] -= 1;
                                this.playerTileCount[n] -= 1;
                                this.countNum[n].setText(this.playerTileCount[n]);
                                
                                this.tile[n][i].count.setText(tileCount[i-1]+' / '+EPT._tileCounts[EPT._player[n]][i-1]);
                                
                                var chance = Math.floor(((tileCount[i-1])/this.playerTileCount[n]).toFixed(2)*100);
                                if(isNaN(chance)) { chance = 0; }
                                this.tile[n][i].percent.setText(chance+'%');

                                this.tweens.add({targets: this.tile[n][i].dummy, scaleX: 2, scaleY: 2, alpha: 0, duration: 500, ease: 'Linear', onComplete: function(){
                                    this.tile[n][i].dummy.setScale(1);
                                    this.tile[n][i].dummy.setAlpha(1);
                                    if(tileCount[i-1] == 0) {
                                        this.tile[n][i].button.setTexture('army-'+armyName+'-grey', i);
                                        this.tweens.add({targets: this.tile[n][i].dummy, alpha: 0, duration: 500, ease: 'Linear'});
                                        this.tile[n][i].bar.setFrame(3);
                                    }
                                }, onCompleteScope: this});

                                this.tile[n][i].undo.input.enabled = true;
                                this.tile[n][i].undo.setAlpha(1);
                                this.tile[n][i].placeholder.setAlpha(0);
                            }
                            this.recalculatePercentages(n);
                        }
                    }(i), this, 'noframes').setFrame(i);
                    this.tile[n][i].dummy = this.add.sprite(newX, newY, 'army-'+armyName, i);
                    this.tile[n][i].border = this.add.sprite(newX, newY, 'hex-border-color');
                    var chance = Math.floor(((tileCount[i-1])/this.playerTileCount[n]).toFixed(2)*100);
                    this.tile[n][i].percent = this.add.text(newX-30, newY-60, chance+'%', this.fontMedium).setOrigin(0.5, 0.5);
                    this.tile[n][i].bar = this.add.sprite(newX, newY+70, 'button-small', 0);
                    this.tile[n][i].count = this.add.text(newX, newY+67, tileCount[i-1]+' / '+EPT._tileCounts[EPT._player[n]][i-1], this.fontSmall).setOrigin(0.5, 0.5);
                    this.tile[n][i].undo = new Button(newX+60, newY-30, 'button-undo', function(i){
                        return function(){ // UNDO i tile
                            EPT.Sfx.play('heal');
                            if(tileCount[i-1] < EPT._tileCounts[EPT._player[n]][i-1]) {
                                tileCount[i-1] += 1;
                                this.playerTileCount[n] += 1;
                                this.countNum[n].setText(this.playerTileCount[n]);

                                this.tile[n][i].count.setText(tileCount[i-1]+' / '+EPT._tileCounts[EPT._player[n]][i-1]);
                                var chance = Math.floor(((tileCount[i-1])/this.playerTileCount[n]).toFixed(2)*100);
                                if(isNaN(chance)) { chance = 0; }
                                this.tile[n][i].percent.setText(chance+'%');

                                this.tile[n][i].dummy.setScale(1.5);
                                this.tile[n][i].dummy.setAlpha(0);
                                this.tweens.add({targets: this.tile[n][i].dummy, scaleX: 1, scaleY: 1, alpha: 1, duration: 250, ease: 'Linear', onComplete: function(){
                                }, onCompleteScope: this});

                                this.tile[n][i].button.setTexture('army-'+armyName, i);
                                this.tile[n][i].bar.setFrame(0);
                            }
                            if(tileCount[i-1] == EPT._tileCounts[EPT._player[n]][i-1]) {
                                this.tile[n][i].undo.input.enabled = false;
                                this.tile[n][i].undo.setAlpha(0);
                                this.tile[n][i].placeholder.setAlpha(1);
                            }
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
        EPT.fadeOutScene('MainMenu', this);
    }
    popupInit() {
        this.popupOverlay = this.add.sprite(0, EPT.world.height, 'overlay').setOrigin(0, 0).setAlpha(0.75);
        this.popupContainer = this.add.container(0, EPT.world.height);
		var popupBg = this.add.sprite(EPT.world.centerX, 200, 'popup-bg').setOrigin(0.5);
        var popupTitle = this.add.sprite(EPT.world.centerX, 130, 'text-areyousure-'+EPT.Lang.current).setOrigin(0.5);
        var popupText = this.add.text(EPT.world.centerX, 235, EPT.text['popup-lostprogress'], this.fontPopup).setOrigin(0.5);
		var popupYes = new Button(EPT.world.centerX-100, 340, 'button-yes-'+EPT.Lang.current, function(){ this.clickBack(); }, this).setOrigin(0.5);
		var popupNo = new Button(EPT.world.centerX+100, 340, 'button-no-'+EPT.Lang.current, function(){ this.popupHide(); }, this).setOrigin(0.5);
		this.popupContainer.add([popupBg,popupTitle,popupText,popupYes,popupNo]);
    }
    popupShow() {
        EPT.Sfx.play('click');
        // move to the right spot and animate in
        this.popupOverlay.y = 0;
        this.popupOverlay.setAlpha(0);
        this.tweens.add({targets: this.popupOverlay, alpha: 0.75, duration: 150, ease: 'Linear'});
        this.popupContainer.x = EPT.world.centerX;
        this.popupContainer.y = 360;
        this.popupContainer.setScale(0);
        this.tweens.add({targets: this.popupContainer, x: 0, y: 140, scaleX: 1, scaleY: 1, duration: 350, ease: 'Back'});
    }
    popupHide() {
        // animate out and move off the screen
        this.tweens.add({targets: this.popupOverlay, alpha: 0, duration: 150, ease: 'Linear'});
        this.tweens.add({targets: this.popupContainer, x: EPT.world.centerX, y: 360, scaleX: 0, scaleY: 0, duration: 150, ease: 'Linear', onComplete: function(){
            this.popupOverlay.setAlpha(0.75);
            this.popupOverlay.y = EPT.world.height;
            this.popupContainer.y = EPT.world.height;
            this.popupContainer.setScale(1);
        }, onCompleteScope: this});
        EPT.Sfx.play('click');
    }
};