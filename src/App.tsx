import React from 'react';
import { AuthProvider } from './context/AuthContext';
import { NetworkProvider } from './context/NetworkContext';
import { StreamProvider } from './context/StreamContext';
import { AppShell } from './components/shell/AppShell';
import { StageCanvas } from './components/stage/StageCanvas';

const MainRouter: React.FC = () => {
  const params = new URLSearchParams(window.location.search);
  const roomParam = params.get('room');

  // If directly accessing an active meeting room link, render the optimized StageCanvas
  if (roomParam) {
    return <StageCanvas />;
  }

  // Primary Triple Motive Ecosystem Shell
  return <AppShell />;
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
