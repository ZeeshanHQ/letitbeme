import React, { useState } from 'react';
import {
  Radio,
  MonitorPlay,
  TrendingUp,
  Settings,
  LogOut,
  ArrowRight,
  Crown,
  Zap,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { SettingsModal } from './SettingsModal';
import { ProUpgradeModal } from './ProUpgradeModal';

export type AppView = 'landing' | 'stage' | 'presenter' | 'referral';

interface NavbarProps {
  currentView: AppView;
  setCurrentView: (view: AppView) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ currentView, setCurrentView }) => {
  const { user, signOut } = useAuth();
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isProModalOpen, setIsProModalOpen] = useState(false);

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
            backgroundColor: 'rgba(255, 255, 255, 0.82)',
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

          {/* Center Navigation / View Capsule Switcher */}
          {user && currentView !== 'landing' ? (
            /* Luxury Glassmorphism View Switcher */
            <nav className="hidden sm:flex items-center p-1 bg-slate-100/90 backdrop-blur-md rounded-2xl border border-slate-200/80 text-xs font-semibold shadow-inner">
              <button
                type="button"
                onClick={() => handleViewChange('presenter')}
                className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl transition-all cursor-pointer ${
                  currentView === 'presenter'
                    ? 'bg-white text-slate-900 shadow-sm border border-slate-200/60'
                    : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                <Radio className={`h-3.5 w-3.5 ${currentView === 'presenter' ? 'text-[#0084FF]' : 'text-slate-400'}`} />
                <span>Meeting Studio</span>
              </button>

              <button
                type="button"
                onClick={() => handleViewChange('stage')}
                className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl transition-all cursor-pointer ${
                  currentView === 'stage'
                    ? 'bg-white text-slate-900 shadow-sm border border-slate-200/60'
                    : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                <MonitorPlay className={`h-3.5 w-3.5 ${currentView === 'stage' ? 'text-[#0084FF]' : 'text-slate-400'}`} />
                <span>Audience View</span>
              </button>

              <button
                type="button"
                onClick={() => handleViewChange('referral')}
                className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl transition-all cursor-pointer ${
                  currentView === 'referral'
                    ? 'bg-white text-slate-900 shadow-sm border border-slate-200/60'
                    : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                <TrendingUp className={`h-3.5 w-3.5 ${currentView === 'referral' ? 'text-[#0084FF]' : 'text-slate-400'}`} />
                <span>Ambassador</span>
              </button>
            </nav>
          ) : currentView === 'landing' ? (
            /* Public Landing Page Links */
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
          ) : null}

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
                  <div className="flex items-center gap-1.5 p-1 pl-2.5 bg-slate-100/90 rounded-full border border-slate-200 text-xs">
                    <span className="font-semibold text-slate-900 hidden sm:inline font-sans">
                      {user.fullName}
                    </span>
                    
                    {/* Free vs Pro Badge - Clickable to open Pro Modal */}
                    <button
                      type="button"
                      onClick={() => setIsProModalOpen(true)}
                      className="cursor-pointer hover:opacity-90 transition-opacity"
                      title="Click to view Pro benefits and subscription"
                    >
                      {user.isPro ? (
                        <span className="flex items-center gap-0.5 px-2 py-0.5 bg-blue-500/15 border border-blue-400/40 rounded-full text-[10px] font-mono font-bold text-[#0084FF]">
                          <Crown className="h-2.5 w-2.5 fill-[#0084FF] text-[#0084FF]" />
                          <span>PRO</span>
                        </span>
                      ) : (
                        <span className="flex items-center gap-0.5 px-2 py-0.5 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-full text-[10px] font-mono font-bold shadow-sm shadow-blue-500/20">
                          <Crown className="h-2.5 w-2.5 fill-white text-white" />
                          <span>UPGRADE</span>
                        </span>
                      )}
                    </button>

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
                  </div>

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

      {/* Settings Modal */}
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
      />

      {/* Pro Upgrade Subscription Modal ($19.99/mo) */}
      <ProUpgradeModal
        isOpen={isProModalOpen}
        onClose={() => setIsProModalOpen(false)}
      />
    </>
  );
};
