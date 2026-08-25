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
    <section id="feature-grid-section" className="py-24 sm:py-32 bg-white border-y border-solar-100/80 font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        
        {/* Section Header with Zoomed-Out Whitespace Rhythm */}
        <div className="max-w-3xl space-y-3 text-left">
          <h2 className="text-3xl sm:text-4xl lg:text-[44px] font-heading font-semibold text-obsidian tracking-tight leading-[1.18]">
            Interactive streaming built for conversion.{' '}
            <span className="font-light text-slate-400">
              Engage, test-drive, and monetize your live audience with zero tab-switching friction.
            </span>
          </h2>
        </div>

        {/* 4 Luxury Feature Cards with Bespoke Photorealistic Images & Interactive Overlays */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-10 text-left">
          
          {/* Card 1: In-Stream Sandboxing & Zero-Redirect Checkout */}
          <div className="bg-[#FAF9F6] rounded-[32px] border border-solar-100/90 p-6 sm:p-8 shadow-stripe hover:shadow-stripe-hover hover:border-solar-300 transition-all duration-300 flex flex-col justify-between group">
            <div className="space-y-5">
              <div className="space-y-1">
                <h3 className="text-xl sm:text-2xl font-heading font-semibold text-obsidian tracking-tight">
                  In-Stream Sandboxing & Zero-Redirect Checkout
                </h3>
                <p className="text-xs sm:text-sm text-slate-500 font-light">
                  Viewers test your app, schedule meetings, or complete 1-click purchases without pausing video.
                </p>
              </div>

              {/* Photorealistic Image Container with Floating Glass Card */}
              <div className="relative h-64 rounded-2xl overflow-hidden border border-solar-100 shadow-sm flex items-end p-4">
                <img
                  src="/solar_instream_checkout.jpg"
                  alt="In-stream 1-Click Checkout"
                  className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-obsidian/85 via-obsidian/20 to-transparent pointer-events-none" />

                {/* Floating Glass Pill */}
                <div className="relative z-10 w-full bg-white/95 backdrop-blur-md rounded-2xl p-3.5 shadow-xl border border-white/80 space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <span className="h-2 w-2 rounded-full bg-solar-500 animate-pulse" />
                      <span className="text-xs font-semibold text-obsidian">Founder VIP License</span>
                    </div>
                    <span className="text-xs font-mono font-bold text-solar-600">$199.00</span>
                  </div>
                  <div className="h-7 rounded-xl bg-gradient-to-r from-solar-500 to-solar-600 text-white font-medium text-xs flex items-center justify-center shadow-solar-sm">
                     Pay • Instant 1-Click Access
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-5 mt-5 border-t border-solar-100/80 flex items-center text-xs font-semibold text-solar-600 group-hover:text-solar-700">
              <span>Experience In-Stream Checkout</span>
              <ArrowRight className="h-3.5 w-3.5 ml-1.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* Card 2: AI Live Speech Translation */}
          <div className="bg-[#FAF9F6] rounded-[32px] border border-solar-100/90 p-6 sm:p-8 shadow-stripe hover:shadow-stripe-hover hover:border-solar-300 transition-all duration-300 flex flex-col justify-between group">
            <div className="space-y-5">
              <div className="space-y-1">
                <h3 className="text-xl sm:text-2xl font-heading font-semibold text-obsidian tracking-tight">
                  Real-Time AI Speech Translation
                </h3>
                <p className="text-xs sm:text-sm text-slate-500 font-light">
                  Broadcast to global audiences with synchronized subtitles transcribed in under 120ms.
                </p>
              </div>

              {/* Photorealistic AI Studio Image with Dynamic Captions */}
              <div className="relative h-64 rounded-2xl overflow-hidden border border-solar-100 shadow-sm flex items-end p-4">
                <img
                  src="/solar_ai_translation.jpg"
                  alt="Real-Time AI Live Speech Translation"
                  className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-obsidian/90 via-obsidian/30 to-transparent pointer-events-none" />

                {/* Animated Subtitle Box */}
                <div className="relative z-10 w-full bg-obsidian/85 backdrop-blur-md rounded-2xl p-3.5 shadow-xl border border-white/20 space-y-1.5 text-white">
                  <div className="flex items-center justify-between text-[10px] font-mono text-solar-300">
                    <span className="flex items-center gap-1 font-semibold">
                      <span>{translationDemos[activeLangIndex].flag}</span>
                      <span>{translationDemos[activeLangIndex].lang} (Live Auto-Sync)</span>
                    </span>
                    <span>&lt;95ms</span>
                  </div>
                  <p className="text-xs font-medium text-white line-clamp-2">
                    {translationDemos[activeLangIndex].text}
                  </p>
                </div>
              </div>
            </div>

            <div className="pt-5 mt-5 border-t border-solar-100/80 flex items-center text-xs font-semibold text-solar-600 group-hover:text-solar-700">
              <span>Explore Translation Engine</span>
              <ArrowRight className="h-3.5 w-3.5 ml-1.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* Card 3: Smart Referral Attribution & Payouts */}
          <div className="bg-[#FAF9F6] rounded-[32px] border border-solar-100/90 p-6 sm:p-8 shadow-stripe hover:shadow-stripe-hover hover:border-solar-300 transition-all duration-300 flex flex-col justify-between group">
            <div className="space-y-5">
              <div className="space-y-1">
                <h3 className="text-xl sm:text-2xl font-heading font-semibold text-obsidian tracking-tight">
                  Multi-Tier Ambassador Attribution
                </h3>
                <p className="text-xs sm:text-sm text-slate-500 font-light">
                  Track affiliate links with cookie-free WebRTC attribution and automated commission calculation.
                </p>
              </div>

              {/* Photorealistic Creator Desk Image with Live Ticker */}
              <div className="relative h-64 rounded-2xl overflow-hidden border border-solar-100 shadow-sm flex items-end p-4">
                <img
                  src="/solar_ambassador_growth.jpg"
                  alt="Ambassador Growth Analytics"
                  className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-obsidian/85 via-obsidian/20 to-transparent pointer-events-none" />

                {/* Live Ticker Card */}
                <div className="relative z-10 w-full bg-white/95 backdrop-blur-md rounded-2xl p-3.5 shadow-xl border border-white/80 space-y-2">
                  <div className="flex items-center justify-between text-xs font-medium">
                    <div className="flex items-center gap-2">
                      <div className="h-6 w-6 rounded-full bg-solar-500 text-white flex items-center justify-center text-[10px] font-bold">SL</div>
                      <span className="font-semibold text-obsidian">Sophia Loren</span>
                    </div>
                    <span className="font-mono text-solar-600 font-bold">+$6,686.40</span>
                  </div>
                  <div className="flex justify-between text-[11px] font-mono text-slate-400 pt-1 border-t border-slate-100">
                    <span>Gross Attributed GMV:</span>
                    <span className="font-bold text-obsidian">$173,528.00</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-5 mt-5 border-t border-solar-100/80 flex items-center text-xs font-semibold text-solar-600 group-hover:text-solar-700">
              <span>View Attribution Engine</span>
              <ArrowRight className="h-3.5 w-3.5 ml-1.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* Card 4: Presenter Command Studio & Glass Controls */}
          <div className="bg-[#FAF9F6] rounded-[32px] border border-solar-100/90 p-6 sm:p-8 shadow-stripe hover:shadow-stripe-hover hover:border-solar-300 transition-all duration-300 flex flex-col justify-between group">
            <div className="space-y-5">
              <div className="space-y-1">
                <h3 className="text-xl sm:text-2xl font-heading font-semibold text-obsidian tracking-tight">
                  Presenter Command Studio & Glass Controls
                </h3>
                <p className="text-xs sm:text-sm text-slate-500 font-light">
                  Push polls, live checkout cards, and language switches to all viewer screens in 1-click.
                </p>
              </div>

              {/* Photorealistic Studio Desk Image with Dispatcher Pill */}
              <div className="relative h-64 rounded-2xl overflow-hidden border border-solar-100 shadow-sm flex items-end p-4">
                <img
                  src="/solar_presenter_desk.jpg"
                  alt="Presenter Command Studio Desk"
                  className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-obsidian/85 via-obsidian/20 to-transparent pointer-events-none" />

                {/* Floating Glass Control Pill */}
                <div className="relative z-10 w-full bg-white/95 backdrop-blur-md rounded-2xl p-3.5 shadow-xl border border-white/80 flex items-center justify-between gap-2">
                  <div className="flex items-center gap-1.5 text-xs text-slate-600 font-medium">
                    <span>🎙️ Mic ON</span>
                    <span>•</span>
                    <span>📹 4K CAM</span>
                  </div>
                  <div className="px-3 py-1 rounded-xl bg-gradient-to-r from-solar-500 to-solar-600 text-white text-[11px] font-semibold shadow-solar-sm">
                    Push Widget (1-Click)
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-5 mt-5 border-t border-solar-100/80 flex items-center text-xs font-semibold text-solar-600 group-hover:text-solar-700">
              <span>Explore Presenter Studio</span>
              <ArrowRight className="h-3.5 w-3.5 ml-1.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
