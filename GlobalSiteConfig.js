/* ==========================================================================
   GLOBAL SITE CONFIG — Radiant: Battle Arena
   Tweak everything about the site from the constants below.
   ========================================================================== */

const SITE_TITLE          = "Radiant: Battle Arena";              // Game name, used in <title> and header
const SITE_TAGLINE        = "A Stormlight Archive fan game built in Unreal Engine 5.8";
const SITE_LOGO_PNG       = "assets/logo.png";                    // 2D logo (PNG/JPG). Path is relative to site root
const SITE_LOGO_GLB       = "assets/logo.glb";                    // 3D logo. Set to "" to disable entirely
const SITE_LOGO_GLB_ON    = false;                                // true = load 3D logo on desktop, false = PNG only
const SITE_LOGO_GLB_MAXMB = 5;                                    // Size budget reminder for the GLB (not enforced)
const SITE_ENGINE         = "Unreal Engine 5.8";                  // Engine credit shown in footer + credits
const SITE_SPOILER_LIMIT  = "Words of Radiance";                  // Characters/timeline are only discussed up to this book
const SITE_SPOILERS_ON    = false;                                // Default spoiler-blur state: false = blurred/hidden
const SITE_BASE_OVERRIDE  = "";                                   // Leave "" to auto-detect. Set e.g. "/" for a custom domain

/* --------------------------------------------------------------------------
   DOWNLOADS — one block per operating system.
     url                     : where the build lives
     downloadFromSite        : true  = link downloads directly (e.g. GitHub Releases)
                               false = link sends the user to the host page instead (e.g. Drive)
     operatingSystemReleased : true  = show the real download page
                               false = show the "In Development" page instead
   -------------------------------------------------------------------------- */
const DOWNLOADS = {
  windows: {
    label: "Windows",
    url: "https://github.com/JaxonHyer/Radiant-Battle-Arena/releases/latest",
    downloadFromSite: true,
    operatingSystemReleased: false,
    fileNote: "Windows 64-bit installer"
  },
  mac: {
    label: "macOS",
    url: "https://github.com/JaxonHyer/Radiant-Battle-Arena/releases/latest",
    downloadFromSite: true,
    operatingSystemReleased: false,
    fileNote: "Apple Silicon / Intel universal build"
  },
  linux: {
    label: "Linux",
    url: "https://github.com/JaxonHyer/Radiant-Battle-Arena/releases/latest",
    downloadFromSite: true,
    operatingSystemReleased: false,
    fileNote: "x86_64 build"
  }
};

/* System requirements. Every value is a free-text string — "TBD" is fine. */
const SYSTEM_REQUIREMENTS = {
  "Operating System": "TBD",
  "Processor": "TBD",
  "Memory": "TBD",
  "Graphics": "TBD",
  "Storage": "TBD",
  "Engine": SITE_ENGINE
};

/* --------------------------------------------------------------------------
   PLAYABLE ORDERS — to add a new Order later:
     1. add data/orders/<id>.json
     2. copy an existing order folder's index.html and change one const
     3. add the id to the list below
   -------------------------------------------------------------------------- */
const ORDERS = [
  { id: "windrunner", name: "Windrunner", folder: "Windrunner", glyph: "assets/glyphs/windrunner.png", accent: "#4f8cff", released: true },
  { id: "skybreaker", name: "Skybreaker", folder: "Skybreaker", glyph: "assets/glyphs/skybreaker.png", accent: "#c9c4de", released: true }
];

/* --------------------------------------------------------------------------
   NAVIGATION — edit freely; `orders: true` expands into one link per ORDER.
   -------------------------------------------------------------------------- */
const NAV_LINKS = [
  { label: "Home",  href: "index.html" },
  { label: "Lore",  href: "StormlightArchiveLore/index.html" },
  { orders: true },
  { label: "Quiz",     href: "Quiz/index.html" },
  { label: "Download", href: "Download/index.html" },
  { label: "Roadmap",  href: "Roadmap/index.html" },
  { label: "Devlog",   href: "Devlog/index.html" },
  { label: "Credits",  href: "Credits/index.html" }
];

/* Legal strings, shown in the footer and on the Credits page. */
const LEGAL_DISCLAIMER = "Radiant: Battle Arena is an unofficial, non-commercial fan project. The Stormlight Archive, Roshar, the Knights Radiant and all related names are the property of Brandon Sanderson and Dragonsteel Entertainment. This project is not affiliated with, endorsed by, or sponsored by Dragonsteel Entertainment.";
const LEGAL_LICENSE    = "Original site content is licensed CC BY-SA 4.0. Quoted material remains under the terms of its respective source and is excluded from that grant.";

/* ========================================================================== */

// Work out the site root from this script's own URL, so every page can sit at
// any folder depth and a custom domain "just works".
const SITE_BASE = (function () {
  if (SITE_BASE_OVERRIDE) return SITE_BASE_OVERRIDE;
  const s = document.currentScript && document.currentScript.src;
  return s ? s.replace(/GlobalSiteConfig\.js.*$/, "") : "/";
})();

/** Resolve a root-relative path against the detected site base. */
function siteUrl(path) {
  return SITE_BASE + String(path).replace(/^\/+/, "");
}

window.RBA_CONFIG = {
  SITE_TITLE, SITE_TAGLINE, SITE_LOGO_PNG, SITE_LOGO_GLB, SITE_LOGO_GLB_ON, SITE_LOGO_GLB_MAXMB,
  SITE_ENGINE, SITE_SPOILER_LIMIT, SITE_SPOILERS_ON, SITE_BASE,
  DOWNLOADS, SYSTEM_REQUIREMENTS, ORDERS, NAV_LINKS,
  LEGAL_DISCLAIMER, LEGAL_LICENSE, siteUrl
};
