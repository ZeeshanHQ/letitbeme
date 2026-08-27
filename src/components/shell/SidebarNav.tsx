import React from 'react';
import {
  LayoutDashboard,
  Users,
  Compass,
  MessageSquare,
  Video,
  Sparkles,
  Building2,
  ShieldCheck,
  LogOut,
  ChevronRight,
} from 'lucide-react';
import { AppNavigationTab } from '../../types';
import { useAuth } from '../../context/AuthContext';

interface SidebarNavProps {
  activeTab: AppNavigationTab;
  onSelectTab: (tab: AppNavigationTab) => void;
  onOpenProfile: () => void;
}

export const SidebarNav: React.FC<SidebarNavProps> = ({
  activeTab,
  onSelectTab,
  onOpenProfile,
}) => {
  const { user, primaryOrg, orgMembership, signOut } = useAuth();

  const navItems: {
    id: AppNavigationTab;
    label: string;
    icon: React.ComponentType<{ className?: string }>;
    badge?: string;
    isPlaceholder?: boolean;
  }[] = [
    { id: 'home', label: 'Home', icon: LayoutDashboard },
    { id: 'people', label: 'People', icon: Users },
    { id: 'universe', label: 'Universe', icon: Compass, badge: 'Phase 2', isPlaceholder: true },
    { id: 'messages', label: 'Messages', icon: MessageSquare, badge: 'Phase 2', isPlaceholder: true },
    { id: 'meet', label: 'Meet', icon: Video },
    { id: 'ai', label: 'AI', icon: Sparkles, badge: 'Phase 2', isPlaceholder: true },
  ];

  return (
    <aside className="w-64 sm:w-72 bg-[#0B0F17] border-r border-slate-800/80 flex flex-col justify-between select-none font-sans text-slate-300">
      {/* Brand Header */}
      <div className="p-6 pb-4">
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => onSelectTab('home')}>
          <div className="h-9 w-9 rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-purple-600 flex items-center justify-center shadow-lg shadow-blue-500/20 text-white font-bold text-base font-heading">
            3M
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <h1 className="text-base font-bold text-white tracking-tight font-heading">Triple Motive</h1>
              <ShieldCheck className="h-3.5 w-3.5 text-blue-400" />
            </div>
            <span className="text-[11px] font-mono text-slate-400 block tracking-wider uppercase">
              Executive Ecosystem
            </span>
          </div>
        </div>

        {/* Primary Organization Tenancy Pill */}
        {primaryOrg && (
          <div className="mt-5 px-3 py-2 rounded-xl bg-slate-900/90 border border-slate-800 flex items-center justify-between gap-2 shadow-inner">
            <div className="flex items-center gap-2 overflow-hidden">
              <Building2 className="h-3.5 w-3.5 text-slate-400 shrink-0" />
              <span className="text-xs font-semibold text-slate-200 truncate font-heading">
                {primaryOrg.name}
              </span>
            </div>
            {orgMembership?.role && (
              <span className="px-1.5 py-0.5 rounded text-[9px] font-mono font-bold uppercase tracking-wider bg-blue-500/15 text-blue-400 border border-blue-500/30 shrink-0">
                {orgMembership.role}
              </span>
            )}
          </div>
        )}
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 px-3 py-2 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;

          return (
            <button
              key={item.id}
              type="button"
              onClick={() => onSelectTab(item.id)}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer group ${
                isActive
                  ? 'bg-blue-600/15 text-white border border-blue-500/30 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
              }`}
            >
              <div className="flex items-center gap-3">
                <Icon
                  className={`h-4 w-4 transition-colors ${
                    isActive ? 'text-blue-400' : 'text-slate-400 group-hover:text-slate-200'
                  }`}
                />
                <span>{item.label}</span>
              </div>

              {item.badge && (
                <span
                  className={`text-[9px] font-mono font-bold px-1.5 py-0.5 rounded ${
                    isActive
                      ? 'bg-blue-500/20 text-blue-300'
                      : 'bg-slate-800/80 text-slate-400 border border-slate-700/60'
                  }`}
                >
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Member Identity & Profile Footer */}
      <div className="p-4 border-t border-slate-800/80 bg-[#090D14]">
        {user ? (
          <div className="space-y-3">
            <div
              onClick={onOpenProfile}
              className="flex items-center justify-between p-2 rounded-xl hover:bg-slate-800/60 transition-all cursor-pointer group"
            >
              <div className="flex items-center gap-2.5 overflow-hidden">
                <img
                  src={user.avatarUrl || `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(user.fullName)}`}
                  alt={user.fullName}
                  className="h-8 w-8 rounded-full border border-slate-700 object-cover shadow-sm shrink-0"
                />
                <div className="overflow-hidden text-left">
                  <div className="flex items-center gap-1">
                    <strong className="text-xs font-bold text-white truncate block">
                      {user.fullName}
                    </strong>
                    {user.isVerified && <ShieldCheck className="h-3 w-3 text-blue-400 shrink-0" />}
                  </div>
                  <span className="text-[10px] font-mono text-slate-400 block truncate">
                    @{user.tripleMotiveHandle || 'member'}
                  </span>
                </div>
              </div>
              <ChevronRight className="h-3.5 w-3.5 text-slate-400 group-hover:text-slate-200 shrink-0" />
            </div>

            <div className="flex items-center justify-between pt-1">
              <span className="flex items-center gap-1.5 text-[10px] font-mono text-emerald-400">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                <span>Verified Private Node</span>
              </span>
              <button
                type="button"
                onClick={signOut}
                className="p-1 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-all cursor-pointer"
                title="Sign Out"
              >
                <LogOut className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        ) : (
          <div className="text-center">
            <span className="text-xs text-slate-400 block mb-2">Guest Session</span>
          </div>
        )}
      </div>
    </aside>
  );
};
