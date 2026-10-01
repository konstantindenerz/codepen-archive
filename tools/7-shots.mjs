#!/usr/bin/env node
// Step 7 — generate a thumbnail for every archived demo.
//
// The thumbnails come from the archive itself, rendered with no network
// access, rather than from CodePen's screenshot service. That keeps the
// gallery honest: what you see on a card is what the archived file actually
// draws.
//
// Usage: node tools/7-shots.mjs [--force]

import { readFile, readdir, mkdir, stat } from 'node:fs/promises';
import { execFile } from 'node:child_process';
import { promisify } from 'node:util';
import { join, resolve } from 'node:path';
import { exists } from './lib/http.mjs';

const run = promisify(execFile);
const CHROME = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const SHOT_DIR = 'media/shots';
const RAW_DIR = 'tmp/shots';
// The verification pass already rendered every demo offline; reuse those.
const REUSE_DIR = 'tmp/verify';

const force = process.argv.includes('--force');
const meta = JSON.parse(await readFile('data/pens.json', 'utf8'));

await mkdir(SHOT_DIR, { recursive: true });
await mkdir(RAW_DIR, { recursive: true });

let made = 0;
let skipped = 0;
let reused = 0;
const missing = [];

for (const [index, pen] of meta.pens.entries()) {
  const demo = join('pens', pen.dir, 'index.html');
  const target = join(SHOT_DIR, `${pen.slug}.webp`);

  if (!(await exists(demo))) {
    missing.push(pen.slug);
    continue;
  }

  if (!force && (await exists(target))) {
    skipped++;
    continue;
  }

  let png = join(REUSE_DIR, `${pen.dir}.png`);
  if (await exists(png)) {
    reused++;
  } else {
    png = join(RAW_DIR, `${pen.slug}.png`);
    await run(CHROME, [
      '--headless=new',
      '--disable-gpu',
      '--hide-scrollbars',
      '--host-resolver-rules=MAP * 127.0.0.1:1',
      '--allow-file-access-from-files',
      '--window-size=1280,720',
      '--virtual-time-budget=5000',
      `--screenshot=${png}`,
      `file://${resolve(demo)}`,
    ], { timeout: 60_000 });
  }

  await run('cwebp', ['-quiet', '-q', '72', '-resize', '960', '0', png, '-o', target]);
  made++;
  process.stdout.write(`\r[${index + 1}/${meta.pens.length}] ${pen.slug}`.padEnd(60));
}

process.stdout.write('\n');

let bytes = 0;
for (const name of await readdir(SHOT_DIR)) {
  bytes += (await stat(join(SHOT_DIR, name))).size;
}

console.log(
  `${made} thumbnails written (${reused} reused the verification render), ` +
  `${skipped} already present, ${missing.length} pens have no demo to shoot`,
);
console.log(`${SHOT_DIR}: ${(bytes / 1048576).toFixed(1)} MB`);
