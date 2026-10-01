# CodePen Archive — Konstantin Denerz

A standalone, **offline-capable** archive of every public Pen by
[@konstantindenerz](https://codepen.io/konstantindenerz) — so the work survives
whether or not CodePen does.

> 🖼️ **Browse the gallery:** https://konstantindenerz.github.io/codepen-archive/

Each Pen keeps its authored source, its uploaded assets, and a compiled copy
that opens straight from disk. No build step, no network, no CodePen.

## What is in here

| Path | Contents |
|---|---|
| `pens/<name>-<slug>/index.html` | The compiled demo. Open it in a browser; it needs nothing else. |
| `pens/<name>-<slug>/src/` | The source as written — Pug, SCSS, TypeScript, whatever the Pen used. |
| `pens/<name>-<slug>/pen.json` | Title, description, tags, counts, preprocessors, licence. |
| `assets/vendor/` | Every file the demos used to load from the internet, copied here. |
| `data/pens.json` | The full record for all 106 Pens. |
| `data/codepen-raw.json` | CodePen's API response, kept verbatim as a fidelity backup. |
| `media/` | Thumbnails and preview videos for the gallery. |
| `tools/` | The archiving pipeline — re-runnable, rate-limited, resumable. |
| `reports/` | Verification results and anything that could not be vendored. |

Sizes: demos and sources 5.4 MB, vendored assets 20.2 MB,
gallery media 80.0 MB.

## State of the archive

- **106** public Pens recorded, **102** with a demo that runs offline.
- **96** have more than 2 loves — the gallery's default view.
- Every archived demo was rendered with all external hosts unresolvable and
  checked for broken local references. See [reports/verify.md](reports/verify.md).
- Four Pens written in CodePen's **Editor 2.0** store their files outside the
  classic API and have no full-page view, so they are catalogued with metadata
  and a link out, but have no local copy.
- One reference could not be vendored; see [reports/unvendored.md](reports/unvendored.md).

Love, view and comment counts are a snapshot from **2026-10-01** and do not update.

## Publishing

The repository *is* the site — there is nothing to build, so GitHub Pages
serves it straight from the branch:

**Settings → Pages → Source: Deploy from a branch → `main` / `(root)`**

Serving from the root matters: the gallery's viewer loads each demo from
`pens/<dir>/`, the same path it has in the repository. `.nojekyll` keeps Pages
from running the files through Jekyll.

## Re-running the pipeline

```sh
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
```

Every step is throttled, skips what it already has, and can be re-run safely.
CodePen is behind Cloudflare, so two steps need a real browser; both are
documented where they are used.

## Licence

The pipeline and the gallery are MIT (see [LICENSE](LICENSE)). Each Pen carries
its own CodePen licence in its `pen.json`; all 106 are MIT.

## The Pens

96 Pens with more than 2 loves, then the rest. Sorted by loves.

| Pen | Loves | Views | Tags | Demo | Original |
|---|---:|---:|---|---|---|
| [Hexagon Grid - Ripple  Effect](pens/hexagon-grid-ripple-effect-poYVOpv/) | 2,348 | 50,672 | css, ripple, hexagon, honeycomb | [open](pens/hexagon-grid-ripple-effect-poYVOpv/index.html) | [CodePen](https://codepen.io/konstantindenerz/pen/poYVOpv) |
| [Cosmic Dreams ✨ (CSS)](pens/cosmic-dreams-css-vYMPZKz/) | 806 | 19,506 | css, cosmic, space, ambient | [open](pens/cosmic-dreams-css-vYMPZKz/index.html) | [CodePen](https://codepen.io/konstantindenerz/pen/vYMPZKz) |
| [CSS View Transition - Enterprise (NCC 1701)](pens/css-view-transition-enterprise-ncc-1701-abaXabq/) | 683 | 26,545 | css, viewtransition, animation, pagetransition | [open](pens/css-view-transition-enterprise-ncc-1701-abaXabq/index.html) | [CodePen](https://codepen.io/konstantindenerz/pen/abaXabq) |
| [A Motion Blurred Number with CSS / SVG / JS](pens/a-motion-blurred-number-with-css-svg-js-zYJzvEQ/) | 618 | 18,838 | motionblur, blur, svg, css | [open](pens/a-motion-blurred-number-with-css-svg-js-zYJzvEQ/index.html) | [CodePen](https://codepen.io/konstantindenerz/pen/zYJzvEQ) |
| [Animated Retrowave 👾  (CSS)](pens/animated-retrowave-css-WNgEqbG/) | 318 | 8,648 | retro, synthwave, css, animation | [open](pens/animated-retrowave-css-WNgEqbG/index.html) | [CodePen](https://codepen.io/konstantindenerz/pen/WNgEqbG) |
| [3D Glass Switch (Pure CSS, Neumorphic, Animation)](pens/3d-glass-switch-pure-css-neumorphic-animation-KKxeWKj/) | 315 | 15,891 | css, switch, animation, neumorphic | [open](pens/3d-glass-switch-pure-css-neumorphic-animation-KKxeWKj/index.html) | [CodePen](https://codepen.io/konstantindenerz/pen/KKxeWKj) |
| ["Hack The Gibson" (CSS)](pens/hack-the-gibson-css-poYmNxw/) | 303 | 13,819 | css, 3d, hackers, animation | [open](pens/hack-the-gibson-css-poYmNxw/index.html) | [CodePen](https://codepen.io/konstantindenerz/pen/poYmNxw) |
| [Ai Interaction Visualizer (AIIV) ✨ (CSS)](pens/ai-interaction-visualizer-aiiv-css-MYWJRoo/) | 301 | 8,460 |  | [open](pens/ai-interaction-visualizer-aiiv-css-MYWJRoo/index.html) | [CodePen](https://codepen.io/konstantindenerz/pen/MYWJRoo) |
| [Video To ASCII Art](pens/video-to-ascii-art-YzgRQZj/) | 291 | 9,234 | ascii, video, canvas, synthwave | [open](pens/video-to-ascii-art-YzgRQZj/index.html) | [CodePen](https://codepen.io/konstantindenerz/pen/YzgRQZj) |
| [Synthwave Rain ✨ (CSS)](pens/synthwave-rain-css-zYbpNmz/) | 283 | 5,336 | css, art, synthwave, generative | [open](pens/synthwave-rain-css-zYbpNmz/index.html) | [CodePen](https://codepen.io/konstantindenerz/pen/zYbpNmz) |
| [Holo Card  {CSS, Animation}](pens/holo-card-css-animation-XWPpvpg/) | 276 | 7,677 | holo, card, css, animation | [open](pens/holo-card-css-animation-XWPpvpg/index.html) | [CodePen](https://codepen.io/konstantindenerz/pen/XWPpvpg) |
| [Arcade Button 👾🕹️ (Pure CSS, Animated)](pens/arcade-button-pure-css-animated-dyrzjPq/) | 247 | 11,904 | css, arcade, game, button | [open](pens/arcade-button-pure-css-animated-dyrzjPq/index.html) | [CodePen](https://codepen.io/konstantindenerz/pen/dyrzjPq) |
| [Eletric Spinner ⚡️ (CSS, SVG:Gooey)](pens/eletric-spinner-css-svg-gooey-XWQWYVW/) | 230 | 8,061 | css, gooey, spinner, loading | [open](pens/eletric-spinner-css-svg-gooey-XWQWYVW/index.html) | [CodePen](https://codepen.io/konstantindenerz/pen/XWQWYVW) |
| [☯︎  (CSS & SVG)](pens/css-svg-bNGQpqJ/) | 223 | 7,212 |  | [open](pens/css-svg-bNGQpqJ/index.html) | [CodePen](https://codepen.io/konstantindenerz/pen/bNGQpqJ) |
| [Neumorphic Liquid Slider (CSS, Animation)](pens/neumorphic-liquid-slider-css-animation-qBMvXNK/) | 222 | 8,726 | css, animation, liquid, svg | [open](pens/neumorphic-liquid-slider-css-animation-qBMvXNK/index.html) | [CodePen](https://codepen.io/konstantindenerz/pen/qBMvXNK) |
| [Glassmorphic Rhombohedron (CSS)](pens/glassmorphic-rhombohedron-css-VwoEJqP/) | 215 | 8,956 |  | [open](pens/glassmorphic-rhombohedron-css-VwoEJqP/index.html) | [CodePen](https://codepen.io/konstantindenerz/pen/VwoEJqP) |
| [Bookmark (CSS)](pens/bookmark-css-GgRxXdg/) | 215 | 4,128 | bookmark, component, designsystem, animation | [open](pens/bookmark-css-GgRxXdg/index.html) | [CodePen](https://codepen.io/konstantindenerz/pen/GgRxXdg) |
| [Gooey Stars (CSS & SVG)](pens/gooey-stars-css-svg-emYKEgd/) | 211 | 5,792 |  | [open](pens/gooey-stars-css-svg-emYKEgd/index.html) | [CodePen](https://codepen.io/konstantindenerz/pen/emYKEgd) |
| [Scratched Folder (CSS, SVG)](pens/scratched-folder-css-svg-zYXONxz/) | 193 | 5,461 | css, folder, scratches, skeuomorphic | [open](pens/scratched-folder-css-svg-zYXONxz/index.html) | [CodePen](https://codepen.io/konstantindenerz/pen/zYXONxz) |
| [CSS - 3D - Sphere - Cubes - Intersection (No JS)](pens/css-3d-sphere-cubes-intersection-no-js-xxyZJpO/) | 193 | 5,095 | css, animation, 3d, mask | [open](pens/css-3d-sphere-cubes-intersection-no-js-xxyZJpO/index.html) | [CodePen](https://codepen.io/konstantindenerz/pen/xxyZJpO) |
| [Flux Capacitor (Animation, CSS) \| ⚡️ 1.21 GIGAWATTS! ⚡️](pens/flux-capacitor-animation-css-1-21-gigawatts-yLxpjYz/) | 174 | 15,281 | css, animation, realistic, fluxcapacitor | [open](pens/flux-capacitor-animation-css-1-21-gigawatts-yLxpjYz/index.html) | [CodePen](https://codepen.io/konstantindenerz/pen/yLxpjYz) |
| [Glassmorphic Cube (CSS)](pens/glassmorphic-cube-css-NWZRYXK/) | 162 | 9,185 |  | [open](pens/glassmorphic-cube-css-NWZRYXK/index.html) | [CodePen](https://codepen.io/konstantindenerz/pen/NWZRYXK) |
| [Gooey  Ring (CSS & SVG)](pens/gooey-ring-css-svg-gbOKRQz/) | 147 | 6,376 |  | [open](pens/gooey-ring-css-svg-gbOKRQz/index.html) | [CodePen](https://codepen.io/konstantindenerz/pen/gbOKRQz) |
| [Designer's Eye 👁️ (CSS, SVG:Gooey)](pens/designer-s-eye-css-svg-gooey-bGZXmRZ/) | 141 | 5,461 | css, gooey, design, cssart | [open](pens/designer-s-eye-css-svg-gooey-bGZXmRZ/index.html) | [CodePen](https://codepen.io/konstantindenerz/pen/bGZXmRZ) |
| [Speed Indicator (CSS)](pens/speed-indicator-css-qBwpLZW/) | 136 | 6,529 | css, indicator, speed, webdev | [open](pens/speed-indicator-css-qBwpLZW/index.html) | [CodePen](https://codepen.io/konstantindenerz/pen/qBwpLZW) |
| [DNA Strand 🧬 (CSS, SVG:Gooey)](pens/dna-strand-css-svg-gooey-ExJZPZO/) | 129 | 4,194 | css, dna, svg, synthwave | [open](pens/dna-strand-css-svg-gooey-ExJZPZO/index.html) | [CodePen](https://codepen.io/konstantindenerz/pen/ExJZPZO) |
| [Isometric Cubes 🧊 (CSS, Animation)](pens/isometric-cubes-css-animation-xbKyjzM/) | 117 | 4,592 | cssgenuary | [open](pens/isometric-cubes-css-animation-xbKyjzM/index.html) | [CodePen](https://codepen.io/konstantindenerz/pen/xbKyjzM) |
| [Boo! 👻 (CSS, SVG)](pens/boo-css-svg-dyxONQb/) | 103 | 6,575 | css, halloween, boo, ghost | [open](pens/boo-css-svg-dyxONQb/index.html) | [CodePen](https://codepen.io/konstantindenerz/pen/dyxONQb) |
| [Wave (CSS)](pens/wave-css-bNNGLXN/) | 96 | 2,488 |  | [open](pens/wave-css-bNNGLXN/index.html) | [CodePen](https://codepen.io/konstantindenerz/pen/bNNGLXN) |
| [Animated Logo & Glitch Effect & Retro Look (CSS)](pens/animated-logo-glitch-effect-retro-look-css-mdGpxKg/) | 92 | 6,135 | css, animation, logo, retrowave | [open](pens/animated-logo-glitch-effect-retro-look-css-mdGpxKg/index.html) | [CodePen](https://codepen.io/konstantindenerz/pen/mdGpxKg) |
| [May the Force be with YOU](pens/may-the-force-be-with-you-oNaGOpE/) | 91 | 1,658 | css, starwars, cpc-toggles, codepenchallenge | [open](pens/may-the-force-be-with-you-oNaGOpE/index.html) | [CodePen](https://codepen.io/konstantindenerz/pen/oNaGOpE) |
| [CSS Pyramid Diamond ♦️ - Explosion](pens/css-pyramid-diamond-explosion-VwEVRXa/) | 89 | 6,488 | css, animation, generativeart, gm | [open](pens/css-pyramid-diamond-explosion-VwEVRXa/index.html) | [CodePen](https://codepen.io/konstantindenerz/pen/VwEVRXa) |
| [Fractal tree 🌳 (CSS)](pens/fractal-tree-css-rNgNBKY/) | 88 | 4,771 | css, fractaltree, animation, math | [open](pens/fractal-tree-css-rNgNBKY/index.html) | [CodePen](https://codepen.io/konstantindenerz/pen/rNgNBKY) |
| [Spinner (indeterminate)](pens/spinner-indeterminate-JoPQzqx/) | 84 | 1,485 |  | [open](pens/spinner-indeterminate-JoPQzqx/index.html) | [CodePen](https://codepen.io/konstantindenerz/pen/JoPQzqx) |
| [1000 🎉](pens/1000-rNXjraj/) | 80 | 2,047 |  | [open](pens/1000-rNXjraj/index.html) | [CodePen](https://codepen.io/konstantindenerz/pen/rNXjraj) |
| [🖖 Night Flight ((S)CSS)](pens/night-flight-s-css-dPPvqPB/) | 76 | 5,626 | css, voxel, art, startrek | [open](pens/night-flight-s-css-dPPvqPB/index.html) | [CodePen](https://codepen.io/konstantindenerz/pen/dPPvqPB) |
| [Loader / Spinner (Animation , CSS)](pens/loader-spinner-animation-css-jOvxaBX/) | 75 | 2,027 | animation, spinner, loader, webdev | [open](pens/loader-spinner-animation-css-jOvxaBX/index.html) | [CodePen](https://codepen.io/konstantindenerz/pen/jOvxaBX) |
| [(Scrolling) Split Keyboard Layer Visualization](pens/scrolling-split-keyboard-layer-visualization-poMJXQj/) | 72 | 3,767 | css, scrollanimation, snapping, splitkeyboard | [open](pens/scrolling-split-keyboard-layer-visualization-poMJXQj/index.html) | [CodePen](https://codepen.io/konstantindenerz/pen/poMJXQj) |
| [Material - FAB  (Expanding Button, CSS, Material Design System)](pens/material-fab-expanding-button-css-material-design-system-rNZqaQa/) | 69 | 3,469 | cpc-expanding-buttons, codepenchallenge, css, material | [open](pens/material-fab-expanding-button-css-material-design-system-rNZqaQa/index.html) | [CodePen](https://codepen.io/konstantindenerz/pen/rNZqaQa) |
| [3D Reflective Card (CSS, Animation, Mirrored)](pens/3d-reflective-card-css-animation-mirrored-NWLbagY/) | 66 | 2,742 | css, animation, reflective, card | [open](pens/3d-reflective-card-css-animation-mirrored-NWLbagY/index.html) | [CodePen](https://codepen.io/konstantindenerz/pen/NWLbagY) |
| [Medical FUI (Glassmorphic, CSS)](pens/medical-fui-glassmorphic-css-XWQamEW/) | 66 | 2,268 | css, glassmorphic, fui, medical | [open](pens/medical-fui-glassmorphic-css-XWQamEW/index.html) | [CodePen](https://codepen.io/konstantindenerz/pen/XWQamEW) |
| [Git Graph - Wallpaper Generator 🌈](pens/git-graph-wallpaper-generator-MWqvmPm/) | 63 | 4,446 | git, js, fun, rainbow | [open](pens/git-graph-wallpaper-generator-MWqvmPm/index.html) | [CodePen](https://codepen.io/konstantindenerz/pen/MWqvmPm) |
| [C64 ✨ (CSS, Animation)](pens/c64-css-animation-ExJQZyo/) | 61 | 6,693 | css, c64, commodore, logo | [open](pens/c64-css-animation-ExJQZyo/index.html) | [CodePen](https://codepen.io/konstantindenerz/pen/ExJQZyo) |
| [Dynamic Color Palettes (oklch, SCSS)](pens/dynamic-color-palettes-oklch-scss-ogXrgJw/) | 56 | 2,120 | css, oklch, oklab, material | [open](pens/dynamic-color-palettes-oklch-scss-ogXrgJw/index.html) | [CodePen](https://codepen.io/konstantindenerz/pen/ogXrgJw) |
| [Scroll Indicator (CSS)](pens/scroll-indicator-css-dPyzqaZ/) | 54 | 2,078 | css, scrollindicator, animation, designsystem | [open](pens/scroll-indicator-css-dPyzqaZ/index.html) | [CodePen](https://codepen.io/konstantindenerz/pen/dPyzqaZ) |
| [CSS ✨ Flow](pens/css-flow-JjgRYQo/) | 54 | 1,357 | css, figma, animation, rainbow | [open](pens/css-flow-JjgRYQo/index.html) | [CodePen](https://codepen.io/konstantindenerz/pen/JjgRYQo) |
| [Animated XYZ  (Art, CSS, Conic Gradients ♡)](pens/animated-xyz-art-css-conic-gradients-abaaWEE/) | 48 | 2,127 | css, conicgradient, art, xyz | [open](pens/animated-xyz-art-css-conic-gradients-abaaWEE/index.html) | [CodePen](https://codepen.io/konstantindenerz/pen/abaaWEE) |
| [3D Text (CSS)](pens/3d-text-css-poBPMWE/) | 47 | 4,728 | filter, css, svg, space | [open](pens/3d-text-css-poBPMWE/index.html) | [CodePen](https://codepen.io/konstantindenerz/pen/poBPMWE) |
| [◈ ✨ (CSS)](pens/css-bNGRjjv/) | 46 | 1,106 |  | [open](pens/css-bNGRjjv/index.html) | [CodePen](https://codepen.io/konstantindenerz/pen/bNGRjjv) |
| [Blinky, Clyde, Inky & Pinky](pens/blinky-clyde-inky-pinky-XWGVoWg/) | 45 | 1,706 | css, arcade, pacman, game | [open](pens/blinky-clyde-inky-pinky-XWGVoWg/index.html) | [CodePen](https://codepen.io/konstantindenerz/pen/XWGVoWg) |
| [Random Walk ⚡️ (JS)](pens/random-walk-js-KKOYdpp/) | 39 | 1,765 |  | [open](pens/random-walk-js-KKOYdpp/index.html) | [CodePen](https://codepen.io/konstantindenerz/pen/KKOYdpp) |
| [Gooey Clock (CSS & SVG)](pens/gooey-clock-css-svg-dPyQPqN/) | 38 | 1,174 | gooey, clock, animation, css | [open](pens/gooey-clock-css-svg-dPyQPqN/index.html) | [CodePen](https://codepen.io/konstantindenerz/pen/dPyQPqN) |
| [Random Walk #2 (JS)](pens/random-walk-2-js-ExqzZpw/) | 36 | 1,428 |  | [open](pens/random-walk-2-js-ExqzZpw/index.html) | [CodePen](https://codepen.io/konstantindenerz/pen/ExqzZpw) |
| [Gradient Animation with CSS's @property (Houdini 🧙‍♂️)](pens/gradient-animation-with-css-s-property-houdini-QWVoVrG/) | 33 | 7,590 | animation, circle, gradient, property | [open](pens/gradient-animation-with-css-s-property-houdini-QWVoVrG/index.html) | [CodePen](https://codepen.io/konstantindenerz/pen/QWVoVrG) |
| [300 🎉](pens/300-PogEpWK/) | 33 | 1,674 | 300, css, gm, awesome | [open](pens/300-PogEpWK/index.html) | [CodePen](https://codepen.io/konstantindenerz/pen/PogEpWK) |
| [Star Rain ✨ (CSS / SVG)](pens/star-rain-css-svg-YzgjYmY/) | 29 | 1,050 | css, synthwave, digitalrain, svg | [open](pens/star-rain-css-svg-YzgjYmY/index.html) | [CodePen](https://codepen.io/konstantindenerz/pen/YzgjYmY) |
| [Random Xmas Walk 🎄](pens/random-xmas-walk-VYZbBjR/) | 29 | 1,001 |  | [open](pens/random-xmas-walk-VYZbBjR/index.html) | [CodePen](https://codepen.io/konstantindenerz/pen/VYZbBjR) |
| [404 (CSS)](pens/404-css-mdgEjqe/) | 28 | 949 |  | [open](pens/404-css-mdgEjqe/index.html) | [CodePen](https://codepen.io/konstantindenerz/pen/mdgEjqe) |
| [Eletric Wave (SVG)](pens/eletric-wave-svg-eYLyqNe/) | 27 | 1,661 | tesla, electric, wave, css | [open](pens/eletric-wave-svg-eYLyqNe/index.html) | [CodePen](https://codepen.io/konstantindenerz/pen/eYLyqNe) |
| [Blob Switch](pens/blob-switch-GReBKQa/) | 27 | 1,453 | css, switch, blob, animation | [open](pens/blob-switch-GReBKQa/index.html) | [CodePen](https://codepen.io/konstantindenerz/pen/GReBKQa) |
| [The Dark Side of Notifications (CSS)](pens/the-dark-side-of-notifications-css-QWPyXwO/) | 26 | 1,649 | codepenchallenge, cpc-notification-icons, vader, darkside | [open](pens/the-dark-side-of-notifications-css-QWPyXwO/index.html) | [CodePen](https://codepen.io/konstantindenerz/pen/QWPyXwO) |
| [Klingon Rain \| Qapla'](pens/klingon-rain-qapla-YzOpJLN/) | 25 | 1,042 | klingon, qapla, rain, matrix | [open](pens/klingon-rain-qapla-YzOpJLN/index.html) | [CodePen](https://codepen.io/konstantindenerz/pen/YzOpJLN) |
| [Vortex 🌀 (CSS)](pens/vortex-css-vYMxmyX/) | 22 | 1,378 | css, art, vortex, gm | [open](pens/vortex-css-vYMxmyX/index.html) | [CodePen](https://codepen.io/konstantindenerz/pen/vYMxmyX) |
| [Dance (CSS, Abstract, ⦿&o)](pens/dance-css-abstract-o-VwoKEdE/) | 22 | 950 | creativecoding, css, animation, abstract | [open](pens/dance-css-abstract-o-VwoKEdE/index.html) | [CodePen](https://codepen.io/konstantindenerz/pen/VwoKEdE) |
| [C64 Logo (CSS Shape())](pens/c64-logo-css-shape-WbxrOJY/) | 20 | 1,666 | c64, css, c64u, commodore | [open](pens/c64-logo-css-shape-WbxrOJY/index.html) | [CodePen](https://codepen.io/konstantindenerz/pen/WbxrOJY) |
| [Abstract Sphere (CSS)](pens/abstract-sphere-css-PoygNJB/) | 20 | 969 | css, animation, experiments, gm | [open](pens/abstract-sphere-css-PoygNJB/index.html) | [CodePen](https://codepen.io/konstantindenerz/pen/PoygNJB) |
| [Pixel Cherry 🍒 (SCSS)](pens/pixel-cherry-scss-JjzMzmr/) | 20 | 934 | pixelart, css, pacman, cherry | [open](pens/pixel-cherry-scss-JjzMzmr/index.html) | [CodePen](https://codepen.io/konstantindenerz/pen/JjzMzmr) |
| [Pyramid](pens/pyramid-XWxyVxp/) | 19 | 870 | css, animation, generativeart, gm | [open](pens/pyramid-XWxyVxp/index.html) | [CodePen](https://codepen.io/konstantindenerz/pen/XWxyVxp) |
| [backdrop-filter: blur() (animated)](pens/backdrop-filter-blur-animated-oNNaEVp/) | 18 | 7,073 | backdrop, filter, blur, css | [open](pens/backdrop-filter-blur-animated-oNNaEVp/index.html) | [CodePen](https://codepen.io/konstantindenerz/pen/oNNaEVp) |
| [NANO HEXAGON 🕹️ (Game, JS)](pens/nano-hexagon-game-js-GgRqGgQ/) | 18 | 896 | game, js, hexagon, c64 | [open](pens/nano-hexagon-game-js-GgRqGgQ/index.html) | [CodePen](https://codepen.io/konstantindenerz/pen/GgRqGgQ) |
| [Angular vNext 🎉🥳](pens/angular-vnext-rNqMRQo/) | 16 | 2,049 | css, animation, angular, cpc-fireworks | [open](pens/angular-vnext-rNqMRQo/index.html) | [CodePen](https://codepen.io/konstantindenerz/pen/rNqMRQo) |
| [dna.0.0.0-alpha.2 (no JS) 🧬](pens/dna-0-0-0-alpha-2-no-js-GRBaMee/) | 16 | 914 | dna, strand, animation, css | [open](pens/dna-0-0-0-alpha-2-no-js-GRBaMee/index.html) | [CodePen](https://codepen.io/konstantindenerz/pen/GRBaMee) |
| [🔥 (CSS)](pens/css-WNVPrdg/) | 15 | 863 |  | [open](pens/css-WNVPrdg/index.html) | [CodePen](https://codepen.io/konstantindenerz/pen/WNVPrdg) |
| [3D Text (CSS)](pens/3d-text-css-wvOZaeW/) | 15 | 727 | css, 3d, text, crown | [open](pens/3d-text-css-wvOZaeW/index.html) | [CodePen](https://codepen.io/konstantindenerz/pen/wvOZaeW) |
| [AI Bot Credits Usage Animation](pens/ai-bot-credits-usage-animation-xbGvoRW/) | 14 | 985 |  | [open](pens/ai-bot-credits-usage-animation-xbGvoRW/index.html) | [CodePen](https://codepen.io/konstantindenerz/pen/xbGvoRW) |
| [🌴](pens/mdgQqzr/) | 14 | 827 |  | [open](pens/mdgQqzr/index.html) | [CodePen](https://codepen.io/konstantindenerz/pen/mdgQqzr) |
| [Loading Table with Placeholdern Animation](pens/loading-table-with-placeholdern-animation-NWpePPm/) | 14 | 488 | loader, spinner, skeleton, contentplaceholder | [open](pens/loading-table-with-placeholdern-animation-NWpePPm/index.html) | [CodePen](https://codepen.io/konstantindenerz/pen/NWpePPm) |
| [Animated Organic Rings Art 🦋 - PURE CSS ✨](pens/animated-organic-rings-art-pure-css-jOeKXmB/) | 13 | 1,660 | art, gm, generativeart, animation | [open](pens/animated-organic-rings-art-pure-css-jOeKXmB/index.html) | [CodePen](https://codepen.io/konstantindenerz/pen/jOeKXmB) |
| [Shadow Dom with Blinky 🎃](pens/shadow-dom-with-blinky-MWNrGzg/) | 13 | 839 |  | [open](pens/shadow-dom-with-blinky-MWNrGzg/index.html) | [CodePen](https://codepen.io/konstantindenerz/pen/MWNrGzg) |
| [Keycap (CSS)](pens/keycap-css-ZYErNRd/) | 13 | 823 |  | [open](pens/keycap-css-ZYErNRd/index.html) | [CodePen](https://codepen.io/konstantindenerz/pen/ZYErNRd) |
| [Animated, Masked Text with Stray Light](pens/animated-masked-text-with-stray-light-yLojxBR/) | 13 | 280 |  | [open](pens/animated-masked-text-with-stray-light-yLojxBR/index.html) | [CodePen](https://codepen.io/konstantindenerz/pen/yLojxBR) |
| [Button with animated State](pens/button-with-animated-state-KKeNjzz/) | 12 | 556 |  | [open](pens/button-with-animated-state-KKeNjzz/index.html) | [CodePen](https://codepen.io/konstantindenerz/pen/KKeNjzz) |
| [[Talk - Fork] - Abstract Sphere (CSS)](pens/talk-fork-abstract-sphere-css-RwqRNJN/) | 12 | 163 | css, animation, experiments, gm | [open](pens/talk-fork-abstract-sphere-css-RwqRNJN/index.html) | [CodePen](https://codepen.io/konstantindenerz/pen/RwqRNJN) |
| [Random Walk (SCSS, Abstract, Art)](pens/random-walk-scss-abstract-art-BaXbrQB/) | 12 | 156 |  | [open](pens/random-walk-scss-abstract-art-BaXbrQB/index.html) | [CodePen](https://codepen.io/konstantindenerz/pen/BaXbrQB) |
| [Gooey Approve Button (With Cancel)](pens/gooey-approve-button-with-cancel-ExqYGKJ/) | 11 | 452 | css, ux, button, gooey | [open](pens/gooey-approve-button-with-cancel-ExqYGKJ/index.html) | [CodePen](https://codepen.io/konstantindenerz/pen/ExqYGKJ) |
| [Random Xmas Walk 🎄 #2](pens/random-xmas-walk-2-ogvWMwV/) | 11 | 157 |  | [open](pens/random-xmas-walk-2-ogvWMwV/index.html) | [CodePen](https://codepen.io/konstantindenerz/pen/ogvWMwV) |
| [Retro Wave DeLorean](pens/retro-wave-delorean-xxaXjZv/) | 10 | 416 | css, animation, delorean, synthwave | [open](pens/retro-wave-delorean-xxaXjZv/index.html) | [CodePen](https://codepen.io/konstantindenerz/pen/xxaXjZv) |
| [Signal (CSS)](pens/signal-css-vEEYjyK/) | 10 | 498 |  | [open](pens/signal-css-vEEYjyK/index.html) | [CodePen](https://codepen.io/konstantindenerz/pen/vEEYjyK) |
| [Tabs with Rounded Corners](pens/tabs-with-rounded-corners-gOEdazP/) | 8 | 2,125 | css, tab, tabs, maskimage | [open](pens/tabs-with-rounded-corners-gOEdazP/index.html) | [CodePen](https://codepen.io/konstantindenerz/pen/gOEdazP) |
| [Animate Angle and Color of Linear Gradient  with Custom Property](pens/animate-angle-and-color-of-linear-gradient-with-custom-prope-VwGPaRP/) | 8 | 145 | css, property, lineargradient | [open](pens/animate-angle-and-color-of-linear-gradient-with-custom-prope-VwGPaRP/index.html) | [CodePen](https://codepen.io/konstantindenerz/pen/VwGPaRP) |
| [☠️ ✨](pens/QWeprQq/) | 7 | 204 | css | [open](pens/QWeprQq/index.html) | [CodePen](https://codepen.io/konstantindenerz/pen/QWeprQq) |
| [Blue Sky](pens/blue-sky-abRJEKr/) | 6 | 90 |  | [open](pens/blue-sky-abRJEKr/index.html) | [CodePen](https://codepen.io/konstantindenerz/pen/abRJEKr) |
| [dna.0.0.0-alpha.2 🧬 (CSS)](pens/dna-0-0-0-alpha-2-css-xxJNRLr/) | 6 | 80 |  | [open](pens/dna-0-0-0-alpha-2-css-xxJNRLr/index.html) | [CodePen](https://codepen.io/konstantindenerz/pen/xxJNRLr) |
| [Pacman 🕹️  {CSS, Animation}](pens/pacman-css-animation-ExpGzZp/) | 5 | 299 | pacman, game, animation, css | [open](pens/pacman-css-animation-ExpGzZp/index.html) | [CodePen](https://codepen.io/konstantindenerz/pen/ExpGzZp) |
| [🕊️](pens/qEBrwpY/) | 3 | 112 |  | [open](pens/qEBrwpY/index.html) | [CodePen](https://codepen.io/konstantindenerz/pen/qEBrwpY) |
| [Additional Card Focus Marker #2](pens/additional-card-focus-marker-2-YPzwYJe/) | 3 | 97 |  | [open](pens/additional-card-focus-marker-2-YPzwYJe/index.html) | [CodePen](https://codepen.io/konstantindenerz/pen/YPzwYJe) |
| [⚠️ Follow Me Template 🛑](pens/follow-me-template-KKxvdPq/) | 2 | 219 |  | [open](pens/follow-me-template-KKxvdPq/index.html) | [CodePen](https://codepen.io/konstantindenerz/pen/KKxvdPq) |
| [Scroll Indicator (Top / Bottom) CSS](pens/scroll-indicator-top-bottom-css-LEVjJrp/) | 2 | 181 | csstimeline, animation, scroll | [open](pens/scroll-indicator-top-bottom-css-LEVjJrp/index.html) | [CodePen](https://codepen.io/konstantindenerz/pen/LEVjJrp) |
| [Palm](pens/palm-YzOrWjz/) | 1 | 241 | palm, css, fun, synthwave | [open](pens/palm-YzOrWjz/index.html) | [CodePen](https://codepen.io/konstantindenerz/pen/YzOrWjz) |
| [For Rebase Heros 😅 - Git Graph - Wallpaper Generator 🌈](pens/for-rebase-heros-git-graph-wallpaper-generator-qBJNgZo/) | 1 | 230 | git, js, fun, rainbow | [open](pens/for-rebase-heros-git-graph-wallpaper-generator-qBJNgZo/index.html) | [CodePen](https://codepen.io/konstantindenerz/pen/qBJNgZo) |
| [C64 Logo (CSS Shape() ) {Editor 2.0}](pens/c64-logo-css-shape-editor-2-0-019b8567/) | 1 | 111 |  | — | [CodePen](https://codepen.io/editor/konstantindenerz/pen/019b8567-3da5-712c-bf47-00c1bbbca05d) |
| [FORK 3D Text (CSS)](pens/fork-3d-text-css-ZYpmJVr/) | 1 | 24 | filter, css, svg, space | [open](pens/fork-3d-text-css-ZYpmJVr/index.html) | [CodePen](https://codepen.io/konstantindenerz/pen/ZYpmJVr) |
| [Additional Card Focus Marker](pens/additional-card-focus-marker-JojYEZY/) | 0 | 77 |  | [open](pens/additional-card-focus-marker-JojYEZY/index.html) | [CodePen](https://codepen.io/konstantindenerz/pen/JojYEZY) |
| [Google Material Readonly Field](pens/google-material-readonly-field-019a8119/) | 0 | 35 |  | — | [CodePen](https://codepen.io/editor/konstantindenerz/pen/019a8119-2c1f-7684-831a-c6f06985c6e3) |
| [enterkeyhint Demo](pens/enterkeyhint-demo-0199de31/) | 0 | 31 |  | — | [CodePen](https://codepen.io/editor/konstantindenerz/pen/0199de31-74db-7ff4-be46-510b07d23503) |
| [Dynamic Color Palettes (oklch, SCSS)](pens/dynamic-color-palettes-oklch-scss-0197cf13/) | 0 | 17 |  | — | [CodePen](https://codepen.io/editor/konstantindenerz/pen/0197cf13-779b-7fb1-8e66-b3ab8ea7e498) |
