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
}

interface StreamContextType extends StreamState {
  setLayoutMode: (mode: LayoutMode) => void;
  setActiveWidget: (widget: InteractiveWidgetType) => void;
  setCustomEmbedUrl: (url: string) => void;
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
}

const StreamContext = createContext<StreamContextType | undefined>(undefined);

export const StreamProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isLive, setIsLive] = useState(true);
  const [streamId] = useState('stream-masterclass-2026');
  const [title, setTitle] = useState('Interactive Live Video Masterclass: Next-Gen WebRTC & Direct In-Stream Commerce');
  const [presenterName, setPresenterName] = useState('Host Presenter');
  const [presenterRole, setPresenterRole] = useState('Broadcaster');
  const [hostName, setHostName] = useState('Host Presenter');
  const [hostSlug, setHostSlug] = useState('live');
  
  // Real viewer count starts at 1 (the active host in meeting room)
  const [viewerCount, setViewerCount] = useState(1);
  const [conversionRate, setConversionRate] = useState(0);
  const [layoutMode, setLayoutModeState] = useState<LayoutMode>('split');
  const [activeWidget, setActiveWidgetState] = useState<InteractiveWidgetType>('sandbox');
  const [customEmbedUrl, setCustomEmbedUrlState] = useState('https://excalidraw.com');
  const [isPresenterRole, setIsPresenterRole] = useState(false);
  const [isMicOn, setIsMicOn] = useState(true);
  const [isCamOn, setIsCamOn] = useState(false);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [audioLevel, setAudioLevel] = useState(65);
  const [currentLanguage, setCurrentLanguageState] = useState<SupportedLanguage>('es');
  const [isAiTranslationActive, setIsAiTranslationActive] = useState(true);
  const [hasCheckedOut, setHasCheckedOut] = useState(false);

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

  // By default, ZERO fake polls: starts null until the host creates one
  const [pollData, setPollData] = useState<PollData | null>(null);

  // Cross-tab broadcast channel for real multi-viewer synchronization
  const [channel, setChannel] = useState<BroadcastChannel | null>(null);

  useEffect(() => {
    const bc = new BroadcastChannel('letitbeme_stream_sync');
    setChannel(bc);

    bc.postMessage({ type: 'PARTICIPANT_JOIN' });

    bc.onmessage = (event) => {
      const { type, payload } = event.data;
      if (type === 'SYNC_WIDGET') setActiveWidgetState(payload);
      if (type === 'SYNC_LAYOUT') setLayoutModeState(payload);
      if (type === 'SYNC_URL') setCustomEmbedUrlState(payload);
      if (type === 'SYNC_OFFER') setProductOffer(payload);
      if (type === 'SYNC_POLL') setPollData(payload);
      if (type === 'SYNC_LANG') setCurrentLanguageState(payload);
      if (type === 'SYNC_MSG') setMessages((prev) => [...prev, payload]);
      if (type === 'SYNC_LIVE_STATUS') setIsLive(payload);
      if (type === 'PARTICIPANT_JOIN') setViewerCount((prev) => prev + 1);
      if (type === 'SYNC_MEDIA_FLAGS') {
        setIsCamOn(payload.isCamOn);
        setIsScreenSharing(payload.isScreenSharing);
      }
    };

    return () => {
      bc.close();
    };
  }, []);

  // Live session timer & audio level simulation
  useEffect(() => {
    if (!isLive) return;
    const interval = setInterval(() => {
      setStreamDuration((prev) => prev + 1);
      if (!isMicOn) {
        setAudioLevel(0);
      } else {
        setAudioLevel(Math.floor(45 + Math.random() * 45));
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [isLive, isMicOn]);

  const setLayoutMode = useCallback((mode: LayoutMode) => {
    setLayoutModeState(mode);
    channel?.postMessage({ type: 'SYNC_LAYOUT', payload: mode });
  }, [channel]);

  const setActiveWidget = useCallback((widget: InteractiveWidgetType) => {
    setActiveWidgetState(widget);
    channel?.postMessage({ type: 'SYNC_WIDGET', payload: widget });
  }, [channel]);

  const setCustomEmbedUrl = useCallback((url: string) => {
    setCustomEmbedUrlState(url);
    channel?.postMessage({ type: 'SYNC_URL', payload: url });
  }, [channel]);

  const setOfferPrice = useCallback((price: number) => {
    setProductOffer((prev) => {
      const updated = { ...prev, price };
      channel?.postMessage({ type: 'SYNC_OFFER', payload: updated });
      return updated;
    });
  }, [channel]);

  const setOfferTitle = useCallback((titleText: string) => {
    setProductOffer((prev) => {
      const updated = { ...prev, name: titleText };
      channel?.postMessage({ type: 'SYNC_OFFER', payload: updated });
      return updated;
    });
  }, [channel]);

  const createPoll = useCallback((question: string, optionTexts: string[]) => {
    const newPoll: PollData = {
      question: question.trim(),
      options: optionTexts.filter(t => t.trim()).map((text, idx) => ({
        id: String(idx + 1),
        text: text.trim(),
        votes: 0,
        percentage: 0,
      })),
      totalVotes: 0,
      hasVoted: false,
      userSelectedOption: null,
    };
    setPollData(newPoll);
    channel?.postMessage({ type: 'SYNC_POLL', payload: newPoll });
  }, [channel]);

  const resetPoll = useCallback(() => {
    setPollData((prev) => {
      if (!prev) return null;
      const reset: PollData = {
        ...prev,
        options: prev.options.map((o) => ({ ...o, votes: 0, percentage: 0 })),
        totalVotes: 0,
        hasVoted: false,
        userSelectedOption: null,
      };
      channel?.postMessage({ type: 'SYNC_POLL', payload: reset });
      return reset;
    });
  }, [channel]);

  const deletePoll = useCallback(() => {
    setPollData(null);
    channel?.postMessage({ type: 'SYNC_POLL', payload: null });
  }, [channel]);

  const votePoll = useCallback((optionId: string) => {
    setPollData((prev) => {
      if (!prev) return null;
      const newTotal = prev.totalVotes + 1;
      const updatedOptions = prev.options.map((opt) => {
        const votes = opt.id === optionId ? opt.votes + 1 : opt.votes;
        return {
          ...opt,
          votes,
          percentage: Math.round((votes / newTotal) * 100),
        };
      });
      const updated: PollData = {
        ...prev,
        options: updatedOptions,
        totalVotes: newTotal,
        hasVoted: true,
        userSelectedOption: optionId,
      };
      channel?.postMessage({ type: 'SYNC_POLL', payload: updated });
      return updated;
    });
  }, [channel]);

  // Real WebRTC Camera Hardware Handlers
  const toggleCam = useCallback(async () => {
    if (isCamOn) {
      if (localCamStream) {
        localCamStream.getTracks().forEach((t) => t.stop());
        setLocalCamStream(null);
      }
      setIsCamOn(false);
      channel?.postMessage({
        type: 'SYNC_MEDIA_FLAGS',
        payload: { isCamOn: false, isScreenSharing },
      });
    } else {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { width: { ideal: 1920 }, height: { ideal: 1080 } },
          audio: isMicOn,
        });
        setLocalCamStream(stream);
        setIsCamOn(true);
        channel?.postMessage({
          type: 'SYNC_MEDIA_FLAGS',
          payload: { isCamOn: true, isScreenSharing },
        });
      } catch (err) {
        console.warn('Camera toggle note:', err);
        setIsCamOn((prev) => !prev);
      }
    }
  }, [isCamOn, isMicOn, localCamStream, isScreenSharing, channel]);

  // Real WebRTC Screen Sharing Handlers
  const toggleScreenShare = useCallback(async () => {
    if (isScreenSharing) {
      if (localScreenStream) {
        localScreenStream.getTracks().forEach((t) => t.stop());
        setLocalScreenStream(null);
      }
      setIsScreenSharing(false);
      channel?.postMessage({
        type: 'SYNC_MEDIA_FLAGS',
        payload: { isCamOn, isScreenSharing: false },
      });
    } else {
      try {
        const screenStream = await navigator.mediaDevices.getDisplayMedia({
          video: true,
          audio: true,
        });
        screenStream.getVideoTracks()[0].onended = () => {
          setIsScreenSharing(false);
          setLocalScreenStream(null);
        };
        setLocalScreenStream(screenStream);
        setIsScreenSharing(true);
        channel?.postMessage({
          type: 'SYNC_MEDIA_FLAGS',
          payload: { isCamOn, isScreenSharing: true },
        });
      } catch (err) {
        console.warn('Screen share note:', err);
        setIsScreenSharing((prev) => !prev);
      }
    }
  }, [isScreenSharing, isCamOn, localScreenStream, channel]);

  const toggleMic = useCallback(async () => {
    setIsMicOn((prev) => {
      const next = !prev;
      if (localCamStream) {
        localCamStream.getAudioTracks().forEach((t) => {
          t.enabled = next;
        });
      }
      return next;
    });
  }, [localCamStream]);

  const toggleAiTranslation = useCallback(() => setIsAiTranslationActive((prev) => !prev), []);

  const setLanguage = useCallback((lang: SupportedLanguage) => {
    setCurrentLanguageState(lang);
    channel?.postMessage({ type: 'SYNC_LANG', payload: lang });
  }, [channel]);

  const triggerReaction = useCallback((emoji: string) => {
    const newReaction: FloatingReaction = {
      id: `react-${Date.now()}-${Math.random()}`,
      emoji,
      x: 10 + Math.random() * 80,
    };
    setReactions((prev) => [...prev.slice(-15), newReaction]);
    channel?.postMessage({ type: 'SYNC_REACTION', payload: newReaction });
  }, [channel]);

  const sendMessage = useCallback((text: string, senderName?: string, avatarUrl?: string) => {
    const newMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      sender: senderName || (isPresenterRole ? 'Host' : 'Participant'),
      avatar: avatarUrl || (isPresenterRole
        ? 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80'
        : 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=120&q=80'),
      message: text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isPresenter: isPresenterRole,
      badge: isPresenterRole ? 'HOST' : undefined,
    };
    setMessages((prev) => [...prev, newMsg]);
    channel?.postMessage({ type: 'SYNC_MSG', payload: newMsg });
  }, [isPresenterRole, channel]);

  const triggerCheckoutCelebration = useCallback(() => {
    setHasCheckedOut(true);
    setConversionRate((prev) => parseFloat((prev + 0.1).toFixed(1)));
  }, []);

  const toggleLiveStatus = useCallback(() => {
    setIsLive((prev) => {
      const next = !prev;
      channel?.postMessage({ type: 'SYNC_LIVE_STATUS', payload: next });
      return next;
    });
  }, [channel]);

  const saveStreamToSupabase = useCallback(async () => {
    if (!isSupabaseConfigured) return;
    try {
      await supabase.from('letitbeme_streams').upsert({
        id: streamId,
        title,
        status: isLive ? 'live' : 'ended',
        layout_mode: layoutMode,
        active_widget: activeWidget,
        offer_price: productOffer.price,
        donation_enabled: true,
      });
    } catch (e) {
      console.warn('Supabase stream sync note:', e);
    }
  }, [streamId, title, isLive, layoutMode, activeWidget, productOffer.price]);

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
        setLayoutMode,
        setActiveWidget,
        setCustomEmbedUrl,
        setOfferPrice,
        setOfferTitle,
        setStreamTitle: setTitle,
        createPoll,
        resetPoll,
        deletePoll,
        votePoll,
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
