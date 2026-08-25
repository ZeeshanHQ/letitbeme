import React, { useState } from 'react';
import {
  MessageSquarePlus,
  ThumbsUp,
  CheckCircle2,
  ListTodo,
  Plus,
  Send,
  HelpCircle,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { Button } from '../common/Button';

interface QAItem {
  id: string;
  sender: string;
  question: string;
  upvotes: number;
  hasUpvoted: boolean;
  isAnswered: boolean;
  time: string;
}

interface AgendaItem {
  id: string;
  title: string;
  isDone: boolean;
}

export const LeadCaptureWidget: React.FC = () => {
  const { user } = useAuth();
  const [activeSubTab, setActiveSubTab] = useState<'qa' | 'agenda'>('qa');

  // Live Q&A questions state
  const [newQuestion, setNewQuestion] = useState('');
  const [questions, setQuestions] = useState<QAItem[]>([
    {
      id: 'qa-1',
      sender: user?.fullName || 'Participant',
      question: 'Can you share the slides and recorded link after this meeting?',
      upvotes: 3,
      hasUpvoted: false,
      isAnswered: false,
      time: 'Just now',
    },
  ]);

  // Meeting Agenda state
  const [newAgendaItem, setNewAgendaItem] = useState('');
  const [agenda, setAgenda] = useState<AgendaItem[]>([
    { id: '1', title: '1. Welcome & Meeting Overview', isDone: true },
    { id: '2', title: '2. Live Demo & Architecture Review', isDone: false },
    { id: '3', title: '3. Open Q&A & Action Items', isDone: false },
  ]);

  const handlePostQuestion = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newQuestion.trim()) return;

    const item: QAItem = {
      id: `qa-${Date.now()}`,
      sender: user?.fullName || 'Participant',
      question: newQuestion.trim(),
      upvotes: 1,
      hasUpvoted: true,
      isAnswered: false,
      time: 'Just now',
    };

    setQuestions([item, ...questions]);
    setNewQuestion('');
  };

  const handleToggleUpvote = (id: string) => {
    setQuestions(
      questions.map((q) => {
        if (q.id === id) {
          return {
            ...q,
            upvotes: q.hasUpvoted ? q.upvotes - 1 : q.upvotes + 1,
            hasUpvoted: !q.hasUpvoted,
          };
        }
        return q;
      })
    );
  };

  const handleToggleAgenda = (id: string) => {
    setAgenda(
      agenda.map((item) => (item.id === id ? { ...item, isDone: !item.isDone } : item))
    );
  };

  const handleAddAgenda = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAgendaItem.trim()) return;
    setAgenda([
      ...agenda,
      { id: String(Date.now()), title: newAgendaItem.trim(), isDone: false },
    ]);
    setNewAgendaItem('');
  };

  return (
    <div className="h-full flex flex-col justify-between space-y-3 font-sans text-left">
      {/* Sub-tab Switcher: Live Q&A vs Meeting Agenda */}
      <div className="flex items-center justify-between border-b border-slate-100 pb-2">
        <div className="flex items-center gap-1 bg-slate-100 p-0.5 rounded-xl text-xs font-semibold">
          <button
            type="button"
            onClick={() => setActiveSubTab('qa')}
            className={`px-3 py-1 rounded-lg transition-all cursor-pointer ${
              activeSubTab === 'qa'
                ? 'bg-white text-obsidian shadow-sm'
                : 'text-slate-500 hover:text-obsidian'
            }`}
          >
            Q&A ({questions.length})
          </button>
          <button
            type="button"
            onClick={() => setActiveSubTab('agenda')}
            className={`px-3 py-1 rounded-lg transition-all cursor-pointer ${
              activeSubTab === 'agenda'
                ? 'bg-white text-obsidian shadow-sm'
                : 'text-slate-500 hover:text-obsidian'
            }`}
          >
            Agenda ({agenda.filter((a) => a.isDone).length}/{agenda.length})
          </button>
        </div>

        <span className="text-[11px] text-slate-400 font-mono">
          {activeSubTab === 'qa' ? 'Live Audience Questions' : 'Session Checklist'}
        </span>
      </div>

      {/* Content View */}
      {activeSubTab === 'qa' ? (
        <div className="flex-1 flex flex-col justify-between space-y-3 overflow-hidden">
          {/* Questions List */}
          <div className="flex-1 overflow-y-auto space-y-2.5 pr-1">
            {questions.map((q) => (
              <div
                key={q.id}
                className="p-3 bg-slate-50 rounded-2xl border border-slate-200/90 space-y-1.5 animate-fade-in"
              >
                <div className="flex items-center justify-between text-[11px]">
                  <span className="font-semibold text-obsidian">{q.sender}</span>
                  <span className="text-slate-400 font-mono">{q.time}</span>
                </div>
                <p className="text-xs text-slate-700 font-normal leading-relaxed">
                  {q.question}
                </p>
                <div className="flex items-center justify-between pt-1">
                  <button
                    type="button"
                    onClick={() => handleToggleUpvote(q.id)}
                    className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                      q.hasUpvoted
                        ? 'bg-slate-900 text-white'
                        : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    <ThumbsUp className="h-3 w-3" />
                    <span>{q.upvotes}</span>
                  </button>
                  {q.isAnswered ? (
                    <span className="text-[10px] font-mono text-emerald-600 font-semibold">
                      ✓ Answered live
                    </span>
                  ) : (
                    <span className="text-[10px] text-slate-400">Open Question</span>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Ask Question Form */}
          <form onSubmit={handlePostQuestion} className="flex items-center gap-2 pt-2 border-t border-slate-100">
            <input
              type="text"
              required
              value={newQuestion}
              onChange={(e) => setNewQuestion(e.target.value)}
              placeholder="Ask a question to the meeting..."
              className="flex-1 px-3 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50/50 text-obsidian focus:bg-white focus:outline-none focus:border-slate-800 font-sans"
            />
            <Button
              type="submit"
              variant="primary"
              size="sm"
              className="rounded-xl px-3 py-2 text-xs font-semibold"
              disabled={!newQuestion.trim()}
              rightIcon={<Send className="h-3.5 w-3.5" />}
            >
              Ask
            </Button>
          </form>
        </div>
      ) : (
        /* Meeting Agenda Checklist */
        <div className="flex-1 flex flex-col justify-between space-y-3 overflow-hidden">
          <div className="flex-1 overflow-y-auto space-y-2 pr-1">
            {agenda.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => handleToggleAgenda(item.id)}
                className={`w-full p-3 rounded-2xl border text-left flex items-center gap-3 transition-all cursor-pointer ${
                  item.isDone
                    ? 'bg-slate-50 border-slate-200 text-slate-400 line-through'
                    : 'bg-white border-slate-200 text-obsidian hover:border-slate-300 font-medium'
                }`}
              >
                <div
                  className={`h-4 w-4 rounded-md border flex items-center justify-center shrink-0 ${
                    item.isDone ? 'bg-slate-900 border-slate-900 text-white' : 'border-slate-300 bg-white'
                  }`}
                >
                  {item.isDone && <CheckCircle2 className="h-3 w-3" />}
                </div>
                <span className="text-xs truncate">{item.title}</span>
              </button>
            ))}
          </div>

          {/* Add Agenda Item */}
          <form onSubmit={handleAddAgenda} className="flex items-center gap-2 pt-2 border-t border-slate-100">
            <input
              type="text"
              required
              value={newAgendaItem}
              onChange={(e) => setNewAgendaItem(e.target.value)}
              placeholder="Add meeting agenda topic..."
              className="flex-1 px-3 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50/50 text-obsidian focus:bg-white focus:outline-none focus:border-slate-800 font-sans"
            />
            <Button
              type="submit"
              variant="secondary"
              size="sm"
              className="rounded-xl px-3 py-2 text-xs font-semibold"
              disabled={!newAgendaItem.trim()}
              rightIcon={<Plus className="h-3.5 w-3.5" />}
            >
              Add
            </Button>
          </form>
        </div>
      )}
    </div>
  );
};
