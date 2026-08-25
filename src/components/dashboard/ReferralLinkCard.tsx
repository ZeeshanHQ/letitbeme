import React, { useState } from 'react';
import {
  Copy,
  Check,
  QrCode,
  TrendingUp,
  Users,
  DollarSign,
  MousePointerClick,
  Share2,
  ExternalLink,
  ShieldCheck,
} from 'lucide-react';
import { ReferralStat } from '../../types';
import { Button } from '../common/Button';

interface ReferralLinkCardProps {
  stat: ReferralStat;
}

export const ReferralLinkCard: React.FC<ReferralLinkCardProps> = ({ stat }) => {
  const [copied, setCopied] = useState(false);
  const [showQr, setShowQr] = useState(false);

  const fullUrl = `https://letitbe.me/live?ref=${stat.code}&utm_source=${stat.utmSource}&utm_campaign=${stat.utmCampaign}`;

  const handleCopy = () => {
    navigator.clipboard?.writeText(fullUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-[0_8px_30px_rgb(0,0,0,0.03)] hover:border-indigo-200 transition-all">
      {/* Header Info */}
      <div className="flex items-start justify-between gap-3 mb-4">
        <div className="flex items-center gap-3">
          <img
            src={stat.avatar}
            alt={stat.ambassadorName}
            className="h-11 w-11 rounded-full object-cover border border-slate-200"
          />
          <div>
            <div className="flex items-center gap-2">
              <h4 className="text-sm font-bold text-slate-900">
                {stat.ambassadorName}
              </h4>
              <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full ${
                stat.status === 'vip'
                  ? 'bg-indigo-50 text-indigo-700 border border-indigo-200'
                  : 'bg-slate-100 text-slate-600'
              }`}>
                {stat.status.toUpperCase()}
              </span>
            </div>
            <p className="text-xs text-slate-500">
              {stat.role} • Code: <span className="font-mono font-semibold text-slate-700">{stat.code}</span>
            </p>
          </div>
        </div>

        <button
          onClick={() => setShowQr(!showQr)}
          className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 transition-all"
          title="Toggle QR Code"
        >
          <QrCode className="h-4 w-4" />
        </button>
      </div>

      {/* QR Code expansion if open */}
      {showQr && (
        <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 text-center mb-4 animate-fade-in flex flex-col items-center">
          <img
            src={`https://api.qrserver.com/v1/create-qr-code/?size=140x140&data=${encodeURIComponent(fullUrl)}`}
            alt="Referral QR Code"
            className="h-28 w-28 rounded-lg border border-slate-200 shadow-sm mb-2"
          />
          <span className="text-[11px] font-mono text-slate-500">
            Scan to enter stream with instant ambassador tracking
          </span>
        </div>
      )}

      {/* Tracking Link Box */}
      <div className="flex items-center gap-2 p-2 bg-slate-50 rounded-xl border border-slate-200/80 mb-4">
        <span className="text-xs font-mono text-slate-600 truncate flex-1 pl-1">
          {fullUrl}
        </span>
        <Button
          variant={copied ? 'secondary' : 'primary'}
          size="sm"
          onClick={handleCopy}
          leftIcon={copied ? <Check className="h-3.5 w-3.5 text-emerald-600" /> : <Copy className="h-3.5 w-3.5" />}
        >
          {copied ? 'Copied' : 'Copy'}
        </Button>
      </div>

      {/* Numerical Metrics Matrix (JetBrains Mono) */}
      <div className="grid grid-cols-4 gap-2 pt-2 border-t border-slate-100 text-center font-mono">
        <div className="p-2 rounded-lg bg-slate-50/70">
          <span className="text-[10px] text-slate-400 block font-sans">Clicks</span>
          <span className="text-xs font-bold text-slate-800">{stat.clicks.toLocaleString()}</span>
        </div>
        <div className="p-2 rounded-lg bg-slate-50/70">
          <span className="text-[10px] text-slate-400 block font-sans">Attended</span>
          <span className="text-xs font-bold text-indigo-600">{stat.liveAttendees.toLocaleString()}</span>
        </div>
        <div className="p-2 rounded-lg bg-slate-50/70">
          <span className="text-[10px] text-slate-400 block font-sans">Sales</span>
          <span className="text-xs font-bold text-emerald-600">{stat.salesCount}</span>
        </div>
        <div className="p-2 rounded-lg bg-emerald-50/70 border border-emerald-100">
          <span className="text-[10px] text-emerald-700 block font-sans font-semibold">Earned</span>
          <span className="text-xs font-bold text-emerald-700">${stat.commission.toLocaleString()}</span>
        </div>
      </div>
    </div>
  );
};
