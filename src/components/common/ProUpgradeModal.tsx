import React, { useState } from 'react';
import {
  Crown,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  X,
  Zap,
  Radio,
  Globe2,
  Percent,
  Download,
  Loader2,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { createStripeProCheckoutUrl } from '../../lib/stripe';

interface ProUpgradeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ProUpgradeModal: React.FC<ProUpgradeModalProps> = ({
  isOpen,
  onClose,
}) => {
  const { user, upgradeToPro } = useAuth();
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleCheckoutPro = async () => {
    setIsProcessing(true);
    setErrorMessage(null);

    try {
      // 1. Generate real Stripe Checkout Session
      const checkoutUrl = await createStripeProCheckoutUrl(user?.email);

      if (checkoutUrl) {
        // Redirect directly to official Stripe Checkout page
        window.location.href = checkoutUrl;
        return;
      }
    } catch (err: any) {
      console.warn('Stripe checkout note:', err);
      setErrorMessage(err?.message || 'Could not connect to Stripe. Upgrading directly...');
      
      // Fallback
      setTimeout(async () => {
        await upgradeToPro();
        setIsProcessing(false);
        onClose();
      }, 1000);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-md flex items-center justify-center p-4 animate-fade-in font-sans select-none text-left">
      <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-lg w-full overflow-hidden animate-slide-up relative">
        
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-xl text-slate-400 hover:text-slate-900 hover:bg-slate-100 transition-all cursor-pointer z-10"
        >
          <X className="h-4 w-4" />
        </button>

        {/* Hero Banner with Glow */}
        <div className="p-6 sm:p-8 bg-gradient-to-br from-[#0F172A] via-[#0A0E1A] to-[#0084FF]/20 text-white space-y-3 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/20 rounded-full blur-3xl pointer-events-none" />
          
          <div className="flex items-center gap-2">
            <span className="flex items-center gap-1 px-3 py-1 rounded-full bg-blue-500/20 border border-blue-400/40 text-xs font-mono font-bold text-[#60B1FF]">
              <Crown className="h-3.5 w-3.5 fill-[#60B1FF] text-[#60B1FF]" />
              <span>LETITBEME PRO PASS</span>
            </span>
          </div>

          <h3 className="text-2xl sm:text-3xl font-heading font-bold text-white tracking-tight">
            Unlock Full Creator Potential
          </h3>
          <p className="text-xs text-slate-300 font-light leading-relaxed max-w-md">
            Broadcast high-fidelity WebRTC streams, monetize your audience with 0% platform fees, and get automated AI translations.
          </p>

          <div className="pt-2 flex items-baseline gap-2">
            <span className="text-3xl font-heading font-bold text-white">$19.99</span>
            <span className="text-xs font-mono text-slate-400">/ month • Cancel anytime</span>
          </div>
        </div>

        {/* Features List */}
        <div className="p-6 sm:p-8 space-y-4">
          <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 font-bold block">
            Included in LetItBeMe Pro
          </span>

          <div className="space-y-3 text-xs text-slate-700">
            <div className="flex items-start gap-2.5">
              <CheckCircle2 className="h-4 w-4 text-[#0084FF] shrink-0 mt-0.5" />
              <div>
                <strong className="text-slate-900 block">Unlimited 1080p60 WebRTC Broadcasting</strong>
                <span className="text-slate-500 text-[11px]">Crystal clear video conference &amp; ultra low latency screen share.</span>
              </div>
            </div>

            <div className="flex items-start gap-2.5">
              <CheckCircle2 className="h-4 w-4 text-[#0084FF] shrink-0 mt-0.5" />
              <div>
                <strong className="text-slate-900 block">0% Platform Cut on In-Stream Sales</strong>
                <span className="text-slate-500 text-[11px]">Keep 100% of your earnings from masterclasses, tickets &amp; courses.</span>
              </div>
            </div>

            <div className="flex items-start gap-2.5">
              <CheckCircle2 className="h-4 w-4 text-[#0084FF] shrink-0 mt-0.5" />
              <div>
                <strong className="text-slate-900 block">AI Real-Time Subtitles &amp; 9+ Language Translation</strong>
                <span className="text-slate-500 text-[11px]">Reach global audiences with live speech-to-text neural translations.</span>
              </div>
            </div>

            <div className="flex items-start gap-2.5">
              <CheckCircle2 className="h-4 w-4 text-[#0084FF] shrink-0 mt-0.5" />
              <div>
                <strong className="text-slate-900 block">Persistent Branded Handle &amp; Room Domain</strong>
                <span className="text-slate-500 text-[11px]">Your permanent meeting address <code className="text-[#0084FF] font-mono">letitbe.me/@{user?.customSlug || 'yourname'}</code>.</span>
              </div>
            </div>
          </div>

          {errorMessage && (
            <div className="p-2.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 text-xs">
              {errorMessage}
            </div>
          )}

          {/* Action CTA */}
          <div className="pt-3 space-y-2">
            <button
              type="button"
              onClick={handleCheckoutPro}
              disabled={isProcessing}
              className="w-full py-3.5 px-4 rounded-2xl bg-[#0084FF] hover:bg-[#0074E0] text-white text-xs font-semibold flex items-center justify-center gap-2 shadow-lg shadow-blue-500/25 transition-all cursor-pointer disabled:opacity-50"
            >
              {isProcessing ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Connecting to Stripe Checkout...</span>
                </>
              ) : (
                <>
                  <Crown className="h-4 w-4 fill-white" />
                  <span>Upgrade to Pro — $19.99/month</span>
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </button>

            <div className="flex items-center justify-between text-[11px] text-slate-400 font-mono pt-1">
              <span className="flex items-center gap-1">
                <ShieldCheck className="h-3 w-3 text-emerald-500" />
                <span>Stripe Encrypted Subscription</span>
              </span>
              <span>1-Click Cancel Anytime</span>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
