import React, { useState, useMemo } from 'react';
import {
  Users,
  Search,
  Filter,
  UserCheck,
  Sparkles,
  SlidersHorizontal,
} from 'lucide-react';
import { Profile } from '../../types';
import { useNetwork } from '../../context/NetworkContext';
import { MemberCard } from './MemberCard';
import { MemberDetailModal } from './MemberDetailModal';

interface PeopleWorkspaceProps {
  onDirectMeet: (member: Profile) => void;
}

export const PeopleWorkspace: React.FC<PeopleWorkspaceProps> = ({ onDirectMeet }) => {
  const {
    directory,
    searchQuery,
    setSearchQuery,
    selectedInterestFilter,
    setSelectedInterestFilter,
  } = useNetwork();

  const [selectedMember, setSelectedMember] = useState<Profile | null>(null);

  // Extract unique interests for quick filtering
  const allInterests = useMemo(() => {
    const set = new Set<string>();
    directory.forEach((m) => m.interests?.forEach((i) => set.add(i)));
    return Array.from(set);
  }, [directory]);

  // Filtered members list
  const filteredMembers = useMemo(() => {
    return directory.filter((member) => {
      const matchesSearch =
        searchQuery.trim() === '' ||
        member.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        member.headline?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        member.interests.some((i) => i.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchesInterest =
        !selectedInterestFilter || member.interests.includes(selectedInterestFilter);

      return matchesSearch && matchesInterest;
    });
  }, [directory, searchQuery, selectedInterestFilter]);

  return (
    <div className="p-6 sm:p-8 max-w-7xl mx-auto space-y-6 select-none font-sans">
      {/* Workspace Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-white tracking-tight font-heading">
              People & Network
            </h1>
            <span className="px-2.5 py-0.5 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20 text-xs font-mono font-semibold">
              {directory.length} Verified Nodes
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Discover approved founders, CEOs, researchers, and venture partners in the private ecosystem.
          </p>
        </div>
      </div>

      {/* Domain Expertise Filter Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        <button
          type="button"
          onClick={() => setSelectedInterestFilter(null)}
          className={`px-3 py-1.5 rounded-xl text-xs font-semibold shrink-0 transition-all cursor-pointer ${
            selectedInterestFilter === null
              ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
              : 'bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800'
          }`}
        >
          All Domains
        </button>

        {allInterests.map((interest) => (
          <button
            key={interest}
            type="button"
            onClick={() =>
              setSelectedInterestFilter(selectedInterestFilter === interest ? null : interest)
            }
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold shrink-0 transition-all cursor-pointer ${
              selectedInterestFilter === interest
                ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
                : 'bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800'
            }`}
          >
            {interest}
          </button>
        ))}
      </div>

      {/* Directory Grid */}
      {filteredMembers.length === 0 ? (
        <div className="py-20 text-center rounded-3xl bg-[#0F141E] border border-slate-800 text-slate-400">
          <Search className="h-8 w-8 mx-auto mb-2 text-slate-400 opacity-50" />
          <h3 className="text-sm font-bold text-white font-heading">No verified members found</h3>
          <p className="text-xs mt-1">Try adjusting your search query or domain filter.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {filteredMembers.map((member) => (
            <MemberCard
              key={member.id}
              member={member}
              onOpenDetails={(m) => setSelectedMember(m)}
              onDirectMeet={onDirectMeet}
            />
          ))}
        </div>
      )}

      {/* Detailed Member Profile Modal */}
      <MemberDetailModal
        member={selectedMember}
        isOpen={Boolean(selectedMember)}
        onClose={() => setSelectedMember(null)}
        onDirectMeet={onDirectMeet}
      />
    </div>
  );
};
