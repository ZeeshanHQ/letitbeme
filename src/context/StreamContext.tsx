import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import { supabase, isSupabaseConfigured } from '../lib/supabase';

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

export interface WaitingParticipant {
  id: string;
  name: string;
  avatar: string;
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
  meetingNotes: string;
  productOffer: ProductOffer;
  offerPrice: number;
  offerTitle: string;
  pollData: PollData | null;
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
}

interface StreamContextType extends StreamState {
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
  toggleMic: () => Promise<void>;
  toggleCam: () => Promise<void>;
  toggleScreenShare: () => Promise<void>;
  toggleAiTranslation: () => void;
  setLanguage: (lang: SupportedLanguage) => void;
  triggerReaction: (emoji: string) => void;
  sendMessage: (text: string, senderName?: string, avatarUrl?: string) => void;
  triggerCheckoutCelebration: () => void;
  toggleLiveStatus: () => void;
  setIsPresenterRole: (isPresenter: boolean) => void;
  saveStreamToSupabase: () => Promise<void>;
  // Host Toggles & Waiting Room Actions
  setRequireHostApproval: (req: boolean) => void;
  setAllowScreenShare: (allow: boolean) => void;
  setAllowChat: (allow: boolean) => void;
  setMuteOnEntry: (mute: boolean) => void;
  requestJoinRoom: (guestName: string) => void;
  isWaitingInLobby: boolean;
  setIsWaitingInLobby: (val: boolean) => void;
  admitParticipant: (id: string) => void;
  denyParticipant: (id: string) => void;
}

const StreamContext = createContext<StreamContextType | undefined>(undefined);

// Web Audio API Chime Synthesizer for Join Notifications
const playDoorbellChime = () => {
  try {
    const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AudioContextClass) return;
    const ctx = new AudioContextClass();
    
    // Note 1: E5 (659.25Hz)
    const osc1 = ctx.createOscillator();
    const gain1 = ctx.createGain();
    osc1.type = 'sine';
    osc1.frequency.setValueAtTime(659.25, ctx.currentTime);
    gain1.gain.setValueAtTime(0.2, ctx.currentTime);
    gain1.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.6);
    osc1.connect(gain1);
    gain1.connect(ctx.destination);
    osc1.start(ctx.currentTime);
    osc1.stop(ctx.currentTime + 0.6);

    // Note 2: C5 (523.25Hz)
    const osc2 = ctx.createOscillator();
    const gain2 = ctx.createGain();
    osc2.type = 'sine';
    osc2.frequency.setValueAtTime(523.25, ctx.currentTime + 0.25);
    gain2.gain.setValueAtTime(0.25, ctx.currentTime + 0.25);
    gain2.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.9);
    osc2.connect(gain2);
    gain2.connect(ctx.destination);
    osc2.start(ctx.currentTime + 0.25);
    osc2.stop(ctx.currentTime + 0.9);
  } catch {
    // Ignore audio autoplay restrictions
  }
};

export const StreamProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isLive, setIsLive] = useState(false);
  const [streamId] = useState('stream-masterclass-2026');
  const [title, setTitle] = useState('Interactive Executive Meeting Room');
  const [presenterName, setPresenterName] = useState('Host Presenter');
  const [presenterRole, setPresenterRole] = useState('Host');
  const [hostName, setHostName] = useState('Host Presenter');
  const [hostSlug, setHostSlug] = useState('live');
  
  // Real viewer count starts at 1 (the single real person in the room)
  const [viewerCount, setViewerCount] = useState(1);
  const [conversionRate, setConversionRate] = useState(0);
  const [layoutMode, setLayoutModeState] = useState<LayoutMode>('split');
  const [activeWidget, setActiveWidgetState] = useState<InteractiveWidgetType>('sandbox');
  const [customEmbedUrl, setCustomEmbedUrlState] = useState('https://excalidraw.com');
  const [meetingNotes, setMeetingNotesState] = useState<string>(
    '# Meeting Notes\n\n- Welcome to the executive room.\n- Capture action items, bullet points, and live decisions here.\n- All participants can view synchronized notes in real-time.'
  );
  
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

  const [localCamStream, setLocalCamStream] = useState<MediaStream | null>(null);
  const [localScreenStream, setLocalScreenStream] = useState<MediaStream | null>(null);

  const [latestSubtitle] = useState<SubtitleItem>({
    originalText: '',
    translatedText: '',
    timestamp: '',
  });
  const [streamDuration, setStreamDuration] = useState(0);
  
  // Real chat begins completely empty
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [reactions, setReactions] = useState<FloatingReaction[]>([]);

  // Strictly ONLY $19.99/month offer
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

  const [pollData, setPollData] = useState<PollData | null>(null);
  const [channel, setChannel] = useState<BroadcastChannel | null>(null);

  useEffect(() => {
    const bc = new BroadcastChannel('letitbeme_stream_sync');
    setChannel(bc);

    bc.onmessage = (event) => {
      const { type, payload } = event.data;
      if (type === 'SYNC_WIDGET') setActiveWidgetState(payload);
      if (type === 'SYNC_LAYOUT') setLayoutModeState(payload);
      if (type === 'SYNC_URL') setCustomEmbedUrlState(payload);
      if (type === 'SYNC_NOTES') setMeetingNotesState(payload);
      if (type === 'SYNC_OFFER') setProductOffer(payload);
      if (type === 'SYNC_POLL') setPollData(payload);
      if (type === 'SYNC_LANG') setCurrentLanguageState(payload);
      if (type === 'SYNC_MSG') setMessages((prev) => [...prev, payload]);
      if (type === 'SYNC_LIVE_STATUS') setIsLive(payload);
      if (type === 'KNOCK_JOIN') {
        playDoorbellChime();
        setWaitingParticipants((prev) => {
          if (prev.some((p) => p.id === payload.id)) return prev;
          return [...prev, payload];
        });
      }
      if (type === 'ADMIT_GUEST') {
        if (payload.guestId === 'my_guest_id') {
          setIsWaitingInLobby(false);
        }
        setViewerCount((prev) => prev + 1);
      }
      if (type === 'DENY_GUEST') {
        if (payload.guestId === 'my_guest_id') {
          alert('The host has denied your join request.');
        }
      }
    };

    return () => {
      bc.close();
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

  const setOfferTitle = (newTitle: string) => {
    setProductOffer((prev) => {
      const updated = { ...prev, name: newTitle };
      channel?.postMessage({ type: 'SYNC_OFFER', payload: updated });
      return updated;
    });
  };

  const setOfferPrice = (newPrice: number) => {
    setProductOffer((prev) => {
      const updated = { ...prev, price: newPrice };
      channel?.postMessage({ type: 'SYNC_OFFER', payload: updated });
      return updated;
    });
  };

  const setStreamTitle = (newTitle: string) => {
    setTitle(newTitle);
  };

  const votePoll = (optionId: string) => {
    setPollData((prev) => {
      if (!prev) return null;
      const updatedOptions = prev.options.map((opt) => {
        if (opt.id === optionId) {
          const newVotes = opt.votes + 1;
          return { ...opt, votes: newVotes };
        }
        return opt;
      });
      const newTotal = prev.totalVotes + 1;
      const calculated = updatedOptions.map((opt) => ({
        ...opt,
        percentage: Math.round((opt.votes / (newTotal || 1)) * 100),
      }));
      const updated = {
        ...prev,
        options: calculated,
        totalVotes: newTotal,
        hasVoted: true,
        userSelectedOption: optionId,
      };
      channel?.postMessage({ type: 'SYNC_POLL', payload: updated });
      return updated;
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

  // Camera Toggle
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

  // Mic Toggle
  const toggleMic = async () => {
    setIsMicOn((prev) => !prev);
  };

  // Screen Share Toggle
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
          video: { frameRate: 60 },
          audio: true,
        });
        stream.getVideoTracks()[0].onended = () => {
          setIsScreenSharing(false);
          setLocalScreenStream(null);
        };
        setLocalScreenStream(stream);
        setIsScreenSharing(true);
      }
    } catch {
      setIsScreenSharing(false);
    }
  };

  const toggleAiTranslation = () => {
    setIsAiTranslationActive((prev) => !prev);
  };

  const setLanguage = (lang: SupportedLanguage) => {
    setCurrentLanguageState(lang);
    channel?.postMessage({ type: 'SYNC_LANG', payload: lang });
  };

  const triggerReaction = (emoji: string) => {
    const reaction: FloatingReaction = {
      id: `${Date.now()}-${Math.random()}`,
      emoji,
      x: Math.random() * 80 + 10,
    };
    setReactions((prev) => [...prev, reaction]);
    setTimeout(() => {
      setReactions((prev) => prev.filter((r) => r.id !== reaction.id));
    }, 2800);
  };

  const sendMessage = (text: string, senderName = 'Host Presenter', avatarUrl = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80') => {
    const now = new Date();
    const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const msg: ChatMessage = {
      id: `msg-${Date.now()}`,
      sender: senderName,
      avatar: avatarUrl,
      message: text,
      timestamp: timeStr,
      isPresenter: isPresenterRole,
    };
    setMessages((prev) => [...prev, msg]);
    channel?.postMessage({ type: 'SYNC_MSG', payload: msg });
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
  const requestJoinRoom = (guestName: string) => {
    const guest: WaitingParticipant = {
      id: `guest-${Date.now()}`,
      name: guestName || 'Guest Attendee',
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${guestName}`,
      joinedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };
    if (requireHostApproval) {
      setIsWaitingInLobby(true);
      channel?.postMessage({ type: 'KNOCK_JOIN', payload: guest });
    } else {
      setIsWaitingInLobby(false);
      setViewerCount((prev) => prev + 1);
    }
  };

  const admitParticipant = (id: string) => {
    setWaitingParticipants((prev) => prev.filter((p) => p.id !== id));
    setViewerCount((prev) => prev + 1);
    channel?.postMessage({ type: 'ADMIT_GUEST', payload: { guestId: id } });
  };

  const denyParticipant = (id: string) => {
    setWaitingParticipants((prev) => prev.filter((p) => p.id !== id));
    channel?.postMessage({ type: 'DENY_GUEST', payload: { guestId: id } });
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
        meetingNotes,
        productOffer,
        offerPrice: productOffer.price,
        offerTitle: productOffer.name,
        pollData,
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
