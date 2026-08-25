// Supabase Edge Function: create-payment-intent
// Follows Deno & Supabase Edge runtime standards

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@14.21.0?target=deno";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const { amount, currency = "usd", email, streamId, hostSlug } = await req.json();

    const stripeSecretKey = Deno.env.get("STRIPE_SECRET_KEY");
    if (!stripeSecretKey) {
      // In development / demo mode, return simulated client secret
      return new Response(
        JSON.stringify({
          clientSecret: `pi_mock_${Date.now()}_secret_${Math.random().toString(36).substring(7)}`,
          mode: "simulated",
          message: "Configure STRIPE_SECRET_KEY in Supabase Edge Function secrets for live processing",
        }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 200,
        }
      );
    }

    const stripe = new Stripe(stripeSecretKey, {
      apiVersion: "2023-10-16",
      httpClient: Stripe.createFetchHttpClient(),
    });

    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100), // convert to cents
      currency: currency.toLowerCase(),
      receipt_email: email,
      metadata: {
        stream_id: streamId || "live-session",
        host_slug: hostSlug || "creator",
        platform: "LetItBeMe",
      },
      automatic_payment_methods: {
        enabled: true,
      },
    });

    return new Response(
      JSON.stringify({
        clientSecret: paymentIntent.client_secret,
        paymentIntentId: paymentIntent.id,
        mode: "live",
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      }
    );
  } catch (error: any) {
    return new Response(
      JSON.stringify({ error: error.message || "Failed to create payment intent" }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 400,
      }
    );
  }
});
