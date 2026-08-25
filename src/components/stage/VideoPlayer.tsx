import React, { useState, useRef, useEffect } from 'react';
import {
  Volume2,
  VolumeX,
  Maximize2,
  Minimize2,
  Users,
  Video,
  VideoOff,
  Mic,
  MicOff,
  MonitorUp,
  Edit2,
  Check,
  X,
  Radio,
  PhoneOff,
  PictureInPicture2,
} from 'lucide-react';
import { useStream } from '../../context/StreamContext';
import { useAuth } from '../../context/AuthContext';
import { SubtitleOverlay } from './SubtitleOverlay';

interface VideoPlayerProps {
  showHostControls?: boolean;
}

export const VideoPlayer: React.FC<VideoPlayerProps> = ({ showHostControls = true }) => {
  const {
    isLive,
    viewerCount,
    isMicOn,
    toggleMic,
    isCamOn,
    toggleCam,
    isScreenSharing,
    toggleScreenShare,
    localCamStream,
    localScreenStream,
    streamDuration,
    toggleLiveStatus,
    layoutMode,
    setLayoutMode,
  } = useStream();

  const { user, updateProfile } = useAuth();

  const [isMuted, setIsMuted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [volume, setVolume] = useState(0.85);

  // Real-time editable host name and slug
  const [isEditingName, setIsEditingName] = useState(false);
  const [editName, setEditName] = useState(user?.fullName || 'Host Presenter');
  const [editSlug, setEditSlug] = useState(user?.customSlug || 'live');

  useEffect(() => {
    if (user?.fullName) {
      setEditName(user.fullName);
    }
    if (user?.customSlug) {
      setEditSlug(user.customSlug);
    }
  }, [user?.fullName, user?.customSlug]);

  const handleSaveName = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setIsEditingName(false);
    if (user && editName.trim()) {
      await updateProfile({
        fullName: editName.trim(),
        customSlug: editSlug.trim().replace(/[^a-zA-Z0-9-_]/g, '') || 'live',
      });
    }
  };

  const containerRef = useRef<HTMLDivElement>(null);
  const camVideoRef = useRef<HTMLVideoElement>(null);
  const screenVideoRef = useRef<HTMLVideoElement>(null);
  const pipCamVideoRef = useRef<HTMLVideoElement>(null);
  
  // Hidden Canvas & Video for 100% Reliable Native OS Picture-in-Picture (Zoom/Google Meet standard)
  const pipCanvasRef = useRef<HTMLCanvasElement>(null);
  const pipStreamVideoRef = useRef<HTMLVideoElement>(null);

  // Format live meeting duration (00:00)
  const formatDuration = (secs: number) => {
    const hrs = Math.floor(secs / 3600);
    const mins = Math.floor((secs % 3600) / 60);
    const s = secs % 60;
    return `${hrs > 0 ? `${hrs}:` : ''}${mins.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  // Bind local camera stream to video element
  useEffect(() => {
    if (camVideoRef.current && localCamStream) {
      camVideoRef.current.srcObject = localCamStream;
    }
    if (pipCamVideoRef.current && localCamStream) {
      pipCamVideoRef.current.srcObject = localCamStream;
    }
  }, [localCamStream, isCamOn]);

  // Bind local screen share stream to video element
  useEffect(() => {
    if (screenVideoRef.current && localScreenStream) {
      screenVideoRef.current.srcObject = localScreenStream;
    }
  }, [localScreenStream, isScreenSharing]);

  // Continuous Canvas Stream Painter for OS Picture-in-Picture
  useEffect(() => {
    const canvas = pipCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;

    const drawFrame = () => {
      ctx.fillStyle = '#0A0E1A';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      if (isScreenSharing && screenVideoRef.current && screenVideoRef.current.readyState >= 2) {
        ctx.drawImage(screenVideoRef.current, 0, 0, canvas.width, canvas.height);
      } else if (isCamOn && camVideoRef.current && camVideoRef.current.readyState >= 2) {
        ctx.drawImage(camVideoRef.current, 0, 0, canvas.width, canvas.height);
      } else {
        // Draw Google Meet / Zoom style avatar canvas
        const centerX = canvas.width / 2;
        const centerY = canvas.height / 2 - 15;
        const radius = 55;

        // Avatar circle
        ctx.beginPath();
        ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
        ctx.fillStyle = '#1E293B';
        ctx.fill();
        ctx.lineWidth = 3;
        ctx.strokeStyle = '#334155';
        ctx.stroke();

        // Initial letter
        ctx.fillStyle = '#FFFFFF';
        ctx.font = 'bold 44px sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText((user?.fullName || 'H').charAt(0).toUpperCase(), centerX, centerY);

        // Host Name text
        ctx.fillStyle = '#FFFFFF';
        ctx.font = 'bold 18px sans-serif';
        ctx.fillText(user?.fullName || 'Host Presenter', centerX, canvas.height - 40);

        // Mic indicator text
        ctx.fillStyle = isMicOn ? '#34D399' : '#F87171';
        ctx.font = '13px monospace';
        ctx.fillText(isMicOn ? '● Microphone Active' : '● Microphone Muted', centerX, canvas.height - 20);
      }

      animId = requestAnimationFrame(drawFrame);
    };

    drawFrame();

    // Hook canvas stream into hidden video element for OS PiP
    if (pipStreamVideoRef.current && !pipStreamVideoRef.current.srcObject) {
      try {
        const stream = canvas.captureStream(30);
        pipStreamVideoRef.current.srcObject = stream;
        pipStreamVideoRef.current.play().catch(() => {});
      } catch (e) {
        console.warn('Canvas stream setup note:', e);
      }
    }

    return () => {
      cancelAnimationFrame(animId);
    };
  }, [isCamOn, isScreenSharing, isMicOn, user?.fullName]);

  const toggleMute = () => setIsMuted(!isMuted);

  const toggleFullscreen = () => {
    if (!containerRef.current) return;
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen().catch((err) => console.error(err));
      setIsFullscreen(true);
    } else {
      document.exitFullscreen().catch((err) => console.error(err));
      setIsFullscreen(false);
    }
  };

  // 100% Reliable Native OS Picture-in-Picture
  const toggleNativePiP = async () => {
    try {
      if (document.pictureInPictureElement) {
        await document.exitPictureInPicture();
        return;
      }

      if (pipStreamVideoRef.current) {
        await pipStreamVideoRef.current.play();
        await pipStreamVideoRef.current.requestPictureInPicture();
      }
    } catch (e) {
      console.warn('Native PiP note:', e);
    }
  };

  return (
    <div
      ref={containerRef}
      className="relative w-full h-full min-h-[380px] bg-[#0A0D14] rounded-3xl overflow-hidden shadow-2xl border border-slate-800/90 flex flex-col justify-between select-none group font-sans"
    >
      {/* Hidden Canvas & Video for OS PiP stream */}
      <canvas ref={pipCanvasRef} width={640} height={360} className="hidden" />
      <video ref={pipStreamVideoRef} autoPlay playsInline muted className="hidden" />

      {/* 1. SCREEN SHARE VIEW */}
      {isScreenSharing && localScreenStream ? (
        <div className="absolute inset-0 w-full h-full bg-slate-950 flex items-center justify-center">
          <video
            ref={screenVideoRef}
            autoPlay
            playsInline
            muted
            className="w-full h-full object-contain"
          />
          {/* PiP Camera Overlay */}
          {isCamOn && localCamStream && (
            <div className="absolute bottom-20 right-4 w-44 h-32 rounded-2xl overflow-hidden border-2 border-solar-500 shadow-2xl z-30">
              <video
                ref={pipCamVideoRef}
                autoPlay
                playsInline
                muted
                className="w-full h-full object-cover mirror"
              />
            </div>
          )}
        </div>
      ) : isCamOn && localCamStream ? (
        /* 2. REAL CAMERA VIDEO FEED */
        <video
          ref={camVideoRef}
          autoPlay
          playsInline
          muted
          className="absolute inset-0 w-full h-full object-cover mirror"
        />
      ) : (
        /* 3. HIGH-END CORPORATE MEETING AVATAR (NO STOCK PHOTOS) */
        <div className="absolute inset-0 w-full h-full bg-gradient-to-b from-[#0F172A] via-[#0A0E1A] to-[#06080F] flex flex-col items-center justify-center p-6 text-center space-y-4">
          
          {/* Corporate Avatar Circle */}
          <div className="relative">
            {user?.avatarUrl && !user.avatarUrl.includes('dicebear') ? (
              <img
                src={user.avatarUrl}
                alt={user?.fullName || 'Host'}
                className="relative h-24 w-24 sm:h-28 sm:w-28 rounded-full border-2 border-slate-700 shadow-2xl object-cover"
              />
            ) : (
              <div className="relative h-24 w-24 sm:h-28 sm:w-28 rounded-full bg-gradient-to-tr from-slate-800 to-slate-700 border-2 border-slate-600 shadow-2xl flex items-center justify-center text-white text-3xl font-heading font-bold">
                {(user?.fullName || 'H').charAt(0).toUpperCase()}
              </div>
            )}

            {/* Mic Indicator Badge */}
            <div className="absolute bottom-0 right-0 p-1.5 rounded-full bg-[#0A0D14] border border-slate-700 shadow-md">
              {isMicOn ? (
                <Mic className="h-4 w-4 text-emerald-400" />
              ) : (
                <MicOff className="h-4 w-4 text-rose-500" />
              )}
            </div>
          </div>

          {/* Editable Display Name & Handle Tag (Pure Crisp White Text) */}
          <div className="relative z-10 flex items-center gap-2 max-w-md">
            {isEditingName ? (
              <form onSubmit={handleSaveName} className="flex flex-wrap items-center gap-1.5 bg-slate-900/95 p-2 rounded-2xl border border-solar-500 shadow-2xl">
                <input
                  type="text"
                  autoFocus
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  placeholder="Your Name"
                  className="bg-slate-800 text-white text-xs font-bold px-2.5 py-1 rounded-xl outline-none font-sans w-32 border border-slate-700"
                />
                <div className="flex items-center bg-slate-800 px-2 py-1 rounded-xl text-xs text-slate-300 font-mono border border-slate-700">
                  <span>@</span>
                  <input
                    type="text"
                    value={editSlug}
                    onChange={(e) => setEditSlug(e.target.value)}
                    placeholder="handle"
                    className="bg-transparent text-solar-400 font-bold outline-none font-mono w-24 pl-0.5"
                  />
                </div>
                <button
                  type="submit"
                  className="p-1.5 rounded-xl bg-solar-500 text-white hover:bg-solar-600 cursor-pointer shadow-solar-sm"
                  title="Save changes"
                >
                  <Check className="h-3.5 w-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => setIsEditingName(false)}
                  className="p-1.5 rounded-xl bg-slate-800 text-slate-400 hover:text-white cursor-pointer"
                  title="Cancel"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              </form>
            ) : (
              <button
                type="button"
                onClick={() => setIsEditingName(true)}
                className="group flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-900/95 hover:bg-slate-800 border border-white/20 text-white transition-all cursor-pointer shadow-lg backdrop-blur-md"
                title="Click to rename display name & stream handle"
              >
                <span className="text-xs font-bold text-white font-heading tracking-tight">
                  {user?.fullName || 'Host Presenter'}
                </span>
                <span className="text-[11px] font-mono text-solar-400 font-bold">
                  @{user?.customSlug || 'live'}
                </span>
                <Edit2 className="h-3 w-3 text-slate-300 group-hover:text-solar-400 ml-0.5" />
              </button>
            )}
          </div>

          <p className="text-[11px] font-mono text-slate-400">
            Camera is off • Turn on video in the meeting dock below
          </p>
        </div>
      )}

      {/* Subtle Gradient Shadow for UI Readability */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/50 pointer-events-none" />

      {/* Top Meeting Status Bar */}
      <div className="relative z-20 flex items-center justify-between p-4 bg-gradient-to-b from-black/60 to-transparent">
        <div className="flex items-center gap-2">
          <span className="flex items-center gap-1.5 text-[11px] font-semibold text-white bg-slate-900/90 backdrop-blur-md px-3 py-1 rounded-full border border-white/15 font-mono">
            <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>{formatDuration(streamDuration)}</span>
          </span>

          {isScreenSharing && (
            <span className="flex items-center gap-1 text-[11px] font-mono font-semibold text-white bg-blue-600/90 backdrop-blur-md px-2.5 py-0.5 rounded-full border border-blue-400/40">
              <MonitorUp className="h-3 w-3" />
              <span>Screen Sharing</span>
            </span>
          )}

          <div className="flex items-center gap-1.5 text-xs text-white/90 bg-slate-900/90 backdrop-blur-md px-3 py-1 rounded-full border border-white/15 font-mono">
            <Users className="h-3.5 w-3.5 text-slate-300" />
            <span>{viewerCount} in call</span>
          </div>
        </div>

        {/* Real Host Nameplate */}
        <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900/90 backdrop-blur-md border border-white/15 text-white">
          <div
            className={`h-2 w-2 rounded-full transition-all ${
              isMicOn ? 'bg-emerald-400' : 'bg-slate-500'
            }`}
          />
          <span className="text-xs font-bold text-white">{user?.fullName || 'Host'}</span>
          <span className="text-[10px] text-slate-400 font-mono hidden sm:inline">
            • @{user?.customSlug || 'live'}
          </span>
        </div>
      </div>

      {/* Live Synchronized Subtitle Overlay */}
      <SubtitleOverlay />

      {/* Professional In-Meeting Dock (Clean Google Meet / Zoom Standard) */}
      <div className="relative z-20 p-3 sm:p-4">
        <div className="bg-[#0D131F]/95 backdrop-blur-2xl border border-white/15 rounded-2xl p-2.5 sm:p-3 flex items-center justify-between gap-3 text-white shadow-2xl">
          
          {/* Left: Speaker Volume Control */}
          <div className="flex items-center gap-2">
            <button
              onClick={toggleMute}
              className="p-2 rounded-xl hover:bg-white/10 text-white/80 hover:text-white transition-all cursor-pointer"
              title={isMuted ? 'Unmute Speaker' : 'Mute Speaker'}
            >
              {isMuted || volume === 0 ? <VolumeX className="h-4 w-4 text-rose-400" /> : <Volume2 className="h-4 w-4" />}
            </button>

            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={isMuted ? 0 : volume}
              onChange={(e) => {
                setVolume(parseFloat(e.target.value));
                setIsMuted(false);
              }}
              className="w-16 h-1 bg-white/20 rounded-lg appearance-none cursor-pointer accent-white hidden sm:inline"
            />
          </div>

          {/* Center: Core Meeting Hardware Controls */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={toggleMic}
              className={`p-2.5 sm:px-3.5 sm:py-2 rounded-xl text-xs font-semibold transition-all flex items-center gap-2 cursor-pointer shadow-sm ${
                isMicOn
                  ? 'bg-white/15 hover:bg-white/25 text-white border border-white/20'
                  : 'bg-rose-600 text-white hover:bg-rose-700'
              }`}
              title={isMicOn ? 'Mute Microphone' : 'Unmute Microphone'}
            >
              {isMicOn ? <Mic className="h-4 w-4" /> : <MicOff className="h-4 w-4" />}
              <span className="hidden sm:inline">{isMicOn ? 'Mute' : 'Unmute'}</span>
            </button>

            <button
              type="button"
              onClick={toggleCam}
              className={`p-2.5 sm:px-3.5 sm:py-2 rounded-xl text-xs font-semibold transition-all flex items-center gap-2 cursor-pointer shadow-sm ${
                isCamOn
                  ? 'bg-white/15 hover:bg-white/25 text-white border border-white/20'
                  : 'bg-rose-600 text-white hover:bg-rose-700'
              }`}
              title={isCamOn ? 'Turn Off Camera' : 'Turn On Camera'}
            >
              {isCamOn ? <Video className="h-4 w-4" /> : <VideoOff className="h-4 w-4" />}
              <span className="hidden sm:inline">{isCamOn ? 'Stop Video' : 'Start Video'}</span>
            </button>

            <button
              type="button"
              onClick={toggleScreenShare}
              className={`p-2.5 sm:px-3.5 sm:py-2 rounded-xl text-xs font-semibold transition-all flex items-center gap-2 cursor-pointer shadow-sm ${
                isScreenSharing
                  ? 'bg-blue-600 text-white hover:bg-blue-700'
                  : 'bg-white/15 hover:bg-white/25 text-white border border-white/20'
              }`}
              title={isScreenSharing ? 'Stop Screen Share' : 'Share Screen'}
            >
              <MonitorUp className="h-4 w-4" />
              <span className="hidden sm:inline">{isScreenSharing ? 'Stop Share' : 'Share Screen'}</span>
            </button>

            <button
              type="button"
              onClick={toggleLiveStatus}
              className={`p-2.5 sm:px-3.5 sm:py-2 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer shadow-sm ${
                isLive
                  ? 'bg-rose-600 hover:bg-rose-700 text-white'
                  : 'bg-emerald-600 hover:bg-emerald-700 text-white'
              }`}
              title={isLive ? 'Leave Meeting' : 'Join Meeting'}
            >
              <PhoneOff className="h-4 w-4" />
              <span className="hidden sm:inline">{isLive ? 'End Meeting' : 'Start Meeting'}</span>
            </button>
          </div>

          {/* Right: Native OS PiP + Fullscreen Trigger */}
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={toggleNativePiP}
              className="p-2 rounded-xl hover:bg-white/10 text-white/80 hover:text-white transition-all cursor-pointer"
              title="Float Video Over Screen (Zoom-style Native PiP across all tabs)"
            >
              <PictureInPicture2 className="h-4 w-4" />
            </button>

            <button
              onClick={toggleFullscreen}
              className="p-2 rounded-xl hover:bg-white/10 text-white/80 hover:text-white transition-all cursor-pointer"
              title="Toggle Fullscreen"
            >
              {isFullscreen ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};
