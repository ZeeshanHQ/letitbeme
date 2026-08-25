import React, { useState } from 'react';
import {
  Share2,
  Plus,
  Search,
  Filter,
  TrendingUp,
  DollarSign,
  Users,
  Award,
  Download,
  Sparkles,
} from 'lucide-react';
import { MOCK_REFERRAL_STATS } from '../../data/mockData';
import { ReferralStat } from '../../types';
import { ReferralLinkCard } from './ReferralLinkCard';
import { ConversionChart } from './ConversionChart';
import { CampaignGeneratorModal } from './CampaignGeneratorModal';
import { Button } from '../common/Button';

export const ReferralDashboard: React.FC = () => {
  const [stats, setStats] = useState<ReferralStat[]>(MOCK_REFERRAL_STATS);
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const filteredStats = stats.filter(
    (s) =>
      s.ambassadorName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.role.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalGmv = stats.reduce((acc, curr) => acc + curr.revenue, 0);
  const totalCommission = stats.reduce((acc, curr) => acc + curr.commission, 0);
  const totalAttendees = stats.reduce((acc, curr) => acc + curr.liveAttendees, 0);
  const avgConvRate = (stats.reduce((acc, curr) => acc + curr.conversionRate, 0) / stats.length).toFixed(1);

  const handleAddCampaign = (newStat: ReferralStat) => {
    setStats([newStat, ...stats]);
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-[#FAF9F6] p-4 sm:p-6 lg:p-8 space-y-8 pb-20 font-sans text-left">
      
      {/* Dashboard Top Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-solar-50 text-solar-600 border border-solar-200/60">
              <Share2 className="h-4 w-4" />
            </span>
            <h1 className="text-xl sm:text-2xl font-heading font-semibold text-obsidian tracking-tight">
              Smart Referral & Attribution Engine
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
          >
            Create Tracking Link
          </Button>
        </div>
      </div>

      {/* Aggregate KPI Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-sm space-y-1">
          <span className="text-xs font-semibold text-slate-400">Total Stream GMV</span>
          <div className="text-2xl font-bold font-mono text-obsidian">
            ${totalGmv.toLocaleString()}
          </div>
          <span className="text-[11px] font-mono text-emerald-600 font-semibold block">
            +38.4% vs last cycle
          </span>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-sm space-y-1">
          <span className="text-xs font-semibold text-slate-400">Commission Disbursed</span>
          <div className="text-2xl font-bold font-mono text-solar-600">
            ${totalCommission.toLocaleString()}
          </div>
          <span className="text-[11px] font-mono text-slate-400 block">
            Stripe auto-transfers
          </span>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-sm space-y-1">
          <span className="text-xs font-semibold text-slate-400">Attributed Attendees</span>
          <div className="text-2xl font-bold font-mono text-solar-amber">
            {totalAttendees.toLocaleString()}
          </div>
          <span className="text-[11px] font-mono text-slate-400 block">
            100% cookie-free match
          </span>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-sm space-y-1">
          <span className="text-xs font-semibold text-slate-400">Avg In-Stream Conversion</span>
          <div className="text-2xl font-bold font-mono text-emerald-600">
            {avgConvRate}%
          </div>
          <span className="text-[11px] font-mono text-emerald-600 font-semibold block">
            4.8x Legacy Baseline
          </span>
        </div>
      </div>

      {/* Visual Conversion Funnel */}
      <ConversionChart />

      {/* Ambassador Links Section */}
      <div className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h3 className="text-base font-heading font-semibold text-obsidian">
              Active Ambassador & Affiliate Links
            </h3>
            <p className="text-xs text-slate-500">
              {filteredStats.length} active tracking codes broadcasting live
            </p>
          </div>

          {/* Search bar */}
          <div className="relative min-w-[260px]">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search ambassador or code..."
              className="w-full pl-9 pr-3 py-1.5 text-xs rounded-xl border border-slate-200 bg-white text-obsidian focus:outline-none focus:border-solar-500"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredStats.map((stat) => (
            <ReferralLinkCard key={stat.id} stat={stat} />
          ))}
        </div>
      </div>

      {/* Create Link Modal */}
      <CampaignGeneratorModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onAddCampaign={handleAddCampaign}
      />
    </div>
  );
};
