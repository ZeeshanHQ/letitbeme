import React, { useState } from 'react';
import {
  Globe,
  ExternalLink,
  ShieldCheck,
  Layers,
  Sparkles,
  MousePointerClick,
  CheckCircle2,
  Lock,
  Code2,
  Calendar,
  Play,
  RotateCcw,
} from 'lucide-react';
import { useStream } from '../../context/StreamContext';
import { Button } from '../common/Button';

export const SandboxedIframe: React.FC = () => {
  const { customEmbedUrl, setCustomEmbedUrl } = useStream();
  const [sandboxMode, setSandboxMode] = useState<'app_demo' | 'embed'>('app_demo');
  const [demoState, setDemoState] = useState<'editor' | 'preview'>('preview');
  const [codeValue, setCodeValue] = useState(`// In-Stream Interactive App Sandbox
export default function LiveDemo() {
  const [attendees, setAttendees] = useState(1428);
  const [conversion, setConversion] = useState('22.4%');
  
  return (
    <div className="p-4 bg-white rounded-2xl border">
      <h3 className="font-bold">WebRTC High-Yield Funnel</h3>
      <p>Latency: &lt;85ms | 0% Churn</p>
    </div>
  );
}`);

  return (
    <div className="h-full flex flex-col justify-between bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden font-sans text-left">
      
      {/* Top Address & Sandbox Mode Selector */}
      <div className="p-2.5 bg-[#FAF9F6] border-b border-slate-200/80 flex items-center justify-between gap-2 shrink-0">
        <div className="flex items-center gap-1.5 bg-slate-100 p-0.5 rounded-xl border border-slate-200">
          <button
            type="button"
            onClick={() => setSandboxMode('app_demo')}
            className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              sandboxMode === 'app_demo'
                ? 'bg-white text-obsidian shadow-sm'
                : 'text-slate-500 hover:text-obsidian'
            }`}
          >
            Built-in Live App
          </button>

          <button
            type="button"
            onClick={() => setSandboxMode('embed')}
            className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              sandboxMode === 'embed'
                ? 'bg-white text-obsidian shadow-sm'
                : 'text-slate-500 hover:text-obsidian'
            }`}
          >
            Custom Web URL
          </button>
        </div>

        <div className="flex items-center gap-1.5 text-[10px] font-mono text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
          <ShieldCheck className="h-3 w-3" />
          <span>Zero-Redirect Sandbox</span>
        </div>
      </div>

      {/* Main Sandbox Interactive Area */}
      <div className="flex-1 overflow-y-auto p-4 bg-slate-50/50">
        {sandboxMode === 'app_demo' ? (
          /* Real Built-in Interactive Product Sandbox */
          <div className="h-full flex flex-col justify-between space-y-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-solar-50 text-solar-700 border border-solar-200">
                    LIVE PRODUCT SANDBOX
                  </span>
                  <h4 className="text-sm font-heading font-bold text-obsidian tracking-tight pt-1">
                    Interactive Video App Test-Drive
                  </h4>
                </div>

                <div className="flex items-center gap-1 bg-white p-0.5 rounded-lg border border-slate-200 text-xs">
                  <button
                    type="button"
                    onClick={() => setDemoState('preview')}
                    className={`px-2 py-0.5 rounded font-semibold ${
                      demoState === 'preview' ? 'bg-solar-500 text-white shadow-sm' : 'text-slate-500'
                    }`}
                  >
                    UI Preview
                  </button>
                  <button
                    type="button"
                    onClick={() => setDemoState('editor')}
                    className={`px-2 py-0.5 rounded font-semibold ${
                      demoState === 'editor' ? 'bg-solar-500 text-white shadow-sm' : 'text-slate-500'
                    }`}
                  >
                    Code
                  </button>
                </div>
              </div>

              {demoState === 'preview' ? (
                /* Interactive UI Component */
                <div className="p-4 bg-white rounded-2xl border border-slate-200/90 shadow-sm space-y-3">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-obsidian">Live Stream Telemetry Node</span>
                    <span className="text-[10px] font-mono text-emerald-600 font-bold">● Active 1080p60</span>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-xs font-mono">
                    <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200">
                      <span className="text-[10px] text-slate-400 block">Sub-Second RTT</span>
                      <strong className="text-obsidian text-sm">78ms</strong>
                    </div>
                    <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200">
                      <span className="text-[10px] text-slate-400 block">In-Stream GMV</span>
                      <strong className="text-solar-600 text-sm">$173,528</strong>
                    </div>
                  </div>

                  <div className="p-3 rounded-xl bg-solar-50/70 border border-solar-100 text-xs text-obsidian flex items-center justify-between">
                    <span>Attendees can test this live without leaving stream</span>
                    <CheckCircle2 className="h-4 w-4 text-solar-500" />
                  </div>
                </div>
              ) : (
                /* Code Editor Sandbox */
                <div className="rounded-2xl border border-slate-300 bg-obsidian p-3 font-mono text-xs text-emerald-400 overflow-x-auto shadow-inner">
                  <textarea
                    value={codeValue}
                    onChange={(e) => setCodeValue(e.target.value)}
                    rows={7}
                    className="w-full bg-transparent border-none focus:outline-none text-xs text-solar-300 font-mono resize-none leading-relaxed"
                  />
                </div>
              )}
            </div>

            <div className="p-2.5 rounded-xl bg-white border border-slate-200 text-[11px] text-slate-500 flex items-center justify-between">
              <span>Try clicking buttons or editing code above in real-time</span>
              <span className="font-mono text-solar-600 font-bold">&lt;85ms Sync</span>
            </div>
          </div>
        ) : (
          /* Custom Embed URL Frame with Fallback Protection */
          <div className="h-full flex flex-col justify-between space-y-3">
            <div className="space-y-2">
              <label className="block text-xs font-semibold text-slate-700">
                Embed Web App URL
              </label>
              <input
                type="url"
                value={customEmbedUrl}
                onChange={(e) => setCustomEmbedUrl(e.target.value)}
                placeholder="https://excalidraw.com or https://play.tailwindcss.com"
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-white text-obsidian focus:outline-none focus:border-solar-500 font-mono"
              />
            </div>

            <div className="flex-1 min-h-[180px] rounded-xl border border-slate-200 bg-white overflow-hidden shadow-inner flex items-center justify-center">
              <iframe
                src={customEmbedUrl || 'https://excalidraw.com'}
                title="Live Sandboxed App"
                className="w-full h-full border-0"
                sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-modals"
              />
            </div>
          </div>
        )}
      </div>

    </div>
  );
};
