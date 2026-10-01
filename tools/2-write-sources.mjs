#!/usr/bin/env node
// Step 2 — write each pen's authored source, metadata and README to disk.
//
// This is the part of the archive a human reads: the code exactly as it was
// written in the CodePen editor, with the preprocessor's own extension, next
// to a README that explains what the pen is.
//
// Usage: node tools/2-write-sources.mjs

import { readFile, writeFile, mkdir, rm, readdir } from 'node:fs/promises';
import { join } from 'node:path';

const PENS_DIR = 'pens';

const meta = JSON.parse(await readFile('data/pens.json', 'utf8'));
const raw = JSON.parse(await readFile('data/codepen-raw.json', 'utf8'));

// The raw dump is keyed by URL; index it so we can pair it with the slim record.
const sourceByUrl = new Map(raw.pens.map((pen) => [pen.url, pen.config ?? {}]));

const stat = (n, label) => `${n.toLocaleString('en-US')} ${label}`;

function penReadme(pen) {
  const lines = [
    `# ${pen.title}`,
    '',
    `> ${[
      stat(pen.counts.loves, 'loves'),
      stat(pen.counts.comments, 'comments'),
      stat(pen.counts.views, 'views'),
    ].join(' · ')}`,
    '',
  ];

  if (pen.description) lines.push(pen.description.trim(), '');

  lines.push(
    '| | |',
    '|---|---|',
    `| **Live on CodePen** | <${pen.url}> |`,
    '| **Archived demo** | [index.html](index.html) |',
    `| **Created** | ${pen.createdAt.slice(0, 10)} |`,
    `| **Updated** | ${pen.updatedAt.slice(0, 10)} |`,
    `| **Preprocessors** | ${pen.preProcessors.html} / ${pen.preProcessors.css} / ${pen.preProcessors.js} |`,
  );

  if (pen.tags.length) lines.push(`| **Tags** | ${pen.tags.join(', ')} |`);
  if (pen.license) lines.push(`| **License** | ${pen.license} |`);
  if (pen.forkedFrom) {
    lines.push(`| **Forked from** | [${pen.forkedFrom.title}](${pen.forkedFrom.url}) |`);
  }

  lines.push('', '## Source', '');
  for (const [pane, file] of Object.entries(pen.sourceFiles)) {
    lines.push(`- \`${file}\` — ${pane.toUpperCase()} (${pen.preProcessors[pane]})`);
  }

  lines.push(
    '',
    '`index.html` is the compiled, self-contained result — open it directly,',
    'no build step and no network needed.',
    '',
  );

  return lines.join('\n');
}

let written = 0;
let skippedNoSource = 0;
const expectedDirs = new Set();

for (const pen of meta.pens) {
  const dir = join(PENS_DIR, pen.dir);
  expectedDirs.add(pen.dir);
  await mkdir(join(dir, 'src'), { recursive: true });

  const config = sourceByUrl.get(pen.url) ?? {};
  const panes = {
    html: config.html ?? '',
    css: config.css ?? '',
    js: config.js ?? '',
  };

  if (!pen.hasSource) {
    // Editor 2.0 pens keep their files outside the classic `config` payload.
    skippedNoSource++;
  }

  for (const [pane, code] of Object.entries(panes)) {
    if (!code) continue;
    const text = code.endsWith('\n') ? code : `${code}\n`;
    await writeFile(join(dir, pen.sourceFiles[pane]), text);
  }

  await writeFile(join(dir, 'pen.json'), `${JSON.stringify(pen, null, 2)}\n`);
  await writeFile(join(dir, 'README.md'), penReadme(pen));
  written++;
}

// Drop folders left behind by an earlier run with different titles.
const present = await readdir(PENS_DIR, { withFileTypes: true });
let removed = 0;
for (const entry of present) {
  if (!entry.isDirectory() || expectedDirs.has(entry.name)) continue;
  await rm(join(PENS_DIR, entry.name), { recursive: true, force: true });
  removed++;
}

console.log(
  `wrote ${written} pen folders` +
  (skippedNoSource ? `, ${skippedNoSource} without classic source panes` : '') +
  (removed ? `, removed ${removed} stale folder(s)` : ''),
);
