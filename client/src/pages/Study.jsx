import React, { useState, useEffect } from 'react';
import ModeSelector from '../components/ModeSelector';
import ChatInput from '../components/ChatInput';
import AIResponse from '../components/AIResponse';
import LoadingState from '../components/LoadingState';
import ErrorMessage from '../components/ErrorMessage';
import { askStudyBuddy } from '../services/api';
import { Clock, Trash2, ArrowUpRight } from 'lucide-react';

const RECENT_STORAGE_KEY = 'studybuddy_recent_sessions_v1';

export default function Study({ health, onRefreshHealth }) {
  const [currentMode, setCurrentMode] = useState('explain');
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState(null);
  const [error, setError] = useState(null);
  const [lastQuery, setLastQuery] = useState(null);
  const [recentSessions, setRecentSessions] = useState([]);

  // Load recent sessions from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem(RECENT_STORAGE_KEY);
      if (saved) {
        setRecentSessions(JSON.parse(saved));
      }
    } catch (err) {
      console.error('Failed to load recent sessions:', err);
    }
  }, []);

  const saveRecentSession = (topic, subject, mode) => {
    try {
      const newSession = {
        id: Date.now(),
        topic,
        subject,
        mode,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      const updated = [newSession, ...recentSessions.filter((s) => s.topic !== topic)].slice(0, 6);
      setRecentSessions(updated);
      localStorage.setItem(RECENT_STORAGE_KEY, JSON.stringify(updated));
    } catch (err) {
      console.error('Failed to save session:', err);
    }
  };

  const clearRecentSessions = () => {
    try {
      setRecentSessions([]);
      localStorage.removeItem(RECENT_STORAGE_KEY);
    } catch (err) {
      console.error('Failed to clear sessions:', err);
    }
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
      saveRecentSession(message, subject, currentMode);
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
    // Append or use follow-up as new question with the current subject context
    handleAsk({
      message: `${prompt} regarding: "${lastQuery?.message || ''}"`,
      subject: lastQuery?.subject || '',
    });
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 space-y-6">
      {/* Title & Introduction */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          AI Study Assistant
        </h1>
        <p className="text-sm sm:text-base text-slate-600 mt-1">
          Select a mode, enter what you are struggling with, and StudyBuddy will break it down step-by-step.
        </p>
      </div>

      {/* Mode Selector */}
      <ModeSelector currentMode={currentMode} onSelectMode={setCurrentMode} />

      {/* Input Form */}
      <ChatInput
        onSubmit={handleAsk}
        loading={loading}
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
          onRetry={handleRetry}
          onFollowUp={handleFollowUp}
        />
      )}

      {/* Recent Sessions (PRD §27) */}
      {recentSessions.length > 0 && !loading && (
        <div className="bg-white rounded-2xl border border-slate-200 p-5 mt-8">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-slate-500">
              <Clock className="w-3.5 h-3.5 text-indigo-600" />
              <span>Recent Study Sessions</span>
            </div>
            <button
              onClick={clearRecentSessions}
              className="text-slate-400 hover:text-rose-600 p-1 rounded transition-colors text-xs flex items-center gap-1"
              title="Clear recent sessions"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Clear</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {recentSessions.map((session) => (
              <button
                key={session.id}
                type="button"
                onClick={() =>
                  handleAsk({
                    message: session.topic,
                    subject: session.subject,
                  })
                }
                className="group flex items-start justify-between p-3 rounded-xl border border-slate-100 hover:border-indigo-200 hover:bg-indigo-50/40 text-left transition-all"
              >
                <div className="min-w-0 pr-2">
                  <div className="text-xs font-semibold text-slate-800 truncate group-hover:text-indigo-600">
                    {session.topic}
                  </div>
                  <div className="text-[11px] text-slate-400 mt-0.5 flex items-center gap-1.5">
                    {session.subject && (
                      <span className="font-medium text-slate-600 bg-slate-100 px-1.5 py-0.2 rounded">
                        {session.subject}
                      </span>
                    )}
                    <span>{session.timestamp}</span>
                  </div>
                </div>
                <ArrowUpRight className="w-4 h-4 text-slate-300 group-hover:text-indigo-600 flex-shrink-0 mt-0.5 transition-colors" />
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
