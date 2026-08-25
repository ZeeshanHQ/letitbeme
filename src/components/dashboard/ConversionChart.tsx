import React from 'react';
import {
  TrendingUp,
  MousePointerClick,
  Users,
  CreditCard,
  Sparkles,
  ArrowRight,
  ShieldCheck,
} from 'lucide-react';

export const ConversionChart: React.FC = () => {
  const funnelSteps = [
    {
      label: 'Unique Referral Clicks',
      count: 12640,
      pct: 100,
      color: 'bg-indigo-500',
      textColor: 'text-indigo-600',
      note: 'Across 24 ambassadors',
    },
    {
      label: 'Live Stream Attendees',
      count: 5180,
      pct: 41.0,
      color: 'bg-indigo-600',
      textColor: 'text-indigo-700',
      note: 'Zero-drop WebRTC lobby',
    },
    {
      label: 'In-Stream Widget Interacted',
      count: 3840,
      pct: 30.4,
      relativePct: '74.1% of viewers',
      color: 'bg-cyan-500',
      textColor: 'text-cyan-600',
      note: 'Tested checkout/form in-stream',
    },
    {
      label: 'Final Completed Purchases',
      count: 872,
      pct: 6.9,
      relativePct: '16.8% stream conv',
      color: 'bg-emerald-500',
      textColor: 'text-emerald-600',
      note: '4.8x higher than legacy PXch',
    },
  ];

  const channels = [
    { name: 'LinkedIn Influencers', revenue: '$62,450', share: 45, conv: '18.4%' },
    { name: 'YouTube Live Description', revenue: '$41,200', share: 30, conv: '16.2%' },
    { name: 'Direct Sales Ambassadors', revenue: '$24,800', share: 18, conv: '17.9%' },
    { name: 'Partner Newsletters', revenue: '$9,850', share: 7, conv: '14.5%' },
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
      
      {/* Visual Conversion Funnel (7 Cols) */}
      <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200/80 p-6 shadow-sm flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between mb-5">
            <div>
              <h3 className="text-base font-bold text-slate-900">
                End-to-End Attribution Funnel
              </h3>
              <p className="text-xs text-slate-500">
                Real-time tracking from ambassador link click to in-stream purchase
              </p>
            </div>
            <span className="text-xs font-mono font-bold px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
              16.8% Net Conversion
            </span>
          </div>

          <div className="space-y-4">
            {funnelSteps.map((step, idx) => (
              <div key={idx} className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-slate-800">{step.label}</span>
                    {step.relativePct && (
                      <span className="text-[10px] font-mono font-bold px-1.5 py-0.2 rounded bg-indigo-50 text-indigo-700">
                        {step.relativePct}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-2 font-mono">
                    <span className="font-bold text-slate-900">{step.count.toLocaleString()}</span>
                    <span className="text-slate-400">({step.pct}%)</span>
                  </div>
                </div>

                <div className="h-3 w-full bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className={`h-full ${step.color} rounded-full transition-all duration-1000 ease-out`}
                    style={{ width: `${Math.max(8, step.pct)}%` }}
                  />
                </div>

                <span className="text-[10px] text-slate-400 font-medium block">
                  {step.note}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
          <div className="flex items-center gap-1.5">
            <Sparkles className="h-4 w-4 text-indigo-600" />
            <span>Zero cookie loss with server-side WebRTC attribution</span>
          </div>
          <span className="font-mono text-emerald-600 font-bold">$173,528 Gross GMV</span>
        </div>
      </div>

      {/* Top Channels Breakdown (5 Cols) */}
      <div className="lg:col-span-5 bg-white rounded-2xl border border-slate-200/80 p-6 shadow-sm flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between mb-5">
            <div>
              <h3 className="text-base font-bold text-slate-900">
                Channel Performance
              </h3>
              <p className="text-xs text-slate-500">
                Revenue & conversion rate by UTM source
              </p>
            </div>
          </div>

          <div className="space-y-4">
            {channels.map((ch, idx) => (
              <div key={idx} className="p-3 bg-slate-50/70 rounded-xl border border-slate-200/70 space-y-2">
                <div className="flex items-center justify-between text-xs font-semibold">
                  <span className="text-slate-800">{ch.name}</span>
                  <span className="font-mono text-emerald-600 font-bold">{ch.revenue}</span>
                </div>
                <div className="h-2 w-full bg-slate-200/60 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-indigo-500 to-cyan-500 rounded-full"
                    style={{ width: `${ch.share}%` }}
                  />
                </div>
                <div className="flex justify-between text-[11px] font-mono text-slate-400">
                  <span>{ch.share}% of total volume</span>
                  <span className="text-indigo-600 font-semibold">{ch.conv} Conv Rate</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400 font-mono">
          <span>Automatic Payout: 1st of month</span>
          <span className="text-slate-600 font-semibold">Stripe Connect</span>
        </div>
      </div>

    </div>
  );
};
