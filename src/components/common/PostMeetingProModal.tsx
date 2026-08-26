import React from 'react';
import {
  X,
  Crown,
  CheckCircle2,
  Download,
  Video,
  Globe2,
  ArrowRight,
  Sparkles,
  Lock,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useStream } from '../../context/StreamContext';

interface PostMeetingProModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PostMeetingProModal: React.FC<PostMeetingProModalProps> = ({ isOpen, onClose }) => {
  const { user, upgradeToPro } = useAuth();
  const { streamDuration, viewerCount } = useStream();

  if (!isOpen) return null;

  const isPro = Boolean(user?.isPro);

  const formatDuration = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const s = secs % 60;
    return `${mins}m ${s}s`;
  };

  const handleUpgrade = async () => {
    await upgradeToPro();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-md flex items-center justify-center p-4 animate-fade-in font-sans">
      <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-lg w-full p-6 sm:p-8 space-y-6 animate-slide-up relative text-left">
        
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-6 right-6 p-2 rounded-xl text-slate-400 hover:text-slate-900 hover:bg-slate-100 transition-all cursor-pointer"
        >
          <X className="h-4 w-4" />
        </button>

        {/* Header & Session Summary */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-xs font-mono font-bold text-[#0084FF]">
              <Sparkles className="h-3.5 w-3.5" />
              <span>SESSION CONCLUDED</span>
            </span>
          </div>

          <h3 className="text-2xl font-heading font-bold text-slate-900 tracking-tight">
            Great meeting, {user?.fullName || 'Host'}!
          </h3>

          {/* Session Metrics Bar */}
          <div className="grid grid-cols-2 gap-3 p-3.5 bg-slate-50 rounded-2xl border border-slate-200/90 text-xs font-mono">
            <div>
              <span className="text-slate-400 text-[10px] uppercase block">Meeting Duration</span>
              <strong className="text-slate-900 text-sm">{formatDuration(streamDuration)}</strong>
            </div>
            <div>
              <span className="text-slate-400 text-[10px] uppercase block">Total Attendees</span>
              <strong className="text-slate-900 text-sm">{viewerCount} Joined</strong>
            </div>
          </div>
        </div>

        {/* Pro Plan Pitch */}
        {!isPro ? (
          <div className="p-5 rounded-2xl bg-gradient-to-br from-blue-50/80 via-white to-indigo-50/50 border border-blue-200 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-bold text-[#0084FF] uppercase tracking-wider flex items-center gap-1.5">
                <Crown className="h-4 w-4 fill-[#0084FF] text-[#0084FF]" />
                <span>Unlock LetItBeMe Pro</span>
              </span>
              <span className="text-sm font-heading font-bold text-slate-900">
                Only $19.99<span className="text-xs font-normal text-slate-500 font-mono">/mo</span>
              </span>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              Never lose your sessions. Upgrade to Pro to unlock unlimited 1080p cloud recordings, AI multi-language translation, and custom verified handles.
            </p>

            <ul className="space-y-2 text-xs text-slate-700">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-[#0084FF] shrink-0" />
                <span>Full HD Cloud Recording Replays &amp; Downloads</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-[#0084FF] shrink-0" />
                <span>AI Live Translation Subtitles in 9+ Languages</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-[#0084FF] shrink-0" />
                <span>Custom Verified Channel Link (<code>letitbe.me/@yourname</code>)</span>
              </li>
            </ul>

            <button
              type="button"
              onClick={handleUpgrade}
              className="w-full py-3 px-4 rounded-xl bg-[#0084FF] hover:bg-[#0074E0] text-white text-xs font-semibold flex items-center justify-center gap-2 shadow-md shadow-blue-500/20 cursor-pointer transition-all"
            >
              <Lock className="h-3.5 w-3.5" />
              <span>Upgrade to Pro — Only $19.99/month</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </div>
        ) : (
          <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-xs space-y-2">
            <div className="flex items-center gap-2 text-emerald-800 font-bold">
              <CheckCircle2 className="h-4 w-4 text-emerald-600" />
              <span>Pro Plan Active</span>
            </div>
            <p className="text-emerald-700 leading-relaxed">
              Your HD cloud recording is being processed and will be available for download in your presenter dashboard.
            </p>
          </div>
        )}

        {/* Footer actions */}
        <div className="flex items-center justify-end gap-3 pt-2 border-t border-slate-100">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold cursor-pointer transition-all"
          >
            Done
          </button>
        </div>

      </div>
    </div>
  );
};
