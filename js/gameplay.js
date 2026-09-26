/* ==========================================================================
   GAMEPLAY PAGE — modes, combat systems, animation foundation, and FAQ.
   ========================================================================== */

const GAMEPLAY_DATA_FILE = "data/gameplay.json"; // Gameplay content source
const GAMEPLAY_MOTION_MEDIA_URL = "";            // Optional image/GIF/video URL supplied by the developer
const GAMEPLAY_MOTION_MEDIA_ALT = "Motion Matching traversal animation in Radiant: Battle Arena";

/* ========================================================================== */

(function () {
  const C = window.RBA_CONFIG;
  const u = C.siteUrl;
  const esc = value => String(value).replace(/[&<>\"]/g, char => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[char]));

  function statusChip(status) {
    return `<span class="chip status-chip">${esc(status)}</span>`;
  }

  function modeCard(mode) {
    return `<article class="panel mode-card${mode.spoiler ? " spoiler" : ""}">
      <div class="card-heading"><h3>${esc(mode.name)}</h3>${statusChip(mode.status)}</div>
      <p class="lede">${esc(mode.body)}</p>
      <ul class="feature-list">${mode.details.map(item => `<li>${esc(item)}</li>`).join("")}</ul>
    </article>`;
  }

  function mediaHtml() {
    if (!GAMEPLAY_MOTION_MEDIA_URL) {
      return `<div class="media-placeholder" aria-label="Gameplay media coming later">
        <span>Gameplay clip coming later</span>
        <small>Set GAMEPLAY_MOTION_MEDIA_URL in js/gameplay.js when a clip is ready.</small>
      </div>`;
    }
    const src = esc(GAMEPLAY_MOTION_MEDIA_URL);
    if (/\.(mp4|webm|ogg)(\?.*)?$/i.test(GAMEPLAY_MOTION_MEDIA_URL)) {
      return `<video class="feature-media" controls muted loop playsinline preload="metadata"><source src="${src}"></video>`;
    }
    return `<img class="feature-media" src="${src}" alt="${esc(GAMEPLAY_MOTION_MEDIA_ALT)}" loading="lazy">`;
  }

  async function renderGameplay() {
    const data = await fetch(u(GAMEPLAY_DATA_FILE)).then(response => response.json());
    const root = document.getElementById("gameplay-root");

    root.innerHTML = `<div class="wrap">
      <div class="hero page-hero">
        <p class="section-label">Gameplay</p>
        <h1>Two ways to take flight</h1>
        <p class="tagline">Play alone or add a second local player in split-screen. Adventure through quest-based levels or enter the Arena.</p>
        <div class="status-banner"><strong>Early development:</strong> ${esc(data.current.body)}</div>
      </div>

      <section class="reveal">
        <p class="section-label">Modes</p>
        <h2>Adventure and Arena</h2>
        <p class="lede">These modes describe the development plan. Adventure's release timing is not yet locked.</p>
        <div class="grid two content-grid">${data.modes.map(modeCard).join("")}</div>
      </section>

      <section class="reveal">
        <p class="section-label">Planned systems</p>
        <h2>Fight on the ground or in the air</h2>
        <div class="grid two content-grid">${data.systems.map(system => `
          <article class="panel feature-card">
            <div class="card-heading"><h3>${esc(system.name)}</h3>${statusChip(system.status)}</div>
            <p class="lede">${esc(system.body)}</p>
          </article>`).join("")}</div>
      </section>

      <section class="reveal">
        <p class="section-label">Animation foundation</p>
        <h2>${esc(data.animation.title)}</h2>
        <div class="grid two content-grid motion-grid">
          <div>
            ${statusChip(data.animation.status)}
            <p class="lede">${esc(data.animation.body)}</p>
            <a class="btn ghost" href="${esc(data.animation.documentationUrl)}" target="_blank" rel="noopener">Game Animation Sample documentation</a>
          </div>
          ${mediaHtml()}
        </div>
      </section>

      <section class="reveal">
        <p class="section-label">Questions</p>
        <h2>Gameplay FAQ</h2>
        <div class="faq-list">${data.faq.map(item => `
          <details class="panel">
            <summary>${esc(item.question)}</summary>
            <p class="lede">${esc(item.answer)}</p>
          </details>`).join("")}</div>
      </section>
    </div>`;
    window.rbaRefresh();
  }

  document.addEventListener("DOMContentLoaded", renderGameplay);
})();
