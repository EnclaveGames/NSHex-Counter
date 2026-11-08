class Game extends Phaser.Scene {
    constructor() {
        super('Game');
    }
    create() {
        this.gridSize = 190;

        var saved = EPT._resume;
        EPT._resume = null;
        this.history = [];
        this.createIcons();

        this.fontTitle = { font: EPT.text['STYLE']+'46px '+EPT.text['FONT'], fill: '#fff', stroke: '#000', strokeThickness: 7, align: 'center' };
        this.fontSmall = { font: EPT.text['STYLE']+'28px '+EPT.text['FONT'], fill: '#fff', stroke: '#000', strokeThickness: 4, align: 'center' };
        this.fontMedium = { font: EPT.text['STYLE']+'36px '+EPT.text['FONT'], fill: '#fff', stroke: '#000', strokeThickness: 5, align: 'center' };
        this.fontPopup  = { font: EPT.text['STYLE']+'24px '+EPT.text['FONT'], fill: '#000', stroke: '#fff', strokeThickness: 3, align: 'center' };

        this.playerTileCount = [0, 34, 34];
        for(var c=1; c<=2; c++) {
            if(EPT._armies[EPT._player[c]] == 'dancer') {
                this.playerTileCount[c] = 32;
            }
        }
        if(EPT._oddsMode === undefined) { EPT._oddsMode = EPT.Storage.get('EPT-odds') === 3 ? 3 : 1; }
        this.freshCounts();
        if(saved) {
            EPT._currentTileCounts = saved.counts;
            this.playerTileCount = saved.total.slice();
            this.history = saved.history;
        }
        EPT.SaveGame.save(this);
        EPT.WakeLock.start();

        this.visibleScreen = 1; // or 2, used in the single-army (portrait) layout only
        this.buildUI(EPT.isWide());
        this.cameras.main.fadeIn(250);

        // laptops and tablets in landscape show both armies side by side; rotating the device or resizing the window switches layouts without losing the counts
        var that = this;
        var resizeTimer = null;
        var onResize = function() {
            clearTimeout(resizeTimer);
            resizeTimer = setTimeout(function() {
                if(that.sys && that.sys.isActive() && EPT.isWide() !== that.wide) {
                    that.relayout(EPT.isWide());
                }
            }, 200);
        };
        window.addEventListener('resize', onResize);
        window.addEventListener('orientationchange', onResize);
        this.events.once('shutdown', function() {
            clearTimeout(resizeTimer);
            window.removeEventListener('resize', onResize);
            window.removeEventListener('orientationchange', onResize);
            EPT.WakeLock.stop();
        });
    }
    freshCounts() {
        EPT._currentTileCounts = [0, 1, 2].map(function(n) {
            return n ? JSON.parse(JSON.stringify(EPT._tileCounts[EPT._player[n]])) : 0;
        });
    }
    createIcons() {
        var R = 28;
        var draw = {
            home: function(g) {
                g.fillTriangle(R, R-15, R-16, R-1, R+16, R-1);
                g.fillRect(R-11, R-2, 22, 17);
                g.fillStyle(0x1b1b1d, 1).fillRect(R-4, R+4, 8, 11);
            },
            undo: function(g) {
                g.beginPath();
                g.moveTo(R-4, R-10); g.lineTo(R+4, R-10);
                g.arc(R+4, R, 10, -Math.PI/2, Math.PI/2, false);
                g.lineTo(R-8, R+10);
                g.strokePath();
                g.fillTriangle(R-16, R+10, R-6, R+2, R-6, R+18);
            },
            odds: function(g) {
                g.fillCircle(R-9, R+7, 6); g.fillCircle(R+9, R+7, 6); g.fillCircle(R, R-9, 6);
            },
            restart: function(g) {
                var r = 13, end = Math.PI*1.45;
                g.beginPath();
                g.arc(R, R, r, -Math.PI*0.2, end, false);
                g.strokePath();
                var px = R+r*Math.cos(end), py = R+r*Math.sin(end);
                var tx = -Math.sin(end), ty = Math.cos(end), nx = Math.cos(end), ny = Math.sin(end);
                g.fillTriangle(px+tx*9, py+ty*9, px-tx*2+nx*7, py-ty*2+ny*7, px-tx*2-nx*7, py-ty*2-ny*7);
            }
        };
        for(var name in draw) {
            if(this.textures.exists('icon-'+name)) { continue; }
            var g = this.make.graphics({x: 0, y: 0, add: false});
            g.fillStyle(0x1b1b1d, 1).fillCircle(R, R, R-2);
            g.lineStyle(3, 0xfdb535, 1).strokeCircle(R, R, R-3);
            g.lineStyle(5, 0xffffff, 1).fillStyle(0xffffff, 1);
            draw[name](g);
            g.generateTexture('icon-'+name, R*2, R*2);
            g.destroy();
        }
    }
    buildUI(wide) {
        this.wide = wide;
        EPT.setWorldSize(this, wide);

        var halves = wide ? 2 : 1;
        for(var b = 0; b < halves; b++) {
            this.add.sprite(b*640, 0, 'background').setOrigin(0, 0);
        }

        this.allTiles = [];
        this.tile = [];
        this.showAllTiles(1);
        this.showAllTiles(2);

        for(var t = 0; t < halves; t++) {
            this.add.sprite(t*640, -100, 'img-tabbar').setOrigin(0, 0);
        }

        // a column of round buttons in the free space left of the first army, above the tiles
        this.buttonBack = new Button(32, 30, 'icon-home', function(){ this.popupShow('home'); }, this, 'noframes').setScale(0.9);
        this.buttonUndo = new Button(32, 86, 'icon-undo', this.undoLast, this, 'noframes').setScale(0.9);
        this.buttonRestart = new Button(32, 142, 'icon-restart', function(){ this.popupShow('restart'); }, this, 'noframes').setScale(0.9);
        this.updateUndoButton();
        // portrait: keep clear of the second army's tile count in the top corner
        var oddsY = wide ? 30 : 108;
        this.buttonOdds = new Button(EPT.world.width-32, oddsY, 'icon-odds', this.toggleOdds, this, 'noframes').setScale(wide ? 0.9 : 0.8);
        this.oddsLabel = this.add.text(EPT.world.width-32, oddsY+(wide ? 38 : 32), this.oddsCaption(), this.fontSmall).setOrigin(0.5, 0).setScale(0.55);
        this.oddsLabel.x = Math.min(this.oddsLabel.x, EPT.world.width-4-this.oddsLabel.displayWidth/2);

        this.countNum = [];
        this.hq = [];
        if(wide) {
            this.activeHQ = [0, 'active', 'active'];
        }
        else {
            this.activeHQ = (this.visibleScreen == 1) ? [0, 'active', ''] : [0, '', 'active'];
        }
        this.add.text(wide ? EPT.world.centerX : EPT.world.centerX+40, 80, 'vs', this.fontMedium).setOrigin(0.5);

        this.renderHQ(1, this.activeHQ[1]);
        this.renderHQ(2, this.activeHQ[2]);

        for(var n = 1; n <= 2; n++) {
            this.allTiles[n].x = wide ? EPT.world.width/2*(n-1) : EPT.world.width*(n-this.visibleScreen);
        }

        this.popupInit();
    }
    relayout(wide) {
        this.tweens.killAll();
        this.children.list.slice().forEach(function(child) { child.destroy(); });
        this.buildUI(wide);
    }
    renderHQ(n, activeDefault) {
        var active = (activeDefault) ? activeDefault : this.activeHQ[n];
        var x = this.wide ? ((n == 1) ? 320 : 960) : ((n == 1) ? 200 : 500);
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
            var name = EPT.greyKey(this, 'army-'+EPT._armies[EPT._player[n]]).replace('army-','');
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
            if(this.wide) { return; }
            EPT.Sfx.play('change');

            this.tweens.killTweensOf([this.allTiles[1], this.allTiles[2]]);
            this.tweens.add({targets: this.allTiles[1], x: tween[n][1], duration: 400, ease: 'Back'});
            this.tweens.add({targets: this.allTiles[2], x: tween[n][2], duration: 400, ease: 'Back'});

            this.visibleScreen = n;

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
    getTilesLayout(count) {
        // every tile must fit on the screen at once, so pick the column count that allows the largest tile scale
        var areaTop = this.gridSize-5, areaHeight = EPT.world.height-areaTop-10;
        var areaWidth = this.wide ? 610 : 640; // a half of the screen in landscape
        var cellNaturalW = 165, cellNaturalH = 175;
        var best = null;
        for(var cols = 3; cols <= (this.wide ? 6 : 5); cols++) {
            var rows = Math.ceil(count/cols);
            var cellW = areaWidth/cols, cellH = areaHeight/rows;
            var scale = Math.min(1, cellW/cellNaturalW, cellH/cellNaturalH);
            if(!best || scale > best.scale + 0.001) {
                best = { cols: cols, rows: rows, cellW: cellW, cellH: cellH, scale: scale, top: areaTop, width: areaWidth };
            }
        }
        return best;
    }
    showAllTiles(n) {
        this.allTiles[n] = this.add.container();
        this.tile[n] = [];
        var armyName = EPT._armies[EPT._player[n]];
        var count = EPT._armyCounts[EPT._player[n]];
        var layout = this.getTilesLayout(count);
        this.layout = this.layout || [];
        this.layout[n] = layout;
        var s = layout.scale;
        var tileCount = EPT._currentTileCounts[n];
        for(var i = 1; i <= count; i++) {
            this.tile[n][i] = {};
            var row = Math.floor((i-1)/layout.cols);
            var col = (i-1)%layout.cols;
            var inRow = Math.min(layout.cols, count-row*layout.cols);
            var newX = (640-inRow*layout.cellW)/2 + (col+0.5)*layout.cellW;
            var newY = layout.top + (row+0.5)*layout.cellH - 3*s;
            this.tile[n][i].button = new Button(newX, newY, 'army-'+armyName, function(i){
                return function(){ this.removeTile(n, i); }
            }(i), this, 'noframes').setFrame(i).setScale(s);
            this.tile[n][i].dummy = this.add.sprite(newX, newY, 'army-'+armyName, i).setScale(s);
            this.tile[n][i].border = this.add.sprite(newX, newY, 'hex-border-color').setScale(s);
            this.tile[n][i].percent = this.add.text(newX-30*s, newY-60*s, this.chanceText(n, i), this.fontMedium).setOrigin(0.5, 0.5).setScale(s);
            this.tile[n][i].bar = this.add.sprite(newX, newY+70*s, 'button-small', 0).setScale(s);
            this.tile[n][i].count = this.add.text(newX, newY+67*s, tileCount[i-1]+' / '+EPT._tileCounts[EPT._player[n]][i-1], this.fontSmall).setOrigin(0.5, 0.5).setScale(s);
            this.tile[n][i].undo = new Button(newX+60*s, newY-30*s, 'button-undo', function(i){
                return function(){ this.restoreTile(n, i); }
            }(i), this).setScale(s);
            this.tile[n][i].undo.input.enabled = false;
            this.tile[n][i].undo.setAlpha(0);
            this.tile[n][i].placeholder = this.add.sprite(newX+60*s, newY-30*s, 'button-undo', 3).setScale(s);
            if(tileCount[i-1] == 0) {
                this.tile[n][i].button.setTexture(EPT.greyKey(this, 'army-'+armyName), i);
                this.tile[n][i].dummy.setAlpha(0);
                this.tile[n][i].bar.setFrame(3);
            }
            if(tileCount[i-1] < EPT._tileCounts[EPT._player[n]][i-1]) {
                this.tile[n][i].undo.input.enabled = true;
                this.tile[n][i].undo.setAlpha(1);
                this.tile[n][i].placeholder.setAlpha(0);
            }
            this.allTiles[n].add([
                this.tile[n][i].button,this.tile[n][i].dummy,this.tile[n][i].border,
                this.tile[n][i].percent,this.tile[n][i].bar,this.tile[n][i].count,
                this.tile[n][i].undo,this.tile[n][i].placeholder]);
        }
    }
    removeTile(n, i) {
        EPT.Sfx.play('kill');
        var tileCount = EPT._currentTileCounts[n];
        var armyName = EPT._armies[EPT._player[n]];
        var s = this.layout[n].scale;
        var tile = this.tile[n][i];
        if(tileCount[i-1] > 0) {
            tileCount[i-1] -= 1;
            EPT.haptic(12);
            this.playerTileCount[n] -= 1;
            this.countNum[n].setText(this.playerTileCount[n]);
            tile.count.setText(tileCount[i-1]+' / '+EPT._tileCounts[EPT._player[n]][i-1]);

            this.tweens.add({targets: tile.dummy, scaleX: 2*s, scaleY: 2*s, alpha: 0, duration: 500, ease: 'Linear', onComplete: function(){
                if(!this.tile || !this.tile[n] || this.tile[n][i] !== tile || !tile.dummy.scene) { return; }
                tile.dummy.setScale(s);
                tile.dummy.setAlpha(1);
                if(tileCount[i-1] == 0) {
                    tile.button.setTexture(EPT.greyKey(this, 'army-'+armyName), i);
                    this.tweens.add({targets: tile.dummy, alpha: 0, duration: 500, ease: 'Linear'});
                    tile.bar.setFrame(3);
                }
            }, callbackScope: this});

            tile.undo.input.enabled = true;
            tile.undo.setAlpha(1);
            tile.placeholder.setAlpha(0);

            this.history.push({n: n, i: i});
            if(this.history.length > 200) { this.history.shift(); }
            this.updateUndoButton();
            EPT.SaveGame.save(this);
        }
        this.recalculatePercentages(n);
    }
    restoreTile(n, i) {
        EPT.Sfx.play('heal');
        var tileCount = EPT._currentTileCounts[n];
        var armyName = EPT._armies[EPT._player[n]];
        var s = this.layout[n].scale;
        var tile = this.tile[n][i];
        if(tileCount[i-1] < EPT._tileCounts[EPT._player[n]][i-1]) {
            tileCount[i-1] += 1;
            EPT.haptic([8, 40, 8]);
            this.playerTileCount[n] += 1;
            this.countNum[n].setText(this.playerTileCount[n]);
            tile.count.setText(tileCount[i-1]+' / '+EPT._tileCounts[EPT._player[n]][i-1]);

            tile.dummy.setScale(1.5*s);
            tile.dummy.setAlpha(0);
            this.tweens.add({targets: tile.dummy, scaleX: s, scaleY: s, alpha: 1, duration: 250, ease: 'Linear'});

            tile.button.setTexture('army-'+armyName, i);
            tile.bar.setFrame(0);

            for(var h = this.history.length-1; h >= 0; h--) {
                if(this.history[h].n === n && this.history[h].i === i) {
                    this.history.splice(h, 1);
                    break;
                }
            }
            this.updateUndoButton();
            EPT.SaveGame.save(this);
        }
        if(tileCount[i-1] == EPT._tileCounts[EPT._player[n]][i-1]) {
            tile.undo.input.enabled = false;
            tile.undo.setAlpha(0);
            tile.placeholder.setAlpha(1);
        }
        this.recalculatePercentages(n);
    }
    undoLast() {
        var last = this.history[this.history.length-1];
        if(last) { this.restoreTile(last.n, last.i); }
    }
    updateUndoButton() {
        var has = this.history.length > 0;
        this.buttonUndo.setAlpha(has ? 1 : 0.35);
        this.buttonUndo.input.enabled = has;
    }
    restartGame() {
        var that = this;
        this.time.delayedCall(30, function() {
            that.freshCounts();
            that.playerTileCount = [0, 34, 34];
            for(var c = 1; c <= 2; c++) {
                if(EPT._armies[EPT._player[c]] == 'dancer') { that.playerTileCount[c] = 32; }
            }
            that.history = [];
            that.relayout(that.wide);
            EPT.SaveGame.save(that);
        });
    }
    rerenderTiles() {
        this.allTiles[1].destroy();
        this.allTiles[2].destroy();
        this.allTiles = [];
        this.showAllTiles(1);
        this.showAllTiles(2);
    }
    chanceText(n, i) {
        // single draw, or the chance of getting the tile at least once in the next 3 draws (a regular NS Hex turn)
        var k = EPT._currentTileCounts[n][i-1], total = this.playerTileCount[n];
        var draws = EPT._oddsMode === 3 ? Math.min(3, total) : 1;
        if(!total || !k) { return '0%'; }
        var miss = 1;
        for(var j = 0; j < draws; j++) { miss *= Math.max(0, total-k-j)/(total-j); }
        return Math.round((1-miss)*100)+'%';
    }
    toggleOdds() {
        EPT.Sfx.play('click');
        EPT._oddsMode = EPT._oddsMode === 3 ? 1 : 3;
        EPT.Storage.set('EPT-odds', EPT._oddsMode);
        this.oddsLabel.setText(this.oddsCaption());
        this.oddsLabel.x = Math.min(this.oddsLabel.x, EPT.world.width-4-this.oddsLabel.displayWidth/2);
        this.recalculatePercentages(1);
        this.recalculatePercentages(2);
    }
    oddsCaption() {
        return EPT._oddsMode === 3 ? EPT.text['odds-3'] : EPT.text['odds-1'];
    }
    recalculatePercentages(n) {
        var tileCount = EPT._currentTileCounts[n];
        for(var i = 1; i <= EPT._armyCounts[EPT._player[n]]; i++) {
            this.tile[n][i].percent.setText(this.chanceText(n, i));
        }
    }
	stateRestart() {
		EPT.Sfx.play('click');
        EPT.fadeOutScene('Game', this);
	}
	clickBack() {
        EPT.Sfx.play('click');
        EPT.SaveGame.clear();
        EPT.fadeOutScene('MainMenu', this);
    }
    popupInit() {
        this.popupOverlay = this.add.sprite(0, EPT.world.height, 'overlay').setOrigin(0, 0).setDisplaySize(EPT.world.width, EPT.world.height).setAlpha(0.75);
        this.popupContainer = this.add.container(0, EPT.world.height);
		var popupBg = this.add.sprite(EPT.world.centerX, 200, 'popup-bg').setOrigin(0.5);
        var popupTitle = this.add.sprite(EPT.world.centerX, 130, 'text-areyousure-'+EPT.Lang.current).setOrigin(0.5);
        var popupText = this.add.text(EPT.world.centerX, 235, EPT.text['popup-lostprogress'], this.fontPopup).setOrigin(0.5);
		var popupYes = new Button(EPT.world.centerX-100, 340, 'button-yes-'+EPT.Lang.current, function(){ this.popupConfirm(); }, this).setOrigin(0.5);
		var popupNo = new Button(EPT.world.centerX+100, 340, 'button-no-'+EPT.Lang.current, function(){ this.popupHide(); }, this).setOrigin(0.5);
		this.popupContainer.add([popupBg,popupTitle,popupText,popupYes,popupNo]);
    }
    popupConfirm() {
        if(this.popupAction == 'restart') {
            EPT.Sfx.play('click');
            this.popupHide();
            this.restartGame();
        }
        else {
            this.clickBack();
        }
    }
    popupShow(action) {
        this.popupAction = action;
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
        }, callbackScope: this});
        EPT.Sfx.play('click');
    }
};