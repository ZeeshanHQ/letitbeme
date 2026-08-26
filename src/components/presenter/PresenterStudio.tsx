import React, { useState, useEffect } from 'react';
import {
  Video,
  Sliders,
  Copy,
  Check,
  ExternalLink,
  Share2,
  Pin,
  Send,
  CreditCard,
  BarChart3,
  RotateCcw,
} from 'lucide-react';
import { useStream } from '../../context/StreamContext';
import { useAuth } from '../../context/AuthContext';
import { LiveAudienceMetrics } from './LiveAudienceMetrics';
import { StreamBuilderModal } from './StreamBuilderModal';
import { VideoPlayer } from '../stage/VideoPlayer';
import { InteractiveLayer } from '../interactive/InteractiveLayer';
import { LiveChat } from '../stage/LiveChat';
import { Button } from '../common/Button';
import { JoinRequestsToast } from '../stage/JoinRequestsToast';

export const PresenterStudio: React.FC<{ onOpenReferral?: () => void }> = ({ onOpenReferral }) => {
  const { activeWidget, setActiveWidget, isLive, title, layoutMode, setLayoutMode } = useStream();
  const { user, rotateMeetingSlug } = useAuth();
  const [announcementText, setAnnouncementText] = useState('');
  const [isBuilderOpen, setIsBuilderOpen] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [isRotating, setIsRotating] = useState(false);
  const [mobileActiveTab, setMobileActiveTab] = useState<'interactive' | 'chat'>('interactive');

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  }, []);

  const streamHandle = user?.customSlug || 'live';
  const publicStreamUrl = `${window.location.origin}/?room=${streamHandle}`;

  const handleCopyLink = () => {
    navigator.clipboard?.writeText(publicStreamUrl);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const handleRotateLink = async () => {
    setIsRotating(true);
    await rotateMeetingSlug();
    setIsRotating(false);
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
      {/* Real-time Door Knock Animated Toast & Requests Badge */}
      <JoinRequestsToast />

      <div className="min-h-[calc(100vh-4rem)] bg-[#FAF9F6] p-3 sm:p-5 lg:p-8 space-y-5 pb-24 font-['Plus_Jakarta_Sans',sans-serif] text-left">
        
        {/* 1. High-End Corporate Meeting Header */}
        <div className="flex flex-wrap items-center justify-between gap-4 bg-white p-4 sm:p-5 rounded-3xl border border-slate-200/90 shadow-sm">
          <div className="flex items-center gap-3.5">
            <div className="h-10 w-10 sm:h-11 sm:w-11 rounded-2xl bg-slate-900 flex items-center justify-center text-white shadow-sm shrink-0">
              <Video className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-base sm:text-lg font-heading font-bold text-[#0f172a] tracking-tight">
                  Executive Meeting Studio
                </h1>
                <span className="text-xs text-emerald-600 font-mono flex items-center gap-1 font-bold">
                  <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                  Live
                </span>
              </div>
              <p className="text-xs text-slate-500 font-normal mt-0.5 max-w-xl truncate">
                Ultra-low latency 1080p60 WebRTC video conference
              </p>
            </div>
          </div>

          {/* Quick Actions & Apps Configurator */}
          <div className="flex flex-wrap items-center gap-2">
            <Button
              variant="secondary"
              size="sm"
              onClick={() => setIsBuilderOpen(true)}
              className="rounded-full text-xs font-semibold border-slate-200"
              leftIcon={<Sliders className="h-3.5 w-3.5 text-slate-600" />}
            >
              Tools &amp; Offers
            </Button>

            <button
              type="button"
              onClick={() => setActiveWidget('checkout')}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer ${
                activeWidget === 'checkout'
                  ? 'bg-[#0084FF] text-white shadow-sm'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
              }`}
            >
              <CreditCard className="h-3.5 w-3.5" />
              <span>Live Offer</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveWidget('poll')}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer ${
                activeWidget === 'poll'
                  ? 'bg-[#0084FF] text-white shadow-sm'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
              }`}
            >
              <BarChart3 className="h-3.5 w-3.5" />
              <span>Live Poll</span>
            </button>
          </div>
        </div>

        {/* 2. Professional Meeting Invite Link with Rotate Option */}
        <div className="bg-white p-4 sm:p-5 rounded-3xl border border-slate-200/90 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-xs font-heading font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                <Share2 className="h-3.5 w-3.5 text-slate-700" />
                <span>Persistent Meeting Link</span>
              </span>
            </div>
            <p className="text-xs text-slate-500 font-light">
              Share with attendees to join directly on mobile or desktop with zero downloads.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
            <div className="flex items-center px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-mono text-slate-700 max-w-xs truncate">
              <span className="text-slate-400">letitbe.me/?room=</span>
              <strong className="text-slate-900 font-bold">{streamHandle}</strong>
            </div>

            <button
              type="button"
              onClick={handleCopyLink}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer shrink-0 ${
                copiedLink
                  ? 'bg-emerald-600 text-white'
                  : 'bg-[#0084FF] hover:bg-[#0074E0] text-white shadow-sm shadow-blue-500/20'
              }`}
              title="Copy persistent link"
            >
              {copiedLink ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
              <span>{copiedLink ? 'Copied' : 'Copy Link'}</span>
            </button>

            <button
              type="button"
              onClick={handleRotateLink}
              disabled={isRotating}
              className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold flex items-center gap-1 shrink-0 transition-all cursor-pointer border border-slate-200"
              title="Rotate / Regenerate new unique meeting link"
            >
              <RotateCcw className={`h-3.5 w-3.5 text-slate-600 ${isRotating ? 'animate-spin' : ''}`} />
              <span className="hidden sm:inline">Rotate</span>
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
        <div className="flex flex-wrap items-center justify-between gap-2 px-1">
          <div className="flex items-center gap-1.5">
            <span className="text-xs font-heading font-bold text-slate-700">Stage Layout:</span>
            <div className="flex items-center gap-1 bg-white p-1 rounded-2xl border border-slate-200 shadow-sm text-xs font-semibold">
              <button
                type="button"
                onClick={() => setLayoutMode('split')}
                className={`px-3 py-1 rounded-xl transition-all cursor-pointer ${
                  layoutMode === 'split'
                    ? 'bg-slate-900 text-white shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Split View
              </button>
              <button
                type="button"
                onClick={() => setLayoutMode('pip')}
                className={`px-3 py-1 rounded-xl transition-all cursor-pointer ${
                  layoutMode === 'pip'
                    ? 'bg-slate-900 text-white shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                PiP Mode
              </button>
              <button
                type="button"
                onClick={() => setLayoutMode('focus')}
                className={`px-3 py-1 rounded-xl transition-all cursor-pointer ${
                  layoutMode === 'focus'
                    ? 'bg-slate-900 text-white shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Focus
              </button>
            </div>
          </div>

          <span className="text-xs text-slate-500 font-mono">
            Active App: <strong className="text-[#0084FF] uppercase font-bold">{activeWidget}</strong>
          </span>
        </div>

        {/* 5. Dynamic Meeting Screen & Interactive Canvas */}
        <div className="min-h-[500px] w-full">
          
          {/* LAYOUT 1: SPLIT 60/40 (Default) */}
          {layoutMode === 'split' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 min-h-[500px] animate-fade-in">
              {/* Left Screen: Video Meeting (7 Cols) */}
              <div className="lg:col-span-7 flex flex-col gap-4">
                <div className="flex-1 min-h-[360px] sm:min-h-[460px]">
                  <VideoPlayer showHostControls={true} />
                </div>

                {/* Host Announcement Banner Input */}
                <form
                  onSubmit={handleBroadcastAnnouncement}
                  className="flex items-center gap-2 p-2.5 bg-white rounded-2xl border border-slate-200/80 shadow-sm"
                >
                  <Pin className="h-4 w-4 text-[#0084FF] shrink-0 ml-1" />
                  <input
                    type="text"
                    value={announcementText}
                    onChange={(e) => setAnnouncementText(e.target.value)}
                    placeholder="Broadcast instant host banner to all attendee screens..."
                    className="flex-1 px-3 py-1.5 text-xs rounded-xl border border-slate-200 bg-slate-50/50 text-slate-900 focus:bg-white focus:outline-none focus:border-[#0084FF] font-sans"
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
                {/* On mobile: Tab switcher for Interactive vs Chat */}
                <div className="flex lg:hidden items-center justify-center bg-slate-200/70 p-1 rounded-2xl">
                  <button
                    type="button"
                    onClick={() => setMobileActiveTab('interactive')}
                    className={`flex-1 py-1.5 text-xs font-semibold rounded-xl transition-all ${
                      mobileActiveTab === 'interactive'
                        ? 'bg-white text-[#0084FF] shadow-sm'
                        : 'text-slate-600'
                    }`}
                  >
                    Interactive Tool ({activeWidget})
                  </button>
                  <button
                    type="button"
                    onClick={() => setMobileActiveTab('chat')}
                    className={`flex-1 py-1.5 text-xs font-semibold rounded-xl transition-all ${
                      mobileActiveTab === 'chat'
                        ? 'bg-white text-[#0084FF] shadow-sm'
                        : 'text-slate-600'
                    }`}
                  >
                    Live Chat
                  </button>
                </div>

                <div className="hidden lg:flex flex-col gap-4 flex-1">
                  <div className="flex-1 min-h-[360px]">
                    <InteractiveLayer />
                  </div>
                  <div className="h-[280px]">
                    <LiveChat />
                  </div>
                </div>

                <div className="flex lg:hidden flex-1 min-h-[380px]">
                  {mobileActiveTab === 'interactive' ? (
                    <InteractiveLayer />
                  ) : (
                    <LiveChat />
                  )}
                </div>
              </div>
            </div>
          )}

          {/* LAYOUT 2: PiP MODE */}
          {layoutMode === 'pip' && (
            <div className="relative w-full h-[640px] sm:h-[720px] bg-white rounded-3xl border border-slate-200 shadow-sm p-4 overflow-hidden animate-fade-in">
              <div className="w-full h-full">
                <InteractiveLayer />
              </div>

              <div className="absolute bottom-4 right-4 sm:bottom-6 sm:right-6 w-80 sm:w-96 max-w-[90%] aspect-video z-30 rounded-3xl overflow-hidden shadow-2xl border-2 border-slate-900 ring-4 ring-black/10">
                <VideoPlayer showHostControls={true} />
              </div>
            </div>
          )}

          {/* LAYOUT 3: FOCUS MODE */}
          {layoutMode === 'focus' && (
            <div className="relative w-full min-h-[540px] sm:min-h-[640px] flex flex-col lg:flex-row gap-5 animate-fade-in">
              <div className="flex-1 h-full min-h-[400px] sm:min-h-[600px] flex flex-col gap-3">
                <div className="flex-1">
                  <VideoPlayer showHostControls={true} />
                </div>
              </div>

              <div className="w-full lg:w-96 flex flex-col gap-3">
                <div className="flex-1 min-h-[300px]">
                  <InteractiveLayer />
                </div>
                <div className="h-[240px]">
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
