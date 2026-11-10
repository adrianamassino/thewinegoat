"""Builds app5.js: tasting (SAT) terms fully in the user's language (it/fr), aromas and wine names translated."""
import json, sys, os
D = os.path.dirname(os.path.abspath(__file__)); sys.path.insert(0, D)
import sat_profiles as S, sat_i18n as I
SCLI = {
 "it": {"clar": ["limpido", "velato"], "aint": ["pallida", "media", "intensa"],
  "colw": ["giallo verdolino", "giallo limone", "dorato", "ambrato", "marrone"], "colp": ["rosa", "salmone", "arancione"],
  "colr": ["porpora", "rubino", "granato", "aranciato", "marrone"], "cond": ["pulito", "non pulito"],
  "nint": ["leggera", "media(-)", "media", "media(+)", "pronunciata"], "dev": ["giovane", "in evoluzione", "pienamente evoluto", "stanco/in declino"],
  "sw": ["secco", "abboccato", "medio secco", "amabile", "dolce", "molto dolce"], "ac": ["bassa", "media(-)", "media", "media(+)", "alta"],
  "tan": ["basso", "medio(-)", "medio", "medio(+)", "alto"], "alc": ["basso", "medio", "alto"], "body": ["leggero", "medio(-)", "medio", "medio(+)", "pieno"],
  "mou": ["delicata", "cremosa", "aggressiva"], "fint": ["leggera", "media(-)", "media", "media(+)", "pronunciata"],
  "fin": ["corto", "medio(-)", "medio", "medio(+)", "lungo"], "q": ["difettoso", "scarso", "accettabile", "buono", "molto buono", "eccezionale"],
  "rd": ["troppo giovane", "si può bere ora, ma ha potenziale d'invecchiamento", "da bere ora: non adatto all'invecchiamento o a un ulteriore invecchiamento", "troppo vecchio"]},
 "fr": {"clar": ["limpide", "trouble"], "aint": ["pâle", "moyenne", "profonde"],
  "colw": ["jaune-vert", "jaune citron", "doré", "ambré", "brun"], "colp": ["rose", "saumon", "orangé"],
  "colr": ["pourpre", "rubis", "grenat", "tuilé", "brun"], "cond": ["net", "pas net"],
  "nint": ["faible", "moyenne(-)", "moyenne", "moyenne(+)", "prononcée"], "dev": ["jeune", "en évolution", "pleinement évolué", "fatigué/sur le déclin"],
  "sw": ["sec", "demi-sec", "moyennement sec", "moyennement doux", "doux", "liquoreux"], "ac": ["faible", "moyenne(-)", "moyenne", "moyenne(+)", "élevée"],
  "tan": ["faible", "moyen(-)", "moyen", "moyen(+)", "élevé"], "alc": ["faible", "moyen", "élevé"], "body": ["léger", "moyen(-)", "moyen", "moyen(+)", "corsé"],
  "mou": ["délicate", "crémeuse", "agressive"], "fint": ["faible", "moyenne(-)", "moyenne", "moyenne(+)", "prononcée"],
  "fin": ["courte", "moyenne(-)", "moyenne", "moyenne(+)", "longue"], "q": ["défectueux", "médiocre", "acceptable", "bon", "très bon", "exceptionnel"],
  "rd": ["trop jeune", "peut se boire maintenant, mais a un potentiel de vieillissement", "à boire maintenant : ne se prête pas au vieillissement", "trop vieux"]},
}
ARI, NMI = {}, {}
for p in S.P:
    ARI[p['id']] = {lg: {k: I.tr(p['ar'][k], li) for k in 'pst'} for li, lg in ((0, 'it'), (1, 'fr'))}
    if p['n'] in I.N: NMI[p['id']] = {'it': I.N[p['n']][0], 'fr': I.N[p['n']][1]}
js = '/* ---------- v50: tasting (SAT) terms, aromas and names in the reader\'s language ---------- */\n'
js += 'const SCLI=' + json.dumps(SCLI, ensure_ascii=False) + ';\n'
js += 'const SARI=' + json.dumps(ARI, ensure_ascii=False) + ';\n'
js += 'const SNMI=' + json.dumps(NMI, ensure_ascii=False) + ';\n'
js += r'''(function(){ const EN={}; Object.keys(SCL).forEach(k=>{ EN[k]=SCL[k]; Object.defineProperty(SCL,k,{get(){ const x=SCLI[lang]&&SCLI[lang][k]; return x||EN[k]; },enumerable:true,configurable:true}); });
  SATP.forEach(p=>{ const ar=p.ar, n=p.n; Object.defineProperty(p,"ar",{get(){ return (SARI[p.id]&&SARI[p.id][lang])||ar; },enumerable:true,configurable:true});
    Object.defineProperty(p,"n",{get(){ return (SNMI[p.id]&&SNMI[p.id][lang])||n; },enumerable:true,configurable:true}); }); })();
Object.assign(T.it,{sTermsNote:"Termini ufficiali della scheda SAT del WSET, in italiano.",sQJ:"Equilibrio · Persistenza · Intensità · Complessità",sOthEg:"es. lacrime, deposito, perlage, bollicine",sAlcNote:"Alcol: vini fermi basso < 11%, medio 11–13,9%, alto ≥ 14%; fortificati basso 15–16,4%, medio 16,5–18,4%, alto ≥ 18,5%.",sQNote:"Qualità: positivo su tutti e 4 i criteri BLIC = eccezionale, 3 = molto buono, 2 = buono, 1 = accettabile."});
Object.assign(T.fr,{sTermsNote:"Termes officiels de la grille SAT du WSET, en français.",sQJ:"Équilibre · Longueur · Intensité · Complexité",sOthEg:"ex. larmes, dépôt, perlant, bulles",sAlcNote:"Alcool : vins tranquilles faible < 11 %, moyen 11–13,9 %, élevé ≥ 14 % ; mutés faible 15–16,4 %, moyen 16,5–18,4 %, élevé ≥ 18,5 %.",sQNote:"Qualité : positif sur les 4 critères BLIC = exceptionnel, 3 = très bon, 2 = bon, 1 = acceptable."});
Object.assign(T.en,{sTermsNote:"Terms are the official WSET SAT terms, as in the textbook.",sQJ:"Balance · Length · Intensity · Complexity",sOthEg:"e.g. legs/tears, deposit, pétillance, bubbles"});
function satRef(){
  const row=(k,c)=>`<dt>${t("f_"+k)}</dt><dd>${(k==="col"?["w","p","r"].map(x=>t("t"+x)+": "+SCL["col"+x].join(" – ")).join("<br>"):SCL[k].join(" – "))}</dd>`;
  const c={t:"w",sp:1};
  return `<details class="model"><summary>${t("sRefT")}</summary><div class="mb"><p class="muted small">${t("sTermsNote")}</p><dl class="sref">${SSEC.map(([s,ks])=>`<h4>${t(s)}</h4>`+ks.map(k=>STXT[k]?`<dt>${t("f_"+k)}</dt><dd>${k==="qj"?t("sQJ"):k==="oth"?t("sOthEg"):t("sEg")}</dd>`:row(k,c)).join("")).join("")}</dl><p class="small" style="margin-top:10px">${t("sAlcNote")}</p><p class="small">${t("sQNote")}</p></div></details>`;
}
'''
open(os.path.join(D, 'app5.js'), 'w').write(js)
print('app5.js', len(js))
