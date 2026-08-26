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
  CreditCard,
  Building2,
  Calendar,
  Clock,
  ArrowUpRight,
  Loader2,
  RefreshCw,
  AlertCircle,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { CampaignGeneratorModal } from './CampaignGeneratorModal';
import { Button } from '../common/Button';
import { supabase, isSupabaseConfigured } from '../../lib/supabase';
import { claimReferralLink } from '../../lib/referral';
import {
  createStripeConnectOnboardingUrl,
  executePayoutTransfer,
} from '../../lib/stripe';

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

interface PayoutRecord {
  id: string;
  amount: number;
  status: string;
  payout_type: string;
  destination: string;
  created_at: string;
}

export const ReferralDashboard: React.FC = () => {
  const { user } = useAuth();
  const [links, setLinks] = useState<RealReferralLink[]>([]);
  const [payouts, setPayouts] = useState<PayoutRecord[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [claimSuccessMessage, setClaimSuccessMessage] = useState<string | null>(null);

  // Stripe Connect State (Only valid real Stripe account IDs starting with acct_1...)
  const [isConnectingStripe, setIsConnectingStripe] = useState(false);
  const [stripeAccountId, setStripeAccountId] = useState<string | null>(() => {
    const saved = localStorage.getItem('letitbeme_stripe_connect_id');
    return saved && saved.startsWith('acct_1') ? saved : null;
  });
  const [stripeConnectError, setStripeConnectError] = useState<string | null>(null);
  const [autoPayoutEnabled, setAutoPayoutEnabled] = useState<boolean>(true);
  const [isProcessingPayout, setIsProcessingPayout] = useState(false);
  const [payoutSuccessMessage, setPayoutSuccessMessage] = useState<string | null>(null);

  const fetchRealReferralData = async () => {
    if (!isSupabaseConfigured) {
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      const userEmailClean = user?.email?.toLowerCase().trim() || '';

      // 1. Check for ?stripe_connected=true in URL (strictly valid real Stripe IDs)
      const params = new URLSearchParams(window.location.search);
      const connected = params.get('stripe_connected');
      const acctId = params.get('acct_id');
      if (connected === 'true' && acctId && acctId.startsWith('acct_1') && user) {
        setStripeAccountId(acctId);
        localStorage.setItem('letitbeme_stripe_connect_id', acctId);
        await supabase
          .from('letitbeme_users')
          .update({
            stripe_connect_account_id: acctId,
            auto_payout_enabled: true,
          })
          .eq('email', userEmailClean);

        setPayoutSuccessMessage('🎉 Stripe Connect Payout Account successfully linked!');
        setTimeout(() => setPayoutSuccessMessage(null), 5000);
      }

      // 2. Check for ?claim=slug in URL
      const claimSlug = params.get('claim');
      if (claimSlug && user) {
        const claimRes = await claimReferralLink(claimSlug, user.id, user.email, user.fullName);
        if (claimRes.success) {
          setClaimSuccessMessage(`🎉 Link "${claimSlug}" successfully claimed and linked to your account!`);
          setTimeout(() => setClaimSuccessMessage(null), 5000);
        }
      }

      // 3. Query user links
      const { data } = await supabase
        .from('letitbeme_referral_links')
        .select('*')
        .or(`host_id.eq.${user?.id || 'none'},ambassador_email.eq.${userEmailClean},ambassador_id.eq.${user?.id || 'none'}`)
        .order('created_at', { ascending: false });

      if (data) {
        setLinks(data as RealReferralLink[]);
      }

      // 4. Query payout history
      if (user) {
        const { data: payoutData } = await supabase
          .from('letitbeme_payouts')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });

        if (payoutData) {
          setPayouts(payoutData as PayoutRecord[]);
        }
      }
    } catch (err) {
      console.warn('Error fetching referral data:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchRealReferralData();
  }, [user]);

  const handleConnectStripe = async () => {
    setIsConnectingStripe(true);
    setStripeConnectError(null);

    try {
      const onboardingUrl = await createStripeConnectOnboardingUrl(user?.email || 'ambassador@example.com');
      if (onboardingUrl.startsWith('http')) {
        window.location.href = onboardingUrl;
      }
    } catch (err: any) {
      console.error('Stripe Connect error:', err);
      setStripeConnectError(
        err?.message || 'Please enable Stripe Connect in your Stripe Dashboard to activate automated payouts.'
      );
      setIsConnectingStripe(false);
    }
  };

  const handleTriggerInstantPayout = async (balance: number) => {
    if (!user || balance <= 0) return;
    setIsProcessingPayout(true);

    try {
      const result = await executePayoutTransfer(user.id, user.email, balance, 'instant');
      if (result.success) {
        setPayoutSuccessMessage(`✅ Successfully initiated payout transfer of $${balance.toFixed(2)} to your connected Stripe account!`);
        fetchRealReferralData();
        setTimeout(() => setPayoutSuccessMessage(null), 6000);
      }
    } finally {
      setIsProcessingPayout(false);
    }
  };

  const handleCopyLink = (refSlug: string, id: string) => {
    const slug = refSlug || 'promo';
    const url = `${window.location.origin}/?room=${user?.customSlug || 'live'}&ref=${slug}`;
    navigator.clipboard.writeText(url);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const filteredLinks = links.filter((l) => {
    const name = l.ambassador_name || '';
    const slug = l.ref_slug || l.code || '';
    return (
      name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      slug.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  // Compute 100% Real Aggregate Metrics
  const totalGmv = links.reduce(
    (acc, curr) => acc + (Number(curr.total_revenue || curr.revenue) || 0),
    0
  );
  const totalCommission = links.reduce(
    (acc, curr) => acc + (Number(curr.total_commission) || 0),
    0
  );
  const totalPaidOut = payouts.reduce((acc, curr) => acc + Number(curr.amount || 0), 0);
  const availableUnpaidBalance = Math.max(0, totalCommission - totalPaidOut);

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
      
      {/* Toast Notifications */}
      {payoutSuccessMessage && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center justify-between animate-slide-up">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
            <span>{payoutSuccessMessage}</span>
          </div>
          <button
            type="button"
            onClick={() => setPayoutSuccessMessage(null)}
            className="text-emerald-600 hover:text-emerald-900 font-bold"
          >
            ✕
          </button>
        </div>
      )}

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
            Real-time link tracking, multi-tier ambassador attribution, and automatic Stripe Connect payouts.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={() => setIsModalOpen(true)}
            className="px-4 py-2.5 bg-[#0084FF] hover:bg-[#0074E0] text-white text-xs font-semibold rounded-2xl transition-all shadow-md shadow-blue-500/20 flex items-center gap-1.5 cursor-pointer"
          >
            <Plus className="h-4 w-4" />
            <span>Create Tracking Link</span>
          </button>
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
          <span className="text-xs font-semibold text-slate-400">Total Commission</span>
          <div className="text-2xl font-bold font-mono text-[#0084FF]">
            ${totalCommission.toFixed(2)}
          </div>
          <span className="text-[11px] font-mono text-slate-400 block">
            Available: ${availableUnpaidBalance.toFixed(2)}
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

      {/* Real Stripe Connect Payout Card */}
      <div className="p-6 sm:p-7 rounded-3xl bg-white border border-slate-200/90 shadow-sm space-y-5">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 pb-4">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-2xl bg-blue-50 border border-blue-200 flex items-center justify-center text-[#0084FF]">
              <CreditCard className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h4 className="text-sm font-heading font-bold text-slate-900">
                  Stripe Connect Automated Payouts
                </h4>
                {stripeAccountId ? (
                  <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 border border-emerald-200 text-[10px] font-mono font-bold text-emerald-700 flex items-center gap-1">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    <span>CONNECTED ({stripeAccountId})</span>
                  </span>
                ) : (
                  <span className="px-2.5 py-0.5 rounded-full bg-amber-50 border border-amber-200 text-[10px] font-mono font-bold text-amber-700">
                    ACTION REQUIRED
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-500 font-light mt-0.5">
                Stripe handles 100% of identity verification, compliance, and direct bank account deposits.
              </p>
            </div>
          </div>

          {!stripeAccountId ? (
            <button
              type="button"
              onClick={handleConnectStripe}
              disabled={isConnectingStripe}
              className="px-5 py-2.5 bg-[#0084FF] hover:bg-[#0074E0] text-white text-xs font-semibold rounded-2xl transition-all shadow-md shadow-blue-500/20 flex items-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {isConnectingStripe ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Connecting Stripe...</span>
                </>
              ) : (
                <>
                  <Building2 className="h-4 w-4" />
                  <span>Connect Stripe Payout Account</span>
                  <ArrowUpRight className="h-3.5 w-3.5" />
                </>
              )}
            </button>
          ) : (
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => handleTriggerInstantPayout(availableUnpaidBalance)}
                disabled={isProcessingPayout || availableUnpaidBalance <= 0}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded-xl transition-all shadow-sm flex items-center gap-1.5 cursor-pointer disabled:opacity-40"
              >
                {isProcessingPayout ? (
                  <>
                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                    <span>Transferring...</span>
                  </>
                ) : (
                  <>
                    <DollarSign className="h-3.5 w-3.5" />
                    <span>Transfer ${availableUnpaidBalance.toFixed(2)} Now</span>
                  </>
                )}
              </button>
            </div>
          )}
        </div>

        {/* Real Stripe Connect Activation Guidance Banner */}
        {stripeConnectError && (
          <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 text-xs space-y-2 animate-fade-in">
            <div className="flex items-start gap-2">
              <AlertCircle className="h-4 w-4 text-amber-600 shrink-0 mt-0.5" />
              <div className="space-y-1">
                <strong className="font-semibold block">Stripe Connect Setup Guidance:</strong>
                <p className="text-amber-800 leading-relaxed font-light">
                  {stripeConnectError}
                </p>
                <div className="pt-1 flex items-center gap-2">
                  <a
                    href="https://dashboard.stripe.com/connect"
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1 text-[#0084FF] font-semibold hover:underline"
                  >
                    <span>Open Stripe Dashboard &rarr; Enable Connect</span>
                    <ExternalLink className="h-3 w-3" />
                  </a>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Connected Stripe Settings & Auto-Payout Schedule */}
        {stripeAccountId && (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-1">
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-1">
              <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 block font-bold">
                Available Unpaid Balance
              </span>
              <div className="text-xl font-bold font-mono text-slate-900">
                ${availableUnpaidBalance.toFixed(2)} <span className="text-xs text-slate-400">USD</span>
              </div>
              <span className="text-[11px] text-slate-500">Ready for transfer</span>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-1">
              <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 block font-bold">
                Payout Schedule
              </span>
              <div className="text-xs font-bold text-slate-900 flex items-center gap-1.5 pt-1">
                <Calendar className="h-3.5 w-3.5 text-[#0084FF]" />
                <span>Automated Month-End Transfer</span>
              </div>
              <span className="text-[11px] text-slate-500">Disbursed on last day of month</span>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-between">
              <div className="space-y-0.5">
                <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 block font-bold">
                  Auto-Payout Status
                </span>
                <span className="text-xs font-bold text-emerald-600 block">
                  {autoPayoutEnabled ? 'Active (Auto-Transfer)' : 'Manual Only'}
                </span>
              </div>

              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={autoPayoutEnabled}
                  onChange={(e) => setAutoPayoutEnabled(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-9 h-5 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#0084FF]" />
              </label>
            </div>
          </div>
        )}
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

      {/* Payout History Table */}
      {payouts.length > 0 && (
        <div className="p-6 rounded-3xl bg-white border border-slate-200/90 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-heading font-bold text-slate-900">
              Payout Transfer History ({payouts.length})
            </h4>
            <span className="text-[11px] font-mono text-slate-400">Verified Transfers</span>
          </div>

          <div className="divide-y divide-slate-100 text-xs">
            {payouts.map((p) => (
              <div key={p.id} className="py-3 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="h-8 w-8 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600 font-bold">
                    <Check className="h-4 w-4" />
                  </div>
                  <div>
                    <span className="font-semibold text-slate-900 block">
                      ${Number(p.amount).toFixed(2)} USD Payout
                    </span>
                    <span className="text-[10px] font-mono text-slate-400">
                      {new Date(p.created_at).toLocaleDateString()} • {p.payout_type === 'instant' ? 'Instant Transfer' : 'Month-End Auto Transfer'}
                    </span>
                  </div>
                </div>

                <span className="px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 font-mono font-bold text-[10px] border border-emerald-200">
                  COMPLETED
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Modal */}
      <CampaignGeneratorModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onRefreshLinks={fetchRealReferralData}
      />
    </div>
  );
};
