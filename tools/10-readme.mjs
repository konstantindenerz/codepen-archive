#!/usr/bin/env node
// Step 10 — regenerate README.md, index table and all.
//
// The table is the archive's catalogue for anyone browsing the repository on
// GitHub rather than through the gallery. It is generated so it cannot drift
// from data/pens.json.
//
// Usage: node tools/10-readme.mjs

import { readFile, writeFile, readdir, stat } from 'node:fs/promises';
import { join } from 'node:path';

const meta = JSON.parse(await readFile('data/pens.json', 'utf8'));
const gallery = JSON.parse(await readFile('data/gallery.json', 'utf8'));
const unvendored = await readFile('reports/unvendored.md', 'utf8');

const number = new Intl.NumberFormat('en-US');

async function directorySize(path) {
  let total = 0;
  for (const entry of await readdir(path, { withFileTypes: true, recursive: true })) {
    if (!entry.isFile()) continue;
    total += (await stat(join(entry.parentPath ?? entry.path, entry.name))).size;
  }
  return total;
}

const mb = (bytes) => `${(bytes / 1048576).toFixed(1)} MB`;

const sizes = {
  pens: await directorySize('pens'),
  assets: await directorySize('assets'),
  media: await directorySize('media'),
};

/** Escape the pipe characters that would otherwise split a table cell. */
const cell = (text) => String(text).replace(/\|/g, '\\|').trim();

const byDir = new Map(meta.pens.map((pen) => [pen.slug, pen.dir]));

const rows = gallery.pens.map((pen) => {
  const dir = byDir.get(pen.slug);
  const demo = pen.demo ? `[open](pens/${dir}/index.html)` : '—';
  const tags = pen.tags.length ? pen.tags.slice(0, 4).join(', ') : '';
  return `| [${cell(pen.title || pen.slug)}](pens/${dir}/) | ${number.format(pen.loves)} | ${number.format(pen.views)} | ${cell(tags)} | ${demo} | [CodePen](${pen.codepen}) |`;
});

const readme = `# CodePen Archive — Konstantin Denerz

A standalone, **offline-capable** archive of every public Pen by
[@konstantindenerz](https://codepen.io/konstantindenerz) — so the work survives
whether or not CodePen does.

> 🖼️ **Browse the gallery:** https://konstantin-denerz.com/codepen-archive/

Each Pen keeps its authored source, its uploaded assets, and a compiled copy
that opens straight from disk. No build step, no network, no CodePen.

## What is in here

| Path | Contents |
|---|---|
| \`pens/<name>-<slug>/index.html\` | The compiled demo. Open it in a browser; it needs nothing else. |
| \`pens/<name>-<slug>/src/\` | The source as written — Pug, SCSS, TypeScript, whatever the Pen used. |
| \`pens/<name>-<slug>/pen.json\` | Title, description, tags, counts, preprocessors, licence. |
| \`assets/vendor/\` | Every file the demos used to load from the internet, copied here. |
| \`data/pens.json\` | The full record for all ${meta.total} Pens. |
| \`data/codepen-raw.json\` | CodePen's API response, kept verbatim as a fidelity backup. |
| \`media/\` | Thumbnails and preview videos for the gallery. |
| \`tools/\` | The archiving pipeline — re-runnable, rate-limited, resumable. |
| \`reports/\` | Verification results and anything that could not be vendored. |

Sizes: demos and sources ${mb(sizes.pens)}, vendored assets ${mb(sizes.assets)},
gallery media ${mb(sizes.media)}.

## State of the archive

- **${meta.total}** public Pens recorded, **${gallery.archived}** with a demo that runs offline.
- **${meta.featured}** have more than ${meta.loveThreshold} loves — the gallery's default view.
- Every archived demo was rendered with all external hosts unresolvable and
  checked for broken local references. See [reports/verify.md](reports/verify.md).
- Four Pens written in CodePen's **Editor 2.0** store their files outside the
  classic API and have no full-page view, so they are catalogued with metadata
  and a link out, but have no local copy.
${unvendored.includes('None —')
  ? '- Every external reference resolves to a local file.'
  : '- One reference could not be vendored; see [reports/unvendored.md](reports/unvendored.md).'}

Love, view and comment counts are a snapshot from **${meta.fetchedAt.slice(0, 10)}** and do not update.

## Publishing

The repository *is* the site — there is nothing to build, so GitHub Pages
serves it straight from the branch:

**Settings → Pages → Source: Deploy from a branch → \`main\` / \`(root)\`**

The account has a Pages custom domain, so project sites live under
\`konstantin-denerz.com\`, not \`github.io\`.

Serving from the root matters: the gallery's viewer loads each demo from
\`pens/<dir>/\`, the same path it has in the repository. \`.nojekyll\` keeps Pages
from running the files through Jekyll.

## Re-running the pipeline

\`\`\`sh
node tools/1-normalize-metadata.mjs   # after refreshing data/codepen-raw.json (see tools/1-fetch-metadata.md)
node tools/2-write-sources.mjs        # authored source, pen.json, per-pen README
node tools/3-fetch-demos.mjs          # compiled demos from cdpn.io
node tools/4-vendor-assets.mjs        # everything fetchable from Node
node tools/collector/server.mjs tmp/browser-assets.json tmp/codepen-assets.json   # then open localhost:8765
node tools/4c-import-assets.mjs tmp/codepen-assets.json
node tools/4e-extract-pen-resources.mjs
node tools/4d-prune-fonts.mjs
node tools/5-rewrite-references.mjs
node tools/6-verify.mjs               # offline render check
node tools/7-shots.mjs                # thumbnails
node tools/8-videos.mjs               # preview videos
node tools/9-build-gallery.mjs && node tools/10-readme.mjs
\`\`\`

Every step is throttled, skips what it already has, and can be re-run safely.
CodePen is behind Cloudflare, so two steps need a real browser; both are
documented where they are used.

## Licence

The pipeline and the gallery are MIT (see [LICENSE](LICENSE)). Each Pen carries
its own CodePen licence in its \`pen.json\`; all ${meta.total} are MIT.

## The Pens

${gallery.featured} Pens with more than ${meta.loveThreshold} loves, then the rest. Sorted by loves.

| Pen | Loves | Views | Tags | Demo | Original |
|---|---:|---:|---|---|---|
${rows.join('\n')}
`;

await writeFile('README.md', readme);
console.log(`README.md: ${rows.length} rows, ${(readme.length / 1024).toFixed(0)} KB`);
