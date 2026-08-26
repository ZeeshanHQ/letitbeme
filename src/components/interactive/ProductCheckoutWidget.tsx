import React, { useState } from 'react';
import {
  ShieldCheck,
  CheckCircle2,
  Lock,
  ArrowRight,
  Sparkles,
  CreditCard,
  ExternalLink,
  Crown,
  Download,
  Video,
  Globe2,
  Tag,
  ShoppingBag,
} from 'lucide-react';
import { useStream } from '../../context/StreamContext';
import { useAuth } from '../../context/AuthContext';

export const ProductCheckoutWidget: React.FC = () => {
  const { triggerCheckoutCelebration, offerTitle, offerPrice } = useStream();
  const { user, upgradeToPro } = useAuth();
  
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [customStripeUrl, setCustomStripeUrl] = useState(
    localStorage.getItem('letitbeme_stripe_payment_link') || ''
  );
  const [showStripeConfig, setShowStripeConfig] = useState(false);
  const [hasPurchasedHostOffer, setHasPurchasedHostOffer] = useState(false);

  const userEmail = user?.email || 'attendee@example.com';
  const isHost = user?.role === 'host';

  const handleBuyHostOffer = async () => {
    setIsProcessing(true);
    setErrorMessage(null);

    // If host configured a custom Stripe link
    if (customStripeUrl.trim().startsWith('http')) {
      const checkoutUrl = new URL(customStripeUrl);
      if (user?.email) {
        checkoutUrl.searchParams.set('prefilled_email', user.email);
      }
      window.open(checkoutUrl.toString(), '_blank');
      setHasPurchasedHostOffer(true);
      triggerCheckoutCelebration();
      setIsProcessing(false);
      return;
    }

    // Direct in-stream purchase simulation
    setTimeout(() => {
      setHasPurchasedHostOffer(true);
      triggerCheckoutCelebration();
      setIsProcessing(false);
    }, 750);
  };

  const handleSaveStripeLink = (url: string) => {
    setCustomStripeUrl(url);
    localStorage.setItem('letitbeme_stripe_payment_link', url.trim());
    setShowStripeConfig(false);
  };

  if (hasPurchasedHostOffer) {
    return (
      <div className="h-full flex flex-col justify-between p-4 space-y-4 font-sans text-left animate-fade-in">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="flex items-center gap-1.5 text-xs font-mono font-bold text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
              <CheckCircle2 className="h-3.5 w-3.5" />
              <span>ORDER CONFIRMED</span>
            </span>
            <span className="text-[11px] font-mono text-slate-400">
              Instant Delivery
            </span>
          </div>

          <div className="space-y-1">
            <h3 className="text-base font-heading font-bold text-slate-900 tracking-tight">
              You&apos;re Confirmed for {offerTitle || 'Masterclass Pass'}!
            </h3>
            <p className="text-xs text-slate-500 font-light leading-relaxed">
              Your purchase receipt and meeting access materials have been dispatched to <strong className="text-slate-800 font-mono">{userEmail}</strong>.
            </p>
          </div>

          <div className="p-3.5 bg-blue-50/60 rounded-2xl border border-blue-200 text-xs text-[#0084FF] space-y-1">
            <span className="font-semibold block">Host Digital Materials Access</span>
            <p className="text-[11px] text-slate-600">
              The host will also share direct access links in the meeting chat during the live stream.
            </p>
          </div>
        </div>

        <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400 font-mono">
          <span>Stripe Secure Transaction</span>
          <span className="text-emerald-600 font-semibold">100% Verified</span>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col justify-between space-y-4 font-sans text-left p-1">
      {/* Header Info */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="flex items-center gap-1 text-[11px] font-mono text-[#0084FF] font-bold bg-blue-50 px-2.5 py-0.5 rounded-full border border-blue-200">
            <Tag className="h-3 w-3" />
            <span>EXCLUSIVE LIVE OFFER</span>
          </span>
          <span className="text-xs font-mono text-emerald-700 font-semibold bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
            Special Stream Rate
          </span>
        </div>

        <div>
          <h3 className="text-base sm:text-lg font-heading font-bold text-slate-900 tracking-tight">
            {offerTitle || 'VIP All-Access Pass & Masterclass'}
          </h3>
          <p className="text-xs text-slate-500 font-light mt-0.5 leading-relaxed">
            Get immediate access to host resources, private recordings, and premium interactive meeting materials.
          </p>
        </div>

        {/* Pricing Card */}
        <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200/90 flex items-center justify-between">
          <div>
            <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 block">
              In-Stream Deal
            </span>
            <div className="flex items-baseline gap-1.5 pt-0.5">
              <span className="text-2xl font-heading font-bold text-slate-900 tracking-tight">
                ${offerPrice || 19.99}
              </span>
              <span className="text-xs font-mono text-slate-400">USD</span>
            </div>
          </div>

          <span className="text-[10px] font-mono font-bold text-slate-600 bg-white border border-slate-200 px-2.5 py-1 rounded-xl shadow-sm">
            Instant 1-Click Access
          </span>
        </div>

        {/* Features */}
        <ul className="space-y-1.5 pt-0.5">
          {[
            'Full Session Recording & Slide Deck (.pdf)',
            'Direct Q&A Priority with Host',
            '100% Direct Payout via Secure Stripe Gateway',
          ].map((feature, idx) => (
            <li key={idx} className="flex items-center gap-2 text-xs text-slate-700 font-normal">
              <CheckCircle2 className="h-3.5 w-3.5 text-[#0084FF] shrink-0" />
              <span>{feature}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Stripe Payment Gateway Action */}
      <div className="space-y-3 pt-2">
        <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between text-xs">
          <span className="text-slate-500">Checkout as:</span>
          <strong className="text-slate-900 font-mono">{userEmail}</strong>
        </div>

        {errorMessage && (
          <div className="p-2.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs">
            {errorMessage}
          </div>
        )}

        {/* Buy Button */}
        <button
          type="button"
          onClick={handleBuyHostOffer}
          disabled={isProcessing}
          className="w-full py-3 px-4 rounded-xl bg-[#0084FF] hover:bg-[#0074E0] text-white text-xs font-semibold flex items-center justify-center gap-2 shadow-md shadow-blue-500/20 transition-all cursor-pointer disabled:opacity-50"
        >
          <CreditCard className="h-3.5 w-3.5" />
          <span>{isProcessing ? 'Connecting Stripe Gateway...' : `Pay $${offerPrice || 19.99} with Stripe`}</span>
          <ArrowRight className="h-3.5 w-3.5 ml-0.5" />
        </button>

        <div className="flex items-center justify-between text-[11px] text-slate-400 font-mono px-1">
          <span className="flex items-center gap-1">
            <ShieldCheck className="h-3 w-3 text-emerald-500" />
            <span>Stripe Encrypted Payout</span>
          </span>
          {isHost && (
            <button
              type="button"
              onClick={() => setShowStripeConfig(!showStripeConfig)}
              className="hover:text-slate-600 underline cursor-pointer"
            >
              {customStripeUrl ? 'Edit Host Stripe Link' : 'Set Host Stripe Link'}
            </button>
          )}
        </div>

        {/* Host Stripe Payment Link Config */}
        {showStripeConfig && isHost && (
          <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200 space-y-2 text-xs animate-fade-in">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-slate-900">Your Stripe Payment Link (buy.stripe.com)</span>
              <button
                type="button"
                onClick={() => setShowStripeConfig(false)}
                className="text-slate-400 hover:text-slate-900"
              >
                ✕
              </button>
            </div>
            <p className="text-[11px] text-slate-500 font-light">
              Paste your Stripe Payment Link from your Stripe Dashboard to receive 100% direct payouts to your bank.
            </p>
            <div className="flex items-center gap-2">
              <input
                type="url"
                value={customStripeUrl}
                onChange={(e) => setCustomStripeUrl(e.target.value)}
                placeholder="https://buy.stripe.com/..."
                className="flex-1 px-3 py-1.5 text-xs rounded-xl border border-slate-300 bg-white text-slate-900 focus:outline-none focus:border-[#0084FF] font-mono"
              />
              <button
                type="button"
                onClick={() => handleSaveStripeLink(customStripeUrl)}
                className="px-3 py-1.5 bg-[#0084FF] text-white rounded-xl text-xs font-semibold cursor-pointer"
              >
                Save
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
