/* Shared marking guidance for the Diploma written questions (not a unit folder: build.js ignores files at this level).
   The mark split is our own practice design and is labelled as such in every guide. */
const L = ["it", "fr", "en", "es"];
const HEAD = {
  it: (s) => `**Punteggio**: ${s}. La ripartizione dei punti è una nostra proposta di allenamento, non quella dell'esame.`,
  fr: (s) => `**Barème** : ${s}. La répartition des points est notre proposition d'entraînement, pas celle de l'examen.`,
  en: (s) => `**Marks**: ${s}. The split of marks is our own practice design, not the exam's.`,
  es: (s) => `**Puntuación**: ${s}. El reparto de puntos es nuestra propuesta de práctica, no el del examen.`
};
const PT = { it: "punti", fr: "points", en: "marks", es: "puntos" };
const CRIT = {
  it: "**Criteri**: ogni punto pertinente e spiegato conta; un elenco senza spiegazione vale poco. Collega sempre la causa all'effetto su stile, qualità e prezzo e usa esempi concreti.",
  fr: "**Critères** : chaque point pertinent et expliqué compte ; une liste sans explication rapporte peu. Reliez toujours la cause à son effet sur le style, la qualité et le prix, avec des exemples concrets.",
  en: "**Criteria**: every relevant, explained point counts; a list without explanation earns little. Always link the cause to its effect on style, quality and price, and use concrete examples.",
  es: "**Criterios**: cuenta cada punto pertinente y explicado; una lista sin explicación vale poco. Relaciona siempre la causa con su efecto en el estilo, la calidad y el precio, con ejemplos concretos."
};
/* G([6, 9]) → guide for a question with parts of 6 and 9 marks; extra = optional [it, fr, en, es] structure hint */
function G(marks, extra) {
  return L.map((l, i) => {
    const s = marks.length === 1 ? `${marks[0]} ${PT[l]}` : marks.map((m, j) => `${"abcdefgh"[j]}) ${m}`).join(" · ") + ` (${marks.reduce((a, b) => a + b, 0)} ${PT[l]})`;
    return HEAD[l](s) + "\n\n" + (extra ? extra[i] + "\n\n" : "") + CRIT[l];
  });
}
/* guide for the tasting notes: 2 + 6 + 8 + 6 */
const GT = [
  "**Punteggio**: aspetto 2 · naso 6 · palato 8 · conclusioni 6 (22 punti). La ripartizione dei punti è una nostra proposta di allenamento, non quella dell'esame.\n\n**Criteri**: un solo termine per voce della scala; descrittori precisi; nelle conclusioni la qualità va motivata con equilibrio, intensità, complessità e persistenza, poi stile, maturazione e origine probabili, e se il vino è adatto all'invecchiamento in bottiglia.",
  "**Barème** : aspect 2 · nez 6 · bouche 8 · conclusions 6 (22 points). La répartition des points est notre proposition d'entraînement, pas celle de l'examen.\n\n**Critères** : un seul terme par ligne de l'échelle ; des descripteurs précis ; dans les conclusions, la qualité se justifie par l'équilibre, l'intensité, la complexité et la longueur, puis le style, l'élevage et l'origine probables, et l'aptitude ou non à la garde en bouteille.",
  "**Marks**: appearance 2 · nose 6 · palate 8 · conclusions 6 (22 marks). The split of marks is our own practice design, not the exam's.\n\n**Criteria**: one term per line of the scale; precise descriptors; in the conclusions justify quality by balance, intensity, complexity and length, then give the likely style, maturation and origin, and whether the wine is suitable for bottle ageing.",
  "**Puntuación**: aspecto 2 · nariz 6 · boca 8 · conclusiones 6 (22 puntos). El reparto de puntos es nuestra propuesta de práctica, no el del examen.\n\n**Criterios**: un solo término por línea de la escala; descriptores precisos; en las conclusiones justifica la calidad con equilibrio, intensidad, complejidad y longitud, luego indica estilo, crianza y origen probables, y si el vino es apto para guarda en botella."
];
const GT4 = GT.map((s, i) => s.replace(["stile, maturazione e origine probabili", "le style, l'élevage et l'origine probables", "the likely style, maturation and origin", "estilo, crianza y origen probables"][i], ["metodo di produzione e origine probabili", "la méthode d'élaboration et l'origine probables", "the likely production method and origin", "método de elaboración y origen probables"][i]));
module.exports = { G, GT, GT4 };
