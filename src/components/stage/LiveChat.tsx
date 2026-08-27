import React, { useState, useRef, useEffect } from 'react';
import { Send, Sparkles, Pin, MessageSquare, ArrowRight } from 'lucide-react';
import { useStream, InteractiveWidgetType } from '../../context/StreamContext';
import { Button } from '../common/Button';

export const LiveChat: React.FC = () => {
  const { messages, sendMessage, isPresenterRole, setActiveWidget } = useStream();
  const [inputText, setInputText] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;
    sendMessage(inputText.trim());
    setInputText('');
  };

  const pinnedMsg = messages.find((m) => m.pinnedAction);

  return (
    <div className="flex flex-col h-full bg-white rounded-3xl border border-slate-200/80 shadow-sm overflow-hidden font-sans text-left">
      {/* Chat Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100 bg-[#FAF9F6]">
        <div className="flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-solar-500 animate-pulse" />
          <span className="text-xs font-semibold text-obsidian">Live Stage Chat</span>
        </div>
        <span className="text-[10px] font-mono text-slate-400">Real-time WebRTC</span>
      </div>

      {/* Pinned Action Banner if present */}
      {pinnedMsg && pinnedMsg.pinnedAction && (
        <div className="px-4 py-2 bg-solar-50 border-b border-solar-100 flex items-center justify-between gap-3 animate-fade-in">
          <div className="flex items-center gap-2 overflow-hidden">
            <Pin className="h-3.5 w-3.5 text-solar-500 shrink-0" />
            <span className="text-xs font-medium text-obsidian truncate">
              {pinnedMsg.pinnedAction.label}
            </span>
          </div>
          <button
            onClick={() => setActiveWidget(pinnedMsg.pinnedAction?.type as InteractiveWidgetType)}
            className="px-2.5 py-1 rounded-lg bg-solar-500 text-white text-[11px] font-semibold shrink-0 shadow-sm hover:bg-solar-600 transition-all flex items-center gap-1 cursor-pointer"
          >
            <span>Open</span>
            <ArrowRight className="h-3 w-3" />
          </button>
        </div>
      )}

      {/* Messages List (Zero Fake Comments) */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {messages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center p-6 text-slate-400 space-y-2">
            <div className="h-10 w-10 rounded-full bg-slate-50 border border-slate-200 flex items-center justify-center text-slate-400">
              <MessageSquare className="h-5 w-5" />
            </div>
            <p className="text-xs font-light">No messages yet. Send a message to start the conversation!</p>
          </div>
        ) : (
          messages.map((msg) => (
            <div key={msg.id} className="flex items-start gap-2.5 text-xs animate-fade-in">
              <div className="h-6 w-6 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 border border-slate-200 text-white font-bold text-[10px] flex items-center justify-center shrink-0 mt-0.5 shadow-sm select-none">
                {(msg.sender || 'M').charAt(0).toUpperCase()}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5 mb-0.5">
                  <span className="font-semibold text-obsidian text-[11px] truncate">
                    {msg.sender}
                  </span>
                  {msg.badge && (
                    <span className="px-1.5 py-0.2 rounded text-[9px] font-mono font-bold bg-solar-50 text-solar-600 border border-solar-200">
                      {msg.badge}
                    </span>
                  )}
                  <span className="text-[10px] text-slate-400 font-mono ml-auto">
                    {msg.timestamp}
                  </span>
                </div>
                <p className="text-slate-600 bg-slate-50/80 p-2 rounded-xl border border-slate-100/80 leading-relaxed break-words">
                  {msg.message}
                </p>
              </div>
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Chat Input Box */}
      <form onSubmit={handleSend} className="p-3 border-t border-slate-100 bg-white flex items-center gap-2">
        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder="Type message to all attendees..."
          className="flex-1 px-3.5 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50/50 text-obsidian focus:bg-white focus:border-solar-500 focus:outline-none font-sans"
        />
        <Button
          type="submit"
          variant="primary"
          size="sm"
          className="rounded-xl px-3 py-2 text-xs font-semibold"
          disabled={!inputText.trim()}
          rightIcon={<Send className="h-3.5 w-3.5" />}
        >
          Send
        </Button>
      </form>
    </div>
  );
};
