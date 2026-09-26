/* ==========================================================================
   SHELL — header, nav, footer, spoiler toggle. Loaded on every page.
   ========================================================================== */

const SHELL_BRAND_SPLIT   = ":";     // Text before this char is white, after it is glowing
const SHELL_SHOW_GLYPHS   = true;    // Show Order glyphs beside their nav links
const SHELL_REVEAL_ON     = true;    // Fade-up sections as they scroll into view
const SHELL_REVEAL_MARGIN = "-40px"; // How early the fade-up triggers
const SHELL_SPOILER_KEY   = "rba-spoilers"; // localStorage key for the spoiler toggle
const SHELL_FOOTER_LINKS  = [        // Extra links shown in the footer
  { label: "GitHub", href: "https://github.com/JaxonHyer/Radiant-Battle-Arena" },
  { label: "Credits & Legal", href: "Credits/index.html" }
];

/* ========================================================================== */

const CFG = window.RBA_CONFIG;
const url = CFG.siteUrl;

/** True when `href` points at the page currently being viewed. */
function isCurrent(href) {
  const here = location.pathname.replace(/index\.html$/, "").replace(/\/+$/, "");
  const there = url(href).replace(/^https?:\/\/[^/]+/, "").replace(/index\.html$/, "").replace(/\/+$/, "");
  return here === there;
}

function buildNav() {
  const items = [];
  CFG.NAV_LINKS.forEach(link => {
    if (link.orders) {
      CFG.ORDERS.filter(o => o.released).forEach(o => {
        const glyph = SHELL_SHOW_GLYPHS ? `<img src="${url(o.glyph)}" alt="">` : "";
        items.push(`<a href="${url(o.folder + "/index.html")}">${glyph}${o.name}</a>`);
      });
    } else {
      items.push(`<a href="${url(link.href)}">${link.label}</a>`);
    }
  });
  return items.join("");
}

function renderShell() {
  const [pre, post] = CFG.SITE_TITLE.split(SHELL_BRAND_SPLIT);
  const main = document.querySelector("main");
  if (main && !main.id) main.id = "page-content";
  const mainId = main ? main.id : "page-content";

  document.body.insertAdjacentHTML("afterbegin", `
    <a class="skip-link" href="#${mainId}">Skip to content</a>
    <header class="site-header">
      <div class="wrap">
        <a class="brand" href="${url("index.html")}">${pre}${post ? `<span>${SHELL_BRAND_SPLIT}${post}</span>` : ""}</a>
        <button class="nav-toggle" type="button" aria-expanded="false" aria-controls="site-navigation" aria-label="Open navigation">
          <span></span><span></span><span></span>
        </button>
        <nav class="site-nav" id="site-navigation" aria-label="Main navigation">${buildNav()}</nav>
      </div>
    </header>
  `);

  const links = SHELL_FOOTER_LINKS.slice();
  if (CFG.REPORT_SHOW) links.push({ label: "Report content", href: "Credits/index.html#report" });
  const footerLinks = links
    .map(l => `<a href="${/^https?:/.test(l.href) ? l.href : url(l.href)}">${l.label}</a>`)
    .join(" &nbsp;·&nbsp; ");

  document.body.insertAdjacentHTML("beforeend", `
    <footer class="site-footer">
      <div class="wrap">
        <p><strong>${CFG.SITE_TITLE}</strong> — built with ${CFG.SITE_ENGINE}.</p>
        <p>${CFG.LEGAL_DISCLAIMER}</p>
        <p>${CFG.LEGAL_LICENSE}</p>
        <p>${footerLinks}</p>
      </div>
    </footer>
  `);

  // Mark the active nav link
  document.querySelectorAll(".site-nav a").forEach(a => {
    if (isCurrent(a.getAttribute("href"))) a.setAttribute("aria-current", "page");
  });

  const toggle = document.querySelector(".nav-toggle");
  const nav = document.querySelector(".site-nav");
  const setOpen = open => {
    document.body.classList.toggle("nav-open", open);
    toggle.setAttribute("aria-expanded", String(open));
    toggle.setAttribute("aria-label", open ? "Close navigation" : "Open navigation");
  };
  toggle.addEventListener("click", () => setOpen(!document.body.classList.contains("nav-open")));
  nav.addEventListener("click", event => { if (event.target.closest("a")) setOpen(false); });
  document.addEventListener("keydown", event => { if (event.key === "Escape") setOpen(false); });
  document.addEventListener("click", event => {
    if (document.body.classList.contains("nav-open") && !event.target.closest(".site-header")) setOpen(false);
  });
  matchMedia("(min-width: 901px)").addEventListener("change", event => { if (event.matches) setOpen(false); });
}

function initMetadata() {
  const description = document.querySelector('meta[name="description"]')?.content || CFG.SITE_DESCRIPTION;
  const values = {
    "og:title": document.title,
    "og:description": description,
    "og:type": "website",
    "og:url": location.href,
    "twitter:card": CFG.SITE_SOCIAL_IMAGE ? "summary_large_image" : "summary"
  };
  if (CFG.SITE_SOCIAL_IMAGE) {
    values["og:image"] = url(CFG.SITE_SOCIAL_IMAGE);
    values["twitter:image"] = url(CFG.SITE_SOCIAL_IMAGE);
  }
  Object.entries(values).forEach(([name, content]) => {
    const property = name.startsWith("og:") ? "property" : "name";
    const meta = document.createElement("meta");
    meta.setAttribute(property, name);
    meta.content = content;
    document.head.appendChild(meta);
  });
  if (CFG.SITE_FAVICON) {
    const icon = document.createElement("link");
    icon.rel = "icon";
    icon.href = url(CFG.SITE_FAVICON);
    document.head.appendChild(icon);
  }
}

function initSpoilers() {
  const stored = localStorage.getItem(SHELL_SPOILER_KEY);
  const on = stored === null ? CFG.SITE_SPOILERS_ON : stored === "true";
  document.body.classList.toggle("spoilers-shown", on);

  document.querySelectorAll("[data-spoiler-toggle]").forEach(btn => {
    const sync = () => {
      const shown = document.body.classList.contains("spoilers-shown");
      btn.textContent = shown
        ? `Spoilers shown — hide anything past ${CFG.SITE_SPOILER_LIMIT}`
        : `Spoilers hidden — reveal content past ${CFG.SITE_SPOILER_LIMIT}`;
    };
    btn.addEventListener("click", () => {
      const now = !document.body.classList.contains("spoilers-shown");
      document.body.classList.toggle("spoilers-shown", now);
      localStorage.setItem(SHELL_SPOILER_KEY, String(now));
      document.querySelectorAll("[data-spoiler-toggle]").forEach(b => b.dispatchEvent(new Event("sync")));
    });
    btn.addEventListener("sync", sync);
    sync();
  });

  // Click an individual blurred block to reveal just that one
  document.addEventListener("click", e => {
    const sp = e.target.closest(".spoiler");
    if (sp && !document.body.classList.contains("spoilers-shown")) sp.classList.add("revealed-one");
  });
}

function initReveal() {
  if (!SHELL_REVEAL_ON || !("IntersectionObserver" in window)) return;
  const io = new IntersectionObserver(entries => {
    entries.forEach(en => { if (en.isIntersecting) { en.target.classList.add("in"); io.unobserve(en.target); } });
  }, { rootMargin: SHELL_REVEAL_MARGIN });
  document.querySelectorAll(".reveal").forEach(el => io.observe(el));
}

/** Pages call this after they finish injecting their own markup. */
window.rbaRefresh = function () { initSpoilers(); initReveal(); };

document.title = document.title
  ? `${document.title} · ${CFG.SITE_TITLE}`
  : CFG.SITE_TITLE;
initMetadata();

document.addEventListener("DOMContentLoaded", () => {
  renderShell();
  initSpoilers();
  initReveal();
});
