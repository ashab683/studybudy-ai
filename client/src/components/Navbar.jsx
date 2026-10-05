import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  GraduationCap,
  Compass,
  BookOpen,
  Trophy,
  FileText,
  Calendar,
  Bookmark,
  Menu,
  X,
} from 'lucide-react';
import OllamaStatus from './OllamaStatus';
import ThemeToggle from './ThemeToggle';

export default function Navbar({ health, loadingHealth, onRefreshHealth, theme, onToggleTheme }) {
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { to: '/', label: 'Home', icon: Compass },
    { to: '/study', label: 'Study', icon: BookOpen },
    { to: '/quiz', label: 'Quiz', icon: Trophy },
    { to: '/revision', label: 'Revision', icon: FileText },
    { to: '/study-plan', label: 'Plan', icon: Calendar },
    { to: '/saved', label: 'Saved', icon: Bookmark },
  ];

  return (
    <header className="sticky top-0 z-40 w-full bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-3">
        {/* Brand */}
        <Link to="/" className="flex items-center gap-2.5 group flex-shrink-0">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-indigo-500 flex items-center justify-center text-white shadow-md shadow-indigo-100 dark:shadow-none group-hover:scale-105 transition-transform">
            <GraduationCap className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-1.5 font-bold text-slate-900 dark:text-white text-lg leading-tight">
              StudyBuddy <span className="text-indigo-600 dark:text-indigo-400 font-extrabold text-xs px-1.5 py-0.5 rounded bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-100 dark:border-indigo-800/60">AI</span>
            </div>
            <p className="text-[11px] text-slate-400 dark:text-slate-500 font-medium hidden md:block">Local Open-Weight Study Companion</p>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center gap-1">
          {navLinks.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.to;
            return (
              <Link
                key={item.to}
                to={item.to}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                  isActive
                    ? 'bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300'
                    : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Status + Theme Toggle + Mobile Menu Trigger */}
        <div className="flex items-center gap-2">
          {/* Ollama Status Badge */}
          <div className="hidden sm:flex items-center">
            <OllamaStatus health={health} loading={loadingHealth} onRefresh={onRefreshHealth} />
          </div>

          {/* Theme Toggle */}
          <ThemeToggle theme={theme} onToggle={onToggleTheme} />

          {/* Mobile Hamburger Button */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700"
            aria-label="Open navigation menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-4 pt-2 pb-4 space-y-2 animate-fadeIn">
          <div className="sm:hidden pb-2 mb-2 border-b border-slate-100 dark:border-slate-800 flex justify-center">
            <OllamaStatus health={health} loading={loadingHealth} onRefresh={onRefreshHealth} />
          </div>

          <div className="grid grid-cols-2 gap-1.5">
            {navLinks.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.to;
              return (
                <Link
                  key={item.to}
                  to={item.to}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center gap-2 px-3 py-2.5 rounded-xl text-xs font-semibold transition-colors ${
                    isActive
                      ? 'bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300'
                      : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                >
                  <Icon className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </div>
        </div>
      )}
    </header>
  );
}
