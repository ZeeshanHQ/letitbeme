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
  Wallet,
  ShieldCheck,
  CheckCircle2,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { CampaignGeneratorModal } from './CampaignGeneratorModal';
import { Button } from '../common/Button';
import { supabase, isSupabaseConfigured } from '../../lib/supabase';
import { claimReferralLink } from '../../lib/referral';

interface RealReferralLink {
  id: string;
  host_id: string;
  ambassador_id?: string;
  ambassador_name: string;
  ambassador_email: string;
  ref_slug: string;
  code?: string;
  commission_percent?: number;
  commission_rate?: number;
  total_clicks?: number;
  clicks?: number;
  total_sales?: number;
  conversions?: number;
  total_revenue?: number;
  revenue?: number;
  total_commission?: number;
  payout_email?: string;
  payout_status?: string;
  created_at: string;
}

export const ReferralDashboard: React.FC = () => {
  const { user } = useAuth();
  const [links, setLinks] = useState<RealReferralLink[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [claimSuccessMessage, setClaimSuccessMessage] = useState<string | null>(null);

  // Payout Email setting
  const [payoutEmail, setPayoutEmail] = useState(
    localStorage.getItem('letitbeme_payout_email') || user?.email || ''
  );
  const [isPayoutSaved, setIsPayoutSaved] = useState(false);

  const fetchRealReferralData = async () => {
    if (!isSupabaseConfigured) {
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      const userEmailClean = user?.email?.toLowerCase().trim() || '';

      // Check for ?claim=slug in URL
      const params = new URLSearchParams(window.location.search);
      const claimSlug = params.get('claim');
      if (claimSlug && user) {
        const claimRes = await claimReferralLink(claimSlug, user.id, user.email, user.fullName);
        if (claimRes.success) {
          setClaimSuccessMessage(`🎉 Link "${claimSlug}" successfully claimed and linked to your account!`);
          setTimeout(() => setClaimSuccessMessage(null), 5000);
        }
      }

      // Query links: Either created by this user as host, OR assigned to this user by email/id
      const { data } = await supabase
        .from('letitbeme_referral_links')
        .select('*')
        .or(`host_id.eq.${user?.id || 'none'},ambassador_email.eq.${userEmailClean},ambassador_id.eq.${user?.id || 'none'}`)
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
  }, [user]);

  const handleCopyLink = (refSlug: string, id: string) => {
    const slug = refSlug || 'promo';
    const url = `${window.location.origin}/?room=${user?.customSlug || 'live'}&ref=${slug}`;
    navigator.clipboard.writeText(url);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleSavePayoutEmail = (e: React.FormEvent) => {
    e.preventDefault();
    localStorage.setItem('letitbeme_payout_email', payoutEmail.trim());
    setIsPayoutSaved(true);
    setTimeout(() => setIsPayoutSaved(false), 2000);
  };

  const filteredLinks = links.filter((l) => {
    const name = l.ambassador_name || '';
    const slug = l.ref_slug || l.code || '';
    return (
      name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      slug.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  // Compute 100% Real Live Aggregate Metrics
  const totalGmv = links.reduce(
    (acc, curr) => acc + (Number(curr.total_revenue || curr.revenue) || 0),
    0
  );
  const totalCommission = links.reduce(
    (acc, curr) => acc + (Number(curr.total_commission) || 0),
    0
  );
  const totalClicks = links.reduce(
    (acc, curr) => acc + (Number(curr.total_clicks || curr.clicks) || 0),
    0
  );
  const totalSales = links.reduce(
    (acc, curr) => acc + (Number(curr.total_sales || curr.conversions) || 0),
    0
  );
  const realConversionRate =
    totalClicks > 0 ? ((totalSales / totalClicks) * 100).toFixed(1) : '0.0';

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-[#FAF9F6] p-4 sm:p-6 lg:p-8 space-y-8 pb-20 font-sans text-left">
      
      {/* Claim Success Banner */}
      {claimSuccessMessage && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center justify-between animate-slide-up">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
            <span>{claimSuccessMessage}</span>
          </div>
          <button
            type="button"
            onClick={() => setClaimSuccessMessage(null)}
            className="text-emerald-600 hover:text-emerald-900 font-bold"
          >
            ✕
          </button>
        </div>
      )}

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

      {/* Payout Settings Card */}
      <div className="p-5 rounded-3xl bg-white border border-slate-200/90 shadow-sm flex flex-wrap items-center justify-between gap-4">
        <div className="space-y-1 max-w-md">
          <div className="flex items-center gap-2">
            <Wallet className="h-4 w-4 text-[#0084FF]" />
            <h4 className="text-sm font-heading font-bold text-slate-900">
              Ambassador Payout Destination
            </h4>
          </div>
          <p className="text-xs text-slate-500 font-light">
            Enter your Stripe or PayPal email to receive automated commission payouts when sales occur.
          </p>
        </div>

        <form onSubmit={handleSavePayoutEmail} className="flex items-center gap-2 w-full sm:w-auto">
          <input
            type="email"
            required
            value={payoutEmail}
            onChange={(e) => setPayoutEmail(e.target.value)}
            placeholder="payout@gmail.com"
            className="px-3.5 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-[#0084FF] outline-none font-mono text-slate-900 w-full sm:w-64"
          />
          <button
            type="submit"
            className="px-4 py-2 bg-[#0084FF] hover:bg-[#0074E0] text-white text-xs font-semibold rounded-xl transition-all cursor-pointer shadow-sm shrink-0"
          >
            {isPayoutSaved ? 'Saved!' : 'Save Payout'}
          </button>
        </form>
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
              const slug = link.ref_slug || link.code || 'promo';
              const fullUrl = `${window.location.origin}/?room=${user?.customSlug || 'live'}&ref=${slug}`;
              const isCopied = copiedId === link.id;
              const commissionPct = link.commission_percent || link.commission_rate || 15;

              return (
                <div
                  key={link.id}
                  className="p-5 rounded-3xl bg-white border border-slate-200/90 shadow-sm hover:shadow-md transition-all space-y-4 flex flex-col justify-between"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="px-2.5 py-1 rounded-full bg-blue-50 border border-blue-200 text-[10px] font-mono font-bold text-[#0084FF]">
                        {commissionPct}% COMMISSION
                      </span>
                      {link.ambassador_email && (
                        <span className="text-[10px] font-mono text-slate-400 truncate max-w-[120px]">
                          {link.ambassador_email}
                        </span>
                      )}
                    </div>

                    <div>
                      <h4 className="text-sm font-heading font-bold text-slate-900 truncate">
                        {link.ambassador_name || 'Direct Partner'}
                      </h4>
                      <span className="text-xs font-mono text-[#0084FF] block truncate">
                        ?ref={slug}
                      </span>
                    </div>
                  </div>

                  {/* Real Metric Numbers */}
                  <div className="grid grid-cols-3 gap-2 p-3 rounded-2xl bg-slate-50 border border-slate-100 text-center font-mono">
                    <div>
                      <span className="text-[10px] uppercase text-slate-400 block font-sans">Clicks</span>
                      <span className="text-xs font-bold text-slate-900">{link.total_clicks || link.clicks || 0}</span>
                    </div>
                    <div>
                      <span className="text-[10px] uppercase text-slate-400 block font-sans">Sales</span>
                      <span className="text-xs font-bold text-slate-900">{link.total_sales || link.conversions || 0}</span>
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
                      onClick={() => handleCopyLink(slug, link.id)}
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
                Create your first partner tracking link with email auto-sync to measure referral clicks, in-stream sales, and commissions in real-time.
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
