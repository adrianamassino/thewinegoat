/* The Wine Goat — pannello di amministrazione.
   Solo la chiave publishable è nel browser: ogni dato e ogni azione passa dalle funzioni admin_* del database
   (supabase/admin.sql), che verificano is_admin() prima di fare qualsiasi cosa. */
(function () {
  "use strict";
  var SUPABASE_URL = "https://tetvfgpdxwkmfdxxadxa.supabase.co";
  var SUPABASE_KEY = "sb_publishable_MDrhEC1shlXDrDukfbnlHg_0AK5kZeq";

  var LEVELS = { "1": "Vino L1", "2": "Vino L2", "3": "Vino L3", s1: "Spirits L1", s2: "Spirits L2", s3: "Spirits L3" };
  var SOURCES = { admin: "Concesso", stripe: "Stripe (web)", apple: "App Store", google: "Google Play" };
  var STATUS = { paid: "Pagante", granted: "Concesso", free: "Gratuito", expired: "Scaduto" };
  var FOREVER_YEAR = 2900;

  var $ = function (id) { return document.getElementById(id); };
  var sb = null, USERS = [], sortKey = "created_at", sortDir = "desc";

  /* ---------- helpers ---------- */
  function esc(s) { return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]; }); }
  function d(x) { return x ? new Date(x) : null; }
  function fmtDate(x) { var t = d(x); if (!t || isNaN(t)) return "—"; if (t.getUTCFullYear() >= FOREVER_YEAR) return "per sempre"; return t.toLocaleDateString("it-IT", { day: "2-digit", month: "2-digit", year: "numeric" }); }
  function fmtDT(x) { var t = d(x); if (!t || isNaN(t)) return "—"; return t.toLocaleString("it-IT", { day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit" }); }
  function ago(x) {
    var t = d(x); if (!t || isNaN(t)) return "—";
    var s = (Date.now() - t.getTime()) / 1000;
    if (s < 60) return "adesso"; if (s < 3600) return Math.floor(s / 60) + " min fa"; if (s < 86400) return Math.floor(s / 3600) + " ore fa";
    var g = Math.floor(s / 86400); if (g === 1) return "ieri"; if (g < 30) return g + " giorni fa"; return fmtDate(x);
  }
  function srcLabel(s) { return SOURCES[s || "stripe"] || s; }
  function future(x) { var t = d(x); return !!(t && t.getTime() > Date.now()); }
  function dayKey(t) { return t.toISOString().slice(0, 10); }
  function toast(msg, err) {
    var el = $("toast"); el.textContent = msg; el.className = "toast" + (err ? " err" : ""); el.hidden = false;
    clearTimeout(toast.t); toast.t = setTimeout(function () { el.hidden = true; }, err ? 6000 : 3500);
  }
  function errText(e) {
    var m = (e && (e.message || e.error_description || e.msg)) || String(e);
    if (/not authorised/i.test(m)) return "Non autorizzato.";
    if (/confirmation email does not match/i.test(m)) return "L'email di conferma non corrisponde.";
    if (/administrator cannot be deleted/i.test(m)) return "Un amministratore non si può eliminare dal pannello.";
    if (/only manual grants/i.test(m)) return "Si possono eliminare solo gli accessi concessi a mano.";
    if (/could not find the function|does not exist/i.test(m)) return "Funzioni non trovate nel database: esegui supabase/admin.sql nel SQL Editor di Supabase.";
    return "Errore: " + m;
  }
  function show(view) { ["v-boot", "v-login", "v-denied", "v-app"].forEach(function (v) { $(v).hidden = v !== view; }); }

  /* derived fields for one user */
  function enrich(u) {
    u.status = future(u.paid_until) ? "paid" : future(u.grant_until) ? "granted" : (u.purchases && u.purchases.length ? "expired" : "free");
    var src = null, best = 0;
    (u.purchases || []).forEach(function (p) { var t = d(p.expires_at); if (!p.refunded && t && t.getTime() > Date.now() && t.getTime() > best) { best = t.getTime(); src = p.source || "stripe"; } });
    u.access_source = src;
    u.last_until = null; u.all_refunded = !!(u.purchases && u.purchases.length);
    (u.purchases || []).forEach(function (p) { if (!u.last_until || d(p.expires_at) > d(u.last_until)) u.last_until = p.expires_at; if (!p.refunded) u.all_refunded = false; });
    var paidSrc = {}; (u.purchases || []).forEach(function (p) { if ((p.source || "stripe") !== "admin") paidSrc[srcLabel(p.source)] = 1; });
    u.paid_sources = Object.keys(paidSrc).join(", ");
    u.accuracy = u.attempts > 0 ? Math.round(100 * u.correct / u.attempts) : null;
    u.level = u.level || null;
    u.lang = u.lang || null;
    return u;
  }

  /* ---------- auth ---------- */
  function boot() {
    if (!window.supabase || !window.supabase.createClient) { show("v-login"); $("l-msg").textContent = "Impossibile caricare Supabase."; $("l-msg").className = "msg err"; return; }
    sb = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY, { auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: true, flowType: "implicit" } });
    sb.auth.onAuthStateChange(function (ev) { if (ev === "SIGNED_OUT") { show("v-login"); $("who").hidden = true; } });
    sb.auth.getSession().then(function (r) { var s = r && r.data && r.data.session; if (s) afterLogin(s); else show("v-login"); })
      .catch(function () { show("v-login"); });
  }

  function afterLogin(session) {
    $("who").hidden = false; $("who-email").textContent = (session.user && session.user.email) || "";
    sb.rpc("is_admin").then(function (r) {
      if (r.error || r.data !== true) { show("v-denied"); return; }
      show("v-app"); loadUsers();
    });
  }

  $("f-login").addEventListener("submit", function (e) {
    e.preventDefault();
    var em = $("l-email").value.trim(), pw = $("l-pw").value, msg = $("l-msg");
    if (!em || !pw) { msg.textContent = "Inserisci email e password (oppure chiedi il link via email)."; msg.className = "msg err"; return; }
    msg.textContent = "Accesso…"; msg.className = "msg";
    sb.auth.signInWithPassword({ email: em, password: pw }).then(function (r) {
      if (r.error) { msg.textContent = errText(r.error); msg.className = "msg err"; return; }
      msg.textContent = ""; $("l-pw").value = ""; afterLogin(r.data.session);
    });
  });
  $("btn-magic").addEventListener("click", function () {
    var em = $("l-email").value.trim(), msg = $("l-msg");
    if (!em) { $("l-email").focus(); return; }
    sb.auth.signInWithOtp({ email: em, options: { shouldCreateUser: false, emailRedirectTo: location.origin + "/admin/" } }).then(function (r) {
      if (r.error) { msg.textContent = errText(r.error); msg.className = "msg err"; return; }
      msg.textContent = "Controlla la tua email: ti abbiamo mandato un link di accesso."; msg.className = "msg ok";
    });
  });
  $("btn-out").addEventListener("click", function () { sb.auth.signOut().then(function () { USERS = []; $("rows").innerHTML = ""; show("v-login"); $("who").hidden = true; }); });

  /* ---------- data ---------- */
  function loadUsers() {
    $("count").textContent = "Caricamento…";
    return sb.rpc("admin_list_users").then(function (r) {
      if (r.error) { $("count").textContent = ""; toast(errText(r.error), true); if (/not authorised/i.test(r.error.message || "")) show("v-denied"); return; }
      USERS = (r.data || []).map(enrich);
      fillLangs(); renderStats(); renderTable();
    });
  }

  function fillLangs() {
    var sel = $("f-lang"), cur = sel.value, seen = {};
    USERS.forEach(function (u) { seen[u.lang || "-"] = (seen[u.lang || "-"] || 0) + 1; });
    var opts = '<option value="">Tutte le lingue</option>';
    Object.keys(seen).sort().forEach(function (k) { opts += '<option value="' + esc(k) + '">' + esc(k === "-" ? "Lingua non nota" : k.toUpperCase()) + " (" + seen[k] + ")</option>"; });
    sel.innerHTML = opts; sel.value = cur;
  }

  /* ---------- stats ---------- */
  function renderStats() {
    var now = Date.now(), wk = now - 7 * 864e5, n = USERS.length;
    var c = { paid: 0, granted: 0, free: 0, expired: 0 }, new7 = 0, act7 = 0, ever = 0;
    USERS.forEach(function (u) { c[u.status]++; if (d(u.created_at) > wk) new7++; if (d(u.last_activity) > wk) act7++; if (u.ever_paid) ever++; });
    var cards = [["Iscritti", n, true], ["Nuovi (7 giorni)", new7], ["Attivi (7 giorni)", act7], ["Paganti attivi", c.paid], ["Accesso concesso", c.granted], ["Gratuiti", c.free + c.expired]];
    $("stats").innerHTML = cards.map(function (x) { return '<div class="stat' + (x[2] ? " accent" : "") + '"><b>' + x[1] + "</b><span>" + esc(x[0]) + "</span></div>"; }).join("");

    // sign-ups per day, last 30 days
    var days = [], map = {};
    for (var i = 29; i >= 0; i--) { var t = new Date(now - i * 864e5); var k = dayKey(t); days.push(k); map[k] = 0; }
    USERS.forEach(function (u) { var t = d(u.created_at); if (t) { var k = dayKey(t); if (k in map) map[k]++; } });
    var max = Math.max.apply(null, days.map(function (k) { return map[k]; }).concat([1]));
    var W = 600, H = 150, pad = 18, bw = (W - pad) / days.length;
    var svg = '<svg viewBox="0 0 ' + W + " " + (H + 22) + '" role="img" aria-label="Iscrizioni negli ultimi 30 giorni">';
    svg += '<line x1="' + pad + '" y1="' + H + '" x2="' + W + '" y2="' + H + '" stroke="#eadfd4"/>';
    svg += '<text x="0" y="12" font-size="10" fill="#6b5a5f">' + max + "</text>";
    days.forEach(function (k, j) {
      var v = map[k], h = Math.round((H - 14) * v / max), x = pad + j * bw + 2;
      svg += '<rect x="' + x.toFixed(1) + '" y="' + (H - h) + '" width="' + (bw - 4).toFixed(1) + '" height="' + h + '" rx="2" fill="' + (v ? "#8c1d40" : "#eadfd4") + '"><title>' + k.split("-").reverse().join("/") + ": " + v + "</title></rect>";
      if (v) svg += '<text x="' + (x + (bw - 4) / 2).toFixed(1) + '" y="' + (H - h - 3) + '" font-size="9" text-anchor="middle" fill="#6e1532">' + v + "</text>";
      if (j % 5 === 0 || j === days.length - 1) svg += '<text x="' + (x + (bw - 4) / 2).toFixed(1) + '" y="' + (H + 15) + '" font-size="9" text-anchor="middle" fill="#6b5a5f">' + k.slice(8) + "/" + k.slice(5, 7) + "</text>";
    });
    $("ch-days").innerHTML = svg + "</svg>";

    // access mix
    var parts = [["Paganti", c.paid, "#2e7d32"], ["Concessi", c.granted, "#d4a23a"], ["Gratuiti", c.free, "#cbbfb8"], ["Scaduti", c.expired, "#8c1d40"]];
    var tot = Math.max(n, 1), x0 = 0, mix = '<svg viewBox="0 0 300 34" role="img" aria-label="Paganti e gratuiti">';
    parts.forEach(function (p) { var w = 300 * p[1] / tot; if (w > 0) mix += '<rect x="' + x0.toFixed(1) + '" y="4" width="' + w.toFixed(1) + '" height="26" fill="' + p[2] + '"><title>' + p[0] + ": " + p[1] + "</title></rect>"; x0 += w; });
    mix += "</svg>";
    mix += '<div class="lg">' + parts.map(function (p) { return '<span><i data-c="' + p[2] + '"></i>' + esc(p[0]) + " " + p[1] + (n ? " (" + Math.round(100 * p[1] / n) + "%)" : "") + "</span>"; }).join("") + "</div>";
    mix += '<p class="muted">' + ever + " utent" + (ever === 1 ? "e ha" : "i hanno") + " pagato almeno una volta.</p>";
    $("ch-mix").innerHTML = mix;
    Array.prototype.forEach.call($("ch-mix").querySelectorAll("i[data-c]"), function (i) { i.style.background = i.getAttribute("data-c"); });
  }

  /* ---------- table ---------- */
  function filtered() {
    var q = $("q").value.trim().toLowerCase(), fa = $("f-access").value, fl = $("f-level").value, fg = $("f-lang").value;
    var out = USERS.filter(function (u) {
      if (q) { var hay = [u.name, u.email, u.country, u.nationality, u.school, u.id].join(" ").toLowerCase(); if (hay.indexOf(q) < 0) return false; }
      if (fa === "full" && !(u.status === "paid" || u.status === "granted")) return false;
      if (fa === "everpaid" && !u.ever_paid) return false;
      if (fa && fa !== "full" && fa !== "everpaid" && u.status !== fa) return false;
      if (fl === "-" && u.level) return false;
      if (fl && fl !== "-" && u.level !== fl) return false;
      if (fg && (u.lang || "-") !== fg) return false;
      return true;
    });
    var k = sortKey, dir = sortDir === "asc" ? 1 : -1;
    var dateKeys = { created_at: 1, last_activity: 1, access_until: 1 };
    out.sort(function (a, b) {
      var x = a[k], y = b[k];
      if (dateKeys[k]) { x = x ? d(x).getTime() : -Infinity; y = y ? d(y).getTime() : -Infinity; }
      else if (k === "answered") { x = x || 0; y = y || 0; }
      else { x = (x || "").toString().toLowerCase(); y = (y || "").toString().toLowerCase(); if (!x && y) return 1; if (x && !y) return -1; }
      return x < y ? -dir : x > y ? dir : 0;
    });
    return out;
  }

  function accessCell(u) {
    var b = '<span class="badge b-' + u.status + '">' + esc(STATUS[u.status]) + "</span>";
    if (u.status === "paid" || u.status === "granted") b += '<div class="sm">' + esc(srcLabel(u.access_source)) + " · fino al " + esc(fmtDate(u.access_until)) + "</div>";
    else if (u.status === "expired") b += '<div class="sm">' + (u.all_refunded ? "rimborsato" : "scaduto il " + esc(fmtDate(u.last_until))) + "</div>";
    if (u.is_admin) b += ' <span class="badge b-admin">admin</span>';
    return b;
  }

  function renderTable() {
    var list = filtered();
    $("count").textContent = list.length + " di " + USERS.length + " utenti";
    Array.prototype.forEach.call(document.querySelectorAll("th[data-sort]"), function (th) {
      if (th.getAttribute("data-sort") === sortKey) th.setAttribute("aria-sort", sortDir === "asc" ? "ascending" : "descending"); else th.removeAttribute("aria-sort");
    });
    if (!list.length) { $("rows").innerHTML = '<tr><td colspan="8" class="empty">Nessun utente trovato.</td></tr>'; return; }
    $("rows").innerHTML = list.map(function (u) {
      var prog = u.answered ? '<div>' + u.answered + " domande</div>" + (u.accuracy != null ? '<div class="sm">' + u.accuracy + "% corrette" + (u.streak ? " · serie " + esc(u.streak) : "") + "</div>" : "") +
        '<div class="bar"><i data-w="' + Math.min(100, u.accuracy || 0) + '"></i></div>' : '<span class="sm">—</span>';
      return "<tr>" +
        '<td class="u" data-l="Utente"><div><div class="nm">' + esc(u.name || "—") + '</div><div class="em">' + esc(u.email || "") + "</div></div></td>" +
        '<td data-l="Iscrizione"><div>' + esc(fmtDate(u.created_at)) + "</div></td>" +
        '<td data-l="Ultima attività"><div title="' + esc(fmtDT(u.last_activity)) + '">' + esc(ago(u.last_activity)) + "</div></td>" +
        '<td data-l="Lingua"><div>' + esc(u.lang ? u.lang.toUpperCase() : "—") + "</div></td>" +
        '<td data-l="Livello"><div>' + esc(LEVELS[u.level] || "—") + "</div></td>" +
        '<td data-l="Progressi"><div>' + prog + "</div></td>" +
        '<td data-l="Accesso"><div>' + accessCell(u) + "</div></td>" +
        '<td class="a"><button type="button" class="btn sm" data-open="' + esc(u.id) + '">Gestisci</button></td>' +
        "</tr>";
    }).join("");
    Array.prototype.forEach.call($("rows").querySelectorAll(".bar i[data-w]"), function (i) { i.style.width = i.getAttribute("data-w") + "%"; });
  }

  ["q", "f-access", "f-level", "f-lang"].forEach(function (id) { $(id).addEventListener("input", renderTable); });
  $("f-sort").addEventListener("change", function () { var p = this.value.split(":"); sortKey = p[0]; sortDir = p[1]; renderTable(); });
  Array.prototype.forEach.call(document.querySelectorAll("th[data-sort]"), function (th) {
    th.addEventListener("click", function () {
      var k = th.getAttribute("data-sort");
      if (sortKey === k) sortDir = sortDir === "asc" ? "desc" : "asc"; else { sortKey = k; sortDir = /created_at|last_activity|answered|access_until/.test(k) ? "desc" : "asc"; }
      var opt = sortKey + ":" + sortDir; $("f-sort").value = Array.prototype.some.call($("f-sort").options, function (o) { return o.value === opt; }) ? opt : $("f-sort").value;
      renderTable();
    });
  });
  $("btn-reload").addEventListener("click", function () { loadUsers().then(function () { toast("Dati aggiornati."); }); });
  $("rows").addEventListener("click", function (e) { var b = e.target.closest("[data-open]"); if (b) openUser(b.getAttribute("data-open")); });

  /* ---------- CSV ---------- */
  function csvCell(v) { v = v == null ? "" : String(v); if (/^[=+\-@\t\r]/.test(v)) v = "'" + v; return /[";\n\r]/.test(v) ? '"' + v.replace(/"/g, '""') + '"' : v; }
  $("btn-csv").addEventListener("click", function () {
    var head = ["id", "nome", "email", "iscrizione", "ultimo_accesso", "ultima_attivita", "lingua", "livello", "paese", "nazionalita", "scuola", "data_esame",
      "domande_fatte", "risposte_totali", "risposte_corrette", "percentuale_corrette", "xp", "serie", "stato_accesso", "fonte_accesso", "accesso_fino_al",
      "ha_pagato", "fonti_pagamento", "pagato_fino_al", "concesso_fino_al"];
    var iso = function (x) { return x ? new Date(x).toISOString() : ""; };
    var rows = filtered().map(function (u) {
      return [u.id, u.name, u.email, iso(u.created_at), iso(u.last_sign_in_at), iso(u.last_activity), u.lang, LEVELS[u.level] || "", u.country, u.nationality, u.school, u.exam_date,
        u.answered, u.attempts, u.correct, u.accuracy, u.xp_total, u.streak, STATUS[u.status], u.access_source ? srcLabel(u.access_source) : "", iso(u.access_until),
        u.ever_paid ? "sì" : "no", u.paid_sources, iso(u.paid_until), iso(u.grant_until)];
    });
    var txt = "﻿" + [head].concat(rows).map(function (r) { return r.map(csvCell).join(";"); }).join("\r\n");
    var a = document.createElement("a");
    a.href = URL.createObjectURL(new Blob([txt], { type: "text/csv;charset=utf-8" }));
    a.download = "thewinegoat-utenti-" + dayKey(new Date()) + ".csv";
    document.body.appendChild(a); a.click(); setTimeout(function () { URL.revokeObjectURL(a.href); a.remove(); }, 1000);
  });

  /* ---------- confirm dialog (in-page) ---------- */
  function confirmBox(opts) {
    return new Promise(function (resolve) {
      var dlg = $("dlg-confirm"), yes = $("dc-yes"), no = $("dc-no"), inp = $("dc-type");
      $("dc-title").textContent = opts.title; $("dc-text").textContent = opts.text;
      yes.textContent = opts.ok || "Conferma"; yes.className = "btn " + (opts.danger === false ? "" : "danger");
      $("dc-typelab").hidden = !opts.type; inp.value = "";
      if (opts.type) { $("dc-typehint").textContent = "Per confermare scrivi: " + opts.type; yes.disabled = true; }
      else yes.disabled = false;
      inp.oninput = function () { yes.disabled = inp.value.trim().toLowerCase() !== String(opts.type || "").toLowerCase(); };
      function done(v) { dlg.hidden = true; yes.onclick = no.onclick = dlg.onclick = document.onkeydown = null; resolve(v ? (opts.type ? inp.value.trim() : true) : false); }
      yes.onclick = function () { if (!yes.disabled) done(true); };
      no.onclick = function () { done(false); };
      dlg.onclick = function (e) { if (e.target === dlg) done(false); };
      document.onkeydown = function (e) { if (e.key === "Escape") done(false); };
      dlg.hidden = false; (opts.type ? inp : no).focus();
    });
  }

  /* ---------- user detail ---------- */
  var current = null;
  function openUser(id) {
    var u = USERS.filter(function (x) { return x.id === id; })[0]; if (!u) return;
    current = u.id;
    $("du-title").textContent = u.name ? u.name + " · " + u.email : u.email;
    var info = [
      ["Email", u.email], ["Nome", u.name || "—"], ["Iscrizione", fmtDT(u.created_at)],
      ["Email confermata", u.confirmed_at ? fmtDate(u.confirmed_at) : "no"], ["Ultimo accesso", fmtDT(u.last_sign_in_at)], ["Ultima attività", fmtDT(u.last_activity)],
      ["Accesso con", (u.providers || []).join(", ") || "—"], ["Lingua app", u.lang ? u.lang.toUpperCase() : "—"], ["Livello", LEVELS[u.level] || "non ancora noto"],
      ["Domande fatte", u.answered || 0], ["Risposte corrette", u.attempts ? u.correct + " / " + u.attempts + " (" + u.accuracy + "%)" : "—"], ["XP · serie · corone", [u.xp_total || 0, u.streak || 0, u.crowns || 0].join(" · ")],
      ["Paese", u.country || "—"], ["Nazionalità", u.nationality || "—"], ["Scuola", u.school || "—"],
      ["Data esame", u.exam_date ? fmtDate(u.exam_date) : "—"], ["Stato accesso", STATUS[u.status] + (u.access_until && (u.status === "paid" || u.status === "granted") ? " fino al " + fmtDate(u.access_until) : "")], ["ID", u.id]
    ];
    var h = '<dl class="dgrid">' + info.map(function (x) { return "<div><dt>" + esc(x[0]) + "</dt><dd>" + esc(x[1]) + "</dd></div>"; }).join("") + "</dl>";

    h += '<div class="sec"><h3>Concedi o estendi l\'accesso completo</h3><div class="grant">' +
      '<label>Durata<select id="g-days"><option value="7">7 giorni</option><option value="30" selected>30 giorni</option><option value="90">90 giorni</option><option value="180">6 mesi</option><option value="365">1 anno</option><option value="custom">Personalizzata…</option><option value="forever">Per sempre</option></select></label>' +
      '<label id="g-custom-l" hidden>Giorni<input type="number" id="g-custom" min="1" max="36500" value="14" inputmode="numeric"></label>' +
      '<label class="note">Nota (facoltativa)<input type="text" id="g-note" maxlength="200" placeholder="es. omaggio, tester, rimborso…"></label>' +
      '<label class="chk"><input type="checkbox" id="g-from" checked> dalla scadenza attuale</label>' +
      '<button type="button" class="btn gold" id="g-go">Concedi</button></div>' +
      '<p class="muted sm">L\'accesso concesso sblocca tutta l\'app (sito e app iOS/Android) al prossimo avvio dell\'app da parte dell\'utente. Il Livello 1 è sempre gratuito per tutti.</p></div>';

    h += '<div class="sec"><h3>Diritti di accesso e pagamenti</h3>';
    if (!u.purchases.length) h += '<p class="muted">Nessun acquisto e nessun accesso concesso.</p>';
    else {
      h += '<div class="tablewrap"><table class="ent"><thead><tr><th>Fonte</th><th>Creato</th><th>Scadenza</th><th>Rimborsato</th><th>Nota</th><th></th></tr></thead><tbody>';
      u.purchases.forEach(function (p, i) {
        var exp = d(p.expires_at), forever = exp && exp.getUTCFullYear() >= FOREVER_YEAR, active = !p.refunded && future(p.expires_at);
        h += '<tr data-pid="' + esc(p.id) + '"><td><b>' + esc(srcLabel(p.source)) + "</b> " + (active ? '<span class="badge b-paid">attivo</span>' : '<span class="badge b-free">non attivo</span>') +
          (p.external_id ? '<div class="sm">' + esc(p.external_id) + "</div>" : "") + "</td>" +
          "<td>" + esc(fmtDate(p.created_at)) + "</td>" +
          "<td>" + (forever ? '<span class="sm">per sempre</span> ' : "") + '<input type="date" data-f="exp" value="' + esc(exp && !forever ? dayKey(exp) : forever ? "2999-12-31" : "") + '" aria-label="Scadenza"></td>' +
          '<td><label class="chk"><input type="checkbox" data-f="ref"' + (p.refunded ? " checked" : "") + "> sì</label></td>" +
          '<td><input type="text" data-f="note" maxlength="200" value="' + esc(p.note || "") + '" aria-label="Nota"></td>' +
          '<td><div class="acts"><button type="button" class="btn sm" data-save="' + i + '"' + (p.id ? "" : " disabled") + '>Salva</button>' +
          (p.source === "admin" ? '<button type="button" class="btn sm ghost" data-del="' + i + '">Elimina</button>' : "") + "</div></td></tr>";
      });
      h += "</tbody></table></div>";
    }
    h += '<div class="row-end"><button type="button" class="btn ghost" id="r-grants">Revoca accessi concessi</button><button type="button" class="btn danger" id="r-all">Revoca tutto (anche pagati)</button></div></div>';

    h += '<div class="sec"><div class="danger-zone"><div><b>Elimina utente</b><div class="sm">Cancella l\'account e tutti i suoi dati (progressi, profilo, acquisti). Non si può annullare.</div></div>' +
      (u.is_admin ? '<span class="sm">Amministratore: non eliminabile</span>' : '<button type="button" class="btn danger" id="u-del">Elimina utente</button>') + "</div></div>";

    $("du-body").innerHTML = h;
    $("dlg-user").hidden = false;
    wireUser(u);
  }

  function rpc(name, args, okMsg) {
    return sb.rpc(name, args).then(function (r) {
      if (r.error) { toast(errText(r.error), true); return null; }
      if (okMsg) toast(typeof okMsg === "function" ? okMsg(r.data) : okMsg);
      return r;
    });
  }
  function refreshAndReopen(id) { return loadUsers().then(function () { if (id && USERS.some(function (x) { return x.id === id; })) openUser(id); else closeUser(); }); }

  function wireUser(u) {
    var sel = $("g-days");
    sel.onchange = function () { $("g-custom-l").hidden = sel.value !== "custom"; $("g-from").disabled = sel.value === "forever"; };
    $("g-go").onclick = function () {
      var v = sel.value, days = v === "forever" ? null : v === "custom" ? parseInt($("g-custom").value, 10) : parseInt(v, 10);
      if (v !== "forever" && (!days || days < 1 || days > 36500)) { toast("Numero di giorni non valido.", true); return; }
      var label = v === "forever" ? "per sempre" : days + " giorni";
      confirmBox({ title: "Concedere l'accesso completo?", text: "A " + u.email + ", " + label + ".", ok: "Concedi", danger: false }).then(function (ok) {
        if (!ok) return;
        rpc("admin_grant_access", { p_user_id: u.id, p_days: days, p_note: $("g-note").value.trim() || null, p_from_current: $("g-from").checked },
          function (until) { return "Accesso concesso fino al " + fmtDate(until) + "."; }).then(function (r) { if (r) refreshAndReopen(u.id); });
      });
    };
    $("r-grants").onclick = function () {
      confirmBox({ title: "Revocare gli accessi concessi?", text: "Gli accessi concessi a mano a " + u.email + " scadono adesso. Gli acquisti pagati restano validi.", ok: "Revoca" }).then(function (ok) {
        if (!ok) return;
        rpc("admin_revoke_access", { p_user_id: u.id, p_include_paid: false }, function (n) { return n ? "Revocati " + n + " accessi." : "Nessun accesso concesso attivo."; })
          .then(function (r) { if (r) refreshAndReopen(u.id); });
      });
    };
    $("r-all").onclick = function () {
      confirmBox({ title: "Revocare TUTTO l'accesso?", text: "Anche gli acquisti pagati (Stripe, App Store, Google Play) di " + u.email + " scadono adesso. Il rimborso del denaro, se dovuto, va fatto in Stripe / Apple / Google.", ok: "Revoca tutto", type: "REVOCA" }).then(function (ok) {
        if (!ok) return;
        rpc("admin_revoke_access", { p_user_id: u.id, p_include_paid: true }, function (n) { return n ? "Revocati " + n + " diritti." : "Nessun accesso attivo."; })
          .then(function (r) { if (r) refreshAndReopen(u.id); });
      });
    };
    Array.prototype.forEach.call($("du-body").querySelectorAll("[data-save]"), function (b) {
      b.onclick = function () {
        var p = u.purchases[+b.getAttribute("data-save")], tr = b.closest("tr");
        var exp = tr.querySelector('[data-f="exp"]').value, ref = tr.querySelector('[data-f="ref"]').checked, note = tr.querySelector('[data-f="note"]').value.trim();
        if (!exp) { toast("Indica una data di scadenza.", true); return; }
        var iso = exp >= "2900-01-01" ? "2999-12-31T00:00:00Z" : exp + "T23:59:59Z";
        rpc("admin_update_purchase", { p_purchase_id: String(p.id), p_expires_at: iso, p_refunded: ref, p_note: note || null }, "Diritto aggiornato.")
          .then(function (r) { if (r) refreshAndReopen(u.id); });
      };
    });
    Array.prototype.forEach.call($("du-body").querySelectorAll("[data-del]"), function (b) {
      b.onclick = function () {
        var p = u.purchases[+b.getAttribute("data-del")];
        confirmBox({ title: "Eliminare questo accesso concesso?", text: "Scadenza " + fmtDate(p.expires_at) + (p.note ? " · " + p.note : "") + ".", ok: "Elimina" }).then(function (ok) {
          if (!ok) return;
          rpc("admin_delete_grant", { p_purchase_id: String(p.id) }, "Accesso eliminato.").then(function (r) { if (r) refreshAndReopen(u.id); });
        });
      };
    });
    var del = $("u-del");
    if (del) del.onclick = function () {
      confirmBox({ title: "Eliminare definitivamente l'utente?", text: "L'account " + u.email + " e tutti i suoi dati saranno cancellati. L'operazione non si può annullare.", ok: "Elimina per sempre", type: u.email }).then(function (typed) {
        if (!typed) return;
        rpc("admin_delete_user", { p_user_id: u.id, p_confirm_email: typed }, "Utente eliminato.").then(function (r) { if (r) refreshAndReopen(null); });
      });
    };
  }
  function closeUser() { $("dlg-user").hidden = true; current = null; }
  $("dlg-user").addEventListener("click", function (e) { if (e.target === $("dlg-user") || e.target.closest("[data-close]")) closeUser(); });
  document.addEventListener("keydown", function (e) { if (e.key === "Escape" && $("dlg-confirm").hidden && !$("dlg-user").hidden) closeUser(); });

  /* ---------- tabs + audit ---------- */
  var ACTIONS = { grant: "Accesso concesso", revoke: "Accesso revocato", update_purchase: "Diritto modificato", delete_grant: "Accesso concesso eliminato", delete_user: "Utente eliminato" };
  Array.prototype.forEach.call(document.querySelectorAll(".tabs button"), function (b) {
    b.addEventListener("click", function () {
      var t = b.getAttribute("data-tab");
      Array.prototype.forEach.call(document.querySelectorAll(".tabs button"), function (x) { x.setAttribute("aria-selected", String(x === b)); });
      $("t-users").hidden = t !== "users"; $("t-audit").hidden = t !== "audit"; $("t-stats").hidden = t !== "stats";
      if (t === "audit") loadAudit();
      if (t === "stats") loadStats();
    });
  });
  var SRC = { google: "Google", bing: "Bing", "other-search": "Altri motori di ricerca", instagram: "Instagram", social: "Altri social", ai: "Assistenti AI", site: "Altri siti", direct: "Diretto (indirizzo digitato, app, email)" };
  function loadStats() {
    var none = function (n) { return '<tr><td colspan="' + n + '" class="empty">Nessun dato nel periodo.</td></tr>'; };
    sb.rpc("admin_stats", { p_days: +$("st-days").value }).then(function (r) {
      if (r.error) { toast(errText(r.error), true); return; }
      var D = r.data || {}, pc = function (a, b) { return b ? a + ' <span class="muted">(' + (100 * a / b).toFixed(1) + '%)</span>' : String(a); };
      var L = D.by_lang || [], T = { lang: "Totale", visits: 0, views: 0, search: 0, quiz_start: 0, quiz_done: 0, signup: 0, buy_click: 0 };
      L.forEach(function (x) { ["visits", "views", "search", "quiz_start", "quiz_done", "signup", "buy_click"].forEach(function (k) { T[k] += x[k] || 0; }); });
      $("st-lang").innerHTML = L.length ? L.concat([T]).map(function (x) {
        return "<tr><td><strong>" + esc(x.lang) + "</strong></td><td>" + x.visits + "</td><td>" + pc(x.search, x.visits) + "</td><td>" + x.views + "</td><td>" + pc(x.quiz_start, x.visits) + "</td><td>" + pc(x.quiz_done, x.visits) + "</td><td>" + pc(x.signup, x.visits) + "</td><td>" + pc(x.buy_click, x.visits) + "</td></tr>";
      }).join("") : none(8);
      $("st-src").innerHTML = (D.by_src || []).map(function (x) { return "<tr><td>" + esc(SRC[x.src] || x.src) + "</td><td>" + x.visits + "</td></tr>"; }).join("") || none(2);
      $("st-top").innerHTML = (D.top_entry || []).map(function (x) { return "<tr><td><code>" + esc(x.path) + "</code></td><td>" + x.visits + "</td><td>" + x.search + "</td></tr>"; }).join("") || none(3);
      $("st-day").innerHTML = (D.by_day || []).slice().reverse().map(function (x) { return "<tr><td>" + esc(fmtDate(x.day)) + "</td><td>" + x.visits + "</td><td>" + x.quiz_start + "</td><td>" + x.signup + "</td></tr>"; }).join("") || none(4);
    });
  }
  $("st-days").addEventListener("change", loadStats);
  function loadAudit() {
    $("audit-rows").innerHTML = '<tr><td colspan="5" class="empty">Caricamento…</td></tr>';
    sb.rpc("admin_list_audit", { p_limit: 300 }).then(function (r) {
      if (r.error) { $("audit-rows").innerHTML = ""; toast(errText(r.error), true); return; }
      var L = r.data || [];
      if (!L.length) { $("audit-rows").innerHTML = '<tr><td colspan="5" class="empty">Nessuna azione registrata.</td></tr>'; return; }
      $("audit-rows").innerHTML = L.map(function (l) {
        var det = l.details || {}, s = [];
        if (l.action === "grant") s.push(det.days ? det.days + " giorni" : "per sempre", "fino al " + fmtDate(det.until), det.note || "");
        else if (l.action === "revoke") s.push((det.include_paid ? "anche pagati" : "solo concessi") + " · " + (det.rows || 0) + " righe");
        else if (l.action === "update_purchase") s.push("scadenza " + fmtDate(det.after && det.after.expires_at) + (det.after && det.after.refunded ? " · rimborsato" : ""));
        else if (l.action === "delete_user") s.push(JSON.stringify(det.deleted_rows || {}));
        return "<tr><td>" + esc(fmtDT(l.at)) + "</td><td>" + esc(l.admin_email || "") + "</td><td>" + esc(ACTIONS[l.action] || l.action) + "</td><td>" + esc(l.target_email || "") + "</td><td><code>" + esc(s.filter(Boolean).join(" · ")) + "</code></td></tr>";
      }).join("");
    });
  }

  boot();
})();
