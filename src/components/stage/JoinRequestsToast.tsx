import React, { useState, useEffect } from 'react';
import {
  UserCheck,
  UserX,
  X,
  Users,
  CheckCheck,
  Radio,
  BellRing,
} from 'lucide-react';
import { useStream, WaitingParticipant } from '../../context/StreamContext';

export const JoinRequestsToast: React.FC = () => {
  const { waitingParticipants, admitParticipant, denyParticipant } = useStream();
  const [activeToast, setActiveToast] = useState<WaitingParticipant | null>(null);
  const [isRequestsModalOpen, setIsRequestsModalOpen] = useState(false);
  const [dismissedIds, setDismissedIds] = useState<string[]>([]);

  // When a new participant joins the waiting queue, pop down the animated toast
  useEffect(() => {
    if (waitingParticipants.length > 0) {
      const latest = waitingParticipants[waitingParticipants.length - 1];
      if (!dismissedIds.includes(latest.id)) {
        setActiveToast(latest);
        // Play subtle gentle notification chime if audio context allows
        try {
          const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'sine';
          osc.frequency.setValueAtTime(587.33, ctx.currentTime); // D5
          osc.frequency.setValueAtTime(880, ctx.currentTime + 0.1); // A5
          gain.gain.setValueAtTime(0.08, ctx.currentTime);
          gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.35);
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start();
          osc.stop(ctx.currentTime + 0.35);
        } catch {
          // Audio autoplay policy
        }
      }
    } else {
      setActiveToast(null);
    }
  }, [waitingParticipants, dismissedIds]);

  const handleDismissToast = (id: string) => {
    setDismissedIds((prev) => [...prev, id]);
    setActiveToast(null);
  };

  const handleAdmitSingle = (id: string) => {
    admitParticipant(id);
    handleDismissToast(id);
  };

  const handleDenySingle = (id: string) => {
    denyParticipant(id);
    handleDismissToast(id);
  };

  const handleAdmitAll = () => {
    waitingParticipants.forEach((p) => admitParticipant(p.id));
    setActiveToast(null);
    setIsRequestsModalOpen(false);
  };

  return (
    <>
      {/* 1. TOP ANIMATED SPRING TOAST BANNER */}
      {activeToast && (
        <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 w-full max-w-md px-4 animate-slide-down">
          <div className="bg-slate-900/95 backdrop-blur-xl border border-blue-500/40 p-4 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] flex items-center justify-between gap-3 text-white">
            
            <div className="flex items-center gap-3 min-w-0">
              <div className="relative shrink-0">
                {activeToast.avatar ? (
                  <img
                    src={activeToast.avatar}
                    alt={activeToast.name}
                    className="h-10 w-10 rounded-full border-2 border-[#0084FF] object-cover bg-slate-800"
                  />
                ) : (
                  <div className="h-10 w-10 rounded-full bg-[#0084FF] text-white font-bold text-sm flex items-center justify-center">
                    {activeToast.name.charAt(0).toUpperCase()}
                  </div>
                )}
                <span className="absolute -top-0.5 -right-0.5 flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500" />
                </span>
              </div>

              <div className="text-left truncate">
                <div className="flex items-center gap-1.5">
                  <BellRing className="h-3 w-3 text-amber-400 animate-bounce" />
                  <span className="text-[11px] font-mono text-slate-400">Join Request</span>
                </div>
                <h4 className="text-xs font-heading font-bold text-white truncate">
                  {activeToast.name}
                </h4>
                <p className="text-[10px] text-slate-400">is knocking to join the meeting</p>
              </div>
            </div>

            {/* Quick Action Buttons */}
            <div className="flex items-center gap-1.5 shrink-0">
              <button
                type="button"
                onClick={() => handleAdmitSingle(activeToast.id)}
                className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold flex items-center gap-1 transition-all shadow-md shadow-emerald-900/30 cursor-pointer"
              >
                <UserCheck className="h-3.5 w-3.5" />
                <span>Admit</span>
              </button>

              <button
                type="button"
                onClick={() => handleDenySingle(activeToast.id)}
                className="px-2.5 py-1.5 rounded-xl bg-slate-800 hover:bg-rose-900/60 hover:text-rose-300 text-slate-300 text-xs font-semibold flex items-center gap-1 transition-all border border-slate-700 cursor-pointer"
                title="Decline entry"
              >
                <UserX className="h-3.5 w-3.5" />
                <span>Deny</span>
              </button>

              <button
                type="button"
                onClick={() => handleDismissToast(activeToast.id)}
                className="p-1 text-slate-500 hover:text-white cursor-pointer ml-0.5"
                title="Dismiss to badge"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </div>

          </div>
        </div>
      )}

      {/* 2. FLOATING / PERSISTENT REQUESTS BADGE (When there are waiting guests) */}
      {waitingParticipants.length > 0 && (
        <div className="fixed bottom-24 right-4 z-40 animate-bounce-in">
          <button
            type="button"
            onClick={() => setIsRequestsModalOpen(true)}
            className="flex items-center gap-2 px-3.5 py-2 rounded-full bg-slate-900 text-white border-2 border-[#0084FF] shadow-2xl hover:scale-105 transition-all cursor-pointer group"
          >
            <div className="relative">
              <Users className="h-4 w-4 text-[#0084FF]" />
              <span className="absolute -top-2 -right-2 bg-rose-500 text-white font-mono font-bold text-[10px] h-4 min-w-4 px-1 rounded-full flex items-center justify-center animate-pulse">
                {waitingParticipants.length}
              </span>
            </div>
            <span className="text-xs font-semibold">
              {waitingParticipants.length === 1 ? '1 Request' : `${waitingParticipants.length} Requests`}
            </span>
          </button>
        </div>
      )}

      {/* 3. FULL REQUESTS WAITING ROOM FLYOUT / MODAL */}
      {isRequestsModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-md flex items-center justify-center p-4 animate-fade-in font-sans">
          <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-md w-full overflow-hidden animate-slide-up flex flex-col max-h-[85vh] text-left">
            
            {/* Header */}
            <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <div className="flex items-center gap-2.5">
                <div className="h-9 w-9 rounded-xl bg-blue-500/10 border border-blue-500/20 text-[#0084FF] flex items-center justify-center font-bold">
                  <Radio className="h-4 w-4" />
                </div>
                <div>
                  <h3 className="text-sm font-heading font-bold text-[#0f172a] tracking-tight">
                    Meeting Waiting Room ({waitingParticipants.length})
                  </h3>
                  <p className="text-xs text-slate-400 font-normal">
                    Guests knocking to join your live video session
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsRequestsModalOpen(false)}
                className="p-2 rounded-xl text-slate-400 hover:text-slate-900 hover:bg-slate-100 cursor-pointer"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* List Body */}
            <div className="p-5 space-y-3 overflow-y-auto flex-1">
              {waitingParticipants.length === 0 ? (
                <div className="py-12 text-center text-slate-400 text-xs">
                  No pending join requests.
                </div>
              ) : (
                waitingParticipants.map((guest) => (
                  <div
                    key={guest.id}
                    className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 flex items-center justify-between gap-3"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      {guest.avatar ? (
                        <img
                          src={guest.avatar}
                          alt={guest.name}
                          className="h-10 w-10 rounded-full border border-slate-200 object-cover bg-white"
                        />
                      ) : (
                        <div className="h-10 w-10 rounded-full bg-slate-900 text-white font-bold text-xs flex items-center justify-center">
                          {guest.name.charAt(0).toUpperCase()}
                        </div>
                      )}
                      <div className="truncate">
                        <strong className="text-xs font-bold text-slate-900 block truncate">
                          {guest.name}
                        </strong>
                        <span className="text-[11px] font-mono text-slate-400">
                          {guest.joinedAt || 'Knocked just now'}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5 shrink-0">
                      <button
                        type="button"
                        onClick={() => handleAdmitSingle(guest.id)}
                        className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold flex items-center gap-1 cursor-pointer transition-all shadow-sm"
                      >
                        <UserCheck className="h-3.5 w-3.5" />
                        <span>Admit</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => handleDenySingle(guest.id)}
                        className="p-2 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 cursor-pointer transition-all"
                        title="Decline"
                      >
                        <UserX className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Bottom Actions */}
            {waitingParticipants.length > 0 && (
              <div className="p-4 border-t border-slate-100 flex items-center justify-between bg-slate-50/50">
                <span className="text-xs font-mono text-slate-500">
                  {waitingParticipants.length} waiting
                </span>
                <button
                  type="button"
                  onClick={handleAdmitAll}
                  className="px-4 py-2 rounded-xl bg-[#0084FF] hover:bg-[#0074E0] text-white text-xs font-semibold flex items-center gap-1.5 shadow-md shadow-blue-500/20 cursor-pointer"
                >
                  <CheckCheck className="h-3.5 w-3.5" />
                  <span>Admit All ({waitingParticipants.length})</span>
                </button>
              </div>
            )}

          </div>
        </div>
      )}
    </>
  );
};
