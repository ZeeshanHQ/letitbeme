import React, { useState } from 'react';
import {
  Sparkles,
  Link,
  Plus,
  Copy,
  Check,
  Percent,
  Tag,
  User,
  X,
} from 'lucide-react';
import { Button } from '../common/Button';

interface CampaignGeneratorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddCampaign: (campaign: any) => void;
}

export const CampaignGeneratorModal: React.FC<CampaignGeneratorModalProps> = ({
  isOpen,
  onClose,
  onAddCampaign,
}) => {
  const [ambassadorName, setAmbassadorName] = useState('');
  const [role, setRole] = useState('');
  const [code, setCode] = useState('');
  const [utmSource, setUtmSource] = useState('linkedin_creator');
  const [utmCampaign, setUtmCampaign] = useState('q3_masterclass');
  const [commissionRate, setCommissionRate] = useState('20');
  const [isCreated, setIsCreated] = useState(false);

  if (!isOpen) return null;

  const generatedUrl = `https://letitbe.me/live?ref=${code.toUpperCase() || 'CUSTOM-CODE'}&utm_source=${utmSource}&utm_campaign=${utmCampaign}`;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newStat = {
      id: `ref-${Date.now()}`,
      ambassadorName: ambassadorName.trim() || 'New Ambassador',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80',
      role: role.trim() || 'Growth Partner',
      code: (code.trim() || 'AMB-' + Math.floor(Math.random() * 900 + 100)).toUpperCase(),
      utmSource,
      utmCampaign,
      clicks: 0,
      registrations: 0,
      liveAttendees: 0,
      widgetInteractions: 0,
      salesCount: 0,
      conversionRate: 0,
      revenue: 0,
      commission: 0,
      status: 'active' as const,
      createdDate: new Date().toISOString().split('T')[0],
    };

    onAddCampaign(newStat);
    setIsCreated(true);
    setTimeout(() => {
      setIsCreated(false);
      onClose();
    }, 800);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in">
      <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-lg w-full p-6 sm:p-7 space-y-5 animate-slide-up">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div className="flex items-center gap-2.5">
            <div className="h-9 w-9 rounded-xl bg-indigo-50 border border-indigo-200 flex items-center justify-center text-indigo-600">
              <Link className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">
                Generate Smart Attribution Link
              </h3>
              <p className="text-xs text-slate-500">
                Provision a dedicated tracking link with real-time conversion payouts
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-3.5">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Ambassador / Partner
              </label>
              <input
                type="text"
                required
                value={ambassadorName}
                onChange={(e) => setAmbassadorName(e.target.value)}
                placeholder="e.g. Rachel Zane"
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50/50 text-slate-900 focus:bg-white focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Role / Title
              </label>
              <input
                type="text"
                required
                value={role}
                onChange={(e) => setRole(e.target.value)}
                placeholder="e.g. Sales Executive"
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50/50 text-slate-900 focus:bg-white focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Custom Referral Code
              </label>
              <input
                type="text"
                required
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder="e.g. RACHEL-VIP"
                className="w-full px-3 py-2 text-xs font-mono font-bold rounded-xl border border-slate-200 bg-slate-50/50 text-indigo-700 focus:bg-white focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 uppercase"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Commission %
              </label>
              <select
                value={commissionRate}
                onChange={(e) => setCommissionRate(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50/50 text-slate-900 focus:bg-white focus:border-indigo-500"
              >
                <option value="10">10% of Stream Sales</option>
                <option value="15">15% of Stream Sales</option>
                <option value="20">20% of Stream Sales (Standard)</option>
                <option value="30">30% VIP Tier</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                UTM Source
              </label>
              <input
                type="text"
                value={utmSource}
                onChange={(e) => setUtmSource(e.target.value)}
                className="w-full px-3 py-2 text-xs font-mono rounded-xl border border-slate-200 bg-slate-50/50 text-slate-800 focus:bg-white"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                UTM Campaign
              </label>
              <input
                type="text"
                value={utmCampaign}
                onChange={(e) => setUtmCampaign(e.target.value)}
                className="w-full px-3 py-2 text-xs font-mono rounded-xl border border-slate-200 bg-slate-50/50 text-slate-800 focus:bg-white"
              />
            </div>
          </div>

          {/* Generated URL Preview */}
          <div className="p-3 rounded-xl bg-indigo-50/60 border border-indigo-100">
            <span className="text-[10px] font-mono text-indigo-700 font-bold block mb-1">
              LIVE PREVIEW URL:
            </span>
            <p className="text-xs font-mono text-slate-700 break-all">
              {generatedUrl}
            </p>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-2.5 pt-2 border-t border-slate-100">
            <Button
              variant="secondary"
              size="sm"
              onClick={onClose}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              size="sm"
              leftIcon={isCreated ? <Check className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
            >
              {isCreated ? 'Link Created!' : 'Create Tracking Link'}
            </Button>
          </div>
        </form>

      </div>
    </div>
  );
};
