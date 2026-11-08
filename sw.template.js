// generated into sw.js by build.js - do not edit sw.js directly
var VERSION = '__VERSION__';
var CACHE = 'nshex-counter-' + VERSION;
var FILES = __FILES__;

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
