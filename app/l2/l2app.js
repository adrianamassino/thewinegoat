/* The Wine Goat — Level 2 mode. Loaded only when localStorage "twg-level" is "2" (with l2/content.js, before the main
   script). The main script swaps BANK / CH / GROUPS for the Level 2 data, so quizzes, errors, games and progress all
   work unchanged; this file adds the Level 2 hub, the lessons reader, flashcards and the 50-question mock exam. */
(function () {
  const UI = {
    it: { tab_study: "Level 2", l2Kick: "Preparazione d'esame", l2Title: "Esame Level 2", l2Intro: "Lezioni, quiz e flashcard sui vitigni e le regioni del Livello 2.",
      l2Mock: "Esame simulato", l2MockD: "50 domande in 60 minuti, come il giorno dell'esame · soglia 55%", l2Les: "Lezioni", l2LesD: "Tutto il programma, capitolo per capitolo",
      l2Fl: "Flashcard", l2FlD: "Ripassa termini, vitigni e denominazioni", l2Quiz: "Quiz per capitolo", l2QuizD: "Scegli i capitoli e allenati",
      l2Keys: "Da ricordare", l2QCh: "Quiz su questo capitolo", l2Prev: "Precedente", l2Next: "Successiva", l2Back: "Tutte le lezioni", l2All: "Tutti i capitoli",
      l2Flip: "Tocca la carta per girarla", l2Shuf: "Mescola", l2Lvl: "Livello di studio", l2Lv2: "Livello 2", l2Lv3: "Livello 3", l2Sec: "Allenamento",
      l2Time: "Tempo rimasto", l2Pass: "Superato", l2Fail: "Non ancora: serve il 55%", l2Of: "di" },
    fr: { tab_study: "Level 2", l2Kick: "Préparation à l'examen", l2Title: "Examen Level 2", l2Intro: "Leçons, quiz et flashcards sur les cépages et les régions du niveau 2.",
      l2Mock: "Examen blanc", l2MockD: "50 questions en 60 minutes, comme le jour J · seuil 55 %", l2Les: "Leçons", l2LesD: "Tout le programme, chapitre par chapitre",
      l2Fl: "Flashcards", l2FlD: "Révisez termes, cépages et appellations", l2Quiz: "Quiz par chapitre", l2QuizD: "Choisissez les chapitres et entraînez-vous",
      l2Keys: "À retenir", l2QCh: "Quiz sur ce chapitre", l2Prev: "Précédente", l2Next: "Suivante", l2Back: "Toutes les leçons", l2All: "Tous les chapitres",
      l2Flip: "Touchez la carte pour la retourner", l2Shuf: "Mélanger", l2Lvl: "Niveau étudié", l2Lv2: "Niveau 2", l2Lv3: "Niveau 3", l2Sec: "Entraînement",
      l2Time: "Temps restant", l2Pass: "Réussi", l2Fail: "Pas encore : il faut 55 %", l2Of: "sur" },
    en: { tab_study: "Level 2", l2Kick: "Exam preparation", l2Title: "Level 2 exam", l2Intro: "Lessons, quizzes and flashcards on the Level 2 grapes and regions.",
      l2Mock: "Mock exam", l2MockD: "50 questions in 60 minutes, just like exam day · pass mark 55%", l2Les: "Lessons", l2LesD: "The whole syllabus, chapter by chapter",
      l2Fl: "Flashcards", l2FlD: "Review terms, grapes and appellations", l2Quiz: "Quiz by chapter", l2QuizD: "Pick the chapters and practise",
      l2Keys: "Key points", l2QCh: "Quiz on this chapter", l2Prev: "Previous", l2Next: "Next", l2Back: "All lessons", l2All: "All chapters",
      l2Flip: "Tap the card to turn it over", l2Shuf: "Shuffle", l2Lvl: "Study level", l2Lv2: "Level 2", l2Lv3: "Level 3", l2Sec: "Practice",
      l2Time: "Time left", l2Pass: "Pass", l2Fail: "Not yet: you need 55%", l2Of: "of" }
  };
  const ES = { "Exam preparation": "Preparación del examen", "Level 2 exam": "Examen Level 2", "Lessons, quizzes and flashcards on the Level 2 grapes and regions.": "Lecciones, tests y tarjetas sobre las uvas y regiones del nivel 2.",
    "Mock exam": "Examen de prueba", "50 questions in 60 minutes, just like exam day · pass mark 55%": "50 preguntas en 60 minutos, como el día del examen · aprobado con 55 %",
    "Lessons": "Lecciones", "The whole syllabus, chapter by chapter": "Todo el programa, capítulo a capítulo", "Flashcards": "Tarjetas", "Review terms, grapes and appellations": "Repasa términos, uvas y denominaciones",
    "Quiz by chapter": "Test por capítulo", "Pick the chapters and practise": "Elige los capítulos y practica", "Key points": "Para recordar", "Quiz on this chapter": "Test de este capítulo",
    "Previous": "Anterior", "Next": "Siguiente", "All lessons": "Todas las lecciones", "All chapters": "Todos los capítulos", "Tap the card to turn it over": "Toca la tarjeta para darle la vuelta",
    "Shuffle": "Mezclar", "Study level": "Nivel de estudio", "Level 2": "Nivel 2", "Level 3": "Nivel 3", "Practice": "Práctica", "Time left": "Tiempo restante", "Pass": "Aprobado",
    "Not yet: you need 55%": "Todavía no: necesitas un 55 %", "of": "de" };
  const AR = { "Pick the chapters and practise": "Elegí los capítulos y practicá", "Review terms, grapes and appellations": "Repasá términos, uvas y denominaciones",
    "Tap the card to turn it over": "Tocá la tarjeta para darla vuelta", "Not yet: you need 55%": "Todavía no: necesitás un 55 %" };
  const X = window.TWG_ESX || (window.TWG_ESX = { es: {}, ar: {} });
  Object.assign(X.es, ES); Object.assign(X.ar, AR);
  const C = window.TWG_L2C;
  let les = null, fl = { c: "", i: 0, flip: false, order: null }, timer = null;

  function lvSwitch() {
    return `<div class="lvsw" role="group" aria-label="${esc(t("l2Lvl"))}"><span>${esc(t("l2Lvl"))}</span><button type="button" data-lvl="2" aria-pressed="true">${esc(t("l2Lv2"))}</button><button type="button" data-lvl="3" aria-pressed="false">${esc(t("l2Lv3"))}</button></div>`;
  }
  function chTitle(c) { return chName(c); }
  function lessonsOf(c) { return C.lessons.map((l, i) => [l, i]).filter(x => x[0].c === c); }

  function study() {
    const row = (attr, ic, ti, sub) => `<button type="button" class="hubrow" ${attr}><span class="hub-ic">${ICO[ic] || ""}</span><span class="hub-tx"><b>${esc(ti)}</b><span>${esc(sub)}</span></span>${ICO.chev}</button>`;
    return `<section class="view hub area-wset">${lvSw()}${hubHead("ban-wset", "l2Kick", "l2Title", "l2Intro", "n37")}
      <button type="button" class="mockcard" data-l2="exam"><span class="mk-seal"> <br><b>2</b></span><span class="mk-tx"><b>${esc(t("l2Mock"))}</b><span>${esc(t("l2MockD"))}</span></span>${ICO.chev}</button>
      <h2 class="hsec">${esc(t("l2Sec"))}</h2>
      <div class="hublist">${row('data-go="l2les"', "schemi", t("l2Les"), t("l2LesD"))}${row('data-go="practice"', "quiz", t("l2Quiz"), t("l2QuizD"))}${row('data-go="l2fl"', "grapes", t("l2Fl"), t("l2FlD"))}</div></section>`;
  }

  function lessons() {
    if (les != null && C.lessons[les]) {
      const L_ = C.lessons[les], k = L(), same = lessonsOf(L_.c), pos = same.findIndex(x => x[1] === les);
      const prev = les > 0 ? les - 1 : null, next = les < C.lessons.length - 1 ? les + 1 : null;
      return `<section class="view l2les"><p class="l2crumb"><button type="button" class="btn ghost" data-l2="list">← ${esc(t("l2Back"))}</button></p>
        <article class="card l2art"><small class="l2ch">${esc(chTitle(L_.c))} · ${pos + 1}/${same.length}</small><h2>${esc(L_.t[k])}</h2>
        ${L_.p.map(p => `<p>${esc(p[k])}</p>`).join("")}
        ${L_.k.length ? `<div class="l2keys"><h3>${esc(t("l2Keys"))}</h3><ul>${L_.k.map(x => `<li>${esc(x[k])}</li>`).join("")}</ul></div>` : ""}</article>
        <div class="row l2nav">${prev != null ? `<button type="button" class="btn" data-l2="les" data-i="${prev}">← ${esc(t("l2Prev"))}</button>` : ""}
        <button type="button" class="btn primary" data-l2="quiz" data-c="${L_.c}">${esc(t("l2QCh"))}</button>
        ${next != null ? `<button type="button" class="btn" data-l2="les" data-i="${next}">${esc(t("l2Next"))} →</button>` : ""}</div></section>`;
    }
    const k = L();
    return `<section class="view l2les">${C.groups.map(g => `<div class="group"><h3>${esc(g.n[LC()])}</h3>${g.c.map(c => {
      const ls = lessonsOf(c); if (!ls.length) return "";
      return `<details class="l2chap"><summary><b>${esc(chTitle(c))}</b><span class="mono">${ls.length}</span></summary><ol>${ls.map(([l, i]) => `<li><button type="button" class="l2link" data-l2="les" data-i="${i}">${esc(l.t[k])}</button></li>`).join("")}</ol></details>`;
    }).join("")}</div>`).join("")}</section>`;
  }

  function flash() {
    const pool = C.flash.map((f, i) => i).filter(i => !fl.c || C.flash[i].c === fl.c);
    if (!fl.order || fl.order.length !== pool.length || fl.order.some(i => !pool.includes(i))) { fl.order = pool; fl.i = 0; fl.flip = false; }
    const k = L(), n = fl.order.length, F = n ? C.flash[fl.order[fl.i]] : null;
    const opts = `<option value="">${esc(t("l2All"))}</option>` + C.groups.flatMap(g => g.c).filter(c => C.flash.some(f => f.c === c)).map(c => `<option value="${c}"${fl.c === c ? " selected" : ""}>${esc(chTitle(c))}</option>`).join("");
    return `<section class="view l2fl"><div class="row l2flbar"><select id="l2-flc" aria-label="${esc(t("l2All"))}">${opts}</select><button type="button" class="btn ghost" data-l2="fshuf">${esc(t("l2Shuf"))}</button></div>
      ${F ? `<button type="button" class="l2card${fl.flip ? " flip" : ""}" data-l2="flip" aria-live="polite"><small>${esc(chTitle(F.c))}</small><b>${esc((fl.flip ? F.b : F.f)[k])}</b><span class="l2hint">${fl.flip ? "" : esc(t("l2Flip"))}</span></button>
      <div class="row l2nav"><button type="button" class="btn" data-l2="fprev"${fl.i ? "" : " disabled"}>← ${esc(t("l2Prev"))}</button><span class="mono">${fl.i + 1} ${esc(t("l2Of"))} ${n}</span><button type="button" class="btn primary" data-l2="fnext"${fl.i < n - 1 ? "" : " disabled"}>${esc(t("l2Next"))} →</button></div>` : ""}</section>`;
  }

  function mock() {
    const ids = [];
    C.groups.forEach(g => {
      const pool = shuffle(BANK.filter(b => g.c.includes(b.c)).map(b => b.id));
      ids.push(...pool.slice(0, g.w));
    });
    let out = shuffle(ids);
    if (out.length < C.exam.questions) out = out.concat(shuffle(BANK.map(b => b.id).filter(id => !out.includes(id))).slice(0, C.exam.questions - out.length));
    startQuiz(out.slice(0, C.exam.questions), "exam", []);
    quiz.l2end = Date.now() + C.exam.minutes * 60000; tick();
  }
  function tick() {
    clearInterval(timer);
    timer = setInterval(() => {
      if (!quiz || !quiz.l2end || quiz.done) { clearInterval(timer); const e = document.getElementById("l2clock"); if (e) e.remove(); return; }
      const left = Math.max(0, quiz.l2end - Date.now()), m = Math.floor(left / 60000), s = Math.floor(left / 1000) % 60;
      let e = document.getElementById("l2clock");
      if (!e) { e = document.createElement("div"); e.id = "l2clock"; e.className = "l2clock"; document.body.appendChild(e); }
      e.textContent = `${t("l2Time")} ${m}:${String(s).padStart(2, "0")}`;
      if (!left) { quiz.done = true; clearInterval(timer); e.remove(); render(); }
    }, 1000);
  }

  document.addEventListener("click", e => {
    const b = e.target.closest("[data-l2]"); if (!b) return;
    const a = b.dataset.l2;
    if (a === "exam") return mock();
    if (a === "list") { les = null; render(); return; }
    if (a === "les") { les = +b.dataset.i; if (view !== "l2les") { view = "l2les"; } render(); window.scrollTo(0, 0); return; }
    if (a === "quiz") { const pool = shuffle(BANK.filter(x => x.c === b.dataset.c).map(x => x.id)); startQuiz(pool.slice(0, 10), "practice", [b.dataset.c]); return; }
    if (a === "flip") { fl.flip = !fl.flip; render(); return; }
    if (a === "fnext") { fl.i = Math.min(fl.i + 1, fl.order.length - 1); fl.flip = false; render(); return; }
    if (a === "fprev") { fl.i = Math.max(0, fl.i - 1); fl.flip = false; render(); return; }
    if (a === "fshuf") { fl.order = shuffle(fl.order); fl.i = 0; fl.flip = false; render(); return; }
  });
  document.addEventListener("change", e => { if (e.target && e.target.id === "l2-flc") { fl.c = e.target.value; fl.order = null; render(); } });

  function init() {
    ["it", "fr", "en"].forEach(l => Object.assign(T[l], UI[l]));
    Object.assign(TABG, { l2les: "study", l2fl: "study" }); Object.assign(SUBV, { l2les: "study", l2fl: "study" }); Object.assign(SUBT, { l2les: "l2Les", l2fl: "l2Fl" });
    const st = document.createElement("style");
    st.textContent = `.lvsw{display:flex;align-items:center;gap:6px;margin:0 0 12px;font-size:13px;color:var(--muted)}.lvsw span{margin-right:4px}
.lvsw button{border:1px solid var(--line);background:var(--surface);color:var(--fg);border-radius:999px;padding:6px 14px;font:inherit;font-weight:700;cursor:pointer}
.lvsw button[aria-pressed=true]{background:var(--wine,#7a1f3d);border-color:var(--wine,#7a1f3d);color:#fff}
.l2chap{border:1px solid var(--line);border-radius:14px;background:var(--surface);margin:8px 0;padding:0 14px}.l2chap summary{display:flex;justify-content:space-between;gap:10px;padding:13px 0;cursor:pointer}
.l2chap ol{margin:0 0 12px;padding-left:22px}.l2link{border:0;background:none;color:var(--fg);font:inherit;text-align:left;padding:6px 0;cursor:pointer;text-decoration:underline;text-decoration-color:var(--line)}
.l2art h2{margin:.2em 0 .6em}.l2art p{line-height:1.7}.l2ch{color:var(--muted);font-weight:700;letter-spacing:.04em;text-transform:uppercase;font-size:12px}
.l2keys{margin-top:16px;padding:14px 16px;border-radius:14px;background:var(--surface2,#fbf4e6);border-left:5px solid var(--gold,#c9a24a)}.l2keys h3{margin:0 0 6px;font-size:15px}.l2keys ul{margin:0;padding-left:20px;line-height:1.6}
.l2nav{justify-content:space-between;align-items:center;gap:8px;flex-wrap:wrap;margin-top:12px}.l2flbar{gap:8px;margin-bottom:12px}.l2flbar select{flex:1;min-width:0;padding:10px;border-radius:12px;border:1px solid var(--line);background:var(--surface);color:var(--fg);font:inherit}
.l2card{display:flex;flex-direction:column;justify-content:center;align-items:center;gap:12px;width:100%;min-height:260px;padding:28px 22px;border-radius:22px;border:1px solid var(--line);background:var(--surface);color:var(--fg);font:inherit;text-align:center;cursor:pointer;box-shadow:0 10px 30px rgba(0,0,0,.08)}
.l2card b{font-size:clamp(19px,4.6vw,24px);line-height:1.35}.l2card.flip{background:linear-gradient(135deg,#5c1530,#7a1f3d);color:#fff}.l2card.flip b{font-size:clamp(16px,4vw,20px);font-weight:600}.l2card small{opacity:.7;font-weight:700;text-transform:uppercase;letter-spacing:.05em;font-size:11px}.l2hint{font-size:12px;opacity:.6}
.l2clock{position:fixed;bottom:calc(env(safe-area-inset-bottom,0px) + 84px);left:50%;transform:translateX(-50%);z-index:60;background:#7a1f3d;color:#fff;border-radius:999px;padding:6px 12px;font-weight:700;font-size:13px;box-shadow:0 6px 18px rgba(0,0,0,.2)}`;
    document.head.appendChild(st);
  }
  window.L2UI = { init, study, lessons, flash, lvSwitch };
})();
