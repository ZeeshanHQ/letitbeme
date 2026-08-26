import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { translateLiveSpeech } from '../lib/openai';
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
  // Host Management & Waiting Room
  requireHostApproval: boolean;
  allowScreenShare: boolean;
  allowChat: boolean;
  muteOnEntry: boolean;
  waitingParticipants: WaitingParticipant[];
  isWaitingInLobby: boolean;
  isGuestJoined: boolean;
}

interface StreamContextType extends StreamState {
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
  
  const [isPresenterRole, setIsPresenterRole] = useState(false);
  const [isMicOn, setIsMicOn] = useState(true);
  const [isCamOn, setIsCamOn] = useState(false);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [audioLevel, setAudioLevel] = useState(65);
  const [currentLanguage, setCurrentLanguageState] = useState<SupportedLanguage>('en');
  const [isAiTranslationActive, setIsAiTranslationActive] = useState(true);
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
  const myGuestIdRef = useRef<string>(localStorage.getItem('letitbeme_my_guest_id') || `guest-${Date.now()}`);

  const [localCamStream, setLocalCamStream] = useState<MediaStream | null>(null);
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
            isCamOn: false,
            isMicOn: true,
            isSpeaking: false,
          },
        ];
      });
    };

    const handleDeny = (guestId: string) => {
      if (guestId === myGuestIdRef.current) {
        alert('The host has declined your join request.');
      }
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
    };

    // Supabase Realtime WebSocket for cross-device / mobile phone synchronization
    let realtimeChannel: any = null;
    if (isSupabaseConfigured) {
      realtimeChannel = supabase
        .channel('letitbeme_room_sync')
        .on('broadcast', { event: 'KNOCK_JOIN' }, (event) => handleKnock(event.payload))
        .on('broadcast', { event: 'ADMIT_GUEST' }, (event) => handleAdmit(event.payload?.guestId, event.payload?.guest))
        .on('broadcast', { event: 'DENY_GUEST' }, (event) => handleDeny(event.payload?.guestId))
        .on('broadcast', { event: 'SYNC_JOINED_PARTICIPANTS' }, (event) => {
          if (Array.isArray(event.payload)) setJoinedParticipants(event.payload);
        })
        .on('broadcast', { event: 'SYNC_AGENDA' }, (event) => {
          setAgendaState(event.payload);
          localStorage.setItem('letitbeme_agenda', JSON.stringify(event.payload));
        })
        .subscribe();
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
      if (realtimeChannel) supabase.removeChannel(realtimeChannel);
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
  useEffect(() => {
    if (!isAiTranslationActive || !isMicOn) return;

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
  }, [isAiTranslationActive, isMicOn, currentLanguage, channel]);

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
    const newMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      sender: isPresenterRole ? presenterName : 'Attendee',
      avatar: isPresenterRole
        ? 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80'
        : 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=80',
      message: text.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isPresenter: isPresenterRole,
    };

    setMessages((prev) => [...prev, newMsg]);
    channel?.postMessage({ type: 'SYNC_MSG', payload: newMsg });
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
          localCamStream.getTracks().forEach((t) => t.stop());
          setLocalCamStream(null);
        }
        setIsCamOn(false);
      } else {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { width: { ideal: 1920 }, height: { ideal: 1080 } },
          audio: false,
        });
        setLocalCamStream(stream);
        setIsCamOn(true);
      }
    } catch {
      setIsCamOn(false);
    }
  };

  const toggleMic = async () => {
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
    if (isSupabaseConfigured) {
      supabase.channel('letitbeme_room_sync').send({
        type: 'broadcast',
        event: 'KNOCK_JOIN',
        payload: guest,
      });
    }
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
      
      if (isSupabaseConfigured) {
        supabase.channel('letitbeme_room_sync').send({
          type: 'broadcast',
          event: 'SYNC_JOINED_PARTICIPANTS',
          payload: updated,
        });
      }
      return updated;
    });

    // 3. Dispatch ADMIT_GUEST message
    const admitPayload = { guestId: id, guest: newJoined };
    channel?.postMessage({ type: 'ADMIT_GUEST', payload: admitPayload });
    localStorage.setItem('letitbeme_last_admit', JSON.stringify({ ...admitPayload, ts: Date.now() }));
    
    if (isSupabaseConfigured) {
      supabase.channel('letitbeme_room_sync').send({
        type: 'broadcast',
        event: 'ADMIT_GUEST',
        payload: admitPayload,
      });
    }
  };

  const denyParticipant = (id: string) => {
    setWaitingParticipants((prev) => prev.filter((p) => p.id !== id));
    channel?.postMessage({ type: 'DENY_GUEST', payload: { guestId: id } });
    localStorage.setItem('letitbeme_last_deny', JSON.stringify({ guestId: id, ts: Date.now() }));
    if (isSupabaseConfigured) {
      supabase.channel('letitbeme_room_sync').send({
        type: 'broadcast',
        event: 'DENY_GUEST',
        payload: { guestId: id },
      });
    }
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
