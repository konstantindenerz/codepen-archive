#!/usr/bin/env node
// Step 4d — drop Google Font subsets no demo can ever render.
//
// Google serves a stylesheet split into dozens — sometimes hundreds — of
// @font-face blocks, one per unicode-range. "M PLUS Rounded 1c" alone brings
// 882 files and 10 MB of CJK glyphs to two pens that contain no CJK at all.
//
// For each stylesheet we look at every pen that loads it, collect the
// characters those pens could possibly display, and keep only the blocks whose
// unicode-range covers at least one of them. Font files the surviving blocks
// reference are then downloaded (or kept); everything else is deleted.
//
// Run this before the rewrite step: pens still reference the *remote* Google
// URL at this point, which is how a stylesheet is matched to its users.
//
// Usage: node tools/4d-prune-fonts.mjs

import { readFile, writeFile, readdir, rm, stat, mkdir } from 'node:fs/promises';
import { join } from 'node:path';
import { VENDOR_DIR } from './lib/vendor.mjs';
import { get, exists } from './lib/http.mjs';

const MANIFEST = 'data/vendor-manifest.json';

/** Parse `U+0-FF, U+131, U+2000-206F` into [start, end] pairs. */
function parseUnicodeRange(value) {
  const ranges = [];

  for (const part of value.split(',')) {
    const token = part.trim().replace(/^u\+/i, '');
    if (!token) continue;

    if (token.includes('-')) {
      const [from, to] = token.split('-');
      ranges.push([parseInt(from, 16), parseInt(to, 16)]);
    } else if (token.includes('?')) {
      // Wildcard form: U+30?? means U+3000-U+30FF.
      ranges.push([
        parseInt(token.replace(/\?/g, '0'), 16),
        parseInt(token.replace(/\?/g, 'F'), 16),
      ]);
    } else {
      const point = parseInt(token, 16);
      ranges.push([point, point]);
    }
  }

  return ranges.filter(([from, to]) => Number.isFinite(from) && Number.isFinite(to));
}

const referencedFiles = (css) =>
  (css.match(/url\(\.\/([^)]+)\)/g) ?? []).map((match) => match.slice(6, -1));

const manifest = JSON.parse(await readFile(MANIFEST, 'utf8'));
const remoteUrlByName = new Map(manifest.assets.map((asset) => [asset.name, asset.url]));
const fontUrlByName = new Map(manifest.fonts.map((font) => [font.name, font.url]));

const penDirs = (await readdir('pens', { withFileTypes: true }))
  .filter((entry) => entry.isDirectory())
  .map((entry) => entry.name);

const pages = [];
for (const dir of penDirs) {
  try {
    pages.push(await readFile(join('pens', dir, 'index.html'), 'utf8'));
  } catch {
    /* Editor 2.0 pens have no archived demo */
  }
}

const stylesheets = (await readdir(VENDOR_DIR)).filter((name) => name.endsWith('.css'));
const needed = new Set();
let removedBlocks = 0;

for (const sheet of stylesheets) {
  const path = join(VENDOR_DIR, sheet);
  const css = await readFile(path, 'utf8');
  const faces = css.match(/@font-face\s*\{[^}]*\}/g) ?? [];
  if (faces.length < 2) continue; // normalize.css and friends

  // Match the stylesheet to its pens by the URL they still point at.
  const remote = remoteUrlByName.get(sheet);
  const users = remote ? pages.filter((html) => html.includes(remote)) : [];

  if (users.length === 0) {
    console.warn(`${sheet}: no pen references it — keeping every face`);
    referencedFiles(css).forEach((name) => needed.add(name));
    continue;
  }

  const codepoints = new Set();
  for (const html of users) {
    for (const char of html) codepoints.add(char.codePointAt(0));
  }

  const kept = faces.filter((face) => {
    const range = /unicode-range\s*:\s*([^;}]+)/i.exec(face);
    if (!range) return true; // no range declared — always applies

    return parseUnicodeRange(range[1]).some(([from, to]) => {
      for (const point of codepoints) {
        if (point >= from && point <= to) return true;
      }
      return false;
    });
  });

  if (kept.length !== faces.length) {
    removedBlocks += faces.length - kept.length;
    await writeFile(path, `${kept.join('\n')}\n`);
    console.log(`${sheet}: kept ${kept.length}/${faces.length} faces (${users.length} pen(s))`);
  }

  referencedFiles(kept.join('\n')).forEach((name) => needed.add(name));
}

// Make sure every surviving reference actually exists on disk.
await mkdir(VENDOR_DIR, { recursive: true });
let restored = 0;
for (const name of needed) {
  const path = join(VENDOR_DIR, name);
  if (await exists(path)) continue;

  const url = fontUrlByName.get(name);
  if (!url) {
    console.warn(`cannot restore ${name}: not in the manifest`);
    continue;
  }

  const { buffer } = await get(url);
  await writeFile(path, buffer);
  restored++;
}

// Delete font files no surviving @font-face points at.
let removedFiles = 0;
let reclaimed = 0;
for (const name of await readdir(VENDOR_DIR)) {
  if (!/\.(woff2?|ttf|otf|eot)$/i.test(name)) continue;
  if (needed.has(name)) continue;

  const path = join(VENDOR_DIR, name);
  reclaimed += (await stat(path)).size;
  await rm(path);
  removedFiles++;
}

manifest.fonts = manifest.fonts.filter((font) => needed.has(font.name));
await writeFile(MANIFEST, `${JSON.stringify(manifest, null, 2)}\n`);

console.log(
  `\nkept ${needed.size} font files (restored ${restored}), ` +
  `removed ${removedBlocks} @font-face blocks` +
  (removedFiles ? `, deleted ${removedFiles} stale files (${(reclaimed / 1048576).toFixed(1)} MB)` : ''),
);
