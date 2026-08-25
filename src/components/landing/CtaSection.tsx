import React from 'react';
import { ArrowRight } from 'lucide-react';
import { Button } from '../common/Button';

interface CtaSectionProps {
  onEnterStage: () => void;
}

export const CtaSection: React.FC<CtaSectionProps> = ({ onEnterStage }) => {
  return (
    <section className="py-24 sm:py-28 bg-[#FAF9F6] relative overflow-hidden text-center font-sans">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        
        <h2 className="text-3xl sm:text-4xl lg:text-[46px] font-heading font-semibold text-obsidian tracking-tight leading-tight">
          Ready to experience the next evolution of live video?
        </h2>

        <p className="text-base sm:text-lg text-slate-600 max-w-xl mx-auto font-light leading-relaxed">
          Launch your first interactive stream in under 2 minutes. No downloads, subscriptions, or credit card required.
        </p>

        <div className="pt-3">
          <Button
            variant="primary"
            size="md"
            onClick={onEnterStage}
            className="rounded-full px-8 shadow-solar-sm hover:shadow-solar-md font-medium"
            rightIcon={<ArrowRight className="h-4 w-4" />}
          >
            Enter Live Stream Demo
          </Button>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-6 pt-4 text-xs font-mono text-slate-400">
          <span>Instant Browser WebRTC</span>
          <span>•</span>
          <span>Zero-Redirect 1-Click Checkout</span>
          <span>•</span>
          <span>9+ AI Translation Languages</span>
        </div>

      </div>
    </section>
  );
};
