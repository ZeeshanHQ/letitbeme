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
      letitbemeNote: 'Tokenized in-stream with instant confetti confirmation',
      legacy: false,
      legacyNote: 'Redirects off-video, losing audio context',
    },
    {
      feature: 'Design System & Aesthetic',
      letitbeme: true,
      letitbemeNote: 'Solar Luxury Light Mode (Linear / Apple / Stripe)',
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
    <section className="py-24 bg-[#FAF9F6] space-y-16 font-sans text-left">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        
        {/* Horizontal Long Solar Keynote Banner with Smooth Rounded Edges */}
        <div className="relative rounded-3xl sm:rounded-[36px] overflow-hidden shadow-2xl bg-obsidian border border-solar-900/30 min-h-[340px] sm:min-h-[400px] flex items-center">
          {/* Vibrant high-res solar stage image with golden ribbons */}
          <img
            src="/solar_stage_keynote.jpg"
            alt="Keynote Live Stage"
            className="absolute inset-0 w-full h-full object-cover object-center opacity-85"
          />
          {/* Subtle horizontal gradient to ensure text readability */}
          <div className="absolute inset-0 bg-gradient-to-r from-obsidian/95 via-obsidian/60 to-transparent" />

          <div className="relative z-10 p-8 sm:p-12 lg:p-16 max-w-xl space-y-4">
            <h3 className="text-3xl sm:text-4xl lg:text-5xl font-heading font-semibold tracking-tight text-white leading-tight">
              Building the infrastructure for interactive video commerce
            </h3>
            <p className="text-sm sm:text-base text-slate-200 font-light leading-relaxed">
              Engineered to replace fragmented webinar software with a unified, sub-85ms interactive pipeline.
            </p>

            <div className="pt-3">
              <button
                type="button"
                onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                className="px-6 py-3 rounded-full bg-white hover:bg-solar-50 text-obsidian font-medium text-xs shadow-md transition-all flex items-center gap-2"
              >
                <span>Watch live demo</span>
                <ArrowRight className="h-3.5 w-3.5 text-solar-500" />
              </button>
            </div>
          </div>
        </div>

        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-2">
          <h2 className="text-3xl sm:text-4xl font-heading font-semibold text-obsidian tracking-tight">
            Why high-growth teams are replacing legacy tools with LetItBeMe
          </h2>
          <p className="text-sm sm:text-base text-slate-500 font-light">
            Compare the next-generation interactive stream architecture against legacy webinar software.
          </p>
        </div>

        {/* Comparison Table */}
        <div className="bg-white rounded-3xl border border-solar-100/90 overflow-hidden shadow-stripe">
          <div className="grid grid-cols-12 bg-solar-50/50 border-b border-solar-100 p-4 sm:p-6 text-left font-semibold text-xs sm:text-sm">
            <div className="col-span-6 sm:col-span-5 text-slate-500 uppercase tracking-wider font-mono text-[11px]">
              Capability
            </div>
            <div className="col-span-3 sm:col-span-4 text-solar-600 font-semibold">
              LetItBeMe 2.4
            </div>
            <div className="col-span-3 sm:col-span-3 text-slate-400">
              Legacy Tools (PXch, Zoom)
            </div>
          </div>

          <div className="divide-y divide-slate-100">
            {comparisonRows.map((row, idx) => (
              <div
                key={idx}
                className="grid grid-cols-12 p-4 sm:p-6 items-center hover:bg-solar-50/30 transition-colors text-xs sm:text-sm"
              >
                <div className="col-span-6 sm:col-span-5 pr-4 font-medium text-obsidian">
                  {row.feature}
                </div>

                <div className="col-span-3 sm:col-span-4 pr-3">
                  <div className="flex items-center gap-2 text-solar-600 font-medium">
                    <div className="h-5 w-5 rounded-full bg-solar-50 border border-solar-200 flex items-center justify-center shrink-0">
                      <Check className="h-3.5 w-3.5 text-solar-600" />
                    </div>
                    <span className="hidden sm:inline text-xs text-slate-700">{row.letitbemeNote}</span>
                  </div>
                </div>

                <div className="col-span-3 sm:col-span-3">
                  <div className="flex items-center gap-2 text-slate-400">
                    <div className="h-5 w-5 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center shrink-0">
                      <X className="h-3.5 w-3.5 text-slate-400" />
                    </div>
                    <span className="hidden sm:inline text-xs text-slate-400">{row.legacyNote}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
};
