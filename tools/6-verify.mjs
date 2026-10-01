#!/usr/bin/env node
// Step 6 — prove the archive works without the internet.
//
// Three checks per demo:
//   1. No reference still points at an external host.
//   2. Every local reference resolves to a file that exists.
//   3. It renders. Chrome is run with all DNS pointed at a dead address, so
//      any lingering network dependency fails — then we check the screenshot
//      is not a blank rectangle.
//
// Usage: node tools/6-verify.mjs [--quick]   (--quick skips the render pass)

import { readFile, writeFile, readdir, mkdir, stat } from 'node:fs/promises';
import { execFile } from 'node:child_process';
import { promisify } from 'node:util';
import { join, resolve, dirname } from 'node:path';
import { findExternalUrls } from './lib/external-urls.mjs';
import { exists } from './lib/http.mjs';

const run = promisify(execFile);
const CHROME = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const SHOT_DIR = 'tmp/verify';
const quick = process.argv.includes('--quick');

/** Local files an HTML document references. */
function localReferences(html) {
  const found = new Set();
  const attribute = /(?:src|href)\s*=\s*["']([^"']+)["']/g;
  const cssUrl = /url\(\s*['"]?([^'")]+)['"]?\s*\)/g;

  for (const pattern of [attribute, cssUrl]) {
    for (const [, reference] of html.matchAll(pattern)) {
      if (/^(https?:|data:|blob:|#|mailto:|javascript:)/i.test(reference)) continue;
      found.add(reference.split('#')[0].split('?')[0]);
    }
  }

  return [...found].filter(Boolean);
}

/**
 * Is the screenshot more than a flat colour?
 *
 * A demo that failed to load renders as one uniform rectangle. Counting
 * distinct colours in a 64x36 downscale separates that from "drew something"
 * without needing an image library — and unlike brightness variance it does
 * not punish the many deliberately near-black designs in this archive.
 */
async function rendersSomething(png) {
  const { stdout } = await run(
    'ffmpeg',
    ['-v', 'error', '-i', png, '-vf', 'scale=64:36', '-f', 'rawvideo', '-pix_fmt', 'rgb24', '-'],
    { encoding: 'buffer', maxBuffer: 1 << 20 },
  );

  const pixels = stdout;
  if (pixels.length === 0) return false;

  const colours = new Set();
  for (let i = 0; i + 2 < pixels.length; i += 3) {
    colours.add((pixels[i] << 16) | (pixels[i + 1] << 8) | pixels[i + 2]);
    if (colours.size > 2) return true;
  }

  return false;
}

const penDirs = (await readdir('pens', { withFileTypes: true }))
  .filter((entry) => entry.isDirectory())
  .map((entry) => entry.name)
  .sort();

await mkdir(SHOT_DIR, { recursive: true });

const results = [];

for (const [index, dir] of penDirs.entries()) {
  const file = join('pens', dir, 'index.html');
  const result = { dir, external: [], missing: [], rendered: null, note: null };

  if (!(await exists(file))) {
    result.note = 'no archived demo (Editor 2.0 pen)';
    results.push(result);
    continue;
  }

  const html = await readFile(file, 'utf8');
  result.external = findExternalUrls(html);

  for (const reference of localReferences(html)) {
    const target = resolve(dirname(file), reference);
    if (!(await exists(target))) result.missing.push(reference);
  }

  if (!quick) {
    const png = join(SHOT_DIR, `${dir}.png`);
    try {
      await run(CHROME, [
        '--headless=new',
        '--disable-gpu',
        '--hide-scrollbars',
        // Every external host resolves to a closed port: the demo must not need one.
        '--host-resolver-rules=MAP * 127.0.0.1:1',
        '--allow-file-access-from-files',
        '--window-size=1280,720',
        '--virtual-time-budget=5000',
        `--screenshot=${png}`,
        `file://${resolve(file)}`,
      ], { timeout: 60_000 });

      result.rendered = (await stat(png)).size > 0 && (await rendersSomething(png));
    } catch (error) {
      result.rendered = false;
      result.note = error.message.slice(0, 120);
    }
  }

  results.push(result);
  process.stdout.write(`\r[${index + 1}/${penDirs.length}] ${dir.slice(0, 50)}`.padEnd(78));
}

process.stdout.write('\n\n');

const withExternal = results.filter((r) => r.external.length);
const withMissing = results.filter((r) => r.missing.length);
const notRendered = results.filter((r) => r.rendered === false);
const noDemo = results.filter((r) => r.note?.startsWith('no archived demo'));

const report = [
  '# Verification report',
  '',
  `Generated ${new Date().toISOString().slice(0, 10)}.`,
  '',
  `- Demos checked: **${results.length - noDemo.length}**`,
  `- Still referencing an external host: **${withExternal.length}**`,
  `- Broken local references: **${withMissing.length}**`,
  quick ? '- Render pass: skipped (`--quick`)' : `- Failed to render offline: **${notRendered.length}**`,
  `- Pens without an archived demo: **${noDemo.length}**`,
  '',
];

for (const [title, rows, render] of [
  ['External references remaining', withExternal, (r) => r.external.join('<br>')],
  ['Broken local references', withMissing, (r) => r.missing.join('<br>')],
  ['Did not render offline', notRendered, (r) => r.note ?? ''],
  ['No archived demo', noDemo, () => 'CodePen Editor 2.0 — no full-page view to archive'],
]) {
  if (!rows.length) continue;
  report.push(`## ${title}`, '', '| Pen | Detail |', '|---|---|');
  for (const row of rows) report.push(`| \`${row.dir}\` | ${render(row)} |`);
  report.push('');
}

if (!withExternal.length && !withMissing.length && !notRendered.length) {
  report.push('Every archived demo renders with no network access.', '');
}

await mkdir('reports', { recursive: true });
await writeFile('reports/verify.md', report.join('\n'));

console.log(report.slice(4, 10).join('\n'));
console.log('\nwrote reports/verify.md');

if (withExternal.length || withMissing.length || notRendered.length) process.exitCode = 1;
