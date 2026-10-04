import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { BookOpen, GraduationCap, Compass, Sparkles } from 'lucide-react';
import OllamaStatus from './OllamaStatus';

export default function Navbar({ health, loadingHealth, onRefreshHealth }) {
  const location = useLocation();

  const navLinks = [
    { to: '/', label: 'Home', icon: Compass },
    { to: '/study', label: 'Study Assistant', icon: BookOpen },
  ];

  return (
    <header className="sticky top-0 z-40 w-full bg-white/90 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
        {/* Brand */}
        <Link to="/" className="flex items-center gap-2.5 group">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-indigo-500 flex items-center justify-center text-white shadow-md shadow-indigo-100 group-hover:scale-105 transition-transform">
            <GraduationCap className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-1.5 font-bold text-slate-900 text-lg leading-tight">
              StudyBuddy <span className="text-indigo-600 font-extrabold text-xs px-1.5 py-0.5 rounded bg-indigo-50 border border-indigo-100">AI</span>
            </div>
            <p className="text-xs text-slate-400 font-medium hidden sm:block">Local Open-Weight Study Companion</p>
          </div>
        </Link>

        {/* Navigation */}
        <nav className="flex items-center gap-1 sm:gap-2">
          {navLinks.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.to;
            return (
              <Link
                key={item.to}
                to={item.to}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-indigo-50 text-indigo-700 font-semibold'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Ollama Status Badge */}
        <div className="hidden md:flex items-center">
          <OllamaStatus health={health} loading={loadingHealth} onRefresh={onRefreshHealth} />
        </div>
      </div>
    </header>
  );
}
