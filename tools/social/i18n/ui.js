// Template UI strings per language for the localised Instagram builds (render.js setLang()).
// Badges: course + level in the local language, as on the site pages of each language (/de/, /nl/ say "Level").
'use strict';
const HEAD = '<link rel="stylesheet" href="tools/social/i18n/fonts.css"><script src="tools/social/i18n/fit.js"></script>';

const UI = {
  it: { handle: '@thewinegoat.it', swipe: 'Scorri', cta: 'Allenati gratis su thewinegoat.com', mistake: 'Errore', myth: 'Mito', fact: 'Realtà',
    weak: 'Risposta debole', strong: 'Risposta forte', photo: 'Foto', aOrB: 'A o B?', vote: 'Vota, poi tocca per la risposta', answer: 'La risposta',
    watch: 'Guarda', level: 'Livello', course: { wine: 'Vino', spirits: 'Distillati', sake: 'Sake', beer: 'Birra' } },
  fr: { handle: '@thewinegoat.fr', swipe: 'Glissez', cta: 'Entraînez-vous gratuitement sur thewinegoat.com', mistake: 'Erreur', myth: 'Mythe', fact: 'Réalité',
    weak: 'Réponse faible', strong: 'Bonne réponse', photo: 'Photo', aOrB: 'A ou B ?', vote: 'Votez, puis touchez pour la réponse', answer: 'La réponse',
    watch: 'Regarder', level: 'Niveau', course: { wine: 'Vin', spirits: 'Spiritueux', sake: 'Saké', beer: 'Bière' } },
  de: { handle: '@thewinegoat.de', swipe: 'Wischen', cta: 'Kostenlos üben auf thewinegoat.com', mistake: 'Fehler', myth: 'Mythos', fact: 'Fakt',
    weak: 'Schwache Antwort', strong: 'Starke Antwort', photo: 'Foto', aOrB: 'A oder B?', vote: 'Abstimmen, dann tippen für die Antwort', answer: 'Die Antwort',
    watch: 'Ansehen', level: 'Level', course: { wine: 'Wein', spirits: 'Spirituosen', sake: 'Sake', beer: 'Bier' } },
  ru: { handle: '@thewinegoat.ru', swipe: 'Листайте', cta: 'Тренируйтесь бесплатно на thewinegoat.com', mistake: 'Ошибка', myth: 'Миф', fact: 'Факт',
    weak: 'Слабый ответ', strong: 'Сильный ответ', photo: 'Фото', aOrB: 'A или B?', vote: 'Голосуйте, затем нажмите для ответа', answer: 'Ответ',
    watch: 'Смотреть', level: 'Уровень', course: { wine: 'Вино', spirits: 'Крепкие напитки', sake: 'Саке', beer: 'Пиво' } },
  pl: { handle: '@thewinegoat.pl', swipe: 'Przesuń', cta: 'Ćwicz za darmo na thewinegoat.com', mistake: 'Błąd', myth: 'Mit', fact: 'Fakt',
    weak: 'Słaba odpowiedź', strong: 'Mocna odpowiedź', photo: 'Zdjęcie', aOrB: 'A czy B?', vote: 'Zagłosuj, potem stuknij po odpowiedź', answer: 'Odpowiedź',
    watch: 'Obejrzyj', level: 'Poziom', course: { wine: 'Wino', spirits: 'Alkohole mocne', sake: 'Sake', beer: 'Piwo' } },
  es: { handle: '@thewinegoat.es', swipe: 'Desliza', cta: 'Practica gratis en thewinegoat.com', mistake: 'Error', myth: 'Mito', fact: 'Realidad',
    weak: 'Respuesta floja', strong: 'Respuesta sólida', photo: 'Foto', aOrB: '¿A o B?', vote: 'Vota y toca para ver la respuesta', answer: 'La respuesta',
    watch: 'Mira', level: 'Nivel', course: { wine: 'Vino', spirits: 'Destilados', sake: 'Sake', beer: 'Cerveza' } },
  'es-ar': { handle: '@thewinegoat.ar', swipe: 'Deslizá', cta: 'Practicá gratis en thewinegoat.com', mistake: 'Error', myth: 'Mito', fact: 'Realidad',
    weak: 'Respuesta floja', strong: 'Respuesta sólida', photo: 'Foto', aOrB: '¿A o B?', vote: 'Votá y tocá para ver la respuesta', answer: 'La respuesta',
    watch: 'Mirá', level: 'Nivel', course: { wine: 'Vino', spirits: 'Destilados', sake: 'Sake', beer: 'Cerveza' } },
  'pt-br': { handle: '@thewinegoat.br', swipe: 'Arraste', cta: 'Pratique grátis em thewinegoat.com', mistake: 'Erro', myth: 'Mito', fact: 'Fato',
    weak: 'Resposta fraca', strong: 'Resposta forte', photo: 'Foto', aOrB: 'A ou B?', vote: 'Vote e toque para ver a resposta', answer: 'A resposta',
    watch: 'Assista', level: 'Nível', course: { wine: 'Vinho', spirits: 'Destilados', sake: 'Saquê', beer: 'Cerveja' } },
  nl: { handle: '@thewinegoat.nl', swipe: 'Swipe', cta: 'Oefen gratis op thewinegoat.com', mistake: 'Fout', myth: 'Mythe', fact: 'Feit',
    weak: 'Zwak antwoord', strong: 'Sterk antwoord', photo: 'Foto', aOrB: 'A of B?', vote: 'Stem en tik voor het antwoord', answer: 'Het antwoord',
    watch: 'Bekijk', level: 'Level', course: { wine: 'Wijn', spirits: 'Spirits', sake: 'Sake', beer: 'Bier' } },
};
// html lang attribute (hyphenation, quotes) and the site path of each language (README bio link)
const HTML_LANG = { it: 'it', fr: 'fr', de: 'de', ru: 'ru', pl: 'pl', es: 'es', 'es-ar': 'es-AR', 'pt-br': 'pt-BR', nl: 'nl' };

module.exports = function ui(lang) {
  const t = UI[lang];
  if (!t) throw new Error(`no UI strings for language ${lang} (have: ${Object.keys(UI).join(', ')})`);
  return { ...t, lang: HTML_LANG[lang], head: HEAD };
};
module.exports.LANGS = Object.keys(UI);
