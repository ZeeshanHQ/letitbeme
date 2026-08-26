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
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-md flex items-center justify-center p-4 animate-fade-in font-['Plus_Jakarta_Sans',sans-serif]">
      <div className="bg-white rounded-3xl border border-slate-200/90 shadow-2xl max-w-lg w-full p-6 sm:p-8 space-y-6 animate-slide-up relative text-left">
        
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-6 right-6 p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-all cursor-pointer"
        >
          <X className="h-4 w-4" />
        </button>

        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-xl bg-blue-50 border border-blue-200 flex items-center justify-center text-[#0084FF]">
              <Sliders className="h-4 w-4" />
            </div>
            <h3 className="text-xl font-heading font-bold text-[#0f172a] tracking-tight">
              Meeting Setup &amp; Tools
            </h3>
          </div>
          <p className="text-xs text-slate-500 font-normal">
            Configure your meeting room title and active in-stream interactive tool.
          </p>
        </div>

        {/* Persistent Meeting Link */}
        <div className="p-3.5 rounded-2xl bg-blue-50/70 border border-blue-200/80 space-y-1.5">
          <label className="block text-[11px] font-semibold text-[#0084FF]">
            Your Persistent Meeting Link
          </label>
          <div className="flex items-center gap-2">
            <input
              type="text"
              readOnly
              value={meetingUrl}
              className="flex-1 px-3 py-1.5 text-xs font-mono rounded-xl bg-white border border-blue-200 text-slate-800 select-all"
            />
            <button
              type="button"
              onClick={handleCopyLink}
              className="px-3.5 py-1.5 rounded-xl text-xs font-semibold bg-[#0084FF] hover:bg-[#0074E0] text-white flex items-center gap-1 cursor-pointer shadow-sm shadow-blue-500/20"
            >
              {copied ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
              <span>{copied ? 'Copied' : 'Copy'}</span>
            </button>
          </div>
        </div>

        <form onSubmit={handleSave} className="space-y-4">
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
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50 text-slate-900 focus:bg-white focus:border-[#0084FF] focus:outline-none font-sans"
              placeholder="e.g. Executive Strategy & Product Review"
            />
          </div>

          {/* Active In-Stream Interactive Widget Picker */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Featured In-Meeting Tool (Shown Beside Stream)
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setLocalWidget('sandbox')}
                className={`p-3 rounded-2xl border text-left text-xs transition-all flex items-center gap-2.5 cursor-pointer ${
                  localWidget === 'sandbox'
                    ? 'border-[#0084FF] bg-blue-50/80 font-bold text-[#0084FF] ring-2 ring-blue-500/20'
                    : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                }`}
              >
                <Globe className="h-4 w-4 text-[#0084FF] shrink-0" />
                <div>
                  <span className="block font-heading">Whiteboard &amp; Notes</span>
                  <span className="text-[10px] text-slate-400 font-normal">Collaborative canvas</span>
                </div>
              </button>

              <button
                type="button"
                onClick={() => setLocalWidget('poll')}
                className={`p-3 rounded-2xl border text-left text-xs transition-all flex items-center gap-2.5 cursor-pointer ${
                  localWidget === 'poll'
                    ? 'border-[#0084FF] bg-blue-50/80 font-bold text-[#0084FF] ring-2 ring-blue-500/20'
                    : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                }`}
              >
                <Radio className="h-4 w-4 text-purple-600 shrink-0" />
                <div>
                  <span className="block font-heading">Live Audience Poll</span>
                  <span className="text-[10px] text-slate-400 font-normal">Real-time voting</span>
                </div>
              </button>

              <button
                type="button"
                onClick={() => setLocalWidget('lead_gen')}
                className={`p-3 rounded-2xl border text-left text-xs transition-all flex items-center gap-2.5 cursor-pointer ${
                  localWidget === 'lead_gen'
                    ? 'border-[#0084FF] bg-blue-50/80 font-bold text-[#0084FF] ring-2 ring-blue-500/20'
                    : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                }`}
              >
                <Calendar className="h-4 w-4 text-emerald-600 shrink-0" />
                <div>
                  <span className="block font-heading">Agenda &amp; Topics</span>
                  <span className="text-[10px] text-slate-400 font-normal">Session checklist</span>
                </div>
              </button>

              <button
                type="button"
                onClick={() => setLocalWidget('checkout')}
                className={`p-3 rounded-2xl border text-left text-xs transition-all flex items-center gap-2.5 cursor-pointer ${
                  localWidget === 'checkout'
                    ? 'border-[#0084FF] bg-blue-50/80 font-bold text-[#0084FF] ring-2 ring-blue-500/20'
                    : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                }`}
              >
                <DollarSign className="h-4 w-4 text-[#0084FF] shrink-0" />
                <div>
                  <span className="block font-heading">In-Stream Offer</span>
                  <span className="text-[10px] text-slate-400 font-normal">1-click checkout</span>
                </div>
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={isSaving}
            className="w-full py-3 px-4 rounded-2xl text-xs font-semibold bg-[#0084FF] hover:bg-[#0074E0] text-white flex items-center justify-center gap-2 cursor-pointer shadow-md shadow-blue-500/20 transition-all"
          >
            <CheckCircle2 className="h-4 w-4" />
            <span>{isSaving ? 'Updating...' : 'Save & Apply to Room'}</span>
          </button>
        </form>

      </div>
    </div>
  );
};
