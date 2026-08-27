import React from 'react';
import {
  X,
  UserCheck,
  UserX,
  Clock,
  Send,
  ShieldCheck,
} from 'lucide-react';
import { useNetwork } from '../../context/NetworkContext';

interface ConnectionRequestsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ConnectionRequestsModal: React.FC<ConnectionRequestsModalProps> = ({
  isOpen,
  onClose,
}) => {
  const {
    incomingRequests,
    outgoingRequests,
    acceptRequest,
    declineRequest,
    cancelRequest,
  } = useNetwork();

  const [activeTab, setActiveTab] = React.useState<'incoming' | 'outgoing'>('incoming');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in select-none">
      <div className="w-full max-w-xl bg-[#0F141E] border border-slate-800 rounded-3xl p-6 shadow-2xl relative flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div>
            <h2 className="text-base font-bold text-white font-heading">Connection Invitations</h2>
            <p className="text-xs text-slate-400 mt-0.5">Manage your private professional relationship requests.</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800/80 transition-all cursor-pointer"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center gap-2 pt-4 pb-3">
          <button
            type="button"
            onClick={() => setActiveTab('incoming')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
              activeTab === 'incoming'
                ? 'bg-blue-600/20 text-blue-400 border border-blue-500/30'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <span>Incoming</span>
            <span className="px-1.5 py-0.2 rounded-full bg-slate-800 text-[10px] font-mono">
              {incomingRequests.length}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('outgoing')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
              activeTab === 'outgoing'
                ? 'bg-blue-600/20 text-blue-400 border border-blue-500/30'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <span>Sent Requests</span>
            <span className="px-1.5 py-0.2 rounded-full bg-slate-800 text-[10px] font-mono">
              {outgoingRequests.length}
            </span>
          </button>
        </div>

        {/* List Content */}
        <div className="flex-1 overflow-y-auto space-y-3 py-2 pr-1">
          {activeTab === 'incoming' ? (
            incomingRequests.length === 0 ? (
              <div className="py-12 text-center text-slate-400 text-xs">
                <Clock className="h-8 w-8 text-slate-400 mx-auto mb-2 opacity-50" />
                <p>No pending incoming connection requests.</p>
              </div>
            ) : (
              incomingRequests.map((req) => (
                <div
                  key={req.id}
                  className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800/90 flex flex-col gap-3"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <img
                        src={req.senderProfile?.avatarUrl || `https://api.dicebear.com/7.x/initials/svg?seed=P`}
                        alt={req.senderProfile?.fullName || 'Member'}
                        className="h-10 w-10 rounded-xl object-cover border border-slate-700 shadow-sm"
                      />
                      <div>
                        <h4 className="text-xs font-bold text-white font-heading">
                          {req.senderProfile?.fullName || 'Executive Member'}
                        </h4>
                        <p className="text-[11px] text-slate-400">
                          {req.senderProfile?.headline || 'Founder & CEO'}
                        </p>
                      </div>
                    </div>

                    <span className="text-[10px] font-mono text-slate-400">
                      {new Date(req.createdAt).toLocaleDateString()}
                    </span>
                  </div>

                  {req.note && (
                    <div className="p-2.5 rounded-xl bg-slate-950/60 border border-slate-800 text-xs text-slate-300 italic">
                      "{req.note}"
                    </div>
                  )}

                  <div className="flex items-center justify-end gap-2 pt-1">
                    <button
                      type="button"
                      onClick={() => declineRequest(req.id)}
                      className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5"
                    >
                      <UserX className="h-3 w-3" />
                      <span>Decline</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => acceptRequest(req.id)}
                      className="px-3.5 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5 shadow-md shadow-blue-500/20 font-heading"
                    >
                      <UserCheck className="h-3.5 w-3.5" />
                      <span>Accept Connection</span>
                    </button>
                  </div>
                </div>
              ))
            )
          ) : outgoingRequests.length === 0 ? (
            <div className="py-12 text-center text-slate-400 text-xs">
              <Send className="h-8 w-8 text-slate-400 mx-auto mb-2 opacity-50" />
              <p>No outgoing requests sent yet.</p>
            </div>
          ) : (
            outgoingRequests.map((req) => (
              <div
                key={req.id}
                className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800/90 flex items-center justify-between gap-3"
              >
                <div className="flex items-center gap-3">
                  <img
                    src={req.receiverProfile?.avatarUrl || `https://api.dicebear.com/7.x/initials/svg?seed=P`}
                    alt={req.receiverProfile?.fullName || 'Member'}
                    className="h-10 w-10 rounded-xl object-cover border border-slate-700 shadow-sm"
                  />
                  <div>
                    <h4 className="text-xs font-bold text-white font-heading">
                      {req.receiverProfile?.fullName || 'Executive Member'}
                    </h4>
                    <p className="text-[11px] text-slate-400">
                      {req.receiverProfile?.headline || 'CEO'}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span className="text-[11px] font-mono text-amber-400 flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    <span>Pending</span>
                  </span>

                  <button
                    type="button"
                    onClick={() => cancelRequest(req.id)}
                    className="px-2.5 py-1 rounded-xl bg-slate-800 hover:bg-rose-500/20 hover:text-rose-300 text-slate-400 text-xs transition-all cursor-pointer"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
