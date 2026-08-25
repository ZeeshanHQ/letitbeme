import { loadStripe, Stripe } from '@stripe/stripe-js';

// Get Stripe publishable key from environment or use test publishable key
export const STRIPE_PUBLISHABLE_KEY =
  import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY ||
  'pk_test_51PTestLetItBeMeKey000000000000000000000000000000000000000000000000000000000000000000000000000000000';

let stripePromise: Promise<Stripe | null> | null = null;

export const getStripe = (): Promise<Stripe | null> => {
  if (!stripePromise) {
    stripePromise = loadStripe(STRIPE_PUBLISHABLE_KEY);
  }
  return stripePromise;
};

export const isStripeConfigured =
  Boolean(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY) &&
  !import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY.includes('pk_test_51PTest');
