import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import {
  FileText,
  Sparkles,
  Trophy,
  Copy,
  Check,
  Bookmark,
  BookmarkCheck,
  RotateCcw,
  BookOpen,
} from 'lucide-react';
import { askStudyBuddy } from '../services/api';
import { saveResource, isResourceSaved } from '../utils/storage';
import LoadingState from '../components/LoadingState';
import ErrorMessage from '../components/ErrorMessage';
import AIResponse from '../components/AIResponse';

const POPULAR_REVISION_TOPICS = [
  { topic: 'DBMS — Normalization (1NF to BCNF)', subject: 'Databases' },
  { topic: 'Binary Search & Complexity Analysis', subject: 'Algorithms' },
  { topic: 'Virtual Memory & Page Replacement', subject: 'Operating Systems' },
  { topic: 'TCP 3-Way Handshake & Congestion Control', subject: 'Networking' },
  { topic: 'Object-Oriented Programming (4 Pillars)', subject: 'OOP' },
];

export default function Revision({ health }) {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const [topic, setTopic] = useState('');
  const [subject, setSubject] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [result, setResult] = useState(null);
  const [copied, setCopied] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const urlTopic = searchParams.get('topic');
    const urlSubject = searchParams.get('subject');
    if (urlTopic) setTopic(urlTopic);
    if (urlSubject) setSubject(urlSubject);
  }, [searchParams]);

  const handleGenerate = async (e) => {
    if (e) e.preventDefault();
    if (!topic.trim()) {
      setError('Please enter a topic to produce an exam revision sheet.');
      return;
    }

    setLoading(true);
    setError(null);
    setResult(null);
    setCopied(false);
    setSaved(false);

    try {
      const data = await askStudyBuddy({
        message: topic.trim(),
        subject: subject.trim(),
        mode: 'examRevision',
      });

      setResult(data);
    } catch (err) {
      console.error('Revision sheet generation failed:', err);
      setError(err.message || 'Unable to generate revision sheet.');
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = async () => {
    if (!result?.response) return;
    try {
      await navigator.clipboard.writeText(result.response);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy revision sheet:', err);
    }
  };

  const handleSave = () => {
    if (saved || !result) return;
    saveResource({
      type: 'revision',
      title: `REVISION: ${topic}`,
      topic,
      subject,
      content: result.response,
      metadata: { model: result.model },
    });
    setSaved(true);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-8">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 font-bold text-xs uppercase tracking-wider mb-1">
          <FileText className="w-4 h-4" />
          <span>High-Yield Revision Sheet</span>
        </div>
        <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          Exam Revision Mode
        </h1>
        <p className="text-slate-600 dark:text-slate-400 text-sm mt-1">
          Generate a compact, high-impact study sheet with core definitions, formulas, complexities, and exam traps right before your test.
        </p>
      </div>

      {/* Input Card */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-6 shadow-sm space-y-4">
        <form onSubmit={handleGenerate} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                Topic for Revision Sheet
              </label>
              <input
                type="text"
                placeholder="e.g. DBMS Normalization, Binary Search, Virtual Memory..."
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                disabled={loading}
                className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:border-indigo-500 text-slate-900 dark:text-white placeholder-slate-400 text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                Subject (Optional)
              </label>
              <input
                type="text"
                placeholder="e.g. DBMS, OS, DSA"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                disabled={loading}
                className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:border-indigo-500 text-slate-900 dark:text-white placeholder-slate-400 text-sm"
              />
            </div>
          </div>

          {/* Quick Topics */}
          <div>
            <span className="text-xs text-slate-400 dark:text-slate-500 mr-2">Try an exam topic:</span>
            <div className="inline-flex flex-wrap gap-1.5 mt-1">
              {POPULAR_REVISION_TOPICS.map((item, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => {
                    setTopic(item.topic);
                    setSubject(item.subject);
                  }}
                  className="text-xs bg-slate-100 dark:bg-slate-700/60 hover:bg-emerald-50 dark:hover:bg-emerald-950/60 hover:text-emerald-700 dark:hover:text-emerald-300 text-slate-700 dark:text-slate-300 px-2.5 py-1 rounded-lg border border-slate-200 dark:border-slate-600 transition-colors"
                >
                  {item.topic}
                </button>
              ))}
            </div>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={loading || !topic.trim()}
              className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-md shadow-emerald-200 dark:shadow-none transition-all disabled:opacity-50 flex items-center justify-center gap-2 text-sm"
            >
              <Sparkles className="w-4 h-4" />
              <span>{loading ? 'Compiling Revision Sheet...' : 'Generate Revision Sheet'}</span>
            </button>
          </div>
        </form>
      </div>

      {/* Loading State */}
      {loading && <LoadingState />}

      {/* Error State */}
      {error && !loading && (
        <ErrorMessage
          error={error}
          onRetry={handleGenerate}
          modelName={health?.localAi?.model || 'gemma3:4b'}
        />
      )}

      {/* Output Revision Sheet */}
      {result && !loading && (
        <div className="space-y-4 animate-fadeIn">
          {/* Action Ribbon */}
          <div className="flex flex-wrap items-center justify-between gap-2 p-3 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 text-xs">
            <div className="font-semibold text-slate-700 dark:text-slate-300">
              Revision Sheet: <span className="text-emerald-600 dark:text-emerald-400 font-bold">{topic}</span>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleCopy}
                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 hover:bg-slate-100 text-slate-700 dark:text-slate-200 font-medium"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Copied' : 'Copy Sheet'}</span>
              </button>

              <button
                type="button"
                onClick={handleSave}
                disabled={saved}
                className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-lg border font-medium transition-colors ${
                  saved
                    ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800'
                    : 'border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 hover:bg-slate-100 text-slate-700 dark:text-slate-200'
                }`}
              >
                {saved ? <BookmarkCheck className="w-3.5 h-3.5 text-emerald-600" /> : <Bookmark className="w-3.5 h-3.5" />}
                <span>{saved ? 'Saved' : 'Save'}</span>
              </button>

              <button
                type="button"
                onClick={() => navigate(`/quiz?topic=${encodeURIComponent(topic)}`)}
                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-bold shadow-xs"
              >
                <Trophy className="w-3.5 h-3.5 text-amber-300" />
                <span>Quiz Me on This</span>
              </button>
            </div>
          </div>

          {/* AI Response Card */}
          <AIResponse
            response={result.response}
            model={result.model}
            mode="examRevision"
            topic={topic}
            subject={subject}
            onRetry={handleGenerate}
          />
        </div>
      )}
    </div>
  );
}
