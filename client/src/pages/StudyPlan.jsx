import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Calendar,
  Sparkles,
  Clock,
  CheckSquare,
  Square,
  Copy,
  Check,
  Bookmark,
  BookmarkCheck,
  RotateCcw,
  BookOpen,
  HelpCircle,
  CalendarDays,
} from 'lucide-react';
import { generateStudyPlan } from '../services/api';
import { saveResource } from '../utils/storage';
import LoadingState from '../components/LoadingState';
import ErrorMessage from '../components/ErrorMessage';

const DEFAULT_SUBJECTS = [
  {
    subject: 'Data Structures & Algorithms',
    topics: 'Arrays, Linked Lists, Stacks, Queues, Binary Trees, Graphs, Sorting Algorithms',
    hours: 3,
    days: 7,
  },
  {
    subject: 'Operating Systems',
    topics: 'Processes, Threads, CPU Scheduling, Deadlocks, Memory Management, Virtual Memory, File Systems',
    hours: 2,
    days: 6,
  },
  {
    subject: 'Database Management Systems (DBMS)',
    topics: 'ER Modeling, Relational Algebra, SQL Queries, Normalization, Transactions & ACID, Indexing',
    hours: 3,
    days: 5,
  },
];

export default function StudyPlan({ health }) {
  const navigate = useNavigate();

  const [subject, setSubject] = useState('');
  const [topics, setTopics] = useState('');
  const [hoursPerDay, setHoursPerDay] = useState(3);
  const [days, setDays] = useState(7);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [planData, setPlanData] = useState(null);
  const [completedTasks, setCompletedTasks] = useState({}); // { [`${day}-${taskIdx}`]: true }
  const [copied, setCopied] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleApplyPreset = (preset) => {
    setSubject(preset.subject);
    setTopics(preset.topics);
    setHoursPerDay(preset.hours);
    setDays(preset.days);
  };

  const handleGenerate = async (e) => {
    if (e) e.preventDefault();
    if (!subject.trim()) {
      setError('Please provide a subject name.');
      return;
    }

    setLoading(true);
    setError(null);
    setPlanData(null);
    setCompletedTasks({});
    setCopied(false);
    setSaved(false);

    try {
      const result = await generateStudyPlan({
        subject: subject.trim(),
        topics: topics.trim(),
        hoursPerDay,
        days,
      });

      if (!result.plan || !Array.isArray(result.plan.schedule) || result.plan.schedule.length === 0) {
        throw new Error('Received an empty study schedule from the AI. Please try again.');
      }

      setPlanData(result.plan);
    } catch (err) {
      console.error('Study plan generation failed:', err);
      setError(err.message || 'Unable to generate study plan.');
    } finally {
      setLoading(false);
    }
  };

  const toggleTask = (dayIdx, taskIdx) => {
    const key = `${dayIdx}-${taskIdx}`;
    setCompletedTasks((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const handleCopy = async () => {
    if (!planData) return;
    const textLines = [
      `📚 Study Plan: ${planData.subject}`,
      `⏱️ Target: ${planData.totalDays} Days (${planData.hoursPerDay} hours/day)`,
      `Summary: ${planData.summary}\n`,
      ...planData.schedule.map(
        (day) =>
          `Day ${day.day}: ${day.title} (${day.hours}h)\n` +
          day.tasks.map((t) => `  [ ] ${t}`).join('\n') +
          `\n  Checkpoint: ${day.reviewCheckpoint}\n`
      ),
    ];

    try {
      await navigator.clipboard.writeText(textLines.join('\n'));
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy plan:', err);
    }
  };

  const handleSave = () => {
    if (saved || !planData) return;
    saveResource({
      type: 'studyPlan',
      title: `PLAN: ${planData.subject} (${planData.totalDays} Days)`,
      topic: planData.subject,
      subject: planData.subject,
      content: JSON.stringify(planData),
      metadata: {
        totalDays: planData.totalDays,
        hoursPerDay: planData.hoursPerDay,
      },
    });
    setSaved(true);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-8">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 font-bold text-xs uppercase tracking-wider mb-1">
          <Calendar className="w-4 h-4" />
          <span>Personalized Roadmap</span>
        </div>
        <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          AI Study Schedule Planner
        </h1>
        <p className="text-slate-600 dark:text-slate-400 text-sm mt-1">
          Enter your upcoming syllabus and available daily hours. StudyBuddy generates a day-by-day practical schedule to get exam-ready.
        </p>
      </div>

      {/* Input Form */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-6 shadow-sm space-y-6">
        {/* Presets */}
        <div>
          <span className="text-xs font-semibold text-slate-400 dark:text-slate-500 mr-2">Quick course templates:</span>
          <div className="inline-flex flex-wrap gap-1.5 mt-1">
            {DEFAULT_SUBJECTS.map((preset, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleApplyPreset(preset)}
                className="text-xs bg-slate-100 dark:bg-slate-700/60 hover:bg-indigo-50 dark:hover:bg-indigo-950/60 hover:text-indigo-600 dark:hover:text-indigo-400 text-slate-700 dark:text-slate-300 px-2.5 py-1 rounded-lg border border-slate-200 dark:border-slate-600 transition-colors"
              >
                {preset.subject}
              </button>
            ))}
          </div>
        </div>

        <form onSubmit={handleGenerate} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                Subject Name
              </label>
              <input
                type="text"
                placeholder="e.g. Data Structures, Operating Systems"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                disabled={loading}
                className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:border-indigo-500 text-slate-900 dark:text-white placeholder-slate-400 text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                Target Days Until Exam: <span className="text-indigo-600 dark:text-indigo-400">{days} Days</span>
              </label>
              <input
                type="range"
                min="2"
                max="14"
                value={days}
                onChange={(e) => setDays(parseInt(e.target.value, 10))}
                disabled={loading}
                className="w-full accent-indigo-600 mt-2"
              />
              <div className="flex justify-between text-[10px] text-slate-400">
                <span>2 Days (Sprint)</span>
                <span>7 Days (Week)</span>
                <span>14 Days (Comprehensive)</span>
              </div>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
              Topics to Cover (comma-separated or list)
            </label>
            <textarea
              rows={3}
              placeholder="e.g. Arrays, Linked Lists, Stacks, Queues, Binary Trees, Graph Traversals, Sorting"
              value={topics}
              onChange={(e) => setTopics(e.target.value)}
              disabled={loading}
              className="w-full p-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:border-indigo-500 text-slate-900 dark:text-white placeholder-slate-400 text-sm resize-y"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
              Available Study Time: <span className="text-indigo-600 dark:text-indigo-400">{hoursPerDay} Hours / Day</span>
            </label>
            <input
              type="range"
              min="1"
              max="8"
              step="0.5"
              value={hoursPerDay}
              onChange={(e) => setHoursPerDay(parseFloat(e.target.value))}
              disabled={loading}
              className="w-full accent-indigo-600"
            />
            <div className="flex justify-between text-[10px] text-slate-400">
              <span>1 hr/day</span>
              <span>3 hrs/day</span>
              <span>8 hrs/day</span>
            </div>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={loading || !subject.trim()}
              className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-md shadow-indigo-200 dark:shadow-none transition-all disabled:opacity-50 flex items-center justify-center gap-2 text-sm"
            >
              <Sparkles className="w-4 h-4" />
              <span>{loading ? 'Synthesizing Study Schedule...' : 'Generate Study Plan'}</span>
            </button>
          </div>
        </form>
      </div>

      {/* Loading State */}
      {loading && <LoadingState />}

      {/* Error Message */}
      {error && !loading && (
        <ErrorMessage
          error={error}
          onRetry={handleGenerate}
          modelName={health?.localAi?.model || 'gemma3:4b'}
        />
      )}

      {/* Generated Plan Display */}
      {planData && !loading && (
        <div className="space-y-6 animate-fadeIn">
          {/* Summary Ribbon */}
          <div className="p-5 bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 flex flex-wrap items-center justify-between gap-4 shadow-sm">
            <div>
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                {planData.subject} Roadmap
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-xl">
                {planData.summary}
              </p>
              <div className="flex items-center gap-3 text-xs font-semibold text-slate-600 dark:text-slate-300 mt-2">
                <span className="flex items-center gap-1">
                  <CalendarDays className="w-3.5 h-3.5 text-indigo-500" />
                  {planData.totalDays} Total Days
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-indigo-500" />
                  {planData.hoursPerDay} hrs / day
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleCopy}
                className="inline-flex items-center gap-1 px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 hover:bg-slate-100 text-xs font-semibold text-slate-700 dark:text-slate-200"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Copied' : 'Copy'}</span>
              </button>

              <button
                type="button"
                onClick={handleSave}
                disabled={saved}
                className={`inline-flex items-center gap-1 px-3 py-2 rounded-xl border text-xs font-semibold transition-colors ${
                  saved
                    ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800'
                    : 'border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 hover:bg-slate-100 text-slate-700 dark:text-slate-200'
                }`}
              >
                {saved ? <BookmarkCheck className="w-3.5 h-3.5 text-emerald-600" /> : <Bookmark className="w-3.5 h-3.5" />}
                <span>{saved ? 'Saved' : 'Save Plan'}</span>
              </button>

              <button
                type="button"
                onClick={handleGenerate}
                className="inline-flex items-center gap-1 px-3 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-xs"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Regenerate</span>
              </button>
            </div>
          </div>

          {/* Day by Day Schedule Cards */}
          <div className="space-y-4">
            {planData.schedule.map((dayItem) => (
              <div
                key={dayItem.day}
                className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-5 shadow-xs hover:border-indigo-300 dark:hover:border-indigo-600 transition-all"
              >
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 dark:border-slate-700/60 pb-3 mb-4">
                  <div className="flex items-center gap-2">
                    <span className="w-7 h-7 rounded-lg bg-indigo-600 text-white font-black text-xs flex items-center justify-center">
                      D{dayItem.day}
                    </span>
                    <h3 className="text-base font-bold text-slate-900 dark:text-white">
                      {dayItem.title}
                    </h3>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-700/60 px-2 py-0.5 rounded-full">
                      ⏱️ {dayItem.hours} Hours
                    </span>
                    <button
                      type="button"
                      onClick={() =>
                        navigate(`/study?topic=${encodeURIComponent(dayItem.title)}&subject=${encodeURIComponent(planData.subject)}`)
                      }
                      className="inline-flex items-center gap-1 text-xs text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 font-semibold"
                    >
                      <BookOpen className="w-3.5 h-3.5" />
                      <span>Study Topics</span>
                    </button>
                  </div>
                </div>

                {/* Sub-topics list */}
                {dayItem.topics && dayItem.topics.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mb-3">
                    {dayItem.topics.map((t, tIdx) => (
                      <span
                        key={tIdx}
                        className="text-[11px] font-medium bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border border-indigo-100 dark:border-indigo-800/60 px-2 py-0.5 rounded-md"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                )}

                {/* Checklist Tasks */}
                <div className="space-y-2 mb-4">
                  {dayItem.tasks.map((task, taskIdx) => {
                    const isDone = completedTasks[`${dayItem.day}-${taskIdx}`];
                    return (
                      <button
                        key={taskIdx}
                        type="button"
                        onClick={() => toggleTask(dayItem.day, taskIdx)}
                        className={`w-full flex items-start gap-2.5 text-left p-2 rounded-lg transition-colors text-xs sm:text-sm ${
                          isDone
                            ? 'bg-emerald-50/60 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 line-through'
                            : 'hover:bg-slate-50 dark:hover:bg-slate-750 text-slate-700 dark:text-slate-200'
                        }`}
                      >
                        {isDone ? (
                          <CheckSquare className="w-4 h-4 text-emerald-600 dark:text-emerald-400 flex-shrink-0 mt-0.5" />
                        ) : (
                          <Square className="w-4 h-4 text-slate-400 dark:text-slate-500 flex-shrink-0 mt-0.5" />
                        )}
                        <span>{task}</span>
                      </button>
                    );
                  })}
                </div>

                {/* Review Checkpoint */}
                {dayItem.reviewCheckpoint && (
                  <div className="bg-amber-50/70 dark:bg-amber-950/30 border border-amber-200/80 dark:border-amber-800/60 rounded-xl p-3 text-xs text-amber-900 dark:text-amber-200 flex items-start gap-2">
                    <HelpCircle className="w-4 h-4 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold">Day Checkpoint: </span>
                      <span>{dayItem.reviewCheckpoint}</span>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
