import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { useAuth } from './AuthContext';
import { Profile, ConnectionRequest, Connection } from '../types';

interface NetworkContextType {
  directory: Profile[];
  connections: Connection[];
  incomingRequests: ConnectionRequest[];
  outgoingRequests: ConnectionRequest[];
  isLoading: boolean;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedInterestFilter: string | null;
  setSelectedInterestFilter: (interest: string | null) => void;
  sendRequest: (receiverId: string, note?: string) => Promise<{ success: boolean; error?: string }>;
  acceptRequest: (requestId: string) => Promise<{ success: boolean; error?: string }>;
  declineRequest: (requestId: string) => Promise<{ success: boolean; error?: string }>;
  cancelRequest: (requestId: string) => Promise<{ success: boolean; error?: string }>;
  disconnectMember: (connectionId: string) => Promise<{ success: boolean; error?: string }>;
  getConnectionStatus: (memberId: string) => 'connected' | 'pending_outgoing' | 'pending_incoming' | 'none';
  refreshNetwork: () => Promise<void>;
}

const INITIAL_DIRECTORY_MEMBERS: Profile[] = [
  {
    id: '11111111-1111-1111-1111-111111111111',
    fullName: 'Alexander Vance',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
    headline: 'Founder & CEO @ Horizon Quantum',
    biography: 'Building next-generation quantum infrastructure for enterprise intelligence. Former Partner at Benchmark.',
    location: 'San Francisco, CA',
    interests: ['Quantum Computing', 'Applied AI', 'Venture Capital', 'DeepTech'],
    tripleMotiveHandle: 'alex',
    isVerified: true,
    status: 'active',
  },
  {
    id: '22222222-2222-2222-2222-222222222222',
    fullName: 'Dr. Elena Rostova',
    avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200&auto=format&fit=crop&q=80',
    headline: 'Chief AI Scientist & Co-Founder @ Synthetix Bio',
    biography: 'Accelerating therapeutic molecule discovery through transformer diffusion models. PhD in Biophysics from Stanford.',
    location: 'Boston, MA',
    interests: ['Computational Biology', 'Generative Chemistry', 'Longevity', 'BioTech'],
    tripleMotiveHandle: 'elena',
    isVerified: true,
    status: 'active',
  },
  {
    id: '33333333-3333-3333-3333-333333333333',
    fullName: 'Marcus Sterling',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80',
    headline: 'Managing General Partner @ Apex Vanguard Capital',
    biography: 'Backing transformational Series A & B founders across applied frontier robotics, defense tech, and autonomous systems.',
    location: 'New York, NY',
    interests: ['Venture Capital', 'Autonomous Systems', 'Robotics', 'DeepTech'],
    tripleMotiveHandle: 'marcus',
    isVerified: true,
    status: 'active',
  },
  {
    id: '44444444-4444-4444-4444-444444444444',
    fullName: 'Sophia Lin, MD',
    avatarUrl: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=200&auto=format&fit=crop&q=80',
    headline: 'President & CEO @ ChronoHealth Longevity',
    biography: 'Developing clinical-grade cellular rejuvenation therapies. Board Director at Longevity Science Foundation.',
    location: 'Zurich, Switzerland',
    interests: ['Longevity', 'Cellular Biology', 'BioTech', 'Clinical Science'],
    tripleMotiveHandle: 'sophia',
    isVerified: true,
    status: 'active',
  },
  {
    id: '55555555-5555-5555-5555-555555555555',
    fullName: 'David Thorne',
    avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&auto=format&fit=crop&q=80',
    headline: 'Chief Technology Officer @ NeuralMesh Labs',
    biography: 'Architecting ultra-low latency multimodal model inference engines. Ex-DeepMind Lead Research Scientist.',
    location: 'London, UK',
    interests: ['Applied AI', 'Inference Systems', 'Distributed Systems', 'DeepTech'],
    tripleMotiveHandle: 'david',
    isVerified: true,
    status: 'active',
  },
];

const NetworkContext = createContext<NetworkContextType | undefined>(undefined);

export const NetworkProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [directory, setDirectory] = useState<Profile[]>(INITIAL_DIRECTORY_MEMBERS);
  const [connections, setConnections] = useState<Connection[]>([
    {
      id: 'conn-demo-1',
      userAId: '11111111-1111-1111-1111-111111111111',
      userBId: '22222222-2222-2222-2222-222222222222',
      connectedAt: new Date(Date.now() - 86400000 * 14).toISOString(),
      partnerProfile: INITIAL_DIRECTORY_MEMBERS[1],
    },
  ]);

  const [incomingRequests, setIncomingRequests] = useState<ConnectionRequest[]>([
    {
      id: 'req-in-1',
      senderId: '33333333-3333-3333-3333-333333333333',
      receiverId: user?.id || '11111111-1111-1111-1111-111111111111',
      status: 'pending',
      note: 'Alex, great to see you on Triple Motive. Would love to sync on your latest quantum infrastructure roadmap.',
      createdAt: new Date(Date.now() - 3600000 * 4).toISOString(),
      senderProfile: INITIAL_DIRECTORY_MEMBERS[2],
    },
  ]);

  const [outgoingRequests, setOutgoingRequests] = useState<ConnectionRequest[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedInterestFilter, setSelectedInterestFilter] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const refreshNetwork = async () => {
    if (!isSupabaseConfigured || !user) return;
    setIsLoading(true);
    try {
      // 1. Fetch Approved Directory Profiles
      const { data: profiles } = await supabase
        .from('profiles')
        .select('*')
        .eq('status', 'active');

      if (profiles && profiles.length > 0) {
        setDirectory(
          profiles.map((p) => ({
            id: p.id,
            fullName: p.full_name,
            avatarUrl: p.avatar_url,
            headline: p.headline,
            biography: p.biography,
            location: p.location,
            interests: p.interests || [],
            tripleMotiveHandle: p.triple_motive_handle,
            isVerified: Boolean(p.is_verified),
            status: p.status,
          }))
        );
      }

      // 2. Fetch Connections
      const { data: conns } = await supabase
        .from('connections')
        .select('*')
        .or(`user_a_id.eq.${user.id},user_b_id.eq.${user.id}`);

      if (conns) {
        setConnections(
          conns.map((c) => ({
            id: c.id,
            userAId: c.user_a_id,
            userBId: c.user_b_id,
            connectedAt: c.connected_at,
          }))
        );
      }

      // 3. Fetch Incoming Requests
      const { data: incoming } = await supabase
        .from('connection_requests')
        .select('*')
        .eq('receiver_id', user.id)
        .eq('status', 'pending');

      if (incoming) {
        setIncomingRequests(
          incoming.map((r) => ({
            id: r.id,
            senderId: r.sender_id,
            receiverId: r.receiver_id,
            status: r.status,
            note: r.note,
            createdAt: r.created_at,
          }))
        );
      }

      // 4. Fetch Outgoing Requests
      const { data: outgoing } = await supabase
        .from('connection_requests')
        .select('*')
        .eq('sender_id', user.id)
        .eq('status', 'pending');

      if (outgoing) {
        setOutgoingRequests(
          outgoing.map((r) => ({
            id: r.id,
            senderId: r.sender_id,
            receiverId: r.receiver_id,
            status: r.status,
            note: r.note,
            createdAt: r.created_at,
          }))
        );
      }
    } catch (err) {
      console.warn('Network sync note:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    refreshNetwork();
  }, [user?.id]);

  const sendRequest = async (receiverId: string, note?: string) => {
    if (!user) return { success: false, error: 'Authentication required' };
    if (user.id === receiverId) return { success: false, error: 'Cannot connect to self' };

    if (isSupabaseConfigured) {
      const { data, error } = await supabase.rpc('send_connection_request', {
        p_receiver_id: receiverId,
        p_note: note || null,
      });

      if (error) return { success: false, error: error.message };

      const newReq: ConnectionRequest = {
        id: data.request_id,
        senderId: user.id,
        receiverId,
        status: 'pending',
        note,
        createdAt: new Date().toISOString(),
        receiverProfile: directory.find((p) => p.id === receiverId),
      };

      setOutgoingRequests((prev) => [...prev, newReq]);
      return { success: true };
    }

    // Local state mock
    const targetMember = directory.find((p) => p.id === receiverId);
    const mockReq: ConnectionRequest = {
      id: `req-${Date.now()}`,
      senderId: user.id,
      receiverId,
      status: 'pending',
      note,
      createdAt: new Date().toISOString(),
      receiverProfile: targetMember,
    };

    setOutgoingRequests((prev) => [...prev, mockReq]);
    return { success: true };
  };

  const acceptRequest = async (requestId: string) => {
    const req = incomingRequests.find((r) => r.id === requestId);
    if (!req || !user) return { success: false, error: 'Request not found' };

    if (isSupabaseConfigured) {
      const { error } = await supabase.rpc('accept_connection_request', {
        p_request_id: requestId,
      });

      if (error) return { success: false, error: error.message };
    }

    setIncomingRequests((prev) => prev.filter((r) => r.id !== requestId));

    const senderProfile = directory.find((p) => p.id === req.senderId);
    const newConn: Connection = {
      id: `conn-${Date.now()}`,
      userAId: req.senderId < user.id ? req.senderId : user.id,
      userBId: req.senderId < user.id ? user.id : req.senderId,
      connectedAt: new Date().toISOString(),
      partnerProfile: senderProfile,
    };

    setConnections((prev) => [...prev, newConn]);
    return { success: true };
  };

  const declineRequest = async (requestId: string) => {
    if (isSupabaseConfigured) {
      const { error } = await supabase.rpc('decline_connection_request', {
        p_request_id: requestId,
      });
      if (error) return { success: false, error: error.message };
    }

    setIncomingRequests((prev) => prev.filter((r) => r.id !== requestId));
    return { success: true };
  };

  const cancelRequest = async (requestId: string) => {
    if (isSupabaseConfigured) {
      const { error } = await supabase.rpc('cancel_connection_request', {
        p_request_id: requestId,
      });
      if (error) return { success: false, error: error.message };
    }

    setOutgoingRequests((prev) => prev.filter((r) => r.id !== requestId));
    return { success: true };
  };

  const disconnectMember = async (connectionId: string) => {
    if (isSupabaseConfigured) {
      const { error } = await supabase.from('connections').delete().eq('id', connectionId);
      if (error) return { success: false, error: error.message };
    }

    setConnections((prev) => prev.filter((c) => c.id !== connectionId));
    return { success: true };
  };

  const getConnectionStatus = (memberId: string): 'connected' | 'pending_outgoing' | 'pending_incoming' | 'none' => {
    if (!user || user.id === memberId) return 'none';

    const isConnected = connections.some(
      (c) => (c.userAId === memberId && c.userBId === user.id) || (c.userBId === memberId && c.userAId === user.id)
    );
    if (isConnected) return 'connected';

    const isOutgoing = outgoingRequests.some((r) => r.receiverId === memberId && r.status === 'pending');
    if (isOutgoing) return 'pending_outgoing';

    const isIncoming = incomingRequests.some((r) => r.senderId === memberId && r.status === 'pending');
    if (isIncoming) return 'pending_incoming';

    return 'none';
  };

  return (
    <NetworkContext.Provider
      value={{
        directory,
        connections,
        incomingRequests,
        outgoingRequests,
        isLoading,
        searchQuery,
        setSearchQuery,
        selectedInterestFilter,
        setSelectedInterestFilter,
        sendRequest,
        acceptRequest,
        declineRequest,
        cancelRequest,
        disconnectMember,
        getConnectionStatus,
        refreshNetwork,
      }}
    >
      {children}
    </NetworkContext.Provider>
  );
};

export const useNetwork = () => {
  const context = useContext(NetworkContext);
  if (!context) {
    throw new Error('useNetwork must be used within a NetworkProvider');
  }
  return context;
};
