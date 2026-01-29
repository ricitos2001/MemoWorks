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

function detectTopLevelPrefix(paths) {
  if (!paths.length) return '';
  const firstSegments = paths.map(p => p.split('/')[0] || '');
  const candidate = firstSegments[0];
  if (candidate && firstSegments.every(s => s === candidate)) return candidate + '/';
  return '';
}

function stripPrefix(p, prefix) {
  if (!prefix) return p;
  if (p.startsWith(prefix)) return p.slice(prefix.length);
  return p;
}

function buildInjectionBlock(jsFiles, cssFiles, topPrefix) {
  const links = [];
  cssFiles.forEach(css => {
    const normalized = '/' + stripPrefix(css, topPrefix);
    links.push(`<link rel="preload" href="${normalized}" as="style">\n<link rel="stylesheet" href="${normalized}">`);
  });
  jsFiles.forEach(js => {
    const normalized = '/' + stripPrefix(js, topPrefix);
    links.push(`<link rel="modulepreload" href="${normalized}">`);
  });
  return `<!-- Injected preload/modulepreload links (auto-generated) -->\n${links.join('\n')}\n`;
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

  // Locate <head> start tag and end tag
  const headStartMatch = indexHtml.match(/<head[^>]*>/i);
  const headEndIndex = indexHtml.search(/<\/head>/i);
  if (!headStartMatch || headEndIndex === -1) {
    console.error('No <head> ... </head> block found in index.html');
    process.exit(1);
  }
  const headStartTag = headStartMatch[0];
  const headStartIndex = indexHtml.indexOf(headStartTag);
  const headContentStart = headStartIndex + headStartTag.length;
  const headContent = indexHtml.substring(headContentStart, headEndIndex);

  // Clean headContent: remove existing injected markers, remove link tags for modulepreload/preload/stylesheet, and remove any /browser/ references
  let cleanedHead = headContent
    // remove previous marker blocks
    .replace(/<!-- Injected preload\/modulepreload links \(auto-generated\) -->[\s\S]*?(?=$|<\/head>)/gi, '')
    // remove link tags of rel=modulepreload, preload, stylesheet
    .replace(/<link[^>]*rel=(['"])(?:modulepreload|preload|stylesheet)\1[^>]*>/gi, '')
    // remove standalone href/src attributes that reference browser/ (defensive)
    .replace(/(href|src)=(['"])\/?browser\//gi, '$1=$2/')
    ;

  // Collect files in dist recursively (excluding maps)
  const allFiles = walkDir(distFolder).filter(f => !f.endsWith('.map'));
  const relPaths = allFiles.map(f => toPosix(path.relative(distFolder, f))).filter(p => p && p !== 'index.html');

  // Determine top prefix (prefer dir where index is located)
  const indexDirRel = toPosix(path.relative(distFolder, path.dirname(indexPath)));
  let topPrefix;
  if (indexDirRel && indexDirRel !== '.') {
    topPrefix = indexDirRel + '/';
  } else {
    topPrefix = detectTopLevelPrefix(relPaths);
  }

  const jsFiles = relPaths.filter(f => f.endsWith('.js'));
  const cssFiles = relPaths.filter(f => f.endsWith('.css'));

  const injectionBlock = buildInjectionBlock(jsFiles, cssFiles, topPrefix);

  // Reconstruct head: startTag + cleanedHead (trimmed) + injectionBlock + </head>
  const newHead = headStartTag + '\n' + cleanedHead.trim() + '\n' + injectionBlock + '</head>';

  // Reconstruct full HTML
  const newIndexHtml = indexHtml.substring(0, headStartIndex) + newHead + indexHtml.substring(headEndIndex + '</head>'.length);

  fs.writeFileSync(indexPath, newIndexHtml, 'utf8');
  console.log(`Injected ${jsFiles.length + cssFiles.length} links into ${indexPath} (stripped prefix: '${topPrefix}')`);
}

main();
