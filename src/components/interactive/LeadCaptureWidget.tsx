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
  Lock,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useStream, AgendaItem } from '../../context/StreamContext';

interface QAItem {
  id: string;
  sender: string;
  question: string;
  upvotes: number;
  hasUpvoted: boolean;
  isAnswered: boolean;
  time: string;
}

export const LeadCaptureWidget: React.FC = () => {
  const { user } = useAuth();
  const {
    isPresenterRole,
    agenda,
    toggleAgendaItem,
    addAgendaItem,
    deleteAgendaItem,
  } = useStream();
  const isHost = user?.role === 'host' || isPresenterRole;

  const [activeSubTab, setActiveSubTab] = useState<'agenda' | 'qa'>('agenda');

  // Live Q&A questions state (Clean initial state: ZERO fake questions)
  const [newQuestion, setNewQuestion] = useState('');
  const [questions, setQuestions] = useState<QAItem[]>([]);

  // Meeting Agenda state
  const [newAgendaItem, setNewAgendaItem] = useState('');

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
    if (!isHost) return;
    setQuestions(
      questions.map((q) => (q.id === id ? { ...q, isAnswered: !q.isAnswered } : q))
    );
  };

  const handleDeleteQuestion = (id: string) => {
    if (!isHost) return;
    setQuestions(questions.filter((q) => q.id !== id));
  };

  const handleAddAgenda = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isHost || !newAgendaItem.trim()) return;
    addAgendaItem(newAgendaItem.trim());
    setNewAgendaItem('');
  };

  const completedCount = agenda.filter((i) => i.isDone).length;

  return (
    <div className="h-full flex flex-col justify-between space-y-3 font-sans text-left">
      {/* Sub-Tabs Switcher */}
      <div className="flex items-center justify-between gap-2 p-1 bg-slate-100/90 rounded-2xl border border-slate-200/80 shrink-0">
        <div className="flex items-center gap-1 flex-1">
          <button
            type="button"
            onClick={() => setActiveSubTab('agenda')}
            className={`flex-1 py-1.5 px-3 rounded-xl text-xs font-semibold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
              activeSubTab === 'agenda'
                ? 'bg-white text-slate-900 shadow-sm'
                : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            <ListTodo className="h-3.5 w-3.5" />
            <span>Agenda ({completedCount}/{agenda.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveSubTab('qa')}
            className={`flex-1 py-1.5 px-3 rounded-xl text-xs font-semibold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
              activeSubTab === 'qa'
                ? 'bg-white text-slate-900 shadow-sm'
                : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            <MessageSquarePlus className="h-3.5 w-3.5" />
            <span>Q&amp;A ({questions.length})</span>
          </button>
        </div>

        <span className="text-[10px] font-mono text-slate-400 hidden sm:inline pr-2">
          {activeSubTab === 'agenda' ? (isHost ? 'Host Manageable' : 'Session Checklist') : 'Open Q&A'}
        </span>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 overflow-y-auto space-y-3 pr-1">
        {activeSubTab === 'qa' ? (
          /* Live Q&A Questions */
          <div className="space-y-2.5">
            {questions.length === 0 ? (
              <div className="p-8 rounded-2xl bg-slate-50 border border-slate-200/80 text-center space-y-2">
                <div className="h-9 w-9 rounded-xl bg-blue-50 border border-blue-200 flex items-center justify-center mx-auto text-[#0084FF]">
                  <HelpCircle className="h-4 w-4" />
                </div>
                <h4 className="text-xs font-bold text-slate-800">No Questions Yet</h4>
                <p className="text-[11px] text-slate-500 font-light max-w-xs mx-auto">
                  Ask a question below. Top upvoted questions will be answered live by the host.
                </p>
              </div>
            ) : (
              questions.map((q) => (
                <div
                  key={q.id}
                  className={`p-3.5 rounded-2xl border transition-all space-y-2 ${
                    q.isAnswered
                      ? 'bg-emerald-50/40 border-emerald-200/80'
                      : 'bg-white border-slate-200/90 shadow-sm'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-[11px] font-bold text-slate-900">{q.sender}</span>
                        <span className="text-[10px] text-slate-400 font-mono">{q.time}</span>
                        {q.isAnswered && (
                          <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700 text-[10px] font-bold font-mono">
                            Answered
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-700 leading-relaxed font-normal">
                        {q.question}
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleToggleUpvote(q.id)}
                      className={`flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                        q.hasUpvoted
                          ? 'bg-[#0084FF] text-white shadow-sm'
                          : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                      }`}
                    >
                      <ThumbsUp className="h-3 w-3" />
                      <span>{q.upvotes}</span>
                    </button>
                  </div>

                  {isHost && (
                    <div className="flex items-center justify-end gap-2 pt-1 border-t border-slate-100">
                      <button
                        type="button"
                        onClick={() => handleToggleAnswered(q.id)}
                        className={`text-[11px] font-semibold flex items-center gap-1 cursor-pointer ${
                          q.isAnswered ? 'text-slate-400 hover:text-slate-600' : 'text-emerald-600 hover:text-emerald-700'
                        }`}
                      >
                        <CheckCircle2 className="h-3.5 w-3.5" />
                        <span>{q.isAnswered ? 'Mark Unanswered' : 'Mark Answered'}</span>
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
                  )}
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
                className="flex items-center justify-between p-3.5 rounded-2xl bg-white border border-slate-200/90 shadow-sm transition-all"
              >
                {isHost ? (
                  <button
                    type="button"
                    onClick={() => toggleAgendaItem(item.id)}
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
                      className={`text-xs font-semibold transition-all ${
                        item.isDone ? 'line-through text-slate-400' : 'text-slate-800'
                      }`}
                    >
                      {item.title}
                    </span>
                  </button>
                ) : (
                  /* Member Read-Only View (Instant Synchronized Realtime View) */
                  <div className="flex items-center gap-3 text-left flex-1 select-none">
                    <div
                      className={`h-5 w-5 rounded-lg border flex items-center justify-center transition-all ${
                        item.isDone
                          ? 'bg-emerald-500 border-emerald-500 text-white'
                          : 'border-slate-300 bg-slate-50'
                      }`}
                    >
                      {item.isDone && <CheckCircle2 className="h-3.5 w-3.5" />}
                    </div>
                    <span
                      className={`text-xs font-semibold transition-all ${
                        item.isDone ? 'line-through text-slate-400' : 'text-slate-800'
                      }`}
                    >
                      {item.title}
                    </span>
                  </div>
                )}

                {/* Trashcan Delete is STRICTLY HOST-ONLY */}
                {isHost && (
                  <button
                    type="button"
                    onClick={() => deleteAgendaItem(item.id)}
                    className="text-slate-300 hover:text-rose-500 p-1 transition-colors cursor-pointer"
                    title="Delete Agenda Item"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                )}
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
              placeholder="Ask a question to the host..."
              className="flex-1 px-3 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50 text-slate-900 focus:bg-white focus:border-[#0084FF] focus:outline-none font-sans"
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
        ) : isHost ? (
          /* Adding Agenda Items is STRICTLY HOST-ONLY */
          <form onSubmit={handleAddAgenda} className="flex gap-2">
            <input
              type="text"
              value={newAgendaItem}
              onChange={(e) => setNewAgendaItem(e.target.value)}
              placeholder="Add new agenda topic..."
              className="flex-1 px-3 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50 text-slate-900 focus:bg-white focus:border-[#0084FF] focus:outline-none font-sans"
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
        ) : (
          /* Member Indicator */
          <div className="text-center text-[11px] font-mono text-slate-400 py-1">
            Session Agenda Synchronized Live
          </div>
        )}
      </div>
    </div>
  );
};
