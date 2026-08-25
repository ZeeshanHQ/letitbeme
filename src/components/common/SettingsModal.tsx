import React, { useState } from 'react';
import {
  X,
  User,
  CreditCard,
  Sliders,
  Sparkles,
  Check,
  Shield,
  Palette,
  Link,
  Globe,
  Radio,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { Button } from './Button';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose }) => {
  const { user, updateProfile } = useAuth();

  const [activeTab, setActiveTab] = useState<'profile' | 'stripe' | 'audio_video'>('profile');
  const [fullName, setFullName] = useState(user?.fullName || '');
  const [customSlug, setCustomSlug] = useState(user?.customSlug || '');
  const [brandColor, setBrandColor] = useState(user?.brandColor || '#FF6B00');
  const [stripeLink, setStripeLink] = useState(
    localStorage.getItem('letitbeme_stripe_payment_link') || ''
  );
  const [isSaved, setIsSaved] = useState(false);

  if (!isOpen || !user) return null;

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    await updateProfile({
      fullName: fullName.trim(),
      customSlug: customSlug.trim().replace(/[^a-zA-Z0-9-_]/g, '') || 'live',
      brandColor,
    });

    if (stripeLink.trim()) {
      localStorage.setItem('letitbeme_stripe_payment_link', stripeLink.trim());
    } else {
      localStorage.removeItem('letitbeme_stripe_payment_link');
    }

    setIsSaved(true);
    setTimeout(() => {
      setIsSaved(false);
      onClose();
    }, 900);
  };

  return (
    <div className="fixed inset-0 z-50 bg-obsidian/60 backdrop-blur-md flex items-center justify-center p-4 animate-fade-in font-sans">
      <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-xl w-full overflow-hidden animate-slide-up flex flex-col max-h-[90vh]">
        
        {/* Modal Header */}
        <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div className="flex items-center gap-2.5">
            <div className="h-9 w-9 rounded-xl bg-slate-900 flex items-center justify-center text-white">
              <Sliders className="h-4 w-4" />
            </div>
            <div>
              <h3 className="text-sm font-heading font-bold text-obsidian tracking-tight">
                Account & Meeting Settings
              </h3>
              <p className="text-xs text-slate-400 font-light">
                Manage your presenter profile, meeting handle, and direct payouts
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-obsidian hover:bg-slate-100 cursor-pointer"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="px-5 pt-3 border-b border-slate-100 flex items-center gap-4 text-xs font-semibold">
          <button
            type="button"
            onClick={() => setActiveTab('profile')}
            className={`pb-2.5 flex items-center gap-1.5 transition-all border-b-2 cursor-pointer ${
              activeTab === 'profile'
                ? 'border-slate-900 text-obsidian'
                : 'border-transparent text-slate-400 hover:text-slate-700'
            }`}
          >
            <User className="h-3.5 w-3.5" />
            <span>Profile & Handle</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('stripe')}
            className={`pb-2.5 flex items-center gap-1.5 transition-all border-b-2 cursor-pointer ${
              activeTab === 'stripe'
                ? 'border-slate-900 text-obsidian'
                : 'border-transparent text-slate-400 hover:text-slate-700'
            }`}
          >
            <CreditCard className="h-3.5 w-3.5" />
            <span>Stripe Payouts</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('audio_video')}
            className={`pb-2.5 flex items-center gap-1.5 transition-all border-b-2 cursor-pointer ${
              activeTab === 'audio_video'
                ? 'border-slate-900 text-obsidian'
                : 'border-transparent text-slate-400 hover:text-slate-700'
            }`}
          >
            <Radio className="h-3.5 w-3.5" />
            <span>Audio & Video</span>
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSave} className="p-5 overflow-y-auto space-y-4 text-left text-xs">
          {activeTab === 'profile' && (
            <div className="space-y-4 animate-fade-in">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Full Display Name
                </label>
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 bg-white text-obsidian focus:outline-none focus:border-slate-800"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Custom Meeting URL Handle
                </label>
                <div className="flex items-center rounded-xl border border-slate-300 bg-slate-50 px-3 py-2 text-slate-500 font-mono">
                  <span>letitbe.me/@</span>
                  <input
                    type="text"
                    required
                    value={customSlug}
                    onChange={(e) => setCustomSlug(e.target.value)}
                    className="flex-1 bg-transparent text-obsidian font-bold outline-none pl-0.5"
                  />
                </div>
                <span className="text-[11px] text-slate-400 mt-1 block">
                  This is your permanent public join link for attendees.
                </span>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Brand Accent Color
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={brandColor}
                    onChange={(e) => setBrandColor(e.target.value)}
                    className="h-8 w-12 rounded-lg cursor-pointer border border-slate-300 p-0.5"
                  />
                  <span className="font-mono text-slate-600">{brandColor}</span>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'stripe' && (
            <div className="space-y-3 animate-fade-in">
              <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 space-y-1">
                <span className="font-semibold text-obsidian block">
                  Direct Bank Payouts via Stripe
                </span>
                <p className="text-[11px] text-slate-500 font-light leading-relaxed">
                  Paste your Stripe Payment Link (e.g. from your Stripe Dashboard) so attendee payments and donations deposit 100% directly into your bank.
                </p>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Stripe Payment Link URL
                </label>
                <input
                  type="url"
                  value={stripeLink}
                  onChange={(e) => setStripeLink(e.target.value)}
                  placeholder="https://buy.stripe.com/..."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 bg-white text-obsidian focus:outline-none focus:border-slate-800 font-mono"
                />
              </div>
            </div>
          )}

          {activeTab === 'audio_video' && (
            <div className="space-y-3 animate-fade-in">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                <span className="font-semibold text-obsidian block">WebRTC Broadcast Engine</span>
                <p className="text-[11px] text-slate-500 font-light">
                  Hardware acceleration, high-definition 1080p60 encoding, and noise cancellation are enabled by default.
                </p>
              </div>
              <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 text-emerald-800 text-[11px] font-mono">
                ✓ Ultra-Low Latency Direct Mesh Relay (&lt;65ms RTT)
              </div>
            </div>
          )}

          {/* Footer Save Actions */}
          <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
            <Button
              type="button"
              variant="secondary"
              size="sm"
              onClick={onClose}
              className="rounded-xl"
            >
              Cancel
            </Button>

            <Button
              type="submit"
              variant="primary"
              size="sm"
              className="rounded-xl px-5 font-semibold"
              rightIcon={isSaved ? <Check className="h-4 w-4" /> : undefined}
            >
              {isSaved ? 'Saved!' : 'Save Settings'}
            </Button>
          </div>
        </form>

      </div>
    </div>
  );
};
