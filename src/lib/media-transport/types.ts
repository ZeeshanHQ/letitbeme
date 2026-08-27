// =================================================================
// TRIPLE MOTIVE MEDIA TRANSPORT BOUNDARY
// Decouples UI & Business Logic from Underlying Media/Signaling Engine
// =================================================================

export interface MediaTransportConfig {
  roomId: string;
  userId: string;
  userName: string;
  isHost: boolean;
}

export interface MediaParticipantState {
  id: string;
  name: string;
  avatar?: string;
  isHost: boolean;
  isCamOn: boolean;
  isMicOn: boolean;
  isSpeaking: boolean;
}

export interface MediaTransportEvents {
  onParticipantJoined: (participant: MediaParticipantState) => void;
  onParticipantLeft: (participantId: string) => void;
  onParticipantStateChange: (participantId: string, state: Partial<MediaParticipantState>) => void;
  onRemoteTrack: (participantId: string, stream: MediaStream) => void;
  onActiveSpeakerChange: (speakerId: string | null) => void;
  onChatMessage: (msg: any) => void;
  onMeetingEnded: () => void;
  onModerated: (action: 'toggle_mic' | 'toggle_cam' | 'remove') => void;
}

export interface IMediaTransport {
  initialize(config: MediaTransportConfig, events: MediaTransportEvents): Promise<void>;
  publishLocalTracks(stream: MediaStream | null): Promise<void>;
  setMicMuted(muted: boolean): void;
  setVideoEnabled(enabled: boolean): void;
  sendChatMessage(message: string): void;
  sendModerationSignal(targetId: string, action: 'toggle_mic' | 'toggle_cam' | 'remove'): void;
  leaveRoom(): Promise<void>;
  endRoom(): Promise<void>;
  destroy(): void;
}
