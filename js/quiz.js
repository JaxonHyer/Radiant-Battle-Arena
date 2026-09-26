/* ==========================================================================
   QUIZ — 20 authored questions, QUIZ_LENGTH shown, branching by running score.
   ========================================================================== */

const QUIZ_FILE       = "data/quiz.json"; // Question bank
const QUIZ_LENGTH     = 10;               // How many questions the player actually sees
const QUIZ_OPENERS    = 3;                // First N questions are always neutral ("any") ones
const QUIZ_PROBE_LEAD = 1;                // Score gap needed before the quiz starts probing a lean
const QUIZ_SHUFFLE    = true;             // Shuffle within each eligible pool so replays differ
const QUIZ_SHOW_METER = true;             // Show the Windrunner/Skybreaker split bar on the result

/* ========================================================================== */

(function () {
  const C = window.RBA_CONFIG;
  const u = C.siteUrl;
  const esc = s => String(s).replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
  const shuffle = a => QUIZ_SHUFFLE ? a.map(v => [Math.random(), v]).sort((x, y) => x[0] - y[0]).map(p => p[1]) : a;

  let bank, asked = [], scores = { windrunner: 0, skybreaker: 0 }, root;

  /** Current lean, or null while the scores are too close to call. */
  function lean() {
    const d = scores.windrunner - scores.skybreaker;
    if (Math.abs(d) < QUIZ_PROBE_LEAD) return null;
    return d > 0 ? "windrunner" : "skybreaker";
  }

  /** Pick the next question: neutral openers first, then probe the current leader. */
  function nextQuestion() {
    const left = bank.questions.filter(q => !asked.includes(q.id));
    if (!left.length) return null;

    if (asked.length < QUIZ_OPENERS) {
      const neutral = shuffle(left.filter(q => q.probe === "any"));
      if (neutral.length) return neutral[0];
    }
    const side = lean();
    if (side) {
      const probing = shuffle(left.filter(q => q.probe === side));
      if (probing.length) return probing[0];
    }
    const neutral = shuffle(left.filter(q => q.probe === "any"));
    return (neutral[0]) || shuffle(left)[0];
  }

  function renderQuestion(q) {
    const pct = (asked.length / QUIZ_LENGTH) * 100;
    root.innerHTML = `
      <div class="panel quiz-card">
        <div class="quiz-progress"><i style="width:${pct}%"></i></div>
        <p class="meta">Question ${asked.length + 1} of ${QUIZ_LENGTH}</p>
        <h2 class="quiz-q">${esc(q.text)}</h2>
        <div class="quiz-options">
          ${q.options.map((o, i) => `<button class="quiz-option" data-i="${i}">${esc(o.text)}</button>`).join("")}
        </div>
      </div>`;

    root.querySelectorAll(".quiz-option").forEach(btn => btn.addEventListener("click", () => {
      const opt = q.options[+btn.dataset.i];
      Object.entries(opt.scores).forEach(([k, v]) => { scores[k] = (scores[k] || 0) + v; });
      asked.push(q.id);
      step();
    }));
  }

  function renderResult() {
    const winner = scores.windrunner >= scores.skybreaker ? "windrunner" : "skybreaker";
    const r = bank.results[winner];
    const order = C.ORDERS.find(o => o.id === winner);
    const total = Math.max(1, scores.windrunner + scores.skybreaker);
    const wPct = Math.round((scores.windrunner / total) * 100);

    const meter = QUIZ_SHOW_METER ? `
      <div class="quiz-meter">
        <i class="w" style="width:${wPct}%"></i><i class="s" style="width:${100 - wPct}%"></i>
      </div>
      <div class="quiz-meter-labels"><span>Windrunner ${wPct}%</span><span>${100 - wPct}% Skybreaker</span></div>` : "";

    root.innerHTML = `
      <div class="panel quiz-card quiz-result">
        <img src="${u(order.glyph)}" alt="">
        <h2>${esc(r.title)}</h2>
        <p class="lede" style="margin:0 auto">${esc(r.blurb)}</p>
        ${meter}
        <div class="btn-row" style="margin-top:24px">
          <a class="btn primary" href="${u(r.href)}">Read the ${esc(order.name)} page</a>
          <button class="btn ghost" id="quiz-retry">Take it again</button>
        </div>
      </div>`;

    document.getElementById("quiz-retry").addEventListener("click", start);
  }

  function step() {
    if (asked.length >= QUIZ_LENGTH) return renderResult();
    const q = nextQuestion();
    q ? renderQuestion(q) : renderResult();
  }

  function start() {
    asked = []; scores = { windrunner: 0, skybreaker: 0 };
    step();
  }

  document.addEventListener("DOMContentLoaded", async () => {
    root = document.getElementById("quiz-root");
    bank = await fetch(u(QUIZ_FILE)).then(r => r.json());
    start();
  });
})();
