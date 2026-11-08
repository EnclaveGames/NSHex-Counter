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
// landscape screens that are big enough (tablets, laptops, desktops) get both armies on one screen
EPT.isWide = function() {
  return window.innerHeight >= 500 && window.innerWidth/window.innerHeight >= 1.25;
};

EPT.setWorldSize = function(scene, wide) {
  var width = wide ? 1280 : 640, height = wide ? 720 : 960;
  if(scene.scale.width !== width || scene.scale.height !== height) {
    scene.scale.setGameSize(width, height);
  }
  EPT.world = { width: width, height: height, centerX: width/2, centerY: height/2 };
};

// the running game survives reloads: armies, remaining tiles and the tap history
EPT.SaveGame = {
  key: 'EPT-game',
  save: function(scene) {
    try {
      EPT.Storage.set(EPT.SaveGame.key, {
        v: 1,
        player: [0, EPT._player[1], EPT._player[2]],
        counts: [0, EPT._currentTileCounts[1], EPT._currentTileCounts[2]],
        total: [0, scene.playerTileCount[1], scene.playerTileCount[2]],
        history: scene.history
      });
    } catch(e) {}
  },
  clear: function() {
    try { EPT.Storage.remove(EPT.SaveGame.key); } catch(e) {}
  },
  load: function() {
    try {
      var d = EPT.Storage.get(EPT.SaveGame.key);
      if(!d || d.v !== 1) { return null; }
      for(var n = 1; n <= 2; n++) {
        var army = d.player[n], max = EPT._tileCounts[army], counts = d.counts[n];
        if(!(army >= 0 && army < EPT._armies.length) || !Array.isArray(counts) || counts.length !== max.length) { return null; }
        for(var i = 0; i < max.length; i++) {
          if(!(counts[i] >= 0 && counts[i] <= max[i])) { return null; }
        }
        if(!(d.total[n] >= 0 && d.total[n] <= 34)) { return null; }
      }
      d.history = Array.isArray(d.history) ? d.history.filter(function(h) {
        return h && (h.n === 1 || h.n === 2) && h.i >= 1 && h.i <= EPT._armyCounts[d.player[h.n]];
      }) : [];
      return d;
    } catch(e) { return null; }
  }
};

// keeps the screen on while counting; browsers release the lock when the tab is hidden, so ask again on return
EPT.WakeLock = {
  lock: null,
  active: false,
  request: function() {
    if(!EPT.WakeLock.active || !navigator.wakeLock || document.visibilityState !== 'visible') { return; }
    navigator.wakeLock.request('screen').then(function(lock) {
      EPT.WakeLock.lock = lock;
      lock.addEventListener('release', function() {
        if(EPT.WakeLock.lock === lock) { EPT.WakeLock.lock = null; }
      });
    }).catch(function() {});
  },
  start: function() {
    if(EPT.WakeLock.active) { return; }
    EPT.WakeLock.active = true;
    document.addEventListener('visibilitychange', EPT.WakeLock.request);
    EPT.WakeLock.request();
  },
  stop: function() {
    EPT.WakeLock.active = false;
    document.removeEventListener('visibilitychange', EPT.WakeLock.request);
    if(EPT.WakeLock.lock) {
      EPT.WakeLock.lock.release().catch(function() {});
      EPT.WakeLock.lock = null;
    }
  }
};

// repeats a 640px wide image across the whole canvas, mirroring every other copy so the seams are not visible
EPT.strip = function(scene, key, y, mirror) {
  var list = [];
  for(var x = 0; x < EPT.world.width; x += 640) {
    var sprite = scene.add.sprite(x, y, key).setOrigin(0, 0);
    if(mirror && (x/640)%2 == 1) { sprite.setFlipX(true); }
    list.push(sprite);
  }
  return list;
};

// scenes built for one layout restart when the window changes to the other one
EPT.watchLayout = function(scene) {
  var wide = EPT.world.width > 640;
  var timer = null;
  var onResize = function() {
    clearTimeout(timer);
    timer = setTimeout(function() {
      if(scene.sys && scene.sys.isActive() && EPT.isWide() !== wide) {
        scene.scene.restart();
      }
    }, 200);
  };
  window.addEventListener('resize', onResize);
  window.addEventListener('orientationchange', onResize);
  scene.events.once('shutdown', function() {
    clearTimeout(timer);
    window.removeEventListener('resize', onResize);
    window.removeEventListener('orientationchange', onResize);
  });
};

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
      'menu-resume': 'Resume game',
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
      'menu-resume': 'Wznów grę',
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