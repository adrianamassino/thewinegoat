// The Wine Goat — RevenueCat → Supabase.
// Quando qualcuno compra (o viene rimborsato) dentro l'app iOS/Android, RevenueCat chiama questa funzione,
// che scrive l'acquisto in public.purchases: così l'accesso completo vale anche sul sito, come per Stripe.
//
// Messa online (una volta):
//   supabase functions deploy revenuecat-webhook --no-verify-jwt
//   supabase secrets set REVENUECAT_WEBHOOK_AUTH="una-parola-segreta-lunga"
// In RevenueCat > Integrations > Webhooks:
//   URL:  https://tetvfgpdxwkmfdxxadxa.supabase.co/functions/v1/revenuecat-webhook
//   Authorization header: la stessa parola segreta
//
// Colonne usate in public.purchases: user_id, expires_at, refunded, source, external_id.
// Se source / external_id non esistono ancora:
//   alter table public.purchases add column if not exists source text, add column if not exists external_id text unique;
import { createClient } from "npm:@supabase/supabase-js@2";

const DAYS = 365;
const PRODUCT = "twg_full_12m";
const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

Deno.serve(async (req) => {
  if (req.headers.get("authorization") !== Deno.env.get("REVENUECAT_WEBHOOK_AUTH")) return new Response("forbidden", { status: 401 });
  const { event } = await req.json().catch(() => ({ event: null }));
  if (!event) return new Response("bad request", { status: 400 });
  if (event.product_id && event.product_id !== PRODUCT) return new Response("ignored");

  // the Supabase account id: the app logs in to RevenueCat with it (anonymous ids are skipped until the person signs in)
  const ids = [event.app_user_id, event.original_app_user_id, ...(event.aliases || [])].filter(Boolean);
  const userId = ids.find((x: string) => UUID.test(x));
  if (!userId) return new Response("no account yet");

  const db = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!);
  const source = event.store === "APP_STORE" ? "apple" : event.store === "PLAY_STORE" ? "google" : String(event.store || "store").toLowerCase();
  const externalId = `${source}:${event.original_transaction_id || event.transaction_id}`;

  if (["INITIAL_PURCHASE", "NON_RENEWING_PURCHASE"].includes(event.type)) {
    const bought = Number(event.purchased_at_ms) || Date.now();
    const { error } = await db.from("purchases").upsert({
      user_id: userId,
      expires_at: new Date(bought + DAYS * 864e5).toISOString(),
      refunded: false, source, external_id: externalId,
    }, { onConflict: "external_id" });
    if (error) return new Response(error.message, { status: 500 });
  } else if (["CANCELLATION", "REFUND"].includes(event.type) || event.cancel_reason === "CUSTOMER_SUPPORT") {
    const { error } = await db.from("purchases").update({ refunded: true }).eq("external_id", externalId);
    if (error) return new Response(error.message, { status: 500 });
  } else if (event.type === "TRANSFER") {
    // purchase moved from an anonymous app id to the account: RevenueCat resends it, nothing to do here
  }
  return new Response("ok");
});
