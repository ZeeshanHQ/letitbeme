import React, { useState } from 'react';
import {
  Radio,
  TrendingUp,
  User,
  LogOut,
  Settings,
  Crown,
  MonitorPlay,
  ArrowRight,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useStream } from '../../context/StreamContext';
import { AuthModal } from '../auth/AuthModal';
import { SettingsModal } from './SettingsModal';

export type AppView = 'landing' | 'stage' | 'presenter' | 'referral';

interface NavbarProps {
  currentView: AppView;
  setCurrentView: (view: AppView) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ currentView, setCurrentView }) => {
  const { user, signOut } = useAuth();
  const { setIsPresenterRole } = useStream();
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  const handleViewChange = (view: AppView) => {
    setCurrentView(view);
    if (view === 'presenter') {
      setIsPresenterRole(true);
    } else if (view === 'stage') {
      setIsPresenterRole(false);
    }
  };

  const scrollToSection = (sectionId: string) => {
    if (currentView !== 'landing') {
      setCurrentView('landing');
      setTimeout(() => {
        const el = document.getElementById(sectionId);
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } else {
      const el = document.getElementById(sectionId);
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <>
      {/* Sticky Top-Centered Strong Liquid Glass Navbar */}
      <div className="sticky top-[20px] sm:top-[30px] z-50 w-full flex justify-center px-4 pointer-events-none">
        <header
          className="pointer-events-auto w-full max-w-[1200px] flex items-center justify-between px-4 sm:px-6 py-2.5 sm:py-3 transition-all duration-300 font-sans"
          style={{
            backdropFilter: 'blur(50px)',
            WebkitBackdropFilter: 'blur(50px)',
            backgroundColor: 'rgba(255, 255, 255, 0.75)',
            borderRadius: '16px',
            border: '1px solid rgba(0, 0, 0, 0.08)',
            boxShadow: 'inset 0px 4px 4px 0px rgba(255, 255, 255, 0.35), 0px 10px 30px rgba(0, 0, 0, 0.06)',
          }}
        >
          {/* Logo: Fustat Bold + 3D Logo */}
          <div className="flex items-center gap-3">
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

          {/* Center Navigation Links */}
          {user && currentView !== 'landing' ? (
            /* Dashboard View Switcher */
            <nav className="hidden md:flex items-center p-1 bg-slate-100/80 rounded-full border border-slate-200/80 text-xs font-semibold">
              <button
                type="button"
                onClick={() => handleViewChange('presenter')}
                className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full transition-all cursor-pointer ${
                  currentView === 'presenter'
                    ? 'bg-white text-obsidian shadow-sm'
                    : 'text-slate-500 hover:text-obsidian'
                }`}
              >
                <Radio className="h-3.5 w-3.5 text-[#0084FF]" />
                <span>Meeting Room</span>
              </button>

              <button
                type="button"
                onClick={() => handleViewChange('stage')}
                className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full transition-all cursor-pointer ${
                  currentView === 'stage'
                    ? 'bg-white text-obsidian shadow-sm'
                    : 'text-slate-500 hover:text-obsidian'
                }`}
              >
                <MonitorPlay className="h-3.5 w-3.5 text-[#0084FF]" />
                <span>Audience View</span>
              </button>

              <button
                type="button"
                onClick={() => handleViewChange('referral')}
                className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full transition-all cursor-pointer ${
                  currentView === 'referral'
                    ? 'bg-white text-obsidian shadow-sm'
                    : 'text-slate-500 hover:text-obsidian'
                }`}
              >
                <TrendingUp className="h-3.5 w-3.5 text-[#0084FF]" />
                <span>Affiliates</span>
              </button>
            </nav>
          ) : (
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
                    className="h-8 w-8 rounded-xl border border-slate-200 object-cover"
                    title={user.fullName}
                  />
                </div>
              ) : (
                /* Inside Dashboard / Meeting: Show Full Settings Gear + Profile + SignOut */
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setIsSettingsOpen(true)}
                    className="flex items-center gap-2 p-1 pl-2.5 bg-slate-100 hover:bg-slate-200/80 rounded-full border border-slate-200 transition-all text-xs cursor-pointer"
                    title="Open Settings"
                  >
                    <span className="font-semibold text-obsidian hidden sm:inline font-sans">
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
                    <img
                      src={user.avatarUrl}
                      alt={user.fullName}
                      referrerPolicy="no-referrer"
                      className="h-6 w-6 rounded-full border border-slate-200 object-cover"
                    />
                  </button>

                  <button
                    type="button"
                    onClick={() => setIsSettingsOpen(true)}
                    className="p-2 rounded-full text-slate-500 hover:text-obsidian hover:bg-slate-100 transition-all cursor-pointer"
                    title="Account & Meeting Settings"
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
              /* Signed Out State: Sign In + Sign Up */
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setIsAuthModalOpen(true)}
                  className="px-3.5 py-2 text-xs font-semibold text-slate-700 hover:text-obsidian cursor-pointer transition-colors font-sans"
                >
                  Sign In
                </button>

                <button
                  type="button"
                  onClick={() => setIsAuthModalOpen(true)}
                  className="group relative inline-flex items-center justify-center gap-2 px-4 py-2 text-xs font-semibold text-white transition-all duration-200 hover:scale-[1.02] cursor-pointer"
                  style={{
                    backgroundColor: 'rgba(0, 132, 255, 0.9)',
                    backdropFilter: 'blur(2px)',
                    WebkitBackdropFilter: 'blur(2px)',
                    borderRadius: '12px',
                    boxShadow: 'inset 0px 4px 4px 0px rgba(255, 255, 255, 0.35), 0 4px 14px rgba(0, 132, 255, 0.3)',
                  }}
                >
                  <span>Sign Up</span>
                  <ArrowRight className="h-3.5 w-3.5 transition-transform duration-200 group-hover:translate-x-0.5" />
                </button>
              </div>
            )}
          </div>

        </header>
      </div>

      {/* Auth Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
      />

      {/* Settings Modal */}
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
      />
    </>
  );
};
