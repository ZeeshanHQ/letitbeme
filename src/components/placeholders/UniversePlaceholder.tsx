import React from 'react';
import { Compass, FileText, Database, Lock, Sparkles, Layers } from 'lucide-react';

export const UniversePlaceholder: React.FC = () => {
  return (
    <div className="p-6 sm:p-8 max-w-4xl mx-auto space-y-8 select-none font-sans">
      <div className="text-center space-y-3 py-8">
        <div className="h-16 w-16 rounded-3xl bg-blue-600/10 border border-blue-500/20 text-blue-400 flex items-center justify-center mx-auto shadow-2xl">
          <Compass className="h-8 w-8" />
        </div>

        <h1 className="text-2xl font-bold text-white font-heading">
          Universe • Digital Body of Work
        </h1>

        <p className="text-xs text-slate-400 max-w-lg mx-auto leading-relaxed">
          Your private, semantically searchable digital library. Eliminates traditional nested folders in favor of AI-retrieved metadata, embeddings, and natural language synthesis.
        </p>

        <span className="inline-block px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-mono font-bold">
          Scheduled for Phase 2 Milestone
        </span>
      </div>

      {/* Architectural Principles Card */}
      <div className="p-6 sm:p-8 rounded-3xl bg-[#0F141E] border border-slate-800 space-y-4">
        <h3 className="text-sm font-bold text-white font-heading">
          Architectural Blueprint & Tenancy Isolation
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-1.5">
            <div className="flex items-center gap-2 text-xs font-bold text-slate-200">
              <FileText className="h-4 w-4 text-blue-400" />
              <span>Multi-Modal Ingestion</span>
            </div>
            <p className="text-[11px] text-slate-400 leading-relaxed font-sans">
              PDFs, documents, voice memos, code repositories, Google Drive imports, and private records.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-1.5">
            <div className="flex items-center gap-2 text-xs font-bold text-slate-200">
              <Lock className="h-4 w-4 text-emerald-400" />
              <span>Zero Cross-Member Mixing</span>
            </div>
            <p className="text-[11px] text-slate-400 leading-relaxed font-sans">
              Each member's embeddings and file indexes are cryptographically isolated with Row-Level Security.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
