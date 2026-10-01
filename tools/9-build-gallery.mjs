#!/usr/bin/env node
// Step 9 — build the data the gallery page reads, and the README index.
//
// data/pens.json carries everything the archive knows; the gallery only needs
// a fraction of it, and asking a browser to parse 134 KB of preprocessor
// settings to draw a card would be wasteful. This writes the slim view.
//
// Usage: node tools/9-build-gallery.mjs

import { readFile, writeFile, stat } from 'node:fs/promises';
import { join } from 'node:path';
import { exists } from './lib/http.mjs';

const REPO = 'https://github.com/konstantindenerz/codepen-archive';

const meta = JSON.parse(await readFile('data/pens.json', 'utf8'));
const homepage = JSON.parse(await readFile('data/homepage.json', 'utf8'));

/** First sentence or so of the description, for the card's blurb. */
function summarise(description) {
  if (!description) return '';
  const text = description
    .replace(/!\[[^\]]*\]\([^)]*\)/g, '')       // images
    .replace(/\[([^\]]*)\]\([^)]*\)/g, '$1')    // links keep their label
    .replace(/[*_`>#]/g, '')
    .replace(/\s+/g, ' ')
    .trim();
  if (text.length <= 180) return text;
  const cut = text.slice(0, 180);
  return `${cut.slice(0, cut.lastIndexOf(' '))}…`;
}

const items = [];
let archived = 0;

for (const pen of meta.pens) {
  const demo = join('pens', pen.dir, 'index.html');
  const hasDemo = await exists(demo);
  if (hasDemo) archived++;

  const shot = `media/shots/${pen.slug}.webp`;
  const extra = homepage.pens[pen.slug] ?? {};

  items.push({
    slug: pen.slug,
    title: pen.title,
    blurb: summarise(pen.description),
    tags: pen.tags,
    loves: pen.counts.loves,
    views: pen.counts.views,
    comments: pen.counts.comments,
    created: pen.createdAt.slice(0, 10),
    featured: pen.featured,
    category: extra.category ?? 'css-js',
    codepen: pen.url,
    source: `${REPO}/tree/main/pens/${pen.dir}`,
    demo: hasDemo ? `pens/${pen.dir}/` : null,
    shot: (await exists(shot)) ? shot : null,
    video: extra.video ?? null,
  });
}

// Most-loved first — the same order the profile's "Popular" tab suggests.
items.sort((a, b) => b.loves - a.loves);

await writeFile(
  'data/gallery.json',
  `${JSON.stringify({
    owner: 'konstantindenerz',
    profile: meta.profile,
    capturedAt: meta.fetchedAt,
    loveThreshold: meta.loveThreshold,
    total: items.length,
    featured: items.filter((item) => item.featured).length,
    archived,
    pens: items,
  }, null, 2)}\n`,
);

const size = (await stat('data/gallery.json')).size;
console.log(
  `data/gallery.json: ${items.length} pens, ${archived} with a runnable demo ` +
  `(${(size / 1024).toFixed(0)} KB)`,
);
