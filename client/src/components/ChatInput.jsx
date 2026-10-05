import React, { useState, useEffect } from 'react';
import { Send, Sparkles, BookMarked, X } from 'lucide-react';

const MODE_SUGGESTIONS = {
  explain: [
    { topic: 'Explain recursion in C like I am a beginner', subject: 'Data Structures' },
    { topic: 'How does binary search achieve O(log n) time complexity?', subject: 'Algorithms' },
    { topic: 'Difference between Process and Thread', subject: 'Operating Systems' },
    { topic: 'Explain pointers and memory addresses simply', subject: 'C Programming' },
  ],
  simplify: [
    { topic: 'A process is an instance of a computer program that is being executed by one or many threads. It contains the program code and its activity.', subject: 'OS Notes' },
    { topic: 'A binary tree is a k-ary k=2 tree data structure in which each node has at most two children referred to as the left child and right child.', subject: 'Tree Definitions' },
    { topic: 'Polymorphism is the provision of a single interface to entities of different types or the use of a single symbol to represent multiple different types.', subject: 'OOP Concept' },
  ],
  practice: [
    { topic: 'Linked List operations and cycle detection', subject: 'Data Structures' },
    { topic: 'Dijkstra shortest path algorithm', subject: 'Graph Algorithms' },
    { topic: 'SQL Joins, Group By and Aggregate queries', subject: 'Databases' },
  ],
  examRevision: [
    { topic: 'Normalization (1NF, 2NF, 3NF, BCNF)', subject: 'DBMS' },
    { topic: 'Virtual Memory, Paging and Page Replacement', subject: 'Operating Systems' },
    { topic: 'TCP vs UDP protocols and three-way handshake', subject: 'Networking' },
  ],
};

const MODE_PLACEHOLDERS = {
  explain: 'What concept are you struggling with? e.g. Explain how quicksort partitions arrays...',
  simplify: 'Paste a dense textbook paragraph, lecture slide, or complex definition to rewrite in plain English...',
  practice: 'What topic do you want practice problems for? e.g. Linked Lists, Stack applications...',
  examRevision: 'Enter topic for high-yield exam sheet: definitions, formulas, common traps, and 60s summary...',
};

export default function ChatInput({
  onSubmit,
  loading,
  currentMode = 'explain',
  initialTopic = '',
  initialSubject = '',
}) {
  const [message, setMessage] = useState(initialTopic);
  const [subject, setSubject] = useState(initialSubject);
  const [validationError, setValidationError] = useState('');

  useEffect(() => {
    if (initialTopic) setMessage(initialTopic);
    if (initialSubject) setSubject(initialSubject);
  }, [initialTopic, initialSubject]);

  const suggestions = MODE_SUGGESTIONS[currentMode] || MODE_SUGGESTIONS.explain;
  const placeholder = MODE_PLACEHOLDERS[currentMode] || MODE_PLACEHOLDERS.explain;

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
    <div className="w-full bg-white dark:bg-slate-800/90 rounded-2xl border border-slate-200/90 dark:border-slate-700/80 shadow-sm p-4 sm:p-6 transition-all focus-within:border-indigo-400 dark:focus-within:border-indigo-500 focus-within:ring-2 focus-within:ring-indigo-100 dark:focus-within:ring-indigo-950/60">
      {/* Suggestions / Prompt starters */}
      <div className="mb-4">
        <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 dark:text-slate-400 mb-2">
          <Sparkles className="w-3.5 h-3.5 text-indigo-500" />
          <span>Need inspiration? Try an example topic:</span>
        </div>
        <div className="flex flex-wrap gap-1.5">
          {suggestions.map((sug, idx) => (
            <button
              key={idx}
              type="button"
              disabled={loading}
              onClick={() => handleApplySuggestion(sug)}
              className="text-xs bg-slate-100 dark:bg-slate-700/70 hover:bg-indigo-50 dark:hover:bg-indigo-950/60 hover:text-indigo-700 dark:hover:text-indigo-300 text-slate-700 dark:text-slate-300 px-2.5 py-1 rounded-lg border border-slate-200 dark:border-slate-600/60 hover:border-indigo-200 dark:hover:border-indigo-800 transition-colors disabled:opacity-50 text-left line-clamp-1 max-w-full"
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
            <BookMarked className="w-4 h-4 text-slate-400 dark:text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Subject (e.g. Data Structures, OS)"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              disabled={loading}
              className="w-full pl-9 pr-3 py-1.5 text-xs sm:text-sm bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:border-indigo-500 dark:focus:border-indigo-400 focus:bg-white dark:focus:bg-slate-900 text-slate-800 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 disabled:opacity-50"
            />
          </div>
          {subject && (
            <button
              type="button"
              onClick={() => setSubject('')}
              className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 text-xs p-1"
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
            placeholder={placeholder}
            value={message}
            onChange={(e) => {
              setMessage(e.target.value);
              if (validationError) setValidationError('');
            }}
            onKeyDown={handleKeyDown}
            disabled={loading}
            maxLength={4000}
            className="w-full p-3 sm:p-4 text-sm sm:text-base bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:border-indigo-500 dark:focus:border-indigo-400 focus:bg-white dark:focus:bg-slate-900 text-slate-800 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 resize-y min-h-[110px] disabled:opacity-50"
          />
        </div>

        {/* Validation error message */}
        {validationError && (
          <p className="text-xs text-rose-600 dark:text-rose-400 font-medium">
            {validationError}
          </p>
        )}

        {/* Action bar */}
        <div className="flex items-center justify-between pt-1">
          <div className="text-[11px] text-slate-400 dark:text-slate-500">
            <span>{message.length} / 4000</span>
            <span className="hidden sm:inline ml-2 text-slate-400 dark:text-slate-500">Tip: Press Ctrl+Enter to submit</span>
          </div>

          <div className="flex items-center gap-2">
            {message && !loading && (
              <button
                type="button"
                onClick={() => {
                  setMessage('');
                  setValidationError('');
                }}
                className="px-3 py-1.5 text-xs text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 font-medium rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
              >
                Clear
              </button>
            )}

            <button
              type="submit"
              disabled={loading || !message.trim()}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-sm text-white bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 shadow-sm shadow-indigo-200 dark:shadow-none transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none"
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
