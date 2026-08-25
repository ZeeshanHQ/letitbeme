import React from 'react';
import { Check, X, ArrowRight } from 'lucide-react';

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
    <section id="comparison-section" className="py-24 bg-white space-y-16 font-sans text-left border-b border-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        
        {/* Horizontal Keynote Banner with Smooth Rounded Edges */}
        <div className="relative rounded-3xl sm:rounded-[36px] overflow-hidden shadow-2xl bg-[#0f172a] border border-slate-800 min-h-[340px] sm:min-h-[400px] flex items-center">
          <img
            src="/solar_stage_keynote.jpg"
            alt="Keynote Live Stage"
            className="absolute inset-0 w-full h-full object-cover object-center opacity-70"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#0f172a]/95 via-[#0f172a]/70 to-transparent" />

          <div className="relative z-10 p-8 sm:p-12 lg:p-16 max-w-xl space-y-4">
            <h3 className="text-3xl sm:text-4xl lg:text-5xl font-heading font-bold tracking-tight text-white leading-tight">
              Building the infrastructure for interactive video
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 font-light leading-relaxed">
              Eliminate external link drop-off. LetItBeMe embeds live forms, sandboxes, and checkouts directly inside the broadcast.
            </p>
          </div>
        </div>

        {/* Comparison Matrix Table */}
        <div className="space-y-6">
          <div className="space-y-2">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#0084FF]">
              Architecture Benchmark
            </span>
            <h3 className="text-2xl sm:text-3xl font-heading font-bold text-[#0f172a] tracking-tight">
              Why leading software teams choose LetItBeMe
            </h3>
          </div>

          <div className="bg-slate-50/70 rounded-3xl border border-slate-200/90 overflow-hidden shadow-sm">
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
