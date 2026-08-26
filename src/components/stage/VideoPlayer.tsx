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
  Play,
  Loader2,
  User,
  ArrowRight,
  ShieldCheck,
  Languages,
  Sparkles,
  CheckCircle2,
} from 'lucide-react';
import { useStream, SupportedLanguage } from '../../context/StreamContext';
import { useAuth } from '../../context/AuthContext';
import { SubtitleOverlay } from './SubtitleOverlay';
import { PostMeetingProModal } from '../common/PostMeetingProModal';
import { RecordingDownloadModal } from './RecordingDownloadModal';
import { ParticipantGrid } from './ParticipantGrid';
import { SUPPORTED_LANGUAGES } from '../../data/mockData';

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
    isGuestJoined,
    setIsGuestJoined,
    isAiTranslationActive,
    toggleAiTranslation,
    currentLanguage,
    setLanguage,
    requestJoinRoom,
    joinedParticipants,
    activeSpeakerId,
  } = useStream();

  const { user, updateProfile } = useAuth();

  const [pinnedSpeakerId, setPinnedSpeakerId] = useState<string | null>(null);

  const [isMeetingStarted, setIsMeetingStarted] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [volume, setVolume] = useState(0.85);
  const [showProSummary, setShowProSummary] = useState(false);
  const [isCaptionsOpen, setIsCaptionsOpen] = useState(false);

  // Guest join state
  const [guestName, setGuestName] = useState(user?.fullName || '');
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
  const [recordedBlobUrl, setRecordedBlobUrl] = useState<string | null>(null);
  const [showDownloadModal, setShowDownloadModal] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const recordedChunksRef = useRef<Blob[]>([]);

  // Female voice announcement for recording
  const playVoiceAnnouncement = (text: string) => {
    try {
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.rate = 1.0;
        utterance.pitch = 1.05;
        const voices = window.speechSynthesis.getVoices();
        const femaleVoice = voices.find(
          (v) =>
            v.lang.startsWith('en') &&
            (v.name.toLowerCase().includes('female') ||
              v.name.toLowerCase().includes('samantha') ||
              v.name.toLowerCase().includes('google us english') ||
              v.name.toLowerCase().includes('zira') ||
              v.name.toLowerCase().includes('karen'))
        ) || voices.find((v) => v.lang.startsWith('en'));
        if (femaleVoice) utterance.voice = femaleVoice;
        window.speechSynthesis.speak(utterance);
      }
    } catch {
      // Audio note
    }
  };

  // Recording Timer with auto-stop protection at 45 minutes (2700 seconds)
  useEffect(() => {
    let interval: any;
    if (isRecording) {
      interval = setInterval(() => {
        setRecordingSeconds((prev) => {
          if (prev >= 2700) { // 45 minute safe ceiling
            handleToggleRecording();
            return 2700;
          }
          return prev + 1;
        });
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
      playVoiceAnnouncement('Recording has stopped.');
      setIsRecording(false);
    } else {
      try {
        // Compose high-end stream using canvas capture + audio mixer
        let streamToRecord: MediaStream | null = null;
        
        if (pipCanvasRef.current) {
          streamToRecord = pipCanvasRef.current.captureStream(30);
        } else if (isScreenSharing && localScreenStream) {
          streamToRecord = localScreenStream;
        } else if (isCamOn && localCamStream) {
          streamToRecord = localCamStream;
        }

        if (!streamToRecord) {
          alert('Start camera or screen share to begin recording.');
          return;
        }

        // Attach microphone audio track to the video capture
        if (localCamStream && localCamStream.getAudioTracks().length > 0) {
          const audioTrack = localCamStream.getAudioTracks()[0];
          if (!streamToRecord.getAudioTracks().some((t) => t.id === audioTrack.id)) {
            streamToRecord.addTrack(audioTrack);
          }
        }

        recordedChunksRef.current = [];
        const mimeType = MediaRecorder.isTypeSupported('video/webm;codecs=vp9,opus')
          ? 'video/webm;codecs=vp9,opus'
          : MediaRecorder.isTypeSupported('video/webm;codecs=vp8,opus')
          ? 'video/webm;codecs=vp8,opus'
          : 'video/webm';

        const recorder = new MediaRecorder(streamToRecord, {
          mimeType,
          videoBitsPerSecond: 2500000, // 2.5 Mbps crisp 1080p
        });

        recorder.ondataavailable = (e) => {
          if (e.data && e.data.size > 0) {
            recordedChunksRef.current.push(e.data);
          }
        };

        recorder.onstop = () => {
          const blob = new Blob(recordedChunksRef.current, { type: 'video/webm' });
          const url = URL.createObjectURL(blob);
          setRecordedBlobUrl(url);
          setShowDownloadModal(true);
        };

        recorder.start(1000);
        mediaRecorderRef.current = recorder;
        setIsRecording(true);
        playVoiceAnnouncement('This meeting is being recorded.');
      } catch (err) {
        console.warn('Recording engine note:', err);
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
    }, 600);
  };

  const handleGuestKnock = async () => {
    if (!guestName.trim()) return;
    setIsConnecting(true);
    await requestJoinRoom(guestName.trim());
    setTimeout(() => {
      setIsConnecting(false);
      setHasKnocked(true);
      setIsWaitingInLobby(true);
    }, 400);
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
  
  // Hidden Canvas & Video for OS PiP & High-Fidelity Recording
  const pipCanvasRef = useRef<HTMLCanvasElement>(null);
  const pipStreamVideoRef = useRef<HTMLVideoElement>(null);

  // Format live duration
  const formatDuration = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const s = secs % 60;
    return `${mins.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
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

  // Canvas Painter for Stage & High-Fidelity Capture
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
      <div className="w-full bg-white rounded-3xl border border-slate-200/90 shadow-2xl p-8 sm:p-12 flex flex-col items-center justify-center text-center space-y-6 font-['Plus_Jakarta_Sans',sans-serif]">
        <div className="relative">
          <div className="h-24 w-24 rounded-full bg-blue-50 border-2 border-[#0084FF] flex items-center justify-center animate-pulse">
            <Radio className="h-10 w-10 text-[#0084FF]" />
          </div>
          <span className="absolute -bottom-1 -right-1 flex h-4 w-4">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-4 w-4 bg-emerald-500" />
          </span>
        </div>

        <div className="space-y-2 max-w-md">
          <h3 className="text-2xl sm:text-3xl font-heading font-bold text-[#0f172a] tracking-tight">
            Waiting for the host to let you in...
          </h3>
          <p className="text-sm text-slate-500 leading-relaxed">
            The host has received your join request. You will be connected automatically when admitted.
          </p>
        </div>

        <div className="px-5 py-2.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs font-mono text-slate-700">
          Joining as: <strong className="text-slate-900 font-bold">{guestName || 'Attendee'}</strong>
        </div>
      </div>
    );
  }

  // 2. GUEST PRE-JOIN SCREEN (Real-time Name & Avatar synchronization)
  if (!showHostControls && !isGuestJoined) {
    return (
      <div className="w-full font-['Plus_Jakarta_Sans',sans-serif]">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 xl:gap-16 items-center">
          
          {/* Left Column: Standalone 16:9 HD Camera Preview */}
          <div className="lg:col-span-7 relative aspect-video bg-slate-950 rounded-3xl overflow-hidden shadow-2xl flex items-center justify-center border border-slate-800">
            {isCamOn && localCamStream ? (
              <video
                ref={guestLobbyCamRef}
                autoPlay
                playsInline
                muted
                className="w-full h-full object-cover scale-x-[-1] transform"
              />
            ) : (
              /* Real-time Dynamic Name & Initial Avatar */
              <div className="flex flex-col items-center justify-center space-y-2 text-slate-300">
                <div className="h-20 w-20 rounded-full bg-slate-900 border-2 border-slate-700 flex items-center justify-center text-white text-2xl font-heading font-bold shadow-inner">
                  {(guestName.trim() || 'Y').charAt(0).toUpperCase()}
                </div>
                <div className="text-center">
                  <strong className="text-sm font-bold text-white block">
                    {guestName.trim() || 'Your Name'}
                  </strong>
                  <span className="text-[11px] font-mono text-slate-400">Camera is off</span>
                </div>
              </div>
            )}

            {/* Bottom-Left Corner Name Tag (Google Meet & Zoom Standard) */}
            <div className="absolute bottom-4 left-4 z-20 px-3 py-1.5 rounded-xl bg-black/65 backdrop-blur-md text-white text-xs font-semibold flex items-center gap-2 shadow-lg border border-white/15 max-w-[200px] truncate pointer-events-none">
              <span className="h-2 w-2 rounded-full bg-emerald-400 shrink-0" />
              <span className="truncate">{guestName.trim() || 'Your Name'}</span>
            </div>

            {/* Floating Device Controls Overlay at the bottom of the video */}
            <div className="absolute bottom-4 right-4 sm:left-1/2 sm:right-auto sm:transform sm:-translate-x-1/2 flex items-center gap-3 bg-slate-900/90 backdrop-blur-xl px-4 py-2 rounded-full border border-white/15 shadow-2xl z-20">
              <button
                type="button"
                onClick={toggleMic}
                className={`p-2.5 rounded-full border transition-all cursor-pointer ${
                  isMicOn
                    ? 'bg-slate-800 border-slate-700 text-white hover:bg-slate-700'
                    : 'bg-rose-600 border-rose-600 text-white'
                }`}
                title={isMicOn ? 'Mute microphone' : 'Unmute microphone'}
              >
                {isMicOn ? <Mic className="h-4 w-4" /> : <MicOff className="h-4 w-4" />}
              </button>

              <button
                type="button"
                onClick={toggleCam}
                className={`p-2.5 rounded-full border transition-all cursor-pointer ${
                  isCamOn
                    ? 'bg-[#0084FF] border-[#0084FF] text-white hover:bg-[#0074E0]'
                    : 'bg-rose-600 border-rose-600 text-white'
                }`}
                title={isCamOn ? 'Stop video' : 'Start video'}
              >
                {isCamOn ? <Video className="h-4 w-4" /> : <VideoOff className="h-4 w-4" />}
              </button>
            </div>
          </div>

          {/* Right Column: Enter Meeting Info (Separate Dedicated Floating White Card) */}
          <div className="lg:col-span-5 bg-white rounded-3xl border border-slate-200/90 shadow-xl p-8 sm:p-10 flex flex-col justify-center text-left space-y-6">
            <div className="space-y-1.5">
              <h3 className="text-2xl sm:text-3xl font-heading font-bold text-[#0f172a] tracking-tight">
                Enter Meeting Info
              </h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Check your camera &amp; mic before requesting entry.
              </p>
            </div>

            <form onSubmit={(e) => { e.preventDefault(); handleGuestKnock(); }} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Your Display Name
                </label>
                <div className="relative">
                  <User className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-400" />
                  <input
                    type="text"
                    required
                    autoFocus
                    value={guestName}
                    onChange={(e) => setGuestName(e.target.value)}
                    placeholder="e.g. Alex Rivera"
                    className="w-full pl-10 pr-4 py-3 rounded-2xl border border-slate-200 bg-slate-50 focus:bg-white text-slate-900 text-sm font-semibold focus:outline-none focus:border-[#0084FF] shadow-sm font-sans"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={!guestName.trim() || isConnecting}
                className="w-full py-4 px-6 rounded-2xl bg-[#0084FF] hover:bg-[#0074E0] text-white text-sm font-semibold flex items-center justify-center gap-2 shadow-lg shadow-blue-500/25 cursor-pointer disabled:opacity-50 transition-all hover:scale-[1.01]"
              >
                {isConnecting ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>Knocking Room Door...</span>
                  </>
                ) : (
                  <>
                    <span>Ask to Join Meeting</span>
                    <ArrowRight className="h-4 w-4" />
                  </>
                )}
              </button>
            </form>

            <div className="pt-2 text-[11px] text-slate-400 flex items-center gap-1.5">
              <ShieldCheck className="h-3.5 w-3.5 text-emerald-500 shrink-0" />
              <span>100% Encrypted WebRTC Session • Zero Downloads</span>
            </div>
          </div>

        </div>
      </div>
    );
  }

  // 3. HOST PRE-MEETING GREEN ROOM (Widescreen Studio Preview)
  if (showHostControls && !isMeetingStarted && !isLive) {
    return (
      <div className="w-full bg-white rounded-3xl border border-slate-200/90 shadow-2xl p-6 sm:p-10 lg:p-12 font-['Plus_Jakarta_Sans',sans-serif]">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          
          {/* Left Column: 16:9 HD Camera Preview */}
          <div className="lg:col-span-7 relative aspect-video bg-slate-950 rounded-3xl overflow-hidden shadow-2xl flex items-center justify-center border border-slate-800">
            {isCamOn && localCamStream ? (
              <video
                ref={greenRoomCamRef}
                autoPlay
                playsInline
                muted
                className="w-full h-full object-cover scale-x-[-1] transform"
              />
            ) : user?.avatarUrl ? (
              <img
                src={user.avatarUrl}
                alt={user?.fullName || 'Host'}
                referrerPolicy="no-referrer"
                className="h-28 w-28 rounded-full border-2 border-[#0084FF] shadow-2xl object-cover bg-slate-800"
              />
            ) : (
              <div className="h-28 w-28 rounded-full bg-slate-900 border-2 border-slate-800 shadow-2xl flex items-center justify-center text-white text-3xl font-heading font-bold">
                {(user?.fullName || 'H').charAt(0).toUpperCase()}
              </div>
            )}

            {/* Bottom-Left Corner Name Tag (Google Meet & Zoom Standard) */}
            <div className="absolute bottom-4 left-4 z-20 px-3 py-1.5 rounded-xl bg-black/65 backdrop-blur-md text-white text-xs font-semibold flex items-center gap-2 shadow-lg border border-white/15 max-w-[200px] truncate pointer-events-none">
              <span className="h-2 w-2 rounded-full bg-emerald-400 shrink-0" />
              <span className="truncate">{user?.fullName || 'Host Presenter'}</span>
            </div>

            {/* Floating Device Controls */}
            <div className="absolute bottom-4 right-4 sm:left-1/2 sm:right-auto sm:transform sm:-translate-x-1/2 flex items-center gap-3 bg-slate-900/90 backdrop-blur-xl px-4 py-2 rounded-full border border-white/15 shadow-2xl z-20">
              <button
                type="button"
                onClick={toggleMic}
                className={`p-2.5 rounded-full border transition-all cursor-pointer ${
                  isMicOn
                    ? 'bg-slate-800 border-slate-700 text-white hover:bg-slate-700'
                    : 'bg-rose-600 border-rose-600 text-white'
                }`}
                title={isMicOn ? 'Mute microphone' : 'Unmute microphone'}
              >
                {isMicOn ? <Mic className="h-4 w-4" /> : <MicOff className="h-4 w-4" />}
              </button>

              <button
                type="button"
                onClick={toggleCam}
                className={`p-2.5 rounded-full border transition-all cursor-pointer ${
                  isCamOn
                    ? 'bg-[#0084FF] border-[#0084FF] text-white hover:bg-[#0074E0]'
                    : 'bg-rose-600 border-rose-600 text-white'
                }`}
                title={isCamOn ? 'Stop video' : 'Start video'}
              >
                {isCamOn ? <Video className="h-4 w-4" /> : <VideoOff className="h-4 w-4" />}
              </button>
            </div>
          </div>

          {/* Right Column: Host Room Details & Start Button */}
          <div className="lg:col-span-5 flex flex-col justify-center text-left space-y-6">
            <div className="space-y-1.5">
              <h3 className="text-2xl sm:text-3xl font-heading font-bold text-[#0f172a] tracking-tight">
                Ready to start meeting?
              </h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Broadcasting as <strong className="text-slate-900 font-bold">{user?.fullName || 'Host Presenter'}</strong> (@{user?.customSlug || 'live'}).
              </p>
            </div>

            {/* Waiting Guests Alert Banner if people knocked while host was in green room */}
            {waitingParticipants.length > 0 && (
              <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-900 flex items-center justify-between gap-3 animate-pulse">
                <div className="flex items-center gap-2.5">
                  <div className="h-7 w-7 rounded-full bg-amber-500 text-white font-bold text-xs flex items-center justify-center">
                    {waitingParticipants.length}
                  </div>
                  <div className="text-left">
                    <strong className="text-xs font-bold block text-slate-900">
                      {waitingParticipants.length === 1 ? '1 guest is waiting in the lobby' : `${waitingParticipants.length} guests are waiting in the lobby`}
                    </strong>
                    <span className="text-[11px] text-slate-500">
                      {waitingParticipants.map((p) => p.name).join(', ')}
                    </span>
                  </div>
                </div>
                <span className="text-[11px] font-bold text-amber-700 bg-amber-100 px-2.5 py-1 rounded-full">
                  Waiting
                </span>
              </div>
            )}

            <button
              type="button"
              disabled={isConnecting}
              onClick={handleStartMeeting}
              className="w-full py-4 px-6 rounded-2xl bg-[#0084FF] hover:bg-[#0074E0] text-white text-sm font-semibold flex items-center justify-center gap-2.5 shadow-lg shadow-blue-500/25 cursor-pointer disabled:opacity-50 transition-all hover:scale-[1.01]"
            >
              {isConnecting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Starting Meeting...</span>
                </>
              ) : (
                <>
                  <Play className="h-4 w-4 fill-white" />
                  <span>Start Meeting Now</span>
                </>
              )}
            </button>

            <div className="pt-2 text-[11px] text-slate-400 flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>WebRTC Mesh Global Relay: Active</span>
            </div>
          </div>

        </div>
      </div>
    );
  }

  // 4. LIVE IN-MEETING VIDEO STAGE
  return (
    <div
      ref={containerRef}
      className="relative w-full h-full min-h-[380px] bg-[#0A0D14] rounded-3xl overflow-hidden shadow-2xl border border-slate-800/90 flex flex-col justify-between select-none group font-sans"
    >
      {/* Hidden Canvas & Video for OS PiP & High-Fidelity 1080p Recording */}
      <canvas ref={pipCanvasRef} width={1280} height={720} className="hidden" />
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
      ) : (
        /* 2. DYNAMIC MULTI-PARTICIPANT RESPONSIVE GALLERY GRID (Zoom & Google Meet Standard) */
        <div className="absolute inset-0 w-full h-full">
          <ParticipantGrid
            participants={joinedParticipants}
            activeSpeakerId={activeSpeakerId}
            isCamOn={isCamOn}
            localCamStream={localCamStream}
            camVideoRef={camVideoRef}
            showHostControls={showHostControls}
            pinnedSpeakerId={pinnedSpeakerId}
            onPinSpeaker={(id) => setPinnedSpeakerId(id === pinnedSpeakerId ? null : id)}
          />
        </div>
      )}

      {/* Top Floating Status Indicator inside Video (Clean, 0 duplicate timers) */}
      <div className="relative z-30 p-3 sm:p-4 flex items-center justify-between pointer-events-none">
        <div className="flex items-center gap-2">
          <span className="flex items-center gap-1 text-[11px] font-medium text-slate-300 bg-black/60 backdrop-blur-md px-3 py-1 rounded-full border border-white/10">
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

      {/* Subtitle Overlay (Live Speech & AI Translation) */}
      <SubtitleOverlay />

      {/* Captions Language Selection Dropdown Menu - Positioned cleanly above dock without overflow clipping */}
      {isCaptionsOpen && (
        <div className="absolute bottom-20 left-1/2 transform -translate-x-1/2 w-64 bg-slate-900/98 backdrop-blur-2xl rounded-2xl border border-slate-700 shadow-2xl p-3.5 z-50 text-left space-y-3 animate-slide-up text-white">
          <div className="flex items-center justify-between pb-2 border-b border-slate-800">
            <div className="flex items-center gap-1.5 text-xs font-bold font-heading">
              <Sparkles className="h-3.5 w-3.5 text-purple-400" />
              <span>Live AI Captions</span>
            </div>
            <button
              type="button"
              onClick={toggleAiTranslation}
              className={`px-2.5 py-1 rounded-lg text-[10px] font-bold transition-all cursor-pointer ${
                isAiTranslationActive
                  ? 'bg-purple-600 text-white'
                  : 'bg-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              {isAiTranslationActive ? 'ON' : 'OFF'}
            </button>
          </div>

          <div className="space-y-1.5">
            <label className="block text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
              Translate To Language (OpenAI gpt-4o-mini):
            </label>
            <div className="max-h-48 overflow-y-auto space-y-1 pr-1">
              {SUPPORTED_LANGUAGES.map((lang) => (
                <button
                  key={lang.code}
                  type="button"
                  onClick={() => {
                    setLanguage(lang.code as SupportedLanguage);
                    if (!isAiTranslationActive) toggleAiTranslation();
                    setIsCaptionsOpen(false);
                  }}
                  className={`w-full px-2.5 py-1.5 rounded-xl text-xs flex items-center justify-between transition-all cursor-pointer ${
                    currentLanguage === lang.code
                      ? 'bg-purple-600/30 text-purple-300 font-bold border border-purple-500/40'
                      : 'hover:bg-slate-800 text-slate-300'
                  }`}
                >
                  <span className="flex items-center gap-2">
                    <span>{lang.flag}</span>
                    <span>{lang.name}</span>
                  </span>
                  {currentLanguage === lang.code && (
                    <CheckCircle2 className="h-3.5 w-3.5 text-purple-400" />
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Bottom Floating Control Dock */}
      <div className="relative z-30 p-2 sm:p-4 flex items-center justify-center w-full">
        <div className="flex items-center gap-1.5 sm:gap-3 bg-slate-950/90 backdrop-blur-2xl px-3 sm:px-4 py-2 sm:py-2.5 rounded-full border border-white/15 shadow-2xl max-w-full overflow-x-auto">
          
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
            className={`p-2 sm:px-3 sm:py-2 rounded-2xl font-semibold text-xs flex items-center gap-1.5 transition-all cursor-pointer ${
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
            className={`p-2 sm:px-3 sm:py-2 rounded-2xl font-semibold text-xs flex items-center gap-1.5 transition-all cursor-pointer ${
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
                className={`p-2 sm:px-3 sm:py-2 rounded-2xl font-semibold text-xs flex items-center gap-1.5 transition-all cursor-pointer ${
                  isScreenSharing
                    ? 'bg-emerald-600 text-white hover:bg-emerald-700'
                    : 'bg-slate-800 text-slate-200 hover:bg-slate-700 border border-slate-700'
                }`}
              >
                <MonitorUp className="h-4 w-4" />
                <span className="hidden sm:inline">{isScreenSharing ? 'Stop Share' : 'Share Screen'}</span>
              </button>

              {/* Record Button (Host Only) with Female Voice Announcement & Single Clock */}
              <button
                type="button"
                onClick={handleToggleRecording}
                className={`p-2 sm:px-3 sm:py-2 rounded-2xl font-semibold text-xs flex items-center gap-1.5 transition-all cursor-pointer ${
                  isRecording
                    ? 'bg-rose-600 text-white animate-pulse shadow-lg shadow-rose-600/30'
                    : 'bg-slate-800 text-slate-200 hover:bg-slate-700 border border-slate-700'
                }`}
                title={isRecording ? 'Stop Recording' : 'Record Meeting (HD)'}
              >
                <span className={`h-2 w-2 rounded-full ${isRecording ? 'bg-white animate-ping' : 'bg-rose-500'}`} />
                <span className="hidden sm:inline">
                  {isRecording ? `REC (${formatDuration(recordingSeconds)})` : 'Record'}
                </span>
              </button>
            </>
          )}

          {/* Captions / AI Live Translation Dropdown Button */}
          <button
            type="button"
            onClick={() => setIsCaptionsOpen(!isCaptionsOpen)}
            className={`p-2 sm:px-3 sm:py-2 rounded-2xl font-semibold text-xs flex items-center gap-1.5 transition-all cursor-pointer border ${
              isAiTranslationActive
                ? 'bg-purple-600 text-white border-purple-500 shadow-md shadow-purple-900/30'
                : 'bg-slate-800 text-slate-300 hover:text-white border-slate-700'
            }`}
            title="Live Captions & AI Translation"
          >
            <Languages className="h-4 w-4" />
            <span className="hidden md:inline">Captions</span>
          </button>

          {/* Leave / End Call */}
          <button
            type="button"
            onClick={() => {
              if (showHostControls) {
                setIsMeetingStarted(false);
                // Only show post-meeting pro summary if meeting ran for at least 5 minutes (300 seconds)
                if (streamDuration >= 300) {
                  setShowProSummary(true);
                }
                if (isLive) toggleLiveStatus();
              } else {
                setIsGuestJoined(false);
                setHasKnocked(false);
              }
            }}
            className="p-2 sm:px-3 sm:py-2 rounded-2xl font-semibold text-xs bg-rose-600 hover:bg-rose-700 text-white flex items-center gap-1.5 transition-all cursor-pointer shadow-lg shadow-rose-900/30 shrink-0"
          >
            <PhoneOff className="h-4 w-4" />
            <span className="hidden sm:inline">{showHostControls ? 'End Meeting' : 'Leave'}</span>
          </button>

          <div className="h-5 w-px bg-slate-800 shrink-0" />

          {/* Native OS Picture-in-Picture */}
          <button
            type="button"
            onClick={toggleNativePiP}
            className="p-2 sm:p-2.5 rounded-2xl text-slate-400 hover:text-white hover:bg-slate-800 transition-all cursor-pointer shrink-0"
            title="Pop out video (Picture-in-Picture)"
          >
            <PictureInPicture2 className="h-4 w-4" />
          </button>

          {/* Fullscreen */}
          <button
            type="button"
            onClick={toggleFullscreen}
            className="p-2 sm:p-2.5 rounded-2xl text-slate-400 hover:text-white hover:bg-slate-800 transition-all cursor-pointer shrink-0"
            title={isFullscreen ? 'Exit Fullscreen' : 'Enter Fullscreen'}
          >
            {isFullscreen ? <Minimize2 className="h-4 w-4 text-[#0084FF]" /> : <Maximize2 className="h-4 w-4" />}
          </button>

        </div>
      </div>

      {/* Post-Meeting Pro Conversion Summary Modal (5+ min sessions) */}
      <PostMeetingProModal
        isOpen={showProSummary}
        onClose={() => setShowProSummary(false)}
      />

      {/* Meeting Recording Preview & Download Modal */}
      <RecordingDownloadModal
        isOpen={showDownloadModal}
        videoBlobUrl={recordedBlobUrl}
        recordingDuration={recordingSeconds}
        onClose={() => setShowDownloadModal(false)}
        onDelete={() => {
          if (recordedBlobUrl) URL.revokeObjectURL(recordedBlobUrl);
          setRecordedBlobUrl(null);
          setShowDownloadModal(false);
        }}
      />
    </div>
  );
};
