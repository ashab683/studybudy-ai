import React, { useState, useEffect } from 'react';
import {
  Bookmark,
  Trash2,
  Copy,
  Check,
  BookOpen,
  Trophy,
  FileText,
  Calendar,
  Search,
  ExternalLink,
  Clock,
  Sparkles,
} from 'lucide-react';
import { getSavedResources, removeSavedResource, clearAllSavedResources } from '../utils/storage';
import { useNavigate } from 'react-router-dom';
import AIResponse from '../components/AIResponse';

export default function SavedResources() {
  const [resources, setResources] = useState([]);
  const [activeTab, setActiveTab] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [copiedId, setCopiedId] = useState(null);
  const [expandedId, setExpandedId] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    setResources(getSavedResources());
  }, []);

  const handleDelete = (id) => {
    const updated = removeSavedResource(id);
    setResources(updated);
  };

  const handleClearAll = () => {
    if (window.confirm('Are you sure you want to clear all saved study resources?')) {
      clearAllSavedResources();
      setResources([]);
    }
  };

  const handleCopy = async (id, text) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    } catch (err) {
      console.error('Failed to copy text:', err);
    }
  };

  const filteredResources = resources.filter((item) => {
    const matchesTab = activeTab === 'all' || item.type === activeTab;
    const matchesSearch =
      !searchQuery ||
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.topic && item.topic.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (item.subject && item.subject.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesTab && matchesSearch;
  });

  const getTypeIcon = (type) => {
    switch (type) {
      case 'quiz':
        return <Trophy className="w-4 h-4 text-amber-500" />;
      case 'revision':
        return <FileText className="w-4 h-4 text-emerald-500" />;
      case 'studyPlan':
        return <Calendar className="w-4 h-4 text-violet-500" />;
      case 'explanation':
      default:
        return <BookOpen className="w-4 h-4 text-indigo-500" />;
    }
  };

  const getTypeLabel = (type) => {
    switch (type) {
      case 'quiz':
        return 'Quiz Result';
      case 'revision':
        return 'Revision Sheet';
      case 'studyPlan':
        return 'Study Plan';
      default:
        return 'Explanation';
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 font-bold text-xs uppercase tracking-wider mb-1">
            <Bookmark className="w-4 h-4" />
            <span>Saved Academic Library</span>
          </div>
          <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Saved Resources
          </h1>
          <p className="text-slate-600 dark:text-slate-400 text-sm mt-1">
            Your personal study bookmarks saved offline in browser storage.
          </p>
        </div>

        {resources.length > 0 && (
          <button
            type="button"
            onClick={handleClearAll}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-xl border border-rose-200 dark:border-rose-900/60 transition-colors"
          >
            <Trash2 className="w-4 h-4" />
            <span>Clear Library</span>
          </button>
        )}
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
        {/* Category Tabs */}
        <div className="flex items-center gap-1 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
          {[
            { id: 'all', label: 'All Items' },
            { id: 'explanation', label: 'Explanations' },
            { id: 'quiz', label: 'Quizzes' },
            { id: 'revision', label: 'Revisions' },
            { id: 'studyPlan', label: 'Plans' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all whitespace-nowrap ${
                activeTab === tab.id
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-50'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Search Input */}
        <div className="relative w-full sm:w-64">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search saved topics..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 text-xs bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:border-indigo-500 text-slate-800 dark:text-slate-100 placeholder-slate-400"
          />
        </div>
      </div>

      {/* Empty State */}
      {filteredResources.length === 0 && (
        <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-12 text-center space-y-4">
          <div className="w-14 h-14 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-100 dark:border-indigo-800 flex items-center justify-center text-indigo-600 mx-auto">
            <Bookmark className="w-7 h-7" />
          </div>
          <h3 className="text-base font-bold text-slate-900 dark:text-white">
            No saved resources found
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
            Bookmark explanations, revision sheets, quizzes, or study plans to access them anytime.
          </p>
          <button
            onClick={() => navigate('/study')}
            className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-xl text-xs font-bold hover:bg-indigo-700 shadow-sm"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Start Learning</span>
          </button>
        </div>
      )}

      {/* Resource Cards Grid */}
      <div className="space-y-4">
        {filteredResources.map((item) => {
          const isExpanded = expandedId === item.id;
          const isCopied = copiedId === item.id;

          return (
            <div
              key={item.id}
              className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-5 shadow-xs hover:border-indigo-300 dark:hover:border-indigo-600 transition-all space-y-3"
            >
              <div className="flex flex-wrap items-start justify-between gap-2">
                <div className="flex items-start gap-2.5 min-w-0">
                  <div className="p-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 flex-shrink-0">
                    {getTypeIcon(item.type)}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] uppercase tracking-wider font-extrabold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-100 dark:border-indigo-800/60 px-2 py-0.2 rounded">
                        {getTypeLabel(item.type)}
                      </span>
                      {item.subject && (
                        <span className="text-[10px] font-semibold text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-700 px-2 py-0.2 rounded">
                          {item.subject}
                        </span>
                      )}
                    </div>
                    <h3 className="text-base font-bold text-slate-900 dark:text-white mt-1">
                      {item.title}
                    </h3>
                    <div className="text-[11px] text-slate-400 dark:text-slate-500 flex items-center gap-1 mt-0.5">
                      <Clock className="w-3 h-3" />
                      <span>Saved on {item.displayDate}</span>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => handleCopy(item.id, typeof item.content === 'string' ? item.content : JSON.stringify(item.content, null, 2))}
                    className="p-2 rounded-lg text-slate-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
                    title="Copy Content"
                  >
                    {isCopied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                  </button>

                  <button
                    type="button"
                    onClick={() => setExpandedId(isExpanded ? null : item.id)}
                    className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-50 dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:bg-slate-100 border border-slate-200 dark:border-slate-700 transition-colors"
                  >
                    {isExpanded ? 'Collapse' : 'View Content'}
                  </button>

                  <button
                    type="button"
                    onClick={() => handleDelete(item.id)}
                    className="p-2 rounded-lg text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 transition-colors"
                    title="Delete Bookmark"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Expanded Content Drawer */}
              {isExpanded && (
                <div className="pt-3 border-t border-slate-100 dark:border-slate-700 animate-fadeIn">
                  {typeof item.content === 'string' ? (
                    <AIResponse response={item.content} mode={item.metadata?.mode || 'explain'} />
                  ) : (
                    <pre className="p-4 bg-slate-900 text-slate-100 rounded-xl text-xs overflow-x-auto font-mono">
                      {JSON.stringify(item.content, null, 2)}
                    </pre>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
