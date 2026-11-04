import fs from 'node:fs';
import path from 'node:path';

const distDir = path.resolve('dist');
const outDir = path.resolve('out');

console.log('Exporting production assets from dist/ to out/...');

// 1. Remove previous out directory if exists and re-create
if (fs.existsSync(outDir)) {
  fs.rmSync(outDir, { recursive: true, force: true });
}
fs.mkdirSync(outDir, { recursive: true });

// 2. Copy all files recursively from dist to out
function copyRecursiveSync(src, dest) {
  const exists = fs.existsSync(src);
  const stats = exists && fs.statSync(src);
  const isDirectory = exists && stats.isDirectory();
  if (isDirectory) {
    if (!fs.existsSync(dest)) {
      fs.mkdirSync(dest, { recursive: true });
    }
    fs.readdirSync(src).forEach((childItemName) => {
      copyRecursiveSync(path.join(src, childItemName), path.join(dest, childItemName));
    });
  } else {
    fs.copyFileSync(src, dest);
  }
}

copyRecursiveSync(distDir, outDir);

// 3. Create subfolder index.html for SSG / direct routes in out/
const routes = [
  'admin',
  'admin-login',
  'premium',
  'explore',
  'trending',
  'my-bios',
  'login',
  'about',
  'contact',
  'privacy',
  'terms',
  'bio'
];

const mainIndexHtml = fs.readFileSync(path.join(distDir, 'index.html'), 'utf-8');

routes.forEach((route) => {
  const routeDir = path.join(outDir, route);
  if (!fs.existsSync(routeDir)) {
    fs.mkdirSync(routeDir, { recursive: true });
  }
  fs.writeFileSync(path.join(routeDir, 'index.html'), mainIndexHtml, 'utf-8');
});

// 4. Ensure app-release.apk is in both dist and out
const apkPublicPath = path.resolve('public', 'app-release.apk');
if (fs.existsSync(apkPublicPath)) {
  fs.copyFileSync(apkPublicPath, path.join(outDir, 'app-release.apk'));
  fs.copyFileSync(apkPublicPath, path.join(distDir, 'app-release.apk'));
  console.log('✓ Copied public/app-release.apk to out/ and dist/');
}

console.log('✓ Successfully generated out/ directory with routes:');
routes.forEach((r) => console.log(`  - out/${r}/index.html`));
console.log('✓ out/index.html ready for permanent Firebase Hosting.');
