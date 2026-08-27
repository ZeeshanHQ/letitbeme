import React from 'react';

export const LandingFooter: React.FC = () => {
  return (
    <footer className="w-full bg-slate-950 text-slate-400 py-16 border-t border-slate-900 select-none">
      <div className="max-w-[1360px] mx-auto px-6 sm:px-10 space-y-12">
        
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 pb-12 border-b border-slate-900">
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-xl bg-slate-800 text-white flex items-center justify-center font-medium text-xs tracking-tight">
              3M
            </div>
            <span className="text-sm font-medium text-white tracking-tight">
              Triple Motive
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-8 text-xs font-light text-slate-400">
            <a href="#product" className="hover:text-white transition-colors">Product</a>
            <a href="#vision" className="hover:text-white transition-colors">Vision</a>
            <a href="#security" className="hover:text-white transition-colors">Trust & Security</a>
            <a href="#access" className="hover:text-white transition-colors">For Teams</a>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs font-light text-slate-400">
          <div>
            © {new Date().getFullYear()} Triple Motive Technologies Inc. All rights reserved.
          </div>

          <div className="flex items-center gap-2 text-emerald-400 font-mono text-[11px]">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
            <span>Global Mesh Node Operational • Region 01</span>
          </div>
        </div>

      </div>
    </footer>
  );
};
