import React from 'react';
import { Radio, ArrowRight, Home, VideoOff, RefreshCw } from 'lucide-react';

interface RoomNotFoundProps {
  roomSlug: string;
  onGoHome: () => void;
  onCreateMeeting: () => void;
}

export const RoomNotFound: React.FC<RoomNotFoundProps> = ({
  roomSlug,
  onGoHome,
  onCreateMeeting,
}) => {
  return (
    <div className="min-h-[calc(100vh-4rem)] bg-[#FAF9F6] p-4 flex items-center justify-center font-sans select-none">
      <div className="max-w-md w-full bg-white rounded-3xl border border-slate-200/90 shadow-2xl p-8 sm:p-10 text-center space-y-6 animate-slide-up relative overflow-hidden">
        
        {/* Decorative background glow */}
        <div className="absolute -top-16 -left-16 w-32 h-32 bg-blue-500/10 rounded-full blur-2xl pointer-events-none" />
        <div className="absolute -bottom-16 -right-16 w-32 h-32 bg-indigo-500/10 rounded-full blur-2xl pointer-events-none" />

        {/* Icon */}
        <div className="relative mx-auto w-20 h-20 rounded-3xl bg-slate-50 border border-slate-200/80 flex items-center justify-center shadow-inner">
          <div className="h-12 w-12 rounded-2xl bg-blue-50 border border-blue-200 flex items-center justify-center text-[#0084FF]">
            <VideoOff className="h-6 w-6" />
          </div>
        </div>

        {/* Text Details */}
        <div className="space-y-2">
          <span className="text-[11px] font-mono font-bold text-rose-600 bg-rose-50 px-3 py-1 rounded-full border border-rose-200 inline-block uppercase tracking-wider">
            Room Not Found
          </span>
          <h2 className="text-2xl font-heading font-bold text-slate-900 tracking-tight">
            Meeting Link Inactive
          </h2>
          <p className="text-xs text-slate-500 font-light leading-relaxed">
            The meeting room <code className="text-[#0084FF] font-mono font-semibold px-1.5 py-0.5 bg-blue-50 rounded-md">letitbe.me/@{roomSlug || 'unknown'}</code> was rotated, ended by the host, or does not exist.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3 pt-2">
          <button
            type="button"
            onClick={onCreateMeeting}
            className="w-full py-3 px-4 rounded-xl bg-[#0084FF] hover:bg-[#0074E0] text-white text-xs font-semibold flex items-center justify-center gap-2 shadow-md shadow-blue-500/20 transition-all cursor-pointer"
          >
            <span>Start Your Own Free Meeting</span>
            <ArrowRight className="h-4 w-4" />
          </button>

          <button
            type="button"
            onClick={onGoHome}
            className="w-full py-2.5 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer border border-slate-200"
          >
            <Home className="h-3.5 w-3.5" />
            <span>Return to Homepage</span>
          </button>
        </div>

      </div>
    </div>
  );
};
