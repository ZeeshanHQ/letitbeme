import React from 'react';
import {
  X,
  Download,
  Trash2,
  CheckCircle2,
  Video,
  HardDrive,
} from 'lucide-react';

interface RecordingDownloadModalProps {
  isOpen: boolean;
  videoBlobUrl: string | null;
  recordingDuration: number;
  onClose: () => void;
  onDelete: () => void;
}

export const RecordingDownloadModal: React.FC<RecordingDownloadModalProps> = ({
  isOpen,
  videoBlobUrl,
  recordingDuration,
  onClose,
  onDelete,
}) => {
  if (!isOpen || !videoBlobUrl) return null;

  const formatDuration = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const s = secs % 60;
    return `${mins.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const handleDownload = () => {
    const a = document.createElement('a');
    a.href = videoBlobUrl;
    a.download = `letitbeme-meeting-recording-${new Date().toISOString().slice(0, 10)}.webm`;
    document.body.appendChild(a);
    a.click();
    setTimeout(() => {
      document.body.removeChild(a);
    }, 100);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-md flex items-center justify-center p-4 animate-fade-in font-['Plus_Jakarta_Sans',sans-serif]">
      <div className="bg-white rounded-3xl border border-slate-200/90 shadow-2xl max-w-lg w-full p-6 sm:p-8 space-y-5 animate-slide-up relative text-left">
        
        {/* Close button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-6 right-6 p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-all cursor-pointer"
        >
          <X className="h-4 w-4" />
        </button>

        <div className="space-y-1">
          <div className="flex items-center gap-2.5">
            <div className="h-9 w-9 rounded-2xl bg-rose-50 border border-rose-200 flex items-center justify-center text-rose-600 font-bold">
              <Video className="h-4 w-4" />
            </div>
            <div>
              <h3 className="text-lg font-heading font-bold text-[#0f172a] tracking-tight">
                Meeting Recording Ready
              </h3>
              <p className="text-xs text-slate-500 font-normal">
                Duration: {formatDuration(recordingDuration)} • 1080p HD WebM Format
              </p>
            </div>
          </div>
        </div>

        {/* Video Preview */}
        <div className="rounded-2xl overflow-hidden bg-slate-950 border border-slate-800 aspect-video shadow-inner flex items-center justify-center">
          <video
            src={videoBlobUrl}
            controls
            className="w-full h-full object-contain"
          />
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row items-center gap-2.5 pt-1">
          <button
            type="button"
            onClick={handleDownload}
            className="w-full sm:flex-1 py-3 px-4 rounded-2xl bg-[#0084FF] hover:bg-[#0074E0] text-white text-xs font-semibold flex items-center justify-center gap-2 shadow-md shadow-blue-500/20 cursor-pointer transition-all"
          >
            <Download className="h-4 w-4" />
            <span>Download Video (.webm)</span>
          </button>

          <button
            type="button"
            onClick={() => {
              onDelete();
              onClose();
            }}
            className="w-full sm:w-auto py-3 px-4 rounded-2xl bg-slate-100 hover:bg-rose-50 hover:text-rose-600 text-slate-600 text-xs font-semibold flex items-center justify-center gap-1.5 transition-all border border-slate-200 cursor-pointer"
            title="Delete temporary recording from memory and cloud"
          >
            <Trash2 className="h-4 w-4" />
            <span>Delete</span>
          </button>
        </div>

        <div className="text-[11px] text-slate-400 flex items-center gap-1.5 pt-1">
          <HardDrive className="h-3.5 w-3.5 text-slate-400 shrink-0" />
          <span>Local high-fidelity capture • 0 cloud storage cut</span>
        </div>

      </div>
    </div>
  );
};
