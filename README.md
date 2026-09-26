# Radiant: Battle Arena — Learn More site

Static HTML/CSS/JS site for the Unreal Engine 5.8 Stormlight Archive fan game. No build step, no framework — served straight from `gh-pages`.

## Tweaking the site

Every tunable value is a `const` at the top of a file:

| File | Controls |
| --- | --- |
| `GlobalSiteConfig.js` | Title, logo paths, downloads per OS, system requirements, Orders list, nav, legal text |
| `js/shell.js` | Header/nav/footer, spoiler toggle, scroll reveal |
| `js/home.js` | Home page, 3D logo loading |
| `js/order-page.js` | Order page tabs, control highlighter |
| `js/lore.js` | Lore page |
| `js/quiz.js` | Quiz length, branching sensitivity |
| `js/download.js` | OS detection and redirect |
| `js/pages.js` | Roadmap, devlog, credits |

Content lives in `data/` as JSON:

- `data/lore.json` — the Stormlight Archive primer
- `data/orders/<id>.json` — one file per Order
- `data/shared-mechanics.json` — Stormlight + Gravitation, duplicated onto every Order page
- `data/quiz.json` — 20 questions, 10 shown
- `data/roadmap.json`, `data/devlog.json`, `data/credits.json`

## Adding a new Order

1. Add `data/orders/<id>.json` (copy an existing one).
2. Copy `Windrunner/` to a new folder and change the single `THIS_ORDER` const.
3. Add the Order to `ORDERS` in `GlobalSiteConfig.js`.
4. Drop a glyph in `assets/glyphs/`.

Nav, home page cards and the shared mechanics sections update automatically.

## Assets still needed

- `assets/logo.png` — the hero logo (path set by `SITE_LOGO_PNG`)
- `assets/logo.glb` — optional 3D logo (`SITE_LOGO_GLB_ON = true` to enable)

## Local preview

```
python3 -m http.server 8000
```

## Legal

Unofficial, non-commercial fan project. Not affiliated with Brandon Sanderson or Dragonsteel Entertainment. Original site content is CC BY-SA 4.0; quoted material remains under its own terms.
