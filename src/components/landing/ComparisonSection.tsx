import React from 'react';
import { Check, X } from 'lucide-react';

export const ComparisonSection: React.FC = () => {
  const comparisonRows = [
    {
      feature: 'In-Stream Interactive Sandbox (Forms, Apps, Stripe)',
      letitbeme: true,
      letitbemeNote: 'Embedded zero-redirect interactive layer',
      legacy: false,
      legacyNote: 'External link opens in new tab (70% churn)',
    },
    {
      feature: 'In-Stream 1-Click Stripe & Apple Pay Checkout',
      letitbeme: true,
      letitbemeNote: 'Tokenized in-stream with instant confirmation',
      legacy: false,
      legacyNote: 'Redirects off-video, losing audio context',
    },
    {
      feature: 'Design System & Aesthetic',
      letitbeme: true,
      letitbemeNote: 'Liquid Glass Luxury (Apple / Stripe / Linear)',
      legacy: false,
      legacyNote: 'Clunky 2018-era dark marketer software',
    },
    {
      feature: 'AI Live Speech Multilingual Translation',
      letitbeme: true,
      letitbemeNote: 'Real-time subtitles across 9+ global languages',
      legacy: false,
      legacyNote: 'English-only or static post-recording captions',
    },
    {
      feature: 'Multi-Tier Ambassador Referral Attribution',
      letitbeme: true,
      letitbemeNote: 'Instant cookie-free WebRTC attribution engine',
      legacy: false,
      legacyNote: 'Basic UTM tracking with frequent attribution drop',
    },
  ];

  return (
    <section id="comparison-section" className="py-20 sm:py-28 bg-white space-y-16 font-sans text-left border-b border-slate-100">
      <div className="max-w-[1600px] mx-auto px-4 sm:px-8 lg:px-12 space-y-16">
        
        {/* Full-Width Keynote Visual (Zero Shadow, Extended to Horizontal Edges, Thinner Refined Typography) */}
        <div className="relative w-full rounded-[24px] sm:rounded-[32px] overflow-hidden bg-[#0A0E1A] border border-slate-200/80 min-h-[380px] sm:min-h-[460px] lg:min-h-[520px] flex items-center">
          {/* High-End Regenerated Keynote Image */}
          <img
            src="/keynote_stage_luxury.jpg"
            alt="Keynote Live Stage"
            className="absolute inset-0 w-full h-full object-cover object-center opacity-90"
          />
          {/* Clean Gradient Overlay for Text Readability */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#0A0E1A]/90 via-[#0A0E1A]/50 to-transparent" />

          <div className="relative z-10 p-8 sm:p-14 lg:p-20 max-w-2xl space-y-4">
            <h3 className="text-3xl sm:text-4xl lg:text-[46px] font-medium tracking-[-0.02em] text-white leading-[1.12] font-['Plus_Jakarta_Sans',sans-serif]">
              Building the infrastructure for interactive video
            </h3>
            <p className="text-sm sm:text-base text-slate-300 font-light leading-relaxed max-w-lg">
              Eliminate external link drop-off. LetItBeMe embeds live forms, sandboxes, and checkouts directly inside the broadcast.
            </p>
          </div>
        </div>

        {/* Comparison Matrix Table */}
        <div className="space-y-6 max-w-6xl mx-auto">
          <div className="space-y-2">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#0084FF]">
              Architecture Benchmark
            </span>
            <h3 className="text-2xl sm:text-3xl font-heading font-medium text-[#0f172a] tracking-tight">
              Why leading software teams choose LetItBeMe
            </h3>
          </div>

          <div className="bg-slate-50/70 rounded-3xl border border-slate-200/90 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 bg-white/80">
                    <th className="py-4 px-6 font-semibold text-[#0f172a]">Core Capability</th>
                    <th className="py-4 px-6 font-bold text-[#0084FF] bg-blue-50/50">LetItBeMe</th>
                    <th className="py-4 px-6 font-semibold text-slate-400">Legacy Webinar Tools</th>
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
