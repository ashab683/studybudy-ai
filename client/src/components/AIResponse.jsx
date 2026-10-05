import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import {
  Copy,
  Check,
  Sparkles,
  RotateCcw,
  HelpCircle,
  ShieldAlert,
  Cpu,
  Bookmark,
  BookmarkCheck,
  Trophy,
  FileText,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { saveResource, isResourceSaved } from '../utils/storage';

export default function AIResponse({
  response,
  model,
  mode = 'explain',
  topic = '',
  subject = '',
  onRetry,
  onFollowUp,
}) {
  const [copied, setCopied] = useState(false);
  const [saved, setSaved] = useState(() => isResourceSaved(topic || 'StudyBuddy Explanation'));
  const navigate = useNavigate();

  if (!response) return null;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(response);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy text:', err);
    }
  };

  const handleSave = () => {
    if (saved) return;
    const res = saveResource({
      type: mode === 'examRevision' ? 'revision' : 'explanation',
      title: topic ? `${mode.toUpperCase()}: ${topic}` : 'StudyBuddy Explanation',
      topic,
      subject,
      content: response,
      metadata: { model, mode },
    });
    if (res) {
      setSaved(true);
    }
  };

  return (
    <div className="w-full bg-white dark:bg-slate-800/95 rounded-2xl border border-slate-200/90 dark:border-slate-700/80 shadow-sm overflow-hidden transition-all">
      {/* Response Header */}
      <div className="flex flex-wrap items-center justify-between gap-2 px-5 py-3.5 bg-slate-50/80 dark:bg-slate-900/60 border-b border-slate-200/80 dark:border-slate-700/80">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-indigo-600 flex items-center justify-center text-white shadow-sm">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100 flex items-center gap-1.5">
              StudyBuddy {mode === 'simplify' ? 'Simplified Note' : mode === 'practice' ? 'Practice Set' : mode === 'examRevision' ? 'Exam Revision Sheet' : 'Explanation'}
            </h3>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {model && (
            <span className="inline-flex items-center gap-1 text-[11px] font-mono bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border border-indigo-200/60 dark:border-indigo-800/60 px-2 py-0.5 rounded-full">
              <Cpu className="w-3 h-3" />
              {model} (local)
            </span>
          )}

          {/* Bookmark Button */}
          <button
            type="button"
            onClick={handleSave}
            disabled={saved}
            className={`inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium rounded-lg border transition-colors ${
              saved
                ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800'
                : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white bg-white dark:bg-slate-850 border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700'
            }`}
            title={saved ? 'Saved in Resources' : 'Save to Resources'}
          >
            {saved ? (
              <>
                <BookmarkCheck className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                <span className="font-semibold">Saved</span>
              </>
            ) : (
              <>
                <Bookmark className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400" />
                <span>Save</span>
              </>
            )}
          </button>

          {/* Copy Button */}
          <button
            type="button"
            onClick={handleCopy}
            className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white bg-white dark:bg-slate-850 border border-slate-200 dark:border-slate-700 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors shadow-2xs"
            title="Copy explanation"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                <span className="text-emerald-700 dark:text-emerald-400 font-semibold">Copied!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>Copy</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Markdown Content */}
      <div className="p-5 sm:p-7 text-slate-800 dark:text-slate-200 prose prose-slate dark:prose-invert max-w-none prose-headings:text-slate-900 dark:prose-headings:text-white prose-headings:font-bold prose-h3:text-base prose-h3:mt-5 prose-h3:mb-2 prose-p:leading-relaxed prose-p:text-sm sm:prose-p:text-base prose-li:text-sm sm:prose-li:text-base prose-code:font-mono prose-code:text-indigo-700 dark:prose-code:text-indigo-300 prose-code:bg-indigo-50/60 dark:prose-code:bg-indigo-950/60 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-pre:bg-slate-900 dark:prose-pre:bg-slate-950 prose-pre:text-slate-100 prose-pre:rounded-xl prose-pre:p-4">
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          components={{
            h1: ({ node, ...props }) => <h1 className="text-xl font-bold text-slate-900 dark:text-white mb-3 border-b border-slate-200 dark:border-slate-700 pb-2" {...props} />,
            h2: ({ node, ...props }) => <h2 className="text-lg font-bold text-slate-900 dark:text-white mt-5 mb-2.5 flex items-center gap-2" {...props} />,
            h3: ({ node, ...props }) => <h3 className="text-base font-bold text-indigo-950 dark:text-indigo-200 mt-4 mb-2 flex items-center gap-1.5" {...props} />,
            p: ({ node, ...props }) => <p className="text-slate-700 dark:text-slate-300 leading-relaxed my-2 text-sm sm:text-base" {...props} />,
            ul: ({ node, ...props }) => <ul className="list-disc pl-5 my-2 space-y-1 text-slate-700 dark:text-slate-300 text-sm sm:text-base" {...props} />,
            ol: ({ node, ...props }) => <ol className="list-decimal pl-5 my-2 space-y-1 text-slate-700 dark:text-slate-300 text-sm sm:text-base" {...props} />,
            blockquote: ({ node, ...props }) => (
              <blockquote className="border-l-4 border-indigo-400 dark:border-indigo-500 bg-indigo-50/40 dark:bg-indigo-950/40 pl-4 py-2 italic text-slate-700 dark:text-slate-300 my-3 rounded-r-lg" {...props} />
            ),
            code({ node, inline, className, children, ...props }) {
              if (inline) {
                return (
                  <code className="bg-indigo-50 dark:bg-indigo-950/70 text-indigo-800 dark:text-indigo-300 px-1.5 py-0.5 rounded text-xs font-mono font-medium" {...props}>
                    {children}
                  </code>
                );
              }
              return (
                <div className="relative group my-3">
                  <pre className="bg-slate-900 dark:bg-slate-950 text-slate-100 p-4 rounded-xl overflow-x-auto text-xs sm:text-sm font-mono leading-normal shadow-inner border border-slate-800">
                    <code {...props}>{children}</code>
                  </pre>
                </div>
              );
            },
            table: ({ node, ...props }) => (
              <div className="overflow-x-auto my-4 border border-slate-200 dark:border-slate-700 rounded-xl">
                <table className="min-w-full divide-y divide-slate-200 dark:divide-slate-700 text-sm" {...props} />
              </div>
            ),
            th: ({ node, ...props }) => <th className="bg-slate-100 dark:bg-slate-800 px-4 py-2 text-left font-semibold text-slate-800 dark:text-slate-200 text-xs" {...props} />,
            td: ({ node, ...props }) => <td className="px-4 py-2 text-slate-700 dark:text-slate-300 text-xs border-t border-slate-100 dark:border-slate-800" {...props} />,
          }}
        >
          {response}
        </ReactMarkdown>
      </div>

      {/* Suggested Follow-Ups (PRD §7) */}
      <div className="px-5 py-3.5 bg-indigo-50/50 dark:bg-indigo-950/30 border-t border-slate-200 dark:border-slate-700">
        <div className="text-xs font-semibold text-indigo-900 dark:text-indigo-300 mb-2 flex items-center justify-between">
          <span className="flex items-center gap-1.5">
            <HelpCircle className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
            <span>Want to go deeper? Quick actions:</span>
          </span>
          {topic && (
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => navigate(`/quiz?topic=${encodeURIComponent(topic)}`)}
                className="inline-flex items-center gap-1 text-[11px] text-indigo-700 dark:text-indigo-300 hover:text-indigo-900 font-bold bg-white dark:bg-slate-800 px-2 py-0.5 rounded border border-indigo-200 dark:border-indigo-800 shadow-2xs"
              >
                <Trophy className="w-3 h-3 text-amber-500" />
                <span>Quiz Me On This</span>
              </button>
              <button
                type="button"
                onClick={() => navigate(`/revision?topic=${encodeURIComponent(topic)}`)}
                className="inline-flex items-center gap-1 text-[11px] text-indigo-700 dark:text-indigo-300 hover:text-indigo-900 font-bold bg-white dark:bg-slate-800 px-2 py-0.5 rounded border border-indigo-200 dark:border-indigo-800 shadow-2xs"
              >
                <FileText className="w-3 h-3 text-emerald-500" />
                <span>Revision Sheet</span>
              </button>
            </div>
          )}
        </div>

        {onFollowUp && (
          <div className="flex flex-wrap gap-1.5">
            {[
              'Give me another real-world analogy',
              'Explain this more simply like I am 12',
              'What are the most common exam questions on this?',
              'Explain the code logic line by line',
              'What is the difference between this and related concepts?',
            ].map((prompt, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => onFollowUp(prompt)}
                className="text-xs bg-white dark:bg-slate-800 hover:bg-indigo-600 dark:hover:bg-indigo-600 hover:text-white text-slate-700 dark:text-slate-300 px-3 py-1 rounded-lg border border-indigo-200 dark:border-slate-700 transition-colors shadow-2xs font-medium"
              >
                {prompt}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Footer / Safety Disclaimer (PRD §11) */}
      <div className="px-5 py-3 bg-slate-50 dark:bg-slate-900/60 border-t border-slate-200 dark:border-slate-700 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-500 dark:text-slate-400">
        <div className="flex items-center gap-1.5 text-slate-400 dark:text-slate-500">
          <ShieldAlert className="w-3.5 h-3.5 flex-shrink-0" />
          <span>StudyBuddy AI can make mistakes. Verify important academic information with your course instructor.</span>
        </div>

        {onRetry && (
          <button
            type="button"
            onClick={onRetry}
            className="inline-flex items-center gap-1 text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 font-medium transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Regenerate</span>
          </button>
        )}
      </div>
    </div>
  );
}
