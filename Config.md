# Site configuration guide

Everything you can change on the **Learn More** site, and where to change it. No build step — edit a file, commit, and GitHub Pages redeploys.

---

## 1. Setup checklist

Work top to bottom. Items marked **required** should be done before you share the site publicly.

| # | Task | File | Status |
| --- | --- | --- | --- |
| 1 | **Required.** Set a real takedown contact | `GlobalSiteConfig.js` → `REPORT_EMAIL` | ⬜ placeholder |
| 2 | **Required.** Add the logo image | `assets/logo.png` | ⬜ missing |
| 3 | Enable GitHub Pages on `gh-pages` / root | repo Settings → Pages | ⬜ |
| 4 | Point download links at your release host | `GlobalSiteConfig.js` → `DOWNLOADS` | ⬜ |
| 5 | Reveal a platform when you ship it | `operatingSystemReleased: true` | ⬜ |
| 6 | Fill in system requirements | `SYSTEM_REQUIREMENTS` | ⬜ all TBD |
| 7 | Write the Adhesion / Division ability kits | `data/orders/*.json` | ⬜ in development |
| 8 | Add your CC-BY asset credits | `data/credits.json` | ⬜ |

---

## 2. Site base — you probably don't need to touch this

`SITE_BASE` is detected automatically. Leave `SITE_BASE_OVERRIDE = ""`.

```js
const SITE_BASE = (function () {
  if (SITE_BASE_OVERRIDE) return SITE_BASE_OVERRIDE;
  const s = document.currentScript && document.currentScript.src;
  return s ? s.replace(/GlobalSiteConfig\.js.*$/, "") : "/";
})();
```

The config script reads its own resolved URL and strips the filename, so the site root is correct from any folder depth. It works unchanged on:

- `https://jaxonhyer.github.io/Radiant-Battle-Arena/`
- a custom domain at the root
- a local `python3 -m http.server`

**Only override it** if a proxy or unusual hosting setup breaks detection. It must be an absolute URL or absolute path **with a trailing slash**:

```js
const SITE_BASE_OVERRIDE = "/";                               // custom domain at root
const SITE_BASE_OVERRIDE = "https://example.com/";            // explicit host
const SITE_BASE_OVERRIDE = "/Radiant-Battle-Arena/";          // project subpath
```

Without the trailing slash, paths concatenate into `...arenaindex.html`.

**Custom domain:** add it under Settings → Pages, commit the `CNAME` file GitHub creates, and change nothing here.

---

## 3. `GlobalSiteConfig.js`

The single file for site-wide values.

### Identity

| Const | Purpose |
| --- | --- |
| `SITE_TITLE` | Game name — used in the header, page titles, footer |
| `SITE_TAGLINE` | One-line description under the hero title |
| `SITE_ENGINE` | Engine credit in the footer and credits page |
| `SITE_LOGO_PNG` | Hero logo path. If the file is missing, the image removes itself rather than showing a broken icon |
| `SITE_LOGO_GLB` | Optional 3D logo |
| `SITE_LOGO_GLB_ON` | `true` loads the 3D logo on desktop only; PNG remains the fallback |
| `SITE_LOGO_GLB_MAXMB` | Reminder budget, not enforced. GitHub caps files at 100 MB |

### Spoilers

| Const | Purpose |
| --- | --- |
| `SITE_SPOILER_LIMIT` | Book name shown in the spoiler notice — currently `Words of Radiance` |
| `SITE_SPOILERS_ON` | Default state. `false` = blurred until the visitor opts in |

The visitor's choice is saved in `localStorage` under `rba-spoilers`. Mark any block as a spoiler by adding `"spoiler": true` to a quote in JSON, or `class="spoiler"` in HTML.

### Downloads

One block per operating system:

```js
windows: {
  label: "Windows",
  url: "https://github.com/.../releases/latest",
  downloadFromSite: true,
  operatingSystemReleased: false,
  fileNote: "Windows 64-bit installer"
}
```

| Field | Effect |
| --- | --- |
| `downloadFromSite: true` | Renders a direct `download` link — use for GitHub Releases |
| `downloadFromSite: false` | Renders "Open the download page" and explains the file is hosted elsewhere — use for Google Drive |
| `operatingSystemReleased: true` | Shows the real download page |
| `operatingSystemReleased: false` | Replaces it with an "In Development" page and a roadmap link |

### Orders

```js
const ORDERS = [
  { id: "windrunner", name: "Windrunner", folder: "Windrunner",
    glyph: "assets/glyphs/windrunner.png", accent: "#4f8cff", released: true }
];
```

`released: false` hides an Order from the nav and home page without deleting anything.

### Navigation

`NAV_LINKS` is an ordered list. The entry `{ orders: true }` expands into one link per released Order, so new Orders appear automatically.

### Legal

| Const | Purpose |
| --- | --- |
| `LEGAL_DISCLAIMER` | Unofficial fan project notice — footer of every page |
| `LEGAL_LICENSE` | Clarifies that CC BY-SA 4.0 covers your original content only, not quoted material |
| `REPORT_SHOW` | Master switch for the takedown notice |
| `REPORT_EMAIL` | **Set this.** Where reports go |
| `REPORT_GITHUB` | Issue tracker link. `""` hides the button |
| `REPORT_BODY` | The notice text |
| `REPORT_RESPONSE` | Response-time promise. `""` omits it |

---

## 4. Per-file constants

Every JS file opens with its tunables in the first ~10 lines.

| File | Notable constants |
| --- | --- |
| `js/shell.js` | `SHELL_SHOW_GLYPHS`, `SHELL_REVEAL_ON`, `SHELL_FOOTER_LINKS` |
| `js/home.js` | `HOME_SHOW_LOGO`, `HOME_GLB_MIN_WIDTH` |
| `js/order-page.js` | `ORDER_DEFAULT_TAB`, `ORDER_TAB_LABELS`, `ORDER_SHOW_SHARED` |
| `js/lore.js` | `LORE_SHOW_TOC`, `LORE_SHOW_LINKS` |
| `js/quiz.js` | `QUIZ_LENGTH`, `QUIZ_OPENERS`, `QUIZ_PROBE_LEAD`, `QUIZ_SHUFFLE` |
| `js/download.js` | `DL_AUTO_REDIRECT`, `DL_REDIRECT_DELAY`, `DL_UNKNOWN_PAGE` |
| `js/assets.js` | `ASSETS_SHOW_AI_TAG`, `ASSETS_NC_WARNING` |
| `js/pages.js` | `PAGE_DEVLOG_LIMIT`, `PAGE_DATE_STYLE` |

---

## 5. Content files (`data/`)

| File | Drives |
| --- | --- |
| `lore.json` | The Stormlight Archive primer — add a section by adding an object |
| `orders/<id>.json` | One Order: lore, quotes, facts, gameplay, abilities |
| `shared-mechanics.json` | Stormlight + Gravitation. **Rendered on every Order page**, so edit once |
| `quiz.json` | 20 questions, scoring, results |
| `assets.json` | Free downloads |
| `roadmap.json` | Milestones — `status` is `done`, `active` or `planned` |
| `devlog.json` | Hand-written entries: `date`, `commitTitle`, `version`, `branch`, `operatingSystemsUpdated[]` |
| `credits.json` | Attribution tables |

### Quotes

```json
{
  "text": "...",
  "source": "The Coppermind, \"Order of Skybreakers\"",
  "url": "https://coppermind.net/wiki/Order_of_Skybreakers",
  "spoiler": true,
  "feature": true
}
```

`feature: true` promotes the quote to the top of an Order's lore tab. `spoiler: true` blurs it.

### Free assets

```json
{
  "name": "Parshendi",
  "file": "assets/characters/Parshendi/",
  "format": "FBX",
  "preview": "",
  "usePreview": false,
  "aiGenerated": true
}
```

| Field | Effect |
| --- | --- |
| `usePreview: true` | Shows the `preview` image |
| `usePreview: false` | Shows a format badge instead — use for FBX, GLB, audio, archives |
| `file` ending in `/` | Renders "Browse files" instead of a download link |
| `aiGenerated: true` | Adds an "AI-assisted" badge |

### Quiz

Each question has a `probe`:

- `"any"` — always eligible
- `"windrunner"` / `"skybreaker"` — only offered while the player leans that way

The first `QUIZ_OPENERS` (3) questions are neutral. After that, once the score gap reaches `QUIZ_PROBE_LEAD`, the quiz pulls from the leaning pool to test that lean. `QUIZ_LENGTH` (10) questions are shown out of 20.

---

## 6. Adding a new Order

1. Add `data/orders/<id>.json` — copy an existing file.
2. Copy the `Windrunner/` folder and rename it. Change the single line:
   ```html
   <script>const THIS_ORDER = "windrunner";</script>
   ```
3. Add the Order to `ORDERS` in `GlobalSiteConfig.js`.
4. Drop a glyph in `assets/glyphs/`.

Nav, home cards, quiz glyphs and shared mechanics update automatically.

> **Glyph warning.** Do not copy the official Order symbols from `brandonsanderson.com` or the wikis. Dragonsteel's policy states that copies of their glyphs and symbols are never permitted unless integral to a character or scene. The two glyphs in this repo are original designs.

---

## 7. Content and licensing rules

These are baked into how the site is written. Worth keeping to as you add pages.

- **Coppermind text is CC BY-NC-ND 4.0.** Verbatim quotes with attribution and a link back are fine. Paraphrasing or rewriting their article prose is a derivative work and is **not** permitted. Write summaries in your own words from the underlying facts.
- **Book quotations** are short excerpts under fair use and belong to Dragonsteel. Keep them brief and always attributed.
- **Keep the site non-commercial.** Dragonsteel permits non-commercial fan work, but prohibits commercial use of AI-assisted fan art and of character/creature/symbol model files. No ads, no donations, no storefront.
- **Spoiler line:** general lore may come from any book, but characters and timeline events are only discussed up to *Words of Radiance*. Anything later gets `"spoiler": true`.

---

## 8. Local preview

```bash
python3 -m http.server 8000
```

Then open `http://localhost:8000`. Everything is static, so a plain refresh picks up any JSON or JS edit.

---

## 9. Troubleshooting

| Symptom | Cause |
| --- | --- |
| Links 404 on a subpage | `SITE_BASE_OVERRIDE` set without a trailing slash |
| Hero has no logo | `assets/logo.png` missing — the image removes itself by design |
| Order page is blank | JSON syntax error. Check the browser console and validate the file |
| Nav missing an Order | `released: false` in `ORDERS`, or the id doesn't match the JSON filename |
| Download page says "In Development" | `operatingSystemReleased: false` |
| Spoilers always visible | `SITE_SPOILERS_ON` is `true`, or `localStorage` remembers a previous choice |
| Pages not updating | GitHub Pages build takes a minute. Confirm Settings → Pages points at `gh-pages` / root |
