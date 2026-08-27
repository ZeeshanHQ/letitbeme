import React from 'react';
import { Sparkles, Cpu, Bot, CheckCircle2, ShieldAlert, Key } from 'lucide-react';

export const AiWorkspacePlaceholder: React.FC = () => {
  return (
    <div className="p-6 sm:p-8 max-w-4xl mx-auto space-y-8 select-none font-sans">
      <div className="text-center space-y-3 py-8">
        <div className="h-16 w-16 rounded-3xl bg-purple-600/10 border border-purple-500/20 text-purple-400 flex items-center justify-center mx-auto shadow-2xl">
          <Sparkles className="h-8 w-8" />
        </div>

        <h1 className="text-2xl font-bold text-white font-heading">
          AI Intelligence & Synthesis Layer
        </h1>

        <p className="text-xs text-slate-400 max-w-lg mx-auto leading-relaxed">
          Server-side Claude, OpenAI, and Grok multi-model reasoning engines designed to analyze your body of work, match prospects, and draft relationship-first outreach.
        </p>

        <span className="inline-block px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-400 text-xs font-mono font-bold">
          Scheduled for Phase 2 Milestone
        </span>
      </div>

      <div className="p-6 sm:p-8 rounded-3xl bg-[#0F141E] border border-slate-800 space-y-4">
        <h3 className="text-sm font-bold text-white font-heading">
          Core AI Governance Principles
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-1.5">
            <div className="flex items-center gap-2 text-xs font-bold text-slate-200">
              <CheckCircle2 className="h-4 w-4 text-purple-400" />
              <span>Mandatory Human Approval</span>
            </div>
            <p className="text-[11px] text-slate-400 leading-relaxed font-sans">
              No outreach, message, or external action is ever dispatched autonomously without explicit member review.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-1.5">
            <div className="flex items-center gap-2 text-xs font-bold text-slate-200">
              <Key className="h-4 w-4 text-emerald-400" />
              <span>Zero Client Key Exposure</span>
            </div>
            <p className="text-[11px] text-slate-400 leading-relaxed font-sans">
              All provider keys and model endpoints run strictly through secure backend orchestration with rate limits and auditing.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
