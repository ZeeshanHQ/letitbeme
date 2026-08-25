export type LayoutMode = 'split' | 'pip' | 'focus';

export type InteractiveWidgetType = 'lead_gen' | 'checkout' | 'poll' | 'sandbox' | 'none';

export interface SubtitleItem {
  id: string;
  originalText: string;
  translatedText: string;
  language: string;
  speaker: string;
  timestamp: string;
}

export interface PollOption {
  id: string;
  text: string;
  votes: number;
  percentage: number;
}

export interface PollData {
  id: string;
  question: string;
  options: PollOption[];
  totalVotes: number;
  hasVoted: boolean;
  userSelectedOption?: string;
  endsInSeconds?: number;
}

export interface ProductOffer {
  id: string;
  name: string;
  tagline: string;
  price: number;
  originalPrice: number;
  discountPercentage: number;
  bannerImage: string;
  countdownSeconds: number;
  stockLeft: number;
  features: string[];
  ctaLabel: string;
}

export interface ChatMessage {
  id: string;
  sender: string;
  avatar: string;
  message: string;
  timestamp: string;
  isPresenter?: boolean;
  isModerator?: boolean;
  badge?: string;
  pinnedAction?: {
    type: InteractiveWidgetType;
    label: string;
  };
}

export interface ReferralStat {
  id: string;
  ambassadorName: string;
  avatar: string;
  role: string;
  code: string;
  utmSource: string;
  utmCampaign: string;
  clicks: number;
  registrations: number;
  liveAttendees: number;
  widgetInteractions: number;
  salesCount: number;
  conversionRate: number;
  revenue: number;
  commission: number;
  status: 'active' | 'paused' | 'vip';
  createdDate: string;
}

export interface LanguageConfig {
  code: string;
  name: string;
  nativeName: string;
  flag: string;
}

export interface StreamContextType {
  // Stream & Presenter Status
  isLive: boolean;
  streamTitle: string;
  presenterName: string;
  presenterRole: string;
  viewerCount: number;
  conversionRate: number;
  streamDuration: number;
  
  // Media controls
  isMicOn: boolean;
  isCamOn: boolean;
  isScreenSharing: boolean;
  audioLevel: number;
  toggleMic: () => void;
  toggleCam: () => void;
  toggleScreenShare: () => void;
  toggleLiveStatus: () => void;
  
  // Interactive Layer & Layout controls
  layoutMode: LayoutMode;
  setLayoutMode: (mode: LayoutMode) => void;
  activeWidget: InteractiveWidgetType;
  setActiveWidget: (widget: InteractiveWidgetType) => void;
  customEmbedUrl: string;
  setCustomEmbedUrl: (url: string) => void;
  
  // Live Subtitles & AI Translation
  currentLanguage: string;
  setLanguage: (lang: string) => void;
  isAiTranslationActive: boolean;
  toggleAiTranslation: () => void;
  latestSubtitle: SubtitleItem | null;
  
  // Engagement & Reactions
  reactions: { id: string; emoji: string; x: number }[];
  triggerReaction: (emoji: string) => void;
  
  // Chat & Poll
  messages: ChatMessage[];
  sendMessage: (text: string) => void;
  pollData: PollData;
  votePoll: (optionId: string) => void;
  productOffer: ProductOffer;
  
  // Broadcast across tabs sync
  isPresenterRole: boolean;
  setIsPresenterRole: (isPresenter: boolean) => void;
}
