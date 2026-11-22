/* D3 Wines of the world: published region by region. "todo" = regions still to come (shown in the hub, no dates);
   remove an entry when its chapter file is added. Practice papers: the timings are the exam's (2 h + 80 min of theory,
   2 × 90 min of tasting, 6 wines each); the number of questions per theory paper is our own practice design. */
module.exports = {
  name: { it: "I vini del mondo", fr: "Les vins du monde", en: "Wines of the world", es: "Vinos del mundo" },
  w: 50,
  exam: { minutes: 120, q: 4, papers: [{ minutes: 120, q: 4 }, { minutes: 80, q: 3 }, { minutes: 90, q: 0, tasting: 6 }, { minutes: 90, q: 0, tasting: 6 }] },
  todo: [
    ["Spagna: Rioja, Navarra e Aragona", "Espagne : Rioja, Navarre et Aragon", "Spain: Rioja, Navarra and Aragon", "España: Rioja, Navarra y Aragón"],
    ["Spagna: Catalogna, Levante e centro-sud", "Espagne : Catalogne, Levant et centre-sud", "Spain: Catalunya, the Levante and the centre-south", "España: Cataluña, Levante y centro-sur"], ["Portogallo", "Portugal", "Portugal", "Portugal"],
    ["Germania", "Allemagne", "Germany", "Alemania"], ["Austria", "Autriche", "Austria", "Austria"],
    ["Tokaj, Grecia e resto d'Europa", "Tokaj, Grèce et reste de l'Europe", "Tokaj, Greece and the rest of Europe", "Tokaj, Grecia y resto de Europa"],
    ["Stati Uniti e Canada", "États-Unis et Canada", "USA and Canada", "Estados Unidos y Canadá"],
    ["Cile e Argentina", "Chili et Argentine", "Chile and Argentina", "Chile y Argentina"], ["Sudafrica", "Afrique du Sud", "South Africa", "Sudáfrica"],
    ["Australia", "Australie", "Australia", "Australia"], ["Nuova Zelanda", "Nouvelle-Zélande", "New Zealand", "Nueva Zelanda"], ["Cina", "Chine", "China", "China"],
    ["Degustazione: metodo e vini a confronto", "Dégustation : méthode et vins comparés", "Tasting: method and wines compared", "Cata: método y vinos comparados"]
  ]
};
