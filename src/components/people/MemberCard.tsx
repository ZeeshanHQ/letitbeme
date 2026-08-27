import React from 'react';
import {
  ShieldCheck,
  UserPlus,
  UserCheck,
  Clock,
  Video,
  ExternalLink,
  MapPin,
} from 'lucide-react';
import { Profile } from '../../types';
import { useNetwork } from '../../context/NetworkContext';

interface MemberCardProps {
  member: Profile;
  onOpenDetails: (member: Profile) => void;
  onDirectMeet: (member: Profile) => void;
}

export const MemberCard: React.FC<MemberCardProps> = ({
  member,
  onOpenDetails,
  onDirectMeet,
}) => {
  const { getConnectionStatus, sendRequest } = useNetwork();
  const status = getConnectionStatus(member.id);

  return (
    <div
      onClick={() => onOpenDetails(member)}
      className="p-5 rounded-2xl bg-[#0F141E] border border-slate-800/80 hover:border-slate-700/90 shadow-xl transition-all cursor-pointer group flex flex-col justify-between select-none relative overflow-hidden"
    >
      {/* Subtle top accent gradient */}
      <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-blue-500/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

      {/* Top Header & Avatar */}
      <div>
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="relative">
            <img
              src={member.avatarUrl || `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(member.fullName)}`}
              alt={member.fullName}
              className="h-12 w-12 rounded-xl object-cover border border-slate-700 shadow-md group-hover:scale-105 transition-transform"
            />
            {member.isVerified && (
              <span className="absolute -bottom-1 -right-1 h-4 w-4 rounded-full bg-blue-600 text-white flex items-center justify-center shadow-md">
                <ShieldCheck className="h-2.5 w-2.5" />
              </span>
            )}
          </div>

          <span className="text-[10px] font-mono text-slate-400 block px-2 py-0.5 rounded-full bg-slate-900 border border-slate-800">
            @{member.tripleMotiveHandle || 'member'}
          </span>
        </div>

        {/* Member Name & Headline */}
        <h3 className="text-sm font-bold text-white group-hover:text-blue-400 transition-colors font-heading truncate">
          {member.fullName}
        </h3>
        <p className="text-xs text-slate-400 mt-1 line-clamp-2 leading-relaxed font-sans">
          {member.headline || 'Executive Member'}
        </p>

        {member.location && (
          <div className="flex items-center gap-1 text-[11px] text-slate-400 mt-2">
            <MapPin className="h-3 w-3 shrink-0 text-slate-400" />
            <span className="truncate">{member.location}</span>
          </div>
        )}

        {/* Expertise Tags */}
        {member.interests && member.interests.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mt-3.5">
            {member.interests.slice(0, 3).map((interest, idx) => (
              <span
                key={idx}
                className="px-2 py-0.5 rounded-md text-[10px] font-medium bg-slate-900 text-slate-300 border border-slate-800/80"
              >
                {interest}
              </span>
            ))}
            {member.interests.length > 3 && (
              <span className="px-1.5 py-0.5 rounded-md text-[10px] font-mono text-slate-400 bg-slate-900 border border-slate-800">
                +{member.interests.length - 3}
              </span>
            )}
          </div>
        )}
      </div>

      {/* Action Footer */}
      <div className="pt-4 mt-4 border-t border-slate-800/60 flex items-center justify-between gap-2">
        {status === 'connected' ? (
          <>
            <span className="flex items-center gap-1.5 text-[11px] font-mono font-semibold text-emerald-400">
              <UserCheck className="h-3.5 w-3.5" />
              <span>Connected</span>
            </span>

            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onDirectMeet(member);
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-600/15 hover:bg-blue-600 text-blue-400 hover:text-white border border-blue-500/30 text-xs font-semibold transition-all cursor-pointer"
            >
              <Video className="h-3 w-3" />
              <span>Video Call</span>
            </button>
          </>
        ) : status === 'pending_outgoing' ? (
          <span className="flex items-center gap-1.5 text-[11px] font-mono text-amber-400">
            <Clock className="h-3.5 w-3.5" />
            <span>Request Sent</span>
          </span>
        ) : status === 'pending_incoming' ? (
          <span className="flex items-center gap-1.5 text-[11px] font-mono text-blue-400 animate-pulse">
            <span>Invited You</span>
          </span>
        ) : (
          <button
            type="button"
            onClick={async (e) => {
              e.stopPropagation();
              await sendRequest(member.id);
            }}
            className="w-full flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-slate-800/80 hover:bg-blue-600 text-slate-200 hover:text-white border border-slate-700 hover:border-blue-500 text-xs font-semibold transition-all cursor-pointer"
          >
            <UserPlus className="h-3 w-3" />
            <span>Connect</span>
          </button>
        )}
      </div>
    </div>
  );
};
