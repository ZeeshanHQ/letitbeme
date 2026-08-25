import React from 'react';
import { HeroSection } from './HeroSection';
import { CoreFeaturesSection } from './CoreFeaturesSection';
import { ComparisonSection } from './ComparisonSection';
import { FeatureGrid } from './FeatureGrid';
import { RoiCalculator } from './RoiCalculator';
import { CtaSection } from './CtaSection';

interface LandingPageProps {
  onEnterStage: () => void;
  onEnterPresenter: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  onEnterStage,
  onEnterPresenter,
}) => {
  return (
    <div className="min-h-screen bg-white font-['Plus_Jakarta_Sans',sans-serif]">
      {/* Hero Section with Embedded Interactive Test-Drive */}
      <HeroSection
        onEnterStage={onEnterStage}
        onEnterPresenter={onEnterPresenter}
      />

      {/* Core Features Marketing Section with Gradient Cards */}
      <CoreFeaturesSection />

      {/* Core Architecture Feature Grid */}
      <FeatureGrid />

      {/* Comparison Matrix & Stage Visual */}
      <ComparisonSection />

      {/* Community Free Model & ROI Calculator */}
      <RoiCalculator onStartDemo={onEnterStage} />

      {/* Bottom Conversion CTA */}
      <CtaSection onEnterStage={onEnterStage} />

      {/* Minimal Footer with 3D Logo */}
      <footer className="border-t border-slate-100 bg-white py-16 text-slate-500 font-sans">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          
          <div className="grid grid-cols-2 md:grid-cols-5 gap-8 text-xs text-left">
            {/* Col 1: Brand */}
            <div className="col-span-2 space-y-4">
              <div className="flex items-center gap-2.5">
                <img
                  src="/logo3d.png"
                  alt="LetItBeMe 3D Logo"
                  className="h-8 w-8 rounded-xl object-cover shadow-sm"
                />
                <span className="text-base font-heading font-bold tracking-tight text-obsidian">
                  LetItBe<span className="text-solar-500 font-medium">Me</span>
                </span>
              </div>
              <p className="text-xs text-slate-500 max-w-sm font-light leading-relaxed">
                The next-generation interactive live video infrastructure. Embed checkouts, apps, and real-time AI speech translation without redirect churn.
              </p>
              <div className="flex items-center gap-2 text-[11px] font-mono text-emerald-600 pt-1">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                <span>WebRTC Global Mesh: All Systems Operational</span>
              </div>
            </div>

            {/* Col 2: Products */}
            <div className="space-y-3">
              <span className="text-xs font-semibold text-obsidian block font-heading">Product</span>
              <ul className="space-y-2 text-slate-500 font-light">
                <li className="hover:text-obsidian cursor-pointer transition-colors">In-Stream Sandbox</li>
                <li className="hover:text-obsidian cursor-pointer transition-colors">1-Click Checkout</li>
                <li className="hover:text-obsidian cursor-pointer transition-colors">AI Live Subtitles</li>
                <li className="hover:text-obsidian cursor-pointer transition-colors">Presenter Studio</li>
              </ul>
            </div>

            {/* Col 3: Attribution */}
            <div className="space-y-3">
              <span className="text-xs font-semibold text-obsidian block font-heading">Attribution</span>
              <ul className="space-y-2 text-slate-500 font-light">
                <li className="hover:text-obsidian cursor-pointer transition-colors">Smart Links</li>
                <li className="hover:text-obsidian cursor-pointer transition-colors">Ambassador Payouts</li>
                <li className="hover:text-obsidian cursor-pointer transition-colors">UTM Generator</li>
                <li className="hover:text-obsidian cursor-pointer transition-colors">Conversion Funnel</li>
              </ul>
            </div>

            {/* Col 4: Resources */}
            <div className="space-y-3">
              <span className="text-xs font-semibold text-obsidian block font-heading">Company</span>
              <ul className="space-y-2 text-slate-500 font-light">
                <li className="hover:text-obsidian cursor-pointer transition-colors">Documentation</li>
                <li className="hover:text-obsidian cursor-pointer transition-colors">Security & Privacy</li>
                <li className="hover:text-obsidian cursor-pointer transition-colors">Terms of Service</li>
                <li className="hover:text-obsidian cursor-pointer transition-colors">Contact Support</li>
              </ul>
            </div>
          </div>

          <div className="pt-8 border-t border-slate-100 flex flex-wrap items-center justify-between gap-4 text-[11px] text-slate-400 font-mono">
            <div>
              © {new Date().getFullYear()} LetItBeMe Inc. All rights reserved.
            </div>
            <div className="flex items-center gap-6">
              <span className="hover:text-slate-600 cursor-pointer">Privacy Notice</span>
              <span className="hover:text-slate-600 cursor-pointer">Cookie Preferences</span>
              <span className="hover:text-slate-600 cursor-pointer">English (United States)</span>
            </div>
          </div>

        </div>
      </footer>
    </div>
  );
};
