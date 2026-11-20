/* The Wine Goat — result of the home quiz (a fixed set of 20 questions per theme) (assets/homequiz.js), shown in the app once the visitor has an account.
   The home page saves the result in localStorage "twg-hq-result" (same origin): {v,theme,score,total,topics:{topic:[right,asked]},ts,lang,home,seen}
   and sends the visitor here with #go=signup. After sign-up / sign-in this file shows: score (x/20) and %, a level reading,
   3–5 recommendations from the weakest topics (links to the matching level of the app), and an estimated preparation time
   (1 / 2 / 3 hours a day), and for wine and spirits a button to the app's existing 50-question mock exam
   (Level 2 / Spirits 2: same mock as the study hub, nothing new). The result is also saved in the account (table user_docs, doc_id "homequiz/last": the same
   per-user document store as the progress, no schema change); if that fails it simply stays on the device.
   #go=hqresult shows the last result again. Texts: it / fr / en / es / es-ar here; the map-based languages translate the
   English text through TWG_I18N (tools/i18n, scope core). */
(function () {
  "use strict";
  const KEY = "twg-hq-result", DOC = "homequiz/last";
  const D = {
    it: { kick: "Il risultato del tuo quiz", thWine: "Vino", thBeer: "Birra", thSpirits: "Distillati", thSake: "Sake", thMix: "Mix",
      sc: "{n} risposte giuste su {t}", lvK: "Il tuo livello", lvW: "Vino Livello {n}", lvS: "Distillati Livello {n}",
      rA: "Sei all'inizio: comincia da {L1}, le basi.", rB: "Hai buone basi: puoi iniziare {L2}.",
      rC: "Sei vicino al livello d'esame: rinforza i tuoi punti deboli in {L2}.", rD: "Ottimo: sembri pronto per l'esame di {L2} e puoi iniziare {L3}.",
      gA: "Sei all'inizio: è il momento giusto per imparare le basi.", gB: "Hai buone basi e conosci l'essenziale.",
      gC: "Conoscenze solide: restano pochi argomenti da rifinire.", gD: "Ottimo: conosci davvero bene l'argomento.",
      tpK: "Il tuo punteggio per argomento", rcK: "Cosa fare adesso",
      rcT: "{g}: {c}/{n} giuste. Ripassa le lezioni, poi fai il quiz del capitolo.", rcQ: "{g}: {c}/{n} giuste. Rileggi le spiegazioni e rifai il quiz.",
      rcStart: "Parti dalle prime lezioni di {L}: capitoli brevi, ognuno con il suo quiz.", rcMock: "Quando i punti deboli superano il 70%, fai un esame simulato in {L}.",
      rcNext: "Puoi andare oltre: inizia {L}.", rcCourse: "I corsi dell'app riguardano vino e distillati: un buon passo successivo è {L}.",
      rcAll: "Nessun punto debole: complimenti! Tieni fresca la memoria con un quiz misto ogni pochi giorni.",
      rcDaily: "Meglio poco ogni giorno: {d} h al giorno valgono più di una lunga sessione a settimana.",
      mock: "Fai l'esame simulato completo da 50 domande ({L})", open: "Apri {L}", back: "Torna al quiz", tmK: "Tempo di preparazione stimato", tmL: "Per arrivare pronti all'esame di {L}",
      tgL: "Per raggiungere un solido livello intermedio", taL: "Per raggiungere un livello avanzato", w1: "circa 1 settimana", wN: "circa {w} settimane",
      tmH: "≈ {h} ore di studio in totale, con {d} h al giorno, 6 giorni a settimana.", tmN: "È una stima, non una promessa: dipende dal tuo ritmo e dal tuo corso.",
      pace: "Tempo di studio al giorno:", paceB: "{d} h", cta: "Continua nell'app", svA: "Salvato nel tuo account.", svL: "Salvato su questo dispositivo.",
      gate: "Crea il tuo account gratuito per vedere il punteggio e il tuo piano personalizzato.", close: "Chiudi",
      w_grapes: "Vitigni", w_regions: "Regioni del vino", w_winemaking: "Vigna e vinificazione", w_styles: "Spumanti, vini dolci e fortificati",
      w_service: "Conservazione, servizio e abbinamenti", w_tasting: "Degustazione", s_production: "Distillazione e invecchiamento", s_whisky: "Whisky",
      s_brandy: "Cognac e distillati di frutta", s_cane: "Rum e Tequila", s_white: "Vodka, gin e liquori", s_cocktails: "Cocktail",
      b_ingredients: "Ingredienti della birra", b_brewing: "Produzione della birra", b_styles: "Stili di birra", b_service: "Servizio e degustazione della birra",
      k_ingredients: "Riso, koji e acqua", k_brewing: "Produzione del sake", k_styles: "Stili e categorie di sake", k_service: "Servizio del sake" },
    fr: { kick: "Le résultat de votre quiz", thWine: "Vin", thBeer: "Bière", thSpirits: "Spiritueux", thSake: "Saké", thMix: "Mix",
      sc: "{n} bonnes réponses sur {t}", lvK: "Votre niveau", lvW: "Vin Niveau {n}", lvS: "Spiritueux Niveau {n}",
      rA: "Vous débutez : commencez par {L1}, les bases.", rB: "Vous avez de bonnes bases : vous pouvez commencer {L2}.",
      rC: "Vous êtes proche du niveau de l'examen : renforcez vos points faibles dans {L2}.", rD: "Excellent : vous semblez au niveau de l'examen de {L2} et pouvez commencer {L3}.",
      gA: "Vous débutez : c'est le bon moment pour apprendre les bases.", gB: "Vous avez de bonnes bases et connaissez l'essentiel.",
      gC: "Des connaissances solides : il reste quelques sujets à peaufiner.", gD: "Excellent : vous connaissez vraiment bien le sujet.",
      tpK: "Votre score par thème", rcK: "Que faire maintenant",
      rcT: "{g} : {c}/{n} bonnes réponses. Revoyez les leçons, puis faites le quiz du chapitre.", rcQ: "{g} : {c}/{n} bonnes réponses. Relisez les explications et refaites le quiz.",
      rcStart: "Commencez par les premières leçons de {L} : des chapitres courts, chacun avec son quiz.", rcMock: "Quand vos points faibles dépassent 70 %, faites un examen blanc dans {L}.",
      rcNext: "Vous pouvez aller plus loin : commencez {L}.", rcCourse: "Les cours de l'appli portent sur le vin et les spiritueux : une bonne suite est {L}.",
      rcAll: "Aucun point faible : bravo ! Entretenez vos connaissances avec un quiz mixte tous les quelques jours.",
      rcDaily: "Mieux vaut un peu chaque jour : {d} h par jour valent mieux qu'une longue séance par semaine.",
      mock: "Passer l'examen blanc complet de 50 questions ({L})", open: "Ouvrir {L}", back: "Retour au quiz", tmK: "Temps de préparation estimé", tmL: "Pour arriver au niveau de l'examen de {L}",
      tgL: "Pour atteindre un solide niveau intermédiaire", taL: "Pour atteindre un niveau avancé", w1: "environ 1 semaine", wN: "environ {w} semaines",
      tmH: "≈ {h} heures d'étude au total, à raison de {d} h par jour, 6 jours par semaine.", tmN: "C'est une estimation, pas une promesse : elle dépend de votre rythme et de votre cours.",
      pace: "Temps d'étude par jour :", paceB: "{d} h", cta: "Continuer dans l'appli", svA: "Enregistré dans votre compte.", svL: "Enregistré sur cet appareil.",
      gate: "Créez votre compte gratuit pour voir votre score et votre plan personnalisé.", close: "Fermer",
      w_grapes: "Cépages", w_regions: "Régions viticoles", w_winemaking: "Vigne et vinification", w_styles: "Effervescents, vins doux et vins mutés",
      w_service: "Conservation, service et accords", w_tasting: "Dégustation", s_production: "Distillation et vieillissement", s_whisky: "Whisky",
      s_brandy: "Cognac et eaux-de-vie de fruits", s_cane: "Rhum et Tequila", s_white: "Vodka, gin et liqueurs", s_cocktails: "Cocktails",
      b_ingredients: "Ingrédients de la bière", b_brewing: "Brassage", b_styles: "Styles de bière", b_service: "Service et dégustation de la bière",
      k_ingredients: "Riz, koji et eau", k_brewing: "Élaboration du saké", k_styles: "Styles et catégories de saké", k_service: "Service du saké" },
    en: { kick: "Your quiz result", thWine: "Wine", thBeer: "Beer", thSpirits: "Spirits", thSake: "Sake", thMix: "Mix",
      sc: "{n} out of {t} correct", lvK: "Your level", lvW: "Wine Level {n}", lvS: "Spirits Level {n}",
      rA: "You are just starting out: begin with {L1}, the foundations.", rB: "You have good basics: you look ready to start {L2}.",
      rC: "You are close to exam standard: strengthen your weak topics in {L2}.", rD: "Excellent: you look ready for the {L2} exam and can start {L3}.",
      gA: "You are just starting out: a great moment to learn the basics.", gB: "You have good basics and know the essentials.",
      gC: "Solid knowledge: just a few topics left to polish.", gD: "Excellent: you really know your subject.",
      tpK: "Your score by topic", rcK: "What to do next",
      rcT: "{g}: {c}/{n} correct. Go through the lessons, then take the chapter quiz.", rcQ: "{g}: {c}/{n} correct. Read the explanations again and retake the quiz.",
      rcStart: "Start with the first lessons of {L}: short chapters, each with its own quiz.", rcMock: "When your weak topics are above 70%, take a mock exam in {L}.",
      rcNext: "You are ready for more: start {L}.", rcCourse: "The courses in the app cover wine and spirits: a good next step is {L}.",
      rcAll: "No weak topic: well done! Keep it fresh with a mixed quiz every few days.",
      rcDaily: "A little every day works best: {d} h a day beats one long session a week.",
      mock: "Take the full 50-question mock exam ({L})", open: "Open {L}", back: "Back to the quiz", tmK: "Estimated preparation time", tmL: "To be ready for the {L} exam",
      tgL: "To reach a solid intermediate level", taL: "To reach an advanced level", w1: "about 1 week", wN: "about {w} weeks",
      tmH: "≈ {h} hours of study in total, at {d} h a day, 6 days a week.", tmN: "This is an estimate, not a promise: it depends on your pace and on your course.",
      pace: "Study time per day:", paceB: "{d} h", cta: "Continue to the app", svA: "Saved to your account.", svL: "Saved on this device.",
      gate: "Create your free account to see your score and your personalised plan.", close: "Close",
      w_grapes: "Grape varieties", w_regions: "Wine regions", w_winemaking: "Vineyard and winemaking", w_styles: "Sparkling, sweet and fortified wines",
      w_service: "Storage, service and food pairing", w_tasting: "Tasting", s_production: "Distillation and maturation", s_whisky: "Whisky",
      s_brandy: "Cognac and fruit spirits", s_cane: "Rum and Tequila", s_white: "Vodka, gin and liqueurs", s_cocktails: "Cocktails",
      b_ingredients: "Beer ingredients", b_brewing: "Brewing", b_styles: "Beer styles", b_service: "Serving and tasting beer",
      k_ingredients: "Rice, koji and water", k_brewing: "Sake brewing", k_styles: "Sake styles and grades", k_service: "Serving sake" }
  };
  /* Spanish (es) and the Río de la Plata variant (only the keys that differ) */
  const ES = { kick: "El resultado de tu quiz", thWine: "Vino", thBeer: "Cerveza", thSpirits: "Destilados", thSake: "Sake", thMix: "Mix",
    sc: "{n} respuestas correctas de {t}", lvK: "Tu nivel", lvW: "Vino Nivel {n}", lvS: "Destilados Nivel {n}",
    rA: "Estás empezando: comienza por {L1}, las bases.", rB: "Tienes buenas bases: puedes empezar {L2}.",
    rC: "Estás cerca del nivel del examen: refuerza tus puntos débiles en {L2}.", rD: "Excelente: pareces a punto para el examen de {L2} y puedes empezar {L3}.",
    gA: "Estás empezando: es un buen momento para aprender las bases.", gB: "Tienes buenas bases y conoces lo esencial.",
    gC: "Conocimientos sólidos: quedan pocos temas por pulir.", gD: "Excelente: conoces muy bien el tema.",
    tpK: "Tu resultado por tema", rcK: "Qué hacer ahora",
    rcT: "{g}: {c}/{n} correctas. Repasa las lecciones y luego haz el quiz del capítulo.", rcQ: "{g}: {c}/{n} correctas. Vuelve a leer las explicaciones y repite el quiz.",
    rcStart: "Empieza por las primeras lecciones de {L}: capítulos cortos, cada uno con su quiz.", rcMock: "Cuando tus puntos débiles superen el 70 %, haz un examen de prueba en {L}.",
    rcNext: "Puedes ir más lejos: empieza {L}.", rcCourse: "Los cursos de la app tratan de vino y destilados: un buen siguiente paso es {L}.",
    rcAll: "Ningún punto débil: ¡enhorabuena! Mantén la memoria fresca con un quiz mixto cada pocos días.",
    rcDaily: "Mejor un poco cada día: {d} h al día valen más que una sesión larga a la semana.",
    mock: "Haz el examen de prueba completo de 50 preguntas ({L})", open: "Abrir {L}", back: "Volver al quiz", tmK: "Tiempo de preparación estimado", tmL: "Para llegar a punto al examen de {L}",
    tgL: "Para alcanzar un nivel intermedio sólido", taL: "Para alcanzar un nivel avanzado", w1: "alrededor de 1 semana", wN: "alrededor de {w} semanas",
    tmH: "≈ {h} horas de estudio en total, con {d} h al día, 6 días a la semana.", tmN: "Es una estimación, no una promesa: depende de tu ritmo y de tu curso.",
    pace: "Tiempo de estudio al día:", paceB: "{d} h", cta: "Seguir en la app", svA: "Guardado en tu cuenta.", svL: "Guardado en este dispositivo.",
    gate: "Crea tu cuenta gratuita para ver tu puntuación y tu plan personalizado.", close: "Cerrar",
    w_grapes: "Variedades de uva", w_regions: "Regiones vinícolas", w_winemaking: "Viña y vinificación", w_styles: "Espumosos, vinos dulces y fortificados",
    w_service: "Conservación, servicio y maridaje", w_tasting: "Cata", s_production: "Destilación y envejecimiento", s_whisky: "Whisky",
    s_brandy: "Cognac y destilados de fruta", s_cane: "Ron y Tequila", s_white: "Vodka, ginebra y licores", s_cocktails: "Cócteles",
    b_ingredients: "Ingredientes de la cerveza", b_brewing: "Elaboración de la cerveza", b_styles: "Estilos de cerveza", b_service: "Servicio y cata de la cerveza",
    k_ingredients: "Arroz, koji y agua", k_brewing: "Elaboración del sake", k_styles: "Estilos y categorías de sake", k_service: "Servicio del sake" };
  const AR = { rA: "Estás empezando: arrancá por {L1}, las bases.", rB: "Tenés buenas bases: podés empezar {L2}.",
    rC: "Estás cerca del nivel del examen: reforzá tus puntos débiles en {L2}.", rD: "Excelente: parecés a punto para el examen de {L2} y podés empezar {L3}.",
    gB: "Tenés buenas bases y conocés lo esencial.", gD: "Excelente: conocés muy bien el tema.",
    rcT: "{g}: {c}/{n} correctas. Repasá las lecciones y después hacé el quiz del capítulo.", rcQ: "{g}: {c}/{n} correctas. Volvé a leer las explicaciones y repetí el quiz.",
    rcStart: "Empezá por las primeras lecciones de {L}: capítulos cortos, cada uno con su quiz.", rcMock: "Cuando tus puntos débiles superen el 70 %, hacé un examen de prueba en {L}.",
    rcNext: "Podés ir más lejos: empezá {L}.", rcAll: "Ningún punto débil: ¡felicitaciones! Mantené la memoria fresca con un quiz mixto cada pocos días.",
    rcDaily: "Mejor un poco cada día: {d} h por día valen más que una sesión larga por semana.",
    tmH: "≈ {h} horas de estudio en total, con {d} h por día, 6 días por semana.", tmN: "Es una estimación, no una promesa: depende de tu ritmo y de tu curso.",
    mock: "Hacé el examen de prueba completo de 50 preguntas ({L})", pace: "Tiempo de estudio por día:", gate: "Creá tu cuenta gratuita para ver tu puntaje y tu plan personalizado.",
    s_white: "Vodka, gin y licores", s_cocktails: "Cócteles y tragos", w_tasting: "Cata" };

  const ls = { get(k) { try { return localStorage.getItem(k); } catch (e) { return null; } }, set(k, v) { try { localStorage.setItem(k, v); } catch (e) {} } };
  const lang = () => ls.get("wset3-lang") || window.TWG_LANG || "en";
  function tr(k) {
    const l = lang(), en = D.en[k];
    if (D[l]) return D[l][k] || en;
    if (l === "es") return ES[k] || en;
    if (l === "es-ar") return AR[k] || ES[k] || en;
    const M = window.TWG_I18N && window.TWG_I18N[l]; return (M && M[en]) || en;
  }
  const esc = s => String(s).replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const fill = (s, o) => s.replace(/\{(\w+)\}/g, (m, k) => (o[k] != null ? o[k] : m));

  function read() {
    try { const r = JSON.parse(ls.get(KEY) || "null");
      if (!r || r.v !== 1 || !(r.total > 0) || !(r.score >= 0) || r.score > r.total || !r.topics || typeof r.topics !== "object") return null;
      if (["wine", "beer", "spirits", "sake", "mix"].indexOf(r.theme) < 0) return null; return r; } catch (e) { return null; }
  }
  const acct = () => window.twgAccount || null;
  const signed = () => { const a = acct(); return !!(a && a.enabled() && a.signedIn()); };

  /* ---- the reading: band, level, hours ---- */
  const BAND = p => (p < .35 ? 0 : p < .55 ? 1 : p < .8 ? 2 : 3);
  const lvName = (trk, n) => fill(tr(trk === "s" ? "lvS" : "lvW"), { n });
  const lvCode = (trk, n) => (trk === "s" ? "s" + n : String(n));
  /* study hours still needed. Own rough figures for a full course from zero: Level 1 ≈ 8 h, Level 2 ≈ 30 h, Level 3 ≈ 85 h;
     what the quiz shows the learner already knows is taken off, plus a little time for mock exams. */
  function hours(p, band, trk) {
    if (band === 0 && trk) return Math.max(3, Math.round(8 * (1 - p) + 1));      /* beer, sake, mix: no Level 1 step, the aim is the intermediate level */
    if (band === 3) return Math.round(85 * (1 - .25 * p));
    return Math.max(4, Math.round(30 * (1 - p) + 2));
  }
  const weeks = (h, d) => Math.max(1, Math.ceil(h / (d * 6)));

  let PACE = 2, R = null, saved = false, prevFocus = null;
  function model(r) {
    const p = r.score / r.total, band = BAND(p), trk = r.theme === "wine" ? "w" : r.theme === "spirits" ? "s" : null;
    const startN = band === 0 ? 1 : band === 3 ? 3 : 2, examN = band === 0 ? 1 : 2;
    const rows = Object.keys(r.topics).map(k => ({ k, c: +r.topics[k][0] || 0, n: +r.topics[k][1] || 0 })).filter(x => x.n > 0 && D.en[x.k]);
    const weak = rows.filter(x => x.c / x.n < .8).sort((a, b) => a.c / a.n - b.c / b.n || b.n - a.n).slice(0, 3);
    const recs = [];
    const course = trk || "w", L = lvName(course, startN), code = lvCode(course, startN);
    const lv = x => { const t = x.k[0] === "s" ? "s" : "w"; return { name: lvName(t, startN === 3 ? 2 : startN), code: lvCode(t, startN === 3 ? 2 : startN) }; };
    if (trk && band === 0) recs.push({ t: fill(tr("rcStart"), { L }), lvl: code, L });
    weak.forEach(x => {
      const g = tr(x.k);
      if (x.k[0] === "w" || x.k[0] === "s") { const v = lv(x); recs.push({ t: fill(tr("rcT"), { g, c: x.c, n: x.n }), lvl: v.code, L: v.name }); }
      else recs.push({ t: fill(tr("rcQ"), { g, c: x.c, n: x.n }), back: 1 });
    });
    if (!weak.length) recs.push({ t: tr("rcAll") });
    if (trk && (band === 1 || band === 2)) recs.push({ t: fill(tr("rcMock"), { L }), lvl: code, L });
    if (trk && band === 3) recs.push({ t: fill(tr("rcNext"), { L }), lvl: code, L });
    if (!trk) { const n = band === 0 ? 1 : 2, Lc = lvName("w", n); recs.push({ t: fill(tr("rcCourse"), { L: Lc }), lvl: lvCode("w", n), L: Lc }); }
    while (recs.length > 4) recs.splice(recs.length - 2, 1);           /* keep the first ones and the closing step */
    recs.push({ t: fill(tr("rcDaily"), { d: PACE }) });
    const reading = trk ? fill(tr("r" + "ABCD"[band]), { L1: lvName(trk, 1), L2: lvName(trk, 2), L3: lvName(trk, 3) }) : tr("g" + "ABCD"[band]);
    const h = hours(p, band, trk), w = weeks(h, PACE);
    const target = trk ? fill(tr("tmL"), { L: band === 3 ? lvName(trk, 3) : lvName(trk, examN) }) : tr(band === 3 ? "taL" : "tgL");
    return { p, band, rows, recs, reading, h, w, target, start: trk ? { L, code } : null, mock: trk ? { L: lvName(trk, 2), code: lvCode(trk, 2) } : null };   /* Level 2 / Spirits 2: the 50-question mock */
  }

  const CSS = `.hqr-bg{position:fixed;inset:0;z-index:400;background:rgba(0,0,0,.5);display:flex;align-items:center;justify-content:center;padding:12px}
.hqr{position:relative;background:var(--surface,#fff);color:var(--fg,#2b1a20);width:100%;max-width:560px;max-height:calc(100vh - 24px);max-height:calc(100dvh - 24px);overflow:auto;border-radius:20px;padding:22px 20px 20px;box-shadow:0 16px 50px rgba(0,0,0,.3);overscroll-behavior:contain;font-size:.95rem;line-height:1.45;overflow-wrap:anywhere}
.hqr :focus-visible{outline:3px solid var(--accent,#8c1d40);outline-offset:2px}
.hqr-x{position:absolute;top:10px;inset-inline-end:10px;width:40px;height:40px;border-radius:50%;border:1px solid var(--line,#e5d7cf);background:var(--bg,#fdf8f3);color:var(--fg,#2b1a20);font-size:1.1rem;cursor:pointer}
.hqr-k{margin:0 48px 2px 0;margin-inline:0 48px;font-size:.74rem;font-weight:700;letter-spacing:.08em;text-transform:uppercase;color:var(--muted,#6b5a5f)}
.hqr h2{margin:0 48px 12px 0;margin-inline:0 48px;font-size:1.5rem;line-height:1.2;color:var(--accent,#8c1d40)}
.hqr h3{margin:18px 0 8px;font-size:.78rem;font-weight:700;letter-spacing:.08em;text-transform:uppercase;color:var(--muted,#6b5a5f)}
.hqr-top{display:flex;gap:16px;align-items:center}
.hqr-ring{flex:none;width:104px;height:104px;border-radius:50%;display:grid;place-items:center;background:conic-gradient(var(--accent,#8c1d40) calc(var(--p)*1%),var(--line,#e5d7cf) 0)}
.hqr-ring b{width:80px;height:80px;border-radius:50%;background:var(--surface,#fff);display:grid;place-items:center;font-size:1.5rem;font-weight:800;color:var(--fg,#2b1a20)}
.hqr-sc{margin:0;font-weight:700;font-size:1.05rem}.hqr-rd{margin:4px 0 0}
.hqr-box{border:1px solid var(--line,#e5d7cf);border-radius:14px;padding:14px;background:var(--bg,#fdf8f3)}
.hqr-tl{margin:0;color:var(--muted,#6b5a5f);font-size:.88rem}.hqr-tw{margin:2px 0 4px;font-size:1.45rem;font-weight:800;color:var(--accent,#8c1d40)}
.hqr-th{margin:0;font-size:.88rem}.hqr-tn{margin:6px 0 0;font-size:.8rem;color:var(--muted,#6b5a5f)}
.hqr-pace{display:flex;flex-wrap:wrap;gap:8px;align-items:center;margin-top:10px;font-size:.88rem}.hqr-pace span{flex:1 1 100%}
.hqr-pace button{min-width:56px;min-height:40px;padding:6px 12px;border-radius:999px;border:1px solid var(--line,#e5d7cf);background:var(--surface,#fff);color:var(--fg,#2b1a20);font:inherit;font-weight:700;cursor:pointer}
.hqr-pace button[aria-pressed=true]{background:var(--accent,#8c1d40);border-color:var(--accent,#8c1d40);color:var(--on-accent,#fff)}
.hqr ol{margin:0;padding:0;list-style:none;counter-reset:r;display:flex;flex-direction:column;gap:8px}
.hqr ol li{counter-increment:r;position:relative;padding:10px 12px;padding-inline-start:42px;border:1px solid var(--line,#e5d7cf);border-radius:12px}
.hqr ol li:before{content:counter(r);position:absolute;inset-inline-start:10px;top:10px;width:22px;height:22px;border-radius:50%;background:var(--accent,#8c1d40);color:var(--on-accent,#fff);font-size:.78rem;font-weight:700;display:grid;place-items:center}
.hqr ol a{display:inline-block;margin-top:4px;font-weight:700;color:var(--accent,#8c1d40)}
.hqr-tp{margin:0;padding:0;list-style:none;display:flex;flex-direction:column;gap:8px}
.hqr-tp li{display:grid;grid-template-columns:1fr auto;gap:2px 10px;font-size:.9rem}
.hqr-tp i{grid-column:1/-1;height:6px;border-radius:6px;background:var(--line,#e5d7cf);overflow:hidden}.hqr-tp i u{display:block;height:100%;background:var(--accent,#8c1d40)}
.hqr-tp span:last-of-type{font-weight:700;white-space:nowrap}
.hqr-mk{display:block;width:100%;margin-top:18px;padding:12px;border-radius:12px;border:2px solid var(--accent,#8c1d40);background:var(--surface,#fff);color:var(--accent,#8c1d40);font:inherit;font-weight:700;font-size:.95rem;cursor:pointer;text-align:center}.hqr-mk+.hqr-go{margin-top:10px}
.hqr-go{display:block;width:100%;margin-top:18px;padding:13px;border-radius:12px;border:0;background:var(--accent,#8c1d40);color:var(--on-accent,#fff);font:inherit;font-weight:700;font-size:1rem;cursor:pointer}
.hqr-sv{margin:8px 0 0;text-align:center;font-size:.8rem;color:var(--muted,#6b5a5f)}
.hqr-note{padding:10px 12px;border-radius:10px;background:var(--bg,#fdf8f3);border:1px solid var(--line,#e5d7cf);color:var(--fg,#2b1a20)!important;font-weight:600}
@media (max-width:420px){.hqr{padding:20px 14px 16px}.hqr-ring{width:88px;height:88px}.hqr-ring b{width:68px;height:68px;font-size:1.25rem}}`;

  function html(r) {
    const m = model(r), pc = Math.round(m.p * 100), th = tr("th" + r.theme[0].toUpperCase() + r.theme.slice(1));
    const link = x => x.lvl ? `<br><a href="#lvl=${esc(x.lvl)}&go=study" data-hqr-lvl="${esc(x.lvl)}">${esc(fill(tr("open"), { L: x.L }))} →</a>`
      : x.back && typeof r.home === "string" && /^\/(?!\/)/.test(r.home) ? `<br><a href="${esc(r.home)}">${esc(tr("back"))} →</a>` : "";
    return `<button type="button" class="hqr-x" data-hqr-close aria-label="${esc(tr("close"))}">✕</button>
<p class="hqr-k">${esc(tr("kick"))}</p><h2 id="hqr-t" tabindex="-1">${esc(th)} · ${r.score}/${r.total}</h2>
<div class="hqr-top"><div class="hqr-ring" style="--p:${pc}" aria-hidden="true"><b>${pc}%</b></div>
<div><p class="hqr-sc">${esc(fill(tr("sc"), { n: r.score, t: r.total }))} (${pc}%)</p><p class="hqr-rd"><b>${esc(tr("lvK"))}:</b> ${esc(m.reading)}</p></div></div>
<h3>${esc(tr("tmK"))}</h3><div class="hqr-box"><p class="hqr-tl">${esc(m.target)}</p><p class="hqr-tw">${esc(m.w === 1 ? tr("w1") : fill(tr("wN"), { w: m.w }))}</p>
<p class="hqr-th">${esc(fill(tr("tmH"), { h: m.h, d: PACE }))}</p>
<div class="hqr-pace" role="group" aria-label="${esc(tr("pace"))}"><span>${esc(tr("pace"))}</span>${[1, 2, 3].map(d => `<button type="button" data-hqr-pace="${d}" aria-pressed="${d === PACE}">${esc(fill(tr("paceB"), { d }))}</button>`).join("")}</div>
<p class="hqr-tn">${esc(tr("tmN"))}</p></div>
<h3>${esc(tr("rcK"))}</h3><ol>${m.recs.map(x => `<li>${esc(x.t)}${link(x)}</li>`).join("")}</ol>
<h3>${esc(tr("tpK"))}</h3><ul class="hqr-tp">${m.rows.map(x => `<li><span>${esc(tr(x.k))}</span><span>${x.c}/${x.n}</span><i><u style="width:${Math.round(x.c / x.n * 100)}%"></u></i></li>`).join("")}</ul>
${m.mock ? `<button type="button" class="hqr-mk" data-hqr-mock="${m.mock.code}">📝 ${esc(fill(tr("mock"), { L: m.mock.L }))}</button>` : ""}<button type="button" class="hqr-go" data-hqr-close>${esc(tr("cta"))}</button><p class="hqr-sv" data-hqr-sv>${esc(tr(saved ? "svA" : "svL"))}</p>`;
  }
  function paint(keep) {
    const el = document.getElementById("hqr"); if (!el || !R) return;
    const y = el.scrollTop, a = keep && document.activeElement && document.activeElement.getAttribute("data-hqr-pace");
    el.innerHTML = html(R); el.scrollTop = keep ? y : 0;
    const f = a ? el.querySelector(`[data-hqr-pace="${a}"]`) : el.querySelector("#hqr-t"); if (f) try { f.focus({ preventScroll: !!keep }); } catch (e) {}
  }
  function close() { const b = document.getElementById("hqr-bg"); if (b) b.remove(); if (prevFocus && prevFocus.focus) try { prevFocus.focus(); } catch (e) {} }
  function show(r) {
    if (document.getElementById("hqr-bg")) return;
    if (!document.getElementById("hqr-css")) { const st = document.createElement("style"); st.id = "hqr-css"; st.textContent = CSS; document.head.appendChild(st); }
    R = r; prevFocus = document.activeElement;
    const bg = document.createElement("div"); bg.id = "hqr-bg"; bg.className = "hqr-bg";
    bg.innerHTML = `<div class="hqr" id="hqr" role="dialog" aria-modal="true" aria-labelledby="hqr-t"></div>`;
    document.body.appendChild(bg); paint();
    bg.addEventListener("click", e => {
      if (e.target === bg || e.target.closest("[data-hqr-close]")) return close();
      const p = e.target.closest("[data-hqr-pace]"); if (p) { PACE = +p.getAttribute("data-hqr-pace") || 2; return paint(true); }
      const mk = e.target.closest("[data-hqr-mock]"); if (mk) { const v = mk.getAttribute("data-hqr-mock");
        try { sessionStorage.setItem("twg-hq-mock", "1"); } catch (x) {}
        if (ls.get("twg-level") === v) { close(); location.hash = "go=study"; return openMock(); }
        ls.set("twg-level", v); location.hash = "go=study"; location.reload(); return; }
      const a = e.target.closest("[data-hqr-lvl]"); if (a) { e.preventDefault(); const v = a.getAttribute("data-hqr-lvl");
        if (ls.get("twg-level") === v || (!ls.get("twg-level") && v === "3")) { close(); location.hash = "go=study"; return; }
        ls.set("twg-level", v); location.hash = "go=study"; location.reload(); }
    });
    bg.addEventListener("keydown", e => {
      if (e.key === "Escape") { e.preventDefault(); e.stopPropagation(); return close(); }
      if (e.key !== "Tab") return;
      const f = [].slice.call(bg.querySelectorAll("button,a[href]")).filter(x => x.offsetParent !== null); if (!f.length) return;
      const a = f[0], z = f[f.length - 1], cur = document.activeElement;
      if (e.shiftKey && (cur === a || cur.id === "hqr-t")) { e.preventDefault(); z.focus(); } else if (!e.shiftKey && cur === z) { e.preventDefault(); a.focus(); }
    });
    if (!r.seen) { r.seen = 1; ls.set(KEY, JSON.stringify(r)); }
    store(r);
  }
  /* the account copy: user_docs (user_id, doc_id, data), the same per-user document table as the progress */
  async function store(r) {
    try { const a = acct(), sb = a && a.client && a.client(), uid = a && a.uid && a.uid(); if (!sb || !uid || r.cloud) return;
      const data = { v: 1, theme: r.theme, score: r.score, total: r.total, topics: r.topics, ts: r.ts, lang: r.lang || "" };
      const { error } = await sb.from("user_docs").upsert({ user_id: uid, doc_id: DOC, data, updated_at: new Date().toISOString() }, { onConflict: "user_id,doc_id" });
      if (error) return; r.cloud = 1; ls.set(KEY, JSON.stringify(r)); saved = true;
      const s = document.querySelector("[data-hqr-sv]"); if (s) s.textContent = tr("svA");
    } catch (e) {}
  }
  function check(force) { const r = read(); if (!r || !signed()) return false; if (r.seen && !force) return false; saved = !!r.cloud; show(r); return true; }
  /* while the visitor has a result waiting and no account yet: say so in the account window */
  function note() {
    const r = read(); if (!r || r.seen || signed()) return;
    const d = document.querySelector("#acct-bg .acct"); if (!d || d.querySelector(".hqr-note")) return;
    if (!document.getElementById("hqr-css")) { const st = document.createElement("style"); st.id = "hqr-css"; st.textContent = CSS; document.head.appendChild(st); }
    const p = document.createElement("p"); p.className = "hqr-note"; p.textContent = "🔒 " + tr("gate"); const h = d.querySelector("h2"); if (h) h.after(p); else d.prepend(p);
  }
  function hash() { if (/[#&]go=hqresult\b/.test(location.hash || "")) { try { history.replaceState(null, "", location.pathname + location.search); } catch (e) {} if (!check(true)) { const a = acct(); if (a && !signed() && read()) a.open(); } } }
  /* after "take the full mock": open the existing mock exam of the study hub (button data-l2="exam") once it is on screen */
  function openMock() {
    let ok = false; try { ok = sessionStorage.getItem("twg-hq-mock") === "1"; sessionStorage.removeItem("twg-hq-mock"); } catch (e) {}
    if (!ok) return; let n = 0;
    const t = setInterval(() => { const b = document.querySelector('[data-l2="exam"]');
      if (b) { clearInterval(t); b.click(); window.scrollTo(0, 0); } else if (++n > 40) clearInterval(t); }, 150);
  }
  function boot() {
    openMock();
    const a = acct(); if (!a) return;
    try { new MutationObserver(note).observe(document.body, { childList: true }); } catch (e) {}
    Promise.resolve(a.ready).then(() => { setTimeout(() => { check(false); hash(); }, 400); });
    window.addEventListener("twg-account", () => setTimeout(() => check(false), 50));
    window.addEventListener("hashchange", hash);
  }
  window.twgHomeQuizResult = { show: () => check(true), pending: () => { const r = read(); return !!(r && !r.seen); } };
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot); else boot();
})();
