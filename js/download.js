/* ==========================================================================
   DOWNLOAD — OS detection, redirect, and per-OS pages driven by DOWNLOADS
   in GlobalSiteConfig.js.
   ========================================================================== */

const DL_AUTO_REDIRECT   = true;  // Send Download/ straight to the detected OS page
const DL_REDIRECT_DELAY  = 1200;  // ms to show "detecting…" before redirecting
const DL_REMEMBER_CHOICE = true;  // Don't auto-redirect again if the visitor picked an OS manually
const DL_FALLBACK_OS     = "windows"; // Used when the browser tells us nothing useful

/* ========================================================================== */

(function () {
  const C = window.RBA_CONFIG;
  const u = C.siteUrl;
  const esc = s => String(s).replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));

  /** Best guess at the visitor's desktop OS. */
  function detectOs() {
    const p = (navigator.userAgentData && navigator.userAgentData.platform) || navigator.platform || "";
    const ua = navigator.userAgent || "";
    const s = (p + " " + ua).toLowerCase();
    if (/mac|darwin|iphone|ipad/.test(s)) return "mac";
    if (/linux|x11|ubuntu|android/.test(s)) return "linux";
    if (/win/.test(s)) return "windows";
    return DL_FALLBACK_OS;
  }

  function osCard(key) {
    const d = C.DOWNLOADS[key];
    const state = d.operatingSystemReleased ? "" : `<span class="chip">In development</span>`;
    return `<a class="order-card" href="${u("Download/" + key + "/index.html")}">
      <h3>${esc(d.label)}</h3>
      <p class="surges">${esc(d.fileNote || "")}</p>
      <div class="chips" style="justify-content:center;margin-top:10px">${state}</div>
    </a>`;
  }

  /* ---------- Download/index.html ---------- */
  window.renderDownloadIndex = function () {
    const root = document.getElementById("dl-root");
    const os = detectOs();
    const skip = DL_REMEMBER_CHOICE && sessionStorage.getItem("rba-dl-manual") === "1";

    root.innerHTML = `<div class="wrap">
      <div class="hero" style="text-align:left">
        <p class="section-label">Download</p>
        <h1 style="text-align:left">Get the build</h1>
        <p class="lede" id="dl-detect">
          ${DL_AUTO_REDIRECT && !skip
            ? `Detected <strong>${esc(C.DOWNLOADS[os].label)}</strong> — taking you there…`
            : `Choose your platform.`}
        </p>
      </div>
      <div class="grid three">${Object.keys(C.DOWNLOADS).map(osCard).join("")}</div>
      <section>
        <h2>System requirements</h2>
        <div class="panel"><table class="specs">
          ${Object.entries(C.SYSTEM_REQUIREMENTS).map(([k, v]) => `<tr><th>${esc(k)}</th><td>${esc(v)}</td></tr>`).join("")}
        </table></div>
      </section>
    </div>`;

    root.querySelectorAll(".order-card").forEach(a =>
      a.addEventListener("click", () => sessionStorage.setItem("rba-dl-manual", "1")));

    if (DL_AUTO_REDIRECT && !skip) {
      setTimeout(() => { location.href = u("Download/" + os + "/index.html"); }, DL_REDIRECT_DELAY);
    }
    window.rbaRefresh();
  };

  /* ---------- Download/<os>/index.html ---------- */
  window.renderDownloadOs = function (key) {
    const root = document.getElementById("dl-root");
    const d = C.DOWNLOADS[key];
    document.title = `Download for ${d.label} · ${C.SITE_TITLE}`;

    const action = d.operatingSystemReleased
      ? (d.downloadFromSite
          ? `<a class="btn primary" href="${d.url}" download>Download for ${esc(d.label)}</a>
             <p class="meta" style="margin-top:12px">Direct download · ${esc(d.fileNote || "")}</p>`
          : `<a class="btn primary" href="${d.url}" target="_blank" rel="noopener">Open the download page</a>
             <p class="meta" style="margin-top:12px">Hosted externally — the file can't be served straight from this site, so this opens the host.</p>`)
      : `<div class="wip"><strong>${esc(d.label)} build — in development.</strong><br>
           This platform hasn't been released yet. Check the roadmap for what's next.</div>
         <div class="btn-row" style="margin-top:18px">
           <a class="btn ghost" href="${u("Roadmap/index.html")}">View roadmap</a>
         </div>`;

    root.innerHTML = `<div class="wrap">
      <div class="hero" style="text-align:left">
        <p class="section-label">Download</p>
        <h1 style="text-align:left">${esc(d.label)}</h1>
      </div>
      <div class="btn-row" style="justify-content:flex-start">${action}</div>
      <section>
        <h2>System requirements</h2>
        <div class="panel"><table class="specs">
          ${Object.entries(C.SYSTEM_REQUIREMENTS).map(([k, v]) => `<tr><th>${esc(k)}</th><td>${esc(v)}</td></tr>`).join("")}
        </table></div>
      </section>
      <p><a href="${u("Download/index.html")}">← All platforms</a></p>
    </div>`;
    window.rbaRefresh();
  };
})();
