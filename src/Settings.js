class Settings extends Phaser.Scene {
    constructor() {
        super('Settings');
    }
    create() {
		this.add.sprite(0, 0, 'background').setOrigin(0, 0);
		this.screenName = 'settings';

		this.navbar = this.add.sprite(0, 0, 'img-navbar').setOrigin(0, 0);

		this.buttonBack = new Button(10, 10, 'button-back', this.clickBack, this, 'noframes').setOrigin(0, 0);

		var fontTitle = { font: EPT.text['STYLE']+'40px '+EPT.text['FONT'], fill: '#fff', align: 'center' };
		var fontSubtitle = { font: EPT.text['STYLE']+'38px '+EPT.text['FONT'], fill: '#000', align: 'center' };
		var fontSmall = { font: EPT.text['STYLE']+'28px '+EPT.text['FONT'], fill: '#000', align: 'center' };
		var fontTiny = { font: EPT.text['STYLE']+'16px '+EPT.text['FONT'], fill: '#000', align: 'center' };

		this.titleSettings = this.add.text(EPT.world.centerX, 45, EPT.text['settings'], fontTitle);
		this.titleSettings.setOrigin(0.5, 0.5);
		
		this.containerSettingsBar = this.add.container(0, 0);
		this.containerSettingsBar.add([this.navbar,this.buttonBack,this.titleSettings]);

		this.buttonSound = new Button(EPT.world.centerX-100, 190, 'button-sound-on', this.clickSound, this).setOrigin(0.5);
		this.buttonMusic = new Button(EPT.world.centerX+100, 190, 'button-music-on', this.clickMusic, this).setOrigin(0.5);
		this.buttonLanguage = new Button(EPT.world.centerX, 320, 'button-language-'+EPT.Lang.current, this.clickLanguage, this).setOrigin(0.5);
		this.buttonCredits = new Button(EPT.world.centerX, 450, 'button-credits-'+EPT.Lang.current, this.clickCredits, this).setOrigin(0.5);
		this.buttonCopy = new Button(EPT.world.centerX, 580, 'button-copyright-'+EPT.Lang.current, this.clickCopy, this).setOrigin(0.5);
		this.buttonMonetization = new Button(EPT.world.centerX, 710, 'button-support-'+EPT.Lang.current, this.clickMonetization, this).setOrigin(0.5);
		this.buttonMore = new Button(EPT.world.centerX, 840, 'button-more-'+EPT.Lang.current, this.clickMore, this).setOrigin(0.5);

		EPT.Sfx.update('sound', this.buttonSound, this.textSound);
		EPT.Sfx.update('music', this.buttonMusic, this.textMusic);

		this.clickSettings();		

		var offsetTopCredits = 40;
		var offsetTopCrew = 540;
		this.containerCredits = this.add.container(0, EPT.world.height);
		var creditsBg = this.add.sprite(0, 0, 'background').setOrigin(0, 0);
		this.navbarCredits = this.add.sprite(0, 0, 'img-navbar').setOrigin(0);
		this.creditsBack = new Button(10, 10, 'button-back', function(){this.clickBack('credits');}, this, 'noframes').setOrigin(0, 0);
		this.titleCredits = this.add.text(EPT.world.centerX, offsetTopCredits+5, EPT.text['credits'], fontTitle).setOrigin(0.5, 0.5);	
		this.titleCreditsApp = this.add.text(EPT.world.centerX, offsetTopCredits+140, EPT.text['appname'], fontSubtitle).setOrigin(0.5,0);
		this.titleCreditsText = this.add.text(EPT.world.centerX, offsetTopCredits+200, EPT.text['madeby'], fontSmall).setOrigin(0.5,0);
		this.titleCreditsLogo = this.add.sprite(EPT.world.centerX, offsetTopCredits+270, 'logo-enclave', 1).setOrigin(0.5,0);
		this.titleCreditsLogo.setInteractive({ useHandCursor: true });
		this.titleCreditsLogo.on('pointerdown', function() { this.clickEnclave(); }, this);
		this.titleCreditsUrl = this.add.text(EPT.world.centerX, offsetTopCredits+390, 'enclavegames.com', fontSmall).setOrigin(0.5,0);
		this.titleCreditsUrl.setInteractive({ useHandCursor: true });
		this.titleCreditsUrl.on('pointerdown', function() { this.clickEnclave(); }, this);
		this.titleCrew = this.add.text(EPT.world.centerX, offsetTopCrew, EPT.text['team'], fontSubtitle).setOrigin(0.5,0);
		this.titleCrewAndrzej = this.add.text(EPT.world.centerX, offsetTopCrew+80, 'Andrzej Mazur - '+EPT.text['coding'], fontSmall).setOrigin(0.5,0);
		this.titleCrewEwa = this.add.text(EPT.world.centerX, offsetTopCrew+140, 'Ewa Mazur - '+EPT.text['design'], fontSmall).setOrigin(0.5,0);
		this.titleCrewKasia = this.add.text(EPT.world.centerX, offsetTopCrew+200, 'Kasia Mazur - '+EPT.text['testing'], fontSmall).setOrigin(0.5,0);
		this.titleCreditsMusic = this.add.text(EPT.world.centerX, offsetTopCrew+320, EPT.text['musicby']+' Bensound', fontSmall).setOrigin(0.5,0);
		this.containerCredits.add([creditsBg,this.navbarCredits,this.creditsBack,this.titleCredits,this.titleCreditsApp,this.titleCreditsText,this.titleCreditsLogo,this.titleCreditsUrl]);
		this.containerCredits.add([this.titleCrew,this.titleCrewAndrzej,this.titleCrewEwa,this.titleCrewKasia,this.titleCreditsMusic]);

		this.containerCopy = this.add.container(0, EPT.world.height);
		var copyBg = this.add.sprite(0, 0, 'background').setOrigin(0, 0);
		this.navbarCopy = this.add.sprite(0, 0, 'img-navbar').setOrigin(0);
		this.copyBack = new Button(10, 10, 'button-back', function(){this.clickBack('copyright');}, this, 'noframes').setOrigin(0, 0);
		this.titleCopy = this.add.text(EPT.world.centerX, 45, EPT.text['copy-title'], fontTitle).setOrigin(0.5, 0.5);	
		this.titleCopyText1 = this.add.text(EPT.world.centerX, 150, EPT.text['copy-description1'], fontSmall).setOrigin(0.5,0);
		this.logoPortalGames = new Button(EPT.world.centerX, 370, 'logo-portalgames', this.clickPortal, this, 'noframes').setOrigin(0.5, 0.5);
		this.titleCopyText2 = this.add.text(EPT.world.centerX, 470, EPT.text['copy-description2'], fontSmall).setOrigin(0.5,0);
		this.logoNeuroshimaHexpl = new Button(EPT.world.centerX, 630, 'logo-neuroshimahexpl', this.clickNeuroshimaHexpl, this, 'noframes').setOrigin(0.5, 0.5);
		this.titleCopyText3 = this.add.text(EPT.world.centerX, 700, EPT.text['copy-description3'], fontSmall).setOrigin(0.5,0);
		this.logoEnclaveGames = new Button(EPT.world.centerX, 850, 'logo-enclavegames', this.clickEnclave, this, 'noframes').setOrigin(0.5, 0.5);
		this.containerCopy.add([copyBg,this.navbarCopy,this.copyBack,this.titleCopy,this.titleCopyText1,this.logoPortalGames]);
		this.containerCopy.add([this.titleCopyText2,this.logoNeuroshimaHexpl,this.titleCopyText3,this.logoEnclaveGames]);

		this.containerLanguage = this.add.container(0, EPT.world.height);
		var languageBg = this.add.sprite(0, 0, 'background').setOrigin(0, 0);
		this.navbarLanguage = this.add.sprite(0, 0, 'img-navbar').setOrigin(0);
		this.languageBack = new Button(10, 10, 'button-back', function(){this.clickBack('language');}, this, 'noframes').setOrigin(0, 0);
		this.titleLanguage = this.add.text(EPT.world.centerX, 45, EPT.text['language-title'], fontTitle).setOrigin(0.5);
		this.languageEnglish = new Button(EPT.world.centerX, 270, 'button-language-english-on', function(){ EPT.Sfx.play('click'); this.clickLanguageChange('en'); }, this).setOrigin(0.5);
		this.languagePolish = new Button(EPT.world.centerX, 420, 'button-language-polish-off', function(){ EPT.Sfx.play('click'); this.clickLanguageChange('pl'); }, this).setOrigin(0.5);
		this.languageHelp = this.add.text(EPT.world.centerX, 850, EPT.text['language-help'], fontSmall).setOrigin(0.5);
		this.containerLanguage.add([languageBg,this.navbarLanguage,this.languageBack,this.titleLanguage,this.languageEnglish,this.languagePolish,this.languageHelp]);
		this.clickLanguageChange(EPT.Lang.current);
		if(!EPT.Lang.foreign) {
			this.languageHelp.setText('');
		}

		this.containerMonet = this.add.container(0, EPT.world.height);
		var monetBg = this.add.sprite(0, 0, 'background').setOrigin(0, 0);
		this.navbarMonet = this.add.sprite(0, 0, 'img-navbar').setOrigin(0);
		this.monetBack = new Button(10, 10, 'button-back', function(){this.clickBack('monetization');}, this, 'noframes').setOrigin(0, 0);
		this.monetTitle = this.add.text(EPT.world.centerX, 45, EPT.text['monetization-title'], fontTitle).setOrigin(0.5, 0.5);
		if(document.monetization && document.monetization.state === 'started') {
			this.monetText1 = this.add.text(EPT.world.centerX, 170, EPT.text['monetization-thanks1'], fontSmall).setOrigin(0.5,0);
			this.logoCoil = new Button(EPT.world.centerX, 390, 'logo-coil', this.clickCoil, this, 'noframes').setOrigin(0.5, 0.5);
			this.monetText2 = this.add.text(EPT.world.centerX, 500, EPT.text['monetization-thanks2'], fontSmall).setOrigin(0.5,0);
			this.containerMonet.add([monetBg,this.navbarMonet,this.monetBack,this.monetTitle,this.monetText1]);
			this.containerMonet.add([this.logoCoil,this.monetText2]);
		}
		else {
			this.monetText1 = this.add.text(EPT.world.centerX, 170, EPT.text['monetization-description1'], fontSmall).setOrigin(0.5,0);
			this.logoCoil = new Button(EPT.world.centerX, 390, 'logo-coil', this.clickCoil, this, 'noframes').setOrigin(0.5, 0.5);
			this.monetText2 = this.add.text(EPT.world.centerX, 490, EPT.text['monetization-description2'], fontSmall).setOrigin(0.5,0);
			this.bannerBeer = new Button(EPT.world.centerX, 660, 'button-beer', this.clickBeer, this, 'noframes').setOrigin(0.5, 0.5).setScale(1.25);
			this.monetText3 = this.add.text(EPT.world.centerX, 760, EPT.text['monetization-description3'], fontSmall).setOrigin(0.5,0);
			this.containerMonet.add([monetBg,this.navbarMonet,this.monetBack,this.monetTitle,this.monetText1]);
			this.containerMonet.add([this.logoCoil,this.monetText2,this.bannerBeer,this.monetText3]);
		}

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
		this.buttonSound.setScale(0.5);
		this.tweens.add({targets: this.buttonSound, scaleX: 1, scaleY: 1, duration: 500, delay: 0, ease: 'Cubic.easeOut' });
		this.buttonMusic.setScale(0.5);
		this.tweens.add({targets: this.buttonMusic, scaleX: 1, scaleY: 1, duration: 500, delay: 62, ease: 'Cubic.easeOut' }); // 125
		this.buttonLanguage.setScale(0.5);
		this.tweens.add({targets: this.buttonLanguage, scaleX: 1, scaleY: 1, duration: 500, delay: 125, ease: 'Cubic.easeOut' }); // 250
		this.buttonCredits.setScale(0.5);
		this.tweens.add({targets: this.buttonCredits, scaleX: 1, scaleY: 1, duration: 500, delay: 187, ease: 'Cubic.easeOut' }); // 375
		this.buttonCopy.setScale(0.5);
		this.tweens.add({targets: this.buttonCopy, scaleX: 1, scaleY: 1, duration: 500, delay: 250, ease: 'Cubic.easeOut' }); // 500
		this.buttonMonetization.setScale(0.5);
		this.tweens.add({targets: this.buttonMonetization, scaleX: 1, scaleY: 1, duration: 500, delay: 312, ease: 'Cubic.easeOut' }); // 625
		this.buttonMore.setScale(0.5);
		this.tweens.add({targets: this.buttonMore, scaleX: 1, scaleY: 1, duration: 500, delay: 375, ease: 'Cubic.easeOut' });
	}
	clickCredits() {
		EPT.Sfx.play('click');

		var that = this;
		EPT.fadeOutIn(function(){
			that.containerCredits.y = 0;

			that.titleCreditsApp.setScale(0.5, 0.5);
			that.tweens.add({targets: that.titleCreditsApp, scaleX: 1, scaleY: 1, duration: 500, delay: 0, ease: 'Cubic.easeOut' });
			that.titleCreditsText.setScale(0.5, 0.5);
			that.tweens.add({targets: that.titleCreditsText, scaleX: 1, scaleY: 1, duration: 500, delay: 62, ease: 'Cubic.easeOut' });
			that.titleCreditsLogo.setScale(0.5, 0.5);
			that.tweens.add({targets: that.titleCreditsLogo, scaleX: 1, scaleY: 1, duration: 500, delay: 125, ease: 'Cubic.easeOut' });
			that.titleCreditsUrl.setScale(0.5, 0.5);
			that.tweens.add({targets: that.titleCreditsUrl, scaleX: 1, scaleY: 1, duration: 500, delay: 187, ease: 'Cubic.easeOut' });

			that.titleCrew.setScale(0.5, 0.5);
			that.tweens.add({targets: that.titleCrew, scaleX: 1, scaleY: 1, duration: 500, delay: 250, ease: 'Cubic.easeOut' });
			that.titleCrewAndrzej.setScale(0.5, 0.5);
			that.tweens.add({targets: that.titleCrewAndrzej, scaleX: 1, scaleY: 1, duration: 500, delay: 312, ease: 'Cubic.easeOut' });
			that.titleCrewEwa.setScale(0.5, 0.5);
			that.tweens.add({targets: that.titleCrewEwa, scaleX: 1, scaleY: 1, duration: 500, delay: 375, ease: 'Cubic.easeOut' });
			that.titleCrewKasia.setScale(0.5, 0.5);
			that.tweens.add({targets: that.titleCrewKasia, scaleX: 1, scaleY: 1, duration: 500, delay: 437, ease: 'Cubic.easeOut' });
			that.titleCreditsMusic.setScale(0.5, 0.5);
			that.tweens.add({targets: that.titleCreditsMusic, scaleX: 1, scaleY: 1, duration: 500, delay: 500, ease: 'Cubic.easeOut' });
		}, this);

		this.toggleInput('disable');
		this.screenName = 'credits';
	}
	clickCopy() {
		EPT.Sfx.play('click');
		var that = this;
		EPT.fadeOutIn(function(){
			that.containerCopy.y = 0;

			that.titleCopyText1.setScale(0.5, 0.5);
			that.tweens.add({targets: that.titleCopyText1, scaleX: 1, scaleY: 1, duration: 500, delay: 0, ease: 'Cubic.easeOut' });
			that.logoPortalGames.setScale(0.5, 0.5);
			that.tweens.add({targets: that.logoPortalGames, scaleX: 1, scaleY: 1, duration: 500, delay: 62, ease: 'Cubic.easeOut' });
			that.titleCopyText2.setScale(0.5, 0.5);
			that.tweens.add({targets: that.titleCopyText2, scaleX: 1, scaleY: 1, duration: 500, delay: 125, ease: 'Cubic.easeOut' });
			that.logoNeuroshimaHexpl.setScale(0.5, 0.5);
			that.tweens.add({targets: that.logoNeuroshimaHexpl, scaleX: 1, scaleY: 1, duration: 500, delay: 187, ease: 'Cubic.easeOut' });
			that.titleCopyText3.setScale(0.5, 0.5);
			that.tweens.add({targets: that.titleCopyText3, scaleX: 1, scaleY: 1, duration: 500, delay: 250, ease: 'Cubic.easeOut' });
			that.logoEnclaveGames.setScale(0.5, 0.5);
			that.tweens.add({targets: that.logoEnclaveGames, scaleX: 1, scaleY: 1, duration: 500, delay: 312, ease: 'Cubic.easeOut' });
		}, this);
		this.toggleInput('disable');
		this.screenName = 'copyright';
	}
	clickMonetization() {
		EPT.Sfx.play('click');
		var that = this;
		EPT.fadeOutIn(function(){
			that.containerMonet.y = 0;

			that.monetText1.setScale(0.5, 0.5);
			that.tweens.add({targets: that.monetText1, scaleX: 1, scaleY: 1, duration: 500, delay: 0, ease: 'Cubic.easeOut' });
			that.logoCoil.setScale(0.5, 0.5);
			that.tweens.add({targets: that.logoCoil, scaleX: 1, scaleY: 1, duration: 500, delay: 62, ease: 'Cubic.easeOut' });
			that.monetText2.setScale(0.5, 0.5);
			that.tweens.add({targets: that.monetText2, scaleX: 1, scaleY: 1, duration: 500, delay: 125, ease: 'Cubic.easeOut' });
			if(that.bannerBeer && that.monetText3) {
				that.bannerBeer.setScale(0.5, 0.5);
				that.tweens.add({targets: that.bannerBeer, scaleX: 1, scaleY: 1, duration: 500, delay: 187, ease: 'Cubic.easeOut' });
				that.monetText3.setScale(0.5, 0.5);
				that.tweens.add({targets: that.monetText3, scaleX: 1, scaleY: 1, duration: 500, delay: 250, ease: 'Cubic.easeOut' });
			}
		}, this);
		this.toggleInput('disable');
		this.screenName = 'monetization';
	}
	clickLanguage() {
		EPT.Sfx.play('click');
		var that = this;
		EPT.fadeOutIn(function(){
			that.containerLanguage.y = 0;

			that.languageEnglish.setScale(0.5);
			that.tweens.add({targets: that.languageEnglish, scaleX: 1, scaleY: 1, duration: 500, delay: 0, ease: 'Cubic.easeOut' });
			that.languagePolish.setScale(0.5);
			that.tweens.add({targets: that.languagePolish, scaleX: 1, scaleY: 1, duration: 500, delay: 125, ease: 'Cubic.easeOut' });
			that.languageHelp.setScale(0.5);
			that.tweens.add({targets: that.languageHelp, scaleX: 1, scaleY: 1, duration: 500, delay: 250, ease: 'Cubic.easeOut' });
		}, this);
		this.toggleInput('disable');
		this.screenName = 'language';
	}
	clickLanguageChange(lang) {
		EPT.Lang.current = lang;
		EPT.text = EPT.Lang.text[lang];
		if(lang == 'en') {
			this.languageEnglish.setTexture('button-language-english-on');
			this.languagePolish.setTexture('button-language-polish-off');
		}
		else { // pl
			this.languageEnglish.setTexture('button-language-english-off');
			this.languagePolish.setTexture('button-language-polish-on');
		}
		this.titleLanguage.setFont(EPT.text['STYLE']+'40px '+EPT.text['FONT']);
		this.titleLanguage.setText(EPT.text['language-title']);
		EPT.Storage.set('EPT-language', lang);
	}
    clickBeer() {
        EPT.Sfx.play('click');
        window.top.location.href = 'https://www.paypal.me/end3r';
    }
	clickBack(name) {
		EPT.Sfx.play('click');
		if(name) {
			if(name == 'language') {
				EPT.fadeOutScene('Settings', this);
			}
			else {
				this.buttonBack.alpha = 1;
				this.toggleInput('enable');
				var that = this;
				EPT.fadeOutIn(function(){
					switch(name) {
						case 'credits': {
							that.containerCredits.y = EPT.world.height;
							break;
						}
						case 'copyright': {
							that.containerCopy.y = EPT.world.height;
							break;
						}
						case 'monetization': {
							that.containerMonet.y = EPT.world.height;
							break;
						}
						default: {}
					}	
					that.clickSettings();
				}, this);
				this.screenName = 'settings';
			}
		}
		else {
			EPT.fadeOutScene('MainMenu', this);
		}
	}
	toggleInput(toggle) {
		if(toggle == 'disable') {
			this.buttonBack.input.enabled = false;
			this.buttonSound.input.enabled = false;
			this.buttonMusic.input.enabled = false;
			this.buttonLanguage.input.enabled = false;
			this.buttonCredits.input.enabled = false;
			this.buttonCopy.input.enabled = false;
			this.buttonMonetization.input.enabled = false;
			this.buttonMore.input.enabled = false;
		}
		else { // enable
			this.buttonBack.input.enabled = true;
			this.buttonSound.input.enabled = true;
			this.buttonMusic.input.enabled = true;
			this.buttonLanguage.input.enabled = true;
			this.buttonCredits.input.enabled = true;
			this.buttonCopy.input.enabled = true;
			this.buttonMonetization.input.enabled = true;
			this.buttonMore.input.enabled = true;
		}
	}
	clickEnclave() {
		EPT.Sfx.play('click');
		window.top.location.href = 'https://enclavegames.com/';
	}
	clickMore() {
		EPT.Sfx.play('click');
		window.top.location.href = 'https://nshex.enclavegames.com/';
	}
	clickPortal() {
		EPT.Sfx.play('click');
		window.top.location.href = 'https://portalgames.pl/';
	}
	clickNeuroshimaHexpl() {
		EPT.Sfx.play('click');
		window.top.location.href = 'https://neuroshimahex.pl/';
	}
	clickCoil() {
		EPT.Sfx.play('click');
		window.top.location.href = 'https://coil.com/';
	}
};