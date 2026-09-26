/* ==========================================================================
   HOME PAGE
   ========================================================================== */

const HOME_SHOW_LOGO      = true;  // Show the logo image above the title
const HOME_GLB_VIEWER_URL = "https://unpkg.com/@google/model-viewer/dist/model-viewer.min.js"; // 3D viewer library
const HOME_GLB_MIN_WIDTH  = 900;   // Only load the 3D logo on screens at least this wide
const HOME_ORDER_SUBTITLE = surges => surges.join(" · "); // How Order cards label their Surges

/* ========================================================================== */

(function () {
  const C = window.RBA_CONFIG;
  const u = C.siteUrl;

  document.addEventListener("DOMContentLoaded", () => {
    document.getElementById("hero-title").textContent = C.SITE_TITLE;
    document.getElementById("hero-tagline").textContent = C.SITE_TAGLINE;
    document.getElementById("engine-name").textContent = C.SITE_ENGINE;

    // Logo: PNG always, GLB only as an opt-in desktop upgrade.
    if (HOME_SHOW_LOGO) {
      const slot = document.getElementById("hero-logo");
      slot.innerHTML = `<img class="hero-logo" src="${u(C.SITE_LOGO_PNG)}" alt="${C.SITE_TITLE}"
                             onerror="this.remove()">`;
      const wantGlb = C.SITE_LOGO_GLB_ON && C.SITE_LOGO_GLB && innerWidth >= HOME_GLB_MIN_WIDTH;
      if (wantGlb) {
        const s = document.createElement("script");
        s.type = "module"; s.src = HOME_GLB_VIEWER_URL;
        s.onload = () => {
          slot.innerHTML = `<model-viewer src="${u(C.SITE_LOGO_GLB)}" auto-rotate camera-controls
                              disable-zoom shadow-intensity="0" alt="${C.SITE_TITLE}"></model-viewer>`;
        };
        document.head.appendChild(s);
      }
    }

    // Order cards — driven entirely by the ORDERS list in GlobalSiteConfig.js
    const grid = document.getElementById("order-grid");
    Promise.all(C.ORDERS.filter(o => o.released).map(o =>
      fetch(u("data/orders/" + o.id + ".json")).then(r => r.json()).catch(() => null)
    )).then(list => {
      grid.innerHTML = list.filter(Boolean).map(o => `
        <a class="order-card" href="${u(o.name + "/index.html")}">
          <img src="${u(o.glyph)}" alt="">
          <h3>${o.name}</h3>
          <p class="surges">${HOME_ORDER_SUBTITLE(o.surges)}</p>
          <p class="lede" style="margin-top:10px;font-style:italic">${o.tagline}</p>
        </a>`).join("");
      window.rbaRefresh();
    });
  });
})();
