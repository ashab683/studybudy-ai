import React from 'react';
import { Lightbulb, Scissors, Dumbbell, Trophy, FileText, Calendar } from 'lucide-react';

export const MODES = [
  {
    id: 'explain',
    label: 'Explain',
    tagline: 'Deep, structured understanding',
    icon: Lightbulb,
    directRoute: null,
  },
  {
    id: 'simplify',
    label: 'Simplify',
    tagline: 'Plain language rewrite',
    icon: Scissors,
    directRoute: null,
  },
  {
    id: 'practice',
    label: 'Practice',
    tagline: 'Easy to hard drills',
    icon: Dumbbell,
    directRoute: null,
  },
  {
    id: 'examRevision',
    label: 'Exam Revision',
    tagline: 'High-yield cheat sheet',
    icon: FileText,
    directRoute: '/revision',
  },
  {
    id: 'quiz',
    label: 'Quiz Me',
    tagline: 'Interactive 5-question test',
    icon: Trophy,
    directRoute: '/quiz',
  },
  {
    id: 'studyPlan',
    label: 'Study Plan',
    tagline: 'Targeted study schedule',
    icon: Calendar,
    directRoute: '/study-plan',
  },
];

export default function ModeSelector({ currentMode, onSelectMode }) {
  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-2">
        <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
          Learning Mode
        </label>
        <span className="text-xs text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-100 dark:border-indigo-800/60 px-2 py-0.5 rounded-full font-medium">
          All 6 Modes Active
        </span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2">
        {MODES.map((mode) => {
          const Icon = mode.icon;
          const isSelected = currentMode === mode.id;

          return (
            <button
              key={mode.id}
              type="button"
              onClick={() => onSelectMode(mode.id)}
              className={`relative flex flex-col items-center text-center p-3 rounded-xl border transition-all ${
                isSelected
                  ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm shadow-indigo-200 dark:shadow-none scale-[1.02]'
                  : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border-slate-200 dark:border-slate-700 hover:border-indigo-300 dark:hover:border-indigo-500 hover:bg-indigo-50/50 dark:hover:bg-slate-700/50'
              }`}
            >
              <Icon className={`w-5 h-5 mb-1.5 ${isSelected ? 'text-white' : 'text-indigo-600 dark:text-indigo-400'}`} />
              <span className="text-xs font-bold leading-tight">{mode.label}</span>
              <span className={`text-[10px] mt-0.5 leading-tight ${isSelected ? 'text-indigo-100' : 'text-slate-400 dark:text-slate-400'}`}>
                {mode.tagline.split(' ')[0]}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
