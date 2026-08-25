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
} from 'lucide-react';
import { useStream } from '../../context/StreamContext';
import { useAuth } from '../../context/AuthContext';
import { Button } from '../common/Button';

export const ProductCheckoutWidget: React.FC = () => {
  const { triggerCheckoutCelebration } = useStream();
  const { user, upgradeToPro } = useAuth();
  
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [customStripeUrl, setCustomStripeUrl] = useState(
    localStorage.getItem('letitbeme_stripe_payment_link') || ''
  );
  const [showStripeConfig, setShowStripeConfig] = useState(false);

  const userEmail = user?.email || 'user@example.com';
  const isProActive = Boolean(user?.isPro);

  const handleUpgrade = async () => {
    setIsProcessing(true);
    setErrorMessage(null);

    // If creator configured their custom Stripe Payment Link
    if (customStripeUrl.trim().startsWith('http')) {
      const checkoutUrl = new URL(customStripeUrl);
      if (user?.email) {
        checkoutUrl.searchParams.set('prefilled_email', user.email);
      }
      window.open(checkoutUrl.toString(), '_blank');
      await upgradeToPro();
      triggerCheckoutCelebration();
      setIsProcessing(false);
      return;
    }

    // Process upgrade in Supabase database & state
    try {
      await upgradeToPro();
      triggerCheckoutCelebration();
    } catch (err: any) {
      setErrorMessage(err.message || 'Upgrade failed');
    }
    setIsProcessing(false);
  };

  const handleSaveStripeLink = (url: string) => {
    setCustomStripeUrl(url);
    localStorage.setItem('letitbeme_stripe_payment_link', url.trim());
    setShowStripeConfig(false);
  };

  if (isProActive) {
    return (
      <div className="h-full flex flex-col justify-between p-2 space-y-4 font-sans text-left animate-fade-in">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="flex items-center gap-1.5 text-xs font-mono font-bold text-amber-600 bg-amber-50 px-3 py-1 rounded-full border border-amber-200">
              <Crown className="h-3.5 w-3.5 fill-amber-500 text-amber-500" />
              <span>PRO PLAN ACTIVE</span>
            </span>
            <span className="text-[11px] font-mono text-emerald-600 font-semibold bg-emerald-50 px-2 py-0.5 rounded-full">
              ✓ Verified Account
            </span>
          </div>

          <div className="space-y-1">
            <h3 className="text-base font-heading font-bold text-obsidian tracking-tight">
              All Pro Capabilities Unlocked
            </h3>
            <p className="text-xs text-slate-500 font-light">
              Your meeting room is operating with prioritized WebRTC bitrate, AI translation, and recording access.
            </p>
          </div>

          <div className="space-y-2 pt-1">
            <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200/90 flex items-center gap-3">
              <div className="h-8 w-8 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600">
                <Video className="h-4 w-4" />
              </div>
              <div className="text-xs">
                <span className="font-semibold text-obsidian block">1080p60 WebRTC Mesh Relay</span>
                <span className="text-slate-500 text-[11px]">Sub-65ms latency across global nodes</span>
              </div>
            </div>

            <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200/90 flex items-center gap-3">
              <div className="h-8 w-8 rounded-xl bg-cyan-50 border border-cyan-100 flex items-center justify-center text-cyan-600">
                <Globe2 className="h-4 w-4" />
              </div>
              <div className="text-xs">
                <span className="font-semibold text-obsidian block">AI Multilingual Speech Engine</span>
                <span className="text-slate-500 text-[11px]">9+ real-time translated subtitle channels</span>
              </div>
            </div>

            <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200/90 flex items-center gap-3">
              <div className="h-8 w-8 rounded-xl bg-amber-50 border border-amber-100 flex items-center justify-center text-amber-600">
                <Download className="h-4 w-4" />
              </div>
              <div className="text-xs">
                <span className="font-semibold text-obsidian block">Cloud Replays & Downloads</span>
                <span className="text-slate-500 text-[11px]">Full meeting video export in 1-click</span>
              </div>
            </div>
          </div>
        </div>

        <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400 font-mono">
          <span>Billing Account: {userEmail}</span>
          <span className="text-emerald-600 font-semibold">$19.99/mo Active</span>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col justify-between space-y-4 font-sans text-left">
      {/* Header Info */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-mono text-slate-500 font-medium">
            OPTIONAL PRO UPGRADE
          </span>
          <span className="text-xs font-mono text-emerald-700 font-semibold bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
            0% Platform Fee
          </span>
        </div>

        <div>
          <h3 className="text-base sm:text-lg font-heading font-bold text-obsidian tracking-tight">
            Pro Creator All-Access Plan
          </h3>
          <p className="text-xs text-slate-500 font-light mt-0.5 leading-relaxed">
            Core video meetings are 100% free. Upgrade for unlimited HD recordings, custom vanity handles, and AI translation.
          </p>
        </div>

        {/* Pricing Pill */}
        <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200/90 flex items-center justify-between">
          <div>
            <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 block">
              Standard Subscription
            </span>
            <div className="flex items-baseline gap-1.5 pt-0.5">
              <span className="text-2xl font-heading font-bold text-obsidian tracking-tight">
                Only $19.99
              </span>
              <span className="text-xs font-mono text-slate-400">/ month</span>
            </div>
          </div>

          <span className="text-[10px] font-mono font-bold text-slate-600 bg-white border border-slate-200 px-2.5 py-1 rounded-xl shadow-sm">
            Cancel Anytime
          </span>
        </div>

        {/* Feature List */}
        <ul className="space-y-1.5 pt-0.5">
          {[
            'Unlimited 1080p60 WebRTC Broadcasting',
            'Full HD Cloud Replay Downloads',
            'Real-Time AI Subtitles in 9+ Languages',
            'Priority WebRTC Low-Latency Mesh Relay',
          ].map((feature, idx) => (
            <li key={idx} className="flex items-center gap-2 text-xs text-slate-700 font-normal">
              <CheckCircle2 className="h-3.5 w-3.5 text-solar-500 shrink-0" />
              <span>{feature}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Stripe Payment Gateway Action */}
      <div className="space-y-3 pt-2">
        <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between text-xs">
          <span className="text-slate-500">Billing to:</span>
          <strong className="text-obsidian font-mono">{userEmail}</strong>
        </div>

        {errorMessage && (
          <div className="p-2.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs">
            {errorMessage}
          </div>
        )}

        {/* Upgrade Button */}
        <button
          type="button"
          onClick={handleUpgrade}
          disabled={isProcessing}
          className="w-full py-3 px-4 rounded-xl bg-[#635BFF] hover:bg-[#534be8] text-white text-xs font-semibold flex items-center justify-center gap-2 shadow-sm transition-all cursor-pointer disabled:opacity-50"
        >
          <Lock className="h-3.5 w-3.5" />
          <span>{isProcessing ? 'Processing Upgrade...' : 'Pay $19.99 with Stripe'}</span>
          <ArrowRight className="h-3.5 w-3.5 ml-0.5" />
        </button>

        <div className="flex items-center justify-between text-[11px] text-slate-400 font-mono px-1">
          <span className="flex items-center gap-1">
            <ShieldCheck className="h-3 w-3 text-emerald-500" />
            <span>Official Stripe Checkout</span>
          </span>
          <button
            type="button"
            onClick={() => setShowStripeConfig(!showStripeConfig)}
            className="hover:text-slate-600 underline cursor-pointer"
          >
            {customStripeUrl ? 'Edit Stripe Link' : 'Custom Stripe Link'}
          </button>
        </div>

        {/* Optional Stripe Payment Link Config */}
        {showStripeConfig && (
          <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200 space-y-2 text-xs animate-fade-in">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-obsidian">Stripe Payment Link (buy.stripe.com)</span>
              <button
                type="button"
                onClick={() => setShowStripeConfig(false)}
                className="text-slate-400 hover:text-obsidian"
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
                className="flex-1 px-3 py-1.5 text-xs rounded-xl border border-slate-300 bg-white text-obsidian focus:outline-none focus:border-slate-800 font-mono"
              />
              <button
                type="button"
                onClick={() => handleSaveStripeLink(customStripeUrl)}
                className="px-3 py-1.5 bg-slate-900 text-white rounded-xl text-xs font-semibold cursor-pointer"
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
