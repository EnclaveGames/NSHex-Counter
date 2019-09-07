class Preloader extends Phaser.Scene {
    constructor() {
        super('Preloader');
    }
    preload() {
		this.add.sprite(0, 0, 'background-black').setOrigin(0, 0);
        var logoCounter = this.add.sprite(EPT.world.centerX, 150, 'logo-counter');
        logoCounter.setOrigin(0.5, 0.5);
		var loadingBg = this.add.sprite(EPT.world.centerX, EPT.world.centerY-80, 'loading-background');
		loadingBg.setOrigin(0.5, 0.5);
        var logoEnclave = this.add.sprite(EPT.world.centerX, EPT.world.centerY+100, 'logo-enclave');
        logoEnclave.setOrigin(0.5, 0.5);

		var progress = this.add.graphics();
		this.load.on('progress', function (value) {
			progress.clear();
			progress.fillStyle(0xffde00, 1);
			progress.fillRect(loadingBg.x-(loadingBg.width*0.5)+20, loadingBg.y-(loadingBg.height*0.5)+10, 540 * value, 25);
		});

		var resources = {
			'image': [
				['background', 'img/background.png'],
				['button-settings', 'img/button-settings.png'],
				['img-tiles', 'img/img-tiles.png'],
				['img-topbar', 'img/img-topbar.png'],
				['img-navbar', 'img/img-navbar.png'],
				['hex-border-color', 'img/hex-border-color.png'],
				['hex-border-pattern', 'img/hex-border-pattern.png'],
				['hex-shadow', 'img/hex-shadow.png']
			],
			'spritesheet': [
				['hex-labels-pl', 'img/lang/pl/hex-labels.png', {frameWidth:170,frameHeight:35}],
				['button-start-pl', 'img/lang/pl/button-start.png', {frameWidth:450,frameHeight:128}],
				['button-player1-pl', 'img/lang/pl/button-player1.png', {frameWidth:300,frameHeight:85}],
				['button-player2-pl', 'img/lang/pl/button-player2.png', {frameWidth:300,frameHeight:85}],
				['button-change-pl', 'img/lang/pl/button-change.png', {frameWidth:300,frameHeight:85}],

				['hex-labels-en', 'img/lang/en/hex-labels.png', {frameWidth:170,frameHeight:35}],
				['button-start-en', 'img/lang/en/button-start.png', {frameWidth:450,frameHeight:128}],
				['button-player1-en', 'img/lang/en/button-player1.png', {frameWidth:300,frameHeight:85}],
				['button-player2-en', 'img/lang/en/button-player2.png', {frameWidth:300,frameHeight:85}],
				['button-change-en', 'img/lang/en/button-change.png', {frameWidth:300,frameHeight:85}],

				['loader', 'img/loader.png', {frameWidth:45,frameHeight:45}],
				['tiles-hqs', 'img/tiles-hqs.png', {frameWidth:150,frameHeight:130}]
			]
		};
		for(var method in resources) {
			resources[method].forEach(function(args) {
				var loader = this.load[method];
				loader && loader.apply(this.load, args);
			}, this);
		};
    }
    create() {
		// EPT.Sfx.manage('music', 'init', this);
		// EPT.Sfx.manage('sound', 'init', this);
		// EPT._player[1] = 16; // 0 - moloch, 9 - dancer
		// EPT._player[2] = 9; // 3 - outpost, 16 - iron gang
		EPT.fadeOutScene('MainMenu', this);
	}
}