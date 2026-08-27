import React from 'react';
import { ArrowRight, ShieldCheck } from 'lucide-react';

interface AccessGateSectionProps {
  onOpenAuth: () => void;
}

export const AccessGateSection: React.FC<AccessGateSectionProps> = ({ onOpenAuth }) => {
  return (
    <section id="access" className="py-28 sm:py-36 bg-white select-none">
      <div className="max-w-[1360px] mx-auto px-6 sm:px-10">
        <div className="rounded-3xl bg-slate-50 border border-slate-200/80 p-8 sm:p-14 lg:p-20 text-center space-y-8 max-w-4xl mx-auto shadow-sm">
          
          <div className="space-y-4 max-w-2xl mx-auto">
            <h2 className="text-3xl sm:text-4xl lg:text-[44px] font-medium text-slate-950 tracking-[-0.03em] leading-tight">
              Request access to the private executive ecosystem.
            </h2>
            <p className="text-base font-light text-slate-600 leading-relaxed">
              Membership is verified for founders, CEOs, researchers, and enterprise leadership teams.
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
            <button
              type="button"
              onClick={onOpenAuth}
              className="flex items-center gap-2 px-7 py-3.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-medium tracking-tight shadow-md hover:shadow-lg transition-all cursor-pointer"
            >
              <span>Request Member Access</span>
              <ArrowRight className="h-3.5 w-3.5" strokeWidth={1.5} />
            </button>

            <button
              type="button"
              onClick={onOpenAuth}
              className="px-6 py-3.5 rounded-xl bg-white hover:bg-slate-100 border border-slate-200 text-slate-700 text-xs font-medium tracking-tight transition-all cursor-pointer shadow-sm"
            >
              Sign In to Existing Account
            </button>
          </div>

          <div className="pt-6 border-t border-slate-200/80 flex items-center justify-center gap-6 text-xs text-slate-500 font-light">
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="h-3.5 w-3.5 text-blue-600" strokeWidth={1.5} />
              <span>Verified Node Membership</span>
            </span>
            <span>•</span>
            <span>Zero Third-Party Tracking</span>
            <span>•</span>
            <span>Enterprise Sovereign Tenancy</span>
          </div>

        </div>
      </div>
    </section>
  );
};
