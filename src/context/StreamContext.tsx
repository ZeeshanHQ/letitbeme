import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { translateLiveSpeech } from '../lib/openai';
import { ICE_SERVERS, WebRTCSignal } from '../lib/webrtc';
import { SUPPORTED_LANGUAGES } from '../data/mockData';

export type LayoutMode = 'split' | 'pip' | 'focus';
export type InteractiveWidgetType = 'none' | 'lead_gen' | 'checkout' | 'poll' | 'sandbox';
export type SupportedLanguage = 'en' | 'es' | 'fr' | 'de' | 'ja' | 'zh' | 'pt' | 'ar' | 'hi';

export interface ChatMessage {
  id: string;
  sender: string;
  avatar: string;
  message: string;
  timestamp: string;
  isPresenter?: boolean;
  badge?: string;
  pinnedAction?: {
    label: string;
    type: string;
  };
}

export interface FloatingReaction {
  id: string;
  emoji: string;
  x: number;
}

export interface SubtitleItem {
  originalText: string;
  translatedText: string;
  timestamp: string;
}

export interface ProductOffer {
  name: string;
  tagline: string;
  price: number;
  originalPrice: number;
  discountPercentage: number;
  features: string[];
  stockLeft: number;
  countdownSeconds: number;
  ctaText: string;
}

export interface PollOption {
  id: string;
  text: string;
  votes: number;
  percentage: number;
}

export interface PollData {
  question: string;
  options: PollOption[];
  totalVotes: number;
  hasVoted: boolean;
  userSelectedOption: string | null;
}

export interface AgendaItem {
  id: string;
  title: string;
  isDone: boolean;
}

export interface JoinedParticipant {
  id: string;
  name: string;
  avatar?: string;
  isHost?: boolean;
  isCamOn?: boolean;
  isMicOn?: boolean;
  isSpeaking?: boolean;
  audioLevel?: number;
}

export interface WaitingParticipant {
  id: string;
  name: string;
  avatar: string;
  location?: string;
  joinedAt: string;
}

export interface StreamState {
  isLive: boolean;
  streamId: string;
  streamTitle: string;
  title: string;
  presenterName: string;
  presenterRole: string;
  hostName: string;
  hostSlug: string;
  viewerCount: number;
  conversionRate: number;
  layoutMode: LayoutMode;
  activeWidget: InteractiveWidgetType;
  customEmbedUrl: string;
  joinedParticipants: JoinedParticipant[];
  activeSpeakerId: string | null;
  meetingNotes: string;
  productOffer: ProductOffer;
  offerPrice: number;
  offerTitle: string;
  pollData: PollData | null;
  agenda: AgendaItem[];
  isPresenterRole: boolean;
  isMicOn: boolean;
  isCamOn: boolean;
  isScreenSharing: boolean;
  audioLevel: number;
  currentLanguage: SupportedLanguage;
  isAiTranslationActive: boolean;
  latestSubtitle: SubtitleItem;
  streamDuration: number;
  messages: ChatMessage[];
  reactions: FloatingReaction[];
  hasCheckedOut: boolean;
  localCamStream: MediaStream | null;
  localScreenStream: MediaStream | null;
  remoteStreams: Record<string, MediaStream>;
  // Host Management & Waiting Room
  requireHostApproval: boolean;
  allowScreenShare: boolean;
  allowChat: boolean;
  muteOnEntry: boolean;
  waitingParticipants: WaitingParticipant[];
  isWaitingInLobby: boolean;
  isGuestJoined: boolean;
  isMeetingEnded: boolean;
}

interface StreamContextType extends StreamState {
  setIsMeetingEnded: (ended: boolean) => void;
  endMeeting: () => void;
  leaveMeeting: () => void;
  setIsGuestJoined: (joined: boolean) => void;
  setIsWaitingInLobby: (waiting: boolean) => void;
  setLayoutMode: (mode: LayoutMode) => void;
  setActiveWidget: (widget: InteractiveWidgetType) => void;
  setCustomEmbedUrl: (url: string) => void;
  setMeetingNotes: (notes: string) => void;
  setOfferPrice: (price: number) => void;
  setOfferTitle: (title: string) => void;
  setStreamTitle: (title: string) => void;
  votePoll: (optionId: string) => void;
  createPoll: (question: string, optionTexts: string[]) => void;
  resetPoll: () => void;
  deletePoll: () => void;
  toggleAgendaItem: (id: string) => void;
  addAgendaItem: (title: string) => void;
  deleteAgendaItem: (id: string) => void;
  setAgenda: (items: AgendaItem[]) => void;
  toggleMic: () => void;
  toggleCam: () => void;
  toggleScreenShare: () => void;
  toggleAiTranslation: () => void;
  setLanguage: (lang: SupportedLanguage) => void;
  triggerReaction: (emoji: string) => void;
  sendMessage: (msg: string) => void;
  triggerCheckoutCelebration: () => void;
  toggleLiveStatus: () => void;
  setIsPresenterRole: (isPresenter: boolean) => void;
  saveStreamToSupabase: () => Promise<void>;
  // Host management actions
  setRequireHostApproval: (req: boolean) => void;
  setAllowScreenShare: (allow: boolean) => void;
  setAllowChat: (allow: boolean) => void;
  setMuteOnEntry: (mute: boolean) => void;
  requestJoinRoom: (guestName: string) => Promise<void>;
  admitParticipant: (id: string) => void;
  denyParticipant: (id: string) => void;
  hostMuteParticipant: (id: string) => void;
  hostStopParticipantVideo: (id: string) => void;
  hostRemoveParticipant: (id: string) => void;
}

const StreamContext = createContext<StreamContextType | undefined>(undefined);

// Web Audio API doorbell chime
function playDoorbellChime() {
  try {
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContextClass) return;
    const ctx = new AudioContextClass();
    
    const now = ctx.currentTime;
    const osc1 = ctx.createOscillator();
    const gain1 = ctx.createGain();
    osc1.type = 'sine';
    osc1.frequency.setValueAtTime(587.33, now); // D5
    gain1.gain.setValueAtTime(0.25, now);
    gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.6);
    osc1.connect(gain1);
    gain1.connect(ctx.destination);
    osc1.start(now);
    osc1.stop(now + 0.6);

    const osc2 = ctx.createOscillator();
    const gain2 = ctx.createGain();
    osc2.type = 'sine';
    osc2.frequency.setValueAtTime(880.00, now + 0.25); // A5
    gain2.gain.setValueAtTime(0.3, now + 0.25);
    gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.9);
    osc2.connect(gain2);
    gain2.connect(ctx.destination);
    osc2.start(now + 0.25);
    osc2.stop(now + 0.9);
  } catch {
    // Ignore audio autoplay restrictions
  }
}

// Fetch attendee City & Country (Privacy friendly)
async function getAttendeeLocation(): Promise<string> {
  try {
    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone || '';
    const cityFromTz = tz.split('/')[1]?.replace(/_/g, ' ') || '';

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 1200);
    const res = await fetch('https://ipapi.co/json/', { signal: controller.signal });
    clearTimeout(timeout);

    if (res.ok) {
      const data = await res.json();
      if (data.city && data.country_name) {
        const flag = data.country_code
          ? String.fromCodePoint(...[...data.country_code.toUpperCase()].map((c) => 127397 + c.charCodeAt(0)))
          : '📍';
        return `${data.city}, ${data.country_name} ${flag}`;
      }
    }
    return cityFromTz ? `${cityFromTz}` : 'Live Attendee 🌐';
  } catch {
    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone || '';
    const city = tz.split('/')[1]?.replace(/_/g, ' ') || 'Global Member';
    return `${city} 🌐`;
  }
}

const DEFAULT_AGENDA: AgendaItem[] = [
  { id: '1', title: '1. Welcome & Meeting Overview', isDone: false },
  { id: '2', title: '2. Live Demo & Interactive Review', isDone: false },
  { id: '3', title: '3. Q&A & Action Items', isDone: false },
];

export const StreamProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isLive, setIsLive] = useState(false);
  const [streamId] = useState('stream-masterclass-2026');
  const [title, setTitle] = useState('Interactive Executive Meeting Room');
  const [presenterName, setPresenterName] = useState('Host Presenter');
  const [presenterRole, setPresenterRole] = useState('Host');
  const [hostName, setHostName] = useState('Host Presenter');
  const [hostSlug, setHostSlug] = useState('live');
  
  const [viewerCount, setViewerCount] = useState(1);
  const [conversionRate, setConversionRate] = useState(0);
  const [layoutMode, setLayoutModeState] = useState<LayoutMode>('split');
  const [activeWidget, setActiveWidgetState] = useState<InteractiveWidgetType>('sandbox');
  const [customEmbedUrl, setCustomEmbedUrlState] = useState('https://excalidraw.com');
  const [meetingNotes, setMeetingNotesState] = useState<string>(
    '# Meeting Notes\n\n- Welcome to the executive room.\n- Capture action items, bullet points, and live decisions here.\n- All participants can view synchronized notes in real-time.'
  );

  // Agenda State with Local Storage & Realtime Sync
  const [agenda, setAgendaState] = useState<AgendaItem[]>(() => {
    try {
      const saved = localStorage.getItem('letitbeme_agenda');
      if (saved) return JSON.parse(saved);
    } catch {}
    return DEFAULT_AGENDA;
  });
  
  const [isPresenterRole, setIsPresenterRole] = useState(() => {
    try {
      const params = new URLSearchParams(window.location.search);
      return params.get('view') === 'presenter' || window.location.pathname.includes('presenter');
    } catch {
      return false;
    }
  });
  const [isMicOn, setIsMicOn] = useState(true);
  const [isCamOn, setIsCamOn] = useState(false);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [audioLevel, setAudioLevel] = useState(65);
  const [currentLanguage, setCurrentLanguageState] = useState<SupportedLanguage>('en');
  const [isAiTranslationActive, setIsAiTranslationActive] = useState(false);
  const [hasCheckedOut, setHasCheckedOut] = useState(false);

  // Host Management Toggles
  const [requireHostApproval, setRequireHostApproval] = useState<boolean>(true);
  const [allowScreenShare, setAllowScreenShare] = useState<boolean>(true);
  const [allowChat, setAllowChat] = useState<boolean>(true);
  const [muteOnEntry, setMuteOnEntry] = useState<boolean>(false);
  
  // Waiting Room state
  const [waitingParticipants, setWaitingParticipants] = useState<WaitingParticipant[]>([]);
  const [isWaitingInLobby, setIsWaitingInLobby] = useState<boolean>(false);
  const [isGuestJoined, setIsGuestJoined] = useState<boolean>(false);
  const [isMeetingEnded, setIsMeetingEnded] = useState<boolean>(false);
  const myGuestIdRef = useRef<string>(localStorage.getItem('letitbeme_my_guest_id') || `guest-${Date.now()}`);

  const [localCamStream, setLocalCamStreamState] = useState<MediaStream | null>(null);
  const localCamStreamRef = useRef<MediaStream | null>(null);
  const setLocalCamStream = (stream: MediaStream | null) => {
    localCamStreamRef.current = stream;
    setLocalCamStreamState(stream);
  };
  const [localScreenStream, setLocalScreenStream] = useState<MediaStream | null>(null);

  const [latestSubtitle, setLatestSubtitle] = useState<SubtitleItem>({
    originalText: '',
    translatedText: '',
    timestamp: '',
  });
  const [streamDuration, setStreamDuration] = useState(0);
  
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [reactions, setReactions] = useState<FloatingReaction[]>([]);

  const [productOffer, setProductOffer] = useState<ProductOffer>({
    name: 'Pro Creator & Stream All-Access Pass',
    tagline: 'Only $19.99/month for unlimited 1080p60 WebRTC broadcasting, interactive sandboxes & AI translation.',
    price: 19.99,
    originalPrice: 49.99,
    discountPercentage: 60,
    features: [
      'Unlimited 1080p60 WebRTC Broadcasting',
      'Interactive App Sandboxes & Instant Checkout',
      'Real-Time AI Subtitles in 9+ Languages',
      'Zero Platform Cuts & HD Cloud Recordings',
    ],
    stockLeft: 24,
    countdownSeconds: 840,
    ctaText: 'Subscribe — Only $19.99/month',
  });

  // Joined Multi-Participant State (Zoom & Google Meet Gallery)
  const [joinedParticipants, setJoinedParticipants] = useState<JoinedParticipant[]>([
    {
      id: 'host-1',
      name: hostName || presenterName || 'Host Presenter',
      avatar: undefined,
      isHost: true,
      isCamOn: false,
      isMicOn: true,
      isSpeaking: true,
    },
  ]);
  const [activeSpeakerId, setActiveSpeakerId] = useState<string | null>('host-1');
  const [pollData, setPollData] = useState<PollData | null>(null);
  const [channel, setChannel] = useState<BroadcastChannel | null>(null);
  const [remoteStreams, setRemoteStreams] = useState<Record<string, MediaStream>>({});
  const peerConnectionsRef = useRef<Record<string, RTCPeerConnection>>({});
  const pendingIceCandidatesRef = useRef<Record<string, RTCIceCandidateInit[]>>({});
  const supabaseRealtimeChannelRef = useRef<any>(null);

  // Helper to determine the exact peer ID matching joinedParticipants
  const getMyPeerId = useCallback(() => {
    try {
      const params = new URLSearchParams(window.location.search);
      if (isPresenterRole || params.get('view') === 'presenter' || window.location.pathname.includes('presenter')) {
        return 'host-1';
      }
    } catch {}
    return myGuestIdRef.current;
  }, [isPresenterRole]);

  // Helper to send Supabase Realtime broadcasts on the single active subscribed channel
  const sendSupabaseBroadcast = (event: string, payload: any) => {
    if (isSupabaseConfigured && supabaseRealtimeChannelRef.current) {
      supabaseRealtimeChannelRef.current.send({
        type: 'broadcast',
        event,
        payload,
      });
    }
  };

  // Helper to send WebRTC signals across all 3 channels
  const sendWebRTCSignal = (signal: WebRTCSignal) => {
    channel?.postMessage({ type: 'WEBRTC_SIGNAL', payload: signal });
    localStorage.setItem('letitbeme_webrtc_signal', JSON.stringify({ ...signal, ts: Date.now() }));
    sendSupabaseBroadcast('WEBRTC_SIGNAL', signal);
  };

  const createPeerConnection = (targetPeerId: string, isInitiator: boolean) => {
    if (peerConnectionsRef.current[targetPeerId]) {
      return peerConnectionsRef.current[targetPeerId];
    }

    try {
      const pc = new RTCPeerConnection(ICE_SERVERS);
      peerConnectionsRef.current[targetPeerId] = pc;
      pendingIceCandidatesRef.current[targetPeerId] = [];

      // Ensure audio & video transceivers are configured
      pc.addTransceiver('video', { direction: 'sendrecv' });
      pc.addTransceiver('audio', { direction: 'sendrecv' });

      // Attach local stream tracks immediately if available
      const activeStream = localCamStreamRef.current || localCamStream;
      if (activeStream) {
        activeStream.getTracks().forEach((track) => {
          pc.addTrack(track, activeStream);
        });
      }

      pc.onicecandidate = (event) => {
        if (event.candidate) {
          sendWebRTCSignal({
            type: 'ICE_CANDIDATE',
            senderId: getMyPeerId(),
            targetId: targetPeerId,
            data: event.candidate,
            ts: Date.now(),
          });
        }
      };

      pc.ontrack = (event) => {
        const [stream] = event.streams;
        if (stream) {
          setRemoteStreams((prev) => ({
            ...prev,
            [targetPeerId]: stream,
          }));
        }
      };

      pc.onconnectionstatechange = () => {
        if (pc.connectionState === 'disconnected' || pc.connectionState === 'failed' || pc.connectionState === 'closed') {
          handleGuestLeft(targetPeerId);
        }
      };

      if (isInitiator) {
        pc.createOffer({ offerToReceiveAudio: true, offerToReceiveVideo: true })
          .then((offer) => pc.setLocalDescription(offer))
          .then(() => {
            sendWebRTCSignal({
              type: 'OFFER',
              senderId: getMyPeerId(),
              targetId: targetPeerId,
              data: pc.localDescription,
              ts: Date.now(),
            });
          })
          .catch((err) => console.warn('Offer error:', err));
      }

      return pc;
    } catch (err) {
      console.warn('Peer connection error:', err);
      return null as any;
    }
  };

  const handleWebRTCSignal = async (signal: WebRTCSignal) => {
    const myId = getMyPeerId();
    if (!signal || signal.senderId === myId) return;
    if (signal.targetId && signal.targetId !== myId) return;

    if (signal.type === 'PEER_JOINED') {
      // Create or renegotiate peer connection
      const pc = createPeerConnection(signal.senderId, true);
      if (pc) {
        const activeStream = localCamStreamRef.current || localCamStream;
        if (activeStream) {
          activeStream.getTracks().forEach((track) => {
            const senders = pc.getSenders();
            const existingSender = senders.find((s) => s.track?.kind === track.kind);
            if (existingSender) {
              existingSender.replaceTrack(track);
            } else {
              pc.addTrack(track, activeStream);
            }
          });
        }
        if (pc.signalingState === 'stable') {
          pc.createOffer({ offerToReceiveAudio: true, offerToReceiveVideo: true })
            .then((offer) => pc.setLocalDescription(offer))
            .then(() => {
              sendWebRTCSignal({
                type: 'OFFER',
                senderId: myId,
                targetId: signal.senderId,
                data: pc.localDescription,
                ts: Date.now(),
              });
            })
            .catch(() => {});
        }
      }
    } else if (signal.type === 'OFFER') {
      const pc = createPeerConnection(signal.senderId, false);
      if (pc) {
        const activeStream = localCamStreamRef.current || localCamStream;
        if (activeStream) {
          activeStream.getTracks().forEach((track) => {
            const senders = pc.getSenders();
            const existingSender = senders.find((s) => s.track?.kind === track.kind);
            if (existingSender) {
              existingSender.replaceTrack(track);
            } else {
              pc.addTrack(track, activeStream);
            }
          });
        }

        await pc.setRemoteDescription(new RTCSessionDescription(signal.data));
        
        // Process any queued candidates
        const queued = pendingIceCandidatesRef.current[signal.senderId] || [];
        for (const cand of queued) {
          try { await pc.addIceCandidate(new RTCIceCandidate(cand)); } catch {}
        }
        pendingIceCandidatesRef.current[signal.senderId] = [];

        const answer = await pc.createAnswer();
        await pc.setLocalDescription(answer);
        sendWebRTCSignal({
          type: 'ANSWER',
          senderId: myId,
          targetId: signal.senderId,
          data: pc.localDescription,
          ts: Date.now(),
        });
      }
    } else if (signal.type === 'ANSWER') {
      const pc = peerConnectionsRef.current[signal.senderId];
      if (pc && pc.signalingState !== 'stable') {
        await pc.setRemoteDescription(new RTCSessionDescription(signal.data));
        
        // Process any queued candidates
        const queued = pendingIceCandidatesRef.current[signal.senderId] || [];
        for (const cand of queued) {
          try { await pc.addIceCandidate(new RTCIceCandidate(cand)); } catch {}
        }
        pendingIceCandidatesRef.current[signal.senderId] = [];
      }
    } else if (signal.type === 'ICE_CANDIDATE') {
      const pc = peerConnectionsRef.current[signal.senderId];
      if (pc && pc.remoteDescription) {
        try {
          await pc.addIceCandidate(new RTCIceCandidate(signal.data));
        } catch {}
      } else {
        if (!pendingIceCandidatesRef.current[signal.senderId]) {
          pendingIceCandidatesRef.current[signal.senderId] = [];
        }
        pendingIceCandidatesRef.current[signal.senderId].push(signal.data);
      }
    }
  };

  const handleGuestLeft = (guestId: string) => {
    setJoinedParticipants((prev) => prev.filter((p) => p.id !== guestId));
    setViewerCount((prev) => Math.max(1, prev - 1));

    // Close WebRTC peer connection
    if (peerConnectionsRef.current[guestId]) {
      try {
        peerConnectionsRef.current[guestId].close();
      } catch {}
      delete peerConnectionsRef.current[guestId];
    }
    delete pendingIceCandidatesRef.current[guestId];

    // Remove remote stream
    setRemoteStreams((prev) => {
      const next = { ...prev };
      delete next[guestId];
      return next;
    });
  };

  // Host remote moderation actions
  const hostMuteParticipant = (id: string) => {
    setJoinedParticipants((prev) => {
      const updated = prev.map((p) => (p.id === id ? { ...p, isMicOn: !p.isMicOn } : p));
      channel?.postMessage({ type: 'SYNC_JOINED_PARTICIPANTS', payload: updated });
      localStorage.setItem('letitbeme_joined_participants', JSON.stringify({ payload: updated, ts: Date.now() }));
      sendSupabaseBroadcast('SYNC_JOINED_PARTICIPANTS', updated);
      return updated;
    });

    const signalPayload = { targetId: id, action: 'toggle_mic', ts: Date.now() };
    channel?.postMessage({ type: 'HOST_MODERATE_PARTICIPANT', payload: signalPayload });
    localStorage.setItem('letitbeme_host_moderate', JSON.stringify({ payload: signalPayload, ts: Date.now() }));
    sendSupabaseBroadcast('HOST_MODERATE_PARTICIPANT', signalPayload);
  };

  const hostStopParticipantVideo = (id: string) => {
    setJoinedParticipants((prev) => {
      const updated = prev.map((p) => (p.id === id ? { ...p, isCamOn: !p.isCamOn } : p));
      channel?.postMessage({ type: 'SYNC_JOINED_PARTICIPANTS', payload: updated });
      localStorage.setItem('letitbeme_joined_participants', JSON.stringify({ payload: updated, ts: Date.now() }));
      sendSupabaseBroadcast('SYNC_JOINED_PARTICIPANTS', updated);
      return updated;
    });

    const signalPayload = { targetId: id, action: 'toggle_cam', ts: Date.now() };
    channel?.postMessage({ type: 'HOST_MODERATE_PARTICIPANT', payload: signalPayload });
    localStorage.setItem('letitbeme_host_moderate', JSON.stringify({ payload: signalPayload, ts: Date.now() }));
    sendSupabaseBroadcast('HOST_MODERATE_PARTICIPANT', signalPayload);
  };

  const hostRemoveParticipant = (id: string) => {
    handleGuestLeft(id);
    const signalPayload = { targetId: id, action: 'remove', ts: Date.now() };
    channel?.postMessage({ type: 'HOST_MODERATE_PARTICIPANT', payload: signalPayload });
    localStorage.setItem('letitbeme_host_moderate', JSON.stringify({ payload: signalPayload, ts: Date.now() }));
    sendSupabaseBroadcast('HOST_MODERATE_PARTICIPANT', signalPayload);
  };

  // Synchronize across both BroadcastChannel and Supabase Realtime
  useEffect(() => {
    const bc = new BroadcastChannel('letitbeme_stream_sync');
    setChannel(bc);

    const handleKnock = (payload: WaitingParticipant) => {
      playDoorbellChime();
      setWaitingParticipants((prev) => {
        if (prev.some((p) => p.id === payload.id)) return prev;
        return [...prev, payload];
      });
    };

    const handleAdmit = (guestId: string, guestObj?: any) => {
      if (guestId === myGuestIdRef.current) {
        setIsWaitingInLobby(false);
        setIsGuestJoined(true);

        // By default, automatically start attendee camera & microphone so video & voice stream immediately
        navigator.mediaDevices?.getUserMedia({
          video: { width: { ideal: 1280 }, height: { ideal: 720 }, facingMode: 'user' },
          audio: true,
        }).then((stream) => {
          setLocalCamStream(stream);
          setIsCamOn(true);
          setIsMicOn(true);
          Object.values(peerConnectionsRef.current).forEach((pc) => {
            stream.getTracks().forEach((track) => {
              const senders = pc.getSenders();
              const existingSender = senders.find((s) => s.track?.kind === track.kind);
              if (existingSender) {
                existingSender.replaceTrack(track);
              } else {
                pc.addTrack(track, stream);
              }
            });
          });
          setJoinedParticipants((prev) => {
            const updated = prev.map((p) => (p.id === myGuestIdRef.current ? { ...p, isCamOn: true, isMicOn: true } : p));
            channel?.postMessage({ type: 'SYNC_JOINED_PARTICIPANTS', payload: updated });
            localStorage.setItem('letitbeme_joined_participants', JSON.stringify({ payload: updated, ts: Date.now() }));
            sendSupabaseBroadcast('SYNC_JOINED_PARTICIPANTS', updated);
            return updated;
          });
          sendWebRTCSignal({
            type: 'PEER_JOINED',
            senderId: myGuestIdRef.current,
            ts: Date.now(),
          });
        }).catch(() => {
          navigator.mediaDevices?.getUserMedia({ audio: true }).then((audioStream) => {
            setLocalCamStream(audioStream);
            setIsMicOn(true);
            Object.values(peerConnectionsRef.current).forEach((pc) => {
              audioStream.getTracks().forEach((track) => {
                pc.addTrack(track, audioStream);
              });
            });
            sendWebRTCSignal({
              type: 'PEER_JOINED',
              senderId: myGuestIdRef.current,
              ts: Date.now(),
            });
          }).catch(() => {
            sendWebRTCSignal({
              type: 'PEER_JOINED',
              senderId: myGuestIdRef.current,
              ts: Date.now(),
            });
          });
        });
      }
      setViewerCount((prev) => prev + 1);

      const myStoredName = localStorage.getItem('letitbeme_my_guest_name');
      const resolvedName =
        guestId === myGuestIdRef.current && myStoredName
          ? myStoredName
          : guestObj?.name || 'Guest Member';

      setJoinedParticipants((prev) => {
        const filtered = prev.filter((p) => p.id !== guestId);
        return [
          ...filtered,
          {
            id: guestId,
            name: resolvedName,
            avatar: guestObj?.avatar,
            isHost: false,
            isCamOn: true,
            isMicOn: true,
            isSpeaking: false,
          },
        ];
      });
    };

    const handleHostModerate = (payload: { targetId: string; action: string }) => {
      if (payload?.targetId === myGuestIdRef.current) {
        if (payload.action === 'toggle_mic') {
          toggleMic();
        } else if (payload.action === 'toggle_cam') {
          toggleCam();
        } else if (payload.action === 'remove') {
          leaveMeeting();
          alert('You have been removed from the meeting by the host.');
        }
      }
    };

    const handleDeny = (guestId: string) => {
      if (guestId === myGuestIdRef.current) {
        alert('The host has declined your join request.');
      }
    };

    const handleMeetingEnded = () => {
      setIsGuestJoined(false);
      setIsWaitingInLobby(false);
      setIsMeetingEnded(true);
      setJoinedParticipants([]);
      setIsLive(false);
      // Clean up peer connections
      Object.values(peerConnectionsRef.current).forEach((pc) => pc.close());
      peerConnectionsRef.current = {};
      setRemoteStreams({});
    };

    bc.onmessage = (event) => {
      const { type, payload } = event.data;
      if (type === 'SYNC_WIDGET') setActiveWidgetState(payload);
      if (type === 'SYNC_LAYOUT') setLayoutModeState(payload);
      if (type === 'SYNC_URL') setCustomEmbedUrlState(payload);
      if (type === 'SYNC_NOTES') setMeetingNotesState(payload);
      if (type === 'SYNC_OFFER') setProductOffer(payload);
      if (type === 'SYNC_POLL') setPollData(payload);
      if (type === 'SYNC_AGENDA') {
        setAgendaState(payload);
        localStorage.setItem('letitbeme_agenda', JSON.stringify(payload));
      }
      if (type === 'SYNC_LANG') setCurrentLanguageState(payload);
      if (type === 'SYNC_MSG') setMessages((prev) => [...prev, payload]);
      if (type === 'SYNC_SUBTITLE') setLatestSubtitle(payload);
      if (type === 'SYNC_JOINED_PARTICIPANTS' && Array.isArray(payload)) setJoinedParticipants(payload);
      if (type === 'SYNC_LIVE_STATUS') setIsLive(payload);
      if (type === 'KNOCK_JOIN') handleKnock(payload);
      if (type === 'ADMIT_GUEST') handleAdmit(payload.guestId, payload.guest);
      if (type === 'DENY_GUEST') handleDeny(payload.guestId);
      if (type === 'GUEST_LEFT') handleGuestLeft(payload.guestId);
      if (type === 'MEETING_ENDED') handleMeetingEnded();
      if (type === 'WEBRTC_SIGNAL') handleWebRTCSignal(payload);
      if (type === 'HOST_MODERATE_PARTICIPANT') handleHostModerate(payload);
    };

    // Supabase Realtime WebSocket for cross-device / mobile phone synchronization
    if (isSupabaseConfigured) {
      const channelInstance = supabase.channel('letitbeme_room_sync');
      supabaseRealtimeChannelRef.current = channelInstance;

      channelInstance
        .on('broadcast', { event: 'KNOCK_JOIN' }, (event) => handleKnock(event.payload))
        .on('broadcast', { event: 'ADMIT_GUEST' }, (event) => handleAdmit(event.payload?.guestId, event.payload?.guest))
        .on('broadcast', { event: 'DENY_GUEST' }, (event) => handleDeny(event.payload?.guestId))
        .on('broadcast', { event: 'GUEST_LEFT' }, (event) => handleGuestLeft(event.payload?.guestId))
        .on('broadcast', { event: 'MEETING_ENDED' }, () => handleMeetingEnded())
        .on('broadcast', { event: 'HOST_MODERATE_PARTICIPANT' }, (event) => handleHostModerate(event.payload))
        .on('broadcast', { event: 'SYNC_JOINED_PARTICIPANTS' }, (event) => {
          if (Array.isArray(event.payload)) setJoinedParticipants(event.payload);
        })
        .on('broadcast', { event: 'SYNC_MSG' }, (event) => {
          if (event.payload) {
            setMessages((prev) => (prev.some((m) => m.id === event.payload.id) ? prev : [...prev, event.payload]));
          }
        })
        .on('broadcast', { event: 'WEBRTC_SIGNAL' }, (event) => handleWebRTCSignal(event.payload))
        .on('broadcast', { event: 'SYNC_AGENDA' }, (event) => {
          setAgendaState(event.payload);
          localStorage.setItem('letitbeme_agenda', JSON.stringify(event.payload));
        })
        .subscribe((status) => {
          if (status === 'SUBSCRIBED') {
            console.log('✅ Supabase Realtime Mesh Connected');
          }
        });
    }

    // Cross-tab and cross-profile storage sync listener
    const handleStorage = (e: StorageEvent) => {
      if (e.key === 'letitbeme_last_knock' && e.newValue) {
        try {
          const { payload } = JSON.parse(e.newValue);
          handleKnock(payload);
        } catch {}
      }
      if (e.key === 'letitbeme_last_admit' && e.newValue) {
        try {
          const parsed = JSON.parse(e.newValue);
          handleAdmit(parsed.guestId, parsed.guest);
        } catch {}
      }
      if (e.key === 'letitbeme_joined_participants' && e.newValue) {
        try {
          const { payload } = JSON.parse(e.newValue);
          if (Array.isArray(payload)) setJoinedParticipants(payload);
        } catch {}
      }
      if (e.key === 'letitbeme_last_chat_msg' && e.newValue) {
        try {
          const { payload } = JSON.parse(e.newValue);
          if (payload) {
            setMessages((prev) => (prev.some((m) => m.id === payload.id) ? prev : [...prev, payload]));
          }
        } catch {}
      }
      if (e.key === 'letitbeme_host_moderate' && e.newValue) {
        try {
          const { payload } = JSON.parse(e.newValue);
          if (payload) handleHostModerate(payload);
        } catch {}
      }
      if (e.key === 'letitbeme_guest_left' && e.newValue) {
        try {
          const parsed = JSON.parse(e.newValue);
          handleGuestLeft(parsed.guestId);
        } catch {}
      }
      if (e.key === 'letitbeme_meeting_ended' && e.newValue) {
        handleMeetingEnded();
      }
      if (e.key === 'letitbeme_webrtc_signal' && e.newValue) {
        try {
          const signal = JSON.parse(e.newValue);
          handleWebRTCSignal(signal);
        } catch {}
      }
      if (e.key === 'letitbeme_last_deny' && e.newValue) {
        try {
          const { guestId } = JSON.parse(e.newValue);
          handleDeny(guestId);
        } catch {}
      }
    };
    window.addEventListener('storage', handleStorage);

    return () => {
      bc.close();
      window.removeEventListener('storage', handleStorage);
      if (supabaseRealtimeChannelRef.current) {
        supabase.removeChannel(supabaseRealtimeChannelRef.current);
        supabaseRealtimeChannelRef.current = null;
      }
    };
  }, []);

  // Duration timer
  useEffect(() => {
    if (!isLive) return;
    const interval = setInterval(() => {
      setStreamDuration((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [isLive]);

  // Agenda synchronization helpers
  const broadcastAgenda = (newAgenda: AgendaItem[]) => {
    setAgendaState(newAgenda);
    localStorage.setItem('letitbeme_agenda', JSON.stringify(newAgenda));
    channel?.postMessage({ type: 'SYNC_AGENDA', payload: newAgenda });
    if (isSupabaseConfigured) {
      supabase.channel('letitbeme_room_sync').send({
        type: 'broadcast',
        event: 'SYNC_AGENDA',
        payload: newAgenda,
      });
    }
  };

  const toggleAgendaItem = (id: string) => {
    const next = agenda.map((item) => (item.id === id ? { ...item, isDone: !item.isDone } : item));
    broadcastAgenda(next);
  };

  const addAgendaItem = (title: string) => {
    if (!title.trim()) return;
    const next = [...agenda, { id: `agenda-${Date.now()}`, title: title.trim(), isDone: false }];
    broadcastAgenda(next);
  };

  const deleteAgendaItem = (id: string) => {
    const next = agenda.filter((item) => item.id !== id);
    broadcastAgenda(next);
  };

  const setAgenda = (items: AgendaItem[]) => {
    broadcastAgenda(items);
  };

  const setCustomEmbedUrl = (url: string) => {
    setCustomEmbedUrlState(url);
    channel?.postMessage({ type: 'SYNC_URL', payload: url });
  };

  const setMeetingNotes = (notes: string) => {
    setMeetingNotesState(notes);
    channel?.postMessage({ type: 'SYNC_NOTES', payload: notes });
  };

  const setLayoutMode = (mode: LayoutMode) => {
    setLayoutModeState(mode);
    channel?.postMessage({ type: 'SYNC_LAYOUT', payload: mode });
  };

  const setActiveWidget = (widget: InteractiveWidgetType) => {
    setActiveWidgetState(widget);
    channel?.postMessage({ type: 'SYNC_WIDGET', payload: widget });
  };

  const setOfferPrice = (price: number) => {
    setProductOffer((prev) => {
      const next = { ...prev, price };
      channel?.postMessage({ type: 'SYNC_OFFER', payload: next });
      return next;
    });
  };

  const setOfferTitle = (name: string) => {
    setProductOffer((prev) => {
      const next = { ...prev, name };
      channel?.postMessage({ type: 'SYNC_OFFER', payload: next });
      return next;
    });
  };

  const setStreamTitle = (newTitle: string) => {
    setTitle(newTitle);
  };

  const setLanguage = (lang: SupportedLanguage) => {
    setCurrentLanguageState(lang);
    channel?.postMessage({ type: 'SYNC_LANG', payload: lang });
  };

  const toggleAiTranslation = () => {
    setIsAiTranslationActive((prev) => !prev);
  };

  // Live Speech Recognition & Real-time OpenAI gpt-4o-mini Subtitle Generation
  // Only start microphone listening when meeting is active (Host started meeting or Guest joined)
  useEffect(() => {
    if (!isAiTranslationActive || !isMicOn || (!isLive && !isGuestJoined)) return;

    let recognition: any = null;
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (SpeechRecognition) {
      try {
        recognition = new SpeechRecognition();
        recognition.continuous = true;
        recognition.interimResults = true;
        recognition.lang = 'en-US';

        recognition.onresult = async (event: any) => {
          const transcript = Array.from(event.results)
            .map((result: any) => result[0].transcript)
            .join('');

          if (transcript.trim()) {
            const langObj = SUPPORTED_LANGUAGES.find((l) => l.code === currentLanguage);
            const targetLang = langObj?.name || 'English';

            // Call OpenAI gpt-4o-mini translation engine
            const result = await translateLiveSpeech(transcript.trim(), targetLang);

            const subtitlePayload: SubtitleItem = {
              originalText: transcript.trim(),
              translatedText: result.translatedText,
              timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            };

            setLatestSubtitle(subtitlePayload);
            channel?.postMessage({ type: 'SYNC_SUBTITLE', payload: subtitlePayload });
          }
        };

        recognition.onerror = () => {};
        recognition.start();
      } catch (err) {
        console.warn('Speech recognition notice:', err);
      }
    }

    return () => {
      if (recognition) {
        try {
          recognition.stop();
        } catch {}
      }
    };
  }, [isAiTranslationActive, isMicOn, isLive, isGuestJoined, currentLanguage, channel]);

  const triggerReaction = (emoji: string) => {
    const newReaction: FloatingReaction = {
      id: `${Date.now()}-${Math.random()}`,
      emoji,
      x: Math.random() * 80 + 10,
    };
    setReactions((prev) => [...prev.slice(-15), newReaction]);
  };

  const sendMessage = (text: string) => {
    if (!text.trim()) return;
    const isHost = isPresenterRole || new URLSearchParams(window.location.search).get('view') === 'presenter';
    const guestStoredName = localStorage.getItem('letitbeme_my_guest_name');
    const senderName = isHost
      ? (hostName || presenterName || 'Host Presenter')
      : (guestStoredName || 'Guest Member');

    const senderAvatar = `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(senderName)}`;

    const newMsg: ChatMessage = {
      id: `msg-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
      sender: senderName,
      avatar: senderAvatar,
      message: text.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isPresenter: isHost,
      badge: isHost ? 'Host' : undefined,
    };

    setMessages((prev) => [...prev, newMsg]);
    channel?.postMessage({ type: 'SYNC_MSG', payload: newMsg });
    localStorage.setItem('letitbeme_last_chat_msg', JSON.stringify({ payload: newMsg, ts: Date.now() }));
    sendSupabaseBroadcast('SYNC_MSG', newMsg);
  };

  const votePoll = (optionId: string) => {
    setPollData((prev) => {
      if (!prev || prev.hasVoted) return prev;
      const updatedOptions = prev.options.map((opt) => {
        if (opt.id === optionId) {
          return { ...opt, votes: opt.votes + 1 };
        }
        return opt;
      });

      const totalVotes = prev.totalVotes + 1;
      const optionsWithPercentages = updatedOptions.map((opt) => ({
        ...opt,
        percentage: Math.round((opt.votes / totalVotes) * 100),
      }));

      const next = {
        ...prev,
        options: optionsWithPercentages,
        totalVotes,
        hasVoted: true,
        userSelectedOption: optionId,
      };

      channel?.postMessage({ type: 'SYNC_POLL', payload: next });
      return next;
    });
  };

  const createPoll = (question: string, optionTexts: string[]) => {
    const newOptions: PollOption[] = optionTexts
      .filter((t) => t.trim().length > 0)
      .map((text, idx) => ({
        id: `opt-${idx + 1}`,
        text: text.trim(),
        votes: 0,
        percentage: 0,
      }));

    const newPoll: PollData = {
      question: question.trim(),
      options: newOptions,
      totalVotes: 0,
      hasVoted: false,
      userSelectedOption: null,
    };

    setPollData(newPoll);
    channel?.postMessage({ type: 'SYNC_POLL', payload: newPoll });
  };

  const resetPoll = () => {
    setPollData((prev) => {
      if (!prev) return null;
      const reset = {
        ...prev,
        options: prev.options.map((o) => ({ ...o, votes: 0, percentage: 0 })),
        totalVotes: 0,
        hasVoted: false,
        userSelectedOption: null,
      };
      channel?.postMessage({ type: 'SYNC_POLL', payload: reset });
      return reset;
    });
  };

  const deletePoll = () => {
    setPollData(null);
    channel?.postMessage({ type: 'SYNC_POLL', payload: null });
  };

  const toggleCam = async () => {
    try {
      if (isCamOn) {
        if (localCamStream) {
          localCamStream.getVideoTracks().forEach((t) => t.stop());
        }
        setIsCamOn(false);

        // Sync cam state across room
        setJoinedParticipants((prev) => {
          const updated = prev.map((p) => (p.id === getMyPeerId() ? { ...p, isCamOn: false } : p));
          channel?.postMessage({ type: 'SYNC_JOINED_PARTICIPANTS', payload: updated });
          localStorage.setItem('letitbeme_joined_participants', JSON.stringify({ payload: updated, ts: Date.now() }));
          sendSupabaseBroadcast('SYNC_JOINED_PARTICIPANTS', updated);
          return updated;
        });

        sendWebRTCSignal({
          type: 'PEER_JOINED',
          senderId: getMyPeerId(),
          ts: Date.now(),
        });
      } else {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { width: { ideal: 1280 }, height: { ideal: 720 }, facingMode: 'user' },
          audio: true,
        });
        setLocalCamStream(stream);
        setIsCamOn(true);

        // Attach tracks to all active WebRTC peer connections
        Object.values(peerConnectionsRef.current).forEach((pc) => {
          stream.getTracks().forEach((track) => {
            const senders = pc.getSenders();
            const sender = senders.find((s) => s.track?.kind === track.kind);
            if (sender) {
              sender.replaceTrack(track);
            } else {
              pc.addTrack(track, stream);
            }
          });
        });

        // Sync cam state across room
        setJoinedParticipants((prev) => {
          const updated = prev.map((p) => (p.id === getMyPeerId() ? { ...p, isCamOn: true } : p));
          channel?.postMessage({ type: 'SYNC_JOINED_PARTICIPANTS', payload: updated });
          localStorage.setItem('letitbeme_joined_participants', JSON.stringify({ payload: updated, ts: Date.now() }));
          sendSupabaseBroadcast('SYNC_JOINED_PARTICIPANTS', updated);
          return updated;
        });

        // Re-announce so remote peers renegotiate
        sendWebRTCSignal({
          type: 'PEER_JOINED',
          senderId: getMyPeerId(),
          ts: Date.now(),
        });
      }
    } catch {
      setIsCamOn(false);
    }
  };

  const toggleMic = async () => {
    if (localCamStream) {
      const audioTracks = localCamStream.getAudioTracks();
      if (audioTracks.length > 0) {
        audioTracks.forEach((t) => {
          t.enabled = !isMicOn;
        });
      }
    }
    setIsMicOn((prev) => !prev);
  };

  const toggleScreenShare = async () => {
    try {
      if (isScreenSharing) {
        if (localScreenStream) {
          localScreenStream.getTracks().forEach((t) => t.stop());
          setLocalScreenStream(null);
        }
        setIsScreenSharing(false);
      } else {
        const stream = await navigator.mediaDevices.getDisplayMedia({
          video: true,
          audio: true,
        });
        setLocalScreenStream(stream);
        setIsScreenSharing(true);
      }
    } catch {
      setIsScreenSharing(false);
    }
  };

  const triggerCheckoutCelebration = () => {
    setHasCheckedOut(true);
    triggerReaction('🎉');
    triggerReaction('⭐');
    triggerReaction('🚀');
  };

  const toggleLiveStatus = () => {
    setIsLive((prev) => {
      const next = !prev;
      channel?.postMessage({ type: 'SYNC_LIVE_STATUS', payload: next });
      return next;
    });
  };

  const saveStreamToSupabase = async () => {
    if (!isSupabaseConfigured) return;
    try {
      await supabase.from('letitbeme_streams').upsert({
        id: streamId,
        title,
        offer_title: productOffer.name,
        offer_price: productOffer.price,
        active_widget: activeWidget,
        embed_url: customEmbedUrl,
        updated_at: new Date().toISOString(),
      });
    } catch {
      // Offline / Local fallback
    }
  };

  // Waiting Room Knock / Admit / Deny
  const requestJoinRoom = async (guestName: string) => {
    const trimmedName = guestName.trim() || 'Guest Member';
    const loc = await getAttendeeLocation();
    const guestId = myGuestIdRef.current;

    localStorage.setItem('letitbeme_my_guest_id', guestId);
    localStorage.setItem('letitbeme_my_guest_name', trimmedName);

    const guest: WaitingParticipant = {
      id: guestId,
      name: trimmedName,
      avatar: `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(trimmedName)}`,
      location: loc,
      joinedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setIsWaitingInLobby(true);
    
    // 1. BroadcastChannel (same tab / profile)
    channel?.postMessage({ type: 'KNOCK_JOIN', payload: guest });
    
    // 2. LocalStorage Event (cross-tab in browser)
    localStorage.setItem('letitbeme_last_knock', JSON.stringify({ payload: guest, ts: Date.now() }));

    // 3. Supabase Realtime (cross-device, mobile phones)
    sendSupabaseBroadcast('KNOCK_JOIN', guest);
  };

  const admitParticipant = (id: string) => {
    // 1. Find the waiting guest with their actual name
    let admitted = waitingParticipants.find((p) => p.id === id);
    if (!admitted) {
      try {
        const raw = localStorage.getItem('letitbeme_last_knock');
        if (raw) {
          const parsed = JSON.parse(raw);
          if (parsed?.payload?.id === id) admitted = parsed.payload;
        }
      } catch {}
    }

    const guestName = admitted?.name?.trim() || 'Guest Member';
    const guestAvatar = admitted?.avatar;

    setWaitingParticipants((prev) => prev.filter((p) => p.id !== id));
    setViewerCount((prev) => prev + 1);

    const newJoined: JoinedParticipant = {
      id,
      name: guestName,
      avatar: guestAvatar,
      isHost: false,
      isCamOn: false,
      isMicOn: true,
      isSpeaking: false,
    };

    // 2. Immediately add to HOST's OWN joinedParticipants state
    setJoinedParticipants((prev) => {
      const filtered = prev.filter((p) => p.id !== id);
      const updated = [...filtered, newJoined];
      
      channel?.postMessage({ type: 'SYNC_JOINED_PARTICIPANTS', payload: updated });
      localStorage.setItem('letitbeme_joined_participants', JSON.stringify({ payload: updated, ts: Date.now() }));
      sendSupabaseBroadcast('SYNC_JOINED_PARTICIPANTS', updated);
      return updated;
    });

    // 3. Dispatch ADMIT_GUEST message
    const admitPayload = { guestId: id, guest: newJoined };
    channel?.postMessage({ type: 'ADMIT_GUEST', payload: admitPayload });
    localStorage.setItem('letitbeme_last_admit', JSON.stringify({ ...admitPayload, ts: Date.now() }));
    sendSupabaseBroadcast('ADMIT_GUEST', admitPayload);
  };

  const denyParticipant = (id: string) => {
    setWaitingParticipants((prev) => prev.filter((p) => p.id !== id));
    channel?.postMessage({ type: 'DENY_GUEST', payload: { guestId: id } });
    localStorage.setItem('letitbeme_last_deny', JSON.stringify({ guestId: id, ts: Date.now() }));
    sendSupabaseBroadcast('DENY_GUEST', { guestId: id });
  };

  const endMeeting = () => {
    setIsLive(false);
    setIsGuestJoined(false);
    setIsWaitingInLobby(false);
    setJoinedParticipants([]);
    setIsMeetingEnded(true);

    const payload = {
      hostName: hostName || presenterName || 'Host Presenter',
      duration: streamDuration,
      ts: Date.now(),
    };

    channel?.postMessage({ type: 'MEETING_ENDED', payload });
    localStorage.setItem('letitbeme_meeting_ended', JSON.stringify(payload));
    sendSupabaseBroadcast('MEETING_ENDED', payload);
  };

  const leaveMeeting = () => {
    const guestId = myGuestIdRef.current;
    setIsGuestJoined(false);
    setIsWaitingInLobby(false);
    setJoinedParticipants([]);

    // Stop local camera and mic tracks
    if (localCamStream) {
      localCamStream.getTracks().forEach((track) => track.stop());
      setLocalCamStream(null);
      setIsCamOn(false);
    }

    // Close WebRTC connections
    Object.values(peerConnectionsRef.current).forEach((pc) => {
      try {
        pc.close();
      } catch {}
    });
    peerConnectionsRef.current = {};
    setRemoteStreams({});

    const payload = {
      guestId,
      name: localStorage.getItem('letitbeme_my_guest_name') || 'Guest Member',
      ts: Date.now(),
    };

    channel?.postMessage({ type: 'GUEST_LEFT', payload });
    localStorage.setItem('letitbeme_guest_left', JSON.stringify(payload));
    sendSupabaseBroadcast('GUEST_LEFT', payload);
  };

  return (
    <StreamContext.Provider
      value={{
        isLive,
        streamId,
        streamTitle: title,
        title,
        presenterName,
        presenterRole,
        hostName,
        hostSlug,
        viewerCount,
        conversionRate,
        layoutMode,
        activeWidget,
        customEmbedUrl,
        joinedParticipants,
        activeSpeakerId,
        isMeetingEnded,
        setIsMeetingEnded,
        endMeeting,
        leaveMeeting,
        meetingNotes,
        productOffer,
        offerPrice: productOffer.price,
        offerTitle: productOffer.name,
        pollData,
        agenda,
        isPresenterRole,
        isMicOn,
        isCamOn,
        isScreenSharing,
        audioLevel,
        currentLanguage,
        isAiTranslationActive,
        latestSubtitle,
        streamDuration,
        messages,
        reactions,
        hasCheckedOut,
        localCamStream,
        localScreenStream,
        remoteStreams,
        requireHostApproval,
        allowScreenShare,
        allowChat,
        muteOnEntry,
        waitingParticipants,
        isWaitingInLobby,
        setIsWaitingInLobby,
        isGuestJoined,
        setIsGuestJoined,
        setLayoutMode,
        setActiveWidget,
        setCustomEmbedUrl,
        setMeetingNotes,
        setOfferPrice,
        setOfferTitle,
        setStreamTitle,
        votePoll,
        createPoll,
        resetPoll,
        deletePoll,
        toggleAgendaItem,
        addAgendaItem,
        deleteAgendaItem,
        setAgenda,
        toggleMic,
        toggleCam,
        toggleScreenShare,
        toggleAiTranslation,
        setLanguage,
        triggerReaction,
        sendMessage,
        triggerCheckoutCelebration,
        toggleLiveStatus,
        setIsPresenterRole,
        saveStreamToSupabase,
        setRequireHostApproval,
        setAllowScreenShare,
        setAllowChat,
        setMuteOnEntry,
        requestJoinRoom,
        admitParticipant,
        denyParticipant,
        hostMuteParticipant,
        hostStopParticipantVideo,
        hostRemoveParticipant,
      }}
    >
      {children}
    </StreamContext.Provider>
  );
};

export const useStream = () => {
  const context = useContext(StreamContext);
  if (!context) {
    throw new Error('useStream must be used within a StreamProvider');
  }
  return context;
};
