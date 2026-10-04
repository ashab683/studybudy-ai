import React, { useState } from 'react';
import { Send, Sparkles, BookMarked, X } from 'lucide-react';

const SUGGESTIONS = [
  { topic: 'Explain recursion in C like I am a beginner', subject: 'Data Structures' },
  { topic: 'How does binary search achieve O(log n) time complexity?', subject: 'Algorithms' },
  { topic: 'Explain pointers and memory addresses simply', subject: 'C Programming' },
  { topic: 'Difference between Process and Thread', subject: 'Operating Systems' },
];

export default function ChatInput({ onSubmit, loading, initialTopic = '', initialSubject = '' }) {
  const [message, setMessage] = useState(initialTopic);
  const [subject, setSubject] = useState(initialSubject);
  const [validationError, setValidationError] = useState('');

  const handleApplySuggestion = (sug) => {
    setMessage(sug.topic);
    setSubject(sug.subject);
    setValidationError('');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!message || message.trim().length === 0) {
      setValidationError("Tell StudyBuddy what you'd like to learn.");
      return;
    }
    setValidationError('');
    onSubmit({ message: message.trim(), subject: subject.trim() });
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
      handleSubmit(e);
    }
  };

  return (
    <div className="w-full bg-white rounded-2xl border border-slate-200/90 shadow-sm p-4 sm:p-6 transition-all focus-within:border-indigo-400 focus-within:ring-2 focus-within:ring-indigo-100">
      {/* Suggestions / Prompt starters */}
      <div className="mb-4">
        <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 mb-2">
          <Sparkles className="w-3.5 h-3.5 text-indigo-500" />
          <span>Need inspiration? Try an example topic:</span>
        </div>
        <div className="flex flex-wrap gap-1.5">
          {SUGGESTIONS.map((sug, idx) => (
            <button
              key={idx}
              type="button"
              disabled={loading}
              onClick={() => handleApplySuggestion(sug)}
              className="text-xs bg-slate-100 hover:bg-indigo-50 hover:text-indigo-700 text-slate-700 px-2.5 py-1 rounded-lg border border-slate-200 hover:border-indigo-200 transition-colors disabled:opacity-50 text-left"
            >
              {sug.topic}
            </button>
          ))}
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-3">
        {/* Subject input */}
        <div className="flex items-center gap-2">
          <div className="relative flex-1 sm:max-w-xs">
            <BookMarked className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Subject (e.g. Data Structures, OS)"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              disabled={loading}
              className="w-full pl-9 pr-3 py-1.5 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-indigo-500 focus:bg-white text-slate-800 placeholder-slate-400 disabled:opacity-50"
            />
          </div>
          {subject && (
            <button
              type="button"
              onClick={() => setSubject('')}
              className="text-slate-400 hover:text-slate-600 text-xs p-1"
              title="Clear subject"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Question / Concept input */}
        <div className="relative">
          <textarea
            rows={4}
            placeholder="What are you struggling with? Paste lecture notes, a question, or a concept you want explained..."
            value={message}
            onChange={(e) => {
              setMessage(e.target.value);
              if (validationError) setValidationError('');
            }}
            onKeyDown={handleKeyDown}
            disabled={loading}
            maxLength={4000}
            className="w-full p-3 sm:p-4 text-sm sm:text-base bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-indigo-500 focus:bg-white text-slate-800 placeholder-slate-400 resize-y min-h-[110px] disabled:opacity-50"
          />
        </div>

        {/* Validation error message */}
        {validationError && (
          <p className="text-xs text-rose-600 font-medium animate-shake">
            {validationError}
          </p>
        )}

        {/* Action bar */}
        <div className="flex items-center justify-between pt-1">
          <div className="text-[11px] text-slate-400">
            <span>{message.length} / 4000</span>
            <span className="hidden sm:inline ml-2 text-slate-400">Tip: Press Ctrl+Enter to submit</span>
          </div>

          <div className="flex items-center gap-2">
            {message && !loading && (
              <button
                type="button"
                onClick={() => {
                  setMessage('');
                  setValidationError('');
                }}
                className="px-3 py-1.5 text-xs text-slate-500 hover:text-slate-700 font-medium rounded-lg hover:bg-slate-100 transition-colors"
              >
                Clear
              </button>
            )}

            <button
              type="submit"
              disabled={loading || !message.trim()}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-sm text-white bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 shadow-sm shadow-indigo-200 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none"
            >
              <Send className="w-4 h-4" />
              <span>{loading ? 'Asking StudyBuddy...' : 'Ask StudyBuddy'}</span>
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
