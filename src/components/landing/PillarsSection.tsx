import React from 'react';
import {
  ShieldCheck,
  Building2,
  Lock,
  UserCheck,
  Video,
  Compass,
  FileText,
  Sparkles,
  ArrowRight,
  Mic,
  Sliders,
} from 'lucide-react';

export const PillarsSection: React.FC = () => {
  return (
    <section id="product" className="py-28 sm:py-36 bg-slate-50 border-t border-b border-slate-200/80 select-none">
      <div className="max-w-[1360px] mx-auto px-6 sm:px-10 space-y-24">
        
        {/* Section Introductory Statement */}
        <div className="max-w-2xl space-y-3">
          <h2 className="text-3xl sm:text-4xl font-medium text-slate-950 tracking-[-0.03em] leading-tight">
            An integrated operating environment for leadership networks.
          </h2>
          <p className="text-base font-light text-slate-600 leading-relaxed">
            Rather than stitching together disjointed productivity and networking tools, Triple Motive delivers a sovereign platform engineered for high-trust professional relationships.
          </p>
        </div>

        {/* Pillar 1: Sovereign Identity & Multi-Tenancy */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          <div className="lg:col-span-5 space-y-4">
            <h3 className="text-2xl font-medium text-slate-900 tracking-tight leading-snug">
              Verified identity and multi-tenant organization workspaces.
            </h3>
            <p className="text-sm font-light text-slate-600 leading-relaxed">
              Every member operates with an authenticated executive handle and organization membership. Public profiles present credentials intentionally, while private contact details remain strictly isolated to the member.
            </p>
            <ul className="space-y-2.5 pt-2 text-xs text-slate-600 font-light">
              <li className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-slate-400" />
                <span>Verified identity handles ending in @triplemotive.net</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-slate-400" />
                <span>Organization workspaces with structured ownership and governance roles</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-slate-400" />
                <span>Strict separation of public profile fields from private account attributes</span>
              </li>
            </ul>
          </div>

          <div className="lg:col-span-7 rounded-2xl bg-white border border-slate-200/90 p-6 sm:p-8 shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-slate-100">
              <div className="flex items-center gap-3.5">
                <div className="h-12 w-12 rounded-xl bg-slate-900 text-white font-medium flex items-center justify-center text-sm shadow-sm">
                  HQ
                </div>
                <div>
                  <h4 className="text-sm font-medium text-slate-900">Horizon Quantum Systems</h4>
                  <span className="text-xs text-slate-500 font-mono">slug: horizon-quantum</span>
                </div>
              </div>
              <span className="px-2.5 py-1 rounded-md bg-slate-100 text-slate-700 text-xs font-mono font-medium self-start sm:self-auto">
                Role: Owner
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 space-y-1">
                <span className="text-[11px] text-slate-500 font-mono">Public Verified Profile</span>
                <span className="text-xs font-medium text-slate-900 block">Alexander Vance • CEO</span>
                <span className="text-[11px] text-slate-500 block">Domain: Quantum Systems & Applied AI</span>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 space-y-1">
                <span className="text-[11px] text-emerald-600 font-mono flex items-center gap-1">
                  <Lock className="h-3 w-3" strokeWidth={1.5} />
                  <span>Private Member Data</span>
                </span>
                <span className="text-xs font-medium text-slate-900 block">alex@horizonquantum.io</span>
                <span className="text-[11px] text-slate-500 block">Isolated: Visible to account holder only</span>
              </div>
            </div>
          </div>
        </div>

        {/* Pillar 2: Permissioned Relationship Network */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center pt-8 border-t border-slate-200">
          <div className="lg:col-span-7 order-2 lg:order-1 rounded-2xl bg-white border border-slate-200/90 p-6 sm:p-8 shadow-sm space-y-4">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <span className="text-xs font-medium text-slate-900">Active Executive Connections</span>
              <span className="text-xs text-slate-500 font-mono">Canonical Pair Verification</span>
            </div>

            <div className="space-y-3">
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3 min-w-0">
                  <img
                    src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80"
                    alt="Marcus Sterling"
                    className="h-10 w-10 rounded-xl object-cover border border-slate-200"
                  />
                  <div className="min-w-0">
                    <span className="text-xs font-medium text-slate-900 block truncate">Marcus Sterling</span>
                    <span className="text-[11px] text-slate-500 block truncate">Managing General Partner @ Apex Vanguard</span>
                  </div>
                </div>
                <span className="text-xs font-medium text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-md shrink-0">
                  Connected
                </span>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3 min-w-0">
                  <img
                    src="https://images.unsplash.com/photo-1580489944761-15a19d654956?w=200&auto=format&fit=crop&q=80"
                    alt="Dr. Sophia Lin"
                    className="h-10 w-10 rounded-xl object-cover border border-slate-200"
                  />
                  <div className="min-w-0">
                    <span className="text-xs font-medium text-slate-900 block truncate">Dr. Sophia Lin</span>
                    <span className="text-[11px] text-slate-500 block truncate">President & CEO @ ChronoHealth Longevity</span>
                  </div>
                </div>
                <span className="text-xs font-medium text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-md shrink-0">
                  Connected
                </span>
              </div>
            </div>
          </div>

          <div className="lg:col-span-5 order-1 lg:order-2 space-y-4">
            <h3 className="text-2xl font-medium text-slate-900 tracking-tight leading-snug">
              Permissioned relationships without unsolicited noise.
            </h3>
            <p className="text-sm font-light text-slate-600 leading-relaxed">
              Connections are established through intentional, reciprocal introductions with contextual notes. Duplicate or reverse pending requests are systematically rejected at the data foundation.
            </p>
            <ul className="space-y-2.5 pt-2 text-xs text-slate-600 font-light">
              <li className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-slate-400" />
                <span>Zero unsolicited mass-messaging or third-party marketing</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-slate-400" />
                <span>Canonical relationship pair validation</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-slate-400" />
                <span>Direct 1-click video meeting triggers for connected members</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Pillar 3: Encrypted WebRTC Video Infrastructure */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center pt-8 border-t border-slate-200">
          <div className="lg:col-span-5 space-y-4">
            <h3 className="text-2xl font-medium text-slate-900 tracking-tight leading-snug">
              Encrypted 1080p video meetings built into the workflow.
            </h3>
            <p className="text-sm font-light text-slate-600 leading-relaxed">
              High-definition WebRTC video meetings run natively inside Triple Motive without external meeting links or third-party client downloads.
            </p>
            <ul className="space-y-2.5 pt-2 text-xs text-slate-600 font-light">
              <li className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-slate-400" />
                <span>Browser-native peer communication with zero software installs</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-slate-400" />
                <span>Dynamic responsive gallery grid with active speaker detection</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-slate-400" />
                <span>Executive moderation tools including host muting and participant controls</span>
              </li>
            </ul>
          </div>

          <div className="lg:col-span-7 rounded-2xl bg-slate-900 border border-slate-800 p-6 sm:p-8 text-white shadow-md space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <Video className="h-4 w-4 text-blue-400" strokeWidth={1.5} />
                <span className="text-xs font-medium text-slate-200">Executive Call • Board Synchronization</span>
              </div>
              <span className="text-xs font-mono text-emerald-400">Mesh Active</span>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="aspect-video rounded-xl bg-slate-950 border border-slate-800 relative overflow-hidden flex items-center justify-center">
                <img
                  src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=500&auto=format&fit=crop&q=80"
                  alt="Host"
                  className="w-full h-full object-cover"
                />
                <div className="absolute bottom-2 left-2 px-2 py-0.5 rounded bg-black/70 text-[10px] text-white">
                  Alexander Vance (Host)
                </div>
              </div>

              <div className="aspect-video rounded-xl bg-slate-950 border border-slate-800 relative overflow-hidden flex items-center justify-center">
                <img
                  src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=500&auto=format&fit=crop&q=80"
                  alt="Attendee"
                  className="w-full h-full object-cover"
                />
                <div className="absolute bottom-2 left-2 px-2 py-0.5 rounded bg-black/70 text-[10px] text-white">
                  Dr. Elena Rostova
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between text-xs text-slate-400 pt-2 border-t border-slate-800/80">
              <span>Abstract transport layer boundary</span>
              <span className="font-mono text-slate-300">1080p Peer-to-Peer</span>
            </div>
          </div>
        </div>

        {/* Pillar 4: Universe & Digital Body of Work */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center pt-8 border-t border-slate-200">
          <div className="lg:col-span-7 order-2 lg:order-1 rounded-2xl bg-white border border-slate-200/90 p-6 sm:p-8 shadow-sm space-y-4">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <span className="text-xs font-medium text-slate-900">Semantic Body of Work Index</span>
              <span className="text-xs text-slate-500 font-mono">Folderless Retrieval</span>
            </div>

            <div className="space-y-3">
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between text-xs">
                <div className="flex items-center gap-3">
                  <FileText className="h-4 w-4 text-blue-600" strokeWidth={1.5} />
                  <div>
                    <span className="font-medium text-slate-900 block">Quantum Architecture Whitepaper 2026.pdf</span>
                    <span className="text-[11px] text-slate-500">Indexed metadata • Sovereign storage partition</span>
                  </div>
                </div>
                <span className="text-[11px] font-mono text-slate-500">PDF • 4.2 MB</span>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between text-xs">
                <div className="flex items-center gap-3">
                  <FileText className="h-4 w-4 text-blue-600" strokeWidth={1.5} />
                  <div>
                    <span className="font-medium text-slate-900 block">Synthetix Diffusion Therapeutics Memo.docx</span>
                    <span className="text-[11px] text-slate-500">Indexed metadata • Sovereign storage partition</span>
                  </div>
                </div>
                <span className="text-[11px] font-mono text-slate-500">DOCX • 1.8 MB</span>
              </div>
            </div>
          </div>

          <div className="lg:col-span-5 order-1 lg:order-2 space-y-4">
            <h3 className="text-2xl font-medium text-slate-900 tracking-tight leading-snug">
              A private digital universe for your life's work.
            </h3>
            <p className="text-sm font-light text-slate-600 leading-relaxed">
              Every member maintains an isolated digital repository without rigid folder hierarchies. Content is organized by metadata, embeddings, and semantic intelligence for cross-modal synthesis.
            </p>
            <ul className="space-y-2.5 pt-2 text-xs text-slate-600 font-light">
              <li className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-slate-400" />
                <span>Multi-modal ingestion of research, documents, memos, and media</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-slate-400" />
                <span>Strict data isolation with zero mixing across member libraries</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-slate-400" />
                <span>AI intelligence synthesis with mandatory human review before external action</span>
              </li>
            </ul>
          </div>
        </div>

      </div>
    </section>
  );
};
