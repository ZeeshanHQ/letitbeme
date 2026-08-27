import React from 'react';
import { MessageSquare, Shield, Lock, Send, UserCheck } from 'lucide-react';

export const MessagesPlaceholder: React.FC = () => {
  return (
    <div className="p-6 sm:p-8 max-w-4xl mx-auto space-y-8 select-none font-sans">
      <div className="text-center space-y-3 py-8">
        <div className="h-16 w-16 rounded-3xl bg-indigo-600/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center mx-auto shadow-2xl">
          <MessageSquare className="h-8 w-8" />
        </div>

        <h1 className="text-2xl font-bold text-white font-heading">
          Private Executive Messaging
        </h1>

        <p className="text-xs text-slate-400 max-w-lg mx-auto leading-relaxed">
          Direct, encrypted member-to-member communication channels with your approved professional network.
        </p>

        <span className="inline-block px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-mono font-bold">
          Scheduled for Phase 2 Milestone
        </span>
      </div>

      <div className="p-6 sm:p-8 rounded-3xl bg-[#0F141E] border border-slate-800 space-y-4">
        <h3 className="text-sm font-bold text-white font-heading">
          Security & Privacy Foundation
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-1.5">
            <div className="flex items-center gap-2 text-xs font-bold text-slate-200">
              <Shield className="h-4 w-4 text-indigo-400" />
              <span>Permission-Gated Outreach</span>
            </div>
            <p className="text-[11px] text-slate-400 leading-relaxed font-sans">
              Only mutually connected members can initiate private conversation threads.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-1.5">
            <div className="flex items-center gap-2 text-xs font-bold text-slate-200">
              <Lock className="h-4 w-4 text-emerald-400" />
              <span>Zero Unsolicited Inbound Spam</span>
            </div>
            <p className="text-[11px] text-slate-400 leading-relaxed font-sans">
              No cold mass-messaging or third-party ad networks will ever have access to member inboxes.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
