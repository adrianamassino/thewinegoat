# Spirits: Livelli 1, 2, 3

Strutture (programma, pesi d'esame, griglie di degustazione) in `app/spirits/s1|s2|s3/structure.js`
(`window.TWG_S1`, `TWG_S2`, `TWG_S3`). Contenuti ancora da scrivere.

| Livello | Esame | Promozione | Gruppi (domande) | Capitoli |
|---|---|---|---|---|
| 1 | 30 test, 45 min | 70% | produzione 5 · famiglie 20 · servizio 5 | 12 |
| 2 | 50 test, 60 min | 55 / 70 / 85% | produzione 14 · distillati 23 · aromatizzati 7 · bar 6 | 20 |
| 3 | 50 test + 10 risposte brevi (80 punti) in 2 h 10 · degustazione 2 campioni in 30 min | 55 / 65 / 80% (media) | principi 10 · selezionati 15 · altri 25 | 31 |

Piano dei contenuti (stesso metodo del vino Livello 1 e 2):
1. bozze in `tools/spirits/s1/out/*.json` (e s2, s3) nel formato [it, fr, en, es]: lezioni, domande, flashcard;
   per il Livello 3 anche domande aperte con punti di correzione e note di degustazione modello;
2. una build genera `app/spirits/sN/content.js`;
3. nell'app: selettore "Vino / Spirits", poi il livello; Spirits Livello 1 gratuito come il vino Livello 1.

Obiettivo indicativo: L1 ~200 domande, ~40 lezioni, ~80 flashcard; L2 ~500 domande, ~70 lezioni, ~200 flashcard;
L3 ~800 domande, ~110 lezioni, ~120 domande aperte, ~40 note di degustazione modello.
