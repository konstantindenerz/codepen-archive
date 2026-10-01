# Step 1 — Fetch pen metadata from CodePen

CodePen sits behind a Cloudflare JS challenge, so `curl` and headless Chrome both
get a `403`. This step therefore runs **inside a real, already-trusted Chrome tab**
rather than from Node.

## How to run it

1. Open <https://codepen.io/konstantindenerz/pens/popular> in Chrome.
2. Paste the snippet below into the DevTools console.
3. It pages through the GraphQL API (6 requests, 2.5s apart) and downloads
   `codepen-raw.json` to your Downloads folder.
4. Move that file to `tmp/codepen-raw.json` and run:
   `node tools/1-normalize-metadata.mjs tmp/codepen-raw.json`

## Why GraphQL

`POST https://codepen.io/graphql` returns the complete pen record — including the
**raw source** (`config.html` / `.css` / `.js`) and the preprocessor settings — so
one paginated pass replaces 106 page scrapes.

Two gotchas worth remembering:

- `pagination.limit` is capped at **20** server-side, whatever you ask for.
- `sortBy: Popularity` is a composite score, **not** love count. Always fetch
  every pen and filter locally.

The result is downloaded as a Blob rather than printed, because the console
bridge mangles long base64-ish strings and would corrupt the source code.

```js
const csrf = document.querySelector('meta[name="csrf-token"]').content;

const query = `query Q($input: PensInput!) {
  pens(input: $input) {
    pens {
      id title url createdAt updatedAt
      counts { loves views comments }
      ... on Pen {
        cpid license tags
        description { source { body type } }
        config {
          html css js
          htmlPreProcessor cssPreProcessor jsPreProcessor
          cssStarter cssPrefix head htmlClasses
          resources { resourceType url order }
        }
        previews { shotUrlTemplate }
        urls { pen full zip }
        parentItem { url title }
      }
    }
    pageInfo { cursorEnd hasNextPage }
  }
}`;

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const pens = [];
let cursor = null;

for (let page = 0; page < 20; page++) {
  const pagination = { limit: 20, sortBy: 'Popularity' };
  if (cursor) pagination.cursor = cursor;

  const response = await fetch('https://codepen.io/graphql', {
    method: 'POST',
    credentials: 'same-origin',
    headers: {
      'content-type': 'application/json',
      'x-requested-with': 'XMLHttpRequest',
      'x-csrf-token': csrf,
    },
    body: JSON.stringify({
      query,
      variables: { input: { pagination, filters: { userId: 'enyAWa', teamId: null } } },
    }),
  });

  const json = await response.json();
  if (json.errors) throw new Error(json.errors[0].message);

  pens.push(...json.data.pens.pens);
  if (!json.data.pens.pageInfo.hasNextPage) break;
  cursor = json.data.pens.pageInfo.cursorEnd;
  await sleep(2500);
}

const blob = new Blob(
  [JSON.stringify({ fetchedAt: new Date().toISOString(), pens }, null, 2)],
  { type: 'application/json' },
);
const a = document.createElement('a');
a.href = URL.createObjectURL(blob);
a.download = 'codepen-raw.json';
document.body.appendChild(a);
a.click();
a.remove();

pens.length;
```
