import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  Zap,
  Globe,
  TrendingUp,
  ArrowRight,
  Radio,
  Share2,
  CheckCircle2,
  Mic,
  DollarSign,
  Users,
} from 'lucide-react';

export const FeatureGrid: React.FC = () => {
  const [activeLangIndex, setActiveLangIndex] = useState(0);

  const translationDemos = [
    { lang: 'English', flag: '🇺🇸', text: '"Welcome to the live interactive demo. You can test out our product directly on screen."' },
    { lang: 'Español', flag: '🇪🇸', text: '"Bienvenidos a la demo interactiva. Pueden probar nuestro producto directamente en pantalla."' },
    { lang: '日本語', flag: '🇯🇵', text: '"インタラクティブデモへようこそ。画面上で製品を直接テストできます。"' },
    { lang: 'Français', flag: '🇫🇷', text: '"Bienvenue dans la démo interactive. Vous pouvez tester le produit directamente à l’écran."' },
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveLangIndex((prev) => (prev + 1) % translationDemos.length);
    }, 2800);
    return () => clearInterval(timer);
  }, [translationDemos.length]);

  return (
    <section id="feature-grid-section" className="py-24 sm:py-32 bg-white border-y border-slate-100 font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        
        {/* Section Header */}
        <div className="max-w-3xl space-y-3 text-left">
          <h2 className="text-3xl sm:text-4xl lg:text-[44px] font-heading font-bold text-[#0f172a] tracking-tight leading-[1.18]">
            Interactive streaming built for conversion.{' '}
            <span className="font-light text-slate-400">
              Engage, test-drive, and monetize your live audience with zero tab-switching friction.
            </span>
          </h2>
        </div>

        {/* 4 Feature Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-10 text-left">
          
          {/* Card 1: In-Stream Sandboxing & Zero-Redirect Checkout */}
          <div className="bg-slate-50/70 rounded-[32px] border border-slate-200/90 p-6 sm:p-8 shadow-sm hover:shadow-md hover:border-blue-300 transition-all duration-300 flex flex-col justify-between group">
            <div className="space-y-5">
              <div className="space-y-1">
                <h3 className="text-xl sm:text-2xl font-heading font-bold text-[#0f172a] tracking-tight">
                  In-Stream Sandboxing & Zero-Redirect Checkout
                </h3>
                <p className="text-xs sm:text-sm text-slate-500 font-light">
                  Viewers test your app, schedule meetings, or complete 1-click purchases without pausing video.
                </p>
              </div>

              {/* Visual Preview */}
              <div className="relative rounded-2xl overflow-hidden aspect-[16/10] border border-slate-200/80 shadow-md">
                <img
                  src="/solar_instream_checkout.jpg"
                  alt="In-stream Checkout Visual"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-end p-4">
                  <div className="flex items-center justify-between w-full text-white text-xs font-mono">
                    <span className="flex items-center gap-1.5 bg-black/60 backdrop-blur-md px-3 py-1 rounded-full border border-white/20">
                      <Zap className="h-3 w-3 text-[#0084FF]" />
                      <span>Instant Stripe Pay</span>
                    </span>
                    <span className="bg-emerald-500/90 text-white font-bold px-3 py-1 rounded-full">
                      $19.99/mo Pro
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-6 border-t border-slate-200/60 mt-6 flex items-center justify-between text-xs">
              <span className="text-slate-500 font-medium">100% In-Stream Conversion</span>
              <div className="flex items-center gap-1 text-[#0084FF] font-semibold group-hover:translate-x-0.5 transition-transform">
                <span>Explore Sandboxing</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </div>
            </div>
          </div>

          {/* Card 2: Real-Time AI Speech Translation */}
          <div className="bg-slate-50/70 rounded-[32px] border border-slate-200/90 p-6 sm:p-8 shadow-sm hover:shadow-md hover:border-blue-300 transition-all duration-300 flex flex-col justify-between group">
            <div className="space-y-5">
              <div className="space-y-1">
                <h3 className="text-xl sm:text-2xl font-heading font-bold text-[#0f172a] tracking-tight">
                  Real-Time AI Multilingual Translation
                </h3>
                <p className="text-xs sm:text-sm text-slate-500 font-light">
                  Speak in English, broadcast in 9+ languages with live synchronized subtitles and voice translation.
                </p>
              </div>

              {/* Dynamic Live Subtitle Demo Box */}
              <div className="relative rounded-2xl overflow-hidden aspect-[16/10] border border-slate-200/80 shadow-md bg-slate-950 flex flex-col justify-between p-5 text-white font-sans">
                <img
                  src="/solar_ai_translation.jpg"
                  alt="AI Translation Visual"
                  className="absolute inset-0 w-full h-full object-cover opacity-35 group-hover:scale-105 transition-transform duration-500"
                />
                
                <div className="relative z-10 flex items-center justify-between">
                  <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-900/90 border border-white/20 text-[11px] font-mono text-cyan-300">
                    <Mic className="h-3 w-3 text-cyan-400" />
                    <span>Neural Audio Model</span>
                  </span>
                  <span className="text-xs font-mono font-bold bg-blue-600/90 px-2.5 py-0.5 rounded-full">
                    {translationDemos[activeLangIndex].flag} {translationDemos[activeLangIndex].lang}
                  </span>
                </div>

                <div className="relative z-10 bg-slate-900/90 backdrop-blur-md p-3.5 rounded-xl border border-white/15">
                  <p className="text-xs text-slate-300 italic transition-all duration-300">
                    {translationDemos[activeLangIndex].text}
                  </p>
                </div>
              </div>
            </div>

            <div className="pt-6 border-t border-slate-200/60 mt-6 flex items-center justify-between text-xs">
              <span className="text-slate-500 font-medium">9+ Simultaneous Languages</span>
              <div className="flex items-center gap-1 text-[#0084FF] font-semibold group-hover:translate-x-0.5 transition-transform">
                <span>View Languages</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </div>
            </div>
          </div>

          {/* Card 3: Multi-Tier Ambassador Growth Mesh */}
          <div className="bg-slate-50/70 rounded-[32px] border border-slate-200/90 p-6 sm:p-8 shadow-sm hover:shadow-md hover:border-blue-300 transition-all duration-300 flex flex-col justify-between group">
            <div className="space-y-5">
              <div className="space-y-1">
                <h3 className="text-xl sm:text-2xl font-heading font-bold text-[#0f172a] tracking-tight">
                  Multi-Tier Ambassador Growth Engine
                </h3>
                <p className="text-xs sm:text-sm text-slate-500 font-light">
                  Turn viewers into promoters with personalized UTM links, live click tracking, and direct commissions.
                </p>
              </div>

              <div className="relative rounded-2xl overflow-hidden aspect-[16/10] border border-slate-200/80 shadow-md">
                <img
                  src="/solar_ambassador_growth.jpg"
                  alt="Ambassador Growth Visual"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-end p-4">
                  <div className="flex items-center justify-between w-full text-white text-xs font-mono">
                    <span className="bg-blue-600/90 px-3 py-1 rounded-full border border-blue-400/40">
                      20% Lifetime RevShare
                    </span>
                    <span className="text-emerald-400 font-bold">
                      +$4,820 Earned
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-6 border-t border-slate-200/60 mt-6 flex items-center justify-between text-xs">
              <span className="text-slate-500 font-medium">Automatic Stripe Payouts</span>
              <div className="flex items-center gap-1 text-[#0084FF] font-semibold group-hover:translate-x-0.5 transition-transform">
                <span>View Dashboard</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </div>
            </div>
          </div>

          {/* Card 4: Presenter Command Studio */}
          <div className="bg-slate-50/70 rounded-[32px] border border-slate-200/90 p-6 sm:p-8 shadow-sm hover:shadow-md hover:border-blue-300 transition-all duration-300 flex flex-col justify-between group">
            <div className="space-y-5">
              <div className="space-y-1">
                <h3 className="text-xl sm:text-2xl font-heading font-bold text-[#0f172a] tracking-tight">
                  Executive Presenter Command Studio
                </h3>
                <p className="text-xs sm:text-sm text-slate-500 font-light">
                  Trigger live polls, switch dynamic layouts, and monitor audience telemetry from a single sleek cockpit.
                </p>
              </div>

              <div className="relative rounded-2xl overflow-hidden aspect-[16/10] border border-slate-200/80 shadow-md">
                <img
                  src="/solar_presenter_desk.jpg"
                  alt="Presenter Studio Visual"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-end p-4">
                  <div className="flex items-center justify-between w-full text-white text-xs font-mono">
                    <span className="flex items-center gap-1.5 bg-slate-900/90 px-3 py-1 rounded-full border border-white/20">
                      <Radio className="h-3 w-3 text-emerald-400" />
                      <span>WebRTC Low Latency</span>
                    </span>
                    <span className="text-cyan-300 font-bold">
                      &lt;65ms RTT
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-6 border-t border-slate-200/60 mt-6 flex items-center justify-between text-xs">
              <span className="text-slate-500 font-medium">Split • PiP • Focus Modes</span>
              <div className="flex items-center gap-1 text-[#0084FF] font-semibold group-hover:translate-x-0.5 transition-transform">
                <span>Enter Studio</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </div>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
