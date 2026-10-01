#!/usr/bin/env node
// Step 4 — download everything the demos load from the open web.
//
// An archive that still phones home to assets.codepen.io is not an archive, so
// every external file is copied into assets/vendor/ and the demos are rewritten
// to point at the local copy.
//
// Two CodePen hosts sit behind Cloudflare and refuse Node and headless Chrome
// alike. Those URLs are written to tmp/browser-assets.json for the browser step
// (tools/4b-fetch-via-browser.md) and picked up again by 4c-import-assets.mjs.
//
// Usage: node tools/4-vendor-assets.mjs

import { readFile, writeFile, mkdir, readdir } from 'node:fs/promises';
import { join } from 'node:path';
import { get, exists } from './lib/http.mjs';
import { findExternalUrls } from './lib/external-urls.mjs';
import { VENDOR_DIR, vendorName, needsBrowser } from './lib/vendor.mjs';

const MANIFEST = 'data/vendor-manifest.json';

/** Collect every external URL across all archived demos. */
async function collectUrls() {
  const dirs = (await readdir('pens', { withFileTypes: true }))
    .filter((entry) => entry.isDirectory())
    .map((entry) => entry.name);

  const urls = new Set();
  for (const dir of dirs) {
    const file = join('pens', dir, 'index.html');
    if (!(await exists(file))) continue;
    for (const url of findExternalUrls(await readFile(file, 'utf8'))) {
      urls.add(url);
    }
  }
  return [...urls].sort();
}

/**
 * Google Fonts serves a stylesheet that points at fonts.gstatic.com. Pull the
 * stylesheet, pull every font file it names, and rewrite it to load locally.
 */
async function vendorGoogleFont(url, manifest) {
  const { buffer } = await get(url, { accept: 'text/css' });
  let css = buffer.toString('utf8');

  const fontUrls = [...new Set(css.match(/https:\/\/fonts\.gstatic\.com\/[^)'"\s]+/g) ?? [])];
  for (const fontUrl of fontUrls) {
    // Font URLs carry their own extension, so the local name is known before
    // the request — which lets an interrupted run skip what it already has.
    const name = vendorName(fontUrl);
    if (!(await exists(join(VENDOR_DIR, name)))) {
      const font = await get(fontUrl);
      await writeFile(join(VENDOR_DIR, name), font.buffer);
    }
    // The stylesheet sits beside its fonts, so a bare filename resolves.
    css = css.split(fontUrl).join(`./${name}`);
    manifest.fonts.push({ url: fontUrl, name });
  }

  const name = vendorName(url, 'text/css');
  await writeFile(join(VENDOR_DIR, name), css);
  return { name, fontCount: fontUrls.length };
}

const saveManifest = () =>
  writeFile(MANIFEST, `${JSON.stringify(manifest, null, 2)}\n`);

await mkdir(VENDOR_DIR, { recursive: true });
await mkdir('tmp', { recursive: true });

const urls = await collectUrls();

// Resume: a previous run may have been interrupted part-way through.
const manifest = (await exists(MANIFEST))
  ? JSON.parse(await readFile(MANIFEST, 'utf8'))
  : { fetchedAt: new Date().toISOString(), assets: [], fonts: [] };
const alreadyDone = new Set(manifest.assets.map((asset) => asset.url));
const deferred = [];
const failures = [];

console.log(`${urls.length} unique external URLs\n`);

for (const [index, url] of urls.entries()) {
  const label = `[${index + 1}/${urls.length}] ${new URL(url).host}`;

  if (needsBrowser(url)) {
    deferred.push(url);
    continue;
  }

  if (alreadyDone.has(url)) {
    continue;
  }

  try {
    if (url.startsWith('https://fonts.googleapis.com/')) {
      const { name, fontCount } = await vendorGoogleFont(url, manifest);
      manifest.assets.push({ url, name });
      await saveManifest();
      console.log(`${label} … ${name} (+${fontCount} font files)`);
      continue;
    }

    const { buffer, contentType } = await get(url);
    const name = vendorName(url, contentType);
    await writeFile(join(VENDOR_DIR, name), buffer);
    manifest.assets.push({ url, name });
    await saveManifest();
    console.log(`${label} … ${name} (${(buffer.length / 1024).toFixed(1)} KB)`);
  } catch (error) {
    failures.push({ url, reason: error.message });
    console.log(`${label} … FAILED — ${error.message}`);
  }
}

await saveManifest();
await writeFile('tmp/browser-assets.json', `${JSON.stringify(deferred, null, 2)}\n`);

console.log(
  `\nvendored ${manifest.assets.length} assets (+${manifest.fonts.length} font files), ` +
  `${deferred.length} deferred to the browser, ${failures.length} failed`,
);
if (failures.length) {
  console.log(failures.map((f) => `  ${f.url} — ${f.reason}`).join('\n'));
}
