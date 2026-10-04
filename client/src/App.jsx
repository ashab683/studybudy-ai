import React, { useState, useEffect, useCallback } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Study from './pages/Study';
import { fetchHealth } from './services/api';

export default function App() {
  const [health, setHealth] = useState(null);
  const [loadingHealth, setLoadingHealth] = useState(false);

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
      <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900">
        <Navbar
          health={health}
          loadingHealth={loadingHealth}
          onRefreshHealth={checkHealth}
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
          </Routes>
        </main>

        <footer className="border-t border-slate-200 bg-white py-6 mt-12 text-center text-xs text-slate-500">
          <div className="max-w-6xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
            <div>
              <span className="font-semibold text-slate-700">StudyBuddy AI</span> — Hacktoberfest 2026: Build for a Friend
            </div>
            <div>
              Powered by local open-weight AI (<span className="font-mono text-indigo-600">Gemma + Ollama</span>)
            </div>
          </div>
        </footer>
      </div>
    </BrowserRouter>
  );
}
