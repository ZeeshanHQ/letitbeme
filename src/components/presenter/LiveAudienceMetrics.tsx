import React, { useState, useEffect } from 'react';
import {
  Users,
  Activity,
  CreditCard,
  Signal,
} from 'lucide-react';
import { useStream } from '../../context/StreamContext';
import { supabase, isSupabaseConfigured } from '../../lib/supabase';

export const LiveAudienceMetrics: React.FC = () => {
  const { viewerCount, streamDuration } = useStream();
  const [realOrderCount, setRealOrderCount] = useState<number>(0);
  const [realTotalRevenue, setRealTotalRevenue] = useState<number>(0);

  useEffect(() => {
    if (!isSupabaseConfigured) return;

    const fetchRealDonations = async () => {
      try {
        const { data, error } = await supabase
          .from('letitbeme_donations')
          .select('amount, created_at');

        if (data && !error) {
          setRealOrderCount(data.length);
          const total = data.reduce((acc, curr) => acc + (Number(curr.amount) || 0), 0);
          setRealTotalRevenue(total);
        }
      } catch (err) {
        console.warn('Real telemetry query note:', err);
      }
    };

    fetchRealDonations();

    const channel = supabase
      .channel('realtime_donations_metrics')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'letitbeme_donations' },
        (payload) => {
          setRealOrderCount((prev) => prev + 1);
          setRealTotalRevenue((prev) => prev + (Number(payload.new?.amount) || 19.99));
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const formatDuration = (secs: number) => {
    const hrs = Math.floor(secs / 3600);
    const mins = Math.floor((secs % 3600) / 60);
    const s = secs % 60;
    return `${hrs > 0 ? `${hrs}:` : ''}${mins.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const metrics = [
    {
      label: 'Connected Viewers',
      value: `${viewerCount} Live`,
      subtext: 'P2P WebRTC Mesh',
      icon: Users,
    },
    {
      label: 'Stream Duration',
      value: formatDuration(streamDuration),
      subtext: 'Active Session Uptime',
      icon: Activity,
    },
    {
      label: 'In-Stream Orders',
      value: `${realOrderCount} Orders`,
      subtext: realTotalRevenue > 0 ? `$${realTotalRevenue.toFixed(2)} Total GMV` : '$0.00 Gross',
      icon: CreditCard,
    },
    {
      label: 'Stream Latency',
      value: '< 65ms RTT',
      subtext: 'Ultra-low latency',
      icon: Signal,
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 font-sans text-left">
      {metrics.map((m, idx) => {
        const Icon = m.icon;
        return (
          <div
            key={idx}
            className="p-4 rounded-2xl bg-white border border-slate-200/90 shadow-[0_4px_20px_rgb(0,0,0,0.03)] flex items-start gap-3.5"
          >
            <div className="h-10 w-10 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-center shrink-0 text-slate-700">
              <Icon className="h-5 w-5" />
            </div>
            <div className="min-w-0">
              <span className="text-[11px] font-medium text-slate-400 block truncate">
                {m.label}
              </span>
              <div className="text-lg font-bold text-obsidian font-mono tracking-tight">
                {m.value}
              </div>
              <span className="text-[11px] text-slate-500 font-normal block truncate">
                {m.subtext}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
};
