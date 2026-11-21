# Lavori in coda (aggiornato il 20 novembre 2026, sera)

Promemoria per chi riprende il lavoro. Il limite di utilizzo regge pochi lavori alla volta: si lanciano 3–4 lavori,
si aspetta che pubblichino, poi i successivi. Ogni lavoro usa un proprio worktree e pubblica con `git push origin HEAD:main`.

## In corso
- Sitemap: indice + una sitemap per lingua, audit dell'indicizzazione (worktree `wt-sitemap`).
- App: Sake 1 e Birra 1 (`wt-sakebeer`), suoni (`wt-sfx`), ultimi testi in inglese del livello 2 (`wt-l2core`).

## In coda, in quest'ordine
1. Fatto (21 nov): guida completa del Livello 3 e del Diploma (en/it/fr/es/es-ar, `tools/seo2/lvguide.py`) e pulsanti di conversione
   in tutte le guide, 19 lingue (`tools/seo_tech/cta.py`, agganciato alle build e a `check_site.sh`).
2. **Una guida completa per ogni programma d'esame**: Birra 1 e 2, Sake 1, 2 e 3 (nuove); Spirits 1, 2 e 3 (esistono: stesso formato
   delle guide dei livelli 1–4). Prima en/it/fr/es/es-ar, poi le altre lingue. Fonti: le specifiche in /home/claude/books (private).
   Non promettere corsi che nell'app non esistono ancora.
3. **«Spirits» nella lingua locale**, su sito e app, senza cambiare gli indirizzi delle pagine. Dove esiste, vale il nome
   ufficiale della qualifica: fr Spiritueux, es Espirituosos, pt Destilados, de Spirituosen. Proposta per le altre: it Distillati,
   nl Gedistilleerd, el Αποστάγματα, tr Distile içkiler, zh 烈酒; pl, ru, ar, ja, ko, th da verificare sulle specifiche ufficiali.
4. Traduzione della guida del Livello 3 e delle novità della guida del Diploma nelle altre 14 lingue.
5. Diploma D4 Spumanti e D5 Fortificati nell'app (`wt-d4d5`), poi D3.
6. Spirits 2 nell'app in tedesco, portoghese e cinese tradizionale (`wt-de-s2`, `wt-pt-s2`, `wt-zh-s2`).
7. App iOS e Android: scheda dei negozi (testi, screenshot), informativa sulla privacy (servono i dati del titolare),
   domande sui dati raccolti. Guida: `mobile/PUBBLICAZIONE.md`.
8. Sake 1 e Birra 1 nelle lingue tradotte con la mappa; domande aperte in più per D1 e D2.

## Regole della proprietaria
- Mai i prezzi di The Wine Goat (abbonamento, piani, sconti). I prezzi dei vini nei contenuti si traducono fedelmente.
- Sito indipendente: mai dichiararsi affiliati a WSET, mai chiamare «ufficiali» le nostre domande, mai nominare la scuola EVS.
- Foto: didascalia che descrive solo ciò che si vede, foto solo dove c'entra, crediti nella pagina dedicata e nei dati strutturati.
- Pass, Merit e Distinction restano in inglese.
- Non cambiare gli indirizzi delle pagine già pubblicate.
- Chiavi e password solo nei segreti di GitHub, mai in chat o nel repository.

## Nuove lingue del sito (richiesta 21 nov)
- Bulgaro (bg) e rumeno (ro): home + guide, da avviare dopo che la nuova struttura di link/sitemap è pubblicata. App: restano le lingue esistenti.
- Spagnolo: nessuna pagina per paese. /es-ar/ vale per Argentina e Uruguay (hreflang es-AR, es-UY); /es/ per Spagna e gli altri paesi ispanofoni.
