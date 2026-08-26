import React, { useState } from 'react';
import {
  X,
  User,
  Sliders,
  Check,
  Shield,
  Link,
  Globe,
  Copy,
  Lock,
  Mic,
  MonitorUp,
  MessageSquare,
  RotateCcw,
  Sparkles,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useStream } from '../../context/StreamContext';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose }) => {
  const { user, updateProfile, rotateMeetingSlug } = useAuth();
  const {
    requireHostApproval,
    setRequireHostApproval,
    allowScreenShare,
    setAllowScreenShare,
    allowChat,
    setAllowChat,
    muteOnEntry,
    setMuteOnEntry,
  } = useStream();

  const [activeTab, setActiveTab] = useState<'profile' | 'host_controls' | 'stripe'>('host_controls');
  const [fullName, setFullName] = useState(user?.fullName || '');
  const [customSlug, setCustomSlug] = useState(user?.customSlug || 'live');
  const [brandColor, setBrandColor] = useState(user?.brandColor || '#0084FF');
  const [stripeLink, setStripeLink] = useState(
    localStorage.getItem('letitbeme_stripe_payment_link') || ''
  );
  const [isSaved, setIsSaved] = useState(false);
  const [linkCopied, setLinkCopied] = useState(false);
  const [isRotating, setIsRotating] = useState(false);

  if (!isOpen || !user) return null;

  const meetingUrl = `${window.location.origin}/?room=${customSlug}`;

  const handleCopyMeetingLink = () => {
    navigator.clipboard.writeText(meetingUrl);
    setLinkCopied(true);
    setTimeout(() => setLinkCopied(false), 2000);
  };

  const handleRotateLink = async () => {
    setIsRotating(true);
    const newSlug = await rotateMeetingSlug();
    setCustomSlug(newSlug);
    setIsRotating(false);
    setLinkCopied(true);
    setTimeout(() => setLinkCopied(false), 2000);
  };

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
    }, 800);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-md flex items-center justify-center p-4 animate-fade-in font-sans">
      <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-xl w-full overflow-hidden animate-slide-up flex flex-col max-h-[90vh]">
        
        {/* Modal Header */}
        <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div className="flex items-center gap-2.5">
            <div className="h-9 w-9 rounded-xl bg-slate-900 flex items-center justify-center text-white">
              <Sliders className="h-4 w-4" />
            </div>
            <div>
              <h3 className="text-sm font-heading font-bold text-slate-900 tracking-tight">
                Meeting Room &amp; Host Settings
              </h3>
              <p className="text-xs text-slate-400 font-light">
                Configure persistent meeting link, host admission rules, and permissions
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-900 hover:bg-slate-100 cursor-pointer"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="px-5 pt-3 border-b border-slate-100 flex items-center gap-4 text-xs font-semibold">
          <button
            type="button"
            onClick={() => setActiveTab('host_controls')}
            className={`pb-2.5 flex items-center gap-1.5 transition-all border-b-2 cursor-pointer ${
              activeTab === 'host_controls'
                ? 'border-[#0084FF] text-[#0084FF]'
                : 'border-transparent text-slate-400 hover:text-slate-700'
            }`}
          >
            <Shield className="h-3.5 w-3.5" />
            <span>Host Management</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('profile')}
            className={`pb-2.5 flex items-center gap-1.5 transition-all border-b-2 cursor-pointer ${
              activeTab === 'profile'
                ? 'border-[#0084FF] text-[#0084FF]'
                : 'border-transparent text-slate-400 hover:text-slate-700'
            }`}
          >
            <User className="h-3.5 w-3.5" />
            <span>Profile &amp; Link</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('stripe')}
            className={`pb-2.5 flex items-center gap-1.5 transition-all border-b-2 cursor-pointer ${
              activeTab === 'stripe'
                ? 'border-[#0084FF] text-[#0084FF]'
                : 'border-transparent text-slate-400 hover:text-slate-700'
            }`}
          >
            <Link className="h-3.5 w-3.5" />
            <span>Payment Link</span>
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSave} className="p-6 space-y-6 overflow-y-auto flex-1 text-left">
          
          {/* Host Controls Tab */}
          {activeTab === 'host_controls' && (
            <div className="space-y-4">
              
              {/* Persistent Meeting Link Box with Rotate Option */}
              <div className="p-4 rounded-2xl bg-blue-50/70 border border-blue-200/80 space-y-2">
                <div className="flex items-center justify-between text-xs font-semibold text-[#0084FF]">
                  <span className="flex items-center gap-1.5">
                    <Globe className="h-3.5 w-3.5" />
                    <span>Your Persistent Meeting Link</span>
                  </span>
                  <span className="text-[10px] font-mono text-emerald-600 bg-white px-2 py-0.5 rounded-full border border-blue-200">
                    Always Online
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    readOnly
                    value={meetingUrl}
                    className="flex-1 px-3 py-2 text-xs font-mono rounded-xl bg-white border border-blue-200 text-slate-800 select-all"
                  />
                  <button
                    type="button"
                    onClick={handleCopyMeetingLink}
                    className="px-3.5 py-2 rounded-xl text-xs font-semibold bg-[#0084FF] hover:bg-[#0074E0] text-white flex items-center gap-1.5 cursor-pointer shadow-sm shadow-blue-500/20"
                    title="Copy persistent link"
                  >
                    {linkCopied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
                    <span>{linkCopied ? 'Copied' : 'Copy'}</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleRotateLink}
                    disabled={isRotating}
                    className="p-2 rounded-xl bg-white border border-blue-200 text-[#0084FF] hover:bg-blue-100/50 cursor-pointer shadow-sm transition-all"
                    title="Rotate / Regenerate new unique room link"
                  >
                    <RotateCcw className={`h-4 w-4 ${isRotating ? 'animate-spin' : ''}`} />
                  </button>
                </div>
                <p className="text-[11px] text-slate-500">
                  Click the rotate icon anytime to generate a brand new secure link and invalidate the old one.
                </p>
              </div>

              {/* Toggles */}
              <div className="space-y-3 pt-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Admission &amp; In-Meeting Permissions
                </h4>

                <div className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80">
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <Lock className="h-3.5 w-3.5 text-slate-700" />
                      <span className="text-xs font-semibold text-slate-900">
                        Require Host Approval (Waiting Room)
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500">
                      When enabled, guests wait in lobby until host admits them with chime.
                    </p>
                  </div>
                  <input
                    type="checkbox"
                    checked={requireHostApproval}
                    onChange={(e) => setRequireHostApproval(e.target.checked)}
                    className="h-4 w-4 rounded text-[#0084FF] focus:ring-0 cursor-pointer"
                  />
                </div>

                <div className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80">
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <MonitorUp className="h-3.5 w-3.5 text-slate-700" />
                      <span className="text-xs font-semibold text-slate-900">
                        Allow Participants to Share Screen
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500">
                      Let connected attendees share their screen during the call.
                    </p>
                  </div>
                  <input
                    type="checkbox"
                    checked={allowScreenShare}
                    onChange={(e) => setAllowScreenShare(e.target.checked)}
                    className="h-4 w-4 rounded text-[#0084FF] focus:ring-0 cursor-pointer"
                  />
                </div>

                <div className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80">
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <MessageSquare className="h-3.5 w-3.5 text-slate-700" />
                      <span className="text-xs font-semibold text-slate-900">
                        Enable Live Chat &amp; Audience Q&amp;A
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500">
                      Allow participants to ask questions and send in-meeting messages.
                    </p>
                  </div>
                  <input
                    type="checkbox"
                    checked={allowChat}
                    onChange={(e) => setAllowChat(e.target.checked)}
                    className="h-4 w-4 rounded text-[#0084FF] focus:ring-0 cursor-pointer"
                  />
                </div>

                <div className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80">
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <Mic className="h-3.5 w-3.5 text-slate-700" />
                      <span className="text-xs font-semibold text-slate-900">
                        Mute Participants upon Entry
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500">
                      Automatically mute attendee microphones when they join.
                    </p>
                  </div>
                  <input
                    type="checkbox"
                    checked={muteOnEntry}
                    onChange={(e) => setMuteOnEntry(e.target.checked)}
                    className="h-4 w-4 rounded text-[#0084FF] focus:ring-0 cursor-pointer"
                  />
                </div>
              </div>

            </div>
          )}

          {/* Profile & Handle Tab */}
          {activeTab === 'profile' && (
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Host Full Name
                </label>
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-[#0084FF] focus:outline-none"
                  placeholder="e.g. Sarah Jenkins"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Persistent Room Slug / Handle
                </label>
                <div className="flex items-center">
                  <span className="px-3 py-2 text-xs bg-slate-100 border border-r-0 border-slate-200 rounded-l-xl text-slate-500 font-mono">
                    letitbe.me/@
                  </span>
                  <input
                    type="text"
                    required
                    value={customSlug}
                    onChange={(e) => setCustomSlug(e.target.value)}
                    className="flex-1 px-3 py-2 text-xs rounded-r-xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-[#0084FF] focus:outline-none font-mono font-bold text-slate-900"
                    placeholder="sarah"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Stripe Payment Tab */}
          {activeTab === 'stripe' && (
            <div className="space-y-3">
              <label className="block text-xs font-semibold text-slate-700">
                Custom Stripe Payment Link URL
              </label>
              <input
                type="url"
                value={stripeLink}
                onChange={(e) => setStripeLink(e.target.value)}
                placeholder="https://buy.stripe.com/test_..."
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-[#0084FF] focus:outline-none font-mono"
              />
              <p className="text-[11px] text-slate-400">
                When attendees click the in-stream Pro offer, they will check out through this direct link.
              </p>
            </div>
          )}

          {/* Submit Action */}
          <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-500 hover:text-slate-800 cursor-pointer"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl text-xs font-semibold bg-[#0084FF] hover:bg-[#0074E0] text-white flex items-center gap-1.5 cursor-pointer shadow-md shadow-blue-500/20"
            >
              {isSaved ? <Check className="h-3.5 w-3.5" /> : null}
              <span>{isSaved ? 'Settings Saved' : 'Save Changes'}</span>
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};
