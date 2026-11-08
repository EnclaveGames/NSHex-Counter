const fs = require('fs');
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
    renameGlobals: false
  }).getObfuscatedCode();
  fs.writeFileSync('src/nshexcounter.min.js', out);
  console.log(`src/nshexcounter.min.js: ${out.length} bytes`);
})();
