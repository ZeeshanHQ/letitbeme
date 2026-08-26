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
  ArrowRight,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { supabase, isSupabaseConfigured } from '../../lib/supabase';

interface CampaignGeneratorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onRefreshLinks?: () => void;
}

export const CampaignGeneratorModal: React.FC<CampaignGeneratorModalProps> = ({
  isOpen,
  onClose,
  onRefreshLinks,
}) => {
  const { user } = useAuth();
  const [ambassadorName, setAmbassadorName] = useState('');
  const [code, setCode] = useState('');
  const [commissionRate, setCommissionRate] = useState('15');
  const [isCreated, setIsCreated] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isCopied, setIsCopied] = useState(false);

  if (!isOpen) return null;

  const derivedSlug = (
    code.trim() ||
    ambassadorName.toLowerCase().replace(/[^a-z0-9]/g, '-') ||
    'promo'
  ).toLowerCase();

  const generatedUrl = `${window.location.origin}/?room=${user?.customSlug || 'live'}&ref=${derivedSlug}`;

  const handleCopyPreview = () => {
    navigator.clipboard.writeText(generatedUrl);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const linkId = `ref_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
    const commissionPercent = parseFloat(commissionRate) || 15.0;

    if (isSupabaseConfigured) {
      try {
        await supabase.from('letitbeme_referral_links').insert({
          id: linkId,
          host_id: user?.id || 'host',
          ambassador_name: ambassadorName.trim() || 'Direct Campaign',
          ambassador_email: user?.email || '',
          ref_slug: derivedSlug,
          commission_percent: commissionPercent,
          total_clicks: 0,
          total_sales: 0,
          total_revenue: 0.0,
          total_commission: 0.0,
        });
      } catch (err) {
        console.warn('Supabase referral creation note:', err);
      }
    }

    setIsLoading(false);
    setIsCreated(true);
    if (onRefreshLinks) onRefreshLinks();
    
    setTimeout(() => {
      setIsCreated(false);
      onClose();
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-md flex items-center justify-center p-4 animate-fade-in font-sans select-none">
      <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-lg w-full p-6 sm:p-7 space-y-5 animate-slide-up text-left">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div className="flex items-center gap-2.5">
            <div className="h-9 w-9 rounded-xl bg-blue-50 border border-blue-200 flex items-center justify-center text-[#0084FF]">
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
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 cursor-pointer"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Live Link Preview Box with Copy Button */}
        <div className="p-3.5 rounded-2xl bg-blue-50/70 border border-blue-200/80 space-y-1.5">
          <span className="text-[11px] font-mono font-bold text-[#0084FF] block">
            Generated Referral URL (Live Preview)
          </span>
          <div className="flex items-center gap-2">
            <div className="flex-1 text-xs font-mono text-slate-800 bg-white px-3 py-2 rounded-xl border border-blue-200 truncate select-all">
              {generatedUrl}
            </div>
            <button
              type="button"
              onClick={handleCopyPreview}
              className="px-3 py-2 rounded-xl text-xs font-semibold bg-white border border-blue-200 hover:bg-blue-100/50 text-[#0084FF] flex items-center gap-1 cursor-pointer transition-all shrink-0"
              title="Copy Preview URL"
            >
              {isCopied ? <Check className="h-3.5 w-3.5 text-emerald-600" /> : <Copy className="h-3.5 w-3.5" />}
              <span>{isCopied ? 'Copied' : 'Copy'}</span>
            </button>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              Campaign / Ambassador Name
            </label>
            <input
              type="text"
              required
              value={ambassadorName}
              onChange={(e) => {
                setAmbassadorName(e.target.value);
                if (!code) {
                  setCode(e.target.value.toLowerCase().replace(/[^a-z0-9-_]/g, ''));
                }
              }}
              placeholder="e.g. YouTube Masterclass Review"
              className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-[#0084FF] outline-none text-slate-900"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Custom Referral Slug (?ref=)
              </label>
              <input
                type="text"
                required
                value={code}
                onChange={(e) => setCode(e.target.value.toLowerCase().replace(/[^a-z0-9-_]/g, ''))}
                placeholder="yt-promo"
                className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 font-mono font-bold focus:bg-white focus:border-[#0084FF] outline-none text-slate-900"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Commission Share (%)
              </label>
              <input
                type="number"
                min="0"
                max="100"
                value={commissionRate}
                onChange={(e) => setCommissionRate(e.target.value)}
                placeholder="15"
                className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 font-mono font-bold focus:bg-white focus:border-[#0084FF] outline-none text-slate-900"
              />
            </div>
          </div>

          <div className="pt-2 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl font-semibold text-slate-500 hover:text-slate-800 cursor-pointer"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={isLoading}
              className="px-5 py-2.5 rounded-xl bg-[#0084FF] hover:bg-[#0074E0] text-white text-xs font-semibold flex items-center gap-2 shadow-md shadow-blue-500/20 cursor-pointer transition-all disabled:opacity-50"
            >
              {isLoading ? 'Creating...' : isCreated ? 'Created!' : 'Create Tracking Link'}
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};
