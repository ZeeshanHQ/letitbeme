import React from 'react';
import { LandingNav } from './LandingNav';
import { HeroSection } from './HeroSection';
import { PillarsSection } from './PillarsSection';
import { ManifestoSection } from './ManifestoSection';
import { TrustSecuritySection } from './TrustSecuritySection';
import { AccessGateSection } from './AccessGateSection';
import { LandingFooter } from './LandingFooter';

interface LandingPageProps {
  onOpenAuth: () => void;
  onEnterApp: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onOpenAuth, onEnterApp }) => {
  const handleScrollToProduct = () => {
    const el = document.getElementById('product');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-white text-slate-950 font-sans selection:bg-slate-900 selection:text-white flex flex-col">
      {/* Institutional Navigation */}
      <LandingNav onOpenAuth={onOpenAuth} onEnterApp={onEnterApp} />

      {/* Main Content */}
      <main className="flex-1">
        <HeroSection onOpenAuth={onOpenAuth} onExplore={handleScrollToProduct} />
        <PillarsSection />
        <ManifestoSection />
        <TrustSecuritySection />
        <AccessGateSection onOpenAuth={onOpenAuth} />
      </main>

      {/* Institutional Footer */}
      <LandingFooter />
    </div>
  );
};
