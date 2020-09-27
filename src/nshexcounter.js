var EPT = {};

EPT.Sfx = {
  manage: function(type, mode, game, button, label) {
    switch(mode) {
      case 'init': {
        // EPT.Storage.initUnset('EPT-'+type, true);
        EPT.Storage.initUnset('EPT-sound', true);
        EPT.Storage.initUnset('EPT-music', false);
        EPT.Sfx.status = EPT.Sfx.status || [];
        EPT.Sfx.status[type] = EPT.Storage.get('EPT-'+type);
        if(type == 'sound') {
          EPT.Sfx.sounds = [];
          EPT.Sfx.sounds['click'] = game.sound.add('sound-click');
          EPT.Sfx.sounds['kill'] = game.sound.add('sound-kill');
          EPT.Sfx.sounds['heal'] = game.sound.add('sound-heal');
          EPT.Sfx.sounds['change'] = game.sound.add('sound-change');
        }
        else { // music
          if(!EPT.Sfx.music || !EPT.Sfx.music.isPlaying) {
            EPT.Sfx.music = game.sound.add('music-theme');
            EPT.Sfx.music.volume = 0.5;
          }
        }
        break;
      }
      case 'on': {
        EPT.Sfx.status[type] = true;
        break;
      }
      case 'off': {
        EPT.Sfx.status[type] = false;
        break;
      }
      case 'switch': {
        EPT.Sfx.status[type] =! EPT.Sfx.status[type];
        break;
      }
      default: {}
    }
    EPT.Sfx.update(type, button, label);

    if(type == 'music' && EPT.Sfx.music) {
      if(EPT.Sfx.status['music']) {
        if(!EPT.Sfx.music.isPlaying) {
          EPT.Sfx.music.play({loop:true});
        }
      }
      else {
        EPT.Sfx.music.stop();
      }
    }

    EPT.Storage.set('EPT-'+type, EPT.Sfx.status[type]);
  },
  play: function(audio) {
    if(audio == 'music') {
      if(EPT.Sfx.status['music'] && EPT.Sfx.music && !EPT.Sfx.music.isPlaying) {
        EPT.Sfx.music.play({loop:true});
      }
    }
    else { // sound
      if(EPT.Sfx.status['sound'] && EPT.Sfx.sounds && EPT.Sfx.sounds[audio]) {
        EPT.Sfx.sounds[audio].play();
      }
    }
  },
  update: function(type, button, label) {
    if(button) {
      if(EPT.Sfx.status[type]) {
        button.setTexture('button-'+type+'-on');
      }
      else {
        button.setTexture('button-'+type+'-off');
      }
    }
    if(label) {
      if(EPT.Sfx.status[type]) {
        label.setText(EPT.Lang.text[EPT.Lang.current][type+'-on']);
      }
      else {
        label.setText(EPT.Lang.text[EPT.Lang.current][type+'-off']);
      }
    }
  }
};
EPT.fadeOutIn = function(passedCallback, context) {
  context.cameras.main.fadeOut(250);
  context.time.addEvent({
    delay: 250,
    callback: function() {
      context.cameras.main.fadeIn(250);
      passedCallback(context);
    },
    callbackScope: context
  });  
}
EPT.fadeOutScene = function(sceneName, context) {
  context.cameras.main.fadeOut(250);
  context.time.addEvent({
      delay: 250,
      callback: function() {
        context.scene.start(sceneName);
      },
      callbackScope: context
  });
};

class Button extends Phaser.GameObjects.Image {
  constructor(x, y, texture, callback, scene, noframes) { // noframes => frame
    super(scene, x, y, texture, 0);
    this.setInteractive({ useHandCursor: true });
    
    this.on('pointerup', function() {
      if(!noframes) {
        this.setFrame(1);
      }
    }, this);

    this.on('pointerdown', function() {
      if(!noframes) {
        this.setFrame(2);
      }
      callback.call(scene);
    }, this);

    this.on('pointerover', function() {
      if(!noframes) {
        this.setFrame(1);
      }
    }, this);

    this.on('pointerout', function() {
      if(!noframes) {
        this.setFrame(0);
      }
    }, this);

    scene.add.existing(this);
  }
};

EPT.Storage = {
  availability: function() {
    if(!(!(typeof(window.localStorage) === 'undefined'))) {
      console.log('localStorage not available');
      return null;
    }
  },
  get: function(key) {
    this.availability();
    try {
      return JSON.parse(localStorage.getItem(key));
    }
    catch(e) {
      return window.localStorage.getItem(key);
    }
  },
  set: function(key, value) {
    this.availability();
    try {
      window.localStorage.setItem(key, JSON.stringify(value));
    }
    catch(e) {
      if(e == QUOTA_EXCEEDED_ERR) {
        console.log('localStorage quota exceeded');
      }
    }
  },
  initUnset: function(key, value) {
    if(this.get(key) === null) {
      this.set(key, value);
    }
  },
  getFloat: function(key) {
    return parseFloat(this.get(key));
  },
  setHighscore: function(key, value) {
    if(value > this.getFloat(key)) {
      this.set(key, value);
    }
  },
  remove: function(key) {
    this.availability();
    window.localStorage.removeItem(key);
  },
  clear: function() {
    this.availability();
    window.localStorage.clear();
  }
};

EPT.Lang = {
  current: 'en',
  options: ['en', 'pl'],
  parseQueryString: function(query) {
    var vars = query.split('&');
    var query_string = {};
    for (var i = 0; i < vars.length; i++) {
      var pair = vars[i].split('=');
      if (typeof query_string[pair[0]] === 'undefined') {
        query_string[pair[0]] = decodeURIComponent(pair[1]);
      } else if (typeof query_string[pair[0]] === 'string') {
        var arr = [query_string[pair[0]], decodeURIComponent(pair[1])];
        query_string[pair[0]] = arr;
      } else {
        query_string[pair[0]].push(decodeURIComponent(pair[1]));
      }
    }
    return query_string;
  },
  updateLanguage: function(lang) {
    // the importance of language setting: parameter, url, cache, navigator
    var savedLang = EPT.Storage.get('EPT-language');
    var query = window.location.search.substring(1);
    var qs = EPT.Lang.parseQueryString(query);
    EPT.Lang.foreign = false;

    if(lang) {
      EPT.Lang.current = lang;
    }
    else if(qs && qs['lang']) {
      EPT.Lang.current = qs['lang'];
    }
    else if(savedLang) {
      EPT.Lang.current = savedLang;
    }
    else {
      EPT.Lang.current = navigator.language;
    }

    if(EPT.Lang.options.indexOf(EPT.Lang.current) == -1) {
      EPT.Lang.current = 'en';
    }

    if(navigator.language != 'en' && navigator.language != 'pl') {
      EPT.Lang.foreign = true;
    }
  },
  text: {
    'en': {
      'FONT': 'montserratbold',
      'STYLE': '',
      'menu-intro': 'Choose both armies\nand start the game',
      'settings': 'Settings',
      'language-title': 'Language',
      'language-help': '\
Would you like to help translate\n\
this app to your language?\n\
Let us know at\n\
nshex@enclavegames.com!',
      'monetization-title': 'Support us',
      'monetization-description1': '\
The NSHex Counter app is free,\n\
but you can appreciate that fact\n\
either by becoming a Web Monetized\n\
power user - a Coil subscriber:',
      'monetization-description2': '\
or sending us a few bucks for\n\
a beer (or coffee!) directly:',
      'monetization-description3': '\
Coil subscribers will see here\n\
statistics of their gameplays.',
      'monetization-thanks1': '\
Thank you for being Coil\'s\n\
Web Monetized power user\n\
and supporting Enclave Games!',
      'monetization-thanks2': '\
We\'re working on delivering\n\
the ability to track statistics\n\
of your gameplays - coming soon!',
      'copy-title': 'Copyright',
      'copy-description1': '\
All rights to the images of the\n\
tiles from the Neuroshima Hex\n\
board game belongs to its creator\n\
and publisher: Portal Games.',
      'copy-description2': '\
This app is free and created\n\
by the community\n\
for the community.',
      'copy-description3': '\
It was developed by the\n\
Enclave Games team.',
      'credits': 'Credits',
      'appname': 'NSHex Counter',
      'madeby': 'made by',
      'team': 'The Team',
      'coding': 'coding',
      'design': 'design',
      'testing': 'testing',
      'musicby': 'Music by',
      'selection1': 'Choose 1st army',
      'selection2': 'Choose 2nd army',
      'popup-lostprogress': 'All progress will be lost.'
    },
    'pl': {
      'FONT': 'Arial',
      'STYLE': 'bold ',
      'menu-intro': 'Wybierz obie armie\ni zacznij grę',
      'settings': 'Ustawienia',
      'language-title': 'Język',
      'language-help': '',
      'monetization-title': 'Wesprzyj nas',
      'monetization-description1': '\
Aplikacja NSHex Counter jest\n\
darmowa, ale mimo wszystko nadal\n\
możesz nas wesprzeć  - albo\n\
zakładając konto w serwisie Coil:',
      'monetization-description2': '\
albo wysyłając kilka złotych\n\
na piwo (lub kawę!) bezpośrednio:',
      'monetization-description3': '\
Subskrybenci Coil będą mogli\n\
zobaczyć tu statystyki swoich gier.',
      'monetization-thanks1': '\
Dzięki za bycie aktywnym\n\
subskrybentem serwisu Coil\n\
i wspieranie Enclave Games!',
      'monetization-thanks2': '\
Pracujemy nad możliwością\n\
zapisu statystyk Twoich gier - \n\
taka opcja pojawi się wkrótce!',
      'copy-title': 'Prawa autorskie',
      'copy-description1': '\
Wszelkie prawa do grafik żetonów\n\
armii gry Neuroshima Hex\n\
należą do jej twórcy i wydawcy:\n\
wydawnictwa Portal Games.',
      'copy-description2': '\
Ta aplikacja jest darmowa\n\
i została zrobiona przez\n\
społeczność, dla społeczności.',
      'copy-description3': '\
Stworzeniem aplikacji zajęło się\n\
studio Enclave Games.',
      'thanks': 'Dzięki za bycie\npłacącym subskrybentem\ni wspieranie EPT!',
      'credits': 'Autorzy',
      'appname': 'NSHex Counter',
      'madeby': 'stworzony przez',
      'team': 'Zespół',
      'coding': 'programowanie',
      'design': 'projektowanie',
      'testing': 'testowanie',
      'musicby': 'Muzyka autorstwa',
      'selection1': 'Wybierz 1szą armię',
      'selection2': 'Wybierz 2gą armię',
      'popup-lostprogress': 'Cały postęp zostanie utracony.'
    }
  }
};
class Boot extends Phaser.Scene {
    constructor() {
        super('Boot');
    }
    preload() {
        this.load.image('loading-background', 'img/loading-background.png');
        this.load.image('background-black', 'img/background-black.png');
        this.load.spritesheet('logo-counter', 'img/logo-counter.png', {frameWidth:446,frameHeight:123});
        this.load.spritesheet('logo-enclave', 'img/logo-enclave.png', {frameWidth:253,frameHeight:89});

        WebFont.load({ custom: { families: ['montserratbold'], urls: ['fonts/montserrat-bold.css'] } });
    }
    create() {
        EPT.world = {
            width: this.cameras.main.width,
            height: this.cameras.main.height,
            centerX: this.cameras.main.centerX,
            centerY: this.cameras.main.centerY
        };
        EPT.Lang.updateLanguage();
        EPT.text = EPT.Lang.text[EPT.Lang.current];
        EPT._player = [];
        EPT._armies = [
            'moloch','borgo','outpost','hegemony','newyork','neojungle',
            'smart','vegas','steelpolice','dancer','sharrash','mephisto',
            'doomsday','mississippi','uranopolis','deathbreath','irongang','sandrunners',
            'troglodytes'
        ];
        EPT._armyCounts = [22, 13, 15, 18, 20, 17, 16, 15, 18, 4, 17, 17, 16, 17, 20, 15, 9, 16, 12];
        EPT._tileCounts = [
            [4, 1, 5, 1, 2, 2, 1, 1, 1, 2, 1, 2, 1, 1, 1, 1, 1, 1, 1, 1, 2, 1], // moloch
            [6, 4, 1, 6, 4, 2, 1, 2, 2, 1, 2, 1, 2], // borgo
            [6, 7, 1, 2, 1, 5, 2, 1, 1, 1, 1, 2, 1, 1, 2], // outpost
            [5, 3, 2, 1, 3, 1, 4, 1, 2, 1, 1, 3, 1, 1, 2, 1, 1, 1], // hegemony
            [5, 2, 1, 1, 1, 2, 1, 2, 1, 2, 2, 2, 1, 1, 1, 1, 2, 2, 2, 2], // newyork
            [4, 2, 1, 1, 1, 4, 2, 3, 1, 3, 2, 1, 3, 1, 1, 2, 2], // neojungle
            [4, 3, 1, 1, 2, 1, 1, 2, 3, 2, 2, 3, 1, 4, 2, 2], // smart
            [5, 3, 3, 2, 3, 1, 2, 2, 2, 2, 3, 1, 1, 2, 2], // vegas
            [5, 1, 1, 1, 1, 2, 1, 1, 2, 3, 2, 1, 3, 3, 2, 2, 2, 1], // steelpolice
            [7, 8, 7, 10], // dancer
            [5, 2, 1, 2, 1, 3, 3, 3, 4, 1, 1, 1, 2, 1, 2, 1, 1], // sharrash
            [2, 3, 2, 3, 1, 2, 2, 1, 1, 2, 2, 1, 2, 2, 1, 4, 3], // mephisto
            [4, 1, 1, 2, 2, 1, 2, 1, 4, 2, 2, 1, 5, 2, 2, 2], // doomsday
            [4, 1, 1, 1, 3, 2, 3, 2, 4, 1, 1, 2, 2, 2, 1, 3, 1], // mississippi
            [1, 4, 3, 1, 2, 3, 4, 1, 2, 1, 1, 1, 1, 1, 2, 1, 1, 1, 2, 1], // uranopolis
            [1, 2, 3, 8, 3, 3, 1, 2, 1, 1, 1, 1, 2, 2, 3], // deathbreath
            [2, 9, 3, 3, 5, 3, 4, 4, 1], // irongang
            [3, 5, 2, 1, 3, 2, 3, 1, 1, 2, 2, 2, 2, 1, 2, 2], // sandrunners
            [7, 3, 1, 1, 2, 2, 4, 5, 3, 2, 2, 2] // troglodytes
        ];
        this.scene.start('Preloader');
    }
}
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
    this.titleCreditsMusic = this.add.text(EPT.world.centerX, offsetTopCrew+320, EPT.text['musicby']+' Alexandr Zhelanov', fontSmall).setOrigin(0.5,0);
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