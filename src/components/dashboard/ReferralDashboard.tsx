import React, { useState, useEffect } from 'react';
import {
  Share2,
  Plus,
  Search,
  DollarSign,
  Users,
  Copy,
  Check,
  TrendingUp,
  Percent,
  Sparkles,
  ArrowRight,
  ExternalLink,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { CampaignGeneratorModal } from './CampaignGeneratorModal';
import { Button } from '../common/Button';
import { supabase, isSupabaseConfigured } from '../../lib/supabase';

interface RealReferralLink {
  id: string;
  host_id: string;
  ambassador_name: string;
  ambassador_email: string;
  ref_slug: string;
  commission_percent: number;
  total_clicks: number;
  total_sales: number;
  total_revenue: number;
  total_commission: number;
  created_at: string;
}

export const ReferralDashboard: React.FC = () => {
  const { user } = useAuth();
  const [links, setLinks] = useState<RealReferralLink[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchRealReferralData = async () => {
    if (!isSupabaseConfigured) {
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      const { data } = await supabase
        .from('letitbeme_referral_links')
        .select('*')
        .order('created_at', { ascending: false });

      if (data) {
        setLinks(data as RealReferralLink[]);
      }
    } catch (err) {
      console.warn('Error fetching real referral links:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchRealReferralData();
  }, []);

  const handleCopyLink = (refSlug: string, id: string) => {
    const url = `${window.location.origin}/?room=${user?.customSlug || 'live'}&ref=${refSlug}`;
    navigator.clipboard.writeText(url);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const filteredLinks = links.filter(
    (l) =>
      l.ambassador_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      l.ref_slug.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Compute 100% Real Live Aggregate Metrics
  const totalGmv = links.reduce((acc, curr) => acc + (Number(curr.total_revenue) || 0), 0);
  const totalCommission = links.reduce((acc, curr) => acc + (Number(curr.total_commission) || 0), 0);
  const totalClicks = links.reduce((acc, curr) => acc + (Number(curr.total_clicks) || 0), 0);
  const totalSales = links.reduce((acc, curr) => acc + (Number(curr.total_sales) || 0), 0);
  const realConversionRate = totalClicks > 0 ? ((totalSales / totalClicks) * 100).toFixed(1) : '0.0';

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-[#FAF9F6] p-4 sm:p-6 lg:p-8 space-y-8 pb-20 font-sans text-left">
      
      {/* Dashboard Top Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-blue-50 text-[#0084FF] border border-blue-200">
              <Share2 className="h-4 w-4" />
            </span>
            <h1 className="text-xl sm:text-2xl font-heading font-semibold text-slate-900 tracking-tight">
              Smart Referral &amp; Attribution Engine
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Real-time link tracking, multi-tier ambassador attribution, and instant conversion payouts.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Button
            variant="primary"
            size="sm"
            onClick={() => setIsModalOpen(true)}
            leftIcon={<Plus className="h-4 w-4" />}
            className="bg-[#0084FF]"
          >
            Create Tracking Link
          </Button>
        </div>
      </div>

      {/* 100% Real Aggregate KPI Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-sm space-y-1">
          <span className="text-xs font-semibold text-slate-400">Total Stream GMV</span>
          <div className="text-2xl font-bold font-mono text-slate-900">
            ${totalGmv.toFixed(2)}
          </div>
          <span className="text-[11px] font-mono text-emerald-600 font-semibold block">
            {totalSales} Verified In-Stream Sales
          </span>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-sm space-y-1">
          <span className="text-xs font-semibold text-slate-400">Commission Earned</span>
          <div className="text-2xl font-bold font-mono text-[#0084FF]">
            ${totalCommission.toFixed(2)}
          </div>
          <span className="text-[11px] font-mono text-slate-400 block">
            Direct Stripe ledger
          </span>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-sm space-y-1">
          <span className="text-xs font-semibold text-slate-400">Unique Link Clicks</span>
          <div className="text-2xl font-bold font-mono text-amber-600">
            {totalClicks}
          </div>
          <span className="text-[11px] font-mono text-slate-400 block">
            30-day cookie attribution
          </span>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-sm space-y-1">
          <span className="text-xs font-semibold text-slate-400">Conversion Rate</span>
          <div className="text-2xl font-bold font-mono text-emerald-600">
            {realConversionRate}%
          </div>
          <span className="text-[11px] font-mono text-slate-400 block">
            Real Click-to-Sale Ratio
          </span>
        </div>
      </div>

      {/* Active Tracking Links Section */}
      <div className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <h3 className="text-base font-bold text-slate-900">
              Active Referral Channels ({links.length})
            </h3>
          </div>

          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search referral links..."
              className="w-full pl-9 pr-3 py-1.5 text-xs rounded-xl border border-slate-200 bg-white focus:outline-none focus:border-[#0084FF]"
            />
          </div>
        </div>

        {/* Links Grid or Clean Zero State */}
        {filteredLinks.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredLinks.map((link) => {
              const fullUrl = `${window.location.origin}/?room=${user?.customSlug || 'live'}&ref=${link.ref_slug}`;
              const isCopied = copiedId === link.id;

              return (
                <div
                  key={link.id}
                  className="p-5 rounded-3xl bg-white border border-slate-200/90 shadow-sm hover:shadow-md transition-all space-y-4 flex flex-col justify-between"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="px-2.5 py-1 rounded-full bg-blue-50 border border-blue-200 text-[10px] font-mono font-bold text-[#0084FF]">
                        {link.commission_percent}% COMMISSION
                      </span>
                      <span className="text-[11px] font-mono text-slate-400">
                        {link.created_at ? new Date(link.created_at).toLocaleDateString() : 'Active'}
                      </span>
                    </div>

                    <div>
                      <h4 className="text-sm font-heading font-bold text-slate-900 truncate">
                        {link.ambassador_name}
                      </h4>
                      <span className="text-xs font-mono text-[#0084FF] block truncate">
                        ?ref={link.ref_slug}
                      </span>
                    </div>
                  </div>

                  {/* Real Metric Numbers */}
                  <div className="grid grid-cols-3 gap-2 p-3 rounded-2xl bg-slate-50 border border-slate-100 text-center font-mono">
                    <div>
                      <span className="text-[10px] uppercase text-slate-400 block font-sans">Clicks</span>
                      <span className="text-xs font-bold text-slate-900">{link.total_clicks || 0}</span>
                    </div>
                    <div>
                      <span className="text-[10px] uppercase text-slate-400 block font-sans">Sales</span>
                      <span className="text-xs font-bold text-slate-900">{link.total_sales || 0}</span>
                    </div>
                    <div>
                      <span className="text-[10px] uppercase text-slate-400 block font-sans">Earned</span>
                      <span className="text-xs font-bold text-emerald-600">${(Number(link.total_commission) || 0).toFixed(2)}</span>
                    </div>
                  </div>

                  {/* Copy Link Button */}
                  <div className="pt-1">
                    <button
                      type="button"
                      onClick={() => handleCopyLink(link.ref_slug, link.id)}
                      className={`w-full py-2 px-3 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                        isCopied
                          ? 'bg-emerald-500 text-white'
                          : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                      }`}
                    >
                      {isCopied ? (
                        <>
                          <Check className="h-3.5 w-3.5" />
                          <span>Link Copied!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="h-3.5 w-3.5" />
                          <span>Copy Tracking Link</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          /* Clean 100% Real Empty State */
          <div className="p-12 rounded-3xl bg-white border border-slate-200/90 shadow-sm text-center space-y-4 max-w-md mx-auto">
            <div className="h-14 w-14 rounded-2xl bg-blue-50 border border-blue-200 flex items-center justify-center mx-auto text-[#0084FF]">
              <Share2 className="h-6 w-6" />
            </div>

            <div className="space-y-1">
              <h4 className="text-base font-heading font-bold text-slate-900">
                No Tracking Links Created Yet
              </h4>
              <p className="text-xs text-slate-500 leading-relaxed font-light">
                Create your first partner or social media tracking link to measure referral clicks, in-stream sales, and commissions in real-time.
              </p>
            </div>

            <button
              type="button"
              onClick={() => setIsModalOpen(true)}
              className="py-2.5 px-5 rounded-xl bg-[#0084FF] hover:bg-[#0074E0] text-white text-xs font-semibold inline-flex items-center gap-2 shadow-md shadow-blue-500/20 cursor-pointer transition-all"
            >
              <Plus className="h-4 w-4" />
              <span>Create Your First Tracking Link</span>
            </button>
          </div>
        )}
      </div>

      {/* Modal */}
      <CampaignGeneratorModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onRefreshLinks={fetchRealReferralData}
      />
    </div>
  );
};
