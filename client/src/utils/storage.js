/**
 * LocalStorage management utilities for StudyBuddy AI.
 * Handles saved resources (bookmarks), recent session history, and dark mode theme.
 */

const SAVED_RESOURCES_KEY = 'studybuddy_saved_resources_v1';
const RECENT_SESSIONS_KEY = 'studybuddy_recent_sessions_v1';
const THEME_KEY = 'studybuddy_theme';

// ==================== SAVED RESOURCES ====================

export function getSavedResources() {
  try {
    const raw = localStorage.getItem(SAVED_RESOURCES_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (err) {
    console.error('Failed to load saved resources:', err);
    return [];
  }
}

export function saveResource({ type, title, topic, subject, content, metadata = {} }) {
  try {
    const resources = getSavedResources();
    const item = {
      id: `res_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
      type, // 'explanation' | 'quiz' | 'revision' | 'studyPlan'
      title: title || topic || 'Study Resource',
      topic: topic || '',
      subject: subject || '',
      content,
      metadata,
      savedAt: new Date().toISOString(),
      displayDate: new Date().toLocaleDateString(undefined, {
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      }),
    };

    const updated = [item, ...resources];
    localStorage.setItem(SAVED_RESOURCES_KEY, JSON.stringify(updated));
    return item;
  } catch (err) {
    console.error('Failed to save resource:', err);
    return null;
  }
}

export function removeSavedResource(id) {
  try {
    const resources = getSavedResources();
    const filtered = resources.filter((item) => item.id !== id);
    localStorage.setItem(SAVED_RESOURCES_KEY, JSON.stringify(filtered));
    return filtered;
  } catch (err) {
    console.error('Failed to remove resource:', err);
    return [];
  }
}

export function clearAllSavedResources() {
  try {
    localStorage.removeItem(SAVED_RESOURCES_KEY);
  } catch (err) {
    console.error('Failed to clear saved resources:', err);
  }
}

export function isResourceSaved(contentKey) {
  try {
    const resources = getSavedResources();
    return resources.some(
      (r) => (r.topic && r.topic === contentKey) || (r.title && r.title === contentKey)
    );
  } catch {
    return false;
  }
}

// ==================== RECENT SESSIONS ====================

export function getRecentSessions() {
  try {
    const raw = localStorage.getItem(RECENT_SESSIONS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function addRecentSession(topic, subject = '', mode = 'explain') {
  try {
    const sessions = getRecentSessions();
    const cleanTopic = String(topic).trim();
    if (!cleanTopic) return;

    const newSession = {
      id: Date.now(),
      topic: cleanTopic,
      subject: String(subject).trim(),
      mode,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    const updated = [
      newSession,
      ...sessions.filter((s) => s.topic.toLowerCase() !== cleanTopic.toLowerCase()),
    ].slice(0, 8);

    localStorage.setItem(RECENT_SESSIONS_KEY, JSON.stringify(updated));
    return updated;
  } catch (err) {
    console.error('Failed to save recent session:', err);
    return [];
  }
}

export function clearRecentSessions() {
  try {
    localStorage.removeItem(RECENT_SESSIONS_KEY);
  } catch (err) {
    console.error('Failed to clear recent sessions:', err);
  }
}

// ==================== THEME MANAGEMENT ====================

export function getStoredTheme() {
  try {
    const stored = localStorage.getItem(THEME_KEY);
    if (stored === 'dark' || stored === 'light') return stored;
    // Default to system preference
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      return 'dark';
    }
    return 'light';
  } catch {
    return 'light';
  }
}

export function setStoredTheme(theme) {
  try {
    localStorage.setItem(THEME_KEY, theme);
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  } catch (err) {
    console.error('Failed to set theme:', err);
  }
}
