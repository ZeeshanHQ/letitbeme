import React, { useState, useRef } from 'react';
import {
  BarChart3,
  Globe,
  Calendar,
  CreditCard,
  Maximize2,
  Minimize2,
  GripHorizontal,
} from 'lucide-react';
import { useStream } from '../../context/StreamContext';
import { ProductCheckoutWidget } from './ProductCheckoutWidget';
import { LivePollWidget } from './LivePollWidget';
import { SandboxedIframe } from './SandboxedIframe';
import { LeadCaptureWidget } from './LeadCaptureWidget';

export const InteractiveLayer: React.FC = () => {
  const { activeWidget, setActiveWidget } = useStream();
  const [panelHeight, setPanelHeight] = useState<number | null>(null);
  const [isExpanded, setIsExpanded] = useState(false);
  const isDraggingRef = useRef(false);
  const startYRef = useRef(0);
  const startHeightRef = useRef(0);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleMouseDown = (e: React.MouseEvent) => {
    isDraggingRef.current = true;
    startYRef.current = e.clientY;
    startHeightRef.current = containerRef.current?.offsetHeight || 600;

    const handleMouseMove = (moveEvent: MouseEvent) => {
      if (!isDraggingRef.current) return;
      const deltaY = moveEvent.clientY - startYRef.current;
      const newHeight = Math.max(380, Math.min(1100, startHeightRef.current + deltaY));
      setPanelHeight(newHeight);
    };

    const handleMouseUp = () => {
      isDraggingRef.current = false;
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
  };

  return (
    <div
      ref={containerRef}
      style={panelHeight ? { height: `${panelHeight}px` } : undefined}
      className={`flex flex-col ${
        isExpanded ? 'h-[850px]' : panelHeight ? '' : 'h-full min-h-[540px]'
      } bg-white rounded-3xl border border-slate-200/90 shadow-sm overflow-hidden font-sans transition-height duration-150 relative`}
    >
      {/* Top Segmented Tabs */}
      <div className="p-2 bg-[#FAF9F6] border-b border-slate-200/80 flex items-center justify-between gap-1">
        <div className="grid grid-cols-4 gap-1 flex-1 text-center">
          <button
            type="button"
            onClick={() => setActiveWidget('sandbox')}
            className={`py-2 px-1 rounded-xl text-[11px] font-semibold transition-all flex flex-col sm:flex-row items-center justify-center gap-1 cursor-pointer ${
              activeWidget === 'sandbox'
                ? 'bg-slate-900 text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-900 hover:bg-white/80'
            }`}
          >
            <Globe className="h-3.5 w-3.5 shrink-0" />
            <span className="truncate">Apps &amp; Notes</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveWidget('poll')}
            className={`py-2 px-1 rounded-xl text-[11px] font-semibold transition-all flex flex-col sm:flex-row items-center justify-center gap-1 cursor-pointer ${
              activeWidget === 'poll'
                ? 'bg-slate-900 text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-900 hover:bg-white/80'
            }`}
          >
            <BarChart3 className="h-3.5 w-3.5 shrink-0" />
            <span className="truncate">Live Poll</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveWidget('lead_gen')}
            className={`py-2 px-1 rounded-xl text-[11px] font-semibold transition-all flex flex-col sm:flex-row items-center justify-center gap-1 cursor-pointer ${
              activeWidget === 'lead_gen'
                ? 'bg-slate-900 text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-900 hover:bg-white/80'
            }`}
          >
            <Calendar className="h-3.5 w-3.5 shrink-0" />
            <span className="truncate">Q&amp;A / Agenda</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveWidget('checkout')}
            className={`py-2 px-1 rounded-xl text-[11px] font-semibold transition-all flex flex-col sm:flex-row items-center justify-center gap-1 cursor-pointer ${
              activeWidget === 'checkout'
                ? 'bg-slate-900 text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-900 hover:bg-white/80'
            }`}
          >
            <CreditCard className="h-3.5 w-3.5 shrink-0" />
            <span className="truncate">Pro ($19.99)</span>
          </button>
        </div>

        {/* Expand / Shrink Button */}
        <button
          type="button"
          onClick={() => {
            setIsExpanded(!isExpanded);
            setPanelHeight(null);
          }}
          className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 transition-all cursor-pointer"
          title={isExpanded ? 'Collapse Height' : 'Expand Height'}
        >
          {isExpanded ? <Minimize2 className="h-3.5 w-3.5" /> : <Maximize2 className="h-3.5 w-3.5" />}
        </button>
      </div>

      {/* Widget Container Content */}
      <div className="flex-1 overflow-y-auto p-3 sm:p-4 relative bg-white">
        {activeWidget === 'sandbox' && <SandboxedIframe />}
        {activeWidget === 'poll' && <LivePollWidget />}
        {activeWidget === 'lead_gen' && <LeadCaptureWidget />}
        {activeWidget === 'checkout' && <ProductCheckoutWidget />}
      </div>

      {/* Stretch / Drag Handle at Bottom */}
      <div
        onMouseDown={handleMouseDown}
        className="w-full h-4 bg-slate-50 border-t border-slate-200/80 hover:bg-blue-50 cursor-ns-resize flex items-center justify-center transition-colors group select-none"
        title="Click and drag to stretch panel height"
      >
        <GripHorizontal className="h-3.5 w-3.5 text-slate-400 group-hover:text-[#0084FF] transition-colors" />
      </div>
    </div>
  );
};
