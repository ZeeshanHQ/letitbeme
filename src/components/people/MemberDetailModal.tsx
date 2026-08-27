import React, { useState } from 'react';
import {
  X,
  ShieldCheck,
  Video,
  UserPlus,
  UserCheck,
  Building2,
  MapPin,
  Send,
  MessageSquare,
} from 'lucide-react';
import { Profile } from '../../types';
import { useNetwork } from '../../context/NetworkContext';

interface MemberDetailModalProps {
  member: Profile | null;
  isOpen: boolean;
  onClose: () => void;
  onDirectMeet: (member: Profile) => void;
}

export const MemberDetailModal: React.FC<MemberDetailModalProps> = ({
  member,
  isOpen,
  onClose,
  onDirectMeet,
}) => {
  const { getConnectionStatus, sendRequest } = useNetwork();
  const [note, setNote] = useState('');
  const [isSending, setIsSending] = useState(false);

  if (!isOpen || !member) return null;

  const status = getConnectionStatus(member.id);

  const handleSendRequest = async () => {
    setIsSending(true);
    await sendRequest(member.id, note);
    setIsSending(false);
    setNote('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in select-none">
      <div className="w-full max-w-2xl bg-[#0F141E] border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl relative flex flex-col max-h-[90vh] overflow-y-auto">
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-6 right-6 p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-all cursor-pointer"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Member Profile Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5 pb-6 border-b border-slate-800">
          <div className="relative shrink-0">
            <img
              src={member.avatarUrl || `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(member.fullName)}`}
              alt={member.fullName}
              className="h-20 w-20 rounded-2xl object-cover border-2 border-slate-700 shadow-xl"
            />
            {member.isVerified && (
              <span className="absolute -bottom-1 -right-1 h-6 w-6 rounded-full bg-blue-600 text-white flex items-center justify-center shadow-lg">
                <ShieldCheck className="h-3.5 w-3.5" />
              </span>
            )}
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-bold text-white tracking-tight font-heading">
                {member.fullName}
              </h2>
              <span className="px-2 py-0.5 rounded-full bg-slate-900 border border-slate-800 text-[10px] font-mono text-blue-400">
                @{member.tripleMotiveHandle || 'member'}
              </span>
            </div>

            <p className="text-sm text-slate-300 font-medium mt-1">
              {member.headline || 'Executive Member'}
            </p>

            <div className="flex items-center gap-4 text-xs text-slate-400 mt-2 font-mono">
              {member.location && (
                <div className="flex items-center gap-1">
                  <MapPin className="h-3.5 w-3.5 text-slate-400" />
                  <span>{member.location}</span>
                </div>
              )}
              <div className="flex items-center gap-1 text-emerald-400">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                <span>Verified Ecosystem Node</span>
              </div>
            </div>
          </div>
        </div>

        {/* Executive Biography */}
        <div className="py-6 space-y-4 border-b border-slate-800">
          <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-400">
            Executive Summary
          </h3>
          <p className="text-sm text-slate-300 leading-relaxed font-sans">
            {member.biography || 'No executive summary provided yet.'}
          </p>

          {/* Focus & Expertise */}
          {member.interests && member.interests.length > 0 && (
            <div className="pt-2">
              <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-400 mb-2">
                Domain Expertise
              </h4>
              <div className="flex flex-wrap gap-2">
                {member.interests.map((interest, idx) => (
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

        {/* Action Panel */}
        <div className="pt-6">
          {status === 'connected' ? (
            <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 flex items-center justify-between gap-4">
              <div className="flex items-center gap-2 text-emerald-400 text-xs font-mono font-semibold">
                <UserCheck className="h-4 w-4" />
                <span>Connected in Executive Network</span>
              </div>

              <button
                type="button"
                onClick={() => {
                  onClose();
                  onDirectMeet(member);
                }}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-xs font-bold shadow-lg shadow-blue-500/20 transition-all cursor-pointer font-heading"
              >
                <Video className="h-4 w-4" />
                <span>Launch Video Call</span>
              </button>
            </div>
          ) : status === 'pending_outgoing' ? (
            <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 text-center text-xs font-mono text-amber-400">
              Connection request sent and pending approval.
            </div>
          ) : (
            <div className="space-y-3">
              <textarea
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="Include a private introduction note (optional)..."
                className="w-full p-3 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/50 transition-all resize-none h-20"
              />

              <button
                type="button"
                onClick={handleSendRequest}
                disabled={isSending}
                className="w-full flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white text-xs font-bold shadow-lg shadow-blue-500/20 transition-all cursor-pointer font-heading"
              >
                <UserPlus className="h-4 w-4" />
                <span>{isSending ? 'Sending Request...' : 'Send Private Connection Request'}</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
