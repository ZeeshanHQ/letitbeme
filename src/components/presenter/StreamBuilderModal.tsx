import React, { useState } from 'react';
import {
  X,
  Sliders,
  DollarSign,
  Globe,
  Radio,
  Sparkles,
  CheckCircle2,
  Calendar,
} from 'lucide-react';
import { useStream, InteractiveWidgetType } from '../../context/StreamContext';
import { Button } from '../common/Button';

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

  const [localTitle, setLocalTitle] = useState(title);
  const [localOfferTitle, setLocalOfferTitle] = useState(offerTitle);
  const [localOfferPrice, setLocalOfferPrice] = useState(offerPrice);
  const [localSandboxUrl, setLocalSandboxUrl] = useState(customEmbedUrl);
  const [localWidget, setLocalWidget] = useState<InteractiveWidgetType>(activeWidget);
  const [isSaving, setIsSaving] = useState(false);

  if (!isOpen) return null;

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
    <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in font-sans">
      <div className="bg-white rounded-3xl border border-slate-200/90 shadow-2xl max-w-lg w-full p-6 sm:p-8 space-y-6 animate-slide-up relative">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-6 right-6 p-1.5 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-all"
        >
          <X className="h-4 w-4" />
        </button>

        <div className="space-y-1 text-left">
          <div className="flex items-center gap-2">
            <div className="h-7 w-7 rounded-xl bg-indigo-50 border border-indigo-200 flex items-center justify-center text-indigo-600">
              <Sliders className="h-4 w-4" />
            </div>
            <h3 className="text-xl font-heading font-semibold text-slate-900 tracking-tight">
              Stream Studio Builder
            </h3>
          </div>
          <p className="text-xs text-slate-500 font-light">
            Configure your broadcast title, in-stream interactive offers, and sandboxed apps.
          </p>
        </div>

        <form onSubmit={handleSave} className="space-y-4 text-left">
          {/* Stream Broadcast Title */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Live Stream Broadcast Title
            </label>
            <input
              type="text"
              required
              value={localTitle}
              onChange={(e) => setLocalTitle(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50/50 text-slate-900 focus:bg-white focus:border-indigo-500 focus:outline-none"
              placeholder="e.g. Masterclass: Scaling to 8-Figures with Zero Tab Churn"
            />
          </div>

          {/* Active In-Stream Interactive Widget Picker */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Default In-Stream Widget for Attendees
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setLocalWidget('checkout')}
                className={`p-2.5 rounded-xl border text-left text-xs transition-all flex items-center gap-2 ${
                  localWidget === 'checkout'
                    ? 'border-indigo-600 bg-indigo-50/70 font-semibold text-indigo-950 ring-1 ring-indigo-500'
                    : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                }`}
              >
                <DollarSign className="h-4 w-4 text-indigo-600 shrink-0" />
                <span>1-Click Stripe Offer</span>
              </button>

              <button
                type="button"
                onClick={() => setLocalWidget('sandbox')}
                className={`p-2.5 rounded-xl border text-left text-xs transition-all flex items-center gap-2 ${
                  localWidget === 'sandbox'
                    ? 'border-indigo-600 bg-indigo-50/70 font-semibold text-indigo-950 ring-1 ring-indigo-500'
                    : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                }`}
              >
                <Globe className="h-4 w-4 text-cyan-600 shrink-0" />
                <span>Sandboxed App / Demo</span>
              </button>

              <button
                type="button"
                onClick={() => setLocalWidget('poll')}
                className={`p-2.5 rounded-xl border text-left text-xs transition-all flex items-center gap-2 ${
                  localWidget === 'poll'
                    ? 'border-indigo-600 bg-indigo-50/70 font-semibold text-indigo-950 ring-1 ring-indigo-500'
                    : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                }`}
              >
                <Radio className="h-4 w-4 text-purple-600 shrink-0" />
                <span>Live Audience Poll</span>
              </button>

              <button
                type="button"
                onClick={() => setLocalWidget('lead_gen')}
                className={`p-2.5 rounded-xl border text-left text-xs transition-all flex items-center gap-2 ${
                  localWidget === 'lead_gen'
                    ? 'border-indigo-600 bg-indigo-50/70 font-semibold text-indigo-950 ring-1 ring-indigo-500'
                    : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                }`}
              >
                <Calendar className="h-4 w-4 text-emerald-600 shrink-0" />
                <span>VIP Demo Booking</span>
              </button>
            </div>
          </div>

          {/* In-Stream Product Deal Fields */}
          {localWidget === 'checkout' && (
            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-3 animate-fade-in">
              <span className="text-[11px] font-mono font-semibold text-indigo-600 uppercase tracking-wider block">
                In-Stream Checkout Configuration
              </span>
              <div className="grid grid-cols-3 gap-2">
                <div className="col-span-2">
                  <label className="block text-[11px] text-slate-600 mb-1">Offer Title</label>
                  <input
                    type="text"
                    value={localOfferTitle}
                    onChange={(e) => setLocalOfferTitle(e.target.value)}
                    className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-slate-200 bg-white text-slate-900 focus:outline-none focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-[11px] text-slate-600 mb-1">Price ($)</label>
                  <input
                    type="number"
                    value={localOfferPrice}
                    onChange={(e) => setLocalOfferPrice(Number(e.target.value))}
                    className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-slate-200 bg-white text-slate-900 font-mono font-bold focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Sandboxed Demo / Cal.com URL */}
          {localWidget === 'sandbox' && (
            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2 animate-fade-in">
              <label className="block text-[11px] font-mono font-semibold text-cyan-700 uppercase tracking-wider">
                Sandboxed Demo / Cal.com URL
              </label>
              <input
                type="url"
                value={localSandboxUrl}
                onChange={(e) => setLocalSandboxUrl(e.target.value)}
                placeholder="https://app.yourdomain.com/demo or https://cal.com/founder"
                className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-slate-200 bg-white text-slate-900 font-mono focus:outline-none focus:border-cyan-500"
              />
              <span className="text-[10px] text-slate-400 block font-light">
                Embedded directly inside the viewer container with zero iframe redirect.
              </span>
            </div>
          )}

          <Button
            type="submit"
            variant="primary"
            className="w-full rounded-xl py-2.5 text-xs font-medium shadow-md shadow-indigo-500/20"
            isLoading={isSaving}
            rightIcon={<CheckCircle2 className="h-4 w-4" />}
          >
            Save & Update Live Broadcast
          </Button>
        </form>

      </div>
    </div>
  );
};
