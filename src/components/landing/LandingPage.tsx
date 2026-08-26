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
  onOpenAuth?: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  onEnterStage,
  onEnterPresenter,
  onOpenAuth,
}) => {
  return (
    <div className="min-h-screen bg-white font-['Plus_Jakarta_Sans',sans-serif]">
      {/* Hero Section */}
      <HeroSection
        onEnterStage={onEnterStage}
        onEnterPresenter={onEnterPresenter}
        onOpenAuth={onOpenAuth}
      />

      {/* Core Features Marketing Section with Gradient Cards */}
      <CoreFeaturesSection />

      {/* Core Architecture Feature Grid */}
      <FeatureGrid />

      {/* Comparison Matrix & Stage Visual */}
      <ComparisonSection />

      {/* Community Free Model & Pricing Tier Showcase */}
      <RoiCalculator
        onStartDemo={onEnterPresenter}
        onOpenAuth={onOpenAuth}
      />

      {/* Bottom Conversion CTA */}
      <CtaSection onEnterStage={onOpenAuth || onEnterPresenter} />

      {/* Minimal Footer with 3D Logo */}
      <footer className="border-t border-slate-100 bg-white py-16 text-slate-500 font-['Plus_Jakarta_Sans',sans-serif]">
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
                <span className="text-base font-heading font-bold tracking-tight text-[#0f172a]">
                  LetItBe<span className="text-[#0084FF] font-medium">Me</span>
                </span>
              </div>
              <p className="text-xs text-slate-500 max-w-sm font-light leading-relaxed">
                The next-generation interactive live video infrastructure. Embed checkouts, collaborative whiteboards, and real-time AI speech translation without redirect churn.
              </p>
              <div className="flex items-center gap-2 text-[11px] font-mono text-emerald-600 pt-1">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                <span>WebRTC Global Mesh: All Systems Operational</span>
              </div>
            </div>

            {/* Col 2: Products */}
            <div className="space-y-3">
              <span className="text-xs font-semibold text-[#0f172a] block font-heading">Product</span>
              <ul className="space-y-2 text-slate-500 font-light">
                <li className="hover:text-slate-900 cursor-pointer transition-colors">In-Stream Sandbox</li>
                <li className="hover:text-slate-900 cursor-pointer transition-colors">1-Click Checkout</li>
                <li className="hover:text-slate-900 cursor-pointer transition-colors">AI Live Subtitles</li>
                <li className="hover:text-slate-900 cursor-pointer transition-colors">Presenter Studio</li>
              </ul>
            </div>

            {/* Col 3: Attribution */}
            <div className="space-y-3">
              <span className="text-xs font-semibold text-[#0f172a] block font-heading">Attribution</span>
              <ul className="space-y-2 text-slate-500 font-light">
                <li className="hover:text-slate-900 cursor-pointer transition-colors">Smart Links</li>
                <li className="hover:text-slate-900 cursor-pointer transition-colors">Ambassador Payouts</li>
                <li className="hover:text-slate-900 cursor-pointer transition-colors">UTM Generator</li>
                <li className="hover:text-slate-900 cursor-pointer transition-colors">Conversion Funnel</li>
              </ul>
            </div>

            {/* Col 4: Resources */}
            <div className="space-y-3">
              <span className="text-xs font-semibold text-[#0f172a] block font-heading">Company</span>
              <ul className="space-y-2 text-slate-500 font-light">
                <li className="hover:text-slate-900 cursor-pointer transition-colors">Documentation</li>
                <li className="hover:text-slate-900 cursor-pointer transition-colors">Security &amp; Privacy</li>
                <li className="hover:text-slate-900 cursor-pointer transition-colors">Terms of Service</li>
                <li className="hover:text-slate-900 cursor-pointer transition-colors">Contact Support</li>
              </ul>
            </div>

            {/* Col 5: Security */}
            <div className="space-y-3">
              <span className="text-xs font-semibold text-[#0f172a] block font-heading">Security</span>
              <ul className="space-y-2 text-slate-500 font-light">
                <li className="hover:text-slate-900 cursor-pointer transition-colors">SOC-2 Type II</li>
                <li className="hover:text-slate-900 cursor-pointer transition-colors">Stripe Verified</li>
                <li className="hover:text-slate-900 cursor-pointer transition-colors">GDPR Compliant</li>
                <li className="hover:text-slate-900 cursor-pointer transition-colors">WebRTC Encrypted</li>
              </ul>
            </div>
          </div>

          <div className="border-t border-slate-100 pt-8 flex flex-wrap items-center justify-between gap-4 text-xs text-slate-400">
            <span>&copy; {new Date().getFullYear()} LetItBeMe Inc. All rights reserved.</span>
            <div className="flex items-center gap-6">
              <span className="hover:text-slate-600 cursor-pointer transition-colors">Privacy Policy</span>
              <span className="hover:text-slate-600 cursor-pointer transition-colors">Terms of Service</span>
              <span className="hover:text-slate-600 cursor-pointer transition-colors">Cookie Preferences</span>
            </div>
          </div>

        </div>
      </footer>
    </div>
  );
};
