#!/usr/bin/env node
// Step 4e — rebuild "pen as a resource" files from our own archive.
//
// CodePen lets one pen include another as a stylesheet or script via
// codepen.io/<user>/pen/<slug>.css|.js. Those URLs are Cloudflare-protected and
// send no CORS headers, so neither Node nor a local page can fetch them.
//
// They do not need fetching. Each one serves the compiled output of a pen we
// have already archived — the same bytes sit in that pen's index.html, in its
// <style> block and its <script id="rendered-js">. A pane the pen never used
// serves an empty file, and we reproduce that too.
//
// Usage: node tools/4e-extract-pen-resources.mjs

import { readFile, writeFile, readdir } from 'node:fs/promises';
import { join } from 'node:path';
import { VENDOR_DIR, vendorName } from './lib/vendor.mjs';

const MANIFEST = 'data/vendor-manifest.json';
const PEN_RESOURCE = /^https:\/\/codepen\.io\/([^/]+)\/pen\/([A-Za-z0-9]+)\.(css|js)$/;

const manifest = JSON.parse(await readFile(MANIFEST, 'utf8'));
const known = new Map(manifest.assets.map((asset) => [asset.url, asset]));
const deferred = JSON.parse(await readFile('tmp/browser-assets.json', 'utf8'));

const meta = JSON.parse(await readFile('data/pens.json', 'utf8'));
const dirBySlug = new Map(meta.pens.map((pen) => [pen.slug, pen.dir]));

/** Strip HTML comments and tags to get at a block's text content. */
function extractBlock(html, pattern) {
  const match = pattern.exec(html);
  return match ? match[1] : '';
}

let written = 0;

for (const url of deferred) {
  const match = PEN_RESOURCE.exec(url);
  if (!match) continue;
  if (known.has(url)) continue;

  const [, , slug, kind] = match;
  const dir = dirBySlug.get(slug);
  if (!dir) {
    console.warn(`${url}: pen ${slug} is not in the archive`);
    continue;
  }

  const html = await readFile(join('pens', dir, 'index.html'), 'utf8');

  const content = kind === 'css'
    // The pen's own compiled CSS — not the normalize <link>, which is an href.
    ? extractBlock(html, /<style[^>]*>([\s\S]*?)<\/style>/)
    : extractBlock(html, /<script id="rendered-js"[^>]*>([\s\S]*?)<\/script>/);

  const name = vendorName(url, kind === 'css' ? 'text/css' : 'application/javascript');
  const body = content.trim()
    ? `${content.trim()}\n`
    : `/* ${slug} has no ${kind.toUpperCase()}; CodePen serves this as an empty file. */\n`;

  await writeFile(join(VENDOR_DIR, name), body);
  known.set(url, { url, name });
  written++;
  console.log(`${slug}.${kind} -> ${name} (${body.length} bytes, from pens/${dir})`);
}

manifest.assets = [...known.values()].sort((a, b) => a.url.localeCompare(b.url));
await writeFile(MANIFEST, `${JSON.stringify(manifest, null, 2)}\n`);

console.log(`\nrebuilt ${written} pen-resource file(s); manifest has ${manifest.assets.length} entries`);

// Sanity: nothing in assets/vendor should be orphaned.
const onDisk = new Set(await readdir(VENDOR_DIR));
const missing = manifest.assets.filter((asset) => !onDisk.has(asset.name));
if (missing.length) {
  console.warn(`${missing.length} manifest entries have no file on disk`);
  process.exitCode = 1;
}
