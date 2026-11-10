# The Wine Goat — sito autonomo (thewinegoat.com)

Il sito funziona da solo: nessun servizio esterno, nessuna intelligenza artificiale, nessun database online, nessun carattere scaricato da Google. Sono solo file statici.

## Cosa contiene
- `index.html`: manda il visitatore sulla pagina della sua lingua.
- `it/`, `fr/`, `en/`: le pagine di presentazione multilingue.
- `app/`: l'app di studio (quiz, domande aperte, degustazione, giochi, mappe, podcast, appunti).
- `img/`, `fonts/`: immagini e caratteri, tutti locali.
- `sitemap.xml`, `robots.txt`: per Google.
- `netlify.toml`: reindirizzamento automatico per lingua (se usi Netlify).

## Come funziona senza servizi esterni
- **Domande aperte**: la correzione avviene sul dispositivo dello studente. La risposta viene confrontata con i punti chiave del libro di ogni domanda: l'app mostra i punti centrati e quelli mancanti, stima il punteggio e propone la risposta modello costruita dagli stessi punti chiave.
- **Progressi**: sono salvati nel browser del dispositivo usato (non c'è un account online).
- **Appunti**: le foto delle pagine restano sul dispositivo. La trascrizione dal vivo delle lezioni usa il riconoscimento vocale del browser (Chrome, Edge, Safari).

## Messa online
1. Crea un account su https://app.netlify.com (oppure usa qualsiasi hosting di file statici).
2. **Add new site → Deploy manually** e trascina l'intera cartella.
3. **Domain management → Add a domain** → `thewinegoat.com`, poi segui le istruzioni per il DNS.
4. Google Search Console → aggiungi il dominio → invia `https://thewinegoat.com/sitemap.xml`.

Funziona anche aprendo i file da un server locale qualsiasi; il reindirizzamento per lingua lato server c'è solo su Netlify (altrove lo fa la pagina `index.html`).

## Aggiungere una lingua
Crea `landing/lang/<codice>.json` con le stesse voci di `it.json`, aggiungi il codice in `LANGS` dentro `landing/build_landing.py` e rigenera.

## Vendere i moduli
Un sito senza servizi esterni non può incassare pagamenti da solo. Quando vorrai vendere i moduli servirà un servizio di pagamento (per esempio i link di pagamento di Stripe) e un modo per sbloccare i moduli acquistati.
