import React, { useState } from 'react';
import {
  MessageSquarePlus,
  ThumbsUp,
  CheckCircle2,
  ListTodo,
  Plus,
  Send,
  HelpCircle,
  Trash2,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

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

  // Live Q&A questions state (Clean initial state: ZERO fake questions)
  const [newQuestion, setNewQuestion] = useState('');
  const [questions, setQuestions] = useState<QAItem[]>([]);

  // Meeting Agenda state
  const [newAgendaItem, setNewAgendaItem] = useState('');
  const [agenda, setAgenda] = useState<AgendaItem[]>([
    { id: '1', title: '1. Welcome & Goals', isDone: false },
    { id: '2', title: '2. Live Demo & Interactive Review', isDone: false },
    { id: '3', title: '3. Q&A & Action Items', isDone: false },
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

  const handleToggleAnswered = (id: string) => {
    setQuestions(
      questions.map((q) => (q.id === id ? { ...q, isAnswered: !q.isAnswered } : q))
    );
  };

  const handleDeleteQuestion = (id: string) => {
    setQuestions(questions.filter((q) => q.id !== id));
  };

  const handleAddAgendaItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAgendaItem.trim()) return;
    setAgenda([
      ...agenda,
      { id: `agenda-${Date.now()}`, title: newAgendaItem.trim(), isDone: false },
    ]);
    setNewAgendaItem('');
  };

  const handleToggleAgenda = (id: string) => {
    setAgenda(
      agenda.map((item) => (item.id === id ? { ...item, isDone: !item.isDone } : item))
    );
  };

  const handleDeleteAgenda = (id: string) => {
    setAgenda(agenda.filter((item) => item.id !== id));
  };

  return (
    <div className="h-full flex flex-col justify-between bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden font-sans text-left">
      {/* Top Header & Sub-Tab Switcher */}
      <div className="p-3 bg-[#FAF9F6] border-b border-slate-200/80 flex items-center justify-between gap-2 shrink-0">
        <div className="flex items-center gap-1 bg-slate-100 p-0.5 rounded-xl border border-slate-200">
          <button
            type="button"
            onClick={() => setActiveSubTab('qa')}
            className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              activeSubTab === 'qa'
                ? 'bg-white text-slate-900 shadow-sm'
                : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            Q&amp;A ({questions.length})
          </button>
          <button
            type="button"
            onClick={() => setActiveSubTab('agenda')}
            className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              activeSubTab === 'agenda'
                ? 'bg-white text-slate-900 shadow-sm'
                : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            Agenda ({agenda.filter((a) => a.isDone).length}/{agenda.length})
          </button>
        </div>

        <span className="text-[11px] font-mono text-slate-400">
          {activeSubTab === 'qa' ? 'Live Audience Questions' : 'Session Checklist'}
        </span>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-slate-50/50">
        {activeSubTab === 'qa' ? (
          /* Q&A Sub-Tab */
          <div className="space-y-3">
            {questions.length === 0 ? (
              <div className="py-12 px-4 text-center space-y-3">
                <div className="h-12 w-12 rounded-2xl bg-blue-50 text-[#0084FF] flex items-center justify-center mx-auto">
                  <HelpCircle className="h-6 w-6" />
                </div>
                <h4 className="text-sm font-semibold text-slate-800">No questions asked yet</h4>
                <p className="text-xs text-slate-400 max-w-xs mx-auto">
                  Be the first to ask! Attendees and hosts can post questions and vote them up.
                </p>
              </div>
            ) : (
              questions.map((q) => (
                <div
                  key={q.id}
                  className={`p-3.5 rounded-2xl border transition-all ${
                    q.isAnswered
                      ? 'bg-emerald-50/60 border-emerald-200/80 opacity-75'
                      : 'bg-white border-slate-200/90 shadow-sm hover:border-blue-300'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="space-y-1 flex-1">
                      <div className="flex items-center gap-2 text-xs">
                        <span className="font-semibold text-slate-900">{q.sender}</span>
                        <span className="text-[10px] text-slate-400 font-mono">{q.time}</span>
                      </div>
                      <p className="text-xs text-slate-700 leading-relaxed font-medium">
                        {q.question}
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleToggleUpvote(q.id)}
                      className={`flex items-center gap-1 px-2.5 py-1 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
                        q.hasUpvoted
                          ? 'bg-blue-50 border-blue-300 text-[#0084FF]'
                          : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                      }`}
                    >
                      <ThumbsUp className="h-3 w-3" />
                      <span>{q.upvotes}</span>
                    </button>
                  </div>

                  <div className="flex items-center justify-between pt-2.5 mt-2 border-t border-slate-100 text-[11px]">
                    <button
                      type="button"
                      onClick={() => handleToggleAnswered(q.id)}
                      className={`flex items-center gap-1 font-medium cursor-pointer ${
                        q.isAnswered ? 'text-emerald-700' : 'text-slate-400 hover:text-slate-700'
                      }`}
                    >
                      <CheckCircle2 className="h-3.5 w-3.5" />
                      <span>{q.isAnswered ? 'Answered' : 'Mark as Answered'}</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleDeleteQuestion(q.id)}
                      className="text-slate-300 hover:text-rose-600 transition-colors p-1 cursor-pointer"
                      title="Delete Question"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        ) : (
          /* Agenda Sub-Tab */
          <div className="space-y-2.5">
            {agenda.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between p-3 rounded-2xl bg-white border border-slate-200/90 shadow-sm"
              >
                <button
                  type="button"
                  onClick={() => handleToggleAgenda(item.id)}
                  className="flex items-center gap-3 text-left cursor-pointer flex-1"
                >
                  <div
                    className={`h-5 w-5 rounded-lg border flex items-center justify-center transition-all ${
                      item.isDone
                        ? 'bg-[#0084FF] border-[#0084FF] text-white'
                        : 'border-slate-300 bg-slate-50'
                    }`}
                  >
                    {item.isDone && <CheckCircle2 className="h-3.5 w-3.5" />}
                  </div>
                  <span
                    className={`text-xs font-medium ${
                      item.isDone ? 'line-through text-slate-400' : 'text-slate-800'
                    }`}
                  >
                    {item.title}
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => handleDeleteAgenda(item.id)}
                  className="text-slate-300 hover:text-rose-500 p-1 transition-colors cursor-pointer"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Bottom Input Action */}
      <div className="p-3 bg-white border-t border-slate-200/80 shrink-0">
        {activeSubTab === 'qa' ? (
          <form onSubmit={handlePostQuestion} className="flex gap-2">
            <input
              type="text"
              value={newQuestion}
              onChange={(e) => setNewQuestion(e.target.value)}
              placeholder="Ask a question to the meeting..."
              className="flex-1 px-3 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50 text-slate-900 focus:bg-white focus:border-[#0084FF] focus:outline-none"
            />
            <button
              type="submit"
              disabled={!newQuestion.trim()}
              className="px-4 py-2 rounded-xl text-xs font-semibold bg-[#0084FF] hover:bg-[#0074E0] text-white disabled:opacity-40 transition-all flex items-center gap-1.5 cursor-pointer shadow-sm shadow-blue-500/20"
            >
              <span>Ask</span>
              <Send className="h-3 w-3" />
            </button>
          </form>
        ) : (
          <form onSubmit={handleAddAgendaItem} className="flex gap-2">
            <input
              type="text"
              value={newAgendaItem}
              onChange={(e) => setNewAgendaItem(e.target.value)}
              placeholder="Add agenda topic..."
              className="flex-1 px-3 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50 text-slate-900 focus:bg-white focus:border-[#0084FF] focus:outline-none"
            />
            <button
              type="submit"
              disabled={!newAgendaItem.trim()}
              className="px-4 py-2 rounded-xl text-xs font-semibold bg-[#0084FF] hover:bg-[#0074E0] text-white disabled:opacity-40 transition-all flex items-center gap-1.5 cursor-pointer shadow-sm shadow-blue-500/20"
            >
              <Plus className="h-3.5 w-3.5" />
              <span>Add</span>
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
