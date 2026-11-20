# Pannello di amministrazione — istruzioni

Indirizzo: **https://thewinegoat.com/admin/** (non è linkato da nessuna parte e non è indicizzato dai motori di ricerca).

Il pannello usa solo la chiave *publishable* di Supabase, già pubblica nell'app. Tutti i controlli di sicurezza
sono nel database: chi non è nella tabella `admins` vede solo «Non autorizzato» e il database rifiuta ogni richiesta.
**Non serve, e non va mai messa nel sito, la chiave `service_role`.**

## 1. Installazione (una volta sola, 3 minuti)

1. Assicurati di avere un account The Wine Goat (quello con cui accedi all'app). Se non ce l'hai, crealo prima nell'app.
2. Apri <https://supabase.com/dashboard>, entra nel progetto di The Wine Goat.
3. Nel menu a sinistra apri **SQL Editor** → **New query**.
4. Apri il file `supabase/admin.sql` di questo repository, copia **tutto** il contenuto e incollalo nell'editor.
5. Vai in fondo, alla sezione **11. IL TUO ACCOUNT AMMINISTRATORE**, e sostituisci `LA-TUA-EMAIL` con la tua email
   (lascia gli apici). Esempio: `lower('nome@esempio.com')`.
   *Non salvare la tua email nel file del repository: va scritta solo nell'editor di Supabase.*
6. Premi **Run**. Deve comparire «Success». Se compare l'avviso **NESSUN AMMINISTRATORE AGGIUNTO**, l'email non
   corrisponde a nessun account: correggila e premi di nuovo Run (si può rieseguire tutte le volte che vuoi).
7. Per il link di accesso via email: in **Authentication → URL Configuration → Redirect URLs** aggiungi
   `https://thewinegoat.com/admin/` (con email e password funziona anche senza).

## 2. Uso

1. Apri <https://thewinegoat.com/admin/>.
2. Accedi con la stessa email e password dell'app (oppure «Mandami un link di accesso»). Se sei già connessa
   all'app sullo stesso browser, entri direttamente.
3. Vedi:
   - in alto le statistiche (iscritti, nuovi e attivi negli ultimi 7 giorni, paganti, accessi concessi, gratuiti),
     il grafico delle iscrizioni al giorno (30 giorni) e la ripartizione paganti / concessi / gratuiti / scaduti;
   - la tabella degli utenti: nome, email, data di iscrizione, ultima attività, lingua dell'app, livello che stanno
     studiando, progressi (domande fatte e % di risposte corrette), stato dell'accesso e fonte del pagamento
     (Stripe sul web, App Store, Google Play, oppure «Concesso» da te);
   - ricerca, filtri (accesso, livello, lingua), ordinamento (clic sulle intestazioni o menu «Ordina»);
   - **Esporta CSV**: scarica gli utenti filtrati (separatore `;`, si apre direttamente in Excel).
4. **Gestisci** su un utente apre la scheda con tutti i dati e le azioni:
   - **Concedi**: accesso completo gratuito per 7/30/90/180/365 giorni, un numero di giorni a scelta, o **per sempre**.
     Con «dalla scadenza attuale» i giorni si aggiungono a un accesso già attivo (estensione).
   - **Diritti di accesso e pagamenti**: ogni acquisto o accesso concesso, con scadenza, «rimborsato» e nota
     modificabili (**Salva**). Gli accessi concessi da te si possono anche **Eliminare**.
   - **Revoca accessi concessi**: chiude subito solo gli accessi dati da te; gli acquisti pagati restano.
   - **Revoca tutto**: chiude anche gli acquisti pagati (bisogna scrivere REVOCA per confermare). Il rimborso del
     denaro, se dovuto, si fa a parte in Stripe / App Store / Google Play.
   - **Elimina utente**: cancella l'account e tutti i suoi dati. Per confermare bisogna scrivere l'email dell'utente.
5. **Registro azioni**: l'elenco di tutto quello che è stato fatto dal pannello (chi, quando, cosa, a chi).

Le modifiche all'accesso valgono dal prossimo avvio dell'app da parte dell'utente (sito, iPhone, Android).
Il Livello 1 resta sempre gratuito per tutti.

## 3. Cosa crea `admin.sql`

| Oggetto | A cosa serve |
|---|---|
| tabella `admins` | Chi è amministratore (per id dell'account, non per email). Non leggibile né modificabile dal sito. |
| tabella `admin_audit_log` | Registro di ogni azione del pannello. Non leggibile né modificabile dal sito. |
| tabella `purchases` (solo se mancasse) + colonne `source`, `external_id`, `note`, `created_at`, `id` (solo se mancano) | La tabella che l'app legge già per sbloccare l'accesso completo. Le righe esistenti non vengono toccate. |
| policy «purchases: read own» + divieto di scrittura dal sito | Ognuno legge solo i propri acquisti; nessuno può scriverli dal browser (Stripe e RevenueCat scrivono lato server). |
| `is_admin()` | Vero solo se chi chiama è nella tabella `admins`. |
| `admin_list_users()` | Elenco utenti con profilo, lingua, livello, progressi, acquisti e accessi. |
| `admin_grant_access(utente, giorni, nota, dalla_scadenza_attuale)` | Concede/estende l'accesso completo (giorni vuoto = per sempre, fino al 31/12/2999). Crea una riga in `purchases` con `source = 'admin'`. |
| `admin_revoke_access(utente, anche_pagati)` | Fa scadere adesso gli accessi concessi (e, se richiesto, anche quelli pagati). |
| `admin_update_purchase(id, scadenza, rimborsato, nota)` | Modifica una singola riga di acquisto/accesso. |
| `admin_delete_grant(id)` | Elimina un accesso concesso a mano (gli acquisti veri non si cancellano, si revocano). |
| `admin_delete_user(utente, email_di_conferma)` | Cancella le righe dell'utente in tutte le tabelle `public` che hanno una colonna `user_id` (progressi, profilo, acquisti…) e poi l'account. Un amministratore non si può eliminare. |
| `admin_list_audit(limite)` | Il registro delle azioni. |

Tutte le funzioni sono `SECURITY DEFINER` con `search_path` vuoto, controllano `is_admin()` come prima cosa
(altrimenti errore «not authorised») e sono eseguibili solo da utenti autenticati.

## 4. Aggiungere o togliere un amministratore

Nel SQL Editor:

```sql
-- aggiungere
insert into public.admins (user_id, email)
select id, email from auth.users where lower(email) = lower('email-della-persona') on conflict do nothing;
-- togliere
delete from public.admins where lower(email) = lower('email-della-persona');
```

## 5. Limiti da sapere

- **Livello studiato**: l'app lo salva nel cloud solo da questa versione in poi (campo `lvl` del profilo); per chi
  non ha più aperto l'app compare «—» finché non la riapre.
- **Progressi**: sono il totale delle domande fatte e la % di risposte corrette su tutti i livelli insieme
  (l'app salva un unico registro dei progressi, senza separarli per livello).
- **Importi pagati**: l'app e il webhook RevenueCat salvano scadenza, fonte e identificativo della transazione, non
  l'importo né la valuta. Gli importi si vedono in Stripe, App Store Connect, Google Play Console o RevenueCat.
- **Pagamenti Stripe senza account**: se qualcuno paga con Stripe prima di creare l'account, la riga compare nel
  pannello solo quando è collegata al suo account (`user_id`).
- Se un'altra tabella collega gli utenti con una colonna diversa da `user_id`, l'eliminazione dell'utente si ferma con
  un errore e non cancella niente: basta segnalarlo per aggiornare la funzione.
