# App Android e iOS di The Wine Goat

Le app sono l'app web (`../app`) dentro un guscio nativo (Capacitor). Ogni modifica a `app/` arriva anche nelle app.

## Compilazione
GitHub compila tutto da solo a ogni modifica (scheda **Actions → App mobile**):
- `thewinegoat-android`: `app-debug.apk` da installare sul telefono per provare, `app-release.aab` per Google Play (da firmare).
- `thewinegoat-ios-simulator`: build per il simulatore. Per l'App Store serve un Mac con Xcode (o un servizio come Codemagic) e l'account Apple Developer.

Audio e podcast non sono dentro le app (oltre 230 MB): vengono ascoltati in streaming da thewinegoat.com.

## Pagamenti
- Sito: Stripe, come prima.
- App: acquisto integrato Apple / Google tramite RevenueCat. Prodotto `twg_full_12m`, 12 mesi di accesso.
  1. App Store Connect: acquisto in-app **Non-Renewing Subscription** con ID `twg_full_12m`.
  2. Google Play Console: prodotto in-app (one-time) con ID `twg_full_12m`.
  3. RevenueCat: progetto con le due app, prodotto `twg_full_12m`; copia le chiavi pubbliche nelle `iap` di `TWG_CONFIG` in `app/index.html` (`appleKey`, `googleKey`).
  4. Webhook RevenueCat → `supabase/functions/revenuecat-webhook` (istruzioni nel file): l'acquisto fatto nell'app sblocca anche il sito.
