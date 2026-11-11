// The Wine Goat — Stripe webhook (Supabase Edge Function "stripe-webhook").
// Secrets to set in Supabase → Edge Functions → Secrets: STRIPE_SECRET_KEY, STRIPE_WEBHOOK_SECRET.
// SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are provided by Supabase automatically.
// In the function settings turn OFF "Verify JWT" (Stripe signs its own requests).
import Stripe from "npm:stripe@17.7.0";
import { createClient } from "npm:@supabase/supabase-js@2.49.1";

const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY")!);
const sb = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!);
const MONTHS = 12;

Deno.serve(async (req) => {
  if (req.method !== "POST") return new Response("ok");
  const body = await req.text();
  let ev: Stripe.Event;
  try {
    ev = await stripe.webhooks.constructEventAsync(body, req.headers.get("stripe-signature") ?? "", Deno.env.get("STRIPE_WEBHOOK_SECRET")!);
  } catch (_e) {
    return new Response("bad signature", { status: 400 });
  }

  if (ev.type === "checkout.session.completed" || ev.type === "checkout.session.async_payment_succeeded") {
    const s = ev.data.object as Stripe.Checkout.Session;
    if (s.payment_status !== "paid") return new Response("waiting for payment");
    const uid = s.client_reference_id && /^[0-9a-f-]{36}$/i.test(s.client_reference_id) ? s.client_reference_id : null;
    const email = (s.customer_details?.email || s.customer_email || "").toLowerCase() || null;
    // a second purchase extends the access from the current end date
    let from = new Date();
    if (uid || email) {
      const q = sb.from("purchases").select("expires_at").eq("refunded", false).order("expires_at", { ascending: false }).limit(1);
      const { data } = uid ? await q.eq("user_id", uid) : await q.eq("email", email);
      if (data && data[0] && new Date(data[0].expires_at) > from) from = new Date(data[0].expires_at);
    }
    const until = new Date(from); until.setMonth(until.getMonth() + MONTHS);
    const { error } = await sb.from("purchases").upsert({
      user_id: uid, email, product: "level3", amount: s.amount_total, currency: s.currency,
      stripe_session: s.id, payment_intent: typeof s.payment_intent === "string" ? s.payment_intent : null,
      expires_at: until.toISOString(),
    }, { onConflict: "stripe_session" });
    if (error) return new Response("db error: " + error.message, { status: 500 });
  }

  if (ev.type === "charge.refunded") {
    const c = ev.data.object as Stripe.Charge;
    if (c.refunded && typeof c.payment_intent === "string") await sb.from("purchases").update({ refunded: true }).eq("payment_intent", c.payment_intent);
  }
  return new Response("ok");
});
