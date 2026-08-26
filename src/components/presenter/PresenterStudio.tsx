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
  MessageSquare,
  FileText,
  Calendar,
  Layers,
  ChevronRight,
  ChevronLeft,
  Radio,
  Sparkles,
  Loader2,
  Users,
  Maximize2,
} from 'lucide-react';
import { useStream, InteractiveWidgetType } from '../../context/StreamContext';
import { useAuth } from '../../context/AuthContext';
import { LiveAudienceMetrics } from './LiveAudienceMetrics';
import { StreamBuilderModal } from './StreamBuilderModal';
import { VideoPlayer } from '../stage/VideoPlayer';
import { InteractiveLayer } from '../interactive/InteractiveLayer';
import { LiveChat } from '../stage/LiveChat';
import { Button } from '../common/Button';
import { JoinRequestsToast } from '../stage/JoinRequestsToast';

export const PresenterStudio: React.FC<{ onOpenReferral?: () => void }> = ({ onOpenReferral }) => {
  const {
    activeWidget,
    setActiveWidget,
    isLive,
    toggleLiveStatus,
    title,
    layoutMode,
    setLayoutMode,
    viewerCount,
    streamDuration,
  } = useStream();

  const { user, rotateMeetingSlug } = useAuth();
  const [announcementText, setAnnouncementText] = useState('');
  const [isBuilderOpen, setIsBuilderOpen] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [isRotating, setIsRotating] = useState(false);
  const [isSidePanelOpen, setIsSidePanelOpen] = useState(true);
  const [activeSideTab, setActiveSideTab] = useState<'chat' | 'widget'>('chat');
  const [isTransitioning, setIsTransitioning] = useState(false);

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

  const formatDuration = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const s = secs % 60;
    return `${mins.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <>
      {/* Real-time Door Knock Animated Toast & Requests Badge */}
      <JoinRequestsToast />

      {/* 1. LOADING CIRCULAR ANIMATION OVERLAY WHEN LAUNCHING MEETING ROOM */}
      {isTransitioning && (
        <div className="fixed inset-0 z-50 bg-slate-950/90 backdrop-blur-xl flex flex-col items-center justify-center p-6 animate-fade-in text-white font-['Plus_Jakarta_Sans',sans-serif]">
          <div className="relative mb-6">
            <div className="h-28 w-28 rounded-full border-4 border-blue-500/20 border-t-[#0084FF] animate-spin flex items-center justify-center" />
            <div className="absolute inset-0 flex items-center justify-center">
              <Radio className="h-10 w-10 text-[#0084FF] animate-pulse" />
            </div>
          </div>
          <h3 className="text-xl font-heading font-bold text-white tracking-tight animate-pulse">
            Launching Professional Meeting Room...
          </h3>
          <p className="text-xs text-slate-400 mt-2 font-mono">
            Securing 1080p60 WebRTC mesh &amp; in-stream tools
          </p>
        </div>
      )}

      {/* 2. FULL PROFESSIONAL MEETING ROOM (When Meeting is Live) */}
      {isLive ? (
        <div className="min-h-[calc(100vh-4rem)] bg-[#07090E] text-white flex flex-col justify-between font-['Plus_Jakarta_Sans',sans-serif]">
          
          {/* Top Meeting Room Header Bar */}
          <header className="h-14 px-4 sm:px-6 border-b border-white/10 flex items-center justify-between bg-slate-950/80 backdrop-blur-xl shrink-0">
            <div className="flex items-center gap-3">
              <div className="h-2.5 w-2.5 rounded-full bg-emerald-500 animate-pulse" />
              <div>
                <h2 className="text-xs sm:text-sm font-heading font-bold text-white tracking-tight truncate max-w-xs sm:max-w-md">
                  {title || 'Executive Meeting Room'}
                </h2>
                <span className="text-[10px] font-mono text-slate-400">
                  REC: {formatDuration(streamDuration)} • {viewerCount} {viewerCount === 1 ? 'Attendee' : 'Attendees'}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleCopyLink}
                className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/15 text-white text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer border border-white/10"
              >
                {copiedLink ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
                <span className="hidden sm:inline">{copiedLink ? 'Link Copied' : 'Invite Link'}</span>
              </button>

              <button
                type="button"
                onClick={() => setIsSidePanelOpen(!isSidePanelOpen)}
                className={`p-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer border ${
                  isSidePanelOpen
                    ? 'bg-[#0084FF] text-white border-[#0084FF]'
                    : 'bg-white/10 text-slate-300 hover:text-white border-white/10'
                }`}
                title={isSidePanelOpen ? 'Hide Side Panel' : 'Show Side Panel'}
              >
                <Layers className="h-4 w-4" />
                <span className="hidden sm:inline">{isSidePanelOpen ? 'Side Panel' : 'Open Tools'}</span>
              </button>
            </div>
          </header>

          {/* Main Meeting Workspace Stage */}
          <div className="flex-1 flex flex-col lg:flex-row p-3 sm:p-4 gap-4 overflow-hidden max-w-[1920px] mx-auto w-full">
            
            {/* Left Main Video Feed Stage */}
            <div className={`flex-1 flex flex-col transition-all duration-300 ${isSidePanelOpen ? 'lg:w-[65%]' : 'w-full'}`}>
              <div className="flex-1 min-h-[480px] sm:min-h-[600px]">
                <VideoPlayer showHostControls={true} />
              </div>
            </div>

            {/* Right Side Panel (Google Meet & Zoom Standard Drawer) */}
            {isSidePanelOpen && (
              <div className="w-full lg:w-[35%] xl:w-[32%] flex flex-col bg-slate-900/90 backdrop-blur-2xl rounded-3xl border border-white/10 shadow-2xl overflow-hidden animate-slide-left shrink-0 max-h-[calc(100vh-6rem)]">
                
                {/* Side Panel Tabs Header */}
                <div className="p-3 border-b border-white/10 flex items-center justify-between bg-slate-950/60">
                  <div className="flex items-center gap-1 bg-white/5 p-1 rounded-2xl border border-white/10 text-xs font-semibold">
                    <button
                      type="button"
                      onClick={() => setActiveSideTab('chat')}
                      className={`px-3 py-1.5 rounded-xl transition-all flex items-center gap-1.5 cursor-pointer ${
                        activeSideTab === 'chat'
                          ? 'bg-[#0084FF] text-white shadow-sm'
                          : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      <MessageSquare className="h-3.5 w-3.5" />
                      <span>Live Chat</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setActiveSideTab('widget')}
                      className={`px-3 py-1.5 rounded-xl transition-all flex items-center gap-1.5 cursor-pointer ${
                        activeSideTab === 'widget'
                          ? 'bg-[#0084FF] text-white shadow-sm'
                          : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      <Layers className="h-3.5 w-3.5" />
                      <span>Tools ({activeWidget})</span>
                    </button>
                  </div>

                  {/* Quick Widget Switcher Pills */}
                  {activeSideTab === 'widget' && (
                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => setActiveWidget('checkout')}
                        className={`p-1.5 rounded-lg transition-all cursor-pointer ${activeWidget === 'checkout' ? 'bg-[#0084FF] text-white' : 'text-slate-400 hover:text-white'}`}
                        title="In-Stream Offer"
                      >
                        <CreditCard className="h-3.5 w-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => setActiveWidget('poll')}
                        className={`p-1.5 rounded-lg transition-all cursor-pointer ${activeWidget === 'poll' ? 'bg-[#0084FF] text-white' : 'text-slate-400 hover:text-white'}`}
                        title="Live Poll"
                      >
                        <BarChart3 className="h-3.5 w-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => setActiveWidget('lead_gen')}
                        className={`p-1.5 rounded-lg transition-all cursor-pointer ${activeWidget === 'lead_gen' ? 'bg-[#0084FF] text-white' : 'text-slate-400 hover:text-white'}`}
                        title="Agenda"
                      >
                        <Calendar className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  )}
                </div>

                {/* Side Panel Content Body */}
                <div className="flex-1 overflow-y-auto p-4 flex flex-col">
                  {activeSideTab === 'chat' ? (
                    <div className="h-full min-h-[440px] flex flex-col">
                      <LiveChat />
                    </div>
                  ) : (
                    <div className="h-full min-h-[440px]">
                      <InteractiveLayer />
                    </div>
                  )}
                </div>

                {/* Host Announcement Banner Input at Bottom of Side Panel */}
                <form
                  onSubmit={handleBroadcastAnnouncement}
                  className="p-3 border-t border-white/10 bg-slate-950/60 flex items-center gap-2"
                >
                  <Pin className="h-3.5 w-3.5 text-[#0084FF] shrink-0 ml-1" />
                  <input
                    type="text"
                    value={announcementText}
                    onChange={(e) => setAnnouncementText(e.target.value)}
                    placeholder="Broadcast alert banner to attendees..."
                    className="flex-1 px-3 py-1.5 text-xs rounded-xl border border-white/10 bg-white/5 text-white placeholder-slate-500 focus:outline-none focus:border-[#0084FF] font-sans"
                  />
                  <Button
                    type="submit"
                    variant="primary"
                    size="sm"
                    className="rounded-xl text-xs font-semibold px-2.5 py-1.5"
                    disabled={!announcementText.trim()}
                    rightIcon={<Send className="h-3 w-3" />}
                  >
                    Send
                  </Button>
                </form>

              </div>
            )}

          </div>

        </div>
      ) : (
        /* 3. PRE-MEETING EXECUTIVE PREPARATION STUDIO */
        <div className="min-h-[calc(100vh-4rem)] bg-[#FAF9F6] p-3 sm:p-5 lg:p-8 space-y-6 pb-24 font-['Plus_Jakarta_Sans',sans-serif] text-left max-w-[1780px] 2xl:max-w-[1920px] mx-auto w-full">
          
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
                  <span className="text-xs text-slate-500 font-mono flex items-center gap-1 font-bold">
                    <span className="h-2 w-2 rounded-full bg-slate-400" />
                    Ready
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

          {/* 4. Host Green Room Studio (Widescreen Device Preview & Start CTA) */}
          <div className="w-full">
            <VideoPlayer showHostControls={true} />
          </div>

        </div>
      )}

      {/* Stream Builder Configurator Modal */}
      <StreamBuilderModal
        isOpen={isBuilderOpen}
        onClose={() => setIsBuilderOpen(false)}
      />
    </>
  );
};
