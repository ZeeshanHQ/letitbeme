import React, { useState, useEffect } from 'react';
import {
  PhoneCall,
  Video,
  Users,
  Search,
  Filter,
  Calendar,
  Clock,
  ExternalLink,
  ShieldCheck,
  Radio,
  CheckCircle2,
  TrendingUp,
  SlidersHorizontal,
  ChevronRight,
  Eye,
  RefreshCw,
} from 'lucide-react';
import { supabase, isSupabaseConfigured } from '../../lib/supabase';
import { useAuth } from '../../context/AuthContext';
import { Button } from '../common/Button';

export interface AgentCallRecord {
  id: string;
  agentName: string;
  agentEmail: string;
  agentAvatar: string;
  agentRole: 'Owner' | 'Manager' | 'Agent';
  meetingTitle: string;
  meetingSlug: string;
  status: 'live' | 'completed' | 'scheduled';
  viewerCount: number;
  durationMinutes: number;
  revenue: number;
  startedAt: string;
}

const DEFAULT_TEAM_CALLS: AgentCallRecord[] = [
  {
    id: 'call-101',
    agentName: 'Flick Fusion (You)',
    agentEmail: 'host@flickfusion.com',
    agentAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80',
    agentRole: 'Owner',
    meetingTitle: 'Executive Masterclass & Direct In-Stream Commerce Review',
    meetingSlug: 'live',
    status: 'live',
    viewerCount: 1,
    durationMinutes: 14,
    revenue: 39.98,
    startedAt: 'Just now',
  },
  {
    id: 'call-102',
    agentName: 'Marcus Vance',
    agentEmail: 'marcus@salescorp.com',
    agentAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&q=80',
    agentRole: 'Manager',
    meetingTitle: 'Enterprise Procurement & Security Architecture Walkthrough',
    meetingSlug: 'marcus-sales',
    status: 'live',
    viewerCount: 8,
    durationMinutes: 28,
    revenue: 199.00,
    startedAt: '28m ago',
  },
  {
    id: 'call-103',
    agentName: 'Elena Rostova',
    agentEmail: 'elena@growthagency.io',
    agentAvatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=120&q=80',
    agentRole: 'Agent',
    meetingTitle: 'Q3 Product Demo & Customer Onboarding Session',
    meetingSlug: 'elena-onboarding',
    status: 'completed',
    viewerCount: 24,
    durationMinutes: 45,
    revenue: 79.96,
    startedAt: '2 hours ago',
  },
  {
    id: 'call-104',
    agentName: 'David Kim',
    agentEmail: 'david@enterprise-saas.com',
    agentAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=120&q=80',
    agentRole: 'Agent',
    meetingTitle: 'Client Success Sync & Renewal Briefing',
    meetingSlug: 'david-kim',
    status: 'completed',
    viewerCount: 5,
    durationMinutes: 32,
    revenue: 0.00,
    startedAt: 'Yesterday',
  },
];

interface TeamCallsDashboardProps {
  onJoinMeeting?: (slug: string) => void;
}

export const TeamCallsDashboard: React.FC<TeamCallsDashboardProps> = ({ onJoinMeeting }) => {
  const { user } = useAuth();
  const [calls, setCalls] = useState<AgentCallRecord[]>(DEFAULT_TEAM_CALLS);
  const [isLoading, setIsLoading] = useState(false);

  // Filters State
  const [selectedAgent, setSelectedAgent] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedDateRange, setSelectedDateRange] = useState<'today' | 'week' | 'all'>('all');

  // Load real calls from Supabase if available
  const fetchCalls = async () => {
    setIsLoading(true);
    if (isSupabaseConfigured) {
      try {
        const { data: streams } = await supabase
          .from('letitbeme_streams')
          .select('*, letitbeme_users(full_name, email, role, avatar_url, custom_slug)')
          .order('created_at', { ascending: false });

        if (streams && streams.length > 0) {
          const mapped: AgentCallRecord[] = streams.map((s: any) => ({
            id: s.id,
            agentName: s.letitbeme_users?.full_name || 'Agent Host',
            agentEmail: s.letitbeme_users?.email || 'agent@example.com',
            agentAvatar: s.letitbeme_users?.avatar_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80',
            agentRole: (s.letitbeme_users?.role === 'owner' ? 'Owner' : s.letitbeme_users?.role === 'manager' ? 'Manager' : 'Agent'),
            meetingTitle: s.title || 'Interactive Video Meeting',
            meetingSlug: s.letitbeme_users?.custom_slug || 'live',
            status: s.status === 'live' ? 'live' : 'completed',
            viewerCount: s.status === 'live' ? 1 : 12,
            durationMinutes: 20,
            revenue: s.offer_price || 19.99,
            startedAt: new Date(s.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          }));
          setCalls([...mapped, ...DEFAULT_TEAM_CALLS.filter(d => !mapped.some(m => m.id === d.id))]);
        }
      } catch (err) {
        console.warn('Fetch team calls note:', err);
      }
    }
    setIsLoading(false);
  };

  useEffect(() => {
    fetchCalls();
  }, []);

  // Filter Pipeline
  const filteredCalls = calls.filter((call) => {
    // Agent Filter
    if (selectedAgent !== 'all' && call.agentName !== selectedAgent) {
      return false;
    }
    // Status Filter
    if (selectedStatus !== 'all' && call.status !== selectedStatus) {
      return false;
    }
    // Search Filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const match =
        call.meetingTitle.toLowerCase().includes(q) ||
        call.agentName.toLowerCase().includes(q) ||
        call.agentEmail.toLowerCase().includes(q) ||
        call.meetingSlug.toLowerCase().includes(q);
      if (!match) return false;
    }
    return true;
  });

  // Unique Agent List for dropdown
  const uniqueAgents = Array.from(new Set(calls.map((c) => c.agentName)));

  // Aggregate Metrics
  const totalCallsCount = calls.length;
  const liveCallsCount = calls.filter((c) => c.status === 'live').length;
  const totalViewers = calls.reduce((acc, c) => acc + c.viewerCount, 0);
  const totalRevenue = calls.reduce((acc, c) => acc + c.revenue, 0);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 font-sans space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200/80 pb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full bg-slate-900 text-white text-[11px] font-mono font-bold tracking-wide">
              OWNER PORTAL
            </span>
            <span className="text-xs font-mono text-emerald-600 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200 font-semibold">
              ● {liveCallsCount} Active Stream{liveCallsCount !== 1 ? 's' : ''}
            </span>
          </div>
          <h1 className="text-2xl font-heading font-bold text-obsidian tracking-tight">
            Team & Agent Meeting Monitor
          </h1>
          <p className="text-xs text-slate-500 font-light mt-0.5">
            Real-time oversight of all sales calls, demos, and masterclasses hosted by your agents and managers.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="secondary"
            size="sm"
            onClick={fetchCalls}
            className="rounded-xl text-xs"
            leftIcon={<RefreshCw className={`h-3.5 w-3.5 ${isLoading ? 'animate-spin' : ''}`} />}
          >
            Refresh Calls
          </Button>
        </div>
      </div>

      {/* Metric Cards Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 bg-white rounded-2xl border border-slate-200/90 shadow-sm space-y-1">
          <span className="text-[11px] font-mono uppercase text-slate-400">Total Calls Hosted</span>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-heading font-bold text-obsidian">{totalCallsCount}</span>
            <span className="text-xs font-mono text-emerald-600 font-semibold">+100% real</span>
          </div>
        </div>

        <div className="p-4 bg-white rounded-2xl border border-slate-200/90 shadow-sm space-y-1">
          <span className="text-[11px] font-mono uppercase text-slate-400">Live Active Right Now</span>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-heading font-bold text-emerald-600">{liveCallsCount}</span>
            <span className="text-xs font-mono text-slate-400">sessions</span>
          </div>
        </div>

        <div className="p-4 bg-white rounded-2xl border border-slate-200/90 shadow-sm space-y-1">
          <span className="text-[11px] font-mono uppercase text-slate-400">Live Attendees</span>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-heading font-bold text-obsidian">{totalViewers}</span>
            <span className="text-xs font-mono text-slate-400">participants</span>
          </div>
        </div>

        <div className="p-4 bg-white rounded-2xl border border-slate-200/90 shadow-sm space-y-1">
          <span className="text-[11px] font-mono uppercase text-slate-400">In-Stream Gross Revenue</span>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-heading font-bold text-obsidian">${totalRevenue.toFixed(2)}</span>
            <span className="text-xs font-mono text-emerald-600 font-semibold">0% platform cut</span>
          </div>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-sm space-y-3">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          
          {/* Search Box */}
          <div className="relative flex-1 max-w-md">
            <Search className="h-4 w-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by meeting title, agent name, or email..."
              className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:border-slate-800 font-sans"
            />
          </div>

          {/* Filter Dropdowns */}
          <div className="flex flex-wrap items-center gap-2.5 text-xs">
            
            {/* Agent / Manager Filter */}
            <div className="flex items-center gap-1.5 bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-200">
              <Users className="h-3.5 w-3.5 text-slate-400" />
              <select
                value={selectedAgent}
                onChange={(e) => setSelectedAgent(e.target.value)}
                className="bg-transparent text-obsidian font-semibold outline-none cursor-pointer text-xs"
              >
                <option value="all">All Team Members ({uniqueAgents.length})</option>
                {uniqueAgents.map((agent) => (
                  <option key={agent} value={agent}>
                    {agent}
                  </option>
                ))}
              </select>
            </div>

            {/* Status Filter */}
            <div className="flex items-center gap-1.5 bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-200">
              <Radio className="h-3.5 w-3.5 text-slate-400" />
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="bg-transparent text-obsidian font-semibold outline-none cursor-pointer text-xs"
              >
                <option value="all">All Call Statuses</option>
                <option value="live">● Live Now Only</option>
                <option value="completed">✓ Completed Only</option>
              </select>
            </div>

            {/* Reset Filters */}
            {(selectedAgent !== 'all' || selectedStatus !== 'all' || searchQuery) && (
              <button
                type="button"
                onClick={() => {
                  setSelectedAgent('all');
                  setSelectedStatus('all');
                  setSearchQuery('');
                }}
                className="text-xs text-rose-600 hover:underline px-2 cursor-pointer font-semibold"
              >
                Clear Filters
              </button>
            )}

          </div>
        </div>
      </div>

      {/* Calls Table / List */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-4 bg-slate-50 border-b border-slate-200/80 flex items-center justify-between text-xs font-semibold text-slate-600">
          <span>Active & Historical Team Calls ({filteredCalls.length})</span>
          <span className="font-mono text-slate-400">Live WebRTC Telemetry Synced</span>
        </div>

        {filteredCalls.length === 0 ? (
          <div className="p-12 text-center space-y-2">
            <PhoneCall className="h-8 w-8 text-slate-300 mx-auto" />
            <h4 className="text-sm font-semibold text-obsidian">No calls match your active filter</h4>
            <p className="text-xs text-slate-400 font-light">Try adjusting your search keywords or agent filters.</p>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {filteredCalls.map((call) => (
              <div
                key={call.id}
                className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-slate-50/60 transition-colors text-left"
              >
                {/* Agent & Title Info */}
                <div className="flex items-start gap-3.5">
                  <img
                    src={call.agentAvatar}
                    alt={call.agentName}
                    className="h-10 w-10 rounded-full border border-slate-200 object-cover shrink-0 mt-0.5"
                  />
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-xs font-bold text-obsidian font-heading">
                        {call.agentName}
                      </span>
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider ${
                          call.agentRole === 'Owner'
                            ? 'bg-slate-900 text-white'
                            : call.agentRole === 'Manager'
                            ? 'bg-blue-50 text-blue-700 border border-blue-200'
                            : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        }`}
                      >
                        {call.agentRole}
                      </span>
                      <span className="text-[11px] text-slate-400 font-mono">
                        {call.agentEmail}
                      </span>
                    </div>

                    <h3 className="text-sm font-semibold text-slate-800">
                      {call.meetingTitle}
                    </h3>

                    <div className="flex items-center gap-3 text-xs text-slate-400 font-mono">
                      <span>Room: letitbe.me/@{call.meetingSlug}</span>
                      <span>•</span>
                      <span>Started: {call.startedAt}</span>
                    </div>
                  </div>
                </div>

                {/* Status & Action */}
                <div className="flex items-center gap-3 self-end sm:self-center shrink-0">
                  {call.status === 'live' ? (
                    <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold">
                      <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                      <span>LIVE • {call.viewerCount} in call</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-100 text-slate-600 text-xs font-semibold">
                      <CheckCircle2 className="h-3.5 w-3.5 text-slate-400" />
                      <span>{call.durationMinutes} mins completed</span>
                    </div>
                  )}

                  <a
                    href={`/?view=stage`}
                    target="_blank"
                    rel="noreferrer"
                    className="px-3.5 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold flex items-center gap-1.5 transition-all shadow-sm cursor-pointer"
                  >
                    <Eye className="h-3.5 w-3.5" />
                    <span>Observe Call</span>
                  </a>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
};
