import React from 'react';
import {
  ShieldCheck,
  Video,
  Users,
  Building2,
  Compass,
  Sparkles,
  ArrowRight,
  Clock,
  Radio,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useNetwork } from '../../context/NetworkContext';
import { AppNavigationTab } from '../../types';

interface HomeFeedProps {
  onNavigate: (tab: AppNavigationTab) => void;
}

export const HomeFeed: React.FC<HomeFeedProps> = ({ onNavigate }) => {
  const { user, primaryOrg } = useAuth();
  const { directory, connections, incomingRequests } = useNetwork();

  return (
    <div className="p-6 sm:p-8 max-w-6xl mx-auto space-y-8 select-none font-sans">
      {/* Executive Welcome Hero */}
      <div className="p-8 rounded-3xl bg-gradient-to-br from-[#0F141E] via-[#0B0F17] to-[#131B2A] border border-slate-800/90 shadow-2xl relative overflow-hidden">
        <div className="relative z-10 space-y-3 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-xs font-mono font-semibold text-blue-400">
            <span className="h-2 w-2 rounded-full bg-blue-400 animate-pulse" />
            <span>Private Executive Ecosystem • Phase 1</span>
          </div>

          <h1 className="text-3xl font-extrabold text-white tracking-tight font-heading leading-tight">
            Welcome, {user?.fullName || 'Executive Member'}
          </h1>

          <p className="text-sm text-slate-300 leading-relaxed font-sans">
            Triple Motive unites your professional identity, verified executive connections, and ultra-high-definition private WebRTC video collaboration in one unified interface.
          </p>

          <div className="flex flex-wrap items-center gap-3 pt-4">
            <button
              type="button"
              onClick={() => onNavigate('meet')}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-xs font-bold shadow-lg shadow-blue-500/20 transition-all cursor-pointer font-heading"
            >
              <Video className="h-4 w-4" />
              <span>Launch Instant Meeting</span>
            </button>

            <button
              type="button"
              onClick={() => onNavigate('people')}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-200 text-xs font-semibold transition-all cursor-pointer font-heading"
            >
              <Users className="h-4 w-4" />
              <span>Explore Network ({directory.length})</span>
            </button>
          </div>
        </div>

        {/* Decorative background glow */}
        <div className="absolute right-0 top-0 bottom-0 w-96 bg-gradient-to-l from-blue-600/10 via-indigo-600/5 to-transparent pointer-events-none" />
      </div>

      {/* Metric Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
        <div
          onClick={() => onNavigate('people')}
          className="p-5 rounded-2xl bg-[#0F141E] border border-slate-800 hover:border-slate-700 transition-all cursor-pointer shadow-lg space-y-2 group"
        >
          <div className="flex items-center justify-between text-slate-400 text-xs font-mono">
            <span>Verified Connections</span>
            <Users className="h-4 w-4 text-blue-400 group-hover:scale-110 transition-transform" />
          </div>
          <div className="text-2xl font-bold text-white font-heading">
            {connections.length}
          </div>
          <span className="text-[11px] text-slate-400 block font-sans">
            Active peer-to-peer connection relationships.
          </span>
        </div>

        <div
          onClick={() => onNavigate('people')}
          className="p-5 rounded-2xl bg-[#0F141E] border border-slate-800 hover:border-slate-700 transition-all cursor-pointer shadow-lg space-y-2 group"
        >
          <div className="flex items-center justify-between text-slate-400 text-xs font-mono">
            <span>Pending Requests</span>
            <Clock className="h-4 w-4 text-amber-400 group-hover:scale-110 transition-transform" />
          </div>
          <div className="text-2xl font-bold text-white font-heading">
            {incomingRequests.length}
          </div>
          <span className="text-[11px] text-slate-400 block font-sans">
            Incoming network introductions waiting for review.
          </span>
        </div>

        <div className="p-5 rounded-2xl bg-[#0F141E] border border-slate-800 shadow-lg space-y-2">
          <div className="flex items-center justify-between text-slate-400 text-xs font-mono">
            <span>Primary Workspace</span>
            <Building2 className="h-4 w-4 text-emerald-400" />
          </div>
          <div className="text-xl font-bold text-white truncate font-heading">
            {primaryOrg?.name || 'Personal Workspace'}
          </div>
          <span className="text-[11px] text-slate-400 block font-sans">
            Multi-tenant organization isolation active.
          </span>
        </div>
      </div>

      {/* Next Milestones Overview */}
      <div className="p-6 rounded-3xl bg-[#0F141E] border border-slate-800 space-y-4">
        <h3 className="text-sm font-bold text-white font-heading">
          Triple Motive Ecosystem Roadmap
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-200 font-heading">Universe Library</span>
              <span className="text-[9px] font-mono font-bold px-1.5 py-0.5 rounded bg-blue-500/10 text-blue-400 border border-blue-500/20">Phase 2</span>
            </div>
            <p className="text-[11px] text-slate-400 leading-relaxed font-sans">
              Universal semantic storage for your private body of work (PDFs, memos, code, media).
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-200 font-heading">Private Messaging</span>
              <span className="text-[9px] font-mono font-bold px-1.5 py-0.5 rounded bg-blue-500/10 text-blue-400 border border-blue-500/20">Phase 2</span>
            </div>
            <p className="text-[11px] text-slate-400 leading-relaxed font-sans">
              Direct end-to-end encrypted member-to-member executive messaging channels.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-200 font-heading">AI Synthesis</span>
              <span className="text-[9px] font-mono font-bold px-1.5 py-0.5 rounded bg-blue-500/10 text-blue-400 border border-blue-500/20">Phase 2</span>
            </div>
            <p className="text-[11px] text-slate-400 leading-relaxed font-sans">
              Multi-model reasoning across your body of work (Claude, OpenAI, Grok).
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
