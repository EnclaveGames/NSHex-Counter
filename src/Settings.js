class Settings extends Phaser.Scene {
    constructor() {
        super('Settings');
    }
    create() {
		this.add.sprite(0, 0, 'background').setOrigin(0, 0);
		this.screenName = 'settings';

		this.navbar = this.add.sprite(0, 0, 'img-navbar').setOrigin(0, 0);

		this.buttonBack = new Button(20, 25, 'button-back', this.clickBack, this, 'noframes');
		this.buttonBack.setOrigin(0, 0);

		var fontTitle = { font: '40px '+EPT.text['FONT'], fill: '#fff', align: 'center' };
		var fontSubtitle = { font: '38px '+EPT.text['FONT'], fill: '#000', align: 'center' };
		var fontSmall = { font: '28px '+EPT.text['FONT'], fill: '#000', align: 'center' };
		var fontTiny = { font: '16px '+EPT.text['FONT'], fill: '#000', align: 'center' };

		this.titleSettings = this.add.text(EPT.world.centerX, 45, EPT.text['settings'], fontTitle);
		this.titleSettings.setOrigin(0.5, 0.5);
		
		this.containerSettingsBar = this.add.container(0, 0);
		this.containerSettingsBar.add([this.navbar,this.buttonBack,this.titleSettings]);

		this.buttonSound = new Button(EPT.world.centerX-100, 250, 'button-sound-on', this.clickSound, this);
		this.buttonSound.setOrigin(0.5, 0.5);
		this.buttonMusic = new Button(EPT.world.centerX+100, 250, 'button-music-on', this.clickMusic, this);
		this.buttonMusic.setOrigin(0.5, 0.5);
		this.buttonCredits = new Button(EPT.world.centerX, 400, 'button-credits', this.clickCredits, this);
		this.buttonCredits.setOrigin(0.5, 0.5);
		this.buttonMore = new Button(EPT.world.centerX, 550, 'button-more', this.clickMore, this);
		this.buttonMore.setOrigin(0.5, 0.5);

		this.textCopyrightTitle = this.add.text(EPT.world.centerX, EPT.world.height-300, EPT.text['copyright-title'], fontTiny);
		this.textCopyrightTitle.setOrigin(0.5, 0);
		this.textCopyrightDescription = this.add.text(EPT.world.centerX, EPT.world.height-270, EPT.text['copyright-description'], fontTiny);
		this.textCopyrightDescription.setOrigin(0.5, 0);

        this.bannerBeer = new Button(EPT.world.centerX, EPT.world.height-60, 'banner-beer', this.clickBeer, this, 'static');
		this.bannerBeer.setOrigin(0.5, 1);
		
		if(document.monetization && document.monetization.state === 'started') {
			this.bannerBeer.destroy();
			this.textThanks = this.add.text(EPT.world.centerX, EPT.world.height-30, EPT.text['thanks'], fontSmall);
			this.textThanks.setOrigin(0.5, 1);
		}

		EPT.Sfx.update('sound', this.buttonSound, this.textSound);
		EPT.Sfx.update('music', this.buttonMusic, this.textMusic);

		this.clickSettings();		

		var offsetTopCredits = 20;
		var offsetTopCrew = 550;
		this.containerCredits = this.add.container(0, EPT.world.height);
		var creditsBg = this.add.sprite(0, 0, 'background');
		creditsBg.setOrigin(0, 0);

		this.navbarCredits = this.add.sprite(0, 0, 'img-navbar').setOrigin(0);

		this.creditsBack = new Button(20, 25, 'button-back', function(){this.clickBack('credits');}, this, 'noframes');
		this.creditsBack.setOrigin(0, 0);

		this.titleCredits = this.add.text(EPT.world.centerX, offsetTopCredits+45, EPT.text['credits'], fontTitle);
		this.titleCredits.setOrigin(0.5, 0.5);	

		// this.containerCreditsBar = this.add.container(0, 0);
		// this.containerCreditsBar.add([this.navbarCredits,this.titleCredits]);

		var titleCreditsText = this.add.text(EPT.world.centerX, offsetTopCredits+170, EPT.text['madeby'], fontSubtitle);
		titleCreditsText.setOrigin(0.5,0);
		this.titleCreditsLogo = this.add.sprite(EPT.world.centerX, offsetTopCredits+270, 'logo-enclave', 1);
		this.titleCreditsLogo.setOrigin(0.5,0);
		this.titleCreditsLogo.setInteractive({ useHandCursor: true });
		this.titleCreditsLogo.on('pointerdown', function() { this.clickEnclave(); }, this);
		var titleCreditsUrl = this.add.text(EPT.world.centerX, offsetTopCredits+400, 'enclavegames.com', fontSubtitle);
		titleCreditsUrl.setOrigin(0.5,0);
		titleCreditsUrl.setInteractive({ useHandCursor: true });
		titleCreditsUrl.on('pointerdown', function() { this.clickEnclave(); }, this);

		var titleCrew = this.add.text(EPT.world.centerX, offsetTopCrew, EPT.text['team'], fontSubtitle);
		titleCrew.setOrigin(0.5,0);
		var titleCrewAndrzej = this.add.text(EPT.world.centerX, offsetTopCrew+80, 'Andrzej Mazur - '+EPT.text['coding'], fontSubtitle);
		titleCrewAndrzej.setOrigin(0.5,0);
		var titleCrewEwa = this.add.text(EPT.world.centerX, offsetTopCrew+140, 'Ewa Mazur - '+EPT.text['design'], fontSubtitle);
		titleCrewEwa.setOrigin(0.5,0);
		var titleCrewKasia = this.add.text(EPT.world.centerX, offsetTopCrew+200, 'Kasia Mazur - '+EPT.text['testing'], fontSubtitle);
		titleCrewKasia.setOrigin(0.5,0);
		var titleCreditsMusic = this.add.text(EPT.world.centerX, offsetTopCrew+320, EPT.text['musicby']+' Bensound', fontSubtitle);
		titleCreditsMusic.setOrigin(0.5,0);

		this.containerCredits.add([creditsBg,this.navbarCredits,this.creditsBack,this.titleCredits,titleCreditsText,this.titleCreditsLogo,titleCreditsUrl]);
		this.containerCredits.add([titleCrew,titleCrewAndrzej,titleCrewEwa,titleCrewKasia,titleCreditsMusic]);

		this.cameras.main.fadeIn(250);
	}
	clickSound() {
		EPT.Sfx.play('click');
		EPT.Sfx.manage('sound', 'switch', this, this.buttonSound, this.textSound);
	}
	clickMusic() {
		EPT.Sfx.play('click');
		EPT.Sfx.manage('music', 'switch', this, this.buttonMusic, this.textMusic);
	}
	clickSettings() {
		// do tweening
		this.navbar.y = -this.navbar.height;
		this.tweens.add({targets: this.navbar, y: 0, duration: 500, ease: 'Linear'});
		this.buttonBack.y = -this.buttonBack.height-25;
		this.tweens.add({targets: this.buttonBack, y: 25, duration: 500, ease: 'Linear'});
		this.titleSettings.y = -this.titleSettings.height;
		this.tweens.add({targets: this.titleSettings, y: 45, duration: 500, ease: 'Linear'});

		this.buttonSound.setScale(0.5);
		this.tweens.add({targets: this.buttonSound, scaleX: 1, scaleY: 1, duration: 500, delay: 0, ease: 'Cubic.easeOut' });
		this.buttonMusic.setScale(0.5);
		this.tweens.add({targets: this.buttonMusic, scaleX: 1, scaleY: 1, duration: 500, delay: 125, ease: 'Cubic.easeOut' });
		this.buttonCredits.setScale(0.5);
		this.tweens.add({targets: this.buttonCredits, scaleX: 1, scaleY: 1, duration: 500, delay: 250, ease: 'Cubic.easeOut' });
		this.buttonMore.setScale(0.5);
		this.tweens.add({targets: this.buttonMore, scaleX: 1, scaleY: 1, duration: 500, delay: 375, ease: 'Cubic.easeOut' });
	}
	clickCredits() {
		EPT.Sfx.play('click');

		var that = this;
		EPT.fadeOutIn(function(){
			that.containerCredits.y = 0;
			that.navbarCredits.y = -that.navbarCredits.height;
			that.tweens.add({targets: that.navbarCredits, y: 0, duration: 500, ease: 'Linear'});
			that.titleCredits.y = -that.titleCredits.height;
			that.tweens.add({targets: that.titleCredits, y: 45, duration: 500, ease: 'Linear'});
			that.creditsBack.y = -that.creditsBack.height-25;
			that.tweens.add({targets: that.creditsBack, y: 25, duration: 500, ease: 'Linear'});

			// that.titleCreditsLogo.setScale(0.5);
			// that.tweens.add({targets: that.titleCreditsLogo, scaleX: 1, scaleY: 1, duration: 500, delay: 0, ease: 'Cubic.easeOut' });
		}, this);

		// this.buttonBack.alpha = 0;
		this.buttonBack.input.enabled = false;
		this.buttonSound.input.enabled = false;
		this.buttonMusic.input.enabled = false;
		this.buttonCredits.input.enabled = false;
		if(this.bannerBeer && this.bannerBeer.input && this.bannerBeer.input.enabled) {
			this.bannerBeer.input.enabled = false;
		}
		this.screenName = 'credits';
	}
    clickBeer() {
        // console.log('Beer clicked!');
        EPT.Sfx.play('click');
        window.top.location.href = 'https://www.paypal.me/end3r';
    }
	clickBack(name) {
		EPT.Sfx.play('click');
		if(name) {
			this.buttonBack.alpha = 1;
			this.buttonBack.input.enabled = true;
			this.buttonSound.input.enabled = true;
			this.buttonMusic.input.enabled = true;
			this.buttonCredits.input.enabled = true;
			if(this.bannerBeer && this.bannerBeer.input && this.bannerBeer.input.enabled) {
				this.bannerBeer.input.enabled = true;
			}
			if(name == 'credits') {
				var that = this;
				EPT.fadeOutIn(function(){
					that.containerCredits.y = EPT.world.height;
					that.clickSettings();
				}, this);
			}
			this.screenName = 'settings';
		}
		else {
			EPT.fadeOutScene('MainMenu', this);
		}
	}
	clickEnclave() {
		EPT.Sfx.play('click');
		window.top.location.href = 'https://enclavegames.com/';
	}
	clickMore() {
		EPT.Sfx.play('click');
		window.top.location.href = 'https://enclavegames.com/games.html';
	}
};