# Pubblicare le app su App Store e Google Play

Le app si compilano da sole su GitHub. Per **pubblicarle** servono gli account dei due negozi e alcune chiavi,
che vanno messe **solo** nei segreti del repository (GitHub > Settings > Secrets and variables > Actions >
New repository secret). Non incollarle mai in una chat, in un'email o in un file del repository.

Quando i segreti ci sono: GitHub > Actions > **App: pubblicazione** > Run workflow.

> Stato: il percorso Android (firma e numero di versione) è provato a ogni build con una chiave usa e getta.
> Il percorso iOS è provato fino all'archivio senza firma; firma e caricamento su App Store Connect si potranno
> provare solo con un account Apple Developer vero.

## 1. Gli account (li crei tu, a tuo nome o a nome di una società)

| | Costo | Note |
|---|---|---|
| **Apple Developer Program** | 99 USD l'anno | Come persona fisica il venditore mostrato sull'App Store è il tuo nome e cognome; come società servono un'entità legale e un numero D-U-N-S, e viene mostrato il nome della società. |
| **Google Play Console** | 25 USD una tantum | Gli account personali devono verificare un dispositivo Android e fare una prova chiusa con almeno 12 tester per 14 giorni di fila prima di pubblicare. |
| **RevenueCat** | ha un piano gratuito per iniziare (controlla le condizioni sul loro sito) | Gestisce l'acquisto dentro le app (prodotto `twg_full_12m`). Vedi `LEGGIMI.md`. |

Per vendere nell'Unione Europea come professionista i due negozi chiedono anche i dati di contatto del
venditore (indirizzo, telefono, email), che vengono mostrati nella scheda dell'app.

## 2. iPhone e iPad (si può fare tutto dal telefono)

1. Iscriviti all'Apple Developer Program: <https://developer.apple.com/programs/enroll/>.
2. In <https://developer.apple.com/account> > *Identifiers* registra l'App ID `com.thewinegoat.app`.
3. In <https://appstoreconnect.apple.com> > *Apps* > **+** crea l'app: piattaforma iOS, nome "The Wine Goat",
   bundle ID `com.thewinegoat.app`.
4. In App Store Connect > *Users and Access* > *Integrations* > *App Store Connect API* crea una chiave con
   ruolo **Admin** e scarica il file `.p8` (si scarica una volta sola).
5. Aggiungi questi segreti nel repository:
   - `APPLE_TEAM_ID`: il Team ID (developer.apple.com > Membership details);
   - `APPSTORE_KEY_ID`: l'ID della chiave;
   - `APPSTORE_ISSUER_ID`: l'Issuer ID mostrato sopra l'elenco delle chiavi;
   - `APPSTORE_P8`: tutto il contenuto del file `.p8`, comprese le righe `-----BEGIN PRIVATE KEY-----` e
     `-----END PRIVATE KEY-----`.
6. Avvia **App: pubblicazione** con solo "iOS" selezionato. Dopo qualche minuto il build compare in
   App Store Connect > TestFlight: installa l'app TestFlight sull'iPhone per provarlo.

## 3. Android

1. Registra l'account su <https://play.google.com/console/signup> e crea l'app "The Wine Goat".
2. Crea la **chiave di caricamento** (serve un computer con Java, una volta sola):
   ```
   keytool -genkeypair -v -keystore upload.jks -alias upload -keyalg RSA -keysize 2048 -validity 10000
   ```
   Conserva `upload.jks` e la password in un posto sicuro (un gestore di password). Poi trasformala in testo:
   - Mac: `base64 -i upload.jks | pbcopy`
   - Linux: `base64 -w0 upload.jks`
   - Windows (PowerShell): `[Convert]::ToBase64String([IO.File]::ReadAllBytes("upload.jks")) | Set-Clipboard`
3. Aggiungi questi segreti nel repository:
   - `ANDROID_KEYSTORE_BASE64`: il testo ottenuto al punto 2;
   - `ANDROID_KEYSTORE_PASSWORD`: la password del file;
   - `ANDROID_KEY_ALIAS`: `upload`;
   - `ANDROID_KEY_PASSWORD`: la password della chiave (di solito la stessa).
4. Avvia **App: pubblicazione** con solo "Android" selezionato e scarica `thewinegoat-android-release`
   (in fondo alla pagina dell'esecuzione): dentro c'è l'AAB firmato.
5. Il **primo** caricamento si fa a mano: Play Console > *Test* > *Test interni* > *Crea nuova release* >
   carica l'AAB. Accetta la firma dell'app gestita da Google (Play App Signing).
6. Facoltativo, per i caricamenti successivi: crea un account di servizio con accesso alla Play Console,
   metti il suo file JSON nel segreto `PLAY_SERVICE_ACCOUNT_JSON` e scegli una traccia nel workflow. La
   release arriva come **bozza**: la controlli e la pubblichi tu.

## 4. Prima di mandare le app in revisione

- **Informativa sulla privacy**: una pagina pubblica sul sito, il cui indirizzo va inserito in entrambi i
  negozi. *(da scrivere)*
- **Eliminazione dell'account**: fatta. Nell'app: finestra dell'account > "Elimina il mio account". Indirizzo
  da dare a Google Play: `https://thewinegoat.com/delete-account/`. Serve aver eseguito una volta
  `supabase/account_deletion.sql` nel SQL Editor di Supabase.
- **Acquisti dentro le app**: prodotto `twg_full_12m` nei due negozi e in RevenueCat, chiavi pubbliche in
  `TWG_CONFIG.iap` (vedi `LEGGIMI.md`). Finché mancano, nelle app il pulsante di acquisto dice "presto disponibile".
- **Account di prova per i revisori**: Apple chiede un accesso funzionante con tutti i contenuti sbloccati.
  Crea un account nell'app e dagli l'accesso completo dal pannello `/admin`.
- **Scheda del negozio**: nome, sottotitolo, descrizione, parole chiave, screenshot, icona, classificazione
  per età (l'app parla di alcol), questionario sui dati raccolti. *(da preparare)*
- **Marchio WSET®**: nome e descrizione devono dire chiaramente che l'app è indipendente e non affiliata.
- **Numero di versione**: `version` in `mobile/package.json` (per esempio `1.0.1`); il numero di build cresce da solo.
