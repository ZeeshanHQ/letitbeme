import type { VercelRequest, VercelResponse } from '@vercel/node';
import Stripe from 'stripe';
import { createClient } from '@supabase/supabase-js';

const stripeSecretKey = process.env.STRIPE_SECRET_KEY || '';
const stripe = new Stripe(stripeSecretKey, {
  apiVersion: '2025-02-24.acacia' as any,
});

const supabaseUrl = process.env.VITE_SUPABASE_URL || 'https://tvdacxmucggdvbwfjwba.supabase.co';
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InR2ZGFjeG11Y2dnZHZid2Zqd2JhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzE4NDk2ODQsImV4cCI6MjA4NzQyNTY4NH0.5yQ9U3i_F3k3xK261_b4C3E2r9n0tGvH_32aK';
const supabase = createClient(supabaseUrl, supabaseKey);

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    const event = req.body as Stripe.Event;

    if (event.type === 'checkout.session.completed') {
      const session = event.data.object as Stripe.Checkout.Session;
      const metadata = session.metadata || {};

      // 1. Handle Pro Platform Pass Subscription ($19.99/mo)
      if (metadata.type === 'subscription') {
        const userEmail = metadata.userEmail || session.customer_email;
        if (userEmail) {
          await supabase
            .from('letitbeme_users')
            .update({
              is_pro: true,
              tier: 'pro',
              pro_since: new Date().toISOString(),
              updated_at: new Date().toISOString(),
            })
            .eq('email', userEmail.toLowerCase().trim());
        }
      }

      // 2. Handle In-Stream Product Offer ($XX One-Time Sale)
      if (metadata.type === 'product') {
        const saleAmount = Number(metadata.amount || (session.amount_total ? session.amount_total / 100 : 49.0));
        const refSlug = metadata.refSlug;
        const customerEmail = session.customer_email || metadata.userEmail || 'guest@example.com';

        if (refSlug) {
          // Look up referral link in Supabase
          const { data: link } = await supabase
            .from('letitbeme_referral_links')
            .select('*')
            .or(`ref_slug.eq.${refSlug},code.eq.${refSlug}`)
            .maybeSingle();

          const commissionPercent = link?.commission_percent || link?.commission_rate || 15.0;
          const commissionAmount = Number(((saleAmount * commissionPercent) / 100).toFixed(2));

          // Log commission record
          await supabase.from('letitbeme_commissions').insert({
            id: `comm_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
            ref_slug: refSlug,
            stripe_session_id: session.id,
            customer_email: customerEmail,
            sale_amount: saleAmount,
            commission_amount: commissionAmount,
            status: 'approved',
          });

          // Increment aggregate statistics on referral link
          if (link) {
            const currentSales = link.total_sales || link.conversions || 0;
            const currentRevenue = Number(link.total_revenue || link.revenue || 0);
            const currentCommission = Number(link.total_commission || 0);

            await supabase
              .from('letitbeme_referral_links')
              .update({
                total_sales: currentSales + 1,
                conversions: currentSales + 1,
                total_revenue: Number((currentRevenue + saleAmount).toFixed(2)),
                revenue: Number((currentRevenue + saleAmount).toFixed(2)),
                total_commission: Number((currentCommission + commissionAmount).toFixed(2)),
              })
              .eq('id', link.id);
          }
        }
      }
    }

    return res.status(200).json({ received: true });
  } catch (err: any) {
    console.error('Webhook error:', err);
    return res.status(400).json({ error: err.message });
  }
}
