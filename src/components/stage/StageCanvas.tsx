import React, { useState } from 'react';
import {
  MessageSquare,
  Sparkles,
  Layers,
  ChevronDown,
  ChevronUp,
  X,
  Share2,
  Tv,
} from 'lucide-react';
import { useStream } from '../../context/StreamContext';
import { VideoPlayer } from './VideoPlayer';
import { InteractiveLayer } from '../interactive/InteractiveLayer';
import { LiveChat } from './LiveChat';
import { AudienceReactions } from './AudienceReactions';
import { Button } from '../common/Button';

export const StageCanvas: React.FC = () => {
  const { layoutMode, setLayoutMode, activeWidget } = useStream();
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [mobileActiveTab, setMobileActiveTab] = useState<'interactive' | 'chat'>('interactive');

  return (
    <div className="relative min-h-[calc(100vh-4rem)] bg-[#FAF9F6] p-3 sm:p-5 lg:p-6 flex flex-col justify-between font-sans">
      
      {/* Layout Content Container */}
      <div className="max-w-[1700px] mx-auto w-full flex-1 flex flex-col">
        
        {/* DESKTOP VIEW (> 1024px) */}
        <div className="hidden lg:flex flex-1 gap-5 xl:gap-6 min-h-[720px]">
          
          {layoutMode === 'split' && (
            <>
              {/* Left Pane: 60% Video Stream */}
              <div className="w-[58%] xl:w-[60%] flex flex-col gap-4">
                <div className="flex-1 min-h-[500px]">
                  <VideoPlayer />
                </div>
                {/* Bottom Stream Engagement Bar */}
                <div className="flex items-center justify-between px-2">
                  <AudienceReactions />
                  <Button
                    variant="glass"
                    size="sm"
                    onClick={() => setIsChatOpen(!isChatOpen)}
                    leftIcon={<MessageSquare className="h-4 w-4 text-solar-500" />}
                  >
                    {isChatOpen ? 'Hide Live Chat' : 'Show Live Chat'}
                  </Button>
                </div>
              </div>

              {/* Right Pane: 40% Interactive Widget Layer or Chat */}
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
            /* PiP / Overlay Mode: Interactive App is Main, Video is Floating Pill */
            <div className="relative w-full h-[760px]">
              {/* Full background interactive app */}
              <div className="w-full h-full">
                <InteractiveLayer />
              </div>

              {/* Floating PiP Video Bubble */}
              <div className="absolute bottom-6 right-6 w-96 h-60 z-30 rounded-2xl overflow-hidden shadow-2xl border-2 border-white ring-1 ring-slate-900/10">
                <VideoPlayer />
              </div>

              {/* Floating Reaction Bar */}
              <div className="absolute bottom-6 left-6 z-30">
                <AudienceReactions />
              </div>
            </div>
          )}

          {layoutMode === 'focus' && (
            /* Focus Mode: Video is Fullscreen, Interactive Drawer slides from side */
            <div className="w-full h-[760px] flex gap-5">
              <div className="flex-1 h-full flex flex-col gap-4">
                <div className="flex-1">
                  <VideoPlayer />
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
        <div className="flex lg:hidden flex-col gap-4 flex-1">
          {/* Fixed/Prominent Top Video Player */}
          <div className="w-full h-[280px] sm:h-[380px] shrink-0">
            <VideoPlayer />
          </div>

          {/* Reaction Bar */}
          <div className="flex items-center justify-between px-1">
            <AudienceReactions />
            <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200">
              <button
                onClick={() => setMobileActiveTab('interactive')}
                className={`px-3 py-1 text-xs font-semibold rounded-lg transition-all ${
                  mobileActiveTab === 'interactive'
                    ? 'bg-white text-solar-600 shadow-sm'
                    : 'text-slate-600'
                }`}
              >
                Interactive App
              </button>
              <button
                onClick={() => setMobileActiveTab('chat')}
                className={`px-3 py-1 text-xs font-semibold rounded-lg transition-all ${
                  mobileActiveTab === 'chat'
                    ? 'bg-white text-solar-600 shadow-sm'
                    : 'text-slate-600'
                }`}
              >
                Chat
              </button>
            </div>
          </div>

          {/* Swipeable / Tabbed Mobile Interactive Sheet */}
          <div className="flex-1 min-h-[440px]">
            {mobileActiveTab === 'interactive' ? (
              <InteractiveLayer />
            ) : (
              <LiveChat />
            )}
          </div>
        </div>

      </div>

    </div>
  );
};
