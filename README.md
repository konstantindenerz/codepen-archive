# CodePen Archive — Konstantin Denerz

Ein eigenständiges, **offline lauffähiges** Archiv aller öffentlichen CodePen-Demos von
[@konstantindenerz](https://codepen.io/konstantindenerz) — damit die Arbeit erhalten bleibt,
auch wenn CodePen eines Tages verschwindet.

> 🖼️ **Übersicht:** https://konstantindenerz.github.io/codepen-archive/

## Was hier drin liegt

| Pfad | Inhalt |
|---|---|
| `pens/<name>-<slug>/index.html` | Das fertig kompilierte Demo — läuft ohne Netzwerk |
| `pens/<name>-<slug>/src/` | Der Quellcode wie geschrieben (Pug / SCSS / TypeScript …) |
| `pens/<name>-<slug>/assets/` | Eingebettete Bilder, Fonts, Audio |
| `data/pens.json` | Metadaten aller Pens (Titel, Description, Tags, Stats) |
| `media/` | Thumbnails und Vorschau-Videos für die Übersicht |
| `tools/` | Die Archivierungs-Pipeline (wiederholbar, gedrosselt) |

## Lizenz

Code: MIT (siehe `LICENSE`). Jeder Pen trägt seine CodePen-Lizenzangabe in `pen.json`.
