# Sorgenti di The Wine Goat

Questo ramo contiene i file di lavoro (non il sito pubblicato, che è nel ramo `main`).

- `h/` – sorgenti dell'app (script `appNN.js`, dati, patch). Build: `build.sh`.
- `landing/` – generatore delle pagine iniziali multilingue (`page_v2.py`, `lang/*.json`, `site.css`, `site.js`, immagini).
- `site/build.py` – assembla il pacchetto finale (app + landing) da pubblicare su `main`.
