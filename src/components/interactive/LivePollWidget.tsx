import React, { useState } from 'react';
import { Check, Plus, Trash2, RotateCcw, BarChart2, HelpCircle, Sparkles } from 'lucide-react';
import { useStream } from '../../context/StreamContext';
import { useAuth } from '../../context/AuthContext';
import { Button } from '../common/Button';

export const LivePollWidget: React.FC = () => {
  const { pollData, votePoll, createPoll, resetPoll, deletePoll, isPresenterRole } = useStream();
  const { user } = useAuth();

  const isHost = user?.role === 'host' || isPresenterRole;

  // Host Poll Creator state
  const [isCreatingPoll, setIsCreatingPoll] = useState(false);
  const [pollQuestion, setPollQuestion] = useState('');
  const [pollOptions, setPollOptions] = useState(['Option 1', 'Option 2']);

  const handleAddOption = () => {
    if (pollOptions.length < 5) {
      setPollOptions([...pollOptions, `Option ${pollOptions.length + 1}`]);
    }
  };

  const handleRemoveOption = (index: number) => {
    if (pollOptions.length > 2) {
      setPollOptions(pollOptions.filter((_, i) => i !== index));
    }
  };

  const handleLaunchPoll = (e: React.FormEvent) => {
    e.preventDefault();
    if (!pollQuestion.trim()) return;

    createPoll(pollQuestion, pollOptions);
    setIsCreatingPoll(false);
    setPollQuestion('');
    setPollOptions(['Option 1', 'Option 2']);
  };

  return (
    <div className="h-full flex flex-col justify-between space-y-4 font-sans text-left">
      {/* Poll Header */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-slate-700">
            Live Audience Poll
          </span>
          {pollData && isHost && (
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono text-slate-500">
                {pollData.totalVotes} vote{pollData.totalVotes !== 1 ? 's' : ''}
              </span>
              <button
                type="button"
                onClick={resetPoll}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 cursor-pointer transition-all"
                title="Reset Poll Votes"
              >
                <RotateCcw className="h-3 w-3" />
              </button>
              <button
                type="button"
                onClick={deletePoll}
                className="p-1 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 cursor-pointer transition-all"
                title="Delete & Close Poll"
              >
                <Trash2 className="h-3 w-3" />
              </button>
            </div>
          )}
          {pollData && !isHost && (
            <span className="text-xs font-mono text-slate-500">
              {pollData.totalVotes} vote{pollData.totalVotes !== 1 ? 's' : ''}
            </span>
          )}
        </div>

        {isCreatingPoll && isHost ? (
          /* Host Custom Poll Creator Form */
          <form onSubmit={handleLaunchPoll} className="space-y-3 bg-slate-50 p-4 rounded-2xl border border-slate-200 animate-fade-in">
            <div>
              <label className="block text-xs font-semibold text-slate-900 mb-1">
                Poll Question
              </label>
              <input
                type="text"
                required
                value={pollQuestion}
                onChange={(e) => setPollQuestion(e.target.value)}
                placeholder="e.g. Which architectural layer should we review next?"
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-white text-slate-900 focus:outline-none focus:border-[#0084FF]"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-xs font-semibold text-slate-900">
                Options
              </label>
              {pollOptions.map((opt, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <input
                    type="text"
                    required
                    value={opt}
                    onChange={(e) => {
                      const next = [...pollOptions];
                      next[idx] = e.target.value;
                      setPollOptions(next);
                    }}
                    placeholder={`Option ${idx + 1}`}
                    className="flex-1 px-3 py-1.5 text-xs rounded-xl border border-slate-200 bg-white text-slate-900 focus:outline-none focus:border-[#0084FF]"
                  />
                  {pollOptions.length > 2 && (
                    <button
                      type="button"
                      onClick={() => handleRemoveOption(idx)}
                      className="text-slate-400 hover:text-rose-500 p-1 cursor-pointer"
                    >
                      ✕
                    </button>
                  )}
                </div>
              ))}
            </div>

            {pollOptions.length < 5 && (
              <button
                type="button"
                onClick={handleAddOption}
                className="text-[11px] font-semibold text-[#0084FF] hover:underline flex items-center gap-1 cursor-pointer"
              >
                <Plus className="h-3 w-3" />
                <span>Add Another Option</span>
              </button>
            )}

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setIsCreatingPoll(false)}
                className="px-3 py-1.5 rounded-xl text-xs font-semibold text-slate-500 hover:text-slate-800 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-1.5 rounded-xl text-xs font-semibold bg-[#0084FF] hover:bg-[#0074E0] text-white cursor-pointer shadow-sm"
              >
                Launch Poll
              </button>
            </div>
          </form>
        ) : pollData ? (
          /* Active Poll View (Vote / Results) */
          <div className="space-y-3">
            <h4 className="text-sm font-semibold text-slate-900 font-heading">
              {pollData.question}
            </h4>

            <div className="space-y-2">
              {pollData.options.map((option) => {
                const isSelected = pollData.userSelectedOption === option.id;

                return (
                  <button
                    key={option.id}
                    type="button"
                    onClick={() => votePoll(option.id)}
                    disabled={pollData.hasVoted}
                    className={`w-full p-3 rounded-2xl border text-left transition-all relative overflow-hidden cursor-pointer disabled:cursor-default ${
                      isSelected
                        ? 'border-[#0084FF] bg-blue-50/50 shadow-sm'
                        : 'border-slate-200 bg-white hover:border-slate-300'
                    }`}
                  >
                    {/* Live Progress Bar Fill */}
                    {pollData.hasVoted && (
                      <div
                        className="absolute inset-y-0 left-0 bg-blue-100/60 transition-all duration-500 pointer-events-none"
                        style={{ width: `${option.percentage}%` }}
                      />
                    )}

                    <div className="relative z-10 flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <div
                          className={`h-4 w-4 rounded-full border flex items-center justify-center transition-all ${
                            isSelected
                              ? 'border-[#0084FF] bg-[#0084FF] text-white'
                              : 'border-slate-300 bg-white'
                          }`}
                        >
                          {isSelected && <Check className="h-2.5 w-2.5" />}
                        </div>
                        <span className="text-xs font-medium text-slate-800">
                          {option.text}
                        </span>
                      </div>

                      {pollData.hasVoted && (
                        <div className="flex items-center gap-1.5 font-mono text-xs font-bold text-slate-700">
                          <span>{option.percentage}%</span>
                          <span className="text-[10px] text-slate-400 font-normal">
                            ({option.votes})
                          </span>
                        </div>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        ) : (
          /* Empty Poll Zero State */
          <div className="p-8 rounded-2xl bg-slate-50 border border-slate-200/80 text-center space-y-3">
            <div className="h-10 w-10 rounded-xl bg-blue-50 border border-blue-200 flex items-center justify-center mx-auto text-[#0084FF]">
              <BarChart2 className="h-5 w-5" />
            </div>

            <div className="space-y-1">
              <h4 className="text-xs font-bold text-slate-800">
                {isHost ? 'No Active Poll' : 'Waiting for Host Poll'}
              </h4>
              <p className="text-[11px] text-slate-500 font-light max-w-xs mx-auto">
                {isHost
                  ? 'Launch an interactive poll to collect instant votes from your live audience.'
                  : 'The host has not launched a poll yet. Live questions will appear here automatically.'}
              </p>
            </div>

            {isHost && (
              <button
                type="button"
                onClick={() => setIsCreatingPoll(true)}
                className="py-2 px-4 rounded-xl bg-[#0084FF] hover:bg-[#0074E0] text-white text-xs font-semibold inline-flex items-center gap-1.5 shadow-sm cursor-pointer transition-all"
              >
                <Plus className="h-3.5 w-3.5" />
                <span>Create New Poll</span>
              </button>
            )}
          </div>
        )}
      </div>

      <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[10px] font-mono text-slate-400">
        <span>{pollData?.hasVoted ? '✓ Vote recorded' : 'Live Real-Time Voting'}</span>
        <span>Broadcast WebRTC</span>
      </div>
    </div>
  );
};
