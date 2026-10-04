import React from 'react';
import { Cpu, CheckCircle2, AlertCircle, RefreshCw } from 'lucide-react';

export default function OllamaStatus({ health, loading, onRefresh }) {
  const isConnected = health?.localAi?.connected;
  const modelName = health?.localAi?.model || 'gemma3:4b';
  const modelInstalled = health?.localAi?.modelInstalled;

  return (
    <div className="flex items-center gap-2">
      <div
        className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${
          isConnected && modelInstalled
            ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
            : isConnected && !modelInstalled
            ? 'bg-amber-50 text-amber-800 border-amber-200'
            : 'bg-rose-50 text-rose-800 border-rose-200'
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

        <span className="flex items-center gap-1 font-semibold">
          <Cpu className="w-3.5 h-3.5" />
          {isConnected && modelInstalled ? (
            <span>Local AI Connected <span className="text-emerald-700 font-mono font-normal">({modelName})</span></span>
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
          className="p-1 text-slate-400 hover:text-slate-600 rounded-md transition-colors disabled:opacity-50"
          title="Refresh Ollama Connection Status"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
        </button>
      )}
    </div>
  );
}
