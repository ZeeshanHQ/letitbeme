import React from 'react';
import { ArrowRight, ArrowUpRight } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

interface HeroSectionProps {
  onEnterStage: () => void;
  onEnterPresenter: () => void;
  onOpenAuth?: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  onEnterStage,
  onEnterPresenter,
  onOpenAuth,
}) => {
  const { user } = useAuth();

  const handleGetStarted = () => {
    if (user) {
      onEnterPresenter();
    } else if (onOpenAuth) {
      onOpenAuth();
    } else {
      onEnterPresenter();
    }
  };

  return (
    <div className="relative w-full overflow-hidden bg-white selection:bg-[#319AFF]/20 font-['Plus_Jakarta_Sans',sans-serif] -webkit-font-smoothing-antialiased">
      {/* Main Container: 1600px Max-Width (100% Pure Clean White Background) */}
      <div className="relative z-10 mx-auto max-w-[1600px] px-6 sm:px-10 lg:px-16 pt-12 pb-20 sm:pt-16 sm:pb-28">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* Hero Left Column */}
          <div className="lg:col-span-7 flex flex-col items-start text-left space-y-6 max-w-2xl">

            {/* Hero Headline */}
            <h1
              className="text-4xl sm:text-6xl lg:text-[70px] font-bold text-[#0f172a] tracking-[-2px] leading-[1.08] font-['Plus_Jakarta_Sans',sans-serif]"
            >
              Turn live meetings into <br className="hidden sm:inline" />
              <span className="text-[#0084FF]">instant revenue</span>
            </h1>

            {/* Subheadline */}
            <p className="text-base sm:text-[18px] text-[#64748b] font-normal tracking-[-0.5px] leading-[1.6] max-w-xl font-['Plus_Jakarta_Sans',sans-serif]">
              The premier interactive video streaming platform with in-stream 1-click Stripe checkout, real-time collaborative whiteboards, synchronized checklists, and automated ambassador referral payouts.
            </p>

            {/* Actions & Primary CTA Button */}
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <button
                type="button"
                onClick={handleGetStarted}
                className="group relative inline-flex items-center justify-center gap-3 px-8 py-4 text-sm sm:text-base font-semibold text-white transition-all duration-200 ease-out hover:scale-[1.02] cursor-pointer shadow-[0_10px_25px_-5px_rgba(0,132,255,0.4)]"
                style={{
                  backgroundColor: 'rgba(0, 132, 255, 0.95)',
                  backdropFilter: 'blur(2px)',
                  WebkitBackdropFilter: 'blur(2px)',
                  borderRadius: '16px',
                  boxShadow: 'inset 0px 4px 4px 0px rgba(255, 255, 255, 0.35), 0 12px 24px -6px rgba(0, 132, 255, 0.35)',
                }}
              >
                <span>Start Free Workspace</span>
                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-white/20 text-white transition-transform duration-200 group-hover:translate-x-0.5">
                  <ArrowRight className="h-3.5 w-3.5" />
                </div>
              </button>

              <button
                type="button"
                onClick={handleGetStarted}
                className="inline-flex items-center justify-center gap-2 px-6 py-4 rounded-[16px] text-sm font-semibold text-slate-700 bg-slate-50 hover:bg-slate-100 border border-slate-200/90 transition-all cursor-pointer shadow-sm"
              >
                <span>Host Meeting</span>
                <ArrowUpRight className="h-4 w-4 text-slate-400" />
              </button>
            </div>

            {/* Trust Indicators */}
            <div className="flex items-center gap-4 pt-2 text-xs text-slate-400 font-medium">
              <span className="flex items-center gap-1 text-emerald-600">
                <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                <span>Zero Downloads Required</span>
              </span>
              <span>•</span>
              <span>100% WebRTC Ultra-Low Latency</span>
              <span>•</span>
              <span>Stripe Verified</span>
            </div>

          </div>

          {/* Hero Right Column: The Glassy Orb Video */}
          <div className="lg:col-span-5 relative flex items-center justify-center min-h-[380px] lg:min-h-[520px]">
            <div className="relative w-full max-w-[480px] lg:max-w-[540px] flex items-center justify-center">
              <video
                autoPlay
                loop
                muted
                playsInline
                className="w-full h-auto object-contain mix-blend-screen scale-110 lg:scale-125 transform pointer-events-none select-none"
                style={{
                  filter: 'hue-rotate(-55deg) saturate(250%) brightness(1.2) contrast(1.1)',
                }}
              >
                <source src="https://future.co/images/homepage/glassy-orb/orb-purple.webm" type="video/webm" />
              </video>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};
