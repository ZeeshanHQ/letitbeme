const STRIPE_SECRET = import.meta.env.VITE_STRIPE_SECRET_KEY || '';

export async function createStripeProCheckoutUrl(userEmail?: string): Promise<string> {
  const origin = window.location.origin;

  const params = new URLSearchParams();
  params.append('payment_method_types[]', 'card');
  params.append('mode', 'subscription');
  params.append('line_items[0][price_data][currency]', 'usd');
  params.append('line_items[0][price_data][product_data][name]', 'LetItBeMe Pro Creator Pass');
  params.append('line_items[0][price_data][product_data][description]', 'Unlimited 1080p60 WebRTC broadcasting, 0% platform fees, AI translation & HD cloud recordings.');
  params.append('line_items[0][price_data][unit_amount]', '1999');
  params.append('line_items[0][price_data][recurring][interval]', 'month');
  params.append('line_items[0][quantity]', '1');
  if (userEmail) {
    params.append('customer_email', userEmail);
  }
  params.append('success_url', `${origin}/?view=presenter&upgraded=true`);
  params.append('cancel_url', `${origin}/?view=presenter&canceled=true`);

  try {
    const res = await fetch('https://api.stripe.com/v1/checkout/sessions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${STRIPE_SECRET}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: params.toString(),
    });

    const data = await res.json();
    if (data?.url) {
      return data.url;
    }
    throw new Error(data?.error?.message || 'Failed to create Stripe session');
  } catch (err) {
    console.error('Stripe Pro checkout error:', err);
    throw err;
  }
}

export async function createStripeProductCheckoutUrl(
  amount: number,
  title: string,
  hostSlug: string,
  userEmail?: string,
  refSlug?: string
): Promise<string> {
  const origin = window.location.origin;
  const unitAmount = Math.round(Number(amount || 49.0) * 100);

  const params = new URLSearchParams();
  params.append('payment_method_types[]', 'card');
  params.append('mode', 'payment');
  params.append('line_items[0][price_data][currency]', 'usd');
  params.append('line_items[0][price_data][product_data][name]', title || 'Live Masterclass & Stream Access');
  params.append('line_items[0][price_data][product_data][description]', `Instant digital access provided by host @${hostSlug || 'live'}`);
  params.append('line_items[0][price_data][unit_amount]', unitAmount.toString());
  params.append('line_items[0][quantity]', '1');
  if (userEmail) {
    params.append('customer_email', userEmail);
  }
  if (refSlug) {
    params.append('metadata[refSlug]', refSlug);
  }
  params.append('metadata[hostSlug]', hostSlug || 'live');
  params.append('metadata[amount]', String(amount));
  params.append('success_url', `${origin}/?room=${hostSlug || 'live'}&purchased=true`);
  params.append('cancel_url', `${origin}/?room=${hostSlug || 'live'}`);

  try {
    const res = await fetch('https://api.stripe.com/v1/checkout/sessions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${STRIPE_SECRET}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: params.toString(),
    });

    const data = await res.json();
    if (data?.url) {
      return data.url;
    }
    throw new Error(data?.error?.message || 'Failed to create Stripe session');
  } catch (err) {
    console.error('Stripe product checkout error:', err);
    throw err;
  }
}
