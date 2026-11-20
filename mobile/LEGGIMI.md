# App Android e iOS di The Wine Goat

Le app sono l'app web (`../app`) dentro un guscio nativo (Capacitor). Ogni modifica a `app/` arriva anche nelle app.

## Compilazione
GitHub compila tutto da solo a ogni modifica (scheda **Actions → App mobile**):
- `thewinegoat-android`: `app-debug.apk` da installare sul telefono per provare, `app-release.aab` per Google Play (da firmare).
- `thewinegoat-ios-simulator`: build per il simulatore. Per l'App Store serve un Mac con Xcode (o un servizio come Codemagic) e l'account Apple Developer.

## Cosa c'è dentro le app
`mobile/scripts/build-www.mjs` prepara il pacchetto (circa 85 MB) e si ferma con un errore se qualcosa non torna:
- **Audio e podcast non sono dentro le app** (cartelle `audio` e `pods`, a qualsiasi livello: oltre 300 MB): vengono ascoltati in streaming da thewinegoat.com. Google Play accetta al massimo 200 MB; lo script blocca il build sopra i 150 MB o se resta anche un solo MP3.
- Delle immagini del sito entrano solo quelle usate dall'app: logo, capre (`assets/deco.js`) e le foto delle lezioni elencate in `app/photos.js`.
- I link al sito (crediti fotografici) e i link nelle email di accesso puntano a thewinegoat.com.

## Permessi
- **Fotocamera** (scanner delle etichette, foto degli appunti): `CAMERA` in `AndroidManifest.xml`, `NSCameraUsageDescription` in `Info.plist`.
- **Microfono e riconoscimento vocale** (solo iOS, per trascrivere la lezione): `NSMicrophoneUsageDescription`, `NSSpeechRecognitionUsageDescription`. Su Android il riconoscimento vocale del browser di norma non esiste dentro le app (WebView), quindi lì la trascrizione della lezione non è disponibile: da verificare su un telefono vero.
- Su iOS l'app segue la lingua del telefono (`CFBundleAllowMixedLocalizations`, `CFBundleLocalizations`).

## Pagamenti
- Sito: Stripe, come prima.
- App: acquisto integrato Apple / Google tramite RevenueCat. Prodotto `twg_full_12m`, 12 mesi di accesso.
  1. App Store Connect: acquisto in-app **Non-Renewing Subscription** con ID `twg_full_12m`.
  2. Google Play Console: prodotto in-app (one-time) con ID `twg_full_12m`.
  3. RevenueCat: progetto con le due app, prodotto `twg_full_12m`; copia le chiavi pubbliche nelle `iap` di `TWG_CONFIG` in `app/index.html` (`appleKey`, `googleKey`).
  4. Webhook RevenueCat → `supabase/functions/revenuecat-webhook` (istruzioni nel file): l'acquisto fatto nell'app sblocca anche il sito.
