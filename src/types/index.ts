// =================================================================
// TRIPLE MOTIVE DOMAIN TYPES (PHASE 1)
// =================================================================

export type AppNavigationTab = 'home' | 'people' | 'universe' | 'messages' | 'meet' | 'ai';

// 1. Member Profile & Identity
export interface Profile {
  id: string;
  fullName: string;
  avatarUrl?: string;
  headline?: string;
  biography?: string;
  location?: string;
  interests: string[];
  tripleMotiveHandle?: string; // e.g. "alex" (@triplemotive.net)
  isVerified: boolean;
  status: 'pending_screening' | 'active' | 'suspended';
  createdAt?: string;
  updatedAt?: string;
  // Optional backward compatibility & organization fields
  email?: string;
  customSlug?: string;
  role?: string;
  isPro?: boolean;
  brandColor?: string;
  primaryOrganization?: Organization;
  organizationRole?: string;
  organizationTitle?: string;
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

export interface PrivateProfile {
  userId: string;
  email: string;
  phone?: string;
  notificationPreferences: {
    email: boolean;
    inApp: boolean;
  };
  onboardingCompleted: boolean;
  createdAt?: string;
  updatedAt?: string;
}

// 2. Organization & Tenancy
export interface Organization {
  id: string;
  name: string;
  slug: string;
  logoUrl?: string;
  website?: string;
  industry?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface OrganizationMember {
  id: string;
  organizationId: string;
  userId: string;
  role: 'owner' | 'admin' | 'member' | 'advisor';
  title?: string;
  status: 'invited' | 'active' | 'former';
  joinedAt?: string;
  profile?: Profile;
  organization?: Organization;
}

// 3. Connections & Professional Network Graph
export interface ConnectionRequest {
  id: string;
  senderId: string;
  receiverId: string;
  status: 'pending' | 'accepted' | 'declined' | 'canceled';
  note?: string;
  createdAt: string;
  updatedAt?: string;
  senderProfile?: Profile;
  receiverProfile?: Profile;
}

export interface Connection {
  id: string;
  userAId: string;
  userBId: string;
  connectedAt: string;
  partnerProfile?: Profile;
}

// 4. Meetings & Participants
export interface Meeting {
  id: string;
  hostId: string;
  roomSlug: string;
  title: string;
  status: 'scheduled' | 'live' | 'ended';
  scheduledFor?: string;
  startedAt?: string;
  endedAt?: string;
  createdAt?: string;
  hostProfile?: Profile;
  participants?: MeetingParticipant[];
}

export interface MeetingParticipant {
  id: string;
  meetingId: string;
  userId: string;
  role: 'host' | 'co_host' | 'attendee';
  inviteStatus: 'invited' | 'accepted' | 'declined' | 'joined';
  joinedAt?: string;
  leftAt?: string;
  profile?: Profile;
}

// 5. Minimal AI Provider Abstraction Interface
export type AIProviderName = 'openai' | 'anthropic' | 'grok';

export interface AIMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export interface AICompletionRequest {
  provider?: AIProviderName;
  model?: string;
  messages: AIMessage[];
  temperature?: number;
  maxTokens?: number;
}

export interface AICompletionResponse {
  content: string;
  provider: AIProviderName;
  model: string;
  usage?: {
    promptTokens: number;
    completionTokens: number;
  };
}

// =================================================================
// REUSABLE MEETING ENGINE TYPES (PRESERVED)
// =================================================================

export type LayoutMode = 'split' | 'pip' | 'focus';
export type InteractiveWidgetType = 'lead_gen' | 'checkout' | 'poll' | 'sandbox' | 'none';

export interface SubtitleItem {
  id?: string;
  originalText: string;
  translatedText: string;
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
  id?: string;
  name: string;
  tagline: string;
  price: number;
  originalPrice: number;
  discountPercentage: number;
  features: string[];
  stockLeft: number;
  countdownSeconds: number;
  ctaText?: string;
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

export interface LanguageConfig {
  code: string;
  name: string;
  nativeName: string;
  flag: string;
}
