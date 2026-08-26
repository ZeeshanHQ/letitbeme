import React, { useState } from 'react';
import {
  Settings,
  LogOut,
  ArrowRight,
  Crown,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { SettingsModal } from './SettingsModal';

export type AppView = 'landing' | 'stage' | 'presenter' | 'referral';

interface NavbarProps {
  currentView: AppView;
  setCurrentView: (view: AppView) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ currentView, setCurrentView }) => {
  const { user, signOut } = useAuth();
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  const handleViewChange = (view: AppView) => {
    setCurrentView(view);
    const url = new URL(window.location.href);
    if (view === 'landing') {
      url.searchParams.delete('view');
    } else {
      url.searchParams.set('view', view);
    }
    window.history.pushState({}, '', url.toString());
  };

  const scrollToSection = (sectionId: string) => {
    if (currentView !== 'landing') {
      handleViewChange('landing');
      setTimeout(() => {
        const el = document.getElementById(sectionId);
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }, 100);
      return;
    }
    const el = document.getElementById(sectionId);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <>
      <header className="sticky top-4 z-50 flex items-center justify-center w-full px-4 font-sans select-none">
        <div
          className="w-full max-w-[1380px] h-[58px] px-4 sm:px-6 flex items-center justify-between transition-all duration-300"
          style={{
            backgroundColor: 'rgba(255, 255, 255, 0.78)',
            backdropFilter: 'blur(40px)',
            WebkitBackdropFilter: 'blur(40px)',
            borderRadius: '20px',
            border: '1px solid rgba(0, 0, 0, 0.08)',
            boxShadow: '0 10px 30px -10px rgba(0, 0, 0, 0.05), inset 0px 1px 2px 0px rgba(255, 255, 255, 0.9)',
          }}
        >
          {/* Logo Brand */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => handleViewChange('landing')}
              className="flex items-center gap-2.5 group focus:outline-none cursor-pointer"
            >
              <img
                src="/logo3d.png"
                alt="LetItBeMe 3D Logo"
                className="h-8 w-8 rounded-xl object-cover shadow-sm group-hover:scale-105 transition-all"
              />
              <span className="text-lg font-bold tracking-tight text-[#0f172a] font-['Fustat',sans-serif]">
                LetItBe<span className="text-[#0084FF]">Me</span>
              </span>
            </button>
          </div>

          {/* Center Navigation Links (Only on Landing Page) */}
          {currentView === 'landing' && (
            <nav className="hidden md:flex items-center gap-7 text-xs font-medium text-[#475569] font-['Inter',sans-serif]">
              <button
                type="button"
                onClick={() => handleViewChange('landing')}
                className="hover:text-[#0f172a] transition-colors cursor-pointer"
              >
                Home
              </button>
              <button
                type="button"
                onClick={() => scrollToSection('feature-grid-section')}
                className="hover:text-[#0f172a] transition-colors cursor-pointer"
              >
                Features
              </button>
              <button
                type="button"
                onClick={() => scrollToSection('comparison-section')}
                className="hover:text-[#0f172a] transition-colors cursor-pointer"
              >
                Company
              </button>
              <button
                type="button"
                onClick={() => scrollToSection('roi-section')}
                className="hover:text-[#0f172a] transition-colors cursor-pointer"
              >
                Pricing
              </button>
            </nav>
          )}

          {/* Right Actions */}
          <div className="flex items-center gap-2.5">
            {user ? (
              currentView === 'landing' ? (
                /* On Landing page: Show clean "Go to Dashboard" button + Profile */
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => handleViewChange('presenter')}
                    className="group inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-[#0084FF] hover:bg-[#0074E0] rounded-xl transition-all shadow-sm cursor-pointer"
                  >
                    <span>Open Meeting Room</span>
                    <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-0.5 transition-transform" />
                  </button>

                  <img
                    src={user.avatarUrl}
                    alt={user.fullName}
                    referrerPolicy="no-referrer"
                    className="h-8 w-8 rounded-xl border border-slate-200 object-cover bg-slate-100"
                    title={user.fullName}
                  />
                </div>
              ) : (
                /* Inside Dashboard / Meeting: Minimalist Profile + Settings Gear + SignOut */
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setIsSettingsOpen(true)}
                    className="flex items-center gap-2 p-1 pl-2.5 bg-slate-100/90 hover:bg-slate-200/80 rounded-full border border-slate-200 transition-all text-xs cursor-pointer"
                    title="Open Settings"
                  >
                    <span className="font-semibold text-slate-900 hidden sm:inline font-sans">
                      {user.fullName}
                    </span>
                    {user.isPro && (
                      <span className="flex items-center gap-0.5 px-2 py-0.5 bg-blue-500/15 border border-blue-400/40 rounded-full text-[10px] font-mono font-bold text-[#0084FF]">
                        <Crown className="h-2.5 w-2.5 fill-[#0084FF] text-[#0084FF]" />
                        <span>PRO</span>
                      </span>
                    )}
                    <span className="text-[10px] font-mono text-[#0084FF] bg-blue-50 px-2 py-0.5 rounded-full font-bold border border-blue-200">
                      @{user.customSlug}
                    </span>
                    {user.avatarUrl ? (
                      <img
                        src={user.avatarUrl}
                        alt={user.fullName}
                        referrerPolicy="no-referrer"
                        className="h-6 w-6 rounded-full border border-slate-200 object-cover bg-slate-200"
                      />
                    ) : (
                      <div className="h-6 w-6 rounded-full bg-slate-900 text-white text-[10px] font-bold flex items-center justify-center">
                        {(user.fullName || 'H').charAt(0).toUpperCase()}
                      </div>
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={() => setIsSettingsOpen(true)}
                    className="p-2 rounded-full text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-all cursor-pointer"
                    title="Account &amp; Meeting Settings"
                  >
                    <Settings className="h-4 w-4" />
                  </button>

                  <button
                    type="button"
                    onClick={signOut}
                    className="p-2 rounded-full text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-all cursor-pointer"
                    title="Sign Out"
                  >
                    <LogOut className="h-4 w-4" />
                  </button>
                </div>
              )
            ) : (
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    const authBtn = document.querySelector('[data-auth-trigger]');
                    if (authBtn) (authBtn as HTMLElement).click();
                  }}
                  className="px-4 py-2 text-xs font-semibold text-slate-700 hover:text-slate-900 transition-colors cursor-pointer"
                >
                  Sign In
                </button>
                <button
                  type="button"
                  onClick={() => {
                    const authBtn = document.querySelector('[data-auth-trigger]');
                    if (authBtn) (authBtn as HTMLElement).click();
                  }}
                  className="px-4 py-2 text-xs font-semibold text-white bg-[#0084FF] hover:bg-[#0074E0] rounded-xl transition-all shadow-sm cursor-pointer"
                >
                  Get Started Free
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Settings Modal (Includes Affiliates, Profile, Stripe & Host Rules) */}
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
      />
    </>
  );
};
