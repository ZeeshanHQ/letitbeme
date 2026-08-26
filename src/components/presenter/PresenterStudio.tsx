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
  Radio,
  Sparkles,
  Users,
  ChevronRight,
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

      {/* 1. ACTIVE LIVE MEETING ROOM (Light Luxury Theme, Zero Clutter) */}
      {isLive ? (
        <div className="min-h-screen bg-[#FAF9F6] text-slate-900 flex flex-col justify-between font-['Plus_Jakarta_Sans',sans-serif] p-3 sm:p-5">
          
          {/* Top Room Header Bar */}
          <header className="h-14 px-4 sm:px-6 rounded-2xl bg-white border border-slate-200/90 shadow-sm flex items-center justify-between shrink-0 mb-4">
            <div className="flex items-center gap-3">
              <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-xs font-mono font-bold text-emerald-700">
                <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                <span>REC {formatDuration(streamDuration)}</span>
              </span>

              <div className="h-4 w-px bg-slate-200" />

              <h2 className="text-xs sm:text-sm font-heading font-bold text-slate-900 tracking-tight truncate max-w-xs sm:max-w-md">
                {title || 'Executive Meeting Room'}
              </h2>

              <span className="hidden sm:flex items-center gap-1 text-xs font-mono text-slate-500 bg-slate-100 px-2.5 py-0.5 rounded-lg border border-slate-200">
                <Users className="h-3 w-3 text-slate-400" />
                <span>{viewerCount} {viewerCount === 1 ? 'Attendee' : 'Attendees'}</span>
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleCopyLink}
                className="px-3.5 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer border border-slate-200"
              >
                {copiedLink ? <Check className="h-3.5 w-3.5 text-emerald-600" /> : <Copy className="h-3.5 w-3.5 text-slate-500" />}
                <span className="hidden sm:inline">{copiedLink ? 'Copied' : 'Copy Invite Link'}</span>
              </button>

              <button
                type="button"
                onClick={() => setIsSidePanelOpen(!isSidePanelOpen)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer border ${
                  isSidePanelOpen
                    ? 'bg-[#0084FF] text-white border-[#0084FF] shadow-sm shadow-blue-500/20'
                    : 'bg-white text-slate-700 hover:bg-slate-50 border-slate-200'
                }`}
                title={isSidePanelOpen ? 'Hide Side Panel' : 'Show Side Panel'}
              >
                <Layers className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">{isSidePanelOpen ? 'Side Panel' : 'Open Tools'}</span>
              </button>
            </div>
          </header>

          {/* Main Meeting Stage Workspace */}
          <div className="flex-1 flex flex-col lg:flex-row gap-5 max-w-[1920px] mx-auto w-full">
            
            {/* Left Main Video Feed Stage */}
            <div className={`flex-1 flex flex-col transition-all duration-300 ${isSidePanelOpen ? 'lg:w-[65%]' : 'w-full'}`}>
              <div className="flex-1 min-h-[460px] sm:min-h-[600px]">
                <VideoPlayer showHostControls={true} />
              </div>
            </div>

            {/* Right Side Panel (Google Meet & Zoom Standard Drawer in Light Theme) */}
            {isSidePanelOpen && (
              <div className="w-full lg:w-[35%] xl:w-[32%] flex flex-col bg-white rounded-3xl border border-slate-200/90 shadow-sm overflow-hidden animate-slide-left shrink-0 min-h-[500px]">
                
                {/* Side Panel Tabs Header */}
                <div className="p-3.5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                  <div className="flex items-center gap-1 bg-slate-200/70 p-1 rounded-2xl border border-slate-200 text-xs font-semibold">
                    <button
                      type="button"
                      onClick={() => setActiveSideTab('chat')}
                      className={`px-3 py-1.5 rounded-xl transition-all flex items-center gap-1.5 cursor-pointer ${
                        activeSideTab === 'chat'
                          ? 'bg-white text-[#0084FF] shadow-sm'
                          : 'text-slate-600 hover:text-slate-900'
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
                          ? 'bg-white text-[#0084FF] shadow-sm'
                          : 'text-slate-600 hover:text-slate-900'
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
                        className={`p-1.5 rounded-lg transition-all cursor-pointer ${activeWidget === 'checkout' ? 'bg-[#0084FF] text-white' : 'text-slate-400 hover:text-slate-700'}`}
                        title="In-Stream Offer"
                      >
                        <CreditCard className="h-3.5 w-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => setActiveWidget('poll')}
                        className={`p-1.5 rounded-lg transition-all cursor-pointer ${activeWidget === 'poll' ? 'bg-[#0084FF] text-white' : 'text-slate-400 hover:text-slate-700'}`}
                        title="Live Poll"
                      >
                        <BarChart3 className="h-3.5 w-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => setActiveWidget('lead_gen')}
                        className={`p-1.5 rounded-lg transition-all cursor-pointer ${activeWidget === 'lead_gen' ? 'bg-[#0084FF] text-white' : 'text-slate-400 hover:text-slate-700'}`}
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
                  className="p-3 border-t border-slate-100 bg-slate-50/50 flex items-center gap-2"
                >
                  <Pin className="h-3.5 w-3.5 text-[#0084FF] shrink-0 ml-1" />
                  <input
                    type="text"
                    value={announcementText}
                    onChange={(e) => setAnnouncementText(e.target.value)}
                    placeholder="Broadcast alert banner to attendees..."
                    className="flex-1 px-3 py-1.5 text-xs rounded-xl border border-slate-200 bg-white text-slate-900 placeholder-slate-400 focus:outline-none focus:border-[#0084FF] font-sans"
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
        /* 2. PRE-MEETING PREPARATION STUDIO (Host can setup Agenda, Offers & Test Camera) */
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

          {/* 4. Split 60/40 Preparation Stage (Green Room on Left, Interactive Tools on Right) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 min-h-[560px]">
            {/* Left 7 Columns: Host Green Room Camera Preview & Start Button */}
            <div className="lg:col-span-7 flex flex-col">
              <VideoPlayer showHostControls={true} />
            </div>

            {/* Right 5 Columns: In-Stream Interactive Tools (Host can prepare Agenda/Offers before starting) */}
            <div className="lg:col-span-5 flex flex-col gap-4">
              <div className="flex-1 min-h-[460px]">
                <InteractiveLayer />
              </div>
            </div>
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
