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
				['title', 'img/title.png'],
				['background', 'img/background.png'],
				['clickme', 'img/clickme.png'],
				['overlay', 'img/overlay.png'],
				['button-beer', 'img/button-beer.png'],
				['banner-beer', 'img/banner-beer.png'],
				['button-settings', 'img/button-settings.png'],
				['button-back', 'img/button-back.png'],
				['button-up', 'img/button-up.png'],
				['button-down', 'img/button-down.png'],
				['button-home', 'img/button-home.png'],
				['particle', 'img/particle.png'],
				['img-tiles', 'img/img-tiles.png'],
				['img-topbar', 'img/img-topbar.png'],
				['img-navbar', 'img/img-navbar.png'],
				['img-tabbar', 'img/img-tabbar.png'],
				['img-seethru', 'img/img-seethru.png'],
				['logo-portalgames', 'img/logo-portalgames.png'],
				['logo-neuroshimahexpl', 'img/logo-neuroshimahexpl.png'],
				['logo-enclavegames', 'img/logo-enclave-black.png'],

				['hex-border-color', 'img/hex-border-color.png'],
				['hex-border-pattern', 'img/hex-border-pattern.png'],
				['hex-shadow', 'img/hex-shadow.png']
			],
			'spritesheet': [
				['button-player1', 'img/button-player1.png', {frameWidth:300,frameHeight:85}],
				['button-player2', 'img/button-player2.png', {frameWidth:300,frameHeight:85}],
				['button-change', 'img/button-change.png', {frameWidth:300,frameHeight:85}],
				['button-credits', 'img/button-credits.png', {frameWidth:300,frameHeight:85}],
				['button-more', 'img/button-more.png', {frameWidth:300,frameHeight:85}],
				['button-start', 'img/button-start.png', {frameWidth:450,frameHeight:128}],
				['button-sound-on', 'img/button-sound-on.png', {frameWidth:160,frameHeight:85}],
				['button-sound-off', 'img/button-sound-off.png', {frameWidth:160,frameHeight:85}],
				['button-music-on', 'img/button-music-on.png', {frameWidth:160,frameHeight:85}],
				['button-music-off', 'img/button-music-off.png', {frameWidth:160,frameHeight:85}],

				['button-copyright', 'img/button-copyright.png', {frameWidth:300,frameHeight:85}],
				['button-language', 'img/button-language.png', {frameWidth:300,frameHeight:85}],
				['button-language-english-on', 'img/button-language-english-on.png', {frameWidth:300,frameHeight:85}],
				['button-language-english-off', 'img/button-language-english-off.png', {frameWidth:300,frameHeight:85}],
				['button-language-polish-on', 'img/button-language-polish-on.png', {frameWidth:300,frameHeight:85}],
				['button-language-polish-off', 'img/button-language-polish-off.png', {frameWidth:300,frameHeight:85}],

				['button-small', 'img/button-small2.png', {frameWidth:120,frameHeight:44}],
				['button-undo', 'img/button-undo.png', {frameWidth:45,frameHeight:49}],

				['tiles-hqs', 'img/tiles-hqs.png', {frameWidth:150,frameHeight:130}],
				['hex-labels', 'img/hex-labels.png', {frameWidth:170,frameHeight:35}],

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
				['army-sandrunners', 'img/army-sandrunners.png', {frameWidth:150,frameHeight:130}]
			],
			'audio': [
				['sound-click', ['sfx/audio-button.m4a','sfx/audio-button.mp3','sfx/audio-button.ogg']],
				['music-theme', ['sfx/music-bitsnbites-liver.m4a','sfx/music-bitsnbites-liver.mp3','sfx/music-bitsnbites-liver.ogg']]
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
		EPT.Sfx.manage('music', 'init', this);
		EPT.Sfx.manage('sound', 'init', this);
		// EPT._player[1] = 16; // 0 - moloch, 9 - dancer
		// EPT._player[2] = 9; // 3 - outpost, 16 - iron gang
		EPT.fadeOutScene('MainMenu', this);
	}
}