/* ==========================================================================
   ORDER PAGE — renders any Order from data/orders/<id>.json plus the shared
   mechanics file. To add an Order: drop in a JSON file, copy an order folder.
   ========================================================================== */

const ORDER_DEFAULT_TAB   = "lore";   // Which tab opens first: "lore" or "gameplay"
const ORDER_TAB_LABELS    = { lore: "In the Books", gameplay: "In the Game" };
const ORDER_DATA_DIR      = "data/orders/";          // Where Order JSON files live
const ORDER_SHARED_FILE   = "data/shared-mechanics.json"; // Duplicated onto every Order page
const ORDER_SHOW_SHARED   = true;     // Show the shared Stormlight / Gravitation sections
const ORDER_REMEMBER_TAB  = true;     // Remember the last tab the visitor used

/* ========================================================================== */

const C = window.RBA_CONFIG;
const u = C.siteUrl;
const esc = s => String(s).replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));

function quoteHtml(q) {
  const cls = q.spoiler ? "pull spoiler" : "pull";
  return `<blockquote class="${cls}">
    <div>${esc(q.text)}</div>
    <cite>— ${esc(q.source)}${q.url ? ` · <a href="${q.url}" target="_blank" rel="noopener">source</a>` : ""}</cite>
  </blockquote>`;
}

/* ---------- Inline SVG keyboard + controller ---------- */

function keyboardSvg() {
  const key = (id, label, x, y, w = 54) => `
    <g class="key" data-key="${id}">
      <rect class="keycap" x="${x}" y="${y}" width="${w}" height="50" rx="9"/>
      <text class="keycap-label" x="${x + w / 2}" y="${y + 31}">${label}</text>
    </g>`;
  return `<svg viewBox="0 0 340 190" role="img" aria-label="Keyboard controls">
    ${key("W", "W", 63, 6)}
    ${key("A", "A", 5, 62)}
    ${key("S", "S", 63, 62)}
    ${key("D", "D", 121, 62)}
    ${key("Shift", "Shift", 5, 120, 112)}
    ${key("Space", "Space", 123, 120, 160)}
    ${key("Mouse", "Mouse", 185, 6, 110)}
  </svg>`;
}

function padSvg() {
  return `<svg viewBox="0 0 300 190" role="img" aria-label="Controller controls">
    <rect class="pad-part" data-pad="body" x="26" y="52" width="248" height="104" rx="52"/>
    <circle class="pad-part" data-pad="lstick" cx="92" cy="92" r="26"/>
    <circle class="pad-part" data-pad="rstick" cx="186" cy="124" r="26"/>
    <circle class="pad-part" data-pad="dpad" cx="114" cy="126" r="17"/>
    <circle class="pad-part" data-pad="face" cx="212" cy="86" r="17"/>
    <text class="keycap-label" x="92" y="98">L</text>
    <text class="keycap-label" x="186" y="130">R</text>
    <text class="keycap-label" x="212" y="92">A</text>
  </svg>`;
}

function controlsHtml(controls) {
  const rows = controls.map(c => `
    <li data-control="${c.id}" data-keys='${JSON.stringify(c.highlight || [])}' data-pads='${JSON.stringify(c.padParts || [])}'>
      <span>${esc(c.action)}</span>
      <span><kbd>${c.keys.join(" / ")}</kbd> <kbd>${esc(c.pad)}</kbd></span>
    </li>`).join("");

  return `<div class="keys-wrap">
    <div>${keyboardSvg()}${padSvg()}</div>
    <ul class="control-list">${rows}</ul>
  </div>`;
}

function wireControls(root) {
  const items = root.querySelectorAll(".control-list li");
  const clear = () => {
    root.querySelectorAll(".key").forEach(k => k.classList.remove("is-active"));
    root.querySelectorAll(".pad-part").forEach(p => p.classList.remove("is-active"));
    items.forEach(i => i.classList.remove("is-active"));
  };
  items.forEach(li => {
    const show = () => {
      clear();
      li.classList.add("is-active");
      JSON.parse(li.dataset.keys).forEach(k => {
        const el = root.querySelector(`.key[data-key="${k}"]`);
        if (el) el.classList.add("is-active");
      });
      JSON.parse(li.dataset.pads).forEach(p => {
        const el = root.querySelector(`.pad-part[data-pad="${p}"]`);
        if (el) el.classList.add("is-active");
      });
    };
    li.addEventListener("mouseenter", show);
    li.addEventListener("click", show);
    li.addEventListener("focus", show);
    li.tabIndex = 0;
  });
}

/* ---------- Section builders ---------- */

function sharedSectionHtml(sec) {
  let html = `<h3>${esc(sec.title)}</h3>`;
  html += sec.body.map(p => `<p class="lede">${esc(p)}</p>`).join("");
  if (sec.showStormbar) {
    html += `<div class="stormbar-demo"><div class="stormbar"><i></i></div>
             <p class="meta" style="margin-top:6px">Stormlight drains continuously while held.</p></div>`;
  }
  if (sec.showControls && sec.controls) html += controlsHtml(sec.controls);
  if (sec.quotes) html += sec.quotes.map(quoteHtml).join("");
  return `<div class="panel" style="margin-top:16px">${html}</div>`;
}

function loreHtml(order) {
  const feature = (order.lore.quotes || []).find(q => q.feature);
  const rest = (order.lore.quotes || []).filter(q => !q.feature);
  return `
    ${feature ? quoteHtml(feature) : ""}
    ${order.lore.intro.map(p => `<p class="lede">${esc(p)}</p>`).join("")}
    <div class="panel" style="margin-top:18px">
      <table class="specs">
        ${order.lore.facts.map(f => `<tr><th>${esc(f.label)}</th><td>${esc(f.value)}</td></tr>`).join("")}
      </table>
    </div>
    <h3>From the archive</h3>
    ${rest.map(quoteHtml).join("")}
  `;
}

function gameplayHtml(order, shared) {
  const us = order.gameplay.uniqueSurge;
  const unique = us.status === "in-development"
    ? `<div class="wip"><strong>${esc(us.name)}</strong> — in development.<br>${esc(us.note)}</div>`
    : `<div class="grid two">${(us.abilities || []).map(a =>
        `<div class="ability"><h4>${esc(a.name)}</h4><p>${esc(a.desc)}</p></div>`).join("")}</div>`;

  const sharedHtml = (ORDER_SHOW_SHARED && shared)
    ? shared.sections.map(sharedSectionHtml).join("")
    : "";

  return `
    <p class="lede">${esc(order.gameplay.summary)}</p>
    <h3>Shared Radiant mechanics</h3>
    ${sharedHtml}
    <div class="card-heading" style="margin-top:34px">
      <h3 style="margin:0">${esc(us.name)} — unique to the ${esc(order.name)}</h3>
      <span class="chip status-chip">${esc(us.status)}</span>
    </div>
    ${unique}
  `;
}

/* ---------- Boot ---------- */

async function renderOrderPage(orderId) {
  const mount = document.getElementById("order-root");
  const [order, shared] = await Promise.all([
    fetch(u(ORDER_DATA_DIR + orderId + ".json")).then(r => r.json()),
    ORDER_SHOW_SHARED ? fetch(u(ORDER_SHARED_FILE)).then(r => r.json()) : Promise.resolve(null)
  ]);

  document.documentElement.style.setProperty("--accent", order.accent);
  document.title = `${order.name} · ${C.SITE_TITLE}`;

  mount.innerHTML = `
    <div class="wrap">
      <div class="order-hero">
        <img src="${u(order.glyph)}" alt="${esc(order.name)} glyph">
        <div>
          <p class="section-label">Order of the Knights Radiant</p>
          <h1>${esc(order.name)}</h1>
          <p class="lede" style="font-style:italic">${esc(order.tagline)}</p>
          <div class="chips">${order.chips.map(c => `<span class="chip">${esc(c)}</span>`).join("")}</div>
        </div>
      </div>

      <p class="spoiler-note" style="margin-top:20px">
        Characters and timeline events are only discussed up to <strong>${esc(C.SITE_SPOILER_LIMIT)}</strong>.
        Anything later is blurred.
        <button class="spoiler-toggle" data-spoiler-toggle style="margin-left:8px"></button>
      </p>

      <div class="tabs" role="tablist">
        <button role="tab" data-tab="lore" aria-selected="false">${ORDER_TAB_LABELS.lore}</button>
        <button role="tab" data-tab="gameplay" aria-selected="false">${ORDER_TAB_LABELS.gameplay}</button>
      </div>

      <div class="tabpanel" data-panel="lore" hidden>${loreHtml(order)}</div>
      <div class="tabpanel" data-panel="gameplay" hidden>${gameplayHtml(order, shared)}</div>
    </div>
  `;

  // Tabs
  const saved = ORDER_REMEMBER_TAB ? localStorage.getItem("rba-order-tab") : null;
  const start = saved === "gameplay" || saved === "lore" ? saved : ORDER_DEFAULT_TAB;
  const select = name => {
    mount.querySelectorAll("[role=tab]").forEach(b => b.setAttribute("aria-selected", String(b.dataset.tab === name)));
    mount.querySelectorAll(".tabpanel").forEach(p => { p.hidden = p.dataset.panel !== name; });
    if (ORDER_REMEMBER_TAB) localStorage.setItem("rba-order-tab", name);
  };
  mount.querySelectorAll("[role=tab]").forEach(b => b.addEventListener("click", () => select(b.dataset.tab)));
  select(start);

  wireControls(mount);
  window.rbaRefresh();
}
