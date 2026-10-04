import React from 'react';
import { Lightbulb, Scissors, Dumbbell, Trophy, FileText, Calendar } from 'lucide-react';

export const MODES = [
  {
    id: 'explain',
    label: 'Explain',
    tagline: 'Deep, structured understanding',
    icon: Lightbulb,
    activeInPhase1: true,
  },
  {
    id: 'simplify',
    label: 'Simplify',
    tagline: 'Plain language rewrite',
    icon: Scissors,
    activeInPhase1: false,
  },
  {
    id: 'practice',
    label: 'Practice',
    tagline: 'Easy to hard drills',
    icon: Dumbbell,
    activeInPhase1: false,
  },
  {
    id: 'quiz',
    label: 'Quiz Me',
    tagline: '5-question challenge',
    icon: Trophy,
    activeInPhase1: false,
  },
  {
    id: 'examRevision',
    label: 'Exam Revision',
    tagline: 'High-yield cheat sheet',
    icon: FileText,
    activeInPhase1: false,
  },
  {
    id: 'studyPlan',
    label: 'Study Plan',
    tagline: 'Targeted study schedule',
    icon: Calendar,
    activeInPhase1: false,
  },
];

export default function ModeSelector({ currentMode, onSelectMode }) {
  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-2">
        <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
          Learning Mode
        </label>
        <span className="text-xs text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-full font-medium">
          Phase 1 Focus: Explain Mode
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
              onClick={() => {
                if (mode.activeInPhase1) {
                  onSelectMode(mode.id);
                }
              }}
              className={`relative flex flex-col items-center text-center p-3 rounded-xl border transition-all ${
                isSelected
                  ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm shadow-indigo-200 scale-[1.02]'
                  : mode.activeInPhase1
                  ? 'bg-white text-slate-700 border-slate-200 hover:border-indigo-300 hover:bg-indigo-50/50'
                  : 'bg-slate-50 text-slate-400 border-slate-200 cursor-not-allowed opacity-75'
              }`}
            >
              <Icon className={`w-5 h-5 mb-1.5 ${isSelected ? 'text-white' : mode.activeInPhase1 ? 'text-indigo-600' : 'text-slate-400'}`} />
              <span className="text-xs font-bold leading-tight">{mode.label}</span>
              <span className={`text-[10px] mt-0.5 leading-tight ${isSelected ? 'text-indigo-100' : 'text-slate-400'}`}>
                {mode.activeInPhase1 ? 'Active' : 'Phase 2'}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
