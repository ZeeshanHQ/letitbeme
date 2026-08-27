import React from 'react';
import { ArrowRight, ShieldCheck } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

interface LandingNavProps {
  onOpenAuth: () => void;
  onEnterApp: () => void;
}

export const LandingNav: React.FC<LandingNavProps> = ({ onOpenAuth, onEnterApp }) => {
  const { user } = useAuth();

  const navLinks = [
    { label: 'Product', href: '#product' },
    { label: 'Vision', href: '#vision' },
    { label: 'Trust & Security', href: '#security' },
    { label: 'For Teams', href: '#access' },
  ];

  return (
    <header className="sticky top-0 z-50 w-full bg-white/90 backdrop-blur-md border-b border-slate-200/80 transition-all">
      <div className="max-w-[1360px] mx-auto px-6 sm:px-10 h-20 flex items-center justify-between">
        {/* Brand Monogram & Title */}
        <a href="#" className="flex items-center gap-3 group cursor-pointer">
          <div className="h-9 w-9 rounded-xl bg-slate-900 text-white flex items-center justify-center font-medium text-sm tracking-tight shadow-sm group-hover:bg-slate-800 transition-colors">
            3M
          </div>
          <span className="text-base font-medium text-slate-900 tracking-tight">
            Triple Motive
          </span>
        </a>

        {/* Center Links */}
        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="text-[13px] font-normal text-slate-600 hover:text-slate-900 transition-colors"
            >
              {link.label}
            </a>
          ))}
        </nav>

        {/* Action Controls */}
        <div className="flex items-center gap-4">
          {user ? (
            <button
              type="button"
              onClick={onEnterApp}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-medium tracking-tight shadow-sm transition-all cursor-pointer"
            >
              <span>Enter Ecosystem</span>
              <ArrowRight className="h-3.5 w-3.5" strokeWidth={1.5} />
            </button>
          ) : (
            <>
              <button
                type="button"
                onClick={onOpenAuth}
                className="text-xs font-normal text-slate-600 hover:text-slate-900 transition-colors cursor-pointer px-2 py-1"
              >
                Sign In
              </button>

              <button
                type="button"
                onClick={onOpenAuth}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-medium tracking-tight shadow-sm transition-all cursor-pointer"
              >
                <span>Request Access</span>
                <ArrowRight className="h-3.5 w-3.5" strokeWidth={1.5} />
              </button>
            </>
          )}
        </div>
      </div>
    </header>
  );
};
