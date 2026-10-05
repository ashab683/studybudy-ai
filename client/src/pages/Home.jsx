import React from 'react';
import { Link } from 'react-router-dom';
import {
  Sparkles,
  ArrowRight,
  BookOpen,
  Dumbbell,
  FileText,
  Calendar,
  Cpu,
  ShieldCheck,
  Zap,
  Code2,
  CheckCircle,
  Trophy,
} from 'lucide-react';
import OllamaStatus from '../components/OllamaStatus';

export default function Home({ health, loadingHealth, onRefreshHealth }) {
  return (
    <div className="space-y-16 sm:space-y-24 pb-16">
      {/* Hero Section */}
      <section className="relative pt-8 sm:pt-14 text-center max-w-4xl mx-auto px-4">
        {/* Local AI pill banner */}
        <div className="inline-flex items-center gap-2 mb-6">
          <OllamaStatus health={health} loading={loadingHealth} onRefresh={onRefreshHealth} />
        </div>

        <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-[1.15]">
          Learn smarter.{' '}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-indigo-400">
            Understand better.
          </span>
        </h1>

        <p className="mt-5 text-base sm:text-lg md:text-xl text-slate-600 dark:text-slate-300 max-w-2xl mx-auto leading-relaxed">
          Your local AI-powered study companion for understanding difficult concepts, practicing questions, and preparing for exams with open-weight intelligence.
        </p>

        {/* Core Principle Quote */}
        <div className="mt-6 inline-block bg-indigo-50/70 dark:bg-indigo-950/60 border border-indigo-100 dark:border-indigo-800/60 rounded-full px-4 py-1.5 text-xs sm:text-sm font-medium text-indigo-800 dark:text-indigo-300">
          ✨ Core principle: <span className="italic font-semibold">&ldquo;Don't just give the student the answer. Help the student understand it.&rdquo;</span>
        </div>

        {/* CTA Buttons */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <Link
            to="/study"
            className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl font-bold text-white bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 shadow-md shadow-indigo-200 dark:shadow-none hover:scale-[1.02] transition-all"
          >
            <span>Start Learning</span>
            <ArrowRight className="w-4 h-4" />
          </Link>

          <Link
            to="/quiz"
            className="inline-flex items-center gap-2 px-5 py-3.5 rounded-xl font-semibold text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-750 transition-colors shadow-2xs"
          >
            <Trophy className="w-4 h-4 text-amber-500" />
            <span>Interactive Quiz</span>
          </Link>

          <Link
            to="/revision"
            className="inline-flex items-center gap-2 px-5 py-3.5 rounded-xl font-semibold text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-750 transition-colors shadow-2xs"
          >
            <FileText className="w-4 h-4 text-emerald-500" />
            <span>Revision Sheet</span>
          </Link>
        </div>
      </section>

      {/* Core Learning Features Grid (PRD §14) */}
      <section className="max-w-6xl mx-auto px-4">
        <div className="text-center mb-10">
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">
            The Complete Learning Loop
          </h2>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">
            Understand concepts, test yourself with quizzes, and consolidate exam points with local AI.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {/* Card 1: Understand */}
          <Link
            to="/study"
            className="group bg-white dark:bg-slate-800 rounded-2xl border border-slate-200/90 dark:border-slate-700/80 p-6 shadow-xs hover:border-indigo-400 dark:hover:border-indigo-500 hover:shadow-md transition-all flex flex-col justify-between"
          >
            <div>
              <div className="w-11 h-11 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-100 dark:border-indigo-800 flex items-center justify-center text-indigo-600 dark:text-indigo-400 mb-4 group-hover:scale-105 transition-transform">
                <BookOpen className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white mb-2">1. Understand</h3>
              <p className="text-slate-600 dark:text-slate-300 text-xs leading-relaxed mb-4">
                Plain-English explanations, real-world analogies, step-by-step logic breakdowns, and clear code examples.
              </p>
            </div>
            <div className="text-xs font-bold text-indigo-600 dark:text-indigo-400 flex items-center gap-1 group-hover:translate-x-1 transition-transform">
              <span>Try Explain & Simplify</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </div>
          </Link>

          {/* Card 2: Practice & Quiz */}
          <Link
            to="/quiz"
            className="group bg-white dark:bg-slate-800 rounded-2xl border border-slate-200/90 dark:border-slate-700/80 p-6 shadow-xs hover:border-amber-400 dark:hover:border-amber-500 hover:shadow-md transition-all flex flex-col justify-between"
          >
            <div>
              <div className="w-11 h-11 rounded-xl bg-amber-50 dark:bg-amber-950/60 border border-amber-100 dark:border-amber-800 flex items-center justify-center text-amber-600 dark:text-amber-400 mb-4 group-hover:scale-105 transition-transform">
                <Trophy className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white mb-2">2. Quiz Me</h3>
              <p className="text-slate-600 dark:text-slate-300 text-xs leading-relaxed mb-4">
                Interactive multiple-choice tests with instant answers, explanations, and mistake analysis.
              </p>
            </div>
            <div className="text-xs font-bold text-amber-600 dark:text-amber-400 flex items-center gap-1 group-hover:translate-x-1 transition-transform">
              <span>Take a Quiz Challenge</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </div>
          </Link>

          {/* Card 3: Revise */}
          <Link
            to="/revision"
            className="group bg-white dark:bg-slate-800 rounded-2xl border border-slate-200/90 dark:border-slate-700/80 p-6 shadow-xs hover:border-emerald-400 dark:hover:border-emerald-500 hover:shadow-md transition-all flex flex-col justify-between"
          >
            <div>
              <div className="w-11 h-11 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-100 dark:border-emerald-800 flex items-center justify-center text-emerald-600 dark:text-emerald-400 mb-4 group-hover:scale-105 transition-transform">
                <FileText className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white mb-2">3. Exam Revision</h3>
              <p className="text-slate-600 dark:text-slate-300 text-xs leading-relaxed mb-4">
                Condense heavy topics into high-yield exam cheat sheets with definitions, rules, and common questions.
              </p>
            </div>
            <div className="text-xs font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1 group-hover:translate-x-1 transition-transform">
              <span>Generate Revision Sheet</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </div>
          </Link>

          {/* Card 4: Study Plan */}
          <Link
            to="/study-plan"
            className="group bg-white dark:bg-slate-800 rounded-2xl border border-slate-200/90 dark:border-slate-700/80 p-6 shadow-xs hover:border-violet-400 dark:hover:border-violet-500 hover:shadow-md transition-all flex flex-col justify-between"
          >
            <div>
              <div className="w-11 h-11 rounded-xl bg-violet-50 dark:bg-violet-950/60 border border-violet-100 dark:border-violet-800 flex items-center justify-center text-violet-600 dark:text-violet-400 mb-4 group-hover:scale-105 transition-transform">
                <Calendar className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white mb-2">4. Study Plan</h3>
              <p className="text-slate-600 dark:text-slate-300 text-xs leading-relaxed mb-4">
                Create a customized day-by-day study schedule matched to your available hours and exam date.
              </p>
            </div>
            <div className="text-xs font-bold text-violet-600 dark:text-violet-400 flex items-center gap-1 group-hover:translate-x-1 transition-transform">
              <span>Build Study Schedule</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </div>
          </Link>
        </div>
      </section>

      {/* Local AI Architecture & Open Innovation (PRD §2, §8, §39) */}
      <section id="how-it-works" className="max-w-5xl mx-auto px-4">
        <div className="bg-gradient-to-b from-slate-900 to-slate-950 text-white rounded-3xl p-6 sm:p-10 shadow-xl border border-slate-800">
          <div className="flex items-center gap-2 text-indigo-400 text-xs font-semibold uppercase tracking-wider mb-2">
            <Cpu className="w-4 h-4" />
            <span>Architecture & Open Innovation</span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-extrabold text-white mb-4">
            How Local AI Works in StudyBuddy
          </h2>

          <p className="text-slate-300 text-sm sm:text-base leading-relaxed mb-8 max-w-3xl">
            StudyBuddy runs entirely on open-weight AI on your computer. Your questions are processed locally by Ollama using Google&apos;s open Gemma model — no cloud API keys, subscriptions, or remote inference needed.
          </p>

          {/* Architecture Pipeline Flow */}
          <div className="bg-slate-800/80 rounded-2xl p-4 sm:p-6 border border-slate-700/80 mb-8">
            <h4 className="text-xs font-mono font-semibold text-slate-400 uppercase tracking-wider mb-4">
              Inference Pipeline Flow:
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-5 gap-3 text-center">
              <div className="bg-slate-900/90 rounded-xl p-3 border border-slate-700">
                <div className="text-xs text-indigo-400 font-mono font-bold">1. Frontend</div>
                <div className="text-sm font-semibold mt-1">React + Vite</div>
                <div className="text-[11px] text-slate-400 mt-0.5">Port 5173 / 3001</div>
              </div>
              <div className="flex items-center justify-center text-slate-500 font-bold text-lg">
                →
              </div>
              <div className="bg-slate-900/90 rounded-xl p-3 border border-slate-700">
                <div className="text-xs text-indigo-400 font-mono font-bold">2. Backend</div>
                <div className="text-sm font-semibold mt-1">Express API</div>
                <div className="text-[11px] text-slate-400 mt-0.5">Port 3001</div>
              </div>
              <div className="flex items-center justify-center text-slate-500 font-bold text-lg">
                →
              </div>
              <div className="bg-slate-900/90 rounded-xl p-3 border border-indigo-500/50 bg-indigo-950/20">
                <div className="text-xs text-indigo-300 font-mono font-bold">3. Local Engine</div>
                <div className="text-sm font-semibold text-white mt-1">Ollama + Gemma</div>
                <div className="text-[11px] text-indigo-300 mt-0.5">Port 11434</div>
              </div>
            </div>
          </div>

          {/* 3 Pillars of Open Innovation */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs text-slate-300">
            <div className="p-3.5 rounded-xl bg-slate-800/50 border border-slate-700/50">
              <div className="font-semibold text-white text-sm mb-1 flex items-center gap-1.5">
                <Zap className="w-4 h-4 text-amber-400" />
                <span>Zero Cloud Dependency</span>
              </div>
              StudyBuddy works completely offline on your hardware once models are installed.
            </div>

            <div className="p-3.5 rounded-xl bg-slate-800/50 border border-slate-700/50">
              <div className="font-semibold text-white text-sm mb-1 flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>Open Weights & Control</span>
              </div>
              Transparent model weights and prompt templates you can audit, customize, and extend.
            </div>

            <div className="p-3.5 rounded-xl bg-slate-800/50 border border-slate-700/50">
              <div className="font-semibold text-white text-sm mb-1 flex items-center gap-1.5">
                <Code2 className="w-4 h-4 text-indigo-400" />
                <span>Configurable Models</span>
              </div>
              Easily configure <code className="font-mono text-indigo-300">OLLAMA_MODEL</code> in your <code className="font-mono text-indigo-300">.env</code> to experiment with different local models.
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
