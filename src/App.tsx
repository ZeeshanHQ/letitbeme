import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { NetworkProvider } from './context/NetworkContext';
import { StreamProvider } from './context/StreamContext';
import { AppShell } from './components/shell/AppShell';
import { LandingPage } from './components/landing/LandingPage';
import { StageCanvas } from './components/stage/StageCanvas';
import { AuthModal } from './components/auth/AuthModal';

const MainRouter: React.FC = () => {
  const { user } = useAuth();
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [currentView, setCurrentView] = useState<'landing' | 'app'>(() => {
    const params = new URLSearchParams(window.location.search);
    const viewParam = params.get('view');
    if (viewParam === 'app') return 'app';
    if (viewParam === 'landing') return 'landing';
    return 'landing';
  });

  const params = new URLSearchParams(window.location.search);
  const roomParam = params.get('room');

  // If directly accessing an active meeting room link, render the optimized StageCanvas
  if (roomParam) {
    return <StageCanvas />;
  }

  // If authenticated user selects "app" or has clicked "Enter Ecosystem"
  if (currentView === 'app') {
    return <AppShell />;
  }

  // Default: Public High-End Institutional Landing Page
  return (
    <>
      <LandingPage
        onOpenAuth={() => setIsAuthModalOpen(true)}
        onEnterApp={() => setCurrentView('app')}
      />

      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onSuccess={() => setCurrentView('app')}
      />
    </>
  );
};

export function App() {
  return (
    <AuthProvider>
      <NetworkProvider>
        <StreamProvider>
          <MainRouter />
        </StreamProvider>
      </NetworkProvider>
    </AuthProvider>
  );
}

export default App;
