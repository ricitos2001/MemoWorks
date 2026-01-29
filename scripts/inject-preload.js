#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

// Usage: node scripts/inject-preload.js <dist-folder>
const distArg = process.argv[2] || './dist/MemoWorks';
const distFolder = path.resolve(distArg);

function main() {
  if (!fs.existsSync(distFolder)) {
    console.error(`Dist folder not found: ${distFolder}`);
    process.exit(1);
  }

  const indexPath = path.join(distFolder, 'index.html');
  if (!fs.existsSync(indexPath)) {
    console.error(`index.html not found in dist folder: ${indexPath}`);
    process.exit(1);
  }

  let indexHtml = fs.readFileSync(indexPath, 'utf8');

  // Collect files in dist (only top-level files)
  const files = fs.readdirSync(distFolder).filter(f => !f.endsWith('.map'));

  // JS modules and CSS
  const jsFiles = files.filter(f => f.endsWith('.js'));
  const cssFiles = files.filter(f => f.endsWith('.css'));

  // Build preload/modulepreload links
  const links = [];

  // Prefetch/preload CSS (highest priority for initial rendering)
  cssFiles.forEach(css => {
    // Avoid injecting vendor or chunk runtime css? We'll preload all css files at top-level
    links.push(`<link rel="preload" href="${path.posix.join('/', css)}" as="style">\n<link rel="stylesheet" href="${path.posix.join('/', css)}">`);
  });

  // Modulepreload for JS chunks (module scripts)
  jsFiles.forEach(js => {
    // runtime or polyfills usually small; we still modulepreload them
    links.push(`<link rel="modulepreload" href="${path.posix.join('/', js)}">`);
  });

  const headClose = '</head>';
  const insertion = `<!-- Injected preload/modulepreload links (auto-generated) -->\n${links.join('\n')}\n`;

  if (indexHtml.includes('<!-- Injected preload/modulepreload links (auto-generated) -->')) {
    // Replace existing block
    indexHtml = indexHtml.replace(/<!-- Injected preload[\s\S]*?-->/, insertion);
  } else {
    // Insert before </head>
    indexHtml = indexHtml.replace(headClose, insertion + headClose);
  }

  fs.writeFileSync(indexPath, indexHtml, 'utf8');
  console.log(`Injected ${links.length} links into ${indexPath}`);
}

main();
