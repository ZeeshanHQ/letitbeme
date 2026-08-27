import React from 'react';
import {
  ArrowRight,
  ShieldCheck,
  Video,
  UserCheck,
  Building2,
  Mic,
  Lock,
  Sparkles,
} from 'lucide-react';

interface HeroSectionProps {
  onOpenAuth: () => void;
  onExplore: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ onOpenAuth, onExplore }) => {
  return (
    <section className="relative pt-20 pb-28 sm:pt-28 sm:pb-36 bg-white overflow-hidden select-none">
      <div className="max-w-[1360px] mx-auto px-6 sm:px-10">
        {/* Main Text Content */}
        <div className="max-w-3xl space-y-6">
          <h1 className="text-4xl sm:text-5xl lg:text-[56px] font-medium text-slate-950 tracking-[-0.03em] leading-[1.12]">
            The private intelligent ecosystem for leaders and institutional teams.
          </h1>

          <p className="text-base sm:text-lg font-light text-slate-600 leading-relaxed max-w-2xl">
            Triple Motive unites verified professional identities, sovereign relationship graphs, multi-modal knowledge synthesis, and encrypted meeting infrastructure into a single cohesive interface.
          </p>

          {/* Action CTAs */}
          <div className="flex flex-wrap items-center gap-4 pt-2">
            <button
              type="button"
              onClick={onOpenAuth}
              className="flex items-center gap-2 px-6 py-3.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-medium tracking-tight shadow-md hover:shadow-lg transition-all cursor-pointer"
            >
              <span>Request Access</span>
              <ArrowRight className="h-3.5 w-3.5" strokeWidth={1.5} />
            </button>

            <button
              type="button"
              onClick={onExplore}
              className="px-5 py-3.5 rounded-xl bg-slate-100 hover:bg-slate-200/80 text-slate-700 text-xs font-medium tracking-tight transition-all cursor-pointer"
            >
              Explore Platform
            </button>
          </div>
        </div>

        {/* Stripe-Level Product Composition (Composed of Real Triple Motive UI Elements) */}
        <div className="mt-16 sm:mt-20 pt-8 border-t border-slate-100">
          <div className="relative rounded-3xl bg-slate-50 border border-slate-200/80 p-4 sm:p-8 lg:p-10 shadow-sm overflow-hidden">
            {/* Subtle architectural background grid line */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#f1f5f9_1px,transparent_1px),linear-gradient(to_bottom,#f1f5f9_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none opacity-50" />

            <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              
              {/* Left: Verified Member Profile Card */}
              <div className="lg:col-span-4 rounded-2xl bg-white border border-slate-200/90 p-5 shadow-sm space-y-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <img
                      src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80"
                      alt="Alexander Vance"
                      className="h-12 w-12 rounded-xl object-cover border border-slate-200 shadow-sm"
                    />
                    <div>
                      <div className="flex items-center gap-1">
                        <span className="text-sm font-medium text-slate-900">Alexander Vance</span>
                        <ShieldCheck className="h-3.5 w-3.5 text-blue-600" strokeWidth={1.5} />
                      </div>
                      <span className="text-[11px] text-slate-500 font-mono">@alex.triplemotive.net</span>
                    </div>
                  </div>
                </div>

                <div>
                  <span className="text-xs font-medium text-slate-800 block">Founder & CEO</span>
                  <div className="flex items-center gap-1.5 text-xs text-slate-500 mt-0.5">
                    <Building2 className="h-3 w-3 text-slate-400" strokeWidth={1.5} />
                    <span>Horizon Quantum Systems</span>
                  </div>
                </div>

                <div className="flex flex-wrap gap-1.5 pt-1">
                  <span className="px-2 py-0.5 rounded-md bg-slate-100 text-[10px] text-slate-600 font-medium">
                    Quantum Systems
                  </span>
                  <span className="px-2 py-0.5 rounded-md bg-slate-100 text-[10px] text-slate-600 font-medium">
                    Applied AI
                  </span>
                  <span className="px-2 py-0.5 rounded-md bg-slate-100 text-[10px] text-slate-600 font-medium">
                    Venture
                  </span>
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
                  <span className="flex items-center gap-1 text-emerald-600">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                    <span>Verified Node</span>
                  </span>
                  <span className="font-mono text-slate-400">Tenancy: Sovereign</span>
                </div>
              </div>

              {/* Center: Permissioned Relationship Connection Node */}
              <div className="lg:col-span-4 rounded-2xl bg-white border border-slate-200/90 p-5 shadow-sm space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <div className="flex items-center gap-1.5 text-xs font-medium text-slate-900">
                    <UserCheck className="h-3.5 w-3.5 text-blue-600" strokeWidth={1.5} />
                    <span>Permissioned Introduction</span>
                  </div>
                  <span className="text-[10px] font-mono text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded">
                    Connected
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  <img
                    src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200&auto=format&fit=crop&q=80"
                    alt="Dr. Elena Rostova"
                    className="h-10 w-10 rounded-xl object-cover border border-slate-200"
                  />
                  <div className="min-w-0 flex-1">
                    <span className="text-xs font-medium text-slate-900 block truncate">Dr. Elena Rostova</span>
                    <span className="text-[11px] text-slate-500 block truncate">Chief AI Scientist @ Synthetix Bio</span>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-slate-50 text-[11px] text-slate-600 leading-relaxed italic">
                  "Alex, great to connect. Let's sync on your quantum infrastructure roadmap."
                </div>

                <div className="flex items-center justify-between text-[11px] pt-1 text-slate-500 font-mono">
                  <span>Canonical Pair Order</span>
                  <span className="text-slate-700 font-medium">Protected Graph</span>
                </div>
              </div>

              {/* Right: Encrypted Video Call Workspace Stage */}
              <div className="lg:col-span-4 rounded-2xl bg-slate-900 border border-slate-800 p-5 text-white shadow-md space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                  <div className="flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                    <span className="text-xs font-medium text-slate-200 font-mono">Room: motive-489201</span>
                  </div>
                  <span className="text-[10px] font-mono text-slate-400">1080p WebRTC</span>
                </div>

                <div className="aspect-video rounded-xl bg-slate-950 border border-slate-800 relative overflow-hidden flex items-center justify-center">
                  <img
                    src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=600&auto=format&fit=crop&q=80"
                    alt="Active Speaker Video"
                    className="w-full h-full object-cover opacity-80"
                  />
                  <div className="absolute bottom-2.5 left-2.5 px-2 py-0.5 rounded-md bg-black/70 backdrop-blur-sm text-[10px] text-white flex items-center gap-1 font-medium">
                    <span>Alexander Vance</span>
                    <span className="text-slate-400">(Host)</span>
                  </div>
                  <div className="absolute bottom-2.5 right-2.5 px-2 py-0.5 rounded-full bg-emerald-500/30 border border-emerald-400 text-emerald-300 text-[10px] flex items-center gap-1 font-mono">
                    <Mic className="h-2.5 w-2.5" strokeWidth={1.5} />
                    <span>Speaking</span>
                  </div>
                </div>

                <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1">
                  <span>Host Moderation: Active</span>
                  <span className="text-emerald-400 font-mono">Encrypted Mesh</span>
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
