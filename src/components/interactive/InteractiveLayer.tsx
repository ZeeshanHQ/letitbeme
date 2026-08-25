import React from 'react';
import {
  BarChart3,
  Globe,
  Calendar,
  Sparkles,
  CreditCard,
  Layers,
} from 'lucide-react';
import { useStream, InteractiveWidgetType } from '../../context/StreamContext';
import { ProductCheckoutWidget } from './ProductCheckoutWidget';
import { LivePollWidget } from './LivePollWidget';
import { SandboxedIframe } from './SandboxedIframe';
import { LeadCaptureWidget } from './LeadCaptureWidget';

export const InteractiveLayer: React.FC = () => {
  const { activeWidget, setActiveWidget } = useStream();

  return (
    <div className="flex flex-col h-full bg-white rounded-3xl border border-slate-200/90 shadow-sm overflow-hidden font-sans">
      {/* Top Segmented Tabs (Google Meet / Teams Style) */}
      <div className="p-2 bg-[#FAF9F6] border-b border-slate-200/80">
        <div className="grid grid-cols-4 gap-1 w-full text-center">
          <button
            onClick={() => setActiveWidget('sandbox')}
            className={`py-2 px-1 rounded-xl text-[11px] font-semibold transition-all flex flex-col sm:flex-row items-center justify-center gap-1 cursor-pointer ${
              activeWidget === 'sandbox'
                ? 'bg-slate-900 text-white shadow-sm'
                : 'text-slate-600 hover:text-obsidian hover:bg-white/80'
            }`}
          >
            <Globe className="h-3.5 w-3.5 shrink-0" />
            <span className="truncate">Apps & Notes</span>
          </button>

          <button
            onClick={() => setActiveWidget('poll')}
            className={`py-2 px-1 rounded-xl text-[11px] font-semibold transition-all flex flex-col sm:flex-row items-center justify-center gap-1 cursor-pointer ${
              activeWidget === 'poll'
                ? 'bg-slate-900 text-white shadow-sm'
                : 'text-slate-600 hover:text-obsidian hover:bg-white/80'
            }`}
          >
            <BarChart3 className="h-3.5 w-3.5 shrink-0" />
            <span className="truncate">Live Poll</span>
          </button>

          <button
            onClick={() => setActiveWidget('lead_gen')}
            className={`py-2 px-1 rounded-xl text-[11px] font-semibold transition-all flex flex-col sm:flex-row items-center justify-center gap-1 cursor-pointer ${
              activeWidget === 'lead_gen'
                ? 'bg-slate-900 text-white shadow-sm'
                : 'text-slate-600 hover:text-obsidian hover:bg-white/80'
            }`}
          >
            <Calendar className="h-3.5 w-3.5 shrink-0" />
            <span className="truncate">Q&A / Agenda</span>
          </button>

          <button
            onClick={() => setActiveWidget('checkout')}
            className={`py-2 px-1 rounded-xl text-[11px] font-semibold transition-all flex flex-col sm:flex-row items-center justify-center gap-1 cursor-pointer ${
              activeWidget === 'checkout'
                ? 'bg-slate-900 text-white shadow-sm'
                : 'text-slate-600 hover:text-obsidian hover:bg-white/80'
            }`}
          >
            <CreditCard className="h-3.5 w-3.5 shrink-0" />
            <span className="truncate">Pro ($19.99)</span>
          </button>
        </div>
      </div>

      {/* Widget Container Content */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-5 relative bg-white">
        {activeWidget === 'sandbox' && <SandboxedIframe />}
        {activeWidget === 'poll' && <LivePollWidget />}
        {activeWidget === 'lead_gen' && <LeadCaptureWidget />}
        {activeWidget === 'checkout' && <ProductCheckoutWidget />}
      </div>
    </div>
  );
};
