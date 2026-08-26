import React, { useState, useRef, useEffect } from 'react';
import {
  FileText,
  Copy,
  Download,
  Check,
  Globe,
  PenTool,
  Eraser,
  RotateCcw,
  Sparkles,
  Lock,
  Palette,
  Eye,
} from 'lucide-react';
import { useStream } from '../../context/StreamContext';
import { useAuth } from '../../context/AuthContext';

export const SandboxedIframe: React.FC = () => {
  const { customEmbedUrl, setCustomEmbedUrl, meetingNotes, setMeetingNotes, isPresenterRole } = useStream();
  const { user } = useAuth();

  const isHost = user?.role === 'host' || isPresenterRole;
  const [activeTool, setActiveTool] = useState<'notes' | 'whiteboard' | 'custom_url'>('notes');
  const [copied, setCopied] = useState(false);

  // Whiteboard Canvas State
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [brushColor, setBrushColor] = useState('#0084FF');
  const [brushWidth, setBrushWidth] = useState(3);
  const [isEraser, setIsEraser] = useState(false);

  const colors = ['#0F172A', '#0084FF', '#8B5CF6', '#10B981', '#EF4444', '#F59E0B'];

  // Initialize Canvas
  useEffect(() => {
    if (activeTool !== 'whiteboard') return;
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas dimensions
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * window.devicePixelRatio || 800;
    canvas.height = rect.height * window.devicePixelRatio || 500;
    ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    // White background
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, rect.width, rect.height);
  }, [activeTool]);

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    ctx.beginPath();
    ctx.moveTo(x, y);
    setIsDrawing(true);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    ctx.strokeStyle = isEraser ? '#FFFFFF' : brushColor;
    ctx.lineWidth = isEraser ? brushWidth * 4 : brushWidth;
    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const rect = canvas.getBoundingClientRect();
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, rect.width, rect.height);
  };

  const handleDownloadDrawing = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const link = document.createElement('a');
    link.download = `whiteboard-${Date.now()}.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
  };

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

        {/* Notes Export Controls */}
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

        {/* Whiteboard Controls */}
        {activeTool === 'whiteboard' && (
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={clearCanvas}
              className="flex items-center gap-1 px-2.5 py-1 text-[11px] font-semibold text-slate-600 hover:text-rose-600 bg-white border border-slate-200 rounded-lg shadow-sm cursor-pointer transition-all"
              title="Clear Whiteboard"
            >
              <RotateCcw className="h-3 w-3" />
              <span>Clear</span>
            </button>

            <button
              type="button"
              onClick={handleDownloadDrawing}
              className="flex items-center gap-1 px-2.5 py-1 text-[11px] font-semibold text-slate-600 hover:text-slate-900 bg-white border border-slate-200 rounded-lg shadow-sm cursor-pointer transition-all"
              title="Save Whiteboard Drawing as PNG"
            >
              <Download className="h-3 w-3" />
              <span>Save PNG</span>
            </button>
          </div>
        )}
      </div>

      {/* Main Workspace Body */}
      <div className="flex-1 overflow-hidden p-3 bg-slate-50/50 flex flex-col">
        
        {/* 1. Live Shared Notes */}
        {activeTool === 'notes' && (
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
              <div className="w-full flex-1 min-h-[300px] p-3.5 rounded-xl border border-slate-200 bg-white text-slate-800 text-xs font-mono leading-relaxed shadow-sm overflow-y-auto whitespace-pre-wrap select-text">
                {meetingNotes || 'No notes added yet by host.'}
              </div>
            )}
          </div>
        )}

        {/* 2. Luxury Built-In Interactive Whiteboard Canvas */}
        {activeTool === 'whiteboard' && (
          <div className="flex-1 flex flex-col space-y-2">
            {/* Whiteboard Floating Toolbar */}
            <div className="p-2 bg-white rounded-xl border border-slate-200 shadow-sm flex flex-wrap items-center justify-between gap-2 shrink-0">
              {/* Color Palette */}
              <div className="flex items-center gap-1.5">
                {colors.map((c) => (
                  <button
                    key={c}
                    type="button"
                    onClick={() => {
                      setBrushColor(c);
                      setIsEraser(false);
                    }}
                    className={`h-5 w-5 rounded-full border transition-all cursor-pointer ${
                      brushColor === c && !isEraser
                        ? 'scale-125 border-slate-900 shadow-sm'
                        : 'border-white hover:scale-110'
                    }`}
                    style={{ backgroundColor: c }}
                  />
                ))}
              </div>

              {/* Tools & Stroke Width */}
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => setIsEraser(false)}
                  className={`p-1.5 rounded-lg text-xs font-semibold flex items-center gap-1 transition-all cursor-pointer ${
                    !isEraser
                      ? 'bg-[#0084FF] text-white shadow-sm'
                      : 'text-slate-600 hover:bg-slate-100'
                  }`}
                  title="Draw Tool"
                >
                  <PenTool className="h-3.5 w-3.5" />
                </button>

                <button
                  type="button"
                  onClick={() => setIsEraser(true)}
                  className={`p-1.5 rounded-lg text-xs font-semibold flex items-center gap-1 transition-all cursor-pointer ${
                    isEraser
                      ? 'bg-purple-600 text-white shadow-sm'
                      : 'text-slate-600 hover:bg-slate-100'
                  }`}
                  title="Eraser Tool"
                >
                  <Eraser className="h-3.5 w-3.5" />
                </button>

                {/* Stroke Size */}
                <div className="flex items-center gap-1 pl-2 border-l border-slate-200">
                  {[2, 4, 8].map((size) => (
                    <button
                      key={size}
                      type="button"
                      onClick={() => setBrushWidth(size)}
                      className={`h-6 w-6 rounded-lg flex items-center justify-center cursor-pointer transition-all ${
                        brushWidth === size ? 'bg-slate-200' : 'hover:bg-slate-100'
                      }`}
                    >
                      <span
                        className="rounded-full bg-slate-800"
                        style={{ width: `${size * 1.5}px`, height: `${size * 1.5}px` }}
                      />
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Canvas Surface */}
            <div className="flex-1 min-h-[340px] rounded-xl border border-slate-200 bg-white overflow-hidden shadow-inner relative cursor-crosshair">
              <canvas
                ref={canvasRef}
                onMouseDown={startDrawing}
                onMouseMove={draw}
                onMouseUp={stopDrawing}
                onMouseLeave={stopDrawing}
                className="w-full h-full block touch-none"
              />
            </div>
          </div>
        )}

        {/* 3. Custom App Embed */}
        {activeTool === 'custom_url' && (
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
