import React, { useState } from 'react';
import {
  Radio,
  Sparkles,
  Users,
  Settings,
  Shield,
  Layers,
  MessageSquare,
  BarChart3,
  CreditCard,
  Globe,
  MonitorPlay,
  Send,
  Pin,
  Sliders,
  Copy,
  Check,
  ExternalLink,
  Share2,
  Maximize2,
  Tv,
  Video,
} from 'lucide-react';
import { useStream } from '../../context/StreamContext';
import { useAuth } from '../../context/AuthContext';
import { LiveAudienceMetrics } from './LiveAudienceMetrics';
import { StreamBuilderModal } from './StreamBuilderModal';
import { VideoPlayer } from '../stage/VideoPlayer';
import { InteractiveLayer } from '../interactive/InteractiveLayer';
import { LiveChat } from '../stage/LiveChat';
import { Button } from '../common/Button';

export const PresenterStudio: React.FC<{ onOpenReferral?: () => void }> = ({ onOpenReferral }) => {
  const { activeWidget, setActiveWidget, isLive, title, offerPrice, layoutMode, setLayoutMode } = useStream();
  const { user } = useAuth();
  const [announcementText, setAnnouncementText] = useState('');
  const [isBuilderOpen, setIsBuilderOpen] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  const streamHandle = user?.customSlug || 'meeting';
  const publicStreamUrl = `${window.location.origin}/?view=stage&stream=${streamHandle}`;

  const handleCopyLink = () => {
    navigator.clipboard?.writeText(publicStreamUrl);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const handleBroadcastAnnouncement = (e: React.FormEvent) => {
    e.preventDefault();
    if (!announcementText.trim()) return;
    setAnnouncementText('');
  };

  return (
    <>
      <div className="min-h-[calc(100vh-4rem)] bg-[#FAF9F6] p-4 sm:p-6 lg:p-8 space-y-6 pb-24 font-sans text-left">
        
        {/* 1. High-End Corporate Meeting Header */}
        <div className="flex flex-wrap items-center justify-between gap-4 bg-white p-5 rounded-3xl border border-slate-200/90 shadow-sm">
          <div className="flex items-center gap-3.5">
            <div className="h-11 w-11 rounded-2xl bg-slate-900 flex items-center justify-center text-white shadow-sm">
              <Video className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-base sm:text-lg font-heading font-bold text-obsidian tracking-tight">
                  Executive Meeting Room
                </h1>
                <span className="text-xs text-slate-500 font-mono">
                  • In Session
                </span>
              </div>
              <p className="text-xs text-slate-500 font-normal mt-0.5 max-w-xl truncate">
                Secure WebRTC video conference • Ready for participants
              </p>
            </div>
          </div>

          {/* Quick Actions & Apps Configurator */}
          <div className="flex items-center gap-2.5">
            <Button
              variant="secondary"
              size="sm"
              onClick={() => setIsBuilderOpen(true)}
              className="rounded-full text-xs font-semibold border-slate-200"
              leftIcon={<Sliders className="h-3.5 w-3.5 text-slate-600" />}
            >
              Meeting Apps & Offers
            </Button>

            <button
              onClick={() => setActiveWidget('checkout')}
              className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer ${
                activeWidget === 'checkout'
                  ? 'bg-solar-500 text-white shadow-solar-sm'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
              }`}
            >
              <CreditCard className="h-3.5 w-3.5" />
              <span>Pro Plan ($19.99)</span>
            </button>

            <button
              onClick={() => setActiveWidget('poll')}
              className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer ${
                activeWidget === 'poll'
                  ? 'bg-solar-500 text-white shadow-solar-sm'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
              }`}
            >
              <BarChart3 className="h-3.5 w-3.5" />
              <span>Live Poll</span>
            </button>
          </div>
        </div>

        {/* 2. Professional Meeting Invite Link */}
        <div className="bg-white p-4 sm:p-5 rounded-3xl border border-slate-200/90 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-xs font-heading font-bold text-obsidian uppercase tracking-wider flex items-center gap-1.5">
                <Share2 className="h-3.5 w-3.5 text-slate-700" />
                <span>Meeting Invite Link</span>
              </span>
            </div>
            <p className="text-xs text-slate-500 font-light">
              Anyone with this link can join this meeting instantly on mobile or desktop with zero downloads.
            </p>
          </div>

          <div className="flex items-center gap-2 w-full md:w-auto">
            <div className="flex items-center px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-mono text-slate-700 max-w-xs truncate">
              <span className="text-slate-400">letitbe.me/@</span>
              <strong className="text-obsidian">{streamHandle}</strong>
            </div>

            <button
              type="button"
              onClick={handleCopyLink}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer shrink-0 ${
                copiedLink
                  ? 'bg-emerald-600 text-white'
                  : 'bg-slate-900 hover:bg-slate-800 text-white shadow-sm'
              }`}
            >
              {copiedLink ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
              <span>{copiedLink ? 'Copied' : 'Copy Link'}</span>
            </button>

            <a
              href={publicStreamUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded-xl bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 text-xs font-semibold flex items-center gap-1 shrink-0 transition-all shadow-sm"
              title="Open Audience View in New Tab"
            >
              <ExternalLink className="h-3.5 w-3.5 text-slate-500" />
              <span className="hidden sm:inline">Preview</span>
            </a>
          </div>
        </div>

        {/* 3. Real-time Telemetry Metrics */}
        <LiveAudienceMetrics />

        {/* 4. Layout Selector Bar (Split / PiP / Focus) */}
        <div className="flex items-center justify-between px-1">
          <div className="flex items-center gap-1.5">
            <span className="text-xs font-heading font-bold text-slate-700">Stage Layout:</span>
            <div className="flex items-center gap-1 bg-white p-1 rounded-2xl border border-slate-200 shadow-sm text-xs font-semibold">
              <button
                onClick={() => setLayoutMode('split')}
                className={`px-3 py-1 rounded-xl transition-all cursor-pointer ${
                  layoutMode === 'split'
                    ? 'bg-slate-900 text-white shadow-sm'
                    : 'text-slate-600 hover:text-obsidian'
                }`}
              >
                Split View (60/40)
              </button>
              <button
                onClick={() => setLayoutMode('pip')}
                className={`px-3 py-1 rounded-xl transition-all cursor-pointer ${
                  layoutMode === 'pip'
                    ? 'bg-slate-900 text-white shadow-sm'
                    : 'text-slate-600 hover:text-obsidian'
                }`}
              >
                PiP Mode
              </button>
              <button
                onClick={() => setLayoutMode('focus')}
                className={`px-3 py-1 rounded-xl transition-all cursor-pointer ${
                  layoutMode === 'focus'
                    ? 'bg-slate-900 text-white shadow-sm'
                    : 'text-slate-600 hover:text-obsidian'
                }`}
              >
                Full Focus
              </button>
            </div>
          </div>

          <span className="text-xs text-slate-500 font-mono hidden sm:inline">
            Active App: <strong className="text-solar-600 uppercase font-bold">{activeWidget}</strong>
          </span>
        </div>

        {/* 5. Dynamic Meeting Screen & Interactive Canvas */}
        <div className="min-h-[620px] w-full">
          
          {/* LAYOUT 1: SPLIT 60/40 (Default) */}
          {layoutMode === 'split' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 min-h-[580px] animate-fade-in">
              {/* Left Screen: Video Meeting (7 Cols) */}
              <div className="lg:col-span-7 flex flex-col gap-4">
                <div className="flex-1 min-h-[460px]">
                  <VideoPlayer showHostControls={true} />
                </div>

                {/* Host Announcement Banner Input */}
                <form
                  onSubmit={handleBroadcastAnnouncement}
                  className="flex items-center gap-2 p-2.5 bg-white rounded-2xl border border-slate-200/80 shadow-sm"
                >
                  <Pin className="h-4 w-4 text-solar-500 shrink-0 ml-1" />
                  <input
                    type="text"
                    value={announcementText}
                    onChange={(e) => setAnnouncementText(e.target.value)}
                    placeholder="Broadcast instant host banner to all attendee screens..."
                    className="flex-1 px-3 py-1.5 text-xs rounded-xl border border-slate-200 bg-slate-50/50 text-obsidian focus:bg-white focus:outline-none focus:border-solar-500 font-sans"
                  />
                  <Button
                    type="submit"
                    variant="primary"
                    size="sm"
                    className="rounded-xl text-xs font-semibold px-3 py-1.5"
                    disabled={!announcementText.trim()}
                    rightIcon={<Send className="h-3 w-3" />}
                  >
                    Pin Alert
                  </Button>
                </form>
              </div>

              {/* Right Screen: Interactive Canvas & Live Chat (5 Cols) */}
              <div className="lg:col-span-5 flex flex-col gap-4">
                <div className="h-[300px]">
                  <InteractiveLayer />
                </div>

                <div className="flex-1 min-h-[280px]">
                  <LiveChat />
                </div>
              </div>
            </div>
          )}

          {/* LAYOUT 2: PiP MODE (Interactive App is Full Stage, Host Video is Perfect 16:9 Corner Bubble) */}
          {layoutMode === 'pip' && (
            <div className="relative w-full h-[720px] bg-white rounded-3xl border border-slate-200 shadow-sm p-4 overflow-hidden animate-fade-in">
              <div className="w-full h-full">
                <InteractiveLayer />
              </div>

              {/* Perfectly Proportioned 16:9 Floating Host Video Bubble in Corner */}
              <div className="absolute bottom-6 right-6 w-96 max-w-[90%] aspect-video z-30 rounded-3xl overflow-hidden shadow-2xl border-2 border-slate-900 ring-4 ring-black/10">
                <VideoPlayer showHostControls={true} />
              </div>
            </div>
          )}

          {/* LAYOUT 3: FOCUS MODE (Fullscreen Video Stage + Side Drawer) */}
          {layoutMode === 'focus' && (
            <div className="relative w-full min-h-[640px] flex gap-5 animate-fade-in">
              <div className="flex-1 h-full min-h-[600px] flex flex-col gap-3">
                <div className="flex-1">
                  <VideoPlayer showHostControls={true} />
                </div>
              </div>

              {/* Toggle Side Drawer for Chat & Widgets */}
              <div className="w-96 flex flex-col gap-3">
                <div className="h-[280px]">
                  <InteractiveLayer />
                </div>
                <div className="flex-1 min-h-[280px]">
                  <LiveChat />
                </div>
              </div>
            </div>
          )}

        </div>

      </div>

      {/* Stream Builder Configurator Modal */}
      <StreamBuilderModal
        isOpen={isBuilderOpen}
        onClose={() => setIsBuilderOpen(false)}
      />
    </>
  );
};
