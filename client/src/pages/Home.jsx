import React from 'react';
import { Link } from 'react-router-dom';
import {
  GraduationCap,
  Sparkles,
  ArrowRight,
  BookOpen,
  Dumbbell,
  FileText,
  Cpu,
  ShieldCheck,
  Zap,
  Code2,
  CheckCircle,
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

        <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-slate-900 tracking-tight leading-[1.15]">
          Learn smarter.{' '}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-indigo-500">
            Understand better.
          </span>
        </h1>

        <p className="mt-5 text-base sm:text-lg md:text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed">
          Your local AI-powered study companion for understanding concepts, practicing questions, and preparing for exams with open-weight intelligence.
        </p>

        {/* Core Principle Quote */}
        <div className="mt-6 inline-block bg-indigo-50/70 border border-indigo-100 rounded-full px-4 py-1.5 text-xs sm:text-sm font-medium text-indigo-800">
          ✨ Core principle: <span className="italic font-semibold">&ldquo;Don't just give the student the answer. Help the student understand it.&rdquo;</span>
        </div>

        {/* CTA Buttons */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <Link
            to="/study"
            className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl font-bold text-white bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 shadow-md shadow-indigo-200 hover:scale-[1.02] transition-all"
          >
            <span>Start Learning</span>
            <ArrowRight className="w-4 h-4" />
          </Link>

          <a
            href="#how-it-works"
            className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl font-semibold text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 transition-colors shadow-2xs"
          >
            <span>How It Works</span>
          </a>
        </div>
      </section>

      {/* Three Core Benefits (PRD §14) */}
      <section className="max-w-6xl mx-auto px-4">
        <div className="text-center mb-10">
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900">
            Built for Real Students
          </h2>
          <p className="text-slate-500 text-sm mt-1">
            Feels like a knowledgeable classmate or helpful senior rather than a generic chatbot.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1: Understand */}
          <div className="bg-white rounded-2xl border border-slate-200/90 p-6 shadow-xs hover:border-indigo-200 transition-all">
            <div className="w-12 h-12 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 mb-4">
              <BookOpen className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-2">1. Learn & Understand</h3>
            <p className="text-slate-600 text-sm leading-relaxed mb-4">
              Get plain-English explanations, intuitive real-world analogies, step-by-step logic breakdowns, and clear code examples without dense textbook jargon.
            </p>
            <ul className="text-xs text-slate-500 space-y-1.5">
              <li className="flex items-center gap-1.5">
                <CheckCircle className="w-3.5 h-3.5 text-indigo-600" />
                <span>Beginner-friendly mental models</span>
              </li>
              <li className="flex items-center gap-1.5">
                <CheckCircle className="w-3.5 h-3.5 text-indigo-600" />
                <span>Common student exam traps highlighted</span>
              </li>
            </ul>
          </div>

          {/* Card 2: Practice */}
          <div className="bg-white rounded-2xl border border-slate-200/90 p-6 shadow-xs hover:border-indigo-200 transition-all">
            <div className="w-12 h-12 rounded-xl bg-violet-50 border border-violet-100 flex items-center justify-center text-violet-600 mb-4">
              <Dumbbell className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-2">2. Practice & Test</h3>
            <p className="text-slate-600 text-sm leading-relaxed mb-4">
              Solidify concepts with targeted drills and quiz challenges that verify you truly understand before test day.
            </p>
            <ul className="text-xs text-slate-500 space-y-1.5">
              <li className="flex items-center gap-1.5">
                <CheckCircle className="w-3.5 h-3.5 text-violet-600" />
                <span>Multiple-choice quizzes with explanations</span>
              </li>
              <li className="flex items-center gap-1.5">
                <CheckCircle className="w-3.5 h-3.5 text-violet-600" />
                <span>Line-by-line code explanation</span>
              </li>
            </ul>
          </div>

          {/* Card 3: Revise */}
          <div className="bg-white rounded-2xl border border-slate-200/90 p-6 shadow-xs hover:border-indigo-200 transition-all">
            <div className="w-12 h-12 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600 mb-4">
              <FileText className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-2">3. Revise Fast</h3>
            <p className="text-slate-600 text-sm leading-relaxed mb-4">
              Condense hefty syllabus topics into high-yield exam sheets with key definitions, time complexities, and common questions.
            </p>
            <ul className="text-xs text-slate-500 space-y-1.5">
              <li className="flex items-center gap-1.5">
                <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
                <span>High-yield exam revision summaries</span>
              </li>
              <li className="flex items-center gap-1.5">
                <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
                <span>Quick takeaway bullet points</span>
              </li>
            </ul>
          </div>
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
                <div className="text-[11px] text-slate-400 mt-0.5">Port 5173</div>
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
              Easily configure <code className="font-mono text-indigo-300">OLLAMA_MODEL</code> in your <code className="font-mono text-indigo-300">.env</code> to switch between model sizes.
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
