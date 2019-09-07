class Game extends Phaser.Scene {
    constructor() {
        super('Game');
    }
    create() {
        this.add.sprite(0, 0, 'background').setOrigin(0, 0);
        this.seethru = this.add.sprite(0, 190, 'img-seethru').setOrigin(0, 0);

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

        this.tabbar = this.add.sprite(0, -90, 'img-tabbar').setOrigin(0, 0);

		this.buttonBack = new Button(0, 0, 'button-home', this.popupShow, this, 'noframes');
        this.buttonBack.setOrigin(0, 0);

        this.visibleScreen = 1; // or 2
        this.countNum = [];

        this.hq = [];
        this.activeHQ = [0, 'active', ''];
        this.add.text(EPT.world.centerX+50, 100, 'vs', this.fontMedium).setOrigin(0.5);
        // this.renderHQ(1);
        // this.renderHQ(2);
        this.renderBothHQs();

        this.buttonUp = new Button(0, EPT.world.height, 'button-up', function(){
            this.tweens.add({targets: this.allTiles[this.visibleScreen], y: this.allTiles[this.visibleScreen].y-190, duration: 500, ease: 'Back'});
        }, this, 'noframes').setOrigin(0, 1);
		this.buttonDown = new Button(EPT.world.width, EPT.world.height, 'button-down', function(){
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
        this.popupInit();
    }
    renderHQ(n, activeDefault) {
        var active = (activeDefault) ? activeDefault : this.activeHQ[n];
        var x = (n == 1) ? 200 : 450;
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

        // x = x + offsetLeft*2*n + 20*(n-1);
        // y += offsetTop;

        this.hq[n] = this.add.container().setScale(currentScaleX, currentScaleY);
        var shadow = this.add.sprite(x, y, 'hex-shadow').setOrigin(0.5);
        var border = this.add.sprite(x, y, 'hex-border-'+borderStyle).setOrigin(0.5);
        var tile = new Button(x, y, 'army-'+name, function(){
            this.tweens.add({targets: this.allTiles[1], x: tween[n][1], duration: 500, ease: 'Back'});
            this.tweens.add({targets: this.allTiles[2], x: tween[n][2], duration: 500, ease: 'Back'});
            this.visibleScreen = n;
            // this.tweens.add({targets: this.hq[1], x: x-offsetLeft, y: y-offsetTop, scaleX: scaleX[n][1], scaleY: scaleY[n][1], duration: 500, ease: 'Back'});
            // this.tweens.add({targets: this.hq[2], x: x-offsetLeft, y: y-offsetTop, scaleX: scaleX[n][2], scaleY: scaleY[n][2], duration: 500, ease: 'Back', onComplete: function(){

                if(this.activeHQ[n] != 'active') {
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

            // }, onCompleteScope: this});
        }, this, 'noframes').setOrigin(0.5);
        var label = this.add.sprite(x, y+75, 'hex-labels-'+EPT.Lang.current, id+1).setOrigin(0.5);
        this.countNum[n] = this.add.text(x+65, y-45, this.playerTileCount[n], this.fontTitle).setOrigin(0.5);
        this.hq[n].add([shadow,border,tile,label,this.countNum[n]]);
    }
    renderBothHQs(n, change) {
        // if(this.activeHQ[n] == 'active') {
        //     console.log('nope');
        // }
        // else {
        //     this.hq[1].destroy();
        //     this.hq[2].destroy();
        //     if(change){
        //         if(this.activeHQ[1] == '') {
        //             this.activeHQ = [0, 'active', ''];
        //         }
        //         else {
        //             this.activeHQ = [0, '', 'active'];
        //         }
        //     }
        //     this.renderHQ(1, this.activeHQ[1]);
        //     this.renderHQ(2, this.activeHQ[2]);
        // }

        this.renderHQ(1, this.activeHQ[1]);
        this.renderHQ(2, this.activeHQ[2]);

        // if(change){
        //     if(this.activeHQ[1] == '') {
        //         this.activeHQ = [0, 'active', ''];
        //     }
        //     else {
        //         this.activeHQ = [0, '', 'active'];
        //     }
        // }
        // this.renderHQ(1, this.activeHQ[1]);
        // this.renderHQ(2, this.activeHQ[2]);
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
    }
};