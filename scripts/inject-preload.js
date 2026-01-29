#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

// Usage: node scripts/inject-preload.js <dist-folder>
const distArg = process.argv[2] || './dist/MemoWorks';
const distFolder = path.resolve(distArg);

function findIndexHtml(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const e of entries) {
    const full = path.join(dir, e.name);
    if (e.isFile() && e.name.toLowerCase() === 'index.html') return full;
    if (e.isDirectory()) {
      const found = findIndexHtml(full);
      if (found) return found;
    }
  }
  return null;
}

function walkDir(dir, fileList = []) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const e of entries) {
    const full = path.join(dir, e.name);
    if (e.isDirectory()) {
      walkDir(full, fileList);
    } else if (e.isFile()) {
      fileList.push(full);
    }
  }
  return fileList;
}

function toPosix(p) {
  return p.split(path.sep).join('/');
}

function main() {
  if (!fs.existsSync(distFolder)) {
    console.error(`Dist folder not found: ${distFolder}`);
    process.exit(1);
  }

  const indexPath = findIndexHtml(distFolder);
  if (!indexPath) {
    console.error(`index.html not found in dist folder: ${distFolder}`);
    process.exit(1);
  }

  let indexHtml = fs.readFileSync(indexPath, 'utf8');

  // Collect files in dist recursively (excluding maps)
  const allFiles = walkDir(distFolder).filter(f => !f.endsWith('.map'));

  // Compute paths relative to the dist folder root and use posix style
  const relPaths = allFiles
    .map(f => toPosix(path.relative(distFolder, f)))
    .filter(p => p && p !== 'index.html');

  const jsFiles = relPaths.filter(f => f.endsWith('.js'));
  const cssFiles = relPaths.filter(f => f.endsWith('.css'));

  const links = [];

  // Preload CSS (as=style) and keep stylesheet link (so browsers that ignore preload still load it)
  cssFiles.forEach(css => {
    const href = '/' + css; // serve from webroot
    links.push(`<link rel="preload" href="${href}" as="style">\n<link rel="stylesheet" href="${href}">`);
  });

  // Modulepreload for JS chunks: limit to critical JS files only (e.g. main, runtime, polyfills)
  // This avoids preloading lazy chunks and reduces the critical request chain.
  const criticalJs = jsFiles.filter(f => /(^|\/)\s*(main|runtime|polyfills)[^/]*\.js$/.test(f) || /(^|\/)main-[^/]*\.js$/.test(f));
  // Fallback: if we didn't find any 'main' file by pattern, include files starting with 'main-'
  const modulePreloadFiles = criticalJs.length ? criticalJs : jsFiles.filter(f => f.includes('main'));

  modulePreloadFiles.forEach(js => {
    const href = '/' + js;
    links.push(`<link rel="modulepreload" href="${href}">`);
  });

  const headClose = '</head>';
  const markerStart = '<!-- Injected preload/modulepreload links (auto-generated) -->';
  const insertion = `${markerStart}\n${links.join('\n')}\n`;

  if (indexHtml.includes(markerStart)) {
    // Replace existing entire injected block up to the closing head (we find marker and replace until headClose or end of marker)
    // Simpler: remove old marker block first
    indexHtml = indexHtml.replace(new RegExp(`${markerStart}[\s\S]*?\n`, 'g'), insertion);
  } else {
    // Insert before </head>
    indexHtml = indexHtml.replace(headClose, insertion + headClose);
  }

  fs.writeFileSync(indexPath, indexHtml, 'utf8');
  console.log(`Injected ${links.length} links into ${indexPath}`);
}

main();
