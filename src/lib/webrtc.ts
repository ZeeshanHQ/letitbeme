// Production-grade WebRTC Mesh Signaling and Peer Connection Utility
export const ICE_SERVERS: RTCConfiguration = {
  iceServers: [
    {
      urls: [
        'stun:stun.l.google.com:19302',
        'stun:stun1.l.google.com:19302',
        'stun:stun2.l.google.com:19302',
        'stun:stun3.l.google.com:19302',
        'stun:stun4.l.google.com:19302',
      ],
    },
    {
      urls: ['stun:stun.cloudflare.com:3478'],
    },
  ],
  iceCandidatePoolSize: 10,
};

export interface WebRTCSignal {
  type: 'OFFER' | 'ANSWER' | 'ICE_CANDIDATE' | 'PEER_JOINED' | 'PEER_LEFT';
  senderId: string;
  targetId?: string; // If undefined, broadcast to all
  data?: any;
  ts: number;
}
