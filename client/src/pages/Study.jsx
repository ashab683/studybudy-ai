import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import ModeSelector from '../components/ModeSelector';
import ChatInput from '../components/ChatInput';
import AIResponse from '../components/AIResponse';
import LoadingState from '../components/LoadingState';
import ErrorMessage from '../components/ErrorMessage';
import { askStudyBuddy } from '../services/api';
import { getRecentSessions, addRecentSession, clearRecentSessions } from '../utils/storage';
import { Clock, Trash2, ArrowUpRight, Sparkles } from 'lucide-react';

export default function Study({ health }) {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const [currentMode, setCurrentMode] = useState('explain');
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState(null);
  const [error, setError] = useState(null);
  const [lastQuery, setLastQuery] = useState(null);
  const [recentSessions, setRecentSessions] = useState([]);

  // Check URL query parameters
  useEffect(() => {
    const urlTopic = searchParams.get('topic');
    const urlSubject = searchParams.get('subject');
    const urlMode = searchParams.get('mode');

    if (urlMode) setCurrentMode(urlMode);
    if (urlTopic) {
      setLastQuery({ message: urlTopic, subject: urlSubject || '', mode: urlMode || 'explain' });
    }
  }, [searchParams]);

  // Load recent sessions from storage
  useEffect(() => {
    setRecentSessions(getRecentSessions());
  }, []);

  const handleSelectMode = (modeId) => {
    if (modeId === 'quiz') {
      const topicParam = lastQuery?.message ? `?topic=${encodeURIComponent(lastQuery.message)}` : '';
      navigate(`/quiz${topicParam}`);
      return;
    }
    if (modeId === 'studyPlan') {
      const topicParam = lastQuery?.message ? `?topic=${encodeURIComponent(lastQuery.message)}` : '';
      navigate(`/study-plan${topicParam}`);
      return;
    }
    if (modeId === 'examRevision') {
      const topicParam = lastQuery?.message ? `?topic=${encodeURIComponent(lastQuery.message)}` : '';
      navigate(`/revision${topicParam}`);
      return;
    }
    setCurrentMode(modeId);
  };

  const handleAsk = async ({ message, subject }) => {
    setLoading(true);
    setError(null);
    setResponse(null);
    setLastQuery({ message, subject, mode: currentMode });

    try {
      const result = await askStudyBuddy({
        message,
        subject,
        mode: currentMode,
      });

      setResponse(result);
      const updated = addRecentSession(message, subject, currentMode);
      setRecentSessions(updated);
    } catch (err) {
      console.error('StudyBuddy AI request failed:', err);
      setError(err.message || 'An unexpected error occurred while communicating with the local AI.');
    } finally {
      setLoading(false);
    }
  };

  const handleRetry = () => {
    if (lastQuery) {
      handleAsk({ message: lastQuery.message, subject: lastQuery.subject });
    }
  };

  const handleFollowUp = (prompt) => {
    handleAsk({
      message: `${prompt} regarding: "${lastQuery?.message || ''}"`,
      subject: lastQuery?.subject || '',
    });
  };

  const handleClearHistory = () => {
    clearRecentSessions();
    setRecentSessions([]);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 space-y-6">
      {/* Title & Introduction */}
      <div>
        <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 font-bold text-xs uppercase tracking-wider mb-1">
          <Sparkles className="w-4 h-4" />
          <span>Local Open-Weight Tutor</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          AI Study Assistant
        </h1>
        <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 mt-1">
          Select a learning mode, enter what you are struggling with, and StudyBuddy will break it down step-by-step.
        </p>
      </div>

      {/* Mode Selector */}
      <ModeSelector currentMode={currentMode} onSelectMode={handleSelectMode} />

      {/* Input Form */}
      <ChatInput
        onSubmit={handleAsk}
        loading={loading}
        currentMode={currentMode}
        initialTopic={lastQuery?.message || ''}
        initialSubject={lastQuery?.subject || ''}
      />

      {/* Loading State */}
      {loading && <LoadingState />}

      {/* Error Message */}
      {error && !loading && (
        <ErrorMessage
          error={error}
          onRetry={handleRetry}
          modelName={health?.localAi?.model || 'gemma3:4b'}
        />
      )}

      {/* AI Response Display */}
      {response && !loading && (
        <AIResponse
          response={response.response}
          model={response.model}
          mode={response.mode || currentMode}
          topic={lastQuery?.message || ''}
          subject={lastQuery?.subject || ''}
          onRetry={handleRetry}
          onFollowUp={handleFollowUp}
        />
      )}

      {/* Recent Sessions (PRD §27) */}
      {recentSessions.length > 0 && !loading && (
        <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-5 mt-8 shadow-xs">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              <Clock className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
              <span>Recent Study Sessions</span>
            </div>
            <button
              onClick={handleClearHistory}
              className="text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 p-1 rounded transition-colors text-xs flex items-center gap-1"
              title="Clear recent sessions"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Clear History</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {recentSessions.map((session) => (
              <button
                key={session.id}
                type="button"
                onClick={() => {
                  setCurrentMode(session.mode || 'explain');
                  handleAsk({
                    message: session.topic,
                    subject: session.subject,
                  });
                }}
                className="group flex items-start justify-between p-3 rounded-xl border border-slate-100 dark:border-slate-700/60 hover:border-indigo-200 dark:hover:border-indigo-500 hover:bg-indigo-50/40 dark:hover:bg-slate-700/50 text-left transition-all"
              >
                <div className="min-w-0 pr-2">
                  <div className="text-xs font-semibold text-slate-800 dark:text-slate-200 truncate group-hover:text-indigo-600 dark:group-hover:text-indigo-400">
                    {session.topic}
                  </div>
                  <div className="text-[11px] text-slate-400 dark:text-slate-500 mt-0.5 flex items-center gap-1.5">
                    <span className="capitalize text-indigo-600 dark:text-indigo-400 font-medium">
                      {session.mode || 'explain'}
                    </span>
                    {session.subject && (
                      <span className="font-medium text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-700 px-1.5 py-0.2 rounded">
                        {session.subject}
                      </span>
                    )}
                    <span>{session.timestamp}</span>
                  </div>
                </div>
                <ArrowUpRight className="w-4 h-4 text-slate-300 dark:text-slate-600 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 flex-shrink-0 mt-0.5 transition-colors" />
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
