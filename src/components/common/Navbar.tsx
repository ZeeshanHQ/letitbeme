import React, { useState } from 'react';
import {
  Video,
  Radio,
  Tv,
  Layers,
  Sparkles,
  Zap,
  TrendingUp,
  User,
  LogOut,
  Sliders,
  ExternalLink,
  Lock,
  Globe,
  MonitorPlay,
  Settings,
  Crown,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useStream } from '../../context/StreamContext';
import { Button } from './Button';
import { AuthModal } from '../auth/AuthModal';
import { SettingsModal } from './SettingsModal';

export type AppView = 'landing' | 'stage' | 'presenter' | 'referral';

interface NavbarProps {
  currentView: AppView;
  setCurrentView: (view: AppView) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ currentView, setCurrentView }) => {
  const { user, signOut } = useAuth();
  const { isLive, setIsPresenterRole } = useStream();
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
      <header className="sticky top-0 z-40 w-full border-b border-slate-200/80 bg-white/90 backdrop-blur-2xl transition-all font-sans">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          
          {/* 3D Brand Logo */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => handleViewChange('landing')}
              className="flex items-center gap-2.5 group focus:outline-none cursor-pointer"
            >
              <img
                src="/logo3d.png"
                alt="LetItBeMe 3D Logo"
                className="h-8 w-8 rounded-xl object-cover shadow-sm group-hover:scale-105 transition-all"
              />
              <span className="text-base font-heading font-bold tracking-tight text-obsidian">
                LetItBe<span className="text-solar-500 font-semibold">Me</span>
              </span>
            </button>
          </div>

          {/* Center Navigation */}
          {user ? (
            /* Logged-In App Switcher */
            <nav className="hidden md:flex items-center p-1 bg-slate-100/90 rounded-full border border-slate-200/80 shadow-inner text-xs font-semibold">
              <button
                onClick={() => handleViewChange('presenter')}
                className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full transition-all cursor-pointer ${
                  currentView === 'presenter'
                    ? 'bg-white text-obsidian shadow-sm'
                    : 'text-slate-500 hover:text-obsidian'
                }`}
              >
                <Radio className="h-3.5 w-3.5 text-solar-500" />
                <span>Meeting Room</span>
              </button>

              <button
                onClick={() => handleViewChange('stage')}
                className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full transition-all cursor-pointer ${
                  currentView === 'stage'
                    ? 'bg-white text-obsidian shadow-sm'
                    : 'text-slate-500 hover:text-obsidian'
                }`}
              >
                <MonitorPlay className="h-3.5 w-3.5 text-solar-500" />
                <span>Audience View</span>
              </button>

              <button
                onClick={() => handleViewChange('referral')}
                className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full transition-all cursor-pointer ${
                  currentView === 'referral'
                    ? 'bg-white text-obsidian shadow-sm'
                    : 'text-slate-500 hover:text-obsidian'
                }`}
              >
                <TrendingUp className="h-3.5 w-3.5 text-solar-500" />
                <span>Affiliates</span>
              </button>
            </nav>
          ) : (
            /* Public Marketing Navigation */
            <nav className="hidden md:flex items-center gap-6 text-xs font-medium text-slate-600 font-sans">
              <button
                onClick={() => scrollToSection('stage-preview-section')}
                className="hover:text-obsidian transition-colors cursor-pointer"
              >
                Interactive Features
              </button>
              <button
                onClick={() => scrollToSection('feature-grid-section')}
                className="hover:text-obsidian transition-colors cursor-pointer"
              >
                Capabilities
              </button>
              <button
                onClick={() => scrollToSection('free-community-section')}
                className="hover:text-obsidian transition-colors cursor-pointer"
              >
                Why $0 Free?
              </button>
            </nav>
          )}

          {/* Right Actions: User Profile or Sign In CTA */}
          <div className="flex items-center gap-2.5">
            {user ? (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsSettingsOpen(true)}
                  className="flex items-center gap-2 p-1 pl-2.5 bg-slate-100 hover:bg-slate-200/80 rounded-full border border-slate-200 transition-all text-xs cursor-pointer"
                  title="Open Settings"
                >
                  <span className="font-semibold text-obsidian hidden sm:inline">
                    {user.fullName}
                  </span>
                  {user.isPro && (
                    <span className="flex items-center gap-0.5 px-2 py-0.5 bg-amber-500/15 border border-amber-400/40 rounded-full text-[10px] font-mono font-bold text-amber-600">
                      <Crown className="h-2.5 w-2.5 fill-amber-500 text-amber-500" />
                      <span>PRO</span>
                    </span>
                  )}
                  <span className="text-[10px] font-mono text-solar-600 bg-solar-50 px-2 py-0.5 rounded-full font-bold border border-solar-200">
                    @{user.customSlug}
                  </span>
                  <img
                    src={user.avatarUrl}
                    alt={user.fullName}
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
            ) : (
              <>
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => setIsAuthModalOpen(true)}
                  className="rounded-full font-semibold text-xs border-slate-200"
                  leftIcon={<User className="h-3.5 w-3.5 text-solar-500" />}
                >
                  Sign In
                </Button>

                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => setIsAuthModalOpen(true)}
                  className="rounded-full font-semibold text-xs"
                >
                  Get Started Free
                </Button>
              </>
            )}
          </div>
        </div>
      </header>

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
