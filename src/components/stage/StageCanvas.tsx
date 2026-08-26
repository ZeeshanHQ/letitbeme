import React, { useState, useEffect } from 'react';
import {
  MessageSquare,
  Layers,
} from 'lucide-react';
import { useStream } from '../../context/StreamContext';
import { useAuth } from '../../context/AuthContext';
import { VideoPlayer } from './VideoPlayer';
import { InteractiveLayer } from '../interactive/InteractiveLayer';
import { LiveChat } from './LiveChat';
import { AudienceReactions } from './AudienceReactions';
import { Button } from '../common/Button';
import { RoomNotFound } from './RoomNotFound';
import { supabase, isSupabaseConfigured } from '../../lib/supabase';

export const StageCanvas: React.FC = () => {
  const { layoutMode, setLayoutMode, isGuestJoined, activeWidget } = useStream();
  const { user } = useAuth();
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [mobileActiveTab, setMobileActiveTab] = useState<'interactive' | 'chat'>('interactive');
  
  // Room validation check
  const [isRoomValid, setIsRoomValid] = useState<boolean | null>(null);
  const [roomSlug, setRoomSlug] = useState<string>('');

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const roomParam = params.get('room');
    
    if (!roomParam) {
      setIsRoomValid(true);
      return;
    }

    setRoomSlug(roomParam);

    if (user?.customSlug && user.customSlug.toLowerCase() === roomParam.toLowerCase()) {
      setIsRoomValid(true);
      return;
    }

    const checkRoom = async () => {
      if (!isSupabaseConfigured) {
        setIsRoomValid(true);
        return;
      }

      try {
        const { data: userMatch } = await supabase
          .from('letitbeme_users')
          .select('id')
          .eq('custom_slug', roomParam.toLowerCase().trim())
          .maybeSingle();

        if (userMatch) {
          setIsRoomValid(true);
          return;
        }

        const { data: roomMatch } = await supabase
          .from('letitbeme_rooms')
          .select('room_slug')
          .eq('room_slug', roomParam.toLowerCase().trim())
          .maybeSingle();

        if (roomMatch) {
          setIsRoomValid(true);
        } else {
          setIsRoomValid(false);
        }
      } catch {
        setIsRoomValid(true);
      }
    };

    checkRoom();
  }, [user?.customSlug]);

  if (isRoomValid === false) {
    return (
      <RoomNotFound
        roomSlug={roomSlug}
        onGoHome={() => {
          window.location.href = '/';
        }}
        onCreateMeeting={() => {
          window.location.href = '/?view=presenter';
        }}
      />
    );
  }

  // 1. UNADMITTED GUEST EXPERIENCE (Before host admits)
  // Shows ONLY the clean Pre-Join / Waiting Lobby view (Zoom / Google Meet Standard)
  if (!isGuestJoined) {
    return (
      <div className="min-h-[calc(100vh-4rem)] bg-[#FAF9F6] p-4 sm:p-6 lg:p-8 flex items-center justify-center font-['Plus_Jakarta_Sans',sans-serif]">
        <div className="w-full max-w-lg animate-fade-in">
          <VideoPlayer showHostControls={false} />
        </div>
      </div>
    );
  }

  // 2. ADMITTED GUEST EXPERIENCE (Full In-Meeting Interactive Stage)
  return (
    <div className="relative min-h-[calc(100vh-4rem)] bg-[#FAF9F6] p-2.5 sm:p-5 lg:p-6 flex flex-col justify-between font-['Plus_Jakarta_Sans',sans-serif]">
      
      {/* Ultra-Wide Premium Canvas Layout Container */}
      <div className="max-w-[1780px] 2xl:max-w-[1900px] mx-auto w-full flex-1 flex flex-col">
        
        {/* DESKTOP VIEW (> 1024px) */}
        <div className="hidden lg:flex flex-1 gap-5 xl:gap-6 min-h-[720px]">
          
          {layoutMode === 'split' && (
            <>
              {/* Left Pane: 58% Video Stream (Audience View) */}
              <div className="w-[58%] xl:w-[60%] flex flex-col gap-4">
                <div className="flex-1 min-h-[500px]">
                  <VideoPlayer showHostControls={false} />
                </div>
                {/* Bottom Stream Engagement Bar */}
                <div className="flex items-center justify-between px-2">
                  <AudienceReactions />
                  <Button
                    variant="glass"
                    size="sm"
                    onClick={() => setIsChatOpen(!isChatOpen)}
                    leftIcon={<MessageSquare className="h-4 w-4 text-[#0084FF]" />}
                  >
                    {isChatOpen ? 'Hide Live Chat' : 'Show Live Chat'}
                  </Button>
                </div>
              </div>

              {/* Right Pane: 42% Interactive Widget Layer or Chat */}
              <div className="w-[42%] xl:w-[40%] flex flex-col gap-4">
                {isChatOpen ? (
                  <div className="h-full grid grid-rows-2 gap-4">
                    <div className="h-full">
                      <InteractiveLayer />
                    </div>
                    <div className="h-full">
                      <LiveChat />
                    </div>
                  </div>
                ) : (
                  <div className="h-full">
                    <InteractiveLayer />
                  </div>
                )}
              </div>
            </>
          )}

          {layoutMode === 'pip' && (
            <div className="relative w-full h-[760px]">
              <div className="w-full h-full">
                <InteractiveLayer />
              </div>
              <div className="absolute bottom-6 right-6 w-96 h-60 z-30 rounded-2xl overflow-hidden shadow-2xl border-2 border-white ring-1 ring-slate-900/10">
                <VideoPlayer showHostControls={false} />
              </div>
              <div className="absolute bottom-6 left-6 z-30">
                <AudienceReactions />
              </div>
            </div>
          )}

          {layoutMode === 'focus' && (
            <div className="w-full h-[760px] flex gap-5">
              <div className="flex-1 h-full flex flex-col gap-4">
                <div className="flex-1">
                  <VideoPlayer showHostControls={false} />
                </div>
                <div className="flex items-center justify-between px-2">
                  <AudienceReactions />
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={() => setLayoutMode('split')}
                    leftIcon={<Layers className="h-4 w-4" />}
                  >
                    Open Interactive Split View
                  </Button>
                </div>
              </div>
            </div>
          )}

        </div>

        {/* MOBILE & TABLET STACKED VIEW (< 1024px) */}
        <div className="flex lg:hidden flex-col gap-3.5 flex-1">
          
          {/* Responsive Mobile Video Player Container */}
          <div className="w-full min-h-[260px] sm:min-h-[360px] flex flex-col shrink-0">
            <VideoPlayer showHostControls={false} />
          </div>

          {/* Audience Reaction Emojis & Segmented Tab Switcher */}
          <div className="flex items-center justify-between gap-2 px-1">
            <AudienceReactions />
            
            <div className="flex items-center bg-slate-200/80 p-1 rounded-2xl border border-slate-200 text-xs font-semibold">
              <button
                type="button"
                onClick={() => setMobileActiveTab('interactive')}
                className={`px-3 py-1.5 rounded-xl transition-all cursor-pointer ${
                  mobileActiveTab === 'interactive'
                    ? 'bg-white text-[#0084FF] shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                App ({activeWidget})
              </button>
              <button
                type="button"
                onClick={() => setMobileActiveTab('chat')}
                className={`px-3 py-1.5 rounded-xl transition-all cursor-pointer ${
                  mobileActiveTab === 'chat'
                    ? 'bg-white text-[#0084FF] shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Live Chat
              </button>
            </div>
          </div>

          {/* Interactive Widget / Live Chat Active Mobile Tab */}
          <div className="flex-1 min-h-[420px] bg-white rounded-3xl border border-slate-200/80 shadow-sm p-3 sm:p-4 overflow-hidden">
            {mobileActiveTab === 'interactive' ? (
              <InteractiveLayer />
            ) : (
              <div className="h-[420px]">
                <LiveChat />
              </div>
            )}
          </div>
        </div>

      </div>

    </div>
  );
};
