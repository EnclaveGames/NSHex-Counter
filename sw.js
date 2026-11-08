// generated into sw.js by build.js - do not edit sw.js directly
var VERSION = 'cbb72d0c15';
var CACHE = 'nshex-counter-' + VERSION;
var FILES = [
  "ept.webmanifest",
  "favicon.png",
  "fonts/BRLNSDB.css",
  "fonts/BRLNSDB.eot",
  "fonts/BRLNSDB.otf",
  "fonts/BRLNSDB.svg",
  "fonts/BRLNSDB.ttf",
  "fonts/BRLNSDB.woff",
  "fonts/montserrat-bold.css",
  "fonts/montserrat-bold.eot",
  "fonts/montserrat-bold.svg",
  "fonts/montserrat-bold.ttf",
  "fonts/montserrat-bold.woff",
  "icons/icon-192.png",
  "icons/icon-512.png",
  "img/army-beasts-grey.png",
  "img/army-beasts.png",
  "img/army-borgo-grey.png",
  "img/army-borgo.png",
  "img/army-dancer-grey.png",
  "img/army-dancer.png",
  "img/army-deathbreath-grey.png",
  "img/army-deathbreath.png",
  "img/army-deserttribes-grey.png",
  "img/army-deserttribes.png",
  "img/army-doomsday-grey.png",
  "img/army-doomsday.png",
  "img/army-hegemony-grey.png",
  "img/army-hegemony.png",
  "img/army-irongang-grey.png",
  "img/army-irongang.png",
  "img/army-mephisto-grey.png",
  "img/army-mephisto.png",
  "img/army-merchantsguild-grey.png",
  "img/army-merchantsguild.png",
  "img/army-mississippi-grey.png",
  "img/army-mississippi.png",
  "img/army-moloch-grey.png",
  "img/army-moloch.png",
  "img/army-neojungle-grey.png",
  "img/army-neojungle.png",
  "img/army-newyork-grey.png",
  "img/army-newyork.png",
  "img/army-outpost-grey.png",
  "img/army-outpost.png",
  "img/army-partisans-grey.png",
  "img/army-partisans.png",
  "img/army-pirates-grey.png",
  "img/army-pirates.png",
  "img/army-sandrunners-grey.png",
  "img/army-sandrunners.png",
  "img/army-sharrash-grey.png",
  "img/army-sharrash.png",
  "img/army-smart-grey.png",
  "img/army-smart.png",
  "img/army-steelpolice-grey.png",
  "img/army-steelpolice.png",
  "img/army-troglodytes-grey.png",
  "img/army-troglodytes.png",
  "img/army-uranopolis-grey.png",
  "img/army-uranopolis.png",
  "img/army-vegas-grey.png",
  "img/army-vegas.png",
  "img/background-black.png",
  "img/background.png",
  "img/banner-beer.png",
  "img/button-back.png",
  "img/button-beer.png",
  "img/button-down.png",
  "img/button-home.png",
  "img/button-language-english-off.png",
  "img/button-language-english-on.png",
  "img/button-language-polish-off.png",
  "img/button-language-polish-on.png",
  "img/button-music-off.png",
  "img/button-music-on.png",
  "img/button-settings.png",
  "img/button-small.png",
  "img/button-small2.png",
  "img/button-sound-off.png",
  "img/button-sound-on.png",
  "img/button-undo.png",
  "img/button-up.png",
  "img/hex-border-color.png",
  "img/hex-border-pattern.png",
  "img/hex-shadow.png",
  "img/img-navbar.png",
  "img/img-seethru.png",
  "img/img-tabbar.png",
  "img/img-tiles.png",
  "img/img-topbar.png",
  "img/lang/en/button-change.png",
  "img/lang/en/button-copyright.png",
  "img/lang/en/button-credits.png",
  "img/lang/en/button-language.png",
  "img/lang/en/button-more-games.png",
  "img/lang/en/button-more.png",
  "img/lang/en/button-no.png",
  "img/lang/en/button-player1.png",
  "img/lang/en/button-player2.png",
  "img/lang/en/button-start.png",
  "img/lang/en/button-support.png",
  "img/lang/en/button-yes.png",
  "img/lang/en/hex-labels.png",
  "img/lang/en/text-areyousure.png",
  "img/lang/pl/button-change.png",
  "img/lang/pl/button-copyright.png",
  "img/lang/pl/button-credits.png",
  "img/lang/pl/button-language.png",
  "img/lang/pl/button-more-games.png",
  "img/lang/pl/button-more.png",
  "img/lang/pl/button-no.png",
  "img/lang/pl/button-player1.png",
  "img/lang/pl/button-player2.png",
  "img/lang/pl/button-start.png",
  "img/lang/pl/button-support.png",
  "img/lang/pl/button-yes.png",
  "img/lang/pl/hex-labels.png",
  "img/lang/pl/text-areyousure.png",
  "img/loader.png",
  "img/loading-background.png",
  "img/logo-counter.png",
  "img/logo-enclave-black.png",
  "img/logo-enclave.png",
  "img/logo-neuroshimahexpl.png",
  "img/logo-portalgames.png",
  "img/overlay.png",
  "img/particle.png",
  "img/pattern.png",
  "img/pattern0.png",
  "img/popup-bg.png",
  "img/tiles-hqs-grey.png",
  "img/tiles-hqs.png",
  "index.html",
  "sfx/audio-button.m4a",
  "sfx/audio-button.mp3",
  "sfx/audio-button.ogg",
  "sfx/audio-change.m4a",
  "sfx/audio-change.mp3",
  "sfx/audio-change.ogg",
  "sfx/audio-click.m4a",
  "sfx/audio-click.mp3",
  "sfx/audio-click.ogg",
  "sfx/audio-heal.m4a",
  "sfx/audio-heal.mp3",
  "sfx/audio-heal.ogg",
  "sfx/audio-kill.m4a",
  "sfx/audio-kill.mp3",
  "sfx/audio-kill.ogg",
  "sfx/music-battle.m4a",
  "sfx/music-battle.mp3",
  "sfx/music-battle.ogg",
  "src/nshexcounter.min.js",
  "src/phaser.4.2.1.min.js",
  "src/plugins/webfont.js",
  "src/start.js"
];

self.addEventListener('install', function(event) {
  event.waitUntil(
    caches.open(CACHE).then(function(cache) {
      return Promise.all(FILES.concat(['./']).map(function(file) {
        // 'reload' skips the HTTP cache so the new version never mixes with old files
        return cache.add(new Request(file, { cache: 'reload' })).catch(function() {});
      }));
    }).then(function() { return self.skipWaiting(); })
  );
});

self.addEventListener('activate', function(event) {
  event.waitUntil(
    caches.keys().then(function(keys) {
      return Promise.all(keys.filter(function(key) {
        return key.indexOf('nshex-counter-') === 0 && key !== CACHE;
      }).map(function(key) { return caches.delete(key); }));
    }).then(function() { return self.clients.claim(); })
  );
});

function networkFirst(request) {
  return new Promise(function(resolve) {
    var done = false;
    var fallback = function() {
      return caches.match(request, { ignoreSearch: true }).then(function(cached) { return cached; });
    };
    // on a weak connection give up after a few seconds and use the saved copy
    var timer = setTimeout(function() {
      fallback().then(function(cached) {
        if(cached && !done) { done = true; resolve(cached); }
      });
    }, 4000);
    fetch(request).then(function(response) {
      clearTimeout(timer);
      if(done) { return; }
      done = true;
      if(response && response.ok) {
        var copy = response.clone();
        caches.open(CACHE).then(function(cache) { cache.put(request, copy); });
      }
      resolve(response);
    }).catch(function() {
      clearTimeout(timer);
      if(done) { return; }
      fallback().then(function(cached) {
        done = true;
        resolve(cached || Response.error());
      });
    });
  });
}

self.addEventListener('fetch', function(event) {
  var request = event.request;
  var url = new URL(request.url);
  if(request.method !== 'GET' || url.origin !== self.location.origin) { return; }

  var isCode = request.mode === 'navigate' || /\.(html|js)$/.test(url.pathname) || url.pathname.slice(-1) === '/';
  if(isCode) {
    event.respondWith(networkFirst(request));
    return;
  }
  event.respondWith(
    caches.match(request, { ignoreSearch: true }).then(function(cached) {
      return cached || fetch(request).then(function(response) {
        if(response && response.ok) {
          var copy = response.clone();
          caches.open(CACHE).then(function(cache) { cache.put(request, copy); });
        }
        return response;
      });
    })
  );
});
