import React, { useState } from 'react';
import {
  Mic,
  MicOff,
  Video,
  VideoOff,
  MonitorUp,
  Radio,
  Sparkles,
  Layers,
  Settings,
  Share2,
  Tv,
  Globe,
  Sliders,
  Send,
  Check,
  ChevronDown,
  ChevronUp,
  Maximize2,
  Minimize2,
} from 'lucide-react';
import { useStream } from '../../context/StreamContext';
import { LanguageSelector } from './LanguageSelector';
import { WidgetTriggerModal } from './WidgetTriggerModal';
import { Button } from '../common/Button';

interface PresenterControlBarProps {
  onOpenReferral?: () => void;
}

export const PresenterControlBar: React.FC<PresenterControlBarProps> = ({ onOpenReferral }) => {
  const {
    isLive,
    toggleLiveStatus,
    isMicOn,
    toggleMic,
    isCamOn,
    toggleCam,
    isScreenSharing,
    toggleScreenShare,
    layoutMode,
    setLayoutMode,
    activeWidget,
  } = useStream();

  const [isWidgetModalOpen, setIsWidgetModalOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <>
      {/* Floating Bottom Control Dock Container */}
      <div className="fixed bottom-4 inset-x-0 z-40 flex justify-center px-4 pointer-events-none font-sans">
        {isCollapsed ? (
          /* MINIMAL FLOATING BALL DOCK (When Collapsed: Zero Overlap on Chat/Input) */
          <div className="pointer-events-auto bg-obsidian/90 backdrop-blur-2xl border border-white/20 shadow-[0_12px_36px_rgba(0,0,0,0.3)] px-4 py-2 rounded-full flex items-center gap-3 animate-fade-in text-white cursor-pointer hover:scale-105 transition-all">
            <button
              type="button"
              onClick={toggleMic}
              className={`p-1.5 rounded-full transition-all ${
                isMicOn ? 'text-emerald-400' : 'text-rose-500'
              }`}
              title={isMicOn ? 'Mic On' : 'Mic Off'}
            >
              {isMicOn ? <Mic className="h-4 w-4" /> : <MicOff className="h-4 w-4" />}
            </button>

            <button
              type="button"
              onClick={toggleCam}
              className={`p-1.5 rounded-full transition-all ${
                isCamOn ? 'text-emerald-400' : 'text-rose-500'
              }`}
              title={isCamOn ? 'Cam On' : 'Cam Off'}
            >
              {isCamOn ? <Video className="h-4 w-4" /> : <VideoOff className="h-4 w-4" />}
            </button>

            {isScreenSharing && (
              <span className="h-2 w-2 rounded-full bg-blue-500 animate-pulse" title="Screen sharing active" />
            )}

            <div className="h-4 w-px bg-white/20" />

            <button
              type="button"
              onClick={() => setIsCollapsed(false)}
              className="flex items-center gap-1.5 text-xs font-semibold text-solar-400 hover:text-white transition-colors"
              title="Expand Studio Controls"
            >
              <Sliders className="h-3.5 w-3.5" />
              <span>Studio Controls</span>
              <ChevronUp className="h-3.5 w-3.5 text-solar-400" />
            </button>
          </div>
        ) : (
          /* FULL STUDIO FLOATING GLASS DOCK (With 1-Click Roll-Up / Minimize Button) */
          <div className="pointer-events-auto max-w-4xl bg-white/95 backdrop-blur-2xl border border-slate-200/90 shadow-[0_20px_50px_-10px_rgba(0,0,0,0.18)] p-2 sm:p-2.5 rounded-full flex flex-wrap items-center justify-between gap-3 animate-slide-up">
            
            {/* Group 1: AV Controls */}
            <div className="flex items-center gap-1.5 border-r border-slate-200/80 pr-3">
              <button
                type="button"
                onClick={toggleMic}
                className={`p-2 rounded-full transition-all flex items-center justify-center cursor-pointer ${
                  isMicOn
                    ? 'bg-slate-100 hover:bg-slate-200 text-obsidian'
                    : 'bg-rose-50 hover:bg-rose-100 text-rose-600 border border-rose-200'
                }`}
                title={isMicOn ? 'Mute Microphone' : 'Unmute Microphone'}
              >
                {isMicOn ? <Mic className="h-4 w-4" /> : <MicOff className="h-4 w-4" />}
              </button>

              <button
                type="button"
                onClick={toggleCam}
                className={`p-2 rounded-full transition-all flex items-center justify-center cursor-pointer ${
                  isCamOn
                    ? 'bg-slate-100 hover:bg-slate-200 text-obsidian'
                    : 'bg-rose-50 hover:bg-rose-100 text-rose-600 border border-rose-200'
                }`}
                title={isCamOn ? 'Turn Off Camera' : 'Turn On Camera'}
              >
                {isCamOn ? <Video className="h-4 w-4" /> : <VideoOff className="h-4 w-4" />}
              </button>

              <button
                type="button"
                onClick={toggleScreenShare}
                className={`p-2 rounded-full transition-all flex items-center justify-center cursor-pointer ${
                  isScreenSharing
                    ? 'bg-solar-500 text-white shadow-solar-sm'
                    : 'bg-slate-100 hover:bg-slate-200 text-obsidian'
                }`}
                title={isScreenSharing ? 'Stop Screen Share' : 'Share Screen'}
              >
                <MonitorUp className="h-4 w-4" />
              </button>
            </div>

            {/* Group 2: Live Interactive Widget Trigger */}
            <div className="flex items-center gap-2">
              <Button
                variant="primary"
                size="sm"
                onClick={() => setIsWidgetModalOpen(true)}
                className="rounded-full font-semibold shadow-solar-sm text-xs"
                leftIcon={<Sparkles className="h-3.5 w-3.5" />}
              >
                Push Interactive Layer
              </Button>

              <LanguageSelector />
            </div>

            {/* Group 3: Layout presets (Split / PiP / Focus) */}
            <div className="hidden md:flex items-center gap-1 bg-slate-100 p-1 rounded-full border border-slate-200">
              <button
                onClick={() => setLayoutMode('split')}
                className={`px-3 py-1 text-xs font-semibold rounded-full transition-all cursor-pointer ${
                  layoutMode === 'split'
                    ? 'bg-white text-obsidian shadow-sm'
                    : 'text-slate-500 hover:text-obsidian'
                }`}
                title="Split 60/40 View"
              >
                Split
              </button>
              <button
                onClick={() => setLayoutMode('pip')}
                className={`px-3 py-1 text-xs font-semibold rounded-full transition-all cursor-pointer ${
                  layoutMode === 'pip'
                    ? 'bg-white text-obsidian shadow-sm'
                    : 'text-slate-500 hover:text-obsidian'
                }`}
                title="Picture-in-Picture Mode"
              >
                PiP
              </button>
              <button
                onClick={() => setLayoutMode('focus')}
                className={`px-3 py-1 text-xs font-semibold rounded-full transition-all cursor-pointer ${
                  layoutMode === 'focus'
                    ? 'bg-white text-obsidian shadow-sm'
                    : 'text-slate-500 hover:text-obsidian'
                }`}
                title="Fullscreen Focus Stage"
              >
                Focus
              </button>
            </div>

            {/* Group 4: Minimize Dock & End Stream */}
            <div className="flex items-center gap-2 border-l border-slate-200/80 pl-3">
              <button
                type="button"
                onClick={() => setIsCollapsed(true)}
                className="p-2 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 transition-all cursor-pointer"
                title="Minimize Control Bar into Floating Ball"
              >
                <ChevronDown className="h-4 w-4" />
              </button>

              <button
                type="button"
                onClick={toggleLiveStatus}
                className={`px-4 py-2 rounded-full text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer ${
                  isLive
                    ? 'bg-rose-500 hover:bg-rose-600 text-white shadow-md'
                    : 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-md'
                }`}
              >
                <Radio className="h-3.5 w-3.5" />
                <span>{isLive ? 'End Stream' : 'Go Live'}</span>
              </button>
            </div>

          </div>
        )}
      </div>

      {/* Widget Trigger Modal */}
      <WidgetTriggerModal
        isOpen={isWidgetModalOpen}
        onClose={() => setIsWidgetModalOpen(false)}
      />
    </>
  );
};
