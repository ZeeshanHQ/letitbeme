import React from 'react';
import { Globe, Check, Sparkles } from 'lucide-react';
import { useStream, SupportedLanguage } from '../../context/StreamContext';

export const LanguageSelector: React.FC = () => {
  const {
    currentLanguage,
    setLanguage,
    isAiTranslationActive,
    toggleAiTranslation,
  } = useStream();

  const languages: { code: SupportedLanguage; label: string; flag: string }[] = [
    { code: 'en', label: 'English (Original)', flag: '🇺🇸' },
    { code: 'es', label: 'Español (Spanish)', flag: '🇪🇸' },
    { code: 'ja', label: '日本語 (Japanese)', flag: '🇯🇵' },
    { code: 'fr', label: 'Français (French)', flag: '🇫🇷' },
    { code: 'de', label: 'Deutsch (German)', flag: '🇩🇪' },
    { code: 'zh', label: '中文 (Mandarin)', flag: '🇨🇳' },
    { code: 'pt', label: 'Português (Portuguese)', flag: '🇧🇷' },
    { code: 'ar', label: 'العربية (Arabic)', flag: '🇸🇦' },
    { code: 'hi', label: 'हिन्दी (Hindi)', flag: '🇮🇳' },
  ];

  return (
    <div className="flex items-center gap-2 p-1.5 bg-white/90 backdrop-blur-md rounded-2xl border border-slate-200/80 shadow-sm text-xs font-sans">
      <button
        onClick={toggleAiTranslation}
        className={`px-2.5 py-1 rounded-xl font-medium transition-all flex items-center gap-1.5 ${
          isAiTranslationActive
            ? 'bg-indigo-50 text-indigo-700 border border-indigo-200'
            : 'bg-slate-100 text-slate-500'
        }`}
        title="Toggle Real-Time AI Multilingual Translation"
      >
        <Sparkles className="h-3 w-3 text-indigo-600 animate-pulse" />
        <span className="font-semibold text-[11px]">AI Live Subtitles</span>
      </button>

      <div className="flex items-center gap-1 pl-1 border-l border-slate-200">
        <Globe className="h-3.5 w-3.5 text-slate-400" />
        <select
          value={currentLanguage}
          onChange={(e) => setLanguage(e.target.value as SupportedLanguage)}
          className="bg-transparent border-none text-xs font-medium text-slate-800 focus:outline-none cursor-pointer pr-1"
        >
          {languages.map((l) => (
            <option key={l.code} value={l.code}>
              {l.flag} {l.label}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};
