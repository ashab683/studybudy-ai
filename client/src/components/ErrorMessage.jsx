import React from 'react';
import { AlertTriangle, RefreshCw, Terminal, HelpCircle } from 'lucide-react';

export default function ErrorMessage({ error, onRetry, modelName = 'gemma3:4b' }) {
  if (!error) return null;

  const isOllamaOffline =
    error.includes('cannot connect') ||
    error.includes('offline') ||
    error.includes('ECONNREFUSED');

  const isModelMissing =
    error.includes('not installed') ||
    error.includes('MODEL_NOT_FOUND');

  const isTimeout =
    error.includes('longer than expected') ||
    error.includes('timed out');

  return (
    <div className="w-full bg-rose-50/70 border border-rose-200 rounded-2xl p-5 sm:p-6 text-slate-800 shadow-sm">
      <div className="flex items-start gap-3.5">
        <div className="w-10 h-10 rounded-xl bg-rose-100 border border-rose-200 flex-shrink-0 flex items-center justify-center text-rose-600">
          <AlertTriangle className="w-5 h-5" />
        </div>

        <div className="flex-1 min-w-0">
          <h4 className="text-sm sm:text-base font-bold text-rose-900 mb-1">
            {isOllamaOffline
              ? 'Local AI Offline'
              : isModelMissing
              ? 'Model Not Installed'
              : isTimeout
              ? 'Request Timed Out'
              : 'Unable to Generate Explanation'}
          </h4>

          <p className="text-xs sm:text-sm text-rose-700 mb-3">
            {error}
          </p>

          {/* Actionable Solution Box */}
          {(isOllamaOffline || isModelMissing) && (
            <div className="bg-white/80 rounded-xl p-3 border border-rose-100 text-xs font-mono text-slate-700 space-y-1.5 mb-3">
              <div className="flex items-center gap-1.5 text-slate-500 font-sans font-semibold">
                <Terminal className="w-3.5 h-3.5 text-indigo-600" />
                <span>Fix it with this command:</span>
              </div>
              {isOllamaOffline && (
                <div className="bg-slate-900 text-emerald-400 p-2 rounded-lg select-all">
                  ollama serve
                </div>
              )}
              {isModelMissing && (
                <div className="bg-slate-900 text-emerald-400 p-2 rounded-lg select-all">
                  ollama pull {modelName}
                </div>
              )}
            </div>
          )}

          {/* Action buttons */}
          <div className="flex flex-wrap items-center gap-2 pt-1">
            {onRetry && (
              <button
                type="button"
                onClick={onRetry}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-rose-600 hover:bg-rose-700 text-white transition-colors shadow-sm"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Try Again</span>
              </button>
            )}
            <a
              href="https://ollama.com"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium text-slate-600 hover:text-slate-900 bg-white border border-slate-200 transition-colors"
            >
              <HelpCircle className="w-3.5 h-3.5" />
              <span>Ollama Docs</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
