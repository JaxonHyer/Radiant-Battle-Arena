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
let spoilerDelegationBound = false;

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
        const glyph = SHELL_SHOW_GLYPHS ? `<img src="${url(o.glyph)}" alt="" width="17" height="17">` : "";
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
  const desktopQuery = matchMedia("(min-width: 901px)");
  const closeOnDesktop = event => { if (event.matches) setOpen(false); };
  if (desktopQuery.addEventListener) desktopQuery.addEventListener("change", closeOnDesktop);
  else desktopQuery.addListener(closeOnDesktop); // Older Safari
}

function getCanonicalUrl() {
  const servedBase = new URL(CFG.SITE_BASE, location.origin).pathname;
  const relativePath = document.title.startsWith("Page not found")
    ? "404.html"
    : (location.pathname.startsWith(servedBase) ? location.pathname.slice(servedBase.length) : "");
  return new URL(relativePath || "index.html", CFG.SITE_CANONICAL_BASE).href;
}

function initMetadata() {
  let descriptionMeta = document.querySelector('meta[name="description"]');
  if (!descriptionMeta) {
    descriptionMeta = document.createElement("meta");
    descriptionMeta.name = "description";
    descriptionMeta.content = CFG.SITE_DESCRIPTION;
    document.head.appendChild(descriptionMeta);
  }
  const description = descriptionMeta.content;
  const canonicalUrl = getCanonicalUrl();
  const values = {
    "og:title": document.title,
    "og:description": description,
    "og:type": "website",
    "og:site_name": CFG.SITE_TITLE,
    "og:url": canonicalUrl,
    "twitter:card": CFG.SITE_SOCIAL_IMAGE ? "summary_large_image" : "summary",
    "twitter:title": document.title,
    "twitter:description": description
  };
  if (CFG.SITE_SOCIAL_IMAGE) {
    const socialImage = new URL(CFG.SITE_SOCIAL_IMAGE, CFG.SITE_CANONICAL_BASE).href;
    values["og:image"] = socialImage;
    values["twitter:image"] = socialImage;
  }
  Object.entries(values).forEach(([name, content]) => {
    const property = name.startsWith("og:") ? "property" : "name";
    const meta = document.createElement("meta");
    meta.setAttribute(property, name);
    meta.content = content;
    document.head.appendChild(meta);
  });

  const canonical = document.createElement("link");
  canonical.rel = "canonical";
  canonical.href = canonicalUrl;
  document.head.appendChild(canonical);

  const theme = document.createElement("meta");
  theme.name = "theme-color";
  theme.content = "#05070c";
  document.head.appendChild(theme);

  if (CFG.SITE_FAVICON) {
    const icon = document.createElement("link");
    icon.rel = "icon";
    icon.href = url(CFG.SITE_FAVICON);
    document.head.appendChild(icon);
  }
}

function syncSpoilers() {
  const shownGlobally = document.body.classList.contains("spoilers-shown");

  document.querySelectorAll("[data-spoiler-toggle]").forEach(btn => {
    btn.textContent = shownGlobally
      ? `Spoilers shown — hide anything past ${CFG.SITE_SPOILER_LIMIT}`
      : `Spoilers hidden — reveal content past ${CFG.SITE_SPOILER_LIMIT}`;
    btn.setAttribute("aria-pressed", String(shownGlobally));
  });

  document.querySelectorAll(".spoiler").forEach(block => {
    const concealed = !shownGlobally && !block.classList.contains("revealed-one");
    block.setAttribute("aria-expanded", String(!concealed));
    if (concealed) {
      block.tabIndex = 0;
      block.setAttribute("aria-label", `Spoiler past ${CFG.SITE_SPOILER_LIMIT}. Press Enter to reveal.`);
    } else {
      block.removeAttribute("tabindex");
      block.removeAttribute("aria-label");
    }

    block.querySelectorAll("a, button, input, select, textarea, [tabindex]").forEach(child => {
      if (concealed) {
        if (!child.hasAttribute("data-spoiler-tabindex")) {
          child.setAttribute("data-spoiler-tabindex", child.getAttribute("tabindex") || "");
        }
        child.tabIndex = -1;
      } else if (child.hasAttribute("data-spoiler-tabindex")) {
        const oldValue = child.getAttribute("data-spoiler-tabindex");
        if (oldValue) child.setAttribute("tabindex", oldValue);
        else child.removeAttribute("tabindex");
        child.removeAttribute("data-spoiler-tabindex");
      }
    });
  });
}

function revealSpoiler(block) {
  if (!block || document.body.classList.contains("spoilers-shown")) return;
  block.classList.add("revealed-one");
  block.focus({ preventScroll: true });
  syncSpoilers();
}

function initSpoilers() {
  const stored = localStorage.getItem(SHELL_SPOILER_KEY);
  const on = stored === null ? CFG.SITE_SPOILERS_ON : stored === "true";
  document.body.classList.toggle("spoilers-shown", on);

  document.querySelectorAll("[data-spoiler-toggle]").forEach(btn => {
    if (btn.dataset.spoilerBound) return;
    btn.dataset.spoilerBound = "true";
    btn.addEventListener("click", () => {
      const now = !document.body.classList.contains("spoilers-shown");
      document.body.classList.toggle("spoilers-shown", now);
      localStorage.setItem(SHELL_SPOILER_KEY, String(now));
      syncSpoilers();
    });
  });

  if (!spoilerDelegationBound) {
    spoilerDelegationBound = true;
    document.addEventListener("click", event => revealSpoiler(event.target.closest(".spoiler")));
    document.addEventListener("keydown", event => {
      if ((event.key === "Enter" || event.key === " ") && event.target.matches(".spoiler")) {
        event.preventDefault();
        revealSpoiler(event.target);
      }
    });
  }
  syncSpoilers();
}

function initReveal() {
  if (!SHELL_REVEAL_ON || !("IntersectionObserver" in window)) return;
  const io = new IntersectionObserver(entries => {
    entries.forEach(en => { if (en.isIntersecting) { en.target.classList.add("in"); io.unobserve(en.target); } });
  }, { rootMargin: SHELL_REVEAL_MARGIN });
  document.querySelectorAll(".reveal").forEach(el => io.observe(el));
}

/** Fetch JSON and fail loudly instead of leaving a page blank. */
window.rbaFetchJson = async function (path) {
  const response = await fetch(path);
  if (!response.ok) throw new Error(`Request failed with status ${response.status}`);
  return response.json();
};

/** Render a consistent, user-recoverable loading error. */
window.rbaShowError = function (mount) {
  if (!mount) return;
  mount.innerHTML = `<div class="wrap"><div class="panel load-error" role="alert">
    <h1>Something went wrong</h1>
    <p class="lede">This page's content could not be loaded. Check your connection and try again.</p>
    <button class="btn" type="button" onclick="location.reload()">Try again</button>
  </div></div>`;
};

/** Pages call this after they finish injecting their own markup. */
window.rbaRefresh = function () { initSpoilers(); initReveal(); };

document.title = !document.title || document.title === CFG.SITE_TITLE
  ? CFG.SITE_TITLE
  : `${document.title} · ${CFG.SITE_TITLE}`;
initMetadata();

document.addEventListener("DOMContentLoaded", () => {
  renderShell();
  initSpoilers();
  initReveal();
});
