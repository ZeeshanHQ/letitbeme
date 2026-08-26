import type { VercelRequest, VercelResponse } from '@vercel/node';
import Stripe from 'stripe';

const stripeSecretKey = process.env.STRIPE_SECRET_KEY || '';
const stripe = new Stripe(stripeSecretKey, {
  apiVersion: '2025-02-24.acacia' as any,
});

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    const {
      type = 'product', // 'subscription' | 'product'
      amount = 49.0,
      title = 'Live Masterclass & Stream Access',
      userId,
      userEmail,
      refSlug,
      hostSlug,
    } = req.body || {};

    const origin = req.headers.origin || 'https://letitbe.me';

    if (type === 'subscription') {
      // 1. Pro Platform Pass ($19.99/mo Recurring Subscription)
      const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        mode: 'subscription',
        line_items: [
          {
            price_data: {
              currency: 'usd',
              product_data: {
                name: 'LetItBeMe Pro Creator Pass',
                description: 'Unlimited 1080p60 WebRTC broadcasting, 0% platform fees, AI translation & HD cloud recordings.',
              },
              unit_amount: 1999, // $19.99 in cents
              recurring: {
                interval: 'month',
              },
            },
            quantity: 1,
          },
        ],
        customer_email: userEmail || undefined,
        metadata: {
          type: 'subscription',
          userId: userId || '',
          userEmail: userEmail || '',
        },
        success_url: `${origin}/?view=presenter&upgraded=true`,
        cancel_url: `${origin}/?view=presenter&canceled=true`,
      });

      return res.status(200).json({ url: session.url, sessionId: session.id });
    }

    // 2. Host Live Stream Product Offer (One-Time Payment)
    const unitAmount = Math.round(Number(amount) * 100) || 4900;

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'payment',
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: title || 'Live Stream Access & Resources',
              description: `Instant digital access provided by host @${hostSlug || 'live'}`,
            },
            unit_amount: unitAmount,
          },
          quantity: 1,
        },
      ],
      customer_email: userEmail || undefined,
      metadata: {
        type: 'product',
        userId: userId || '',
        userEmail: userEmail || '',
        refSlug: refSlug || '',
        hostSlug: hostSlug || '',
        amount: String(amount),
      },
      success_url: `${origin}/?room=${hostSlug || 'live'}&purchased=true`,
      cancel_url: `${origin}/?room=${hostSlug || 'live'}`,
    });

    return res.status(200).json({ url: session.url, sessionId: session.id });
  } catch (error: any) {
    console.error('Stripe checkout session error:', error);
    return res.status(500).json({ error: error?.message || 'Failed to create checkout session' });
  }
}
