/* ==========================================================================
   LORE PAGE — renders data/lore.json. Add a section by adding it to the JSON.
   ========================================================================== */

const LORE_FILE      = "data/lore.json"; // Source of all lore copy
const LORE_SHOW_TOC  = true;             // Show the jump-links table of contents
const LORE_SHOW_LINKS = true;            // Show the "read more" external links at the bottom

/* ========================================================================== */

(function () {
  const C = window.RBA_CONFIG;
  const u = C.siteUrl;
  const esc = s => String(s).replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));

  const quote = q => `<blockquote class="pull${q.spoiler ? " spoiler" : ""}">
      <div>${esc(q.text)}</div>
      <cite>— ${esc(q.source)}${q.url ? ` · <a href="${q.url}" target="_blank" rel="noopener">source</a>` : ""}</cite>
    </blockquote>`;

  document.addEventListener("DOMContentLoaded", async () => {
    const root = document.getElementById("lore-root");
    const d = await fetch(u(LORE_FILE)).then(r => r.json());
    document.title = `${d.title} · ${C.SITE_TITLE}`;

    const toc = LORE_SHOW_TOC
      ? `<div class="chips" style="margin:18px 0 6px">${d.sections
          .map(s => `<a class="chip" href="#${s.id}" style="text-decoration:none">${esc(s.title)}</a>`).join("")}</div>`
      : "";

    const body = d.sections.map(s => `
      <section class="reveal" id="${s.id}">
        <h2>${esc(s.title)}</h2>
        ${s.body.map(p => `<p class="lede">${esc(p)}</p>`).join("")}
        ${(s.quotes || []).map(quote).join("")}
      </section>`).join("");

    const further = LORE_SHOW_LINKS ? `
      <section class="reveal">
        <h2>Read further</h2>
        <div class="btn-row" style="justify-content:flex-start">
          ${d.further.map(l => `<a class="btn ghost" href="${l.url}" target="_blank" rel="noopener">${esc(l.label)}</a>`).join("")}
        </div>
      </section>` : "";

    root.innerHTML = `<div class="wrap">
      <div class="hero" style="text-align:left;padding-bottom:0">
        <p class="section-label">Primer</p>
        <h1 style="text-align:left">${esc(d.title)}</h1>
        <p class="lede">${esc(d.intro)}</p>
      </div>
      <p class="spoiler-note" style="margin-top:18px">
        Characters and timeline events are only discussed up to <strong>${esc(C.SITE_SPOILER_LIMIT)}</strong>.
        Anything later is blurred.
        <button class="spoiler-toggle" data-spoiler-toggle style="margin-left:8px"></button>
      </p>
      ${toc}${body}${further}
    </div>`;

    window.rbaRefresh();
  });
})();
