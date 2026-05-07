'use strict';

const fs = require('node:fs');
const path = require('node:path');

const ROOT = path.resolve(__dirname, '..');
const DIST = path.join(ROOT, 'dist');
const FILES = ['index.html', 'styles.css', 'app.js', 'README.md'];

function clean() {
  if (fs.existsSync(DIST)) fs.rmSync(DIST, { recursive: true, force: true });
  fs.mkdirSync(DIST, { recursive: true });
}

function copyFiles() {
  for (const f of FILES) {
    const src = path.join(ROOT, f);
    const dst = path.join(DIST, f);
    if (fs.existsSync(src)) {
      fs.copyFileSync(src, dst);
      console.log(`[build] copiado: ${f}`);
    } else {
      console.warn(`[build] omitido (no existe): ${f}`);
    }
  }
}

function writeManifest() {
  const manifest = {
    name: 'fastfood-manager',
    version: '1.0.0',
    builtAt: new Date().toISOString(),
    files: FILES
  };
  fs.writeFileSync(
    path.join(DIST, 'build-info.json'),
    JSON.stringify(manifest, null, 2)
  );
  console.log('[build] manifest generado: build-info.json');
}

console.log('=== BUILD: FastFood Manager ===');
clean();
copyFiles();
writeManifest();
console.log('=== BUILD COMPLETADO ===');
