#!/usr/bin/env node
// Step 8 — bring in the preview videos from konstantin-denerz.com.
//
// The projects page already has a hand-made loop for most of these pens, which
// shows an animation far better than a still frame can. It also carries the
// category each pen was filed under (ai / tools / css-js), which the gallery
// reuses for its filters.
//
// Usage: node tools/8-videos.mjs [--skip-download]

import { readFile, writeFile, mkdir, readdir, stat } from 'node:fs/promises';
import { join } from 'node:path';
import { getText, download, exists } from './lib/http.mjs';

const PROJECTS_URL = 'https://konstantin-denerz.com/projects/';
const VIDEO_DIR = 'media/video';
const skipDownload = process.argv.includes('--skip-download');

const meta = JSON.parse(await readFile('data/pens.json', 'utf8'));
const knownSlugs = new Set(meta.pens.map((pen) => pen.slug));

const html = await getText(PROJECTS_URL, { accept: 'text/html' });
const articles = html.match(/<article[^>]*class="[^"]*project-card[^"]*"[\s\S]*?<\/article>/g) ?? [];

const entries = [];
for (const article of articles) {
  const slug = /\/pen\/([A-Za-z0-9-]+)/.exec(article)?.[1];
  if (!slug) continue;

  entries.push({
    slug,
    category: /data-category="([^"]+)"/.exec(article)?.[1] ?? null,
    video: /<source[^>]+src="([^"]+\.mp4)"/.exec(article)?.[1] ?? null,
    known: knownSlugs.has(slug),
  });
}

await mkdir(VIDEO_DIR, { recursive: true });

let downloaded = 0;
let skipped = 0;
const unmatched = entries.filter((entry) => !entry.known);

for (const entry of entries) {
  if (!entry.video || !entry.known) continue;

  const target = join(VIDEO_DIR, `${entry.slug}.mp4`);
  if (skipDownload) continue;

  const result = await download(entry.video, target, { accept: 'video/mp4' });
  if (result === 'downloaded') {
    downloaded++;
    process.stdout.write(`\r${downloaded} downloaded`.padEnd(40));
  } else {
    skipped++;
  }
}

process.stdout.write('\n');

// What the gallery needs: category per pen, and whether a video exists.
const catalogue = {};
for (const entry of entries) {
  if (!entry.known) continue;
  catalogue[entry.slug] = {
    category: entry.category,
    video: entry.video && (await exists(join(VIDEO_DIR, `${entry.slug}.mp4`)))
      ? `media/video/${entry.slug}.mp4`
      : null,
  };
}

await writeFile(
  'data/homepage.json',
  `${JSON.stringify({
    source: PROJECTS_URL,
    fetchedAt: new Date().toISOString(),
    pens: catalogue,
  }, null, 2)}\n`,
);

let bytes = 0;
for (const name of await readdir(VIDEO_DIR)) {
  bytes += (await stat(join(VIDEO_DIR, name))).size;
}

console.log(
  `${articles.length} cards on the projects page, ${Object.keys(catalogue).length} matched a pen, ` +
  `${downloaded} videos downloaded, ${skipped} already present`,
);
if (unmatched.length) {
  console.log(`${unmatched.length} card(s) reference a pen that is not public: ${unmatched.map((e) => e.slug).join(', ')}`);
}
console.log(`${VIDEO_DIR}: ${(bytes / 1048576).toFixed(1)} MB`);
