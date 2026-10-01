#!/usr/bin/env node
// Step 1b — turn the raw GraphQL dump into data/pens.json.
//
// The raw payload is CodePen's shape; everything downstream reads this
// normalised shape instead, so a future CodePen API change only touches
// this one file.
//
// `data/codepen-raw.json` is kept verbatim as the fidelity backup — it is the
// only place the full API response survives. `data/pens.json` is the slim,
// derived view that the gallery and every later step read, so it deliberately
// leaves the source code out: that lives in `pens/<dir>/src/`.
//
// Usage: node tools/1-normalize-metadata.mjs [data/codepen-raw.json]

import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { isNewEditorSlug, penDir, slugFromUrl, sourceExtension } from './lib/slug.mjs';

const LOVE_THRESHOLD = 2; // "more than 2 likes" — the gallery's default filter

function detectLicense(text) {
  if (!text) return null;
  if (/MIT License|Permission is hereby granted, free of charge/i.test(text)) return 'MIT';
  return 'custom';
}

const input = process.argv[2] ?? 'data/codepen-raw.json';
const raw = JSON.parse(await readFile(input, 'utf8'));

const pens = raw.pens.map((pen) => {
  const slug = slugFromUrl(pen.url);
  const config = pen.config ?? {};
  const preProcessors = {
    html: config.htmlPreProcessor ?? 'none',
    css: config.cssPreProcessor ?? 'none',
    js: config.jsPreProcessor ?? 'none',
  };

  return {
    slug,
    dir: penDir(pen.title, slug),
    // Editor 2.0 pens keep their source somewhere else entirely; `config` comes
    // back empty for them and they need their own archiving route.
    newEditor: isNewEditorSlug(slug),
    title: (pen.title ?? '').trim(),
    url: pen.url,
    description: pen.description?.source?.body ?? '',
    descriptionFormat: pen.description?.source?.type ?? null,
    tags: pen.tags ?? [],
    // CodePen ships the whole licence text with every pen; storing 106 copies
    // of the MIT boilerplate would triple this file. The verbatim text stays in
    // data/codepen-raw.json, the repo-level LICENSE covers the archive.
    license: detectLicense(pen.license),
    createdAt: pen.createdAt,
    updatedAt: pen.updatedAt,
    counts: {
      loves: pen.counts?.loves ?? 0,
      views: pen.counts?.views ?? 0,
      comments: pen.counts?.comments ?? 0,
    },
    featured: (pen.counts?.loves ?? 0) > LOVE_THRESHOLD,
    forkedFrom: pen.parentItem?.url
      ? { url: pen.parentItem.url, title: pen.parentItem.title }
      : null,
    preProcessors,
    sourceFiles: {
      html: `src/index.${sourceExtension('html', preProcessors.html)}`,
      css: `src/style.${sourceExtension('css', preProcessors.css)}`,
      js: `src/script.${sourceExtension('js', preProcessors.js)}`,
    },
    // Page-level settings CodePen applies outside the source panes.
    cssStarter: config.cssStarter ?? 'neither',
    cssPrefix: config.cssPrefix ?? 'neither',
    head: config.head ?? '',
    htmlClasses: config.htmlClasses ?? '',
    resources: (config.resources ?? [])
      .filter((resource) => resource.url)
      .map(({ resourceType, url, order }) => ({ resourceType, url, order })),
    hasSource: Boolean(
      (config.html ?? '') || (config.css ?? '') || (config.js ?? ''),
    ),
  };
});

const duplicateDirs = pens
  .map((pen) => pen.dir)
  .filter((dir, index, all) => all.indexOf(dir) !== index);
if (duplicateDirs.length) {
  throw new Error(`duplicate folder names: ${[...new Set(duplicateDirs)].join(', ')}`);
}

const missingSlug = pens.filter((pen) => !pen.slug);
if (missingSlug.length) {
  throw new Error(`${missingSlug.length} pen(s) without a slug`);
}

pens.sort((a, b) => b.counts.loves - a.counts.loves);

await mkdir('data', { recursive: true });
await writeFile(
  'data/pens.json',
  `${JSON.stringify(
    {
      owner: 'konstantindenerz',
      profile: 'https://codepen.io/konstantindenerz',
      // Love and view counts are a point-in-time snapshot.
      fetchedAt: raw.fetchedAt,
      loveThreshold: LOVE_THRESHOLD,
      total: pens.length,
      featured: pens.filter((pen) => pen.featured).length,
      pens,
    },
    null,
    2,
  )}\n`,
);

console.log(
  `data/pens.json: ${pens.length} pens, ` +
  `${pens.filter((p) => p.featured).length} with more than ${LOVE_THRESHOLD} loves`,
);
