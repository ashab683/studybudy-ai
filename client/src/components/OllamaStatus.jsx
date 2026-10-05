import React from 'react';
import { Cpu, RefreshCw } from 'lucide-react';

export default function OllamaStatus({ health, loading, onRefresh }) {
  const isConnected = health?.localAi?.connected;
  const modelName = health?.localAi?.model || 'gemma3:4b';
  const modelInstalled = health?.localAi?.modelInstalled;

  return (
    <div className="flex items-center gap-1.5 sm:gap-2">
      <div
        className={`inline-flex items-center gap-2 px-2.5 sm:px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${
          isConnected && modelInstalled
            ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800/60'
            : isConnected && !modelInstalled
            ? 'bg-amber-50 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300 border-amber-200 dark:border-amber-800/60'
            : 'bg-rose-50 dark:bg-rose-950/40 text-rose-800 dark:text-rose-300 border-rose-200 dark:border-rose-800/60'
        }`}
        title={
          isConnected && modelInstalled
            ? `Local AI connected (${modelName}) via Ollama`
            : isConnected
            ? `Ollama running, but ${modelName} needs to be pulled`
            : health?.localAi?.error || 'Local Ollama service offline'
        }
      >
        <span className="relative flex h-2 w-2">
          {isConnected && modelInstalled && (
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
          )}
          <span
            className={`relative inline-flex rounded-full h-2 w-2 ${
              isConnected && modelInstalled
                ? 'bg-emerald-500'
                : isConnected
                ? 'bg-amber-500'
                : 'bg-rose-500'
            }`}
          ></span>
        </span>

        <span className="flex items-center gap-1 font-semibold text-[11px] sm:text-xs">
          <Cpu className="w-3.5 h-3.5" />
          {isConnected && modelInstalled ? (
            <span>
              <span className="hidden sm:inline">Local AI </span>Connected <span className="text-emerald-700 dark:text-emerald-400 font-mono font-normal">({modelName})</span>
            </span>
          ) : isConnected ? (
            <span>Model Missing <span className="font-mono">({modelName})</span></span>
          ) : (
            <span>Local AI Offline</span>
          )}
        </span>
      </div>

      {onRefresh && (
        <button
          onClick={onRefresh}
          disabled={loading}
          className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors disabled:opacity-50"
          title="Refresh Ollama Connection Status"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
        </button>
      )}
    </div>
  );
}
