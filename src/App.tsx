import React, { useState, useEffect, useRef } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { StreamProvider, useStream } from './context/StreamContext';
import { Navbar, AppView } from './components/common/Navbar';
import { LandingPage } from './components/landing/LandingPage';
import { StageCanvas } from './components/stage/StageCanvas';
import { PresenterStudio } from './components/presenter/PresenterStudio';
import { ReferralDashboard } from './components/dashboard/ReferralDashboard';
import { InactivityTimeoutModal } from './components/common/InactivityTimeoutModal';

const AppContent: React.FC = () => {
  const [currentView, setCurrentView] = useState<AppView>('landing');
  const { user } = useAuth();
  const { isPresenterRole, setIsPresenterRole } = useStream();
  const prevUserRef = useRef(user);

  // Auto-redirect to presenter dashboard upon user login
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
  }, [setIsPresenterRole]);

  return (
    <div className="min-h-screen bg-[#FAF9F6] flex flex-col font-sans selection:bg-solar-500/20 selection:text-solar-900 text-obsidian antialiased">
      {/* Top Universal Navbar */}
      <Navbar currentView={currentView} setCurrentView={setCurrentView} />

      {/* Main Viewport */}
      <main className="flex-1">
        {currentView === 'landing' && (
          <LandingPage
            onEnterStage={() => setCurrentView('stage')}
            onEnterPresenter={() => {
              setIsPresenterRole(true);
              setCurrentView('presenter');
            }}
          />
        )}

        {currentView === 'stage' && <StageCanvas />}

        {currentView === 'presenter' && (
          <PresenterStudio onOpenReferral={() => setCurrentView('referral')} />
        )}

        {currentView === 'referral' && <ReferralDashboard />}
      </main>

      {/* Inactivity 5-Min Timeout & 60s Auto-Close Modal */}
      <InactivityTimeoutModal />
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
