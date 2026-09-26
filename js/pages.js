/* ==========================================================================
   SIMPLE JSON PAGES — Roadmap, Devlog and Credits.
   ========================================================================== */

const PAGE_ROADMAP_FILE = "data/roadmap.json";
const PAGE_DEVLOG_FILE  = "data/devlog.json";
const PAGE_CREDITS_FILE = "data/credits.json";
const PAGE_DEVLOG_LIMIT = 50;     // Max devlog entries rendered
const PAGE_DATE_STYLE   = { year: "numeric", month: "short", day: "numeric" }; // Date formatting

/* ========================================================================== */

(function () {
  const C = window.RBA_CONFIG;
  const u = C.siteUrl;
  const esc = s => String(s).replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
  const fmt = d => { const t = new Date(d); return isNaN(t) ? d : t.toLocaleDateString(undefined, PAGE_DATE_STYLE); };
  const get = f => fetch(u(f)).then(r => r.json());

  window.renderRoadmap = async function () {
    const d = await get(PAGE_ROADMAP_FILE);
    document.getElementById("page-root").innerHTML = `<div class="wrap">
      <div class="hero" style="text-align:left">
        <p class="section-label">Roadmap</p>
        <h1 style="text-align:left">What's built, what's next</h1>
      </div>
      <ul class="timeline">
        ${d.milestones.map(m => `
          <li class="${m.status === "done" ? "done" : ""}">
            <h3 style="margin-top:0">${esc(m.title)}</h3>
            <p class="meta">${esc(m.status.toUpperCase())} · ${esc(m.target)}</p>
            <div class="chips">${m.items.map(i => `<span class="chip">${esc(i)}</span>`).join("")}</div>
          </li>`).join("")}
      </ul>
    </div>`;
    window.rbaRefresh();
  };

  window.renderDevlog = async function () {
    const d = await get(PAGE_DEVLOG_FILE);
    document.getElementById("page-root").innerHTML = `<div class="wrap">
      <div class="hero" style="text-align:left">
        <p class="section-label">Devlog</p>
        <h1 style="text-align:left">Commit log</h1>
        <p class="lede">Hand-written from Diversion.</p>
      </div>
      <div class="grid">
        ${d.entries.length ? d.entries.slice(0, PAGE_DEVLOG_LIMIT).map(e => `
          <div class="devlog-entry reveal">
            <h3>${esc(e.commitTitle)}</h3>
            <p class="meta">${esc(fmt(e.date))} · v${esc(e.version)} · branch <code>${esc(e.branch)}</code></p>
            <div>${(e.operatingSystemsUpdated || []).map(o => `<span class="tag">${esc(o)}</span>`).join("")
              || `<span class="tag">No platform build</span>`}</div>
          </div>`).join("") : `<div class="panel"><h3 style="margin-top:0">No verified entries yet</h3><p class="lede">Development history will be added here from Diversion.</p></div>`}
      </div>
    </div>`;
    window.rbaRefresh();
  };

  window.renderCredits = async function () {
    const d = await get(PAGE_CREDITS_FILE);

    const report = C.REPORT_SHOW ? `
      <div class="panel" id="report" style="border-color:rgba(224,178,92,.35);margin-top:16px">
        <h3 style="margin-top:0">${esc(C.REPORT_TITLE)}</h3>
        <p class="lede">${esc(C.REPORT_BODY)}</p>
        <div class="btn-row" style="justify-content:flex-start;margin-top:14px">
          <a class="btn" href="mailto:${esc(C.REPORT_EMAIL)}?subject=${encodeURIComponent("Content report — " + C.SITE_TITLE)}">Email ${esc(C.REPORT_EMAIL)}</a>
          ${C.REPORT_GITHUB ? `<a class="btn ghost" href="${C.REPORT_GITHUB}" target="_blank" rel="noopener">Open an issue on GitHub</a>` : ""}
        </div>
        ${C.REPORT_RESPONSE ? `<p class="meta" style="margin-top:12px">${esc(C.REPORT_RESPONSE)}</p>` : ""}
      </div>` : "";

    document.getElementById("page-root").innerHTML = `<div class="wrap">
      <div class="hero" style="text-align:left">
        <p class="section-label">Credits & Legal</p>
        <h1 style="text-align:left">Credits</h1>
      </div>
      <div class="panel">
        <h3 style="margin-top:0">Fan project disclaimer</h3>
        <p class="lede">${esc(C.LEGAL_DISCLAIMER)}</p>
        <p class="lede">${esc(C.LEGAL_LICENSE)}</p>
      </div>
      ${report}
      ${d.sections.map(s => `
        <section class="reveal">
          <h2>${esc(s.title)}</h2>
          <div class="panel"><table class="specs">
            ${s.entries.map(e => `<tr>
              <th>${e.url ? `<a href="${e.url}" target="_blank" rel="noopener">${esc(e.name)}</a>` : esc(e.name)}</th>
              <td>${esc(e.author)}<br><span class="meta">${esc(e.license)}</span></td>
            </tr>`).join("")}
          </table></div>
        </section>`).join("")}
    </div>`;
    window.rbaRefresh();
  };
})();
