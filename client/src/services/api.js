/**
 * StudyBuddy AI Client API Service
 * Centralized API calls to the Express backend.
 */

const API_BASE = '/api';

/**
 * Fetch local AI and backend health status.
 */
export async function fetchHealth() {
  try {
    const res = await fetch(`${API_BASE}/health`);
    if (!res.ok) {
      throw new Error(`Health check returned status ${res.status}`);
    }
    return await res.json();
  } catch (err) {
    return {
      status: 'error',
      localAi: {
        connected: false,
        error: err.message || 'Cannot reach StudyBuddy backend server.',
      },
    };
  }
}

/**
 * Send a study request to the local AI.
 * @param {Object} params
 * @param {string} params.message - The question, topic, or concept
 * @param {string} [params.mode='explain'] - The learning mode
 * @param {string} [params.subject=''] - Optional subject context
 */
export async function askStudyBuddy({ message, mode = 'explain', subject = '' }) {
  const res = await fetch(`${API_BASE}/ai/ask`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ message, mode, subject }),
  });

  const data = await res.json();

  if (!res.ok) {
    const err = new Error(data.error || 'Failed to get an explanation from StudyBuddy.');
    err.code = data.code || 'REQUEST_FAILED';
    err.status = res.status;
    throw err;
  }

  return data;
}
