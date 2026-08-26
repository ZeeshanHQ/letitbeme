import React, { useState } from 'react';
import {
  X,
  Sliders,
  DollarSign,
  Globe,
  Radio,
  CheckCircle2,
  Calendar,
  Copy,
  Check,
} from 'lucide-react';
import { useStream, InteractiveWidgetType } from '../../context/StreamContext';
import { useAuth } from '../../context/AuthContext';

interface StreamBuilderModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const StreamBuilderModal: React.FC<StreamBuilderModalProps> = ({ isOpen, onClose }) => {
  const {
    title,
    setStreamTitle,
    offerTitle,
    setOfferTitle,
    offerPrice,
    setOfferPrice,
    customEmbedUrl,
    setCustomEmbedUrl,
    activeWidget,
    setActiveWidget,
    saveStreamToSupabase,
  } = useStream();

  const { user } = useAuth();

  const [localTitle, setLocalTitle] = useState(title);
  const [localOfferTitle, setLocalOfferTitle] = useState(offerTitle);
  const [localOfferPrice, setLocalOfferPrice] = useState(offerPrice);
  const [localSandboxUrl, setLocalSandboxUrl] = useState(customEmbedUrl);
  const [localWidget, setLocalWidget] = useState<InteractiveWidgetType>(activeWidget);
  const [isSaving, setIsSaving] = useState(false);
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const meetingUrl = `${window.location.origin}/?room=${user?.customSlug || 'live'}`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(meetingUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setStreamTitle(localTitle);
    setOfferTitle(localOfferTitle);
    setOfferPrice(Number(localOfferPrice));
    setCustomEmbedUrl(localSandboxUrl);
    setActiveWidget(localWidget);

    await saveStreamToSupabase();
    setIsSaving(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in font-sans">
      <div className="bg-white rounded-3xl border border-slate-200/90 shadow-2xl max-w-lg w-full p-6 sm:p-8 space-y-6 animate-slide-up relative">
        
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-6 right-6 p-1.5 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-all cursor-pointer"
        >
          <X className="h-4 w-4" />
        </button>

        <div className="space-y-1 text-left">
          <div className="flex items-center gap-2">
            <div className="h-7 w-7 rounded-xl bg-blue-50 border border-blue-200 flex items-center justify-center text-[#0084FF]">
              <Sliders className="h-4 w-4" />
            </div>
            <h3 className="text-xl font-heading font-bold text-slate-900 tracking-tight">
              Meeting Room Controls
            </h3>
          </div>
          <p className="text-xs text-slate-500 font-light">
            Configure your meeting title, in-stream interactive tools, and persistent room link.
          </p>
        </div>

        {/* Persistent Meeting Link */}
        <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200 text-left space-y-1.5">
          <label className="block text-[11px] font-semibold text-slate-600">
            Persistent Room Link
          </label>
          <div className="flex items-center gap-2">
            <input
              type="text"
              readOnly
              value={meetingUrl}
              className="flex-1 px-3 py-1.5 text-xs font-mono rounded-lg bg-white border border-slate-200 text-slate-800 select-all"
            />
            <button
              type="button"
              onClick={handleCopyLink}
              className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-[#0084FF] hover:bg-[#0074E0] text-white flex items-center gap-1 cursor-pointer"
            >
              {copied ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
              <span>{copied ? 'Copied' : 'Copy'}</span>
            </button>
          </div>
        </div>

        <form onSubmit={handleSave} className="space-y-4 text-left">
          {/* Meeting Title */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Meeting Room Title
            </label>
            <input
              type="text"
              required
              value={localTitle}
              onChange={(e) => setLocalTitle(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50 text-slate-900 focus:bg-white focus:border-[#0084FF] focus:outline-none"
              placeholder="e.g. Weekly Strategy & Product Review"
            />
          </div>

          {/* Active In-Stream Interactive Widget Picker */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Default In-Meeting Tool for Attendees
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setLocalWidget('sandbox')}
                className={`p-2.5 rounded-xl border text-left text-xs transition-all flex items-center gap-2 cursor-pointer ${
                  localWidget === 'sandbox'
                    ? 'border-[#0084FF] bg-blue-50/70 font-semibold text-blue-950 ring-1 ring-[#0084FF]'
                    : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                }`}
              >
                <Globe className="h-4 w-4 text-[#0084FF] shrink-0" />
                <span>Apps &amp; Shared Notes</span>
              </button>

              <button
                type="button"
                onClick={() => setLocalWidget('poll')}
                className={`p-2.5 rounded-xl border text-left text-xs transition-all flex items-center gap-2 cursor-pointer ${
                  localWidget === 'poll'
                    ? 'border-[#0084FF] bg-blue-50/70 font-semibold text-blue-950 ring-1 ring-[#0084FF]'
                    : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                }`}
              >
                <Radio className="h-4 w-4 text-purple-600 shrink-0" />
                <span>Live Audience Poll</span>
              </button>

              <button
                type="button"
                onClick={() => setLocalWidget('lead_gen')}
                className={`p-2.5 rounded-xl border text-left text-xs transition-all flex items-center gap-2 cursor-pointer ${
                  localWidget === 'lead_gen'
                    ? 'border-[#0084FF] bg-blue-50/70 font-semibold text-blue-950 ring-1 ring-[#0084FF]'
                    : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                }`}
              >
                <Calendar className="h-4 w-4 text-emerald-600 shrink-0" />
                <span>Q&amp;A / Agenda</span>
              </button>

              <button
                type="button"
                onClick={() => setLocalWidget('checkout')}
                className={`p-2.5 rounded-xl border text-left text-xs transition-all flex items-center gap-2 cursor-pointer ${
                  localWidget === 'checkout'
                    ? 'border-[#0084FF] bg-blue-50/70 font-semibold text-blue-950 ring-1 ring-[#0084FF]'
                    : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                }`}
              >
                <DollarSign className="h-4 w-4 text-[#0084FF] shrink-0" />
                <span>Pro Tier ($19.99)</span>
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={isSaving}
            className="w-full py-3 px-4 rounded-xl text-xs font-semibold bg-[#0084FF] hover:bg-[#0074E0] text-white flex items-center justify-center gap-2 cursor-pointer shadow-md shadow-blue-500/20"
          >
            <CheckCircle2 className="h-4 w-4" />
            <span>{isSaving ? 'Saving...' : 'Save & Update Meeting Room'}</span>
          </button>
        </form>

      </div>
    </div>
  );
};
