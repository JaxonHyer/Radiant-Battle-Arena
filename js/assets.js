/* ==========================================================================
   FREE ASSETS PAGE — renders data/assets.json.
   Set "usePreview": false on any asset that can't render as an image
   (FBX, GLB, audio, zips) and a format badge is shown instead.
   ========================================================================== */

const ASSETS_FILE        = "data/assets.json"; // Asset manifest
const ASSETS_SHOW_AI_TAG = true;   // Badge assets flagged "aiGenerated": true
const ASSETS_AI_TAG_TEXT = "AI-assisted";
const ASSETS_NC_WARNING  = true;   // Show the non-commercial notice at the top
const ASSETS_BTN_TEXT    = "Download";
const ASSETS_FOLDER_TEXT = "Browse files"; // Used when the path is a folder, not a file

/* ========================================================================== */

(function () {
  const C = window.RBA_CONFIG;
  const u = C.siteUrl;
  const esc = s => String(s).replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
  const isFolder = p => p.endsWith("/");

  function previewHtml(a) {
    if (a.usePreview && a.preview) {
      return `<div class="asset-preview"><img src="${u(a.preview)}" alt="${esc(a.name)} preview"></div>`;
    }
    // No usable preview — show the file format instead of a broken image.
    return `<div class="asset-preview is-empty">
              <span class="asset-format">${esc(a.format || "FILE")}</span>
              <span class="meta">No preview available</span>
            </div>`;
  }

  function assetHtml(a) {
    const folder = isFolder(a.file);
    const aiTag = (ASSETS_SHOW_AI_TAG && a.aiGenerated) ? `<span class="tag">${ASSETS_AI_TAG_TEXT}</span>` : "";
    return `<div class="asset-card reveal">
      ${previewHtml(a)}
      <div class="asset-body">
        <h3>${esc(a.name)}</h3>
        <p class="lede" style="font-size:.9rem">${esc(a.description)}</p>
        <p class="meta">${esc(a.format || "")}${a.size ? " · " + esc(a.size) : ""} · ${esc(a.author || "")}</p>
        <div>${aiTag}</div>
        <div class="btn-row" style="justify-content:flex-start;margin-top:14px">
          <a class="btn" href="${u(a.file)}" ${folder ? "" : "download"}>
            ${folder ? ASSETS_FOLDER_TEXT : ASSETS_BTN_TEXT}
          </a>
        </div>
      </div>
    </div>`;
  }

  window.renderAssets = async function () {
    const d = await fetch(u(ASSETS_FILE)).then(r => r.json());
    const notice = ASSETS_NC_WARNING ? `
      <div class="spoiler-note" style="margin:20px 0">
        <strong>Non-commercial use only.</strong> ${esc(d.license)}
        ${d.licenseUrl ? ` <a href="${d.licenseUrl}" target="_blank" rel="noopener">Read the fan art policy</a>.` : ""}
        ${C.REPORT_SHOW ? ` <a href="${u("Credits/index.html#report")}">Report an asset</a>.` : ""}
      </div>` : "";

    document.getElementById("page-root").innerHTML = `<div class="wrap">
      <div class="hero" style="text-align:left">
        <p class="section-label">Free assets</p>
        <h1 style="text-align:left">Downloads</h1>
        <p class="lede">${esc(d.intro)}</p>
      </div>
      ${notice}
      ${d.categories.map(cat => `
        <section>
          <h2>${esc(cat.title)}</h2>
          <div class="grid two">${cat.assets.map(assetHtml).join("")}</div>
        </section>`).join("")}
    </div>`;
    window.rbaRefresh();
  };
})();
