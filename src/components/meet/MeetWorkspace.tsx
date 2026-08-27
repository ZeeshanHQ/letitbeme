import React, { useState } from 'react';
import {
  Video,
  Plus,
  Shield,
  Copy,
  Check,
  Users,
  Sparkles,
  ArrowRight,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useNetwork } from '../../context/NetworkContext';
import { useStream } from '../../context/StreamContext';
import { VideoPlayer } from '../stage/VideoPlayer';
import { Profile } from '../../types';

interface MeetWorkspaceProps {
  initialTargetMember?: Profile | null;
}

export const MeetWorkspace: React.FC<MeetWorkspaceProps> = ({ initialTargetMember }) => {
  const { user } = useAuth();
  const { connections } = useNetwork();
  const { isLive, toggleLiveStatus } = useStream();

  const [roomSlug, setRoomSlug] = useState(() => {
    return initialTargetMember
      ? `exec-${user?.tripleMotiveHandle || 'call'}-${initialTargetMember.tripleMotiveHandle || 'meet'}`
      : `motive-${Math.floor(100000 + Math.random() * 900000)}`;
  });

  const [isInMeeting, setIsInMeeting] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleCopyLink = () => {
    const link = `${window.location.origin}/?room=${roomSlug}`;
    navigator.clipboard.writeText(link);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleStartCall = () => {
    setIsInMeeting(true);
    if (!isLive) {
      toggleLiveStatus();
    }
  };

  if (isInMeeting) {
    return (
      <div className="w-full h-full flex flex-col bg-slate-950 relative overflow-hidden select-none">
        {/* Top Meeting Control Bar */}
        <div className="h-12 bg-[#0A0E17] border-b border-slate-800/80 px-4 flex items-center justify-between text-xs select-none z-30">
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="font-mono text-white font-semibold">Room: {roomSlug}</span>
            <span className="px-2 py-0.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-[10px] font-mono text-blue-400">
              E2E Encrypted Mesh
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleCopyLink}
              className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-300 transition-all cursor-pointer font-mono"
            >
              {copied ? <Check className="h-3 w-3 text-emerald-400" /> : <Copy className="h-3 w-3" />}
              <span>{copied ? 'Copied Link' : 'Copy Invite Link'}</span>
            </button>

            <button
              type="button"
              onClick={() => setIsInMeeting(false)}
              className="px-3 py-1 rounded-lg bg-rose-600 hover:bg-rose-700 text-white font-semibold transition-all cursor-pointer"
            >
              Exit Meeting View
            </button>
          </div>
        </div>

        {/* Embedded Full High-Performance WebRTC Video Stage */}
        <div className="flex-1 relative">
          <VideoPlayer showHostControls={true} />
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 sm:p-8 max-w-5xl mx-auto space-y-8 select-none font-sans">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2">
          <h1 className="text-2xl font-bold text-white tracking-tight font-heading">
            Executive Meet Module
          </h1>
          <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-mono font-semibold">
            Pure WebRTC Mesh
          </span>
        </div>
        <p className="text-xs text-slate-400 mt-1">
          Launch private, zero-latency 1080p WebRTC executive calls with your verified connections.
        </p>
      </div>

      {/* Direct Meeting Creator Card */}
      <div className="p-6 sm:p-8 rounded-3xl bg-[#0F141E] border border-slate-800/90 shadow-2xl space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-800">
          <div>
            <h2 className="text-base font-bold text-white font-heading">
              Instant Private Room Launcher
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Unique encrypted room link ready for direct peer-to-peer connection.
            </p>
          </div>

          <button
            type="button"
            onClick={handleStartCall}
            className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-500 hover:to-indigo-500 text-white text-sm font-bold shadow-xl shadow-blue-500/20 transition-all cursor-pointer active:scale-95 font-heading"
          >
            <Video className="h-4 w-4" />
            <span>Launch Video Call Now</span>
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-mono font-bold uppercase tracking-wider text-slate-400 mb-1.5">
              Meeting Room Identifier
            </label>
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={roomSlug}
                onChange={(e) => setRoomSlug(e.target.value)}
                className="flex-1 px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white font-mono focus:outline-none focus:border-blue-500"
              />
              <button
                type="button"
                onClick={handleCopyLink}
                className="p-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 transition-all cursor-pointer"
                title="Copy Room Link"
              >
                {copied ? <Check className="h-4 w-4 text-emerald-400" /> : <Copy className="h-4 w-4" />}
              </button>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800/80 space-y-1.5">
            <div className="flex items-center gap-1.5 text-xs font-mono font-semibold text-blue-400">
              <Shield className="h-3.5 w-3.5" />
              <span>SFU-Ready Abstract Transport Layer</span>
            </div>
            <p className="text-[11px] text-slate-400 leading-relaxed font-sans">
              Includes dynamic gallery multi-view, active speaker audio equalizer animations, and host moderation tools.
            </p>
          </div>
        </div>
      </div>

      {/* Connected Network Quick-Call Section */}
      <div className="space-y-4">
        <h3 className="text-sm font-bold text-white font-heading">
          Quick-Call Connected Executive Members
        </h3>

        {connections.length === 0 ? (
          <div className="p-8 rounded-2xl bg-[#0F141E] border border-slate-800 text-center text-xs text-slate-400">
            No active connections yet. Discover and connect with approved members in the{' '}
            <span className="text-blue-400 font-semibold">People</span> tab.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {connections.map((conn) => (
              <div
                key={conn.id}
                className="p-4 rounded-2xl bg-[#0F141E] border border-slate-800/90 flex items-center justify-between gap-3 shadow-lg"
              >
                <div className="flex items-center gap-3">
                  <img
                    src={conn.partnerProfile?.avatarUrl || `https://api.dicebear.com/7.x/initials/svg?seed=P`}
                    alt={conn.partnerProfile?.fullName || 'Partner'}
                    className="h-10 w-10 rounded-xl object-cover border border-slate-700 shadow-sm"
                  />
                  <div>
                    <h4 className="text-xs font-bold text-white font-heading">
                      {conn.partnerProfile?.fullName || 'Executive Partner'}
                    </h4>
                    <p className="text-[11px] text-slate-400">
                      {conn.partnerProfile?.headline || 'CEO'}
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    setRoomSlug(`call-${user?.tripleMotiveHandle || 'user'}-${conn.partnerProfile?.tripleMotiveHandle || 'partner'}`);
                    handleStartCall();
                  }}
                  className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-blue-600/15 hover:bg-blue-600 text-blue-400 hover:text-white border border-blue-500/30 text-xs font-semibold transition-all cursor-pointer"
                >
                  <Video className="h-3.5 w-3.5" />
                  <span>Call</span>
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
