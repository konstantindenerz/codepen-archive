#!/usr/bin/env node
// Step 3 — fetch the compiled, runnable demo for every pen.
//
// CodePen's own full-page view (cdpn.io/<user>/fullpage/<slug>) wraps the demo
// in an <iframe srcdoc="...">. That srcdoc, once unescaped, *is* the finished
// document: Pug already turned into HTML, SCSS into prefixed CSS, TypeScript
// into JS. Taking it saves us from reimplementing CodePen's build pipeline.
//
// cdpn.io is the one CodePen host without the Cloudflare challenge, so this
// step can run from Node instead of a browser.
//
// Usage: node tools/3-fetch-demos.mjs [--force]

import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { join } from 'node:path';
import { getText, exists } from './lib/http.mjs';

const OWNER = 'konstantindenerz';
const force = process.argv.includes('--force');

const meta = JSON.parse(await readFile('data/pens.json', 'utf8'));

/** Pull the iframe's srcdoc payload out of a full-page document. */
function extractSrcdoc(html) {
  // Inner quotes arrive as &quot;, so the attribute really does end at the
  // first bare double quote.
  const match = /\ssrcdoc="([^"]*)"/.exec(html);
  return match ? decodeEntities(match[1]) : null;
}

function decodeEntities(text) {
  return text
    .replace(/&quot;/g, '"')
    .replace(/&#(\d+);/g, (_, code) => String.fromCharCode(Number(code)))
    .replace(/&#x([0-9a-f]+);/gi, (_, code) => String.fromCharCode(parseInt(code, 16)))
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&apos;/g, "'")
    .replace(/&amp;/g, '&'); // must stay last
}

/** Strip the CodePen chrome that has no business in an archived copy. */
function clean(html) {
  return html
    // CodePen's own favicons and web-app title.
    .replace(/\s*<link rel="(?:apple-touch-icon|icon|mask-icon)"[^>]*cpwebassets[^>]*>/g, '')
    .replace(/\s*<meta name="apple-mobile-web-app-title"[^>]*>/g, '')
    // The editor's runaway-loop guard — pointless outside the editor.
    .replace(/\s*<script[^>]*stopExecutionOnTimeout[^>]*>\s*<\/script>/g, '')
    // Canonical link back to CodePen; the header comment records it instead.
    .replace(/\s*<link rel="canonical"[^>]*>/g, '')
    .replace(/\n{3,}/g, '\n\n');
}

function header(pen) {
  return [
    '<!--',
    `  ${pen.title}`,
    '',
    `  Archived from ${pen.url}`,
    `  Created ${pen.createdAt.slice(0, 10)} · archived ${meta.fetchedAt.slice(0, 10)}`,
    '',
    '  Compiled output. The authored source is in ./src/.',
    '-->',
    '',
  ].join('\n');
}

const todo = meta.pens.filter((pen) => !pen.newEditor);
const unavailable = meta.pens.filter((pen) => pen.newEditor);

let fetched = 0;
let skipped = 0;
const failures = [];

for (const [index, pen] of todo.entries()) {
  const target = join('pens', pen.dir, 'index.html');

  if (!force && (await exists(target))) {
    skipped++;
    continue;
  }

  const url = `https://cdpn.io/${OWNER}/fullpage/${pen.slug}`;
  process.stdout.write(`[${index + 1}/${todo.length}] ${pen.slug} … `);

  try {
    const page = await getText(url, { accept: 'text/html' });
    const srcdoc = extractSrcdoc(page);

    if (!srcdoc || srcdoc.length < 200) {
      throw new Error(`no usable srcdoc (${srcdoc?.length ?? 0} chars)`);
    }

    await mkdir(join('pens', pen.dir), { recursive: true });
    await writeFile(target, header(pen) + clean(srcdoc));
    fetched++;
    console.log(`${(srcdoc.length / 1024).toFixed(1)} KB`);
  } catch (error) {
    failures.push({ slug: pen.slug, title: pen.title, reason: error.message });
    console.log(`FAILED — ${error.message}`);
  }
}

console.log(`\nfetched ${fetched}, skipped ${skipped}, failed ${failures.length}`);
if (unavailable.length) {
  console.log(`${unavailable.length} Editor 2.0 pen(s) have no full-page view and were not attempted`);
}
if (failures.length) {
  console.log(failures.map((f) => `  ${f.slug} — ${f.reason}`).join('\n'));
  process.exitCode = 1;
}
