import React, { useState, useEffect, useCallback } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Study from './pages/Study';
import Quiz from './pages/Quiz';
import Revision from './pages/Revision';
import StudyPlan from './pages/StudyPlan';
import SavedResources from './pages/SavedResources';
import { fetchHealth } from './services/api';
import { getStoredTheme, setStoredTheme } from './utils/storage';

export default function App() {
  const [health, setHealth] = useState(null);
  const [loadingHealth, setLoadingHealth] = useState(false);
  const [theme, setTheme] = useState(getStoredTheme);

  // Sync theme with html class and localStorage
  useEffect(() => {
    setStoredTheme(theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  const checkHealth = useCallback(async () => {
    setLoadingHealth(true);
    try {
      const data = await fetchHealth();
      setHealth(data);
    } catch (err) {
      console.error('Failed to query health:', err);
    } finally {
      setLoadingHealth(false);
    }
  }, []);

  useEffect(() => {
    checkHealth();
    // Poll every 30 seconds to keep connection status fresh
    const interval = setInterval(checkHealth, 30000);
    return () => clearInterval(interval);
  }, [checkHealth]);

  return (
    <BrowserRouter>
      <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors selection:bg-indigo-500 selection:text-white">
        <Navbar
          health={health}
          loadingHealth={loadingHealth}
          onRefreshHealth={checkHealth}
          theme={theme}
          onToggleTheme={toggleTheme}
        />

        <main className="flex-1">
          <Routes>
            <Route
              path="/"
              element={
                <Home
                  health={health}
                  loadingHealth={loadingHealth}
                  onRefreshHealth={checkHealth}
                />
              }
            />
            <Route
              path="/study"
              element={
                <Study
                  health={health}
                  onRefreshHealth={checkHealth}
                />
              }
            />
            <Route
              path="/quiz"
              element={
                <Quiz
                  health={health}
                  onRefreshHealth={checkHealth}
                />
              }
            />
            <Route
              path="/revision"
              element={
                <Revision
                  health={health}
                  onRefreshHealth={checkHealth}
                />
              }
            />
            <Route
              path="/study-plan"
              element={
                <StudyPlan
                  health={health}
                  onRefreshHealth={checkHealth}
                />
              }
            />
            <Route
              path="/saved"
              element={<SavedResources />}
            />
          </Routes>
        </main>

        <footer className="border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 py-6 mt-12 text-center text-xs text-slate-500 dark:text-slate-400 transition-colors">
          <div className="max-w-6xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
            <div>
              <span className="font-semibold text-slate-700 dark:text-slate-300">StudyBuddy AI</span> — Hacktoberfest 2026: Build for a Friend
            </div>
            <div>
              Powered by local open-weight AI (<span className="font-mono text-indigo-600 dark:text-indigo-400">Gemma + Ollama</span>)
            </div>
          </div>
        </footer>
      </div>
    </BrowserRouter>
  );
}
