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
  UserCheck,
  UserX,
  Play,
  Loader2,
  Sparkles,
  User,
  ArrowRight,
} from 'lucide-react';
import { useStream } from '../../context/StreamContext';
import { useAuth } from '../../context/AuthContext';
import { SubtitleOverlay } from './SubtitleOverlay';
import { PostMeetingProModal } from '../common/PostMeetingProModal';

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
    waitingParticipants,
    admitParticipant,
    denyParticipant,
    isWaitingInLobby,
    setIsWaitingInLobby,
  } = useStream();

  const { user, updateProfile } = useAuth();

  const [isMeetingStarted, setIsMeetingStarted] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [volume, setVolume] = useState(0.85);
  const [showProSummary, setShowProSummary] = useState(false);

  // Guest join state
  const [guestName, setGuestName] = useState(user?.fullName || '');
  const [isGuestJoined, setIsGuestJoined] = useState(false);
  const [hasKnocked, setHasKnocked] = useState(false);

  // Real-time editable host name and slug
  const [isEditingName, setIsEditingName] = useState(false);
  const [editName, setEditName] = useState(user?.fullName || 'Host Presenter');
  const [editSlug, setEditSlug] = useState(user?.customSlug || 'live');

  useEffect(() => {
    if (user?.fullName) {
      setEditName(user.fullName);
      if (!guestName) setGuestName(user.fullName);
    }
    if (user?.customSlug) {
      setEditSlug(user.customSlug);
    }
  }, [user?.fullName, user?.customSlug]);

  // Recording state
  const [isRecording, setIsRecording] = useState(false);
  const [recordingSeconds, setRecordingSeconds] = useState(0);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const recordedChunksRef = useRef<Blob[]>([]);

  // Recording Timer
  useEffect(() => {
    let interval: any;
    if (isRecording) {
      interval = setInterval(() => {
        setRecordingSeconds((prev) => prev + 1);
      }, 1000);
    } else {
      setRecordingSeconds(0);
    }
    return () => clearInterval(interval);
  }, [isRecording]);

  const handleToggleRecording = () => {
    if (isRecording) {
      if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
        mediaRecorderRef.current.stop();
      }
      setIsRecording(false);
    } else {
      try {
        let streamToRecord: MediaStream | null = null;
        if (isScreenSharing && localScreenStream) {
          streamToRecord = localScreenStream;
        } else if (isCamOn && localCamStream) {
          streamToRecord = localCamStream;
        } else if (pipCanvasRef.current) {
          streamToRecord = pipCanvasRef.current.captureStream(30);
        }

        if (!streamToRecord) {
          alert('Start camera or screen share to begin recording.');
          return;
        }

        recordedChunksRef.current = [];
        const recorder = new MediaRecorder(streamToRecord);

        recorder.ondataavailable = (e) => {
          if (e.data && e.data.size > 0) {
            recordedChunksRef.current.push(e.data);
          }
        };

        recorder.onstop = () => {
          const blob = new Blob(recordedChunksRef.current, { type: 'video/webm' });
          const url = URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.style.display = 'none';
          a.href = url;
          a.download = `letitbeme-recording-${editSlug}-${new Date().toISOString().slice(0, 10)}.webm`;
          document.body.appendChild(a);
          a.click();
          setTimeout(() => {
            document.body.removeChild(a);
            window.URL.revokeObjectURL(url);
          }, 100);
        };

        recorder.start(1000);
        mediaRecorderRef.current = recorder;
        setIsRecording(true);
      } catch (err) {
        console.warn('Recording note:', err);
      }
    }
  };

  const handleStartMeeting = () => {
    setIsConnecting(true);
    setTimeout(() => {
      setIsConnecting(false);
      setIsMeetingStarted(true);
      if (!isLive) {
        toggleLiveStatus();
      }
    }, 850);
  };

  const handleGuestKnock = () => {
    if (!guestName.trim()) return;
    setIsConnecting(true);
    
    // Broadcast knock to host
    const bc = new BroadcastChannel('letitbeme_stream_sync');
    const myGuestId = `guest_${Date.now()}`;
    bc.postMessage({
      type: 'KNOCK_JOIN',
      payload: {
        id: myGuestId,
        name: guestName.trim(),
        avatar: `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(guestName.trim())}`,
        joinedAt: 'Just now',
      },
    });

    setTimeout(() => {
      setIsConnecting(false);
      setHasKnocked(true);
      setIsWaitingInLobby(true);
    }, 600);
  };

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
  const greenRoomCamRef = useRef<HTMLVideoElement>(null);
  const guestLobbyCamRef = useRef<HTMLVideoElement>(null);
  const screenVideoRef = useRef<HTMLVideoElement>(null);
  const pipCamVideoRef = useRef<HTMLVideoElement>(null);
  
  // Hidden Canvas & Video for OS PiP
  const pipCanvasRef = useRef<HTMLCanvasElement>(null);
  const pipStreamVideoRef = useRef<HTMLVideoElement>(null);

  // Format live duration
  const formatDuration = (secs: number) => {
    const hrs = Math.floor(secs / 3600);
    const mins = Math.floor((secs % 3600) / 60);
    const s = secs % 60;
    return `${hrs > 0 ? `${hrs}:` : ''}${mins.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  // Bind camera stream
  useEffect(() => {
    if (camVideoRef.current && localCamStream) {
      camVideoRef.current.srcObject = localCamStream;
    }
    if (greenRoomCamRef.current && localCamStream) {
      greenRoomCamRef.current.srcObject = localCamStream;
    }
    if (guestLobbyCamRef.current && localCamStream) {
      guestLobbyCamRef.current.srcObject = localCamStream;
    }
    if (pipCamVideoRef.current && localCamStream) {
      pipCamVideoRef.current.srcObject = localCamStream;
    }
  }, [localCamStream, isCamOn, isMeetingStarted, isGuestJoined, isScreenSharing]);

  // Bind screen stream
  useEffect(() => {
    if (screenVideoRef.current && localScreenStream) {
      screenVideoRef.current.srcObject = localScreenStream;
    }
  }, [localScreenStream, isScreenSharing]);

  // Canvas Painter for Native OS PiP
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
        const centerX = canvas.width / 2;
        const centerY = canvas.height / 2 - 15;
        const radius = 55;

        ctx.beginPath();
        ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
        ctx.fillStyle = '#1E293B';
        ctx.fill();
        ctx.lineWidth = 3;
        ctx.strokeStyle = '#334155';
        ctx.stroke();

        ctx.fillStyle = '#FFFFFF';
        ctx.font = 'bold 44px sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText((user?.fullName || 'H').charAt(0).toUpperCase(), centerX, centerY);

        ctx.fillStyle = '#FFFFFF';
        ctx.font = 'bold 18px sans-serif';
        ctx.fillText(user?.fullName || 'Host Presenter', centerX, canvas.height - 40);

        ctx.fillStyle = isMicOn ? '#34D399' : '#F87171';
        ctx.font = '13px monospace';
        ctx.fillText(isMicOn ? '● Microphone Active' : '● Microphone Muted', centerX, canvas.height - 20);
      }

      animId = requestAnimationFrame(drawFrame);
    };

    drawFrame();

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

  // 1. GUEST WAITING ROOM LOBBY (When knocked)
  if (!showHostControls && isWaitingInLobby && hasKnocked) {
    return (
      <div className="relative w-full h-full min-h-[480px] bg-slate-950 rounded-3xl overflow-hidden shadow-2xl border border-slate-800 flex flex-col items-center justify-center p-8 text-center text-white space-y-6 font-sans">
        <div className="relative">
          <div className="h-24 w-24 rounded-full bg-blue-500/20 border-2 border-[#0084FF] flex items-center justify-center animate-pulse">
            <Radio className="h-10 w-10 text-[#0084FF]" />
          </div>
          <span className="absolute -bottom-1 -right-1 flex h-4 w-4">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-4 w-4 bg-emerald-500" />
          </span>
        </div>

        <div className="space-y-2 max-w-md">
          <h3 className="text-2xl font-heading font-bold text-white tracking-tight">
            Waiting for the host to let you in...
          </h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            The host has received your request with a chime. You will be connected automatically when admitted.
          </p>
        </div>

        <div className="px-4 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs font-mono text-slate-300">
          Guest: <strong className="text-white">{guestName || 'Attendee'}</strong>
        </div>
      </div>
    );
  }

  // 2. GUEST JOIN SCREEN (Ask for Name before joining)
  if (!showHostControls && !isGuestJoined) {
    return (
      <div className="relative w-full h-full min-h-[480px] bg-gradient-to-b from-[#0F172A] via-[#0A0E1A] to-[#06080F] rounded-3xl overflow-hidden shadow-2xl border border-slate-800 flex flex-col items-center justify-center p-8 text-center text-white space-y-6 font-sans">
        
        {/* Device Check Preview */}
        <div className="relative">
          {isCamOn && localCamStream ? (
            <div className="h-28 w-28 rounded-full border-2 border-[#0084FF] shadow-2xl overflow-hidden bg-slate-900">
              <video
                ref={guestLobbyCamRef}
                autoPlay
                playsInline
                muted
                className="w-full h-full object-cover scale-x-[-1] transform"
              />
            </div>
          ) : (
            <div className="h-28 w-28 rounded-full bg-gradient-to-tr from-slate-800 to-slate-700 border-2 border-slate-600 shadow-2xl flex items-center justify-center text-white text-3xl font-heading font-bold">
              {(guestName || 'G').charAt(0).toUpperCase()}
            </div>
          )}

          <div className="absolute bottom-0 right-0 p-2 rounded-full bg-[#0A0D14] border border-slate-700 shadow-md">
            {isMicOn ? <Mic className="h-4 w-4 text-emerald-400" /> : <MicOff className="h-4 w-4 text-rose-500" />}
          </div>
        </div>

        <div className="space-y-1 max-w-md">
          <h3 className="text-2xl font-heading font-bold text-white tracking-tight">
            Ready to join the meeting?
          </h3>
          <p className="text-xs text-slate-400">
            Enter your name to let the host know who is joining
          </p>
        </div>

        {/* Guest Name Input */}
        <form onSubmit={(e) => { e.preventDefault(); handleGuestKnock(); }} className="w-full max-w-xs space-y-3">
          <div className="relative">
            <User className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
            <input
              type="text"
              required
              autoFocus
              value={guestName}
              onChange={(e) => setGuestName(e.target.value)}
              placeholder="What's your name?"
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-700 bg-slate-900/90 text-white text-xs font-semibold focus:outline-none focus:border-[#0084FF]"
            />
          </div>

          {/* Camera / Mic Quick Check */}
          <div className="flex items-center justify-center gap-3 pt-1">
            <button
              type="button"
              onClick={toggleMic}
              className={`p-2.5 rounded-full border transition-all cursor-pointer ${
                isMicOn ? 'bg-slate-800 border-slate-700 text-white' : 'bg-rose-600 border-rose-600 text-white'
              }`}
              title="Microphone"
            >
              {isMicOn ? <Mic className="h-4 w-4" /> : <MicOff className="h-4 w-4" />}
            </button>

            <button
              type="button"
              onClick={toggleCam}
              className={`p-2.5 rounded-full border transition-all cursor-pointer ${
                isCamOn ? 'bg-[#0084FF] border-[#0084FF] text-white' : 'bg-slate-800 border-slate-700 text-slate-300'
              }`}
              title="Camera"
            >
              {isCamOn ? <Video className="h-4 w-4" /> : <VideoOff className="h-4 w-4" />}
            </button>
          </div>

          <button
            type="submit"
            disabled={!guestName.trim() || isConnecting}
            className="w-full py-3 px-4 rounded-xl bg-[#0084FF] hover:bg-[#0074E0] text-white text-xs font-semibold flex items-center justify-center gap-2 shadow-md shadow-blue-500/20 cursor-pointer disabled:opacity-50 transition-all"
          >
            {isConnecting ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>Knocking Room Door...</span>
              </>
            ) : (
              <>
                <span>Ask to Join Meeting</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </>
            )}
          </button>
        </form>

      </div>
    );
  }

  // 3. HOST PRE-MEETING GREEN ROOM ("Ready to meet?")
  if (showHostControls && !isMeetingStarted) {
    return (
      <div className="relative w-full h-full min-h-[480px] bg-gradient-to-b from-[#0F172A] via-[#0A0E1A] to-[#06080F] rounded-3xl overflow-hidden shadow-2xl border border-slate-800 flex flex-col items-center justify-center p-8 text-center text-white space-y-6 font-sans">
        
        {/* Avatar / Device Check Circle */}
        <div className="relative">
          {isCamOn && localCamStream ? (
            <div className="h-28 w-28 rounded-full border-2 border-[#0084FF] shadow-2xl overflow-hidden bg-slate-900">
              <video
                ref={greenRoomCamRef}
                autoPlay
                playsInline
                muted
                className="w-full h-full object-cover scale-x-[-1] transform"
              />
            </div>
          ) : user?.avatarUrl ? (
            <img
              src={user.avatarUrl}
              alt={user?.fullName || 'Host'}
              referrerPolicy="no-referrer"
              className="h-28 w-28 rounded-full border-2 border-slate-700 shadow-2xl object-cover bg-slate-800"
            />
          ) : (
            <div className="h-28 w-28 rounded-full bg-gradient-to-tr from-slate-800 to-slate-700 border-2 border-slate-600 shadow-2xl flex items-center justify-center text-white text-3xl font-heading font-bold">
              {(user?.fullName || 'H').charAt(0).toUpperCase()}
            </div>
          )}

          {/* Quick mic status indicator */}
          <div className="absolute bottom-0 right-0 p-2 rounded-full bg-[#0A0D14] border border-slate-700 shadow-md">
            {isMicOn ? <Mic className="h-4 w-4 text-emerald-400" /> : <MicOff className="h-4 w-4 text-rose-500" />}
          </div>
        </div>

        <div className="space-y-1 max-w-md">
          <h3 className="text-2xl font-heading font-bold text-white tracking-tight">
            Ready to start your meeting?
          </h3>
          <p className="text-xs text-slate-400">
            Broadcasting as <strong className="text-white">{user?.fullName || 'Host Presenter'}</strong> (@{user?.customSlug || 'live'})
          </p>
        </div>

        {/* Device Pre-Check Controls */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={toggleMic}
            className={`p-3 rounded-full border transition-all cursor-pointer ${
              isMicOn
                ? 'bg-slate-800 border-slate-700 text-white hover:bg-slate-700'
                : 'bg-rose-600 border-rose-600 text-white'
            }`}
            title={isMicOn ? 'Microphone is on' : 'Microphone is muted'}
          >
            {isMicOn ? <Mic className="h-4 w-4" /> : <MicOff className="h-4 w-4" />}
          </button>

          <button
            type="button"
            onClick={toggleCam}
            className={`p-3 rounded-full border transition-all cursor-pointer ${
              isCamOn
                ? 'bg-[#0084FF] border-[#0084FF] text-white hover:bg-[#0074E0]'
                : 'bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700'
            }`}
            title={isCamOn ? 'Camera is on' : 'Camera is off'}
          >
            {isCamOn ? <Video className="h-4 w-4" /> : <VideoOff className="h-4 w-4" />}
          </button>
        </div>

        {/* Start Meeting Button */}
        <button
          type="button"
          disabled={isConnecting}
          onClick={handleStartMeeting}
          className="group relative inline-flex items-center justify-center gap-3 px-8 py-3.5 text-sm font-semibold text-white transition-all duration-200 ease-out hover:scale-[1.02] cursor-pointer shadow-lg shadow-blue-500/20"
          style={{
            backgroundColor: 'rgba(0, 132, 255, 0.92)',
            backdropFilter: 'blur(2px)',
            borderRadius: '16px',
            boxShadow: 'inset 0px 4px 4px 0px rgba(255, 255, 255, 0.35), 0 8px 20px rgba(0, 132, 255, 0.3)',
          }}
        >
          {isConnecting ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              <span>Connecting WebRTC Mesh...</span>
            </>
          ) : (
            <>
              <Play className="h-4 w-4 fill-white" />
              <span>Start Meeting Now</span>
            </>
          )}
        </button>

      </div>
    );
  }

  // 4. LIVE MEETING STAGE
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
            className="w-full h-full object-contain bg-slate-950"
          />
          {/* PiP Host Floating Overlay over Screen Share */}
          {isCamOn && localCamStream ? (
            <div className="absolute bottom-20 right-4 w-48 h-32 rounded-2xl overflow-hidden border-2 border-[#0084FF] shadow-2xl z-30 bg-slate-900 animate-fade-in">
              <video
                ref={pipCamVideoRef}
                autoPlay
                playsInline
                muted
                className="w-full h-full object-cover scale-x-[-1] transform"
              />
              <div className="absolute bottom-2 left-2 px-2 py-0.5 rounded-md bg-black/60 backdrop-blur-md text-[10px] font-mono text-white flex items-center gap-1">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                <span>{user?.fullName || 'Host'}</span>
              </div>
            </div>
          ) : (
            <div className="absolute bottom-20 right-4 px-3 py-2 rounded-2xl border border-slate-700 bg-slate-900/90 backdrop-blur-md shadow-2xl z-30 flex items-center gap-2.5 animate-fade-in">
              <div className="h-8 w-8 rounded-full bg-[#0084FF] text-white font-bold text-xs flex items-center justify-center shadow-inner">
                {(user?.fullName || 'H').charAt(0).toUpperCase()}
              </div>
              <div className="text-left">
                <span className="text-xs font-semibold text-white block leading-tight">{user?.fullName || 'Host'}</span>
                <span className="text-[10px] font-mono text-emerald-400">● Presenting</span>
              </div>
            </div>
          )}
        </div>
      ) : isCamOn && localCamStream ? (
        /* 2. REAL CAMERA VIDEO FEED (Mirrored Horizontally for Natural Self-View) */
        <video
          ref={camVideoRef}
          autoPlay
          playsInline
          muted
          className="absolute inset-0 w-full h-full object-cover scale-x-[-1] transform"
        />
      ) : (
        /* 3. AI DIGITAL TWIN HOLOGRAPHIC PRESENCE */
        <div className="absolute inset-0 w-full h-full bg-gradient-to-b from-[#0F172A] via-[#0A0E1A] to-[#06080F] flex flex-col items-center justify-center p-6 text-center space-y-4 relative overflow-hidden select-none">
          
          {/* Ambient Holographic Glow & Neural Audio Waveforms */}
          <div className="absolute w-80 h-80 bg-blue-600/15 rounded-full blur-3xl pointer-events-none animate-pulse" />
          <div className="absolute w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

          {/* Holographic Avatar with Live Mic Audio Waveforms */}
          <div className="relative">
            {/* Live Audio Reaction Rings */}
            {isMicOn && (
              <>
                <span className="absolute -inset-4 rounded-full border border-blue-400/40 animate-ping opacity-60 pointer-events-none" />
                <span className="absolute -inset-8 rounded-full border border-blue-500/25 animate-pulse opacity-40 pointer-events-none" />
                <span className="absolute -inset-12 rounded-full border border-indigo-400/15 animate-ping opacity-20 pointer-events-none" />
              </>
            )}

            {user?.avatarUrl ? (
              <img
                src={user.avatarUrl}
                alt={user?.fullName || 'Host'}
                referrerPolicy="no-referrer"
                className="relative h-24 w-24 sm:h-28 sm:w-28 rounded-full border-2 border-[#0084FF] shadow-2xl object-cover bg-slate-800 shadow-blue-500/30"
              />
            ) : (
              <div className="relative h-24 w-24 sm:h-28 sm:w-28 rounded-full bg-gradient-to-tr from-blue-900 via-slate-800 to-indigo-900 border-2 border-[#0084FF] shadow-2xl flex items-center justify-center text-white text-3xl font-heading font-bold shadow-blue-500/30">
                {(user?.fullName || 'H').charAt(0).toUpperCase()}
              </div>
            )}

            {/* Quick mic status indicator */}
            <div className="absolute bottom-0 right-0 p-1.5 rounded-full bg-[#0A0D14] border border-slate-700 shadow-md">
              {isMicOn ? (
                <Mic className="h-4 w-4 text-emerald-400" />
              ) : (
                <MicOff className="h-4 w-4 text-rose-500" />
              )}
            </div>
          </div>

          <div className="relative z-10 flex items-center gap-2 max-w-md">
            {showHostControls && isEditingName ? (
              <form onSubmit={handleSaveName} className="flex flex-wrap items-center gap-1.5 bg-slate-900/95 p-2 rounded-2xl border border-[#0084FF] shadow-2xl">
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
                    className="bg-transparent text-[#0084FF] font-bold outline-none font-mono w-24 pl-0.5"
                  />
                </div>
                <button
                  type="submit"
                  className="p-1.5 rounded-xl bg-[#0084FF] text-white hover:bg-[#0074E0] cursor-pointer"
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
              <div className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-900/95 border border-white/20 text-white shadow-lg backdrop-blur-md">
                <span className="text-xs font-bold text-white font-heading tracking-tight">
                  {user?.fullName || 'Host Presenter'}
                </span>
                <span className="text-[11px] font-mono text-[#0084FF] font-bold">
                  @{user?.customSlug || 'live'}
                </span>
                {showHostControls && (
                  <button
                    type="button"
                    onClick={() => setIsEditingName(true)}
                    className="p-0.5 text-slate-300 hover:text-[#0084FF] cursor-pointer"
                    title="Rename display name & handle"
                  >
                    <Edit2 className="h-3 w-3 ml-0.5" />
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Floating Host Admission Notification (Google Meet / Zoom Knock Banner) */}
      {showHostControls && waitingParticipants.length > 0 && (
        <div className="absolute top-16 right-4 z-40 max-w-sm w-full bg-slate-900/95 backdrop-blur-xl border border-[#0084FF]/40 rounded-3xl p-4 shadow-2xl text-white space-y-3 animate-slide-up select-none">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
            <div className="flex items-center gap-2">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#0084FF] opacity-75" />
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#0084FF]" />
              </span>
              <span className="text-xs font-heading font-bold text-white">Join Request ({waitingParticipants.length})</span>
            </div>
            <span className="text-[10px] font-mono text-slate-400">Waiting Lobby</span>
          </div>

          <div className="space-y-2 max-h-60 overflow-y-auto">
            {waitingParticipants.map((guest) => (
              <div key={guest.id} className="flex items-center justify-between gap-2.5 p-2.5 rounded-2xl bg-slate-800/90 border border-slate-700/80 hover:border-slate-600 transition-all">
                <div className="flex items-center gap-2.5 min-w-0">
                  <img
                    src={guest.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${guest.name}`}
                    alt={guest.name}
                    className="h-8 w-8 rounded-full bg-slate-700 object-cover border border-slate-600 shrink-0"
                  />
                  <div className="min-w-0">
                    <span className="text-xs font-bold text-white block truncate">{guest.name}</span>
                    <span className="text-[10px] font-mono text-[#60B1FF] block truncate">
                      {guest.location || 'Live Attendee 🌐'}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 shrink-0">
                  <button
                    type="button"
                    onClick={() => admitParticipant(guest.id)}
                    className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-[#0084FF] hover:bg-[#0074E0] text-white flex items-center gap-1 cursor-pointer shadow-sm transition-all"
                  >
                    <UserCheck className="h-3.5 w-3.5" />
                    <span>Admit</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => denyParticipant(guest.id)}
                    className="p-1.5 rounded-xl text-slate-400 hover:text-rose-400 hover:bg-slate-700 cursor-pointer transition-all"
                    title="Deny entry"
                  >
                    <UserX className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Top Meeting Status Bar */}
      <div className="relative z-20 flex items-center justify-between p-4 bg-gradient-to-b from-black/60 to-transparent">
        <div className="flex items-center gap-2">
          <span className="flex items-center gap-1.5 text-[11px] font-semibold text-white bg-slate-900/90 backdrop-blur-md px-3 py-1 rounded-full border border-white/15 font-mono">
            <span className={`h-2 w-2 rounded-full ${isLive ? 'bg-rose-500 animate-pulse' : 'bg-slate-400'}`} />
            <span>{isLive ? formatDuration(streamDuration) : '00:00'}</span>
          </span>

          <span className="flex items-center gap-1 text-[11px] font-semibold text-slate-200 bg-slate-900/80 backdrop-blur-md px-2.5 py-1 rounded-full border border-white/10 font-mono">
            <Users className="h-3 w-3 text-slate-400" />
            <span>{viewerCount}</span>
          </span>
        </div>

        <div className="flex items-center gap-2">
          <span className="flex items-center gap-1.5 text-[11px] font-bold text-emerald-400 bg-slate-900/90 backdrop-blur-md px-3 py-1 rounded-full border border-white/15 font-mono">
            <span className="h-2 w-2 rounded-full bg-emerald-500" />
            <span>{showHostControls ? 'Host' : 'Attendee'}</span>
            <span className="text-slate-500">•</span>
            <span className="text-slate-300">@{user?.customSlug || 'live'}</span>
          </span>
        </div>
      </div>

      {/* Subtitle Overlay */}
      <SubtitleOverlay />

      {/* Bottom Floating Control Dock */}
      <div className="relative z-30 p-4 flex items-center justify-center">
        <div className="flex items-center gap-2 sm:gap-3 bg-slate-950/90 backdrop-blur-2xl px-4 py-2.5 rounded-full border border-white/15 shadow-2xl">
          
          {/* Volume */}
          <button
            type="button"
            onClick={toggleMute}
            className="p-2.5 rounded-full text-slate-300 hover:text-white hover:bg-slate-800/80 transition-all cursor-pointer"
          >
            {isMuted ? <VolumeX className="h-4 w-4 text-rose-400" /> : <Volume2 className="h-4 w-4" />}
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
            className="w-14 sm:w-20 h-1 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-[#0084FF]"
          />

          <div className="h-5 w-px bg-slate-800" />

          {/* Mic Toggle */}
          <button
            type="button"
            onClick={toggleMic}
            className={`p-2.5 sm:px-4 sm:py-2 rounded-full font-semibold text-xs flex items-center gap-1.5 transition-all cursor-pointer ${
              isMicOn
                ? 'bg-slate-800 text-white hover:bg-slate-700 border border-slate-700'
                : 'bg-rose-600 text-white hover:bg-rose-700'
            }`}
          >
            {isMicOn ? <Mic className="h-4 w-4" /> : <MicOff className="h-4 w-4" />}
            <span className="hidden sm:inline">{isMicOn ? 'Mute' : 'Unmute'}</span>
          </button>

          {/* Camera Toggle */}
          <button
            type="button"
            onClick={toggleCam}
            className={`p-2.5 sm:px-4 sm:py-2 rounded-full font-semibold text-xs flex items-center gap-1.5 transition-all cursor-pointer ${
              isCamOn
                ? 'bg-[#0084FF] text-white hover:bg-[#0074E0]'
                : 'bg-rose-600 text-white hover:bg-rose-700'
            }`}
          >
            {isCamOn ? <Video className="h-4 w-4" /> : <VideoOff className="h-4 w-4" />}
            <span className="hidden sm:inline">{isCamOn ? 'Stop Video' : 'Start Video'}</span>
          </button>

          {/* Screen Share (Host or permitted guest) */}
          {showHostControls && (
            <>
              <button
                type="button"
                onClick={toggleScreenShare}
                className={`p-2.5 sm:px-4 sm:py-2 rounded-full font-semibold text-xs flex items-center gap-1.5 transition-all cursor-pointer ${
                  isScreenSharing
                    ? 'bg-emerald-600 text-white hover:bg-emerald-700'
                    : 'bg-slate-800 text-slate-200 hover:bg-slate-700 border border-slate-700'
                }`}
              >
                <MonitorUp className="h-4 w-4" />
                <span className="hidden sm:inline">{isScreenSharing ? 'Stop Share' : 'Share Screen'}</span>
              </button>

              <button
                type="button"
                onClick={handleToggleRecording}
                className={`p-2.5 sm:px-4 sm:py-2 rounded-full font-semibold text-xs flex items-center gap-1.5 transition-all cursor-pointer ${
                  isRecording
                    ? 'bg-rose-600 text-white animate-pulse shadow-lg shadow-rose-600/30'
                    : 'bg-slate-800 text-slate-200 hover:bg-slate-700 border border-slate-700'
                }`}
                title={isRecording ? 'Stop Recording and Save Video' : 'Record Meeting'}
              >
                <span className={`h-2 w-2 rounded-full ${isRecording ? 'bg-white animate-ping' : 'bg-rose-500'}`} />
                <span className="hidden sm:inline">
                  {isRecording ? `REC (${formatDuration(recordingSeconds)})` : 'Record'}
                </span>
              </button>
            </>
          )}

          {/* Leave / End Call */}
          <button
            type="button"
            onClick={() => {
              if (showHostControls) {
                setIsMeetingStarted(false);
                setShowProSummary(true);
                if (isLive) toggleLiveStatus();
              } else {
                setIsGuestJoined(false);
                setHasKnocked(false);
              }
            }}
            className="p-2.5 sm:px-4 sm:py-2 rounded-full font-semibold text-xs bg-rose-600 hover:bg-rose-700 text-white flex items-center gap-1.5 transition-all cursor-pointer shadow-lg shadow-rose-900/30"
          >
            <PhoneOff className="h-4 w-4" />
            <span className="hidden sm:inline">{showHostControls ? 'End Meeting' : 'Leave Meeting'}</span>
          </button>

          <div className="h-5 w-px bg-slate-800" />

          {/* Native OS Picture-in-Picture */}
          <button
            type="button"
            onClick={toggleNativePiP}
            className="p-2 rounded-full text-slate-400 hover:text-white hover:bg-slate-800 transition-all cursor-pointer"
            title="Pop out video (Picture-in-Picture)"
          >
            <PictureInPicture2 className="h-4 w-4" />
          </button>

          {/* Fullscreen */}
          <button
            type="button"
            onClick={toggleFullscreen}
            className="p-2 rounded-full text-slate-400 hover:text-white hover:bg-slate-800 transition-all cursor-pointer"
            title="Toggle Fullscreen"
          >
            {isFullscreen ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
          </button>

        </div>
      </div>

      {/* Post-Meeting Summary & Pro Upgrade Modal */}
      {showHostControls && (
        <PostMeetingProModal
          isOpen={showProSummary}
          onClose={() => setShowProSummary(false)}
        />
      )}
    </div>
  );
};
