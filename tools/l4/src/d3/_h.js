/* Shared helpers for the D3 chapter files. Not a chapter: it exports nothing the builder reads.
   H(c) → L lesson, M multiple choice (correct option first), F flashcard, Q written question (one part), QQ (several parts),
   T tasting note: appearance, nose and palate take key points only (the model answer is the same list as a sentence);
   the conclusion takes key points and a written model answer. Marks per part are our own practice design. */
const PT = [
  ["Aspetto", "Aspect", "Appearance", "Aspecto"],
  ["Naso", "Nez", "Nose", "Nariz"],
  ["Palato", "Bouche", "Palate", "Boca"],
  ["Valuta la qualità, motivando la risposta, e indica vitigno o vitigni, origine probabile e potenziale di evoluzione.", "Évaluez la qualité en justifiant votre réponse, et indiquez le ou les cépages, l'origine probable et le potentiel de garde.", "Assess the quality, giving reasons, and state the likely grape variety or varieties, origin and ageing potential.", "Evalúa la calidad, justificando la respuesta, e indica la variedad o variedades, el origen probable y el potencial de guarda."]
];
const MK = [2, 6, 8, 6];
const W = ["Scrivi la nota di degustazione completa di: ", "Rédigez la note de dégustation complète de : ", "Write a full tasting note for: ", "Escribe la nota de cata completa de: "];
const sent = k => { const s = k.split(";").map(x => x.trim()).filter(Boolean).join(", "); return s.charAt(0).toUpperCase() + s.slice(1) + "."; };
module.exports.H = c => ({
  L: (t, p, k) => ({ c, t, p, k }),
  M: (q, o, e) => ({ c, q, o, e }),
  F: (f, b) => ({ c, f, b }),
  S: s => [s, s, s, s],
  Q: (q, t, m, k, a) => ({ c, q, parts: [{ t, m, k, a }] }),
  QQ: (q, parts) => ({ c, q, parts: parts.map(([t, m, k, a]) => ({ t, m, k, a })) }),
  T: (w, ap, no, pa, ck, ca) => ({ c, tas: 1, q: w.map((x, i) => W[i] + x), parts: [ap, no, pa].map((k, i) => ({ t: PT[i], m: MK[i], k, a: k.map(sent) })).concat([{ t: PT[3], m: MK[3], k: ck, a: ca }]) })
});
