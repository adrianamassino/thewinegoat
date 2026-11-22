/* D3 Wines of the world: published region by region. "todo" = regions still to come (shown in the hub, no dates);
   remove an entry when its chapter file is added. Practice papers: the timings are the exam's (2 h + 80 min of theory,
   2 × 90 min of tasting, 6 wines each); the number of questions per theory paper is our own practice design. */
module.exports = {
  name: { it: "I vini del mondo", fr: "Les vins du monde", en: "Wines of the world", es: "Vinos del mundo" },
  w: 50,
  exam: { minutes: 120, q: 4, papers: [{ minutes: 120, q: 4 }, { minutes: 80, q: 3 }, { minutes: 90, q: 0, tasting: 6 }, { minutes: 90, q: 0, tasting: 6 }] },
  todo: [
    ["Nuova Zelanda", "Nouvelle-Zélande", "New Zealand", "Nueva Zelanda"], ["Cina", "Chine", "China", "China"],
    ["Degustazione: metodo e vini a confronto", "Dégustation : méthode et vins comparés", "Tasting: method and wines compared", "Cata: método y vinos comparados"]
  ]
};
