"""v4: autonomous site — no AI, no accounts: copy aligned."""
import json, os
B = os.path.dirname(os.path.abspath(__file__))
X = {
'it': {'login': "Apri l'app",
  'feat1': ["Domande a risposta breve corrette", "Scrivi la tua risposta e ricevi subito la correzione punto per punto, in base ai punti chiave del libro: cosa hai centrato, cosa manca, quanti punti avresti preso."],
  'feat2': ["Appunti: foto e lezioni", "Fotografa le pagine dei tuoi appunti e ritrovale nell'app accanto al tuo testo, oppure trascrivi la lezione mentre l'insegnante parla."],
  'after_p': "Nell'app il modulo Bordeaux è gratis per intero: quiz, domande aperte con correzione e ripasso dei tuoi errori.", 'after_cta': "Apri l'app gratis",
  'why_corr': "Immediata, punto per punto, sui punti chiave del libro",
  'faq_corr': ["Come funziona la correzione delle domande a risposta breve?", "Scrivi la tua risposta: l'app la confronta con i punti chiave del libro, segnala gli elementi centrati e quelli mancanti, stima il punteggio e ti mostra la risposta modello. Tutto avviene sul tuo dispositivo, senza servizi esterni."],
  'faq_phone': ["Funziona sul telefono?", "Sì, The Wine Goat funziona nel browser di telefono, tablet e computer. I progressi restano salvati sul dispositivo che usi."],
  'photo_t': "Foto degli appunti", 'photo_d': "Fotografa le pagine scritte a mano: restano nell'app, sul tuo dispositivo, accanto al tuo testo.",
  'guide1': "Le 4 domande a risposta breve valgono metà della teoria e sono la parte in cui si perdono più punti. Non basta conoscere i fatti: bisogna spiegare il perché, collegando causa ed effetto (clima → maturazione → stile del vino). Con The Wine Goat scrivi la tua risposta, ricevi la correzione punto per punto in base ai punti chiave del libro e vedi la risposta modello."},
'fr': {'login': "Ouvrir l'app",
  'feat1': ["Questions à réponse courte corrigées", "Rédigez votre réponse et recevez aussitôt une correction point par point, d'après les points clés du livre : ce que vous avez trouvé, ce qui manque, combien de points vous auriez obtenus."],
  'feat2': ["Notes : photos et cours", "Photographiez les pages de vos notes et retrouvez-les dans l'application à côté de votre texte, ou transcrivez le cours pendant que l'enseignant parle."],
  'after_p': "Dans l'application, le module Bordeaux est entièrement gratuit : QCM, questions ouvertes corrigées et révision de vos erreurs.", 'after_cta': "Ouvrir l'app gratuitement",
  'why_corr': "Immédiate, point par point, d'après les points clés du livre",
  'faq_corr': ["Comment fonctionne la correction des questions à réponse courte ?", "Rédigez votre réponse : l'application la compare aux points clés du livre, indique les éléments trouvés et ceux qui manquent, estime la note et vous montre la réponse modèle. Tout se fait sur votre appareil, sans service extérieur."],
  'faq_phone': ["Est-ce que ça marche sur téléphone ?", "Oui, The Wine Goat fonctionne dans le navigateur du téléphone, de la tablette et de l'ordinateur. Votre progression reste enregistrée sur l'appareil que vous utilisez."],
  'photo_t': "Photos des notes", 'photo_d': "Photographiez vos pages manuscrites : elles restent dans l'application, sur votre appareil, à côté de votre texte.",
  'guide1': "Les 4 questions à réponse courte représentent la moitié de la théorie, et c'est là que l'on perd le plus de points. Connaître les faits ne suffit pas : il faut expliquer le pourquoi, en reliant la cause et l'effet (climat → maturité → style du vin). Avec The Wine Goat, vous rédigez votre réponse, recevez une correction point par point d'après les points clés du livre et voyez la réponse modèle."},
'en': {'login': "Open the app",
  'feat1': ["Short written answers, marked", "Write your answer and get instant point-by-point marking against the textbook key points: what you hit, what is missing and how many marks you would have scored."],
  'feat2': ["Notes: photos and lessons", "Photograph the pages of your notes and keep them in the app next to your own text, or transcribe the lesson as your teacher speaks."],
  'after_p': "In the app the whole Bordeaux module is free: practice questions, marked open questions and your mistake review.", 'after_cta': "Open the app for free",
  'why_corr': "Instant, point by point, against the textbook key points",
  'faq_corr': ["How does marking of short written answers work?", "Type your answer: the app compares it with the textbook key points, shows which points you hit and which are missing, estimates your score and shows you the model answer. It all happens on your device, with no external service."],
  'faq_phone': ["Does it work on my phone?", "Yes, The Wine Goat runs in the browser on phone, tablet and computer. Your progress is saved on the device you use."],
  'photo_t': "Photos of your notes", 'photo_d': "Photograph your handwritten pages: they stay in the app, on your device, next to your own text.",
  'guide1': "The 4 short written answer questions are worth half of the theory marks, and they are where most marks are lost. Knowing facts is not enough: you have to explain why, linking cause and effect (climate → ripeness → wine style). With The Wine Goat you type your answer, get point-by-point marking against the textbook key points and see the model answer."}}
for c, x in X.items():
    p = os.path.join(B, 'lang', c + '.json'); d = json.load(open(p, encoding='utf-8'))
    d['nav']['login'] = x['login']
    d['feat']['items'][1] = x['feat1']; d['feat']['items'][2] = x['feat2']
    d['trial']['after_p'] = x['after_p']; d['trial']['after_h'] = d['trial']['after_h']
    d['free']['cta'] = d['free']['cta']
    for r in d['why']['rows']:
        if 'foto' in r[2].lower() or 'photo' in r[2].lower(): r[2] = x['why_corr']
    items = d['faq']['items']
    for i, (q, a) in enumerate(items):
        if q.startswith(x['faq_corr'][0][:12]): items[i] = x['faq_corr']
        if q.startswith(x['faq_phone'][0][:8]): items[i] = x['faq_phone']
    d['explore']['notes']['photo_t'] = x['photo_t']; d['explore']['notes']['photo_d'] = x['photo_d']
    d['explore']['notes']['lesson_d'] = d['explore']['notes']['lesson_d'].split('.')[0] + '.'
    d['guide']['blocks'][1][1] = x['guide1']
    d['trial']['after_cta'] = x['after_cta']
    json.dump(d, open(p, 'w', encoding='utf-8'), ensure_ascii=False, indent=1)
print('ok')
