import React from 'react';
import {
  Search,
  Bell,
  Video,
  Shield,
  Sparkles,
} from 'lucide-react';
import { useNetwork } from '../../context/NetworkContext';
import { useAuth } from '../../context/AuthContext';

interface TopHeaderProps {
  onStartMeeting: () => void;
  onOpenRequests: () => void;
  onOpenProfile: () => void;
}

export const TopHeader: React.FC<TopHeaderProps> = ({
  onStartMeeting,
  onOpenRequests,
  onOpenProfile,
}) => {
  const { searchQuery, setSearchQuery, incomingRequests } = useNetwork();
  const { user } = useAuth();

  return (
    <header className="h-16 bg-[#080C14] border-b border-slate-800/80 px-6 flex items-center justify-between gap-4 select-none">
      {/* Global Network Search */}
      <div className="flex-1 max-w-md relative">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400 pointer-events-none" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search verified founders, CEOs, and expertise..."
          className="w-full pl-9 pr-4 py-2 rounded-xl bg-slate-900/80 border border-slate-800 text-xs text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/50 transition-all font-sans"
        />
      </div>

      {/* Action Controls & Identity Indicators */}
      <div className="flex items-center gap-3">
        {/* Security & Private Node Badge */}
        <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-[11px] font-mono text-slate-300">
          <Shield className="h-3 w-3 text-blue-400" />
          <span>E2E Encrypted Node</span>
        </div>

        {/* Incoming Connection Notifications */}
        <button
          type="button"
          onClick={onOpenRequests}
          className="relative p-2.5 rounded-xl bg-slate-900 border border-slate-800 hover:bg-slate-800/80 text-slate-300 transition-all cursor-pointer"
          title="Connection Invitations"
        >
          <Bell className="h-4 w-4" />
          {incomingRequests.length > 0 && (
            <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-blue-600 text-white text-[9px] font-bold flex items-center justify-center animate-pulse shadow-md">
              {incomingRequests.length}
            </span>
          )}
        </button>

        {/* Instant Executive Meeting Action */}
        <button
          type="button"
          onClick={onStartMeeting}
          className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-xs font-semibold shadow-lg shadow-blue-500/20 transition-all cursor-pointer active:scale-95 font-heading"
        >
          <Video className="h-3.5 w-3.5" />
          <span className="hidden sm:inline">Start Executive Call</span>
          <span className="sm:hidden">Meet</span>
        </button>
      </div>
    </header>
  );
};
