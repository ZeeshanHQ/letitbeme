import React, { useState } from 'react';
import {
  ArrowRight,
  Radio,
  Sparkles,
  Zap,
  ChevronDown,
} from 'lucide-react';
import { Button } from '../common/Button';
import { VideoPlayer } from '../stage/VideoPlayer';
import { InteractiveLayer } from '../interactive/InteractiveLayer';

interface HeroSectionProps {
  onEnterStage: () => void;
  onEnterPresenter: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ onEnterStage, onEnterPresenter }) => {
  const [promptText, setPromptText] = useState('Launch interactive webinar with in-stream sandbox & live AI translation');

  const scrollToPreview = () => {
    const previewEl = document.getElementById('stage-preview-section');
    if (previewEl) {
      previewEl.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="relative w-full bg-white font-heading overflow-hidden">
      
      {/* 1. PRIMARY HERO VIEWPORT (Full Screen Height, Perfectly Centered) */}
      <div className="min-h-[calc(100vh-4rem)] flex flex-col justify-center items-center px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto text-center py-12 relative">
        <div className="space-y-6 max-w-4xl mx-auto">
          
          {/* Top Pill */}
          <div>
            <div className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-slate-50 border border-slate-200 shadow-sm text-xs font-semibold text-obsidian">
              <span className="flex h-2 w-2 rounded-full bg-solar-500 animate-pulse" />
              <span>Interactive Live Video Infrastructure</span>
              <span className="text-slate-300">•</span>
              <span className="text-solar-600 font-mono">0% Platform Cuts</span>
            </div>
          </div>

          {/* Main Title */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-heading font-bold text-obsidian tracking-tight leading-[1.12]">
            Interactive live streaming{' '}
            <span className="font-light text-slate-400">that keeps buyers inside the video.</span>
          </h1>
          
          {/* Subtitle */}
          <p className="text-base sm:text-lg text-slate-500 max-w-2xl mx-auto font-sans font-normal leading-relaxed">
            Eliminate link drop-off. LetItBeMe embeds live apps, interactive forms, and instant in-stream checkouts directly alongside your 1080p60 WebRTC video broadcast.
          </p>

          {/* Interactive Stream Prompt Box */}
          <div className="max-w-2xl mx-auto pt-2">
            <div className="bg-white rounded-2xl border border-slate-200/90 shadow-[0_8px_30px_rgb(0,0,0,0.05)] p-3 sm:p-4 text-left transition-all hover:border-solar-400">
              <div className="flex items-center justify-between gap-3 mb-2">
                <input
                  type="text"
                  value={promptText}
                  onChange={(e) => setPromptText(e.target.value)}
                  className="w-full text-xs sm:text-sm font-sans text-obsidian bg-transparent border-none focus:outline-none placeholder-slate-400"
                  placeholder="Describe your live broadcast or interactive demo..."
                />
                <button
                  type="button"
                  onClick={onEnterStage}
                  className="h-8 w-8 sm:h-9 sm:w-9 rounded-xl bg-gradient-to-b from-[#FF7A1A] via-[#FF6B00] to-[#E65100] text-white flex items-center justify-center shrink-0 shadow-[0_3px_10px_rgba(255,107,0,0.4),inset_0_1px_1px_rgba(255,255,255,0.4)] hover:shadow-[0_4px_14px_rgba(255,107,0,0.5)] transition-all cursor-pointer"
                  title="Test Live Stage Preview"
                >
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>

              <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-100 text-[11px] text-slate-400 font-mono">
                <div className="flex items-center gap-2.5">
                  <span className="flex items-center gap-1 text-solar-600 font-semibold font-sans">
                    <span className="h-1.5 w-1.5 rounded-full bg-solar-500 animate-pulse" />
                    WebRTC &lt;85ms
                  </span>
                  <span>•</span>
                  <span>Zero Tab Redirects</span>
                  <span>•</span>
                  <span>AI Live Subtitles</span>
                </div>
                <span className="text-slate-400 hidden sm:inline">100% Free Core</span>
              </div>
            </div>
          </div>

          {/* 3D Glassmorphic Action CTAs */}
          <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
            <Button
              variant="primary"
              size="md"
              onClick={onEnterStage}
              className="rounded-full px-7 py-3 text-xs sm:text-sm shadow-solar-sm hover:shadow-solar-md font-semibold"
              rightIcon={<ArrowRight className="h-4 w-4" />}
            >
              Test Live Stage Experience
            </Button>
            <Button
              variant="secondary"
              size="md"
              onClick={onEnterPresenter}
              className="rounded-full px-7 py-3 text-xs sm:text-sm font-semibold border-slate-200"
              leftIcon={<Radio className="h-4 w-4 text-solar-500" />}
            >
              Presenter Command Studio
            </Button>
          </div>

        </div>

        {/* Scroll Indicator Prompt */}
        <button
          type="button"
          onClick={scrollToPreview}
          className="absolute bottom-6 flex flex-col items-center gap-1 text-[11px] font-mono text-slate-400 hover:text-obsidian transition-colors cursor-pointer"
        >
          <span>Scroll to explore live stage preview</span>
          <ChevronDown className="h-4 w-4 animate-bounce text-solar-500" />
        </button>
      </div>

      {/* 2. FULL DEDICATED STAGE PREVIEW SECTION (Below the fold) */}
      <div id="stage-preview-section" className="py-20 bg-slate-50/50 border-t border-slate-100">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6 text-center">
          
          <div className="max-w-2xl mx-auto space-y-2">
            <h2 className="text-2xl sm:text-3xl font-heading font-bold text-obsidian tracking-tight">
              Live In-Stream Interactive Experience
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 font-sans">
              Experience the dual-pane WebRTC broadcast alongside live 1-click passes, voting polls, and sandboxed web apps.
            </p>
          </div>

          {/* macOS Preview Window */}
          <div className="rounded-[32px] p-3 sm:p-5 bg-white border border-slate-200/90 shadow-[0_25px_70px_-15px_rgba(0,0,0,0.09)] space-y-3.5 text-left">
            
            {/* Window Topbar */}
            <div className="flex items-center justify-between px-3 py-1.5 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="flex gap-1.5">
                  <div className="h-2.5 w-2.5 rounded-full bg-rose-400" />
                  <div className="h-2.5 w-2.5 rounded-full bg-amber-400" />
                  <div className="h-2.5 w-2.5 rounded-full bg-emerald-400" />
                </div>
                <div className="ml-3 px-3.5 py-0.5 rounded-full bg-slate-100 border border-slate-200 text-xs font-mono text-slate-600 flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-solar-500 animate-pulse" />
                  <span>live.letitbe.me/founder-masterclass</span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs font-mono text-emerald-700 font-semibold bg-emerald-50 px-3 py-0.5 rounded-full border border-emerald-200">
                  ● 1080p60 Live
                </span>
              </div>
            </div>

            {/* Stage Preview Dual Pane (Generous 520px Height) */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 min-h-[500px]">
              <div className="lg:col-span-7 h-full min-h-[400px]">
                <VideoPlayer />
              </div>
              <div className="lg:col-span-5 h-full min-h-[440px]">
                <InteractiveLayer />
              </div>
            </div>

          </div>
        </div>
      </div>

    </section>
  );
};
