import React, { useState } from 'react';
import { Check, Plus, Trash2, RotateCcw, BarChart2 } from 'lucide-react';
import { useStream } from '../../context/StreamContext';
import { Button } from '../common/Button';

export const LivePollWidget: React.FC = () => {
  const { pollData, votePoll, createPoll, resetPoll, deletePoll } = useStream();

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
          {pollData && (
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
        </div>

        {isCreatingPoll ? (
          /* Host Custom Poll Creator Form */
          <form onSubmit={handleLaunchPoll} className="space-y-3 bg-slate-50 p-4 rounded-2xl border border-slate-200 animate-fade-in">
            <div>
              <label className="block text-xs font-semibold text-obsidian mb-1">
                Poll Question
              </label>
              <input
                type="text"
                required
                value={pollQuestion}
                onChange={(e) => setPollQuestion(e.target.value)}
                placeholder="e.g. Which project phase should we start next?"
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 bg-white text-obsidian focus:outline-none focus:border-slate-800 font-sans"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-xs font-semibold text-obsidian">
                Options
              </label>
              {pollOptions.map((opt, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <input
                    type="text"
                    required
                    value={opt}
                    onChange={(e) => {
                      const updated = [...pollOptions];
                      updated[idx] = e.target.value;
                      setPollOptions(updated);
                    }}
                    className="flex-1 px-3 py-1.5 text-xs rounded-xl border border-slate-300 bg-white text-obsidian focus:outline-none focus:border-slate-800 font-sans"
                  />
                  {pollOptions.length > 2 && (
                    <button
                      type="button"
                      onClick={() => handleRemoveOption(idx)}
                      className="p-1.5 text-slate-400 hover:text-rose-500 cursor-pointer"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  )}
                </div>
              ))}
            </div>

            <div className="flex items-center justify-between pt-1">
              {pollOptions.length < 5 && (
                <button
                  type="button"
                  onClick={handleAddOption}
                  className="text-xs font-semibold text-slate-700 hover:text-obsidian flex items-center gap-1 cursor-pointer"
                >
                  <Plus className="h-3.5 w-3.5" />
                  <span>Add Option</span>
                </button>
              )}

              <div className="flex items-center gap-2 ml-auto">
                <Button
                  type="button"
                  variant="secondary"
                  size="sm"
                  onClick={() => setIsCreatingPoll(false)}
                  className="rounded-xl text-xs"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="primary"
                  size="sm"
                  className="rounded-xl text-xs font-semibold"
                >
                  Launch Poll
                </Button>
              </div>
            </div>
          </form>
        ) : pollData ? (
          /* Live Poll Voting View */
          <div className="space-y-3 animate-fade-in">
            <h3 className="text-sm sm:text-base font-heading font-bold text-obsidian tracking-tight">
              {pollData.question}
            </h3>

            {/* Options List */}
            <div className="space-y-2.5">
              {pollData.options.map((option) => {
                const isSelected = pollData.userSelectedOption === option.id;
                return (
                  <button
                    key={option.id}
                    disabled={pollData.hasVoted}
                    onClick={() => votePoll(option.id)}
                    className={`w-full relative overflow-hidden p-3.5 rounded-2xl border text-left transition-all cursor-pointer ${
                      isSelected
                        ? 'border-slate-900 bg-slate-50'
                        : 'border-slate-200 bg-white hover:border-slate-300'
                    }`}
                  >
                    {/* Visual Percentage Progress Fill */}
                    {pollData.hasVoted && (
                      <div
                        className="absolute inset-y-0 left-0 bg-slate-100/90 transition-all duration-700"
                        style={{ width: `${option.percentage}%` }}
                      />
                    )}

                    <div className="relative z-10 flex items-center justify-between gap-3 text-xs">
                      <div className="flex items-center gap-2.5 min-w-0">
                        <div
                          className={`h-4 w-4 rounded-full border flex items-center justify-center shrink-0 ${
                            isSelected
                              ? 'border-slate-900 bg-slate-900 text-white'
                              : 'border-slate-300 bg-white'
                          }`}
                        >
                          {isSelected && <Check className="h-2.5 w-2.5 stroke-[3]" />}
                        </div>
                        <span className={`truncate font-normal ${isSelected ? 'font-semibold text-obsidian' : 'text-slate-700'}`}>
                          {option.text}
                        </span>
                      </div>

                      {pollData.hasVoted && (
                        <span className="font-mono font-bold text-slate-900 shrink-0">
                          {option.percentage}%
                        </span>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        ) : (
          /* Empty State: Zero Polls by default */
          <div className="h-60 flex flex-col items-center justify-center p-6 text-center space-y-3 bg-slate-50/60 rounded-2xl border border-dashed border-slate-200 animate-fade-in">
            <div className="h-10 w-10 rounded-2xl bg-white border border-slate-200 flex items-center justify-center text-slate-400 shadow-sm">
              <BarChart2 className="h-5 w-5" />
            </div>
            <div className="space-y-1">
              <h4 className="text-xs font-semibold text-obsidian">
                No active poll in this meeting
              </h4>
              <p className="text-[11px] text-slate-400 font-light max-w-xs">
                Launch a live poll to collect real-time feedback and votes from participants.
              </p>
            </div>
            <Button
              variant="primary"
              size="sm"
              onClick={() => setIsCreatingPoll(true)}
              className="rounded-xl text-xs font-semibold"
              leftIcon={<Plus className="h-3.5 w-3.5" />}
            >
              Create Live Poll
            </Button>
          </div>
        )}
      </div>

      {/* Host Controls Footer */}
      {!isCreatingPoll && pollData && (
        <div className="pt-2 flex items-center justify-between border-t border-slate-100">
          <span className="text-[11px] text-slate-400 font-light">
            {pollData.hasVoted ? '✓ Your vote is recorded' : 'Select an option to vote'}
          </span>
          <button
            type="button"
            onClick={() => setIsCreatingPoll(true)}
            className="text-xs font-semibold text-slate-700 hover:text-obsidian flex items-center gap-1 cursor-pointer"
          >
            <Plus className="h-3 w-3" />
            <span>Create New Poll</span>
          </button>
        </div>
      )}
    </div>
  );
};
