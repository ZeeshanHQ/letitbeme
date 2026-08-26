import React from 'react';
import { PhoneOff, RotateCcw, Home, Clock, User, ShieldCheck } from 'lucide-react';
import { useStream } from '../../context/StreamContext';

interface MeetingEndedScreenProps {
  onRejoinLobby?: () => void;
}

export const MeetingEndedScreen: React.FC<MeetingEndedScreenProps> = ({ onRejoinLobby }) => {
  const { hostName, presenterName, streamDuration, setIsMeetingEnded, setIsGuestJoined, setIsWaitingInLobby } = useStream();

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    if (mins === 0) return `${secs}s`;
    return `${mins}m ${secs}s`;
  };

  const handleRejoin = () => {
    setIsMeetingEnded(false);
    setIsGuestJoined(false);
    setIsWaitingInLobby(false);
    if (onRejoinLobby) onRejoinLobby();
  };

  return (
    <div className="w-full min-h-[500px] flex items-center justify-center p-4 sm:p-8 font-['Plus_Jakarta_Sans',sans-serif]">
      <div className="max-w-md w-full bg-white rounded-3xl border border-slate-200 shadow-2xl p-8 sm:p-10 text-center space-y-6 animate-fade-in">
        
        {/* Animated End Call Badge */}
        <div className="relative inline-flex">
          <div className="h-20 w-20 rounded-full bg-rose-50 border-2 border-rose-200 flex items-center justify-center text-rose-600 shadow-inner">
            <PhoneOff className="h-9 w-9" />
          </div>
        </div>

        {/* Header Text */}
        <div className="space-y-2">
          <h2 className="text-2xl sm:text-3xl font-heading font-bold text-slate-900 tracking-tight">
            Meeting Ended
          </h2>
          <p className="text-sm text-slate-500 leading-relaxed">
            The host has ended this live session. Thank you for participating!
          </p>
        </div>

        {/* Meeting Summary Pill */}
        <div className="bg-slate-50 rounded-2xl border border-slate-200/80 p-4 space-y-2.5 text-xs text-slate-600 text-left">
          <div className="flex items-center justify-between">
            <span className="flex items-center gap-1.5 text-slate-500 font-medium">
              <User className="h-3.5 w-3.5 text-[#0084FF]" />
              Host:
            </span>
            <strong className="text-slate-900 font-semibold">{hostName || presenterName || 'Host Presenter'}</strong>
          </div>
          {streamDuration > 0 && (
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-1.5 text-slate-500 font-medium">
                <Clock className="h-3.5 w-3.5 text-emerald-500" />
                Session Duration:
              </span>
              <strong className="text-slate-900 font-mono font-semibold">{formatDuration(streamDuration)}</strong>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="space-y-3 pt-2">
          <button
            type="button"
            onClick={handleRejoin}
            className="w-full py-3.5 px-5 rounded-2xl bg-[#0084FF] hover:bg-[#0074E0] text-white text-sm font-semibold flex items-center justify-center gap-2 shadow-lg shadow-blue-500/25 transition-all cursor-pointer hover:scale-[1.01]"
          >
            <RotateCcw className="h-4 w-4" />
            <span>Rejoin Meeting Lobby</span>
          </button>

          <button
            type="button"
            onClick={() => {
              window.location.href = '/';
            }}
            className="w-full py-3 px-5 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer"
          >
            <Home className="h-4 w-4" />
            <span>Return to Home</span>
          </button>
        </div>

        <div className="pt-2 text-[11px] text-slate-400 flex items-center justify-center gap-1.5">
          <ShieldCheck className="h-3.5 w-3.5 text-emerald-500" />
          <span>Secure WebRTC Session Concluded</span>
        </div>

      </div>
    </div>
  );
};
