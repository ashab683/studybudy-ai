/**
 * JSON response parser and normalizer for AI outputs.
 * Robustly handles Markdown code blocks, preamble text, trailing commas, and schema validation.
 */

/**
 * Extracts and parses a JSON object from text that may contain markdown fences or surrounding chatter.
 * @param {string} text
 * @returns {object|null}
 */
export function extractJson(text) {
  if (!text || typeof text !== 'string') return null;

  let cleanText = text.trim();

  // 1. Look for ```json ... ``` or ``` ... ``` code blocks
  const codeBlockRegex = /```(?:json)?\s*([\s\S]*?)\s*```/i;
  const match = cleanText.match(codeBlockRegex);
  if (match && match[1]) {
    cleanText = match[1].trim();
  } else {
    // 2. Or find the first '{' and the last '}'
    const firstBrace = cleanText.indexOf('{');
    const lastBrace = cleanText.lastIndexOf('}');
    if (firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) {
      cleanText = cleanText.substring(firstBrace, lastBrace + 1);
    }
  }

  // 3. Remove trailing commas before closing braces/brackets (common LLM JSON quirk)
  cleanText = cleanText.replace(/,\s*([}\]])/g, '$1');

  try {
    return JSON.parse(cleanText);
  } catch (err) {
    // Fallback: attempt to trim line-breaks or unescaped control chars
    try {
      const sanitized = cleanText.replace(/[\u0000-\u001F]+/g, ' ');
      return JSON.parse(sanitized);
    } catch (e2) {
      console.warn('[JSON Parser] Failed to parse JSON from AI response:', err.message);
      return null;
    }
  }
}

/**
 * Validates and normalizes quiz JSON structure.
 * @param {object|string} raw
 * @param {string} fallbackTopic
 * @returns {object} { title, topic, difficulty, questions: [...] }
 */
export function normalizeQuizData(raw, fallbackTopic = 'Study Topic') {
  const data = typeof raw === 'string' ? extractJson(raw) : raw;

  if (!data || typeof data !== 'object') {
    throw new Error('AI did not return a valid quiz structure.');
  }

  const title = (data.title && typeof data.title === 'string')
    ? data.title.trim()
    : `${fallbackTopic} Practice Quiz`;

  const rawQuestions = Array.isArray(data.questions)
    ? data.questions
    : Array.isArray(data.quiz)
    ? data.quiz
    : [];

  if (rawQuestions.length === 0) {
    throw new Error('No quiz questions were found in the AI response.');
  }

  const questions = rawQuestions.map((q, idx) => {
    const questionText = q.question || q.questionText || q.q || `Question ${idx + 1}`;
    let options = Array.isArray(q.options) ? q.options.map(String) : [];

    // Ensure at least 2 options exist
    if (options.length < 2) {
      options = ['True', 'False'];
    }

    // Determine correct answer index
    let correctAnswer = 0;
    if (typeof q.correctAnswer === 'number' && q.correctAnswer >= 0 && q.correctAnswer < options.length) {
      correctAnswer = q.correctAnswer;
    } else if (typeof q.correctIndex === 'number' && q.correctIndex >= 0 && q.correctIndex < options.length) {
      correctAnswer = q.correctIndex;
    } else if (typeof q.correctAnswer === 'string') {
      const foundIdx = options.findIndex(opt => opt.trim().toLowerCase() === q.correctAnswer.trim().toLowerCase());
      if (foundIdx !== -1) correctAnswer = foundIdx;
    }

    const explanation = q.explanation || q.reason || 'Review your course material for details on this concept.';

    return {
      id: idx + 1,
      question: String(questionText).trim(),
      options: options.map(opt => opt.replace(/^[A-D][.)]\s*/, '').trim()), // remove leading "A.", "B." if present
      correctAnswer,
      explanation: String(explanation).trim(),
    };
  });

  return {
    title,
    topic: fallbackTopic,
    questionCount: questions.length,
    questions,
  };
}

/**
 * Validates and normalizes study plan JSON structure.
 * @param {object|string} raw
 * @param {string} fallbackSubject
 * @returns {object}
 */
export function normalizeStudyPlan(raw, fallbackSubject = 'Course Study Plan') {
  const data = typeof raw === 'string' ? extractJson(raw) : raw;

  if (!data || typeof data !== 'object') {
    throw new Error('AI did not return a valid study plan structure.');
  }

  const subject = data.subject || fallbackSubject;
  const summary = data.summary || `A structured revision schedule designed to master ${subject} step-by-step.`;
  const rawSchedule = Array.isArray(data.schedule)
    ? data.schedule
    : Array.isArray(data.days)
    ? data.days
    : Array.isArray(data.plan)
    ? data.plan
    : [];

  if (rawSchedule.length === 0) {
    throw new Error('No schedule days found in the study plan response.');
  }

  const schedule = rawSchedule.map((item, idx) => {
    const day = typeof item.day === 'number' ? item.day : idx + 1;
    const title = item.title || item.topic || `Day ${day}: Core Concepts`;
    const hours = typeof item.hours === 'number' ? item.hours : item.allocatedHours || 2;
    const topics = Array.isArray(item.topics) ? item.topics.map(String) : [String(item.topic || title)];
    const tasks = Array.isArray(item.tasks)
      ? item.tasks.map(String)
      : Array.isArray(item.activities)
      ? item.activities.map(String)
      : ['Review key definitions', 'Solve 3 practice problems', 'Self-quiz on key points'];
    const reviewCheckpoint = item.reviewCheckpoint || item.focus || 'Verify core understanding of today’s topic.';

    return {
      day,
      title: String(title).trim(),
      hours,
      topics,
      tasks: tasks.map(t => String(t).trim()),
      reviewCheckpoint: String(reviewCheckpoint).trim(),
    };
  });

  return {
    subject,
    summary,
    totalDays: schedule.length,
    schedule,
  };
}
