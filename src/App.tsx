import React, { useState, useEffect, useRef } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { StreamProvider, useStream } from './context/StreamContext';
import { Navbar, AppView } from './components/common/Navbar';
import { LandingPage } from './components/landing/LandingPage';
import { StageCanvas } from './components/stage/StageCanvas';
import { PresenterStudio } from './components/presenter/PresenterStudio';
import { ReferralDashboard } from './components/dashboard/ReferralDashboard';
import { InactivityTimeoutModal } from './components/common/InactivityTimeoutModal';
import { AuthModal } from './components/auth/AuthModal';
import { trackReferralClick } from './lib/referral';

const AppContent: React.FC = () => {
  // Initialize view strictly from URL params
  const [currentView, setCurrentView] = useState<AppView>(() => {
    const params = new URLSearchParams(window.location.search);
    const viewParam = params.get('view') as AppView;
    if (viewParam && ['landing', 'stage', 'presenter', 'referral'].includes(viewParam)) {
      return viewParam;
    }
    const roomParam = params.get('room');
    if (roomParam) {
      return 'stage';
    }
    // Root URL (e.g. letitbeme.online) ALWAYS defaults to Landing Page
    return 'landing';
  });

  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const { user } = useAuth();
  const { setIsPresenterRole } = useStream();
  const prevUserRef = useRef(user);

  // Auto-redirect to presenter studio only upon fresh login from landing page
  useEffect(() => {
    if (user && !prevUserRef.current && currentView === 'landing') {
      setCurrentView('presenter');
      setIsPresenterRole(true);
    }
    prevUserRef.current = user;
  }, [user, currentView, setIsPresenterRole]);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const viewParam = params.get('view') as AppView;
    if (viewParam && ['landing', 'stage', 'presenter', 'referral'].includes(viewParam)) {
      setCurrentView(viewParam);
      if (viewParam === 'presenter') setIsPresenterRole(true);
    }

    const refParam = params.get('ref');
    if (refParam) {
      trackReferralClick(refParam);
    }
  }, [setIsPresenterRole]);

  const { isLive } = useStream();

  return (
    <div className="min-h-screen bg-white flex flex-col font-['Plus_Jakarta_Sans',sans-serif] selection:bg-blue-500/20 selection:text-blue-900 text-slate-800 antialiased">
      {/* Top Universal Minimalist Navbar - Hidden for attendees on meeting links and during active live meetings */}
      {currentView !== 'stage' && !(currentView === 'presenter' && isLive) && (
        <Navbar
          currentView={currentView}
          setCurrentView={setCurrentView}
          onOpenAuth={() => setIsAuthModalOpen(true)}
        />
      )}

      {/* Main Viewport */}
      <main className="flex-1">
        {currentView === 'landing' && (
          <LandingPage
            onEnterStage={() => setCurrentView('stage')}
            onEnterPresenter={() => {
              if (user) {
                setIsPresenterRole(true);
                setCurrentView('presenter');
              } else {
                setIsAuthModalOpen(true);
              }
            }}
            onOpenAuth={() => setIsAuthModalOpen(true)}
          />
        )}

        {currentView === 'stage' && <StageCanvas />}

        {currentView === 'presenter' && (
          <PresenterStudio onOpenReferral={() => setCurrentView('referral')} />
        )}

        {currentView === 'referral' && <ReferralDashboard />}
      </main>

      {/* Global Inactivity Timeout Guard */}
      {currentView === 'presenter' && <InactivityTimeoutModal />}

      {/* Global Auth Modal for Get Started Flow */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
      />
    </div>
  );
};

export function App() {
  return (
    <AuthProvider>
      <StreamProvider>
        <AppContent />
      </StreamProvider>
    </AuthProvider>
  );
}

export default App;
