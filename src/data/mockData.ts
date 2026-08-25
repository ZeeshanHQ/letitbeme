import { ReferralStat } from '../types';

export interface ProductOffer {
  id: string;
  name: string;
  tagline: string;
  price: number;
  originalPrice: number;
  discountPercentage: number;
  stockLeft: number;
  countdownSeconds: number;
  features: string[];
  ctaText: string;
}

export const INITIAL_PRODUCT_OFFER: ProductOffer = {
  id: 'stream-pass-01',
  name: 'Pro Creator All-Access Pass',
  tagline: 'Only $19.99/month for unlimited 1080p60 WebRTC broadcasting, interactive apps & AI translation.',
  price: 19.99,
  originalPrice: 49.99,
  discountPercentage: 60,
  stockLeft: 24,
  countdownSeconds: 840,
  features: [
    'Unlimited 1080p60 WebRTC Broadcasting',
    'In-Stream Interactive App Sandboxes',
    'Real-Time AI Subtitles in 9+ Languages',
    'Full HD Cloud Replay Downloads & Archiving',
  ],
  ctaText: 'Subscribe — Only $19.99/month',
};

export interface SupportedLanguage {
  code: string;
  name: string;
  nativeName: string;
  flag: string;
}

export const SUPPORTED_LANGUAGES: SupportedLanguage[] = [
  { code: 'en', name: 'English', nativeName: 'English (US)', flag: '🇺🇸' },
  { code: 'es', name: 'Spanish', nativeName: 'Español', flag: '🇪🇸' },
  { code: 'ja', name: 'Japanese', nativeName: '日本語', flag: '🇯🇵' },
  { code: 'fr', name: 'French', nativeName: 'Français', flag: '🇫🇷' },
  { code: 'de', name: 'German', nativeName: 'Deutsch', flag: '🇩🇪' },
  { code: 'zh', name: 'Mandarin', nativeName: '中文', flag: '🇨🇳' },
  { code: 'pt', name: 'Portuguese', nativeName: 'Português', flag: '🇧🇷' },
  { code: 'ar', name: 'Arabic', nativeName: 'العربية', flag: '🇸🇦' },
  { code: 'hi', name: 'Hindi', nativeName: 'हिन्दी', flag: '🇮🇳' },
];

export const MOCK_REFERRAL_STATS: ReferralStat[] = [
  {
    id: 'ref-1',
    ambassadorName: 'Sophia Loren',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    role: 'Tech Influencer',
    code: 'SOPHIA-VIP',
    utmSource: 'youtube',
    utmCampaign: 'masterclass_aug',
    clicks: 6420,
    registrations: 2840,
    liveAttendees: 1420,
    widgetInteractions: 890,
    salesCount: 312,
    conversionRate: 22.0,
    revenue: 62088.0,
    commission: 6686.4,
    status: 'vip',
    createdDate: '2026-08-01',
  },
  {
    id: 'ref-2',
    ambassadorName: 'Alexander Vance',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    role: 'Growth Strategist',
    code: 'VANCE-TECH',
    utmSource: 'twitter',
    utmCampaign: 'launch_week',
    clicks: 4890,
    registrations: 2150,
    liveAttendees: 1180,
    widgetInteractions: 740,
    salesCount: 245,
    conversionRate: 20.8,
    revenue: 48755.0,
    commission: 9751.0,
    status: 'vip',
    createdDate: '2026-08-05',
  },
  {
    id: 'ref-3',
    ambassadorName: 'Elena Rostova',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80',
    role: 'Community Lead',
    code: 'ELENA-LIVE',
    utmSource: 'newsletter',
    utmCampaign: 'weekly_digest',
    clicks: 2970,
    registrations: 1430,
    liveAttendees: 820,
    widgetInteractions: 410,
    salesCount: 137,
    conversionRate: 16.7,
    revenue: 27263.0,
    commission: 2726.3,
    status: 'active',
    createdDate: '2026-08-12',
  },
];
