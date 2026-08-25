import React from 'react';
import { ArrowRight } from 'lucide-react';

interface CtaSectionProps {
  onEnterStage: () => void;
}

export const CtaSection: React.FC<CtaSectionProps> = ({ onEnterStage }) => {
  return (
    <section className="py-24 sm:py-28 bg-slate-50 relative overflow-hidden text-center font-sans">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        
        <h2 className="text-3xl sm:text-4xl lg:text-[46px] font-heading font-bold text-[#0f172a] tracking-tight leading-tight">
          Ready to experience the next evolution of live video?
        </h2>

        <p className="text-base sm:text-lg text-slate-600 max-w-xl mx-auto font-normal leading-relaxed">
          Launch your first interactive stream in under 2 minutes. No downloads, credit card, or setup required.
        </p>

        <div className="pt-3 flex justify-center">
          <button
            type="button"
            onClick={onEnterStage}
            className="group relative inline-flex items-center justify-center gap-3 px-8 py-4 text-sm sm:text-base font-semibold text-white transition-all duration-200 ease-out hover:scale-[1.02] cursor-pointer shadow-[0_10px_25px_-5px_rgba(0,132,255,0.4)]"
            style={{
              backgroundColor: 'rgba(0, 132, 255, 0.9)',
              backdropFilter: 'blur(2px)',
              WebkitBackdropFilter: 'blur(2px)',
              borderRadius: '16px',
              boxShadow: 'inset 0px 4px 4px 0px rgba(255, 255, 255, 0.35), 0 12px 24px -6px rgba(0, 132, 255, 0.35)',
            }}
          >
            <span>Enter Live Meeting Room</span>
            <div className="flex h-6 w-6 items-center justify-center rounded-full bg-white/20 text-white transition-transform duration-200 group-hover:translate-x-0.5">
              <ArrowRight className="h-3.5 w-3.5" />
            </div>
          </button>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-6 pt-4 text-xs font-mono text-slate-400">
          <span>Instant Browser WebRTC</span>
          <span>•</span>
          <span>Zero-Redirect In-Stream Apps</span>
          <span>•</span>
          <span>100% Free Core Plan</span>
        </div>

      </div>
    </section>
  );
};
