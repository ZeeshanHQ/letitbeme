import React from 'react';
import { ArrowRight, CheckCircle2, Lock } from 'lucide-react';
import { Button } from '../common/Button';

interface RoiCalculatorProps {
  onStartDemo?: () => void;
}

export const RoiCalculator: React.FC<RoiCalculatorProps> = ({ onStartDemo }) => {
  return (
    <section id="roi-section" className="py-20 sm:py-28 bg-white border-b border-slate-100 font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12 text-left">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-blue-50/80 border border-blue-200 text-xs font-semibold text-[#0084FF]">
            <span className="h-2 w-2 rounded-full bg-[#0084FF] animate-pulse" />
            <span>Transparent &amp; Flexible Pricing</span>
            <span className="text-slate-300">•</span>
            <span className="text-[#0084FF] font-mono">0% Platform Cuts</span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-heading font-bold text-[#0f172a] tracking-tight">
            Start Free. Upgrade for{' '}
            <span className="text-[#0084FF]">Only $19.99/month</span>.
          </h2>
          <p className="text-sm sm:text-base text-slate-500 font-normal max-w-2xl mx-auto leading-relaxed">
            No expensive enterprise lock-ins. Host interactive live streams for free, or unlock unlimited cloud recordings and priority WebRTC bandwidth for just $19.99/mo.
          </p>
        </div>

        {/* Dual Tier Showcase */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-5xl mx-auto items-stretch">
          
          {/* Tier 1: Free Community Plan ($0) */}
          <div className="bg-slate-50/70 p-8 rounded-3xl border border-slate-200/90 shadow-sm flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold text-slate-500 uppercase tracking-wider">
                  STARTER PLAN
                </span>
                <span className="text-[11px] font-mono font-semibold px-2.5 py-0.5 rounded-full bg-slate-200/70 text-slate-700">
                  Forever Free
                </span>
              </div>

              <div>
                <h3 className="text-3xl font-heading font-bold text-[#0f172a]">
                  $0 <span className="text-sm font-normal text-slate-400 font-mono">/ month</span>
                </h3>
                <p className="text-xs text-slate-500 font-light mt-1">
                  Everything you need to launch interactive live streams with zero platform fees.
                </p>
              </div>

              <ul className="space-y-2.5 pt-2 text-xs text-slate-700">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-[#0084FF] shrink-0" />
                  <span>Unlimited 1080p60 WebRTC Live Streams</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-[#0084FF] shrink-0" />
                  <span>0% Platform Sales Cuts (Keep 100% Revenue)</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-[#0084FF] shrink-0" />
                  <span>In-Stream Interactive App Sandbox Embeds</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-[#0084FF] shrink-0" />
                  <span>Real-Time AI Subtitles in 9+ Languages</span>
                </li>
              </ul>
            </div>

            <Button
              variant="secondary"
              size="md"
              onClick={onStartDemo}
              className="w-full rounded-2xl py-3 font-semibold text-xs border-slate-200"
            >
              Start Free Workspace
            </Button>
          </div>

          {/* Tier 2: Pro Creator All-Access (ONLY $19.99/mo) */}
          <div className="bg-white p-8 rounded-3xl border-2 border-[#0084FF] shadow-xl flex flex-col justify-between space-y-6 relative overflow-hidden">
            <div className="absolute top-0 right-0 bg-[#0084FF] text-white text-[10px] font-mono font-bold px-4 py-1 rounded-bl-2xl">
              POPULAR
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold text-[#0084FF] uppercase tracking-wider">
                  PRO CREATOR ALL-ACCESS
                </span>
              </div>

              <div>
                <h3 className="text-3xl font-heading font-bold text-[#0f172a]">
                  Only $19.99 <span className="text-sm font-normal text-slate-400 font-mono">/ month</span>
                </h3>
                <p className="text-xs text-slate-500 font-light mt-1">
                  Unlock priority WebRTC relay, HD cloud recordings &amp; custom verified branding.
                </p>
              </div>

              <ul className="space-y-2.5 pt-2 text-xs text-slate-700">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-[#0084FF] shrink-0" />
                  <span><strong>Everything in Free</strong> included</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-[#0084FF] shrink-0" />
                  <span>Full HD Cloud Replay Downloads &amp; Archiving</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-[#0084FF] shrink-0" />
                  <span>Custom Verified Channel Handle (<code className="text-[#0084FF] bg-blue-50 px-1 py-0.5 rounded font-mono">letitbe.me/@handle</code>)</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-[#0084FF] shrink-0" />
                  <span>Sub-50ms Ultra-Low Latency Global WebRTC Mesh</span>
                </li>
              </ul>
            </div>

            <button
              type="button"
              onClick={onStartDemo}
              className="w-full py-3.5 px-6 rounded-2xl bg-[#0084FF] hover:bg-[#0074E0] text-white font-semibold text-xs transition-all shadow-md shadow-blue-500/20 flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>Upgrade to Pro — Only $19.99/mo</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>

        </div>

      </div>
    </section>
  );
};
