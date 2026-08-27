import React from 'react';
import { Play } from 'lucide-react';

export const ManifestoSection: React.FC = () => {
  return (
    <section id="vision" className="py-28 sm:py-36 bg-white select-none">
      <div className="max-w-[1360px] mx-auto px-6 sm:px-10 space-y-16">
        
        {/* Editorial Heading */}
        <div className="max-w-3xl space-y-4">
          <h2 className="text-3xl sm:text-4xl font-medium text-slate-950 tracking-[-0.03em] leading-tight">
            Engineered for high-trust professional relationships.
          </h2>
          <p className="text-base font-light text-slate-600 leading-relaxed">
            The most valuable insights, partnerships, and executive opportunities do not occur in open public feeds or noisy broadcast networks. They happen in private, permissioned environments built on verified trust.
          </p>
        </div>

        {/* Cinematic Video Frame (Designed for Future Lisa Carter Founder / Vision Video) */}
        <div className="relative rounded-3xl bg-slate-950 border border-slate-800/90 overflow-hidden shadow-xl aspect-[16/9] max-h-[640px] flex items-center justify-center group cursor-pointer">
          {/* Subtle architectural gradient background */}
          <div className="absolute inset-0 bg-gradient-to-tr from-slate-950 via-slate-900 to-slate-950" />
          
          {/* Minimalist Play Trigger Placeholder */}
          <div className="relative z-10 flex flex-col items-center gap-4 text-center p-6">
            <div className="h-16 w-16 sm:h-20 sm:w-20 rounded-full bg-white/10 border border-white/20 backdrop-blur-sm flex items-center justify-center text-white group-hover:scale-105 group-hover:bg-white/20 transition-all shadow-2xl">
              <Play className="h-6 w-6 sm:h-8 sm:w-8 fill-white/90 translate-x-0.5" strokeWidth={1.5} />
            </div>
            
            <div className="space-y-1">
              <span className="text-sm font-medium text-white block tracking-tight">
                The Triple Motive Vision
              </span>
              <span className="text-xs text-slate-400 block font-light">
                Founder Overview & Architectural Direction
              </span>
            </div>
          </div>

          {/* Bottom Bar Indicator */}
          <div className="absolute bottom-6 left-6 right-6 flex items-center justify-between text-xs text-slate-400 font-mono pt-4 border-t border-slate-800/80">
            <span>Triple Motive Foundation</span>
            <span>Private Briefing</span>
          </div>
        </div>

      </div>
    </section>
  );
};
