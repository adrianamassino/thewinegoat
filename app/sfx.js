/* The Wine Goat — sounds (app only). Everything is synthesised with the Web Audio API: no audio files.
   tap      soft tick on buttons, tabs, options
   correct  a short happy goat bleat + tiny chime (4 variants)     wrong  a gentle low "hm"
   streak   bleat + rising notes (3, 5, 8, 12… right in a row)     flip   paper flip of a flashcard
   complete single bleat + three notes (quiz / deck / podcast / film finished)
   fanfare  double bleat + fanfare (mock or exam passed, path step, game won)     done  two neutral notes (finished, not passed)
   Rules: nothing before the first tap; silent while a mock or timed exam is running (only the result sound plays),
   silent when the page is hidden; on/off in Settings ("Sounds"), stored in localStorage "twg-sfx" (default on, off with
   prefers-reduced-motion).  Hear them: open /app/?sfx  or run  TWG_SFX.test("bleat")  in the console,
   or tap "Try the sounds" under Settings > Sounds.
   Hooks follow ar.js: the global goatPop / cheers / mtBeep / fcFlip / fcMark / mkFinish / gradeOpen are wrapped, the rest is event delegation. */
(function () {
  "use strict";
  const KEY = "twg-sfx", MASTER = 0.5;
  const AC = window.AudioContext || window.webkitAudioContext;
  const DUR = { tap: 0.08, flip: 0.22, wrong: 0.45, done: 0.75, bleat: 0.85, correct: 0.95, streak: 1.25, complete: 1.35, fanfare: 2.2 };
  /* f = pitch (Hz), d = length (s), rate = tremolo "eh-eh-eh" (Hz), form = formant scale (smaller goat = higher), end = pitch at the end */
  const BLEATS = [
    { f: 470, d: 0.56, rate: 15, form: 1.00, end: 0.80 },
    { f: 520, d: 0.48, rate: 17, form: 1.06, end: 0.84 },
    { f: 440, d: 0.66, rate: 13.5, form: 0.96, end: 0.76 },
    { f: 560, d: 0.50, rate: 16, form: 1.10, end: 0.88 }
  ];
  function rm() { try { return matchMedia("(prefers-reduced-motion: reduce)").matches; } catch (e) { return false; } }
  function stored() { try { return localStorage.getItem(KEY); } catch (e) { return null; } }
  let on = (function () { const s = stored(); return s === "1" ? true : s === "0" ? false : !rm(); })();
  let ctx = null, bus = null, unlocked = false, lastAny = 0, lastBig = 0, lastVariant = -1;
  const last = {}, log = [];

  /* ---------- synthesis (the same graph is used live and in OfflineAudioContext for the tests) ---------- */
  function chain(c) {
    const g = c.createGain(); g.gain.value = MASTER;
    const k = c.createDynamicsCompressor(); k.threshold.value = -10; k.knee.value = 8; k.ratio.value = 6; k.attack.value = 0.003; k.release.value = 0.12;
    g.connect(k); k.connect(c.destination); return g;
  }
  function noiseBuf(c) {
    if (c._twgNoise) return c._twgNoise;
    const b = c.createBuffer(1, Math.floor(c.sampleRate * 0.6), c.sampleRate), d = b.getChannelData(0);
    let s = 22222; for (let i = 0; i < d.length; i++) { s = (s * 16807) % 2147483647; d[i] = s / 1073741823.5 - 1; }
    return (c._twgNoise = b);
  }
  function tone(c, out, t, f, d, g, type, f2) {
    const o = c.createOscillator(), e = c.createGain(); o.type = type || "sine"; o.frequency.setValueAtTime(f, t);
    if (f2) o.frequency.exponentialRampToValueAtTime(f2, t + d);
    e.gain.setValueAtTime(0.0001, t); e.gain.exponentialRampToValueAtTime(g, t + 0.012); e.gain.exponentialRampToValueAtTime(0.0001, t + d);
    o.connect(e); e.connect(out); o.start(t); o.stop(t + d + 0.03);
  }
  function bell(c, out, t, f, d, g) { tone(c, out, t, f, d, g, "sine"); tone(c, out, t, f * 2.01, d * 0.6, g * 0.28, "sine"); tone(c, out, t, f * 3.02, d * 0.35, g * 0.1, "sine"); }
  /* goat: buzzy source (saw + a little square) -> "m-eh" formants that open from a closed mouth -> fast tremolo that grows
     ("meh-eh-eh") with a matching pitch wobble, pitch rises briefly then falls. */
  function bleat(c, out, t, v, g) {
    const d = v.d, f = v.f, F = v.form, end = v.end || 0.8, peak = (g || 1) * 1.05;
    const mix = c.createGain(); mix.gain.value = 1;
    const o1 = c.createOscillator(), o2 = c.createOscillator(), g2 = c.createGain();
    o1.type = "sawtooth"; o2.type = "square"; o2.detune.value = 9; g2.gain.value = 0.3;
    [o1, o2].forEach(o => { o.frequency.setValueAtTime(f * 0.86, t); o.frequency.linearRampToValueAtTime(f * 1.05, t + 0.07);
      o.frequency.linearRampToValueAtTime(f * 0.97, t + d * 0.55); o.frequency.linearRampToValueAtTime(f * end, t + d); });
    o1.connect(mix); o2.connect(g2); g2.connect(mix);
    const lfo = c.createOscillator(); lfo.type = "sine"; lfo.frequency.setValueAtTime(v.rate, t); lfo.frequency.linearRampToValueAtTime(v.rate * 0.82, t + d);
    const vib = c.createGain(); vib.gain.setValueAtTime(f * 0.008, t); vib.gain.linearRampToValueAtTime(f * 0.04, t + 0.13);
    lfo.connect(vib); vib.connect(o1.frequency); vib.connect(o2.frequency);
    const sum = c.createGain(); sum.gain.value = 1;
    [[300, 730 * F, 5, 1.0], [1150, 1880 * F, 8, 0.85], [2500, 2750 * F, 9, 0.4]].forEach(p => {
      const b = c.createBiquadFilter(), bg = c.createGain(); b.type = "bandpass"; b.Q.value = p[2]; bg.gain.value = p[3];
      b.frequency.setValueAtTime(p[0], t); b.frequency.exponentialRampToValueAtTime(p[1], t + 0.085); b.frequency.setValueAtTime(p[1], t + d * 0.7); b.frequency.exponentialRampToValueAtTime(p[1] * 0.9, t + d);
      mix.connect(b); b.connect(bg); bg.connect(sum); });
    const lp = c.createBiquadFilter(), lg = c.createGain(); lp.type = "lowpass"; lp.frequency.value = 900; lg.gain.value = 0.1; mix.connect(lp); lp.connect(lg); lg.connect(sum);
    const n = c.createBufferSource(), nb = c.createBiquadFilter(), ng = c.createGain(); n.buffer = noiseBuf(c); n.loop = true; nb.type = "bandpass"; nb.frequency.value = 2600; nb.Q.value = 0.9; ng.gain.value = 0.05;
    n.connect(nb); nb.connect(ng); ng.connect(sum);
    const trem = c.createGain(), td = c.createGain(); trem.gain.value = 0.6;
    td.gain.setValueAtTime(0.03, t); td.gain.linearRampToValueAtTime(0.4, t + 0.13); lfo.connect(td); td.connect(trem.gain);
    const env = c.createGain(); env.gain.setValueAtTime(0.0001, t); env.gain.exponentialRampToValueAtTime(peak, t + 0.04);
    env.gain.setValueAtTime(peak, t + d - 0.11); env.gain.exponentialRampToValueAtTime(0.0001, t + d);
    sum.connect(trem); trem.connect(env); env.connect(out);
    [o1, o2, lfo, n].forEach(x => { x.start(t); x.stop(t + d + 0.03); });
  }
  function hiss(c, out, t, d, f1, f2, g, q) {
    const n = c.createBufferSource(), b = c.createBiquadFilter(), e = c.createGain(); n.buffer = noiseBuf(c); b.type = "bandpass"; b.Q.value = q || 1.2;
    b.frequency.setValueAtTime(f1, t); b.frequency.exponentialRampToValueAtTime(f2, t + d);
    e.gain.setValueAtTime(0.0001, t); e.gain.exponentialRampToValueAtTime(g, t + d * 0.3); e.gain.exponentialRampToValueAtTime(0.0001, t + d);
    n.connect(b); b.connect(e); e.connect(out); n.start(t, (t * 7.3) % 0.4); n.stop(t + d + 0.02);
  }
  function variant(i) { if (i == null) { do { i = Math.floor(Math.random() * BLEATS.length); } while (i === lastVariant); lastVariant = i; } return BLEATS[((i % BLEATS.length) + BLEATS.length) % BLEATS.length]; }
  const SND = {
    tap(c, o, t) { tone(c, o, t, 1250, 0.035, 0.3, "sine", 620); hiss(c, o, t, 0.012, 3200, 2400, 0.05, 0.8); },
    flip(c, o, t) { hiss(c, o, t, 0.075, 1300, 4200, 0.42, 1.1); hiss(c, o, t + 0.07, 0.085, 3600, 1500, 0.24, 1.4); },
    wrong(c, o, t) {
      const f = c.createBiquadFilter(); f.type = "lowpass"; f.frequency.value = 520; f.Q.value = 0.7; f.connect(o);
      [[196, 150, 0.24, "triangle"], [392, 300, 0.05, "sine"]].forEach(p => { const os = c.createOscillator(), e = c.createGain(); os.type = p[3];
        os.frequency.setValueAtTime(p[0], t); os.frequency.exponentialRampToValueAtTime(p[1], t + 0.34);
        e.gain.setValueAtTime(0.0001, t); e.gain.exponentialRampToValueAtTime(p[2], t + 0.05); e.gain.setValueAtTime(p[2], t + 0.14); e.gain.exponentialRampToValueAtTime(0.0001, t + 0.38);
        os.connect(e); e.connect(f); os.start(t); os.stop(t + 0.42); });
    },
    done(c, o, t) { bell(c, o, t, 587.33, 0.3, 0.13); bell(c, o, t + 0.16, 698.46, 0.5, 0.13); },
    bleat(c, o, t, i) { bleat(c, o, t, variant(i), 1); },
    correct(c, o, t, i) { const v = variant(i); bell(c, o, t, 1318.5, 0.2, 0.1); bell(c, o, t + 0.07, 1975.5, 0.3, 0.08); bleat(c, o, t + 0.06, v, 1); },
    streak(c, o, t, i) { const v = variant(i); bleat(c, o, t, v, 1); [783.99, 987.77, 1174.66, 1567.98].forEach((f, k) => bell(c, o, t + v.d * 0.75 + k * 0.085, f, k === 3 ? 0.42 : 0.2, 0.1)); },
    complete(c, o, t, i) { const v = variant(i); bleat(c, o, t, v, 1); [659.25, 783.99, 1046.5].forEach((f, k) => bell(c, o, t + v.d * 0.8 + k * 0.11, f, k === 2 ? 0.5 : 0.24, 0.12)); },
    fanfare(c, o, t) {
      bleat(c, o, t, { f: 500, d: 0.3, rate: 17, form: 1.02, end: 0.92 }, 0.95);
      bleat(c, o, t + 0.36, { f: 545, d: 0.7, rate: 14.5, form: 1.04, end: 0.82 }, 1);
      const s = t + 0.8; [523.25, 659.25, 783.99].forEach((f, k) => { tone(c, o, s + k * 0.1, f, 0.2, 0.14, "triangle"); bell(c, o, s + k * 0.1, f * 2, 0.2, 0.07); });
      [523.25, 659.25, 783.99, 1046.5].forEach((f, k) => { tone(c, o, s + 0.32, f, 0.95, k === 3 ? 0.12 : 0.085, "triangle"); bell(c, o, s + 0.32, f * 2, 0.8, 0.05); });
    }
  };

  /* ---------- playback rules ---------- */
  function examOn() {
    try { if (quiz && quiz.mode === "exam" && !quiz.done) return true; } catch (e) {}
    try { if (view === "exam" && MK && MK.go && !MK.fin) return true; } catch (e) {}
    try { return !!document.querySelector("#l2clock,#d4clock,.d4papv"); } catch (e) { return false; }
  }
  function mediaOn() { try { return [...document.querySelectorAll("audio,video")].some(m => !m.paused && !m.ended && !m.muted); } catch (e) { return false; } }
  const RESULT = { fanfare: 1, complete: 1, done: 1 };
  function ensure() {
    if (!on || !AC || !unlocked) return null;
    if (!ctx) { try { ctx = new AC(); bus = chain(ctx); } catch (e) { ctx = null; return null; } }
    if (ctx.state !== "running") { try { const p = ctx.resume(); if (p && p.catch) p.catch(() => {}); } catch (e) {} }
    return ctx;
  }
  function play(name, opt) {
    opt = opt || {};
    if (!SND[name] || !on) return false;
    if (document.hidden) return false;
    if (!opt.force && !RESULT[name] && examOn()) return false;
    const now = Date.now();
    if (!opt.force) {
      if (name === "tap" && now - (last.tap || 0) < 70) return false;
      if (now - (last[name] || 0) < (RESULT[name] || name === "streak" ? 900 : 90)) return false;
      if (RESULT[name] && now - lastBig < 1600) return false;
      if ((name === "correct" || name === "wrong") && now - lastBig < 500) return false;
    }
    const c = ensure(); if (!c) return false;
    try { SND[name](c, bus, c.currentTime + 0.012, opt.variant); } catch (e) { return false; }
    last[name] = now; if (name !== "tap") lastAny = performance.now(); if (RESULT[name] || name === "streak") lastBig = now;
    log.push({ n: name, t: now }); if (log.length > 60) log.shift();
    return true;
  }
  function setOn(v) {
    on = !!v; try { localStorage.setItem(KEY, on ? "1" : "0"); } catch (e) {}
    if (!on && ctx) { try { ctx.close(); } catch (e) {} ctx = null; bus = null; }
    paint();
  }
  function render(name, i) {   /* offline render of one sound -> {sr, pcm[]} (tests, WAV export) */
    const OC = window.OfflineAudioContext || window.webkitOfflineAudioContext, sr = 44100, c = new OC(1, Math.ceil(sr * (DUR[name] || 1)), sr);
    const keep = lastVariant; SND[name](c, chain(c), 0.01, i == null ? 0 : i); lastVariant = keep;
    return c.startRendering().then(b => ({ sr, pcm: Array.from(b.getChannelData(0)) }));
  }

  /* ---------- settings row + test panel ---------- */
  const TX = {
    it: ["Suoni", "Attivi", "Spenti", "Un tocco leggero sui pulsanti e la capra che bela quando rispondi bene. Sempre in silenzio durante gli esami simulati.", "Prova i suoni"],
    fr: ["Sons", "Activés", "Coupés", "Un petit clic sur les boutons et la chèvre qui bêle quand tu réponds juste. Toujours silencieux pendant les examens blancs.", "Essayer les sons"],
    en: ["Sounds", "On", "Off", "A soft tick on buttons and the goat bleats when you get it right. Always silent during mock exams.", "Try the sounds"],
    es: ["Sonidos", "Activados", "Apagados", "Un toque suave en los botones y la cabra que bala cuando aciertas. Siempre en silencio durante los simulacros de examen.", "Probar los sonidos"],
    "es-ar": ["Sonidos", "Activados", "Apagados", "Un toque suave en los botones y la cabra que bala cuando acertás. Siempre en silencio durante los simulacros de examen.", "Probar los sonidos"],
    de: ["Töne", "An", "Aus", "Ein leises Klicken bei Tasten, und die Ziege meckert, wenn du richtig liegst. Bei Probeprüfungen immer stumm.", "Töne ausprobieren"],
    nl: ["Geluiden", "Aan", "Uit", "Een zacht tikje bij knoppen en de geit mekkert als je het goed hebt. Altijd stil tijdens proefexamens.", "Geluiden proberen"],
    el: ["Ήχοι", "Ενεργοί", "Κλειστοί", "Ένα απαλό κλικ στα κουμπιά και η κατσίκα βελάζει όταν απαντάς σωστά. Πάντα σίγαση στις δοκιμαστικές εξετάσεις.", "Δοκίμασε τους ήχους"],
    ja: ["サウンド", "オン", "オフ", "ボタンをタップすると小さな音が鳴り、正解するとヤギが鳴きます。模擬試験中は常に無音です。", "サウンドを試す"],
    ko: ["소리", "켜기", "끄기", "버튼을 누르면 작은 소리가 나고, 정답을 맞히면 염소가 웁니다. 모의시험 중에는 항상 무음입니다.", "소리 들어 보기"],
    "zh-hant": ["音效", "開啟", "關閉", "點按按鈕時有輕柔的提示音，答對時山羊會咩咩叫。模擬考試期間一律靜音。", "試聽音效"],
    pt: ["Sons", "Ligados", "Desligados", "Um toque suave nos botões e a cabra bale quando acertas. Sempre em silêncio durante os exames simulados.", "Experimentar os sons"],
    tr: ["Sesler", "Açık", "Kapalı", "Düğmelerde hafif bir tık sesi; doğru bildiğinde keçi meler. Deneme sınavlarında her zaman sessiz.", "Sesleri dene"],
    th: ["เสียง", "เปิด", "ปิด", "เสียงแตะเบา ๆ ที่ปุ่ม และแพะจะร้องเมื่อคุณตอบถูก เงียบเสมอระหว่างการสอบจำลอง", "ลองฟังเสียง"]
  };
  function tx() { let l = "en"; try { if (typeof lang !== "undefined") l = lang; } catch (e) {} return TX[l] || TX.en; }
  function paint() {
    const r = document.getElementById("sfx-row"); if (!r) return; const x = tx();
    r.innerHTML = "<b>" + (on ? "🔊" : "🔇") + " " + x[0] + '</b><div class="seg big" role="group" aria-label="' + x[0] + '">' +
      '<button type="button" data-sfx="1" aria-pressed="' + on + '">🔊 ' + x[1] + '</button><button type="button" data-sfx="0" aria-pressed="' + !on + '">🔇 ' + x[2] + "</button></div>" +
      '<span class="muted">' + x[3] + '</span><button type="button" class="btn sm" data-sfxp="1" style="align-self:flex-start">🐐 ' + x[4] + "</button>";
    r.dataset.l = tx()[0] + on;
  }
  function row() {
    const s = document.querySelector("#main section.setv"); if (!s) return;
    let r = document.getElementById("sfx-row");
    if (r && r.dataset.l === tx()[0] + on) return;
    if (!r) { r = document.createElement("div"); r.className = "setrow"; r.id = "sfx-row";
      const rows = s.querySelectorAll(".setrow"), ref = rows[3] || document.getElementById("reset-zone");   /* after goal, language, theme */
      if (ref && ref.parentNode === s) s.insertBefore(r, ref); else s.appendChild(r); }
    paint();
  }
  function panel() {
    if (document.getElementById("sfx-panel")) return;
    const p = document.createElement("div"); p.id = "sfx-panel"; p.setAttribute("role", "dialog"); p.setAttribute("aria-label", "Sound test");
    p.style.cssText = "position:fixed;left:8px;right:8px;bottom:8px;z-index:99999;background:#fff;color:#2a1a1e;border:2px solid #7a1f3d;border-radius:16px;padding:12px;box-shadow:0 10px 30px rgba(0,0,0,.3);font:600 14px/1.3 system-ui,sans-serif;max-width:460px;margin:0 auto";
    const b = (l, a) => '<button type="button" data-sfxt="' + a + '" style="margin:3px;padding:9px 11px;border-radius:10px;border:1px solid #c9a457;background:#fbf4e6;color:#2a1a1e;font:inherit">' + l + "</button>";
    p.innerHTML = '<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:6px"><span>🐐 Sound test</span><button type="button" data-sfxt="x" aria-label="Close" style="border:0;background:none;font-size:20px;color:inherit">✕</button></div>' +
      b("tap", "tap") + b("flip", "flip") + b("wrong", "wrong") + b("done", "done") + "<br>" + BLEATS.map((_, i) => b("bleat " + (i + 1), "bleat:" + i)).join("") + "<br>" +
      BLEATS.map((_, i) => b("correct " + (i + 1), "correct:" + i)).join("") + "<br>" + b("streak", "streak") + b("complete", "complete") + b("fanfare", "fanfare");
    document.body.appendChild(p);
  }

  /* ---------- hooks ---------- */
  function wrap() {
    /* quiz answer (practice, errors, path lessons: every level) — goatPop is not called in exam mode */
    try { if (typeof goatPop === "function") { const g = goatPop; goatPop = function (ok, streak) { try { play(ok ? ((streak === 3 || streak === 5 || (streak >= 8 && streak % 4 === 0)) ? "streak" : "correct") : "wrong"); } catch (e) {} return g.apply(this, arguments); }; } } catch (e) {}
    /* games: the old beep becomes the goat (the game's own sound checkbox still applies) */
    try { if (typeof mtBeep === "function") { const m = mtBeep; mtBeep = function (ok) { let s = true; try { s = mtSnd; } catch (e) {} if (!s) return; if (on) { play(ok ? "correct" : "wrong"); return; } if (stored() === "0") return; return m.apply(this, arguments); }; } } catch (e) {}
    /* confetti: 30 = quiz finished, 36+ = game won / mock or path step passed, 14–18 = podcast or film finished */
    try { if (typeof cheers === "function") { const c = cheers; cheers = function (n) { try { n = n || 34;
        if (n >= 36) play("fanfare");
        else if (n >= 30) { const sc = document.querySelector("#main .result-score"); let r = 1; try { const a = quiz.items.filter(x => x.pick !== null); r = a.length ? a.filter(x => x.pick === 0).length / a.length : 0; } catch (e) {}
          if (sc && sc.classList.contains("fail")) play("done"); else if (sc && sc.classList.contains("pass")) play("fanfare"); else play(r >= 0.6 ? "complete" : "done"); }
        else if (n >= 14) play("complete");
      } catch (e) {} return c.apply(this, arguments); }; } } catch (e) {}
    try { if (typeof fcFlip === "function") { const f = fcFlip; fcFlip = function () { play("flip"); return f.apply(this, arguments); }; } } catch (e) {}
    try { if (typeof fcMark === "function") { const f = fcMark; fcMark = function () { const r = f.apply(this, arguments); try { if (FCX && FCX.i >= FCX.list.length) play("complete"); } catch (e) {} return r; }; } } catch (e) {}
    /* written answer marked (level 3 open questions, Diploma): sufficient (55 %) = fanfare, otherwise two neutral notes */
    try { if (typeof gradeOpen === "function") { const f = gradeOpen; gradeOpen = function (id) { const ts = () => { try { const a = OA[id] || []; return a.length ? a[a.length - 1] : null; } catch (e) { return null; } }, a0 = ts();
        const r = f.apply(this, arguments); Promise.resolve(r).then(() => { try { const a = ts(); if (a && a !== a0 && a.m) play(a.s / a.m >= 0.55 ? "fanfare" : "done"); } catch (e) {} }, () => {}); return r; }; } } catch (e) {}
    try { if (typeof mkFinish === "function") { const f = mkFinish; mkFinish = function () { const r = f.apply(this, arguments); Promise.resolve(r).then(() => { try { play(MK && MK.res && MK.res.ok ? "fanfare" : "done"); } catch (e) {} }, () => {}); return r; }; } } catch (e) {}
  }
  const TAP = 'button,[role="button"],[role="tab"],a.btn,summary,input[type="checkbox"],input[type="radio"],select,[data-go],[data-rgo]';
  function gesture() { if (unlocked) return; unlocked = true; ensure(); }
  function click(e) {
    const el = e.target && e.target.closest ? e.target : null; if (!el) return;
    const t = el.closest("[data-sfxt]");
    if (t) { const a = t.dataset.sfxt.split(":"); if (a[0] === "x") { const p = document.getElementById("sfx-panel"); if (p) p.remove(); } else { unlocked = true; if (!on) setOn(true); play(a[0], { force: true, variant: a[1] == null ? undefined : +a[1] }); } return; }
    if (el.closest("[data-sfxp]")) { unlocked = true; panel(); play("tap", { force: true }); return; }
    const s = el.closest("[data-sfx]");
    if (s) { const v = s.dataset.sfx === "1"; if (v) { unlocked = true; setOn(true); play("bleat", { force: true }); } else setOn(false); return; }
    if (!on) return; gesture();
    const b = el.closest(TAP); if (!b || b.disabled || b.getAttribute("aria-disabled") === "true") return;
    const at = Math.min(e.timeStamp || 0, performance.now()) - 1;   /* when the tap happened, before any handler ran */
    if (b.matches('[data-l2="flip"],[data-d4="flip"]')) { play("flip"); return; }
    if (b.matches('[data-l2="mc"],[data-d4="mc"]')) {   /* pair-matching in levels 1, 2, spirits, diploma */
      const n0 = document.querySelectorAll(".l2mc.ok").length;
      setTimeout(() => { if (document.querySelector(".l2mc.bad")) play("wrong"); else if (document.querySelectorAll(".l2mc.ok").length > n0) play(document.querySelector(".l2done") ? "complete" : "correct"); else play("tap"); }, 0); return; }
    if (b.matches('[data-d4="psub"]')) { setTimeout(() => { const r = document.querySelector("#main .result-score"); if (r) play(r.classList.contains("fail") ? "done" : "fanfare"); }, 60); return; }
    /* the tick waits one task: if the tap produced a verdict / flip / result sound, that one is enough */
    setTimeout(() => { if (lastAny >= at || mediaOn()) return; play("tap"); }, 0);
  }
  function init() {
    wrap();
    ["pointerdown", "touchend", "keydown"].forEach(ev => document.addEventListener(ev, gesture, { capture: true, passive: true }));
    document.addEventListener("click", click, true);
    document.addEventListener("visibilitychange", () => { if (!ctx) return; try { if (document.hidden) ctx.suspend(); else if (on) ctx.resume(); } catch (e) {} });
    const m = document.getElementById("main");
    if (m && window.MutationObserver) { new MutationObserver(row).observe(m, { childList: true, subtree: true }); row(); }
    if (/[?&]sfx\b/.test(location.search)) panel();
  }
  window.TWG_SFX = {
    names: Object.keys(SND), variants: BLEATS.length, log,
    get enabled() { return on; }, set: setOn, play, render, panel, examOn,
    test(name, i) { unlocked = true; const o = on; on = true; const r = play(name || "bleat", { force: true, variant: i }); on = o; return r; },
    state() { return { on, unlocked, ctx: ctx ? ctx.state : null, exam: examOn(), hidden: document.hidden }; }
  };
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init); else init();
})();
