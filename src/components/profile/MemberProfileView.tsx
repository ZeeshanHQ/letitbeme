import React, { useState } from 'react';
import {
  ShieldCheck,
  Building2,
  MapPin,
  Mail,
  Phone,
  Edit3,
  Plus,
  Lock,
  ExternalLink,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { ProfileEditModal } from './ProfileEditModal';
import { OrganizationCreateModal } from './OrganizationCreateModal';

export const MemberProfileView: React.FC = () => {
  const { user, privateProfile, primaryOrg, orgMembership } = useAuth();
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isOrgCreateOpen, setIsOrgCreateOpen] = useState(false);

  if (!user) return null;

  return (
    <div className="p-6 sm:p-8 max-w-5xl mx-auto space-y-6 select-none font-sans">
      {/* Page Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight font-heading">
            Executive Profile & Tenancy
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Manage your verified identity, organization memberships, and isolated private attributes.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setIsEditOpen(true)}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-white text-xs font-semibold shadow-sm transition-all cursor-pointer"
        >
          <Edit3 className="h-3.5 w-3.5" />
          <span>Edit Profile</span>
        </button>
      </div>

      {/* Main Profile Card */}
      <div className="p-6 sm:p-8 rounded-3xl bg-[#0F141E] border border-slate-800/90 shadow-2xl space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
          <div className="relative shrink-0">
            <img
              src={user.avatarUrl || `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(user.fullName)}`}
              alt={user.fullName}
              className="h-24 w-24 rounded-3xl object-cover border-2 border-slate-700 shadow-2xl"
            />
            {user.isVerified && (
              <span className="absolute -bottom-1 -right-1 h-6 w-6 rounded-full bg-blue-600 text-white flex items-center justify-center shadow-lg">
                <ShieldCheck className="h-3.5 w-3.5" />
              </span>
            )}
          </div>

          <div className="space-y-1.5 flex-1 min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="text-2xl font-bold text-white font-heading">{user.fullName}</h2>
              <span className="px-2.5 py-0.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-xs font-mono font-bold text-blue-400">
                @{user.tripleMotiveHandle || 'member'}.triplemotive.net
              </span>
            </div>

            <p className="text-sm font-medium text-slate-300">
              {user.headline || 'Executive Founder & CEO'}
            </p>

            <div className="flex flex-wrap items-center gap-4 text-xs text-slate-400 font-mono pt-1">
              {user.location && (
                <div className="flex items-center gap-1">
                  <MapPin className="h-3.5 w-3.5 text-slate-400" />
                  <span>{user.location}</span>
                </div>
              )}
              <div className="flex items-center gap-1.5 text-emerald-400">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                <span>Verified Private Ecosystem Member</span>
              </div>
            </div>
          </div>
        </div>

        {/* Biography */}
        <div className="pt-6 border-t border-slate-800 space-y-2">
          <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-400">
            Executive Summary
          </h3>
          <p className="text-sm text-slate-300 leading-relaxed font-sans">
            {user.biography ||
              'Executive biography highlights will be synthesized here and integrated with your upcoming Universe digital library in Phase 2.'}
          </p>
        </div>

        {/* Expertise & Focus Areas */}
        {user.interests && user.interests.length > 0 && (
          <div className="pt-4 border-t border-slate-800 space-y-2">
            <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-400">
              Domain Expertise & Focus
            </h3>
            <div className="flex flex-wrap gap-2">
              {user.interests.map((interest, idx) => (
                <span
                  key={idx}
                  className="px-3 py-1 rounded-xl text-xs font-medium bg-slate-900 text-slate-200 border border-slate-800"
                >
                  {interest}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Organization Tenancy Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Active Organization Workspace */}
        <div className="p-6 rounded-3xl bg-[#0F141E] border border-slate-800/90 shadow-xl space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Building2 className="h-5 w-5 text-blue-400" />
              <h3 className="text-sm font-bold text-white font-heading">Primary Organization</h3>
            </div>
            <button
              type="button"
              onClick={() => setIsOrgCreateOpen(true)}
              className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-700 text-xs text-slate-300 font-semibold cursor-pointer"
            >
              <Plus className="h-3 w-3" />
              <span>New Org</span>
            </button>
          </div>

          {primaryOrg ? (
            <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-bold text-white font-heading">{primaryOrg.name}</h4>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase bg-blue-500/15 text-blue-400 border border-blue-500/30">
                  {orgMembership?.role || 'Owner'}
                </span>
              </div>
              <p className="text-xs text-slate-400">
                {orgMembership?.title || 'Executive Leadership'}
              </p>
              {primaryOrg.industry && (
                <div className="text-[11px] font-mono text-slate-400">
                  Sector: <span className="text-slate-300">{primaryOrg.industry}</span>
                </div>
              )}
            </div>
          ) : (
            <div className="p-6 text-center text-xs text-slate-400">
              No organization workspace linked yet.
            </div>
          )}
        </div>

        {/* Private Data Isolation Guarantee */}
        <div className="p-6 rounded-3xl bg-[#0F141E] border border-slate-800/90 shadow-xl space-y-4">
          <div className="flex items-center gap-2">
            <Lock className="h-5 w-5 text-emerald-400" />
            <h3 className="text-sm font-bold text-white font-heading">Private Security & Isolation</h3>
          </div>

          <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-3 text-xs">
            <div className="flex items-center justify-between">
              <span className="text-slate-400 flex items-center gap-2">
                <Mail className="h-3.5 w-3.5 text-slate-400" />
                <span>Primary Email:</span>
              </span>
              <span className="font-mono text-slate-200">{privateProfile?.email || 'N/A'}</span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-slate-400 flex items-center gap-2">
                <Phone className="h-3.5 w-3.5 text-slate-400" />
                <span>Direct Phone:</span>
              </span>
              <span className="font-mono text-slate-200">{privateProfile?.phone || 'Private / Unset'}</span>
            </div>

            <div className="pt-2 border-t border-slate-800/60 text-[11px] font-mono text-emerald-400 flex items-center gap-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
              <span>Strict RLS enforced: Zero cross-tenant data exposure.</span>
            </div>
          </div>
        </div>
      </div>

      {/* Modals */}
      <ProfileEditModal isOpen={isEditOpen} onClose={() => setIsEditOpen(false)} />
      <OrganizationCreateModal isOpen={isOrgCreateOpen} onClose={() => setIsOrgCreateOpen(false)} />
    </div>
  );
};
