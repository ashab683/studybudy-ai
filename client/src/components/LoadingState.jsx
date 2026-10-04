import React, { useState, useEffect } from 'react';
import { Loader2, Sparkles, BookOpen, Brain, Lightbulb } from 'lucide-react';

const ROTATING_MESSAGES = [
  { text: 'Breaking the topic down into simple steps...', icon: Brain },
  { text: 'Finding an intuitive real-world analogy...', icon: Lightbulb },
  { text: 'Crafting clean, beginner-friendly explanations...', icon: BookOpen },
  { text: 'Checking for common student pitfalls and exam traps...', icon: Sparkles },
  { text: 'Preparing your personalized study notes...', icon: BookOpen },
];

export default function LoadingState() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % ROTATING_MESSAGES.length);
    }, 2800);
    return () => clearInterval(timer);
  }, []);

  const current = ROTATING_MESSAGES[index];
  const Icon = current.icon;

  return (
    <div className="w-full bg-white rounded-2xl border border-indigo-100 p-8 shadow-sm flex flex-col items-center justify-center text-center animate-pulse">
      {/* Icon / Spinner */}
      <div className="relative mb-4">
        <div className="w-14 h-14 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 shadow-inner">
          <Icon className="w-7 h-7 text-indigo-600 transition-all duration-300 transform scale-110" />
        </div>
        <div className="absolute -bottom-1 -right-1 bg-white p-1 rounded-full shadow">
          <Loader2 className="w-4 h-4 text-indigo-600 animate-spin" />
        </div>
      </div>

      {/* Main Title */}
      <h3 className="text-base sm:text-lg font-bold text-slate-800 mb-1">
        StudyBuddy is thinking...
      </h3>

      {/* Rotating Message */}
      <p className="text-xs sm:text-sm text-indigo-600 font-medium transition-all duration-500 min-h-[20px]">
        {current.text}
      </p>

      {/* Local AI notice */}
      <div className="mt-4 px-3 py-1 rounded-full bg-slate-50 border border-slate-200 text-[11px] text-slate-400">
        Inference is running locally on your computer via Ollama & Gemma
      </div>
    </div>
  );
}
