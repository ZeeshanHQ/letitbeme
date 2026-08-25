import React, { useState } from 'react';
import {
  Sparkles,
  UserCheck,
  CreditCard,
  BarChart3,
  Globe,
  Radio,
  CheckCircle2,
  Send,
  X,
} from 'lucide-react';
import { useStream } from '../../context/StreamContext';
import { InteractiveWidgetType } from '../../types';
import { Button } from '../common/Button';

interface WidgetTriggerModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const WidgetTriggerModal: React.FC<WidgetTriggerModalProps> = ({ isOpen, onClose }) => {
  const { activeWidget, setActiveWidget, customEmbedUrl, setCustomEmbedUrl } = useStream();
  const [selectedType, setSelectedType] = useState<InteractiveWidgetType>(activeWidget);
  const [embedInput, setEmbedInput] = useState(customEmbedUrl);
  const [pushSuccess, setPushSuccess] = useState(false);

  if (!isOpen) return null;

  const widgetOptions = [
    {
      type: 'lead_gen' as InteractiveWidgetType,
      title: 'VIP Demo & Lead Capture',
      desc: 'Embed 1-click calendar reservation slot picker. Zero redirect drop-off.',
      icon: UserCheck,
      color: 'text-indigo-600 bg-indigo-50 border-indigo-200',
    },
    {
      type: 'checkout' as InteractiveWidgetType,
      title: 'Live Product Checkout ($199)',
      desc: 'Push Stripe-tokenized card payment with live urgency countdown and celebratory confetti.',
      icon: CreditCard,
      color: 'text-rose-600 bg-rose-50 border-rose-200',
    },
    {
      type: 'poll' as InteractiveWidgetType,
      title: 'Real-Time Audience Poll',
      desc: 'Engage audience with live animated voting bars and instant WebRTC tally sync.',
      icon: BarChart3,
      color: 'text-cyan-600 bg-cyan-50 border-cyan-200',
    },
    {
      type: 'sandbox' as InteractiveWidgetType,
      title: 'Sandboxed External App / Website',
      desc: 'Let viewers test drive your SaaS app, demo sandbox, or Shopify store inside the video stream.',
      icon: Globe,
      color: 'text-emerald-600 bg-emerald-50 border-emerald-200',
    },
  ];

  const handlePushLive = () => {
    setActiveWidget(selectedType);
    if (selectedType === 'sandbox' && embedInput.trim()) {
      setCustomEmbedUrl(embedInput.trim());
    }
    setPushSuccess(true);
    setTimeout(() => {
      setPushSuccess(false);
      onClose();
    }, 900);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in">
      <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-xl w-full p-6 sm:p-7 space-y-5 animate-slide-up">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div className="flex items-center gap-2.5">
            <div className="h-9 w-9 rounded-xl bg-indigo-50 border border-indigo-200 flex items-center justify-center text-indigo-600">
              <Radio className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">
                Push Interactive Layer to Viewers
              </h3>
              <p className="text-xs text-slate-500">
                Instantly transforms the right canvas on all viewer screens
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-all"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Options List */}
        <div className="space-y-2.5">
          {widgetOptions.map((opt) => {
            const Icon = opt.icon;
            const isSelected = selectedType === opt.type;
            return (
              <button
                key={opt.type}
                type="button"
                onClick={() => setSelectedType(opt.type)}
                className={`w-full text-left p-3.5 rounded-2xl border transition-all flex items-start gap-3.5 ${
                  isSelected
                    ? 'border-indigo-600 bg-indigo-50/40 shadow-sm ring-1 ring-indigo-500'
                    : 'border-slate-200/90 hover:border-slate-300 bg-white'
                }`}
              >
                <div className={`h-9 w-9 rounded-xl border flex items-center justify-center shrink-0 ${opt.color}`}>
                  <Icon className="h-5 w-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-900">
                      {opt.title}
                    </span>
                    {activeWidget === opt.type && (
                      <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                        Currently Live
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">
                    {opt.desc}
                  </p>
                </div>
              </button>
            );
          })}
        </div>

        {/* URL input if sandbox is selected */}
        {selectedType === 'sandbox' && (
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1.5 animate-fade-in">
            <label className="block text-xs font-semibold text-slate-700">
              Sandboxed Embed URL
            </label>
            <input
              type="url"
              value={embedInput}
              onChange={(e) => setEmbedInput(e.target.value)}
              className="w-full px-3 py-1.5 text-xs font-mono rounded-lg border border-slate-200 bg-white text-slate-800 focus:outline-none focus:border-indigo-500"
              placeholder="https://your-product.com/demo"
            />
          </div>
        )}

        {/* Footer actions */}
        <div className="flex items-center justify-end gap-2.5 pt-2 border-t border-slate-100">
          <Button
            variant="secondary"
            size="sm"
            onClick={onClose}
          >
            Cancel
          </Button>
          <Button
            variant="primary"
            size="sm"
            onClick={handlePushLive}
            rightIcon={pushSuccess ? <CheckCircle2 className="h-4 w-4" /> : <Send className="h-4 w-4" />}
          >
            {pushSuccess ? 'Pushed to Viewers!' : 'Broadcast to Stream'}
          </Button>
        </div>

      </div>
    </div>
  );
};
