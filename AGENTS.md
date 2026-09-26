# AGENTS.md — project handoff & working agreement

**Read this file completely before doing anything in this repo.**

This is the full context for the *Radiant: Battle Arena* "Learn More" website. It exists because coding sessions are ephemeral: when a pull request is merged or closed, the session ends and its conversation is gone. Everything the developer decided, every constraint discovered, and every open question is written down here so the next agent starts informed rather than guessing.

If you change a decision recorded here, **update this file in the same commit.**

---

## Table of contents

1. [Project identity](#1-project-identity)
2. [Who you're working with](#2-who-youre-working-with)
3. [Repository layout](#3-repository-layout)
4. [Architecture and conventions](#4-architecture-and-conventions)
5. [Locked design decisions](#5-locked-design-decisions)
6. [The game itself](#6-the-game-itself-as-specified-so-far)
7. [Legal and licensing — read carefully](#7-legal-and-licensing--read-carefully)
8. [The approved quote sheet](#8-the-approved-quote-sheet)
9. [Content rules](#9-content-rules)
10. [Open items and known gaps](#10-open-items-and-known-gaps)
11. [Rejected and superseded ideas](#11-rejected-and-superseded-ideas)
12. [Session and Git workflow](#12-session-and-git-workflow)
13. [How to verify your work](#13-how-to-verify-your-work)
14. [Quick answers to likely questions](#14-quick-answers-to-likely-questions)

---

## 1. Project identity

| | |
| --- | --- |
| **Game** | Radiant: Battle Arena (the colon is part of the name) |
| **Type** | *Stormlight Archive* fan game — unofficial, non-commercial |
| **Engine** | Unreal Engine 5.8 |
| **Team** | One person, solo developer |
| **Version control (game)** | Diversion — **not** Git, and not accessible from here |
| **Version control (site)** | This Git repo |
| **This repo** | `JaxonHyer/Radiant-Battle-Arena` |
| **Site branch** | `gh-pages` (site serves from repo root) |
| **Live URL** | https://jaxonhyer.github.io/Radiant-Battle-Arena/ |
| **Custom domain** | Wanted eventually, not decided. Site is already domain-ready |

**What this repo contains:** the static Learn More website, plus some game assets under `assets/`. The Unreal project itself is **not** here — it lives in Diversion.

---

## 2. Who you're working with

Behavioural notes from the first session. These matter.

- **Wants to be consulted before you build.** In session one the developer stopped an in-progress build with *"No writing any code yet... Only write code when I tell you go ahead."* **Do not start writing code in response to an open-ended or brainstorming message.** Ask questions, present a plan, wait for an explicit go-ahead.
- **Gives detailed, high-quality specs** when asked. Ask precise questions and you'll get precise answers.
- **Changes their mind, and that's fine.** The quiz went from "link to Brandon's official quiz" to "we're making our own" within one message. Don't argue; just re-scope.
- **Reviews on a phone.** Mobile rendering matters. The sandbox live preview did not work for them, so test mobile layouts carefully.
- **Do not open a pull request unless the developer explicitly reverses this instruction.** They warned that opening one will lock this session out of the repository.
- **Was concerned by long silent tool runs** — thought the agent had frozen. **Narrate what you're doing between tool calls.** Don't batch ten silent operations.
- **Cares about doing right by the source material.** Raised the legal question unprompted ("Will Dragonsteel and Brandon Sanderson kill me?"). Give them real research, not vibes, and flag risk honestly.
- **Explicitly asked for overkill documentation** — hence this file.

---

## 3. Repository layout

```
/
├── AGENTS.md                    ← you are here
├── CONFIG.md                    ← exhaustive configuration reference
├── README.md                    ← game overview for repo visitors (NOT config docs)
├── LICENSE                      ← CC BY-SA 4.0
├── .nojekyll                    ← stops GitHub Pages running Jekyll
├── GlobalSiteConfig.js          ← site-wide config, loaded by every page
│
├── index.html                   ← home
├── 404.html                     ← GitHub Pages not-found page
├── Gameplay/                    ← modes, combat, local multiplayer, FAQ
├── StormlightArchiveLore/       ← "What is the Stormlight Archive?" primer
├── Windrunner/                  ← Order page (lore ⇄ gameplay toggle)
├── Skybreaker/                  ← Order page (lore ⇄ gameplay toggle)
├── Quiz/                        ← Windrunner vs Skybreaker quiz
├── Download/
│   ├── index.html               ← OS auto-detect + redirect
│   ├── windows/ mac/ linux/     ← per-OS pages
│   └── supported/               ← shown when OS detection fails
├── Assets/                      ← free asset downloads
├── Roadmap/  Devlog/  Credits/  ← JSON-driven pages
│
├── css/site.css                 ← the only stylesheet
├── js/
│   ├── shell.js                 ← header, nav, footer, spoiler toggle, scroll reveal
│   ├── home.js                  ← home page + 3D logo loading
│   ├── gameplay.js              ← gameplay overview + configurable media slot
│   ├── order-page.js            ← renders ANY Order from JSON; tabs; controls SVG
│   ├── lore.js                  ← lore primer
│   ├── quiz.js                  ← adaptive quiz engine
│   ├── download.js              ← OS detection, per-OS pages, supported-OS page
│   ├── assets.js                ← free assets page
│   └── pages.js                 ← roadmap, devlog, credits
│
├── data/
│   ├── lore.json                ├── gameplay.json    ├── quiz.json
│   ├── shared-mechanics.json    ├── assets.json      ├── roadmap.json
│   ├── devlog.json
│   ├── credits.json
│   └── orders/
│       ├── windrunner.json
│       └── skybreaker.json
│
└── assets/
    ├── glyphs/windrunner.png    ← ORIGINAL design, AI-generated (see §7)
    ├── glyphs/skybreaker.png    ← ORIGINAL design, AI-generated
    ├── characters/Parshendi/    ← placeholder; an FBX is expected here
    └── logo.png                 ← ⚠️ DOES NOT EXIST YET
```

---

## 4. Architecture and conventions

### Hard rules

1. **Static only.** Plain HTML, CSS, vanilla JS. **No framework, no bundler, no npm, no build step.** It must run by opening files or `python3 -m http.server`. Do not introduce a toolchain.
2. **Config constants go at the very top of every JS file** — within roughly the first ten lines, each with an inline comment. This is a direct, emphatic request: the developer wants to retune the whole site by skimming the tops of a few files. **Never bury a magic number in the middle of a function.**
3. **Content lives in JSON, never hardcoded in HTML.** Adding an Order, devlog entry, roadmap milestone, asset or credit must be a data edit.
4. **Everything must be expandable.** Explicit instruction: *"make the Skybreaker and Windrunner pages (every page really) expandable."* Any new page type should be data-driven and repeatable.
5. **Relative paths everywhere**, resolved through `siteUrl()`. Never hardcode `/Radiant-Battle-Arena/`.
6. **Respect `prefers-reduced-motion`.** Already handled in `site.css`; keep it that way.

### How pathing works

`SITE_BASE` is derived at runtime from the config script's own resolved URL:

```js
const s = document.currentScript && document.currentScript.src;
return s ? s.replace(/GlobalSiteConfig\.js.*$/, "") : "/";
```

This makes the site work at a project subpath, at a domain root, and locally with zero configuration. `SITE_BASE_OVERRIDE` exists as an escape hatch and must end in a slash. **Do not replace this with hardcoded paths.**

### Page bootstrap pattern

Every page is a thin shell. Example — the entire body of an Order page:

```html
<script>const THIS_ORDER = "windrunner";</script>
<main id="order-root"></main>
<script src="../js/shell.js"></script>
<script src="../js/order-page.js"></script>
<script>document.addEventListener("DOMContentLoaded", () => renderOrderPage(THIS_ORDER));</script>
```

One line differs between Order pages. Same pattern for the three OS pages (`THIS_OS`).

### Shell contract

`js/shell.js` injects the header, nav and footer into every page and exposes **`window.rbaRefresh()`**. Any renderer that injects markup **must call `window.rbaRefresh()` when finished**, or spoiler blurs and scroll-reveal animations won't bind to the new DOM.

### Styling

Single stylesheet, CSS custom properties at `:root`. Accent colour is swapped per Order at runtime via `--accent`. Dark sci-fantasy: near-black background, Stormlight cyan-blue (`--storm: #6fb4ff`), Windrunner blue (`#4f8cff`), Skybreaker smokestone violet-grey (`#c9c4de`), Cinzel-ish display serif for headings, sans for body.

---

## 5. Locked design decisions

Every one of these was explicitly chosen by the developer. **Do not silently reverse any of them.**

| Decision | Value |
| --- | --- |
| Site structure | **Multi-page**, not a single scrolling page |
| Visual style | **Dark sci-fantasy game site** (near-black, Stormlight glow) — not a parchment codex |
| Playable Orders at launch | **Windrunner and Skybreaker only.** More "maybe later" |
| Player format | **Solo with optional two-player local split-screen.** Online multiplayer is not planned |
| Modes | **Arena** planned for v1; **Adventure** planned but release timing is not locked |
| Friendly Fire | In enemy Arena play, on = the other player is treated as an enemy for every damage type |
| Order pages | **One page per Order**, with a **lore ⇄ gameplay toggle** (two sections, one page) |
| Shared mechanics text | **Duplicated onto both Order pages** (developer said "Duplicate it"). Implemented as one shared JSON rendered on both, so it's edited once |
| Lore page | Separate, at `StormlightArchiveLore/index.html`, reached from a home-page button |
| Lore sourcing | **Attributed pull-quotes + original summary prose.** Was originally "verbatim only"; changed after the licensing problem was explained |
| Spoiler policy | General Order/world lore may draw on **all books**; **characters and timeline events only up to *Words of Radiance***. Later material is **blurred behind a site-wide toggle**, not deleted |
| Quiz | **Our own**, not a link to brandonsanderson.com. Windrunner vs Skybreaker only |
| Quiz length | **20 questions authored, 10 shown**, one at a time |
| Quiz branching | **Score-based tree** (chosen over hand-authored routing) |
| Download page | At `Download/`, **OS auto-detect and redirect** |
| OS detect failure | Redirect to **`Download/supported/`** listing every OS with links — do **not** guess a default |
| Download config | Per-OS `downloadFromSite` (true = GitHub direct, false = Drive/host page) and `operatingSystemReleased` (false = show In-Development page) |
| System requirements | Listed as **TBD** |
| Devlog | **Hand-written** from Diversion. Fields: `date`, `commitTitle`, `version`, `branch`, `operatingSystemsUpdated[]`. **No Diversion links** — they require an account |
| Roadmap | Yes, JSON-driven |
| Credits | JSON-configurable CC-BY asset list, fan-game disclaimer, **must mention Unreal Engine 5.8** |
| Controls display | **Inline SVG keyboard + controller highlighter** (developer had no art for it) |
| Glyphs | **AI-generated originals**, not taken from brandonsanderson.com |
| Logo | AI-generated PNG/JPG, path in a const. A **GLB 3D version** is planned — wired up but disabled by default |
| Site base | Config const, **relative paths wherever possible** |
| Free assets page | `Assets/`, JSON-driven, with a **`usePreview` boolean** because an existing FBX won't render |
| Takedown contact | Configurable, shown on Credits + footer + assets page |
| Docs split | `README.md` = game overview for visitors. `CONFIG.md` = all configuration detail |

---

## 6. The game itself (as specified so far)

Everything here came directly from the developer. **Anything not listed is undesigned — do not invent mechanics.** An earlier attempt to helpfully invent ability kits was deleted at their request.

### Stormlight

> Each Order of Knight Radiant fuels their powers by consuming Stormlight stored by Spheres, the main currency on Roshar, and collected during Highstorms, large dangerous storms that roam the planet. Stormlight is represented by the blue bar in the top left corner of the screen and leaks from the player naturally. Stormlight will be one of your most valuable resources while exploring Roshar.

Note this is **canon-accurate** — Coppermind confirms a person holds Stormlight only a few minutes. The site quotes that next to the mechanic.

### Gravitation / Lashing

> The two Orders that control the Surge of Gravitation are the Windrunners and Skybreakers. Gravitation lets the Surgebinder change the direction of gravity for themselves letting them Lash themselves to shoot off into the sky. To initiate a Lashing Double-Jump to start Hovering, then Sprint to start Lashing in the direction of the camera. Increase your lashing intensity by tapping W on a keyboard or flicking the Left Controller Joystick forward. In contrast the intensity of a Lashing can be decreased by flicking the Left Joystick back or tapping S. To steer while lashing move the direction of the camera. To Dodge left and right, use A and D or move the joystick left to right on your controller.

⚠️ **The original spec said "use S and D" for dodge. This was a typo.** The developer confirmed: **A and D**. Keep it that way.

| Action | Keyboard | Controller |
| --- | --- | --- |
| Begin hovering | Double-tap Space | Double-tap A/X |
| Start Lashing | Sprint (Shift) | Left stick click |
| Increase intensity | W | Left stick forward |
| Decrease intensity | S | Left stick back |
| Steer | Mouse / camera | Right stick |
| Dodge left / right | **A / D** | Left stick left / right |

### Current implementation status

**Only Gravitation is currently implemented.** Treat Arena, Adventure, melee combat, progression, Adhesion, Division, health, respawning, and the features below as plans—not as finished functionality. Most planned systems are intended for v1, but Adventure and Urithiru may come later. There is no public build.

### Players and multiplayer

- Both Arena and Adventure are planned for **solo play with an optional second local player in split-screen**.
- Multiplayer is always local. **Online multiplayer is explicitly not planned.**
- Both players may choose the same Order.
- Player progression is separate, but level unlocks are shared.
- A planned Honorblade test level appears before the player chooses an Order.

### Game modes

**Arena** is planned for v1 with two broad formats:

- Fight the other player with no enemies.
- Fight selectable waves of enemies or play an endless survival variant. Selectable waves are won by clearing every wave; endless play is about surviving.
- Arena loads the players' Adventure save files/resources. Whether Arena changes Adventure progression is undecided.
- Friendly Fire is relevant to enemy-wave play. When enabled, the other player is treated as an enemy character and **all damage types** apply to them.

**Adventure** is planned but its release timing is not locked:

- Level-based, with a level-selection screen.
- Levels are unlocked by completing other levels or reaching an achievement such as the Third Ideal.
- Levels are replayable, quest-based, and usually depict battles from *The Stormlight Archive*, though some may differ.
- Most levels will probably end with a boss.
- Players respawn until a level-specific victory or failure condition is met.

### Combat, health, and progression

- Combat is planned on the ground and in the air. A flying player can still use melee weapons.
- Planned weapons: shield, hammer, spear, and two-handed sword. Bows are undecided.
- Combos can switch weapons between swings and continue with the newly equipped weapon. Shields—and bows, if added—are excluded from this mid-combo switching.
- Shardblades become available at or above the Third Ideal.
- Players begin with ten hearts; half-heart damage exists.
- Stormlight heals the player whenever they hold any.
- Respawning removes all held Stormlight.
- Towerlight exists in the game. Urithiru is intended but may not be in v1. Treat both as spoiler-sensitive in public copy.

### Planned unique Surges

**Adhesion — Windrunner:**

- Fire aimed blobs of Adhesion to immobilize enemies or the other player when Friendly Fire applies.
- Enable a Wind Bubble that reduces drag for faster flight and pushes objects away. This is the game's Windrunner-only interpretation of a Reverse Lashing.

**Division — Skybreaker:**

- Maintain a Division Bubble while grounded or flying. It fractures Chaos-enabled meshes, using `ExplosiveImpact` or `SlowCorroding` settings based on velocity. The input is undecided.
- Use Division Touch while grounded: the character reaches out and obliterates touched Chaos-enabled objects. Enemies take heavy damage instead. The input is undecided, and the move cannot be used in the air.

### Animation foundation

The player character uses Epic Games' **Game Animation Sample Project** as its animation base, driven by Unreal Engine's **Motion Matching** system. The site links to Epic's official documentation and credits Epic. `GAMEPLAY_MOTION_MEDIA_URL` in `js/gameplay.js` is intentionally empty until the developer supplies a clip; do not copy or hotlink documentation media without confirming reuse terms.

### Still undecided

- Whether Arena changes Adventure progression or only reads Adventure save files.
- Exact Arena wave counts and balancing.
- Division and Adhesion input bindings.
- Whether bows will be included.
- Specific maps/arenas and most level objectives.
- Whether Parshendi are playable (an `assets/characters/Parshendi/` folder exists, so they are at least an asset).
- Final placement and v1 scope for Urithiru.

Do not settle these questions or invent additional mechanics without asking the developer.

---

## 7. Legal and licensing — read carefully

This was researched from primary sources. **Do not weaken any of these protections.**

### Dragonsteel's fan work policy

Sources: https://www.brandonsanderson.com/pages/fan-art-policy and https://faq.brandonsanderson.com/knowledge-base/can-i-make-fan-art-or-write-fan-fiction/

- **Non-commercial fan work is explicitly permitted.** Brandon states he has no objection to fan art/fiction for non-commercial personal use, "so long as you are not making any money from them directly or indirectly."
- **AI is named specifically:** fan art created by or with the aid of AI "is not permissible for **any commercial uses**." Non-commercial AI fan work is not prohibited by the letter of the policy. Brandon is nonetheless publicly critical of AI art, so expect community friction.
- **Copies of official glyphs and symbols are NEVER permitted** unless integral to a character or scene. **This is why the repo's glyphs are original designs.** Never lift symbols from brandonsanderson.com, the books, or wiki uploads.
- **3D printable files** of characters, creatures, symbols and settings are on the never-permitted-commercially list. The free-assets page therefore frames files as **game assets**, never as printables, and ships no STLs.
- **Game rights are already licensed to Brotherwise Games**, and Dragonsteel turns down digital gaming inquiries because those rights tie to film/TV. **This fan game exists on tolerance, not permission.** Staying free and conspicuously unofficial is what preserves that.

**Practical rule: the site must never become commercial.** No ads, no donations, no Patreon, no tip jar, no storefront — especially adjacent to the assets page.

### Wiki text licensing

| Source | Licence | What you may do |
| --- | --- | --- |
| **The Coppermind** (coppermind.net) | **CC BY-NC-ND 4.0** | ✅ Reproduce **verbatim** with attribution + link. ❌ **Paraphrasing or rewriting their prose is a derivative work and is NOT allowed.** |
| **Fandom wikis** | CC BY-SA 3.0 | Remixable, but share-alike |
| **Novel quotations** | Dragonsteel copyright | Short excerpts, fair use, always attributed |

**This is the single most important content rule.** When writing summary prose, write it **from the underlying facts in your own words**. Facts are not copyrightable; Coppermind's sentences are. Never "reword" a Coppermind paragraph.

Coppermind also notes that direct book quotations on their pages are fair-use reproductions belonging to Dragonsteel, not to Coppermind.

### Repo licence conflict

`LICENSE` is **CC BY-SA 4.0**, which is incompatible with NC-ND quoted material. Resolved by `LEGAL_LICENSE` in the config, which states the CC BY-SA grant covers **original content only** and excludes quoted material. Keep that carve-out.

### Required on the site

- Conspicuous unofficial-fan-project disclaimer (footer, every page) ✅
- Non-commercial notice on the assets page ✅
- Takedown contact ✅ (`jaxonkhyer@gmail.com` plus GitHub Issues)
- Unreal Engine 5.8 credit ✅

---

## 8. The approved quote sheet

Researched and approved in session one. Already placed in the JSON. Tier A = book quotations (fair use); Tier B = Coppermind article prose (CC BY-NC-ND, verbatim only).

| ID | Tier | Quote (abbrev.) | Source | Where | Spoiler |
| --- | --- | --- | --- | --- | --- |
| A1 | A | "I'm not some glorious knight of ancient days…" | Kaladin & Syl, *WoR* | Windrunner | ✅ |
| A2 | A | "If you looked deeply into a stone…" | Kaladin, *WoR* | Lore | ❌ |
| A3 | A | "Honor's power, during a storm, is concentrated…" | Stormfather, *Oathbringer* | Lore | ✅ |
| A4 | A | "I will protect." | Windrunner core philosophy | Windrunner (feature) | ❌ |
| A5 | A | "I watched you destroy yourself in the name of order…" | Nale to Szeth, *WoR* | Skybreaker | ✅ |
| A6 | A | "The second is the Ideal of Justice…" | Ki, *Oathbringer* | Skybreaker (feature) | ❌ |
| B1 | B | "The Knights Radiant comprised ten different Orders…" | Coppermind | Lore | ❌ |
| B2 | B | "Stormlight appears as luminescent white vapor…" | Coppermind | Shared mechanics | ❌ |
| B3 | B | "A person can only hold Stormlight for a few minutes…" | Coppermind | Shared mechanics | ❌ |
| B4 | B | "The Windrunners are Surgebinders who use…" | Coppermind | Windrunner | ❌ |
| B5 | B | "Windrunners generally train to become the best duelists…" | Coppermind | Windrunner | ❌ |
| B6 | B | "The Skybreakers are Surgebinders who use…" | Coppermind | Skybreaker | ❌ |
| B7 | B | "The Skybreakers were the only Radiant order not to have abandoned their oaths…" | Coppermind | Skybreaker | ✅ |

Spoiler-marked entries are past the *Words of Radiance* line (or spoil the Recreance/Szeth) and are **blurred, not removed** — the developer specifically chose gating over cutting.

Every quote carries `source` and `url` in JSON and renders with a visible citation link. **Never add a quote without attribution.**

---

## 9. Content rules

### Spoiler system

- Mark a quote with `"spoiler": true`, or add `class="spoiler"` to HTML.
- Site-wide toggle persists in `localStorage` (`rba-spoilers`); default is hidden (`SITE_SPOILERS_ON = false`).
- Individual blocks can be clicked to reveal just that one.
- The limit string is `SITE_SPOILER_LIMIT` — currently `"Words of Radiance"`.

### Tone

Second person, direct, no marketing hype. Short sentences. The developer's own copy is plain and functional — match it. Don't oversell an unreleased solo project.

### Naming

- The game is **"Radiant: Battle Arena"** — with the colon.
- Orders are singular capitalised nouns: Windrunner, Skybreaker.
- Surges are capitalised: Adhesion, Gravitation, Division.
- "Stormlight", "Shardplate", "spren" (lowercase), "highstorm" (lowercase), "Knights Radiant".

---

## 10. Open items and known gaps

### Blocking before public sharing

1. **`assets/logo.png` does not exist.** The developer is still polishing it. The hero safely falls back to text. Once supplied, also create a favicon and social-sharing image, then set `SITE_FAVICON` and `SITE_SOCIAL_IMAGE`.

### Waiting on the developer

2. **Gameplay/Motion Matching clip** — `GAMEPLAY_MOTION_MEDIA_URL` in `js/gameplay.js` is an empty configurable placeholder. Prefer the developer's own project capture over copied Epic documentation media.
3. **The Parshendi FBX** — `data/assets.json` points at the folder `assets/characters/Parshendi/` with `usePreview: false`. Needs a real packaged file and a size.
4. **GLB logo** — `SITE_LOGO_GLB_ON` is `false`. Wired to lazy-load `model-viewer` on desktop ≥900px with the PNG as fallback. Suggested budget 5 MB (GitHub hard-caps files at 100 MB).
5. **Custom domain** — undecided. No config change needed if adopted.
6. **Download URLs** — all three point at GitHub Releases `latest` and all have `operatingSystemReleased: false`.
7. **System requirements** — all `"TBD"`.
8. **Real devlog history** — sample entries were removed from `data/devlog.json`; the page shows an honest empty state until verified Diversion history is supplied.

### Implemented but still needs device review

9. **Mobile navigation.** A keyboard-accessible hamburger menu now replaces the wrapped desktop nav below 900px. Test it on the developer's phone.
10. **Social metadata.** Open Graph/Twitter metadata is injected by `shell.js`; image metadata remains disabled until final logo artwork is supplied.
11. **404 page.** Added at `/404.html`; verify GitHub Pages serves it as expected.

---

## 11. Rejected and superseded ideas

Don't re-propose these; they were considered and dismissed.

| Idea | Outcome |
| --- | --- |
| All ten Orders | ❌ Solo dev — two Orders only for first release |
| Single-page scrolling site | ❌ Multi-page chosen |
| Parchment/illuminated-codex styling | ❌ Dark sci-fantasy chosen |
| Link out to brandonsanderson.com's official Order quiz | ❌ Superseded — building our own |
| Verbatim-only lore pages | ❌ Superseded by pull-quotes + original prose after the ND licence issue surfaced |
| Taking Order glyphs from brandonsanderson.com | ❌ Rejected on copyright grounds; original AI glyphs generated instead |
| Cutting post-*WoR* quotes | ❌ Superseded — blur them instead |
| Hand-authored quiz branch routing | ❌ Score-based tree chosen |
| Guessing Windows when OS detection fails | ❌ Superseded — show the supported-OS page |
| Inventing ability kits / stats for all ten Orders | ❌ Built once, **deleted at the developer's request.** Do not invent game design |
| Diversion commit links in the devlog | ❌ Account-walled; hand-written values only |

---

## 12. Session and Git workflow

### Current instruction

**Do not open a pull request.** The developer explicitly said opening one will lock this session out of the repository. Keep work on the Arena session branch and let the developer decide when and how to integrate it.

### ⚠️ The lifecycle trap that ended session one

An Arena session is bound to one branch and its PR. **When that PR is merged or closed, remote GitHub access is revoked for that session.** Local edits and commits still work; `git push` and `gh` do not.

Session one hit this: PR #1 was merged, then the developer asked for more work, and the resulting commits could not be pushed. `CONFIG.md` and the rewritten `README.md` were stranded locally.

**Therefore:**
- **Do not encourage merging until the developer is finished iterating.** Follow-up commits attach to an open PR automatically.
- If a PR is already merged and more work is requested, say plainly that a **new session** is needed. Don't fire off doomed `gh` commands.
- The developer now understands this. A sensible rhythm is **one session per chunk of work**.

### Branch rules

- Work **only** on the session branch (`arena/...`). Never push to `gh-pages` or `main` directly.
- PRs target **`gh-pages`** (that's where the site lives), **not `main`**.
- `main` and `gh-pages` both sat at `912bfd5` before the site landed.

### Observed quirk

The sandbox has, more than once, **reset local commit history** back to the base commit while leaving all working-tree files intact. Files persist; commits sometimes don't. **Verify with `git log` before assuming a commit survived**, and re-commit if needed. **Never** run `git clean`, `git reset --hard`, or otherwise discard the developer's files to "tidy up."

### Prior history

| Commit | Content |
| --- | --- |
| `912bfd5` | Base — LICENSE only |
| PR #1 | The full site — **merged** |
| (local) | `CONFIG.md` + README rewrite — **may still be unpushed** |

---

## 13. How to verify your work

No test suite. Do this before saying you're done:

```bash
# 1. JS syntax
for f in GlobalSiteConfig.js js/*.js; do node --check "$f" || echo "FAIL $f"; done

# 2. JSON validity — a broken file silently blanks a page
python3 -c "
import json,glob
for f in glob.glob('data/**/*.json', recursive=True):
    json.load(open(f)); print('ok', f)"

# 3. Serve and check every route
python3 -m http.server 8000 &
for p in / /StormlightArchiveLore/ /Windrunner/ /Skybreaker/ /Quiz/ \
         /Download/ /Download/windows/ /Download/mac/ /Download/linux/ \
         /Download/supported/ /Assets/ /Roadmap/ /Devlog/ /Credits/; do
  echo "$(curl -s -o /dev/null -w '%{http_code}' http://localhost:8000$p)  $p"
done
```

Then manually confirm:

- Both Order pages render and the lore ⇄ gameplay tabs switch
- The spoiler toggle blurs/reveals and survives a reload
- The quiz completes 10 questions and reaches a result
- Hovering a control row lights the matching keycaps
- Nav highlights the current page

**Remember:** the developer's live preview did not work. **Ship via a PR they can merge and view on GitHub Pages.**

---

## 14. Quick answers to likely questions

**"How do I configure the site base?"** You don't — it auto-detects. See `CONFIG.md` §2.

**"Where do I add a new Order?"** Four steps in `CONFIG.md` §6. JSON file + copied folder + `ORDERS` entry + glyph.

**"Can I use AI to generate art for this?"** For this non-commercial site, yes — the existing glyphs and logo are AI-generated. **Never for anything commercial**, and never generate an imitation of an official Dragonsteel symbol.

**"Can I quote the Coppermind?"** Verbatim with attribution and a link, yes. Paraphrased, no. See §7.

**"Should I add React/Tailwind/a build step?"** No. See §4.

**"The developer asked a broad question — should I start coding?"** No. Ask clarifying questions and wait for an explicit go-ahead. See §2.

**"Can I invent gameplay details to fill a gap?"** No. Mark it "in development" and ask. See §6.

**"Why is there a `usePreview` flag?"** Because an FBX can't render as an image and the developer didn't want a broken thumbnail.

**"Can I push / open a PR?"** Do not open a PR in the current session; the developer explicitly warned it will lock repository access. See §12.
