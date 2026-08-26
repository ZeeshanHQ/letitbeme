import React from 'react';
import {
  Sparkles,
  Zap,
  CreditCard,
  Mic,
  Globe,
  TrendingUp,
  Layers,
  CheckCircle2,
  Share2,
  MousePointer2,
} from 'lucide-react';

export const CoreFeaturesSection: React.FC = () => {
  return (
    <section
      id="features-section"
      className="bg-white py-20 sm:py-28 px-4 sm:px-6 lg:px-8 flex justify-center items-center w-full font-['Plus_Jakarta_Sans',sans-serif]"
    >
      <div className="w-full max-w-[1240px] text-center">
        {/* Section Header */}
        <div className="mb-14 sm:mb-16 space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50/80 border border-blue-200/70 shadow-xs mb-2">
            <Sparkles className="h-3.5 w-3.5 text-[#0084FF]" />
            <span className="text-[0.75rem] font-bold uppercase tracking-[1.2px] bg-gradient-to-r from-[#0084FF] via-[#6366F1] to-[#38BDF8] bg-clip-text text-transparent">
              Core Platform Capabilities
            </span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-[44px] font-bold text-[#0f172a] tracking-tight leading-[1.15]">
            Built for Speed, Engagement &amp; Direct Revenue
          </h2>

          <p className="text-base sm:text-lg text-slate-500 max-w-2xl mx-auto leading-relaxed font-normal">
            Everything you need to turn live stream viewers into active participants, qualified leads, and instant paying customers.
          </p>
        </div>

        {/* 3-Column Modern Feature Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          
          {/* Card 1 — In-Stream 1-Click Checkout */}
          <div
            className="group h-[380px] rounded-[24px] flex flex-col justify-between relative overflow-hidden text-left p-6 sm:p-7 bg-[#F8FAFC] border border-blue-100/90 shadow-[0_10px_30px_-12px_rgba(0,132,255,0.08)] hover:shadow-[0_20px_40px_-15px_rgba(0,132,255,0.18)] hover:border-blue-300 transition-all duration-300"
            style={{
              background: 'radial-gradient(circle at 50% 0%, rgba(0, 132, 255, 0.18) 0%, rgba(56, 189, 248, 0.08) 45%, #F8FAFC 75%, #F8FAFC 100%)',
            }}
          >
            {/* Top Interactive Representation */}
            <div className="relative w-full pt-2">
              {/* Floating Offer Card */}
              <div className="bg-white/95 backdrop-blur-md rounded-2xl p-4 shadow-[0_8px_25px_rgba(0,132,255,0.08)] border border-blue-100/80 space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-1.5 text-[11px] font-mono font-bold text-[#0084FF] bg-blue-50 px-2.5 py-1 rounded-full border border-blue-200/60">
                    <Zap className="h-3 w-3 fill-[#0084FF] text-[#0084FF]" />
                    <span>In-Stream Special</span>
                  </span>
                  <div className="flex items-baseline gap-1">
                    <span className="text-xs text-slate-400 line-through">$99</span>
                    <span className="text-sm font-bold text-slate-900">$49.00</span>
                  </div>
                </div>

                <p className="text-[12.5px] text-slate-600 leading-snug">
                  Unlock instant workshop access with{' '}
                  <span className="font-semibold text-[#0084FF]">zero redirect</span> via tokenized{' '}
                  <span className="font-semibold text-indigo-600">Stripe 1-Click</span>.
                </p>

                {/* Simulated Instant Pay Button */}
                <div className="relative pt-1">
                  <div className="w-full py-2 px-3 bg-gradient-to-r from-[#0084FF] to-[#0066FF] text-white rounded-xl text-xs font-semibold shadow-md shadow-blue-500/25 flex items-center justify-center gap-2 group-hover:scale-[1.02] transition-transform">
                    <CreditCard className="h-3.5 w-3.5" />
                    <span>Pay with 1-Click (Apple Pay)</span>
                  </div>

                  {/* Interactive Cursor Graphic */}
                  <div className="absolute -bottom-3 right-6 z-10 drop-shadow-[0_4px_8px_rgba(0,0,0,0.25)] group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform">
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="#0f172a" stroke="#ffffff" strokeWidth="1.5">
                      <path d="M4 2L20 11L11 13L9 22L4 2Z" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom Card Title & Subtitle */}
            <div className="pt-4 z-10 space-y-1">
              <h3 className="text-lg font-bold text-slate-900 tracking-tight flex items-center gap-2">
                <span>In-Stream 1-Click Checkout</span>
              </h3>
              <p className="text-xs text-slate-500 leading-relaxed font-light">
                Viewers purchase products, book consults, or unlock access directly inside the video stream with zero checkout drop-off.
              </p>
            </div>
          </div>

          {/* Card 2 — Real-Time AI Multilingual Audio */}
          <div
            className="group h-[380px] rounded-[24px] flex flex-col justify-between relative overflow-hidden text-left p-6 sm:p-7 bg-[#F8FAFC] border border-purple-100/90 shadow-[0_10px_30px_-12px_rgba(147,51,234,0.08)] hover:shadow-[0_20px_40px_-15px_rgba(147,51,234,0.18)] hover:border-purple-300 transition-all duration-300"
            style={{
              background: 'radial-gradient(circle at 50% 0%, rgba(147, 51, 234, 0.16) 0%, rgba(99, 102, 241, 0.08) 45%, #F8FAFC 75%, #F8FAFC 100%)',
            }}
          >
            {/* Top Interactive Representation */}
            <div className="relative w-full pt-2">
              <div className="bg-white/95 backdrop-blur-md rounded-2xl p-4 shadow-[0_8px_25px_rgba(147,51,234,0.08)] border border-purple-100/80 space-y-3">
                {/* Audio Neural Header */}
                <div className="flex items-center justify-between text-xs">
                  <span className="flex items-center gap-1.5 font-mono text-[11px] font-bold text-purple-700 bg-purple-50 px-2.5 py-1 rounded-full border border-purple-200/60">
                    <Mic className="h-3 w-3 text-purple-600 animate-pulse" />
                    <span>Neural Audio Model</span>
                  </span>
                  <span className="text-[11px] font-mono text-emerald-600 font-bold flex items-center gap-1">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    &lt;120ms Latency
                  </span>
                </div>

                {/* Multi-language synchronization chips */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between bg-slate-50/90 rounded-lg px-2.5 py-1.5 text-[11.5px] border border-slate-200/60">
                    <div className="flex items-center gap-2">
                      <span>🇺🇸</span>
                      <span className="font-semibold text-slate-800">English (Host)</span>
                    </div>
                    <span className="text-[10px] font-mono text-slate-400">Master Source</span>
                  </div>

                  <div className="flex items-center justify-between bg-purple-50/70 rounded-lg px-2.5 py-1.5 text-[11.5px] border border-purple-200/60">
                    <div className="flex items-center gap-2">
                      <span>🇪🇸</span>
                      <span className="font-semibold text-purple-900">Español Subtitles</span>
                    </div>
                    <span className="text-[10px] font-mono text-emerald-600 font-bold bg-white px-2 py-0.5 rounded-md border border-purple-200">
                      Live Synced
                    </span>
                  </div>

                  <div className="flex items-center justify-between bg-indigo-50/70 rounded-lg px-2.5 py-1.5 text-[11.5px] border border-indigo-200/60">
                    <div className="flex items-center gap-2">
                      <span>🇯🇵</span>
                      <span className="font-semibold text-indigo-900">日本語 Audio</span>
                    </div>
                    <span className="text-[10px] font-mono text-emerald-600 font-bold bg-white px-2 py-0.5 rounded-md border border-indigo-200">
                      Live Synced
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom Card Title & Subtitle */}
            <div className="pt-4 z-10 space-y-1">
              <h3 className="text-lg font-bold text-slate-900 tracking-tight flex items-center gap-2">
                <span>Real-Time AI Multilingual Audio</span>
              </h3>
              <p className="text-xs text-slate-500 leading-relaxed font-light">
                Speak in your native tongue while audience members listen and read translated subtitles in 9+ languages simultaneously.
              </p>
            </div>
          </div>

          {/* Card 3 — Interactive Stage & Ambassador Mesh */}
          <div
            className="group h-[380px] rounded-[24px] flex flex-col justify-between relative overflow-hidden text-left p-6 sm:p-7 bg-[#F8FAFC] border border-emerald-100/90 shadow-[0_10px_30px_-12px_rgba(16,185,129,0.08)] hover:shadow-[0_20px_40px_-15px_rgba(16,185,129,0.18)] hover:border-emerald-300 transition-all duration-300 md:col-span-2 lg:col-span-1"
            style={{
              background: 'radial-gradient(circle at 50% 0%, rgba(16, 185, 129, 0.16) 0%, rgba(6, 182, 212, 0.08) 45%, #F8FAFC 75%, #F8FAFC 100%)',
            }}
          >
            {/* Mesh Overlay for Visual Depth */}
            <div
              className="absolute inset-0 pointer-events-none opacity-40"
              style={{
                backgroundImage:
                  'linear-gradient(rgba(16, 185, 129, 0.12) 1px, transparent 1px), linear-gradient(90deg, rgba(16, 185, 129, 0.12) 1px, transparent 1px)',
                backgroundSize: '20px 20px',
                WebkitMaskImage: 'radial-gradient(circle at center top, black 0%, transparent 80%)',
                maskImage: 'radial-gradient(circle at center top, black 0%, transparent 80%)',
              }}
            />

            {/* Top Interactive Representation */}
            <div className="relative w-full pt-2">
              <div className="bg-white/95 backdrop-blur-md rounded-2xl p-4 shadow-[0_8px_25px_rgba(16,185,129,0.08)] border border-emerald-100/80 space-y-2.5">
                {/* Ambassador Growth Ribbon */}
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-1.5 text-[11px] font-mono font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200/60">
                    <TrendingUp className="h-3 w-3 text-emerald-600" />
                    <span>Ambassador Growth</span>
                  </span>
                  <span className="text-[11px] font-mono font-bold text-emerald-600">
                    +$4,820 Split
                  </span>
                </div>

                {/* Stage interactive toolkit icons */}
                <div className="grid grid-cols-3 gap-2 text-center text-[11px] font-semibold text-slate-700">
                  <div className="p-2 rounded-xl bg-slate-50 border border-slate-200/80 flex flex-col items-center gap-1">
                    <Layers className="h-4 w-4 text-[#0084FF]" />
                    <span className="text-[10px]">Whiteboard</span>
                  </div>
                  <div className="p-2 rounded-xl bg-slate-50 border border-slate-200/80 flex flex-col items-center gap-1">
                    <Sparkles className="h-4 w-4 text-purple-600" />
                    <span className="text-[10px]">Live Poll</span>
                  </div>
                  <div className="p-2 rounded-xl bg-slate-50 border border-slate-200/80 flex flex-col items-center gap-1">
                    <Share2 className="h-4 w-4 text-emerald-600" />
                    <span className="text-[10px]">Smart UTM</span>
                  </div>
                </div>

                {/* Search & Trigger Action Pill */}
                <div className="w-full py-1.5 px-3 rounded-xl bg-slate-100/80 border border-slate-200/90 text-[11px] text-slate-600 flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
                    <span>20% Automated Payout Active</span>
                  </span>
                  <span className="text-[10px] font-mono text-[#0084FF] font-semibold">Instant WebRTC</span>
                </div>
              </div>
            </div>

            {/* Bottom Card Title & Subtitle */}
            <div className="pt-4 z-10 space-y-1">
              <h3 className="text-lg font-bold text-slate-900 tracking-tight flex items-center gap-2">
                <span>Interactive Tools &amp; Ambassador Mesh</span>
              </h3>
              <p className="text-xs text-slate-500 leading-relaxed font-light">
                Trigger collaborative whiteboards, live polls, and viral affiliate links that automatically split commissions on Stripe.
              </p>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
