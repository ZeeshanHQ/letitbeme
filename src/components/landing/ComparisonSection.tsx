import React from 'react';
import { Check, X, ArrowRight, ShieldCheck, Zap, TrendingUp, Sparkles } from 'lucide-react';

export const ComparisonSection: React.FC = () => {
  const comparisonRows = [
    {
      feature: 'In-Stream 1-Click Stripe & Apple Pay Checkout',
      letitbeme: true,
      letitbemeNote: 'Embedded zero-redirect tokenized checkout (0% Drop-off)',
      legacy: false,
      legacyNote: 'External link opens in new tab (70% cart churn)',
    },
    {
      feature: 'Native Interactive Whiteboard & Sandboxes',
      letitbeme: true,
      letitbemeNote: 'Built-in real-time canvas & custom app embed',
      legacy: false,
      legacyNote: 'Requires downloading desktop software or external apps',
    },
    {
      feature: 'Real-Time Synchronized Agenda & Checklist',
      letitbeme: true,
      letitbemeNote: 'Zero-latency WebSocket synchronization across all attendees',
      legacy: false,
      legacyNote: 'Static text slides or verbal agenda without interactive state',
    },
    {
      feature: 'AI Live Speech Multilingual Translation',
      letitbeme: true,
      letitbemeNote: 'Real-time subtitles across 9+ global languages (EN, ES, FR, DE, JA...)',
      legacy: false,
      legacyNote: 'English-only or delayed post-recording captions',
    },
    {
      feature: 'Multi-Tier Ambassador Referral Attribution',
      letitbeme: true,
      letitbemeNote: 'Automated Stripe Connect Express splits & month-end payouts',
      legacy: false,
      legacyNote: 'Basic UTM tracking with frequent attribution drop & manual payouts',
    },
    {
      feature: 'Modern Design System & Ultra-Low Latency WebRTC',
      letitbeme: true,
      letitbemeNote: '1080p60 WebRTC with Liquid Glass Luxury UI',
      legacy: false,
      legacyNote: 'Clunky 2018-era corporate enterprise software (PXCH / Zoom)',
    },
  ];

  const competitors = [
    { name: 'PXCH Corporate (mypxch.com)', verdict: 'Legacy Enterprise Setup', weakness: 'Complex setup & external payment redirects' },
    { name: 'Zoom Webinars', verdict: 'Passive Screen Sharing', weakness: 'Zero in-stream monetization & attendee client required' },
    { name: 'Demio / Livestorm', verdict: 'Basic Marketing Funnels', weakness: 'High platform fees & no interactive native whiteboards' },
  ];

  return (
    <section id="comparison-section" className="py-20 sm:py-28 bg-white space-y-16 font-sans text-left border-b border-slate-100">
      <div className="max-w-[1600px] mx-auto px-4 sm:px-8 lg:px-12 space-y-16">
        
        {/* Full-Width Keynote Visual */}
        <div className="relative w-full rounded-[24px] sm:rounded-[32px] overflow-hidden bg-[#0A0E1A] border border-slate-200/80 min-h-[380px] sm:min-h-[460px] lg:min-h-[520px] flex items-center">
          <img
            src="/keynote_stage_luxury.jpg"
            alt="Keynote Live Stage"
            className="absolute inset-0 w-full h-full object-cover object-center opacity-90"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#0A0E1A]/90 via-[#0A0E1A]/50 to-transparent" />

          <div className="relative z-10 p-8 sm:p-14 lg:p-20 max-w-2xl space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 border border-blue-400/30 text-blue-300 text-xs font-mono">
              <Sparkles className="h-3.5 w-3.5" />
              <span>The Next-Gen Standard for Live Sales Meetings</span>
            </div>
            <h3 className="text-3xl sm:text-4xl lg:text-[46px] font-medium tracking-[-0.02em] text-white leading-[1.12] font-['Plus_Jakarta_Sans',sans-serif]">
              Building the infrastructure for interactive video commerce
            </h3>
            <p className="text-sm sm:text-base text-slate-300 font-light leading-relaxed max-w-lg">
              Eliminate external link drop-off. LetItBeMe embeds live forms, collaborative whiteboards, and tokenized Stripe checkouts directly inside the WebRTC broadcast.
            </p>
          </div>
        </div>

        {/* Alternative Competitor Benchmark Cards */}
        <div className="max-w-6xl mx-auto space-y-6">
          <div className="space-y-2">
            <h4 className="text-xs font-mono uppercase tracking-wider text-[#0084FF] font-bold">
              Alternative Benchmarks &amp; Modern Replacements
            </h4>
            <h3 className="text-2xl sm:text-3xl font-heading font-semibold text-[#0f172a] tracking-tight">
              Why high-converting teams switch to LetItBeMe
            </h3>
            <p className="text-xs sm:text-sm text-slate-500 max-w-2xl font-light">
              Designed as a modern replacement for legacy corporate meeting software (PXCH Corporate, Zoom, Demio, and Livestorm).
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {competitors.map((c, i) => (
              <div
                key={i}
                className="p-5 rounded-3xl bg-slate-50/80 border border-slate-200/90 space-y-2 hover:bg-white hover:shadow-sm transition-all"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-900">{c.name}</span>
                  <span className="text-[10px] font-mono text-rose-500 bg-rose-50 px-2 py-0.5 rounded-full border border-rose-200">
                    Legacy
                  </span>
                </div>
                <p className="text-xs text-slate-600 font-medium">{c.verdict}</p>
                <p className="text-[11px] text-slate-400 font-light leading-relaxed">
                  {c.weakness}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Comparison Matrix Table */}
        <div className="space-y-6 max-w-6xl mx-auto">
          <div className="bg-slate-50/70 rounded-3xl border border-slate-200/90 overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 bg-white/80">
                    <th className="py-4 px-6 font-semibold text-[#0f172a]">Core Capability</th>
                    <th className="py-4 px-6 font-bold text-[#0084FF] bg-blue-50/50">LetItBeMe</th>
                    <th className="py-4 px-6 font-semibold text-slate-400">Legacy Tools (PXCH, Zoom, Demio)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200/60 font-sans">
                  {comparisonRows.map((row, idx) => (
                    <tr key={idx} className="hover:bg-white/60 transition-colors">
                      <td className="py-4 px-6 font-medium text-[#0f172a]">
                        {row.feature}
                      </td>
                      <td className="py-4 px-6 bg-blue-50/20">
                        <div className="flex items-center gap-2 text-[#0084FF] font-semibold">
                          <Check className="h-4 w-4 shrink-0 stroke-[2.5]" />
                          <span>{row.letitbemeNote}</span>
                        </div>
                      </td>
                      <td className="py-4 px-6 text-slate-400">
                        <div className="flex items-center gap-2">
                          <X className="h-4 w-4 shrink-0 text-slate-300" />
                          <span>{row.legacyNote}</span>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};
