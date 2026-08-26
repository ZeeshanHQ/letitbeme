import React from 'react';
import {
  Mic,
  MicOff,
  Pin,
  Sparkles,
  User,
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

export const ParticipantGrid: React.FC<ParticipantGridProps> = ({
  participants,
  activeSpeakerId,
  isCamOn,
  localCamStream,
  camVideoRef,
  showHostControls,
  onPinSpeaker,
  pinnedSpeakerId,
}) => {
  // Ensure at least 1 participant (the host) is rendered
  const displayList: JoinedParticipant[] =
    participants.length > 0
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

  // Grid sizing logic matching Zoom & Google Meet
  const getGridColsClass = () => {
    if (pinnedSpeakerId) return 'grid-cols-1';
    if (totalCount === 1) return 'grid-cols-1 max-w-5xl';
    if (totalCount === 2) return 'grid-cols-1 md:grid-cols-2 max-w-6xl';
    if (totalCount <= 4) return 'grid-cols-1 sm:grid-cols-2 max-w-6xl';
    if (totalCount <= 6) return 'grid-cols-2 lg:grid-cols-3 max-w-7xl';
    return 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 max-w-[1700px]';
  };

  // If a participant is pinned, render Spotlight View
  if (pinnedSpeakerId) {
    const pinnedParticipant =
      displayList.find((p) => p.id === pinnedSpeakerId) || displayList[0];
    const otherParticipants = displayList.filter((p) => p.id !== pinnedParticipant.id);

    return (
      <div className="w-full h-full flex flex-col gap-3 p-2 sm:p-4 select-none">
        {/* Main Pinned Stage */}
        <div className="flex-1 relative aspect-video bg-slate-950 rounded-3xl overflow-hidden shadow-2xl border-2 border-[#0084FF] flex items-center justify-center">
          <SingleParticipantView
            participant={pinnedParticipant}
            isSelf={pinnedParticipant.isHost ? showHostControls : !showHostControls}
            isCamOn={pinnedParticipant.isHost ? isCamOn : false}
            localCamStream={localCamStream}
            camVideoRef={camVideoRef}
            isActiveSpeaker={activeSpeakerId === pinnedParticipant.id}
            isPinned={true}
            onUnpin={() => onPinSpeaker && onPinSpeaker('')}
          />
        </div>

        {/* Top / Side Filmstrip for other participants */}
        {otherParticipants.length > 0 && (
          <div className="flex items-center gap-3 overflow-x-auto py-1 px-1 shrink-0 max-h-36">
            {otherParticipants.map((p) => (
              <div
                key={p.id}
                onClick={() => onPinSpeaker && onPinSpeaker(p.id)}
                className="relative w-44 aspect-video rounded-2xl overflow-hidden bg-slate-900 border border-slate-800 shadow-md cursor-pointer hover:border-[#0084FF] transition-all shrink-0 group"
              >
                <SingleParticipantView
                  participant={p}
                  isSelf={p.isHost ? showHostControls : !showHostControls}
                  isCamOn={p.isHost ? isCamOn : false}
                  localCamStream={localCamStream}
                  camVideoRef={camVideoRef}
                  isActiveSpeaker={activeSpeakerId === p.id}
                  isCompact={true}
                />
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }

  // Standard Gallery Grid View (Zoom & Google Meet Standard)
  return (
    <div className="w-full h-full flex items-center justify-center p-2 sm:p-3 select-none">
      <div className={`grid ${getGridColsClass()} gap-3 sm:gap-4 w-full h-full items-center justify-center`}>
        {displayList.map((participant) => {
          const isSelf = participant.isHost ? showHostControls : !showHostControls;
          const isSpeaker = activeSpeakerId === participant.id || participant.isSpeaking;

          return (
            <div
              key={participant.id}
              className={`relative w-full aspect-video rounded-3xl overflow-hidden bg-gradient-to-b from-[#0F172A] via-[#0A0E1A] to-[#06080F] border transition-all duration-300 shadow-2xl group flex items-center justify-center ${
                isSpeaker
                  ? 'border-[#0084FF] ring-2 ring-[#0084FF]/60 shadow-[0_0_30px_rgba(0,132,255,0.35)]'
                  : 'border-slate-800/90 hover:border-slate-700'
              }`}
            >
              <SingleParticipantView
                participant={participant}
                isSelf={isSelf}
                isCamOn={participant.isHost ? isCamOn : false}
                localCamStream={localCamStream}
                camVideoRef={camVideoRef}
                isActiveSpeaker={isSpeaker}
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
  camVideoRef: React.RefObject<HTMLVideoElement | null>;
  isActiveSpeaker: boolean;
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
  camVideoRef,
  isActiveSpeaker,
  isCompact = false,
  isPinned = false,
  onPin,
  onUnpin,
}) => {
  return (
    <div className="relative w-full h-full flex items-center justify-center overflow-hidden">
      
      {/* 1. Camera Feed (if camera is active for self host) */}
      {isSelf && isCamOn && localCamStream ? (
        <video
          ref={camVideoRef as any}
          autoPlay
          playsInline
          muted
          className="w-full h-full object-cover scale-x-[-1] transform"
        />
      ) : (
        /* 2. Stylized Avatar with Live Audio Ripples */
        <div className="flex flex-col items-center justify-center relative space-y-2">
          
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
              } rounded-full border-2 border-[#0084FF] shadow-2xl object-cover bg-slate-800`}
            />
          ) : (
            <div
              className={`${
                isCompact ? 'h-10 w-10 text-sm' : 'h-16 w-16 sm:h-20 sm:w-20 text-2xl font-bold'
              } rounded-full bg-gradient-to-tr from-blue-900 via-slate-800 to-indigo-900 border-2 border-[#0084FF] shadow-2xl flex items-center justify-center text-white font-heading`}
            >
              {participant.name.charAt(0).toUpperCase()}
            </div>
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
      {onPin && (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onPin();
          }}
          className="absolute top-3 right-3 z-20 p-1.5 rounded-xl bg-black/60 hover:bg-[#0084FF] text-white opacity-0 group-hover:opacity-100 transition-all cursor-pointer border border-white/15"
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
