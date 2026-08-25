import React from 'react';
import { Sparkles } from 'lucide-react';
import { useStream } from '../../context/StreamContext';
import { SUPPORTED_LANGUAGES } from '../../data/mockData';

export const SubtitleOverlay: React.FC = () => {
  const { latestSubtitle, isAiTranslationActive, currentLanguage } = useStream();

  if (!isAiTranslationActive || !latestSubtitle) {
    return null;
  }

  const langObj = SUPPORTED_LANGUAGES.find((l) => l.code === currentLanguage);

  return (
    <div className="absolute bottom-20 left-4 right-4 z-20 flex justify-center pointer-events-none">
      <div className="max-w-xl bg-obsidian/90 backdrop-blur-md text-white px-4 py-2 rounded-2xl border border-solar-500/30 shadow-2xl animate-fade-in pointer-events-auto">
        <div className="flex items-center justify-between gap-3 mb-1">
          <div className="flex items-center gap-1.5 text-[10px] font-mono text-solar-300">
            <Sparkles className="h-3 w-3 text-solar-400" />
            <span className="font-semibold">AI Live Translation</span>
            <span className="text-white/40">•</span>
            <span>{langObj?.flag} {langObj?.name}</span>
          </div>
          <span className="text-[10px] text-white/50 font-mono">
            {latestSubtitle.timestamp}
          </span>
        </div>

        <p className="text-xs sm:text-sm font-medium text-slate-100 leading-snug">
          {latestSubtitle.translatedText}
        </p>
      </div>
    </div>
  );
};
