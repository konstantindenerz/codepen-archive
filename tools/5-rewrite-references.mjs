#!/usr/bin/env node
// Step 5 — point every demo at its vendored copies.
//
// Until now the archived demos still load from assets.codepen.io, Google Fonts
// and friends. This rewrites each reference to the local file, which is what
// makes the archive survive CodePen going away.
//
// Anything that could not be vendored is listed in reports/unvendored.md
// rather than silently left pointing at the internet.
//
// Usage: node tools/5-rewrite-references.mjs

import { readFile, writeFile, readdir, mkdir } from 'node:fs/promises';
import { join } from 'node:path';
import { findExternalUrls } from './lib/external-urls.mjs';
import { rewriteUrls, VENDOR_DIR, VENDOR_PREFIX_FROM_PEN } from './lib/vendor.mjs';

const manifest = JSON.parse(await readFile('data/vendor-manifest.json', 'utf8'));
const localName = new Map(manifest.assets.map((asset) => [asset.url, asset.name]));

const penDirs = (await readdir('pens', { withFileTypes: true }))
  .filter((entry) => entry.isDirectory())
  .map((entry) => entry.name);

let rewritten = 0;
let replacements = 0;
const unvendored = new Map(); // url -> pens still referencing it

for (const dir of penDirs) {
  const file = join('pens', dir, 'index.html');

  let html;
  try {
    html = await readFile(file, 'utf8');
  } catch {
    continue; // Editor 2.0 pens have no archived demo
  }

  const urls = findExternalUrls(html);
  if (urls.length === 0) continue;

  const mapping = [];
  for (const url of urls) {
    const name = localName.get(url);
    if (name) {
      mapping.push([url, name]);
    } else {
      if (!unvendored.has(url)) unvendored.set(url, []);
      unvendored.get(url).push(dir);
    }
  }

  if (mapping.length === 0) continue;

  const updated = rewriteUrls(html, mapping, VENDOR_PREFIX_FROM_PEN);
  if (updated !== html) {
    await writeFile(file, updated);
    rewritten++;
    replacements += mapping.length;
  }
}

// Vendored stylesheets and scripts carry their own external references —
// a pen included as a resource still points at assets.codepen.io. They sit
// beside what they reference, so their prefix is '.'.
for (const name of await readdir(VENDOR_DIR)) {
  if (!/\.(css|js)$/.test(name)) continue;

  const file = join(VENDOR_DIR, name);
  const text = await readFile(file, 'utf8');
  const mapping = [];

  for (const url of findExternalUrls(text)) {
    const target = localName.get(url);
    if (target) {
      mapping.push([url, target]);
    } else {
      if (!unvendored.has(url)) unvendored.set(url, []);
      unvendored.get(url).push(`${VENDOR_DIR}/${name}`);
    }
  }

  if (!mapping.length) continue;

  const updated = rewriteUrls(text, mapping, '.');
  if (updated !== text) {
    await writeFile(file, updated);
    rewritten++;
    replacements += mapping.length;
  }
}

await mkdir('reports', { recursive: true });

if (unvendored.size) {
  const lines = [
    '# Unvendored references',
    '',
    'These URLs are still fetched from the internet. If the host goes away, the',
    'affected demos lose that asset — everything else keeps working.',
    '',
    '| URL | Pens |',
    '|---|---|',
    ...[...unvendored].map(([url, pens]) => `| \`${url}\` | ${pens.join(', ')} |`),
    '',
  ];
  await writeFile('reports/unvendored.md', lines.join('\n'));
} else {
  await writeFile(
    'reports/unvendored.md',
    '# Unvendored references\n\nNone — every external reference is served from `assets/vendor/`.\n',
  );
}

console.log(
  `rewrote ${replacements} references across ${rewritten} demos; ` +
  `${unvendored.size} URL(s) could not be vendored`,
);
