import React, { useState } from 'react';
import {
  FileText,
  Copy,
  Download,
  Check,
  Globe,
  PenTool,
  ShieldCheck,
  Sparkles,
  Lock,
} from 'lucide-react';
import { useStream } from '../../context/StreamContext';
import { useAuth } from '../../context/AuthContext';

export const SandboxedIframe: React.FC = () => {
  const { customEmbedUrl, setCustomEmbedUrl, meetingNotes, setMeetingNotes, isPresenterRole } = useStream();
  const { user } = useAuth();

  const isHost = user?.role === 'host' || isPresenterRole;
  const [activeTool, setActiveTool] = useState<'notes' | 'whiteboard' | 'custom_url'>('notes');
  const [copied, setCopied] = useState(false);

  const handleCopyNotes = () => {
    navigator.clipboard.writeText(meetingNotes);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadNotes = () => {
    const blob = new Blob([meetingNotes], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `meeting-notes-${new Date().toISOString().slice(0, 10)}.md`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="h-full flex flex-col justify-between bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden font-sans text-left">
      {/* Top Header & Tool Switcher */}
      <div className="p-2.5 bg-[#FAF9F6] border-b border-slate-200/80 flex flex-wrap items-center justify-between gap-2 shrink-0">
        <div className="flex items-center gap-1 bg-slate-100 p-0.5 rounded-xl border border-slate-200">
          <button
            type="button"
            onClick={() => setActiveTool('notes')}
            className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer ${
              activeTool === 'notes'
                ? 'bg-white text-slate-900 shadow-sm'
                : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            <FileText className="h-3.5 w-3.5 text-[#0084FF]" />
            <span>Shared Notes</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTool('whiteboard')}
            className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer ${
              activeTool === 'whiteboard'
                ? 'bg-white text-slate-900 shadow-sm'
                : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            <PenTool className="h-3.5 w-3.5 text-purple-600" />
            <span>Whiteboard</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTool('custom_url')}
            className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer ${
              activeTool === 'custom_url'
                ? 'bg-white text-slate-900 shadow-sm'
                : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            <Globe className="h-3.5 w-3.5 text-cyan-600" />
            <span>Custom App</span>
          </button>
        </div>

        {activeTool === 'notes' && (
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={handleCopyNotes}
              className="flex items-center gap-1 px-2.5 py-1 text-[11px] font-semibold text-slate-600 hover:text-slate-900 bg-white border border-slate-200 rounded-lg shadow-sm cursor-pointer transition-all"
              title="Copy all notes"
            >
              {copied ? (
                <>
                  <Check className="h-3 w-3 text-emerald-600" />
                  <span className="text-emerald-600">Copied</span>
                </>
              ) : (
                <>
                  <Copy className="h-3 w-3 text-slate-400" />
                  <span>Copy</span>
                </>
              )}
            </button>

            <button
              type="button"
              onClick={handleDownloadNotes}
              className="flex items-center gap-1 px-2.5 py-1 text-[11px] font-semibold text-slate-600 hover:text-slate-900 bg-white border border-slate-200 rounded-lg shadow-sm cursor-pointer transition-all"
              title="Download notes as markdown"
            >
              <Download className="h-3 w-3 text-slate-400" />
              <span>Export</span>
            </button>
          </div>
        )}
      </div>

      {/* Main Workspace Body */}
      <div className="flex-1 overflow-y-auto p-4 bg-slate-50/50 flex flex-col">
        {activeTool === 'notes' && (
          /* Live Shared Notes Editor / Viewer */
          <div className="flex-1 flex flex-col space-y-2">
            <div className="flex items-center justify-between text-[11px] text-slate-400 px-1">
              <span>{isHost ? 'Live Synchronized Meeting Notes (Markdown Editor)' : 'Host Synchronized Agenda & Notes'}</span>
              <span className="flex items-center gap-1 text-emerald-600 font-mono">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                Live Sync
              </span>
            </div>

            {isHost ? (
              <textarea
                value={meetingNotes}
                onChange={(e) => setMeetingNotes(e.target.value)}
                placeholder="Take meeting notes, write bullet points, or list action items here in real-time..."
                className="w-full flex-1 min-h-[300px] p-3.5 rounded-xl border border-slate-200 bg-white text-slate-800 text-xs font-mono leading-relaxed focus:outline-none focus:border-[#0084FF] shadow-sm resize-none"
              />
            ) : (
              /* Read-only view for Attendees */
              <div className="w-full flex-1 min-h-[300px] p-3.5 rounded-xl border border-slate-200 bg-white text-slate-800 text-xs font-mono leading-relaxed shadow-sm overflow-y-auto whitespace-pre-wrap select-text">
                {meetingNotes || 'No notes added yet by host.'}
              </div>
            )}
          </div>
        )}

        {activeTool === 'whiteboard' && (
          /* Interactive Collaborative Whiteboard */
          <div className="flex-1 flex flex-col space-y-2">
            <div className="flex items-center justify-between text-[11px] text-slate-500 px-1">
              <span>Live Collaborative Canvas (Excalidraw)</span>
              <span className="text-[10px] font-mono text-purple-600 bg-purple-50 px-2 py-0.5 rounded-full border border-purple-200">
                Interactive Drawing
              </span>
            </div>

            <div className="flex-1 min-h-[340px] rounded-xl border border-slate-200 bg-white overflow-hidden shadow-inner">
              <iframe
                src="https://excalidraw.com"
                title="Live Whiteboard"
                className="w-full h-full min-h-[340px] border-0"
                sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-modals"
              />
            </div>
          </div>
        )}

        {activeTool === 'custom_url' && (
          /* Custom Embed URL */
          <div className="flex-1 flex flex-col space-y-3">
            {isHost && (
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-slate-700">
                  Embed Web URL (Host Control)
                </label>
                <input
                  type="url"
                  value={customEmbedUrl}
                  onChange={(e) => setCustomEmbedUrl(e.target.value)}
                  placeholder="https://excalidraw.com or https://cal.com/yourname"
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-white text-slate-900 focus:outline-none focus:border-[#0084FF] font-mono"
                />
              </div>
            )}

            <div className="flex-1 min-h-[300px] rounded-xl border border-slate-200 bg-white overflow-hidden shadow-inner">
              <iframe
                src={customEmbedUrl || 'https://excalidraw.com'}
                title="Custom Embed"
                className="w-full h-full min-h-[300px] border-0"
                sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-modals"
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
