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
 * Modes: 'explain', 'simplify', 'practice', 'examRevision'
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

/**
 * Request an interactive multiple-choice quiz from local Gemma AI.
 * @param {Object} params
 * @param {string} params.topic - Topic or concept for the quiz
 * @param {string} [params.difficulty='medium'] - 'easy' | 'medium' | 'hard'
 * @param {number} [params.questionCount=5] - Number of questions (2..8)
 */
export async function generateQuiz({ topic, difficulty = 'medium', questionCount = 5 }) {
  const res = await fetch(`${API_BASE}/ai/quiz`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ topic, difficulty, questionCount }),
  });

  const data = await res.json();

  if (!res.ok) {
    const err = new Error(data.error || 'Failed to generate quiz. Please try again.');
    err.code = data.code || 'QUIZ_FAILED';
    err.status = res.status;
    throw err;
  }

  return data;
}

/**
 * Request a day-by-day study schedule from local Gemma AI.
 * @param {Object} params
 * @param {string} params.subject - Main course or subject name
 * @param {string|string[]} params.topics - Topics to cover
 * @param {number} [params.hoursPerDay=3] - Study hours per day
 * @param {number} [params.days=7] - Total days until exam
 */
export async function generateStudyPlan({ subject, topics, hoursPerDay = 3, days = 7 }) {
  const res = await fetch(`${API_BASE}/ai/study-plan`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ subject, topics, hoursPerDay, days }),
  });

  const data = await res.json();

  if (!res.ok) {
    const err = new Error(data.error || 'Failed to generate study plan. Please try again.');
    err.code = data.code || 'STUDY_PLAN_FAILED';
    err.status = res.status;
    throw err;
  }

  return data;
}
