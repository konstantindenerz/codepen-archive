// CodePen Archive — gallery behaviour.
//
// Plain modules, no build step: the page has to keep working years from now,
// opened straight off a disk, with whatever browser is around.

const state = {
  pens: [],
  query: '',
  category: 'all',
  tag: null,
  sort: 'loves',
  includeQuiet: false,
};

const elements = {
  grid: document.getElementById('grid'),
  empty: document.getElementById('empty'),
  count: document.getElementById('result-count'),
  tagbar: document.getElementById('tagbar'),
  search: document.getElementById('search'),
  sort: document.getElementById('sort'),
  showAll: document.getElementById('show-all'),
  reset: document.getElementById('reset'),
  viewer: document.getElementById('viewer'),
  frame: document.getElementById('viewer-frame'),
};

const number = new Intl.NumberFormat('en-US');

const ICONS = {
  loves: '<path d="M8 14s6-4.2 6-8a3.2 3.2 0 0 0-6-1.3A3.2 3.2 0 0 0 2 6c0 3.8 6 8 6 8z"/>',
  comments: '<path d="M2 3h12v8H6l-4 3V3z"/>',
  views: '<path d="M8 3C4.5 3 1.8 5.6 1 8c.8 2.4 3.5 5 7 5s6.2-2.6 7-5c-.8-2.4-3.5-5-7-5zm0 8a3 3 0 1 1 0-6 3 3 0 0 1 0 6z"/>',
};

const icon = (kind) =>
  `<svg viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">${ICONS[kind]}</svg>`;

const escapeHtml = (value) =>
  String(value).replace(/[&<>"']/g, (char) => (
    { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[char]
  ));

// ------------------------------------------------------------------ filtering

function visiblePens() {
  const query = state.query.trim().toLowerCase();

  const matches = state.pens.filter((pen) => {
    if (!state.includeQuiet && !pen.featured) return false;
    if (state.category !== 'all' && pen.category !== state.category) return false;
    if (state.tag && !pen.tags.includes(state.tag)) return false;
    if (!query) return true;

    return (
      pen.title.toLowerCase().includes(query) ||
      pen.blurb.toLowerCase().includes(query) ||
      pen.tags.some((tag) => tag.toLowerCase().includes(query))
    );
  });

  const order = {
    loves: (a, b) => b.loves - a.loves,
    views: (a, b) => b.views - a.views,
    newest: (a, b) => b.created.localeCompare(a.created),
    oldest: (a, b) => a.created.localeCompare(b.created),
    title: (a, b) => a.title.localeCompare(b.title),
  };

  return matches.sort(order[state.sort]);
}

// -------------------------------------------------------------------- cards

function cardMarkup(pen) {
  const stats = [
    ['loves', pen.loves],
    ['comments', pen.comments],
    ['views', pen.views],
  ]
    .map(([kind, value]) =>
      `<li class="card-stat">${icon(kind)}<span><span class="visually-hidden">${kind}: </span>${number.format(value)}</span></li>`)
    .join('');

  const media = pen.shot
    ? `<img src="${pen.shot}" alt="" loading="lazy" decoding="async" width="960" height="540">` +
      (pen.video ? `<video muted loop playsinline preload="none" src="${pen.video}" aria-hidden="true"></video>` : '')
    : `<div class="card-placeholder"><strong>No local demo</strong><span>Written in CodePen Editor 2.0</span></div>`;

  const openButton = pen.demo
    ? `<button type="button" class="card-btn card-btn-primary" data-open="${pen.slug}">Run it here</button>`
    : '';

  return `
    <li data-category="${pen.category}">
      <article class="card" data-slug="${pen.slug}">
        <div class="card-media">${media}</div>
        <div class="card-overlay">
          <ul class="card-stats">${stats}</ul>
          <div class="card-body">
            <h3 class="card-title">${escapeHtml(pen.title)}</h3>
            <p class="card-sub">${pen.created}${pen.tags.length ? ` · ${escapeHtml(pen.tags.slice(0, 3).join(', '))}` : ''}</p>
          </div>
        </div>
        <div class="card-actions">
          ${openButton}
          <a class="card-btn" href="${pen.codepen}" target="_blank" rel="noopener">CodePen</a>
          <a class="card-btn" href="${pen.source}" target="_blank" rel="noopener">Source</a>
        </div>
      </article>
    </li>`;
}

function render() {
  const pens = visiblePens();

  // Rebuilt rather than hidden: the grid's nth-child rhythm counts every item,
  // so leaving filtered-out tiles in place would scramble the layout.
  elements.grid.innerHTML = pens.map(cardMarkup).join('');
  elements.empty.hidden = pens.length > 0;

  const quiet = state.pens.length - state.pens.filter((pen) => pen.featured).length;
  elements.count.textContent = state.includeQuiet
    ? `${pens.length} of ${state.pens.length} Pens`
    : `${pens.length} Pens with more than 2 loves · ${quiet} quieter ones hidden`;
}

// --------------------------------------------------------------------- tags

function renderTags() {
  const counts = new Map();
  for (const pen of state.pens) {
    if (!state.includeQuiet && !pen.featured) continue;
    for (const tag of pen.tags) counts.set(tag, (counts.get(tag) ?? 0) + 1);
  }

  const top = [...counts]
    .filter(([, n]) => n >= 3)
    .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
    .slice(0, 18);

  elements.tagbar.innerHTML = top
    .map(([tag, n]) =>
      `<button type="button" class="tag" data-tag="${escapeHtml(tag)}" aria-pressed="${state.tag === tag}">${escapeHtml(tag)} <span>${n}</span></button>`)
    .join('');
}

// ------------------------------------------------------------------- viewer

function openViewer(slug) {
  const pen = state.pens.find((item) => item.slug === slug);
  if (!pen?.demo) return;

  document.getElementById('viewer-title').textContent = pen.title;
  document.getElementById('viewer-path').textContent = pen.demo;
  document.getElementById('viewer-blurb').textContent = pen.blurb;
  document.getElementById('viewer-source').href = pen.source;
  document.getElementById('viewer-codepen').href = pen.codepen;
  document.getElementById('viewer-open').href = pen.demo;
  document.getElementById('viewer-tags').innerHTML = pen.tags
    .map((tag) => `<li>${escapeHtml(tag)}</li>`)
    .join('');

  elements.frame.src = pen.demo;
  elements.viewer.showModal();
}

function closeViewer() {
  elements.viewer.close();
  elements.frame.src = 'about:blank'; // stop animations and audio
}

// ------------------------------------------------------------------- events

const quietMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

elements.grid.addEventListener('pointerover', (event) => {
  if (quietMotion.matches) return;
  const card = event.target.closest('.card');
  const video = card?.querySelector('video');
  if (!video || card.classList.contains('is-playing')) return;
  card.classList.add('is-playing');
  video.play().catch(() => card.classList.remove('is-playing'));
});

elements.grid.addEventListener('pointerout', (event) => {
  const card = event.target.closest('.card');
  if (!card || card.contains(event.relatedTarget)) return;
  const video = card.querySelector('video');
  if (!video) return;
  card.classList.remove('is-playing');
  video.pause();
});

elements.grid.addEventListener('click', (event) => {
  const trigger = event.target.closest('[data-open]');
  if (trigger) {
    openViewer(trigger.dataset.open);
    return;
  }

  // Without a pointer there is no hover, so a tap has to reveal the card's
  // title and actions. One card stays open at a time.
  if (event.target.closest('a, button')) return;
  const card = event.target.closest('.card');
  if (!card) return;
  const wasActive = card.classList.contains('is-active');
  for (const other of elements.grid.querySelectorAll('.card.is-active')) {
    other.classList.remove('is-active');
  }
  card.classList.toggle('is-active', !wasActive);
});

elements.tagbar.addEventListener('click', (event) => {
  const button = event.target.closest('[data-tag]');
  if (!button) return;
  state.tag = state.tag === button.dataset.tag ? null : button.dataset.tag;
  renderTags();
  render();
});

for (const chip of document.querySelectorAll('.chip')) {
  chip.addEventListener('click', () => {
    state.category = chip.dataset.category;
    for (const other of document.querySelectorAll('.chip')) {
      other.setAttribute('aria-pressed', String(other === chip));
    }
    render();
  });
}

let searchTimer;
elements.search.addEventListener('input', () => {
  clearTimeout(searchTimer);
  searchTimer = setTimeout(() => {
    state.query = elements.search.value;
    render();
  }, 120);
});

elements.sort.addEventListener('change', () => {
  state.sort = elements.sort.value;
  render();
});

elements.showAll.addEventListener('change', () => {
  state.includeQuiet = elements.showAll.checked;
  renderTags();
  render();
});

elements.reset.addEventListener('click', () => {
  state.query = '';
  state.tag = null;
  state.category = 'all';
  elements.search.value = '';
  for (const chip of document.querySelectorAll('.chip')) {
    chip.setAttribute('aria-pressed', String(chip.dataset.category === 'all'));
  }
  renderTags();
  render();
});

// Theme: system by default, with an explicit override the browser remembers.
const themeButton = document.getElementById('theme');
const THEMES = ['system', 'light', 'dark'];

function readTheme() {
  try {
    const saved = localStorage.getItem('archive-theme');
    return THEMES.includes(saved) ? saved : 'system';
  } catch {
    return 'system';
  }
}

function applyTheme(theme) {
  if (theme === 'system') {
    delete document.documentElement.dataset.theme;
  } else {
    document.documentElement.dataset.theme = theme;
  }
  themeButton.textContent = `Theme: ${theme}`;
  try {
    localStorage.setItem('archive-theme', theme);
  } catch { /* nothing to remember it with; the choice still applies */ }
}

themeButton.addEventListener('click', () => {
  applyTheme(THEMES[(THEMES.indexOf(readTheme()) + 1) % THEMES.length]);
});

applyTheme(readTheme());

document.getElementById('viewer-close').addEventListener('click', closeViewer);
document.getElementById('viewer-reload').addEventListener('click', () => {
  // eslint-disable-next-line no-self-assign
  elements.frame.src = elements.frame.src;
});
elements.viewer.addEventListener('close', () => { elements.frame.src = 'about:blank'; });
elements.viewer.addEventListener('click', (event) => {
  if (event.target === elements.viewer) closeViewer();
});

// --------------------------------------------------------------------- boot

const data = await (await fetch('data/gallery.json')).json();
state.pens = data.pens;

const totals = data.pens.reduce((sum, pen) => sum + pen.loves, 0);
const stats = {
  total: number.format(data.total),
  archived: number.format(data.archived),
  loves: number.format(totals),
  captured: data.capturedAt.slice(0, 10),
};
for (const node of document.querySelectorAll('[data-stat]')) {
  node.textContent = stats[node.dataset.stat] ?? '—';
}

renderTags();
render();
