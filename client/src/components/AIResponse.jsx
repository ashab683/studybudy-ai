import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Copy, Check, Sparkles, RotateCcw, HelpCircle, ShieldAlert, Cpu } from 'lucide-react';

export default function AIResponse({ response, model, onRetry, onFollowUp }) {
  const [copied, setCopied] = useState(false);

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

  return (
    <div className="w-full bg-white rounded-2xl border border-slate-200/90 shadow-sm overflow-hidden transition-all">
      {/* Response Header */}
      <div className="flex flex-wrap items-center justify-between gap-2 px-5 py-3.5 bg-slate-50/80 border-b border-slate-200/80">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-indigo-600 flex items-center justify-center text-white shadow-sm">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-800 flex items-center gap-1.5">
              StudyBuddy Explanation
            </h3>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {model && (
            <span className="inline-flex items-center gap-1 text-[11px] font-mono bg-indigo-50 text-indigo-700 border border-indigo-200/60 px-2 py-0.5 rounded-full">
              <Cpu className="w-3 h-3" />
              {model} (local)
            </span>
          )}

          <button
            type="button"
            onClick={handleCopy}
            className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium text-slate-600 hover:text-slate-900 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors shadow-2xs"
            title="Copy explanation"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-600" />
                <span className="text-emerald-700 font-semibold">Copied!</span>
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
      <div className="p-5 sm:p-7 text-slate-800 prose prose-slate max-w-none prose-headings:text-slate-900 prose-headings:font-bold prose-h3:text-base prose-h3:mt-5 prose-h3:mb-2 prose-p:leading-relaxed prose-p:text-sm sm:prose-p:text-base prose-li:text-sm sm:prose-li:text-base prose-code:font-mono prose-code:text-indigo-700 prose-code:bg-indigo-50/60 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-pre:bg-slate-900 prose-pre:text-slate-100 prose-pre:rounded-xl prose-pre:p-4">
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          components={{
            h1: ({ node, ...props }) => <h1 className="text-xl font-bold text-slate-900 mb-3 border-b pb-2" {...props} />,
            h2: ({ node, ...props }) => <h2 className="text-lg font-bold text-slate-900 mt-5 mb-2.5 flex items-center gap-2" {...props} />,
            h3: ({ node, ...props }) => <h3 className="text-base font-bold text-indigo-950 mt-4 mb-2 flex items-center gap-1.5" {...props} />,
            p: ({ node, ...props }) => <p className="text-slate-700 leading-relaxed my-2 text-sm sm:text-base" {...props} />,
            ul: ({ node, ...props }) => <ul className="list-disc pl-5 my-2 space-y-1 text-slate-700 text-sm sm:text-base" {...props} />,
            ol: ({ node, ...props }) => <ol className="list-decimal pl-5 my-2 space-y-1 text-slate-700 text-sm sm:text-base" {...props} />,
            blockquote: ({ node, ...props }) => (
              <blockquote className="border-l-4 border-indigo-400 bg-indigo-50/40 pl-4 py-2 italic text-slate-700 my-3 rounded-r-lg" {...props} />
            ),
            code({ node, inline, className, children, ...props }) {
              if (inline) {
                return (
                  <code className="bg-indigo-50 text-indigo-800 px-1.5 py-0.5 rounded text-xs font-mono font-medium" {...props}>
                    {children}
                  </code>
                );
              }
              return (
                <div className="relative group my-3">
                  <pre className="bg-slate-900 text-slate-100 p-4 rounded-xl overflow-x-auto text-xs sm:text-sm font-mono leading-normal shadow-inner">
                    <code {...props}>{children}</code>
                  </pre>
                </div>
              );
            },
            table: ({ node, ...props }) => (
              <div className="overflow-x-auto my-4 border border-slate-200 rounded-xl">
                <table className="min-w-full divide-y divide-slate-200 text-sm" {...props} />
              </div>
            ),
            th: ({ node, ...props }) => <th className="bg-slate-100 px-4 py-2 text-left font-semibold text-slate-800 text-xs" {...props} />,
            td: ({ node, ...props }) => <td className="px-4 py-2 text-slate-700 text-xs border-t border-slate-100" {...props} />,
          }}
        >
          {response}
        </ReactMarkdown>
      </div>

      {/* Suggested Follow-Ups (PRD §7) */}
      {onFollowUp && (
        <div className="px-5 py-3.5 bg-indigo-50/50 border-t border-slate-200">
          <div className="text-xs font-semibold text-indigo-900 mb-2 flex items-center gap-1.5">
            <HelpCircle className="w-3.5 h-3.5 text-indigo-600" />
            <span>Want to go deeper? Click a follow-up:</span>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {[
              'Give me another real-world example',
              'Explain this more simply like I am 12',
              'What are common exam questions on this?',
              'Explain the code line by line',
              'What is the difference between this and related concepts?',
            ].map((prompt, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => onFollowUp(prompt)}
                className="text-xs bg-white hover:bg-indigo-600 hover:text-white text-slate-700 px-3 py-1 rounded-lg border border-indigo-200 transition-colors shadow-2xs font-medium"
              >
                {prompt}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Footer / Safety Disclaimer (PRD §11) */}
      <div className="px-5 py-3 bg-slate-50 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-500">
        <div className="flex items-center gap-1.5 text-slate-400">
          <ShieldAlert className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
          <span>StudyBuddy AI can make mistakes. Verify important academic information with your course material or instructor.</span>
        </div>

        {onRetry && (
          <button
            type="button"
            onClick={onRetry}
            className="inline-flex items-center gap-1 text-slate-600 hover:text-indigo-600 font-medium transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Regenerate</span>
          </button>
        )}
      </div>
    </div>
  );
}
