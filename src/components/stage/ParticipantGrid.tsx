import React from 'react';
import {
  Mic,
  MicOff,
  Pin,
  Crown,
} from 'lucide-react';
import { JoinedParticipant } from '../../context/StreamContext';

interface ParticipantGridProps {
  participants: JoinedParticipant[];
  activeSpeakerId: string | null;
  isCamOn: boolean;
  localCamStream: MediaStream | null;
  camVideoRef: React.RefObject<HTMLVideoElement | null>;
  showHostControls: boolean;
  onPinSpeaker?: (id: string) => void;
  pinnedSpeakerId?: string | null;
}

// Distinct, vibrant executive gradient palettes for each participant card
const CARD_PALETTES = [
  {
    bg: 'bg-gradient-to-br from-[#1E293B] via-[#0F172A] to-[#1E1B4B]',
    border: 'border-indigo-500/40',
    avatarBg: 'bg-gradient-to-tr from-blue-600 to-indigo-600',
    activeRing: 'border-[#0084FF] ring-2 ring-[#0084FF] shadow-[0_0_25px_rgba(0,132,255,0.4)]',
  },
  {
    bg: 'bg-gradient-to-br from-[#2E1065] via-[#0F172A] to-[#3B0764]',
    border: 'border-purple-500/40',
    avatarBg: 'bg-gradient-to-tr from-purple-600 to-pink-600',
    activeRing: 'border-purple-500 ring-2 ring-purple-500 shadow-[0_0_25px_rgba(168,85,247,0.4)]',
  },
  {
    bg: 'bg-gradient-to-br from-[#064E3B] via-[#0F172A] to-[#042F2E]',
    border: 'border-emerald-500/40',
    avatarBg: 'bg-gradient-to-tr from-teal-600 to-emerald-600',
    activeRing: 'border-emerald-500 ring-2 ring-emerald-500 shadow-[0_0_25px_rgba(16,185,129,0.4)]',
  },
  {
    bg: 'bg-gradient-to-br from-[#451A03] via-[#0F172A] to-[#78350F]',
    border: 'border-amber-500/40',
    avatarBg: 'bg-gradient-to-tr from-amber-600 to-orange-600',
    activeRing: 'border-amber-500 ring-2 ring-amber-500 shadow-[0_0_25px_rgba(245,158,11,0.4)]',
  },
  {
    bg: 'bg-gradient-to-br from-[#4C0519] via-[#0F172A] to-[#881337]',
    border: 'border-rose-500/40',
    avatarBg: 'bg-gradient-to-tr from-rose-600 to-red-600',
    activeRing: 'border-rose-500 ring-2 ring-rose-500 shadow-[0_0_25px_rgba(244,63,94,0.4)]',
  },
  {
    bg: 'bg-gradient-to-br from-[#083344] via-[#0F172A] to-[#164E63]',
    border: 'border-cyan-500/40',
    avatarBg: 'bg-gradient-to-tr from-cyan-600 to-blue-600',
    activeRing: 'border-cyan-500 ring-2 ring-cyan-500 shadow-[0_0_25px_rgba(6,182,212,0.4)]',
  },
];

export const ParticipantGrid: React.FC<ParticipantGridProps> = ({
  participants,
  activeSpeakerId,
  isCamOn,
  localCamStream,
  showHostControls,
  onPinSpeaker,
  pinnedSpeakerId,
}) => {
  // Ensure at least 1 participant (host) is present
  const displayList: JoinedParticipant[] =
    participants && participants.length > 0
      ? participants
      : [
          {
            id: 'host-primary',
            name: 'Host Presenter',
            isHost: true,
            isCamOn: isCamOn,
            isMicOn: true,
            isSpeaking: true,
          },
        ];

  const totalCount = displayList.length;

  // Grid layout classes matching Zoom & Google Meet
  const getGridColsClass = () => {
    if (pinnedSpeakerId) return 'grid-cols-1 w-full h-full';
    if (totalCount === 1) return 'grid-cols-1 w-full h-full max-w-5xl';
    if (totalCount === 2) return 'grid-cols-1 md:grid-cols-2 w-full h-full max-w-6xl';
    if (totalCount <= 4) return 'grid-cols-1 sm:grid-cols-2 w-full h-full max-w-6xl';
    if (totalCount <= 6) return 'grid-cols-2 lg:grid-cols-3 w-full h-full max-w-7xl';
    return 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 w-full h-full max-w-[1700px]';
  };

  // 1. Spotlight / Pin View
  if (pinnedSpeakerId) {
    const pinnedParticipant =
      displayList.find((p) => p.id === pinnedSpeakerId) || displayList[0];
    const otherParticipants = displayList.filter((p) => p.id !== pinnedParticipant.id);
    const theme = CARD_PALETTES[0];

    return (
      <div className="w-full h-full flex flex-col gap-3 p-2 sm:p-4 select-none">
        {/* Main Pinned Stage */}
        <div className={`flex-1 relative aspect-video ${theme.bg} rounded-3xl overflow-hidden shadow-2xl border-2 ${theme.border} flex items-center justify-center`}>
          <SingleParticipantView
            participant={pinnedParticipant}
            isSelf={pinnedParticipant.isHost ? showHostControls : !showHostControls}
            isCamOn={pinnedParticipant.isHost ? (showHostControls ? isCamOn : false) : (!showHostControls ? isCamOn : false)}
            localCamStream={localCamStream}
            isActiveSpeaker={activeSpeakerId === pinnedParticipant.id}
            isPinned={true}
            theme={theme}
            onUnpin={() => onPinSpeaker && onPinSpeaker('')}
          />
        </div>

        {/* Filmstrip for others */}
        {otherParticipants.length > 0 && (
          <div className="flex items-center gap-3 overflow-x-auto py-1 px-1 shrink-0 max-h-36">
            {otherParticipants.map((p, idx) => {
              const subTheme = CARD_PALETTES[(idx + 1) % CARD_PALETTES.length];
              return (
                <div
                  key={p.id}
                  onClick={() => onPinSpeaker && onPinSpeaker(p.id)}
                  className={`relative w-44 aspect-video rounded-2xl overflow-hidden ${subTheme.bg} border ${subTheme.border} shadow-md cursor-pointer hover:scale-[1.02] transition-all shrink-0 group`}
                >
                  <SingleParticipantView
                    participant={p}
                    isSelf={p.isHost ? showHostControls : !showHostControls}
                    isCamOn={p.isHost ? (showHostControls ? isCamOn : false) : (!showHostControls ? isCamOn : false)}
                    localCamStream={localCamStream}
                    isActiveSpeaker={activeSpeakerId === p.id}
                    isCompact={true}
                    theme={subTheme}
                  />
                </div>
              );
            })}
          </div>
        )}
      </div>
    );
  }

  // 2. Standard Gallery Grid View (Zoom & Google Meet Standard)
  return (
    <div className="w-full h-full flex items-center justify-center p-2 sm:p-4 select-none">
      <div className={`grid ${getGridColsClass()} gap-3 sm:gap-4 w-full h-full items-center justify-center`}>
        {displayList.map((participant, idx) => {
          const isSelf = participant.isHost ? showHostControls : !showHostControls;
          const isSpeaker = activeSpeakerId === participant.id || participant.isSpeaking;
          const theme = CARD_PALETTES[idx % CARD_PALETTES.length];
          const participantCamOn = isSelf ? isCamOn : !!participant.isCamOn;

          return (
            <div
              key={participant.id}
              className={`relative w-full aspect-video rounded-3xl overflow-hidden ${theme.bg} border transition-all duration-300 shadow-xl group flex items-center justify-center ${
                isSpeaker
                  ? theme.activeRing
                  : `${theme.border} hover:border-white/30`
              }`}
            >
              <SingleParticipantView
                participant={participant}
                isSelf={isSelf}
                isCamOn={participantCamOn}
                localCamStream={localCamStream}
                isActiveSpeaker={isSpeaker}
                theme={theme}
                onPin={() => onPinSpeaker && onPinSpeaker(participant.id)}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
};

interface SingleParticipantViewProps {
  participant: JoinedParticipant;
  isSelf: boolean;
  isCamOn: boolean;
  localCamStream: MediaStream | null;
  isActiveSpeaker: boolean;
  theme: typeof CARD_PALETTES[0];
  isCompact?: boolean;
  isPinned?: boolean;
  onPin?: () => void;
  onUnpin?: () => void;
}

const SingleParticipantView: React.FC<SingleParticipantViewProps> = ({
  participant,
  isSelf,
  isCamOn,
  localCamStream,
  isActiveSpeaker,
  theme,
  isCompact = false,
  isPinned = false,
  onPin,
  onUnpin,
}) => {
  return (
    <div className="relative w-full h-full flex items-center justify-center overflow-hidden">
      
      {/* 1. Live Camera Feed (Direct auto-play callback ref ensures instant video mount) */}
      {isSelf && isCamOn && localCamStream ? (
        <video
          ref={(el) => {
            if (el && localCamStream) {
              if (el.srcObject !== localCamStream) {
                el.srcObject = localCamStream;
              }
              el.play().catch(() => {});
            }
          }}
          autoPlay
          playsInline
          muted
          className="w-full h-full object-cover scale-x-[-1] transform"
        />
      ) : (
        /* 2. Stylized Colorful Avatar with Live Audio Ripples (No black screens) */
        <div className="flex flex-col items-center justify-center relative space-y-2 select-none">
          
          {/* Animated Audio Glow Ripples when Speaking */}
          {isActiveSpeaker && (
            <>
              <span className="absolute -inset-4 rounded-full border border-blue-400/40 animate-ping opacity-60 pointer-events-none" />
              <span className="absolute -inset-8 rounded-full border border-blue-500/25 animate-pulse opacity-40 pointer-events-none" />
            </>
          )}

          {participant.avatar ? (
            <img
              src={participant.avatar}
              alt={participant.name}
              className={`${
                isCompact ? 'h-10 w-10' : 'h-16 w-16 sm:h-20 sm:w-20'
              } rounded-full border-2 border-white/20 shadow-2xl object-cover`}
            />
          ) : (
            <div
              className={`${
                isCompact ? 'h-10 w-10 text-sm' : 'h-16 w-16 sm:h-20 sm:w-20 text-2xl font-bold'
              } rounded-full ${theme.avatarBg} border-2 border-white/20 shadow-2xl flex items-center justify-center text-white font-heading`}
            >
              {(participant.name || 'P').charAt(0).toUpperCase()}
            </div>
          )}

          {!isCompact && (
            <strong className="text-xs sm:text-sm font-bold text-white block mt-1 tracking-tight drop-shadow-md">
              {participant.name}
            </strong>
          )}
        </div>
      )}

      {/* 3. Bottom-Left Corner Name Tag Badge (Google Meet & Zoom Standard) */}
      <div className="absolute bottom-3 left-3 z-20 px-2.5 py-1 rounded-xl bg-black/65 backdrop-blur-md text-white text-[11px] font-semibold flex items-center gap-1.5 shadow-lg border border-white/15 max-w-[80%] truncate pointer-events-none">
        {participant.isHost ? (
          <Crown className="h-3 w-3 text-amber-400 shrink-0" />
        ) : (
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 shrink-0" />
        )}
        <span className="truncate">{participant.name}</span>
        {isSelf && <span className="text-slate-400 text-[10px] font-normal">(You)</span>}
      </div>

      {/* 4. Bottom-Right Mic Indicator */}
      <div className="absolute bottom-3 right-3 z-20 p-1.5 rounded-full bg-black/60 backdrop-blur-md border border-white/15 text-white shadow-md">
        {participant.isMicOn !== false ? (
          <Mic className={`h-3 w-3 ${isActiveSpeaker ? 'text-emerald-400 animate-pulse' : 'text-slate-300'}`} />
        ) : (
          <MicOff className="h-3 w-3 text-rose-500" />
        )}
      </div>

      {/* 5. Hover Action: Pin / Spotlight Button */}
      {onPin && !isPinned && (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onPin();
          }}
          className="absolute top-3 right-3 z-20 p-1.5 rounded-xl bg-black/60 hover:bg-[#0084FF] text-white opacity-0 group-hover:opacity-100 transition-all cursor-pointer border border-white/15 shadow-md"
          title="Spotlight / Pin to Full Stage"
        >
          <Pin className="h-3.5 w-3.5" />
        </button>
      )}

      {isPinned && onUnpin && (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onUnpin();
          }}
          className="absolute top-3 right-3 z-20 px-2.5 py-1 rounded-xl bg-[#0084FF] hover:bg-blue-600 text-white text-xs font-semibold flex items-center gap-1 shadow-lg transition-all cursor-pointer border border-white/20"
          title="Exit Spotlight View"
        >
          <Pin className="h-3.5 w-3.5 fill-white" />
          <span>Unpin</span>
        </button>
      )}

    </div>
  );
};
