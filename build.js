const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const { minify } = require('terser');
const JavaScriptObfuscator = require('javascript-obfuscator');

const files = ['utils', 'Boot', 'Preloader', 'MainMenu', 'Settings', 'Game'];

(async () => {
  const code = files.map(f => fs.readFileSync(`src/${f}.js`, 'utf8')).join('\n');
  // top-level names (EPT, Boot, Game...) are used by start.js and Phaser, so they must stay global
  const min = await minify(code, { compress: true, mangle: { toplevel: false } });
  if (min.error) { throw min.error; }
  const out = JavaScriptObfuscator.obfuscate(min.code, {
    compact: true,
    stringArray: true,
    stringArrayThreshold: 0.75,
    renameGlobals: false,
    seed: 1 // keeps the bundle identical between builds, so the service worker only updates when something really changed
  }).getObfuscatedCode();
  fs.writeFileSync('src/nshexcounter.min.js', out);
  console.log(`src/nshexcounter.min.js: ${out.length} bytes`);
  writeServiceWorker();
})();

function listFiles(dir) {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap(e => {
    const p = path.join(dir, e.name);
    return e.isDirectory() ? listFiles(p) : [p.split(path.sep).join('/')];
  });
}

// offline support: everything the app loads is cached on install; the cache name changes with the content
function writeServiceWorker() {
  const files = [
    'index.html', 'favicon.png', 'ept.webmanifest',
    ...fs.readdirSync('src').filter(f => /^phaser.*\.min\.js$/.test(f)).map(f => 'src/' + f), 'src/nshexcounter.min.js', 'src/start.js', 'src/plugins/webfont.js',
    ...listFiles('img'), ...listFiles('fonts'), ...listFiles('sfx'), ...listFiles('icons')
  ].filter(f => !f.endsWith('.DS_Store')).sort();
  const hash = crypto.createHash('sha1');
  files.forEach(f => hash.update(f).update(fs.readFileSync(f)));
  const version = hash.digest('hex').slice(0, 10);
  const template = fs.readFileSync('sw.template.js', 'utf8');
  const sw = template
    .replace('__VERSION__', version)
    .replace('__FILES__', JSON.stringify(files, null, 2));
  fs.writeFileSync('sw.js', sw);
  console.log(`sw.js: ${files.length} files, version ${version}`);
}
