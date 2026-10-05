const VALID_MODES = ['explain', 'simplify', 'practice', 'quiz', 'examRevision', 'studyPlan'];
const MAX_MESSAGE_LENGTH = 4000;
const MAX_SUBJECT_LENGTH = 100;

export function validateAskRequest(req, res, next) {
  const { message, mode, subject } = req.body || {};

  if (!message || typeof message !== 'string' || message.trim().length === 0) {
    return res.status(400).json({
      success: false,
      error: "Tell StudyBuddy what you'd like to learn. The question cannot be empty.",
      code: 'EMPTY_INPUT',
    });
  }

  const trimmed = message.trim();
  if (trimmed.length > MAX_MESSAGE_LENGTH) {
    return res.status(400).json({
      success: false,
      error: `Your request is too long (${trimmed.length} characters). Please keep it under ${MAX_MESSAGE_LENGTH} characters.`,
      code: 'INPUT_TOO_LONG',
    });
  }

  if (mode && (!VALID_MODES.includes(mode) || typeof mode !== 'string')) {
    return res.status(400).json({
      success: false,
      error: `Invalid mode "${mode}". Supported modes: ${VALID_MODES.join(', ')}.`,
      code: 'INVALID_MODE',
    });
  }

  req.validatedInput = {
    message: trimmed,
    mode: mode || 'explain',
    subject: typeof subject === 'string' ? subject.trim().slice(0, MAX_SUBJECT_LENGTH) : '',
  };

  next();
}

export function validateQuizRequest(req, res, next) {
  const { topic, difficulty, questionCount } = req.body || {};

  if (!topic || typeof topic !== 'string' || topic.trim().length === 0) {
    return res.status(400).json({
      success: false,
      error: 'Please provide a topic to generate a quiz on.',
      code: 'MISSING_TOPIC',
    });
  }

  const cleanTopic = topic.trim().slice(0, 200);
  const cleanDifficulty = ['easy', 'medium', 'hard'].includes(difficulty) ? difficulty : 'medium';
  const cleanCount = Math.min(Math.max(parseInt(questionCount, 10) || 5, 2), 8);

  req.validatedQuizInput = {
    topic: cleanTopic,
    difficulty: cleanDifficulty,
    questionCount: cleanCount,
  };

  next();
}

export function validateStudyPlanRequest(req, res, next) {
  const { subject, topics, hoursPerDay, days } = req.body || {};

  if (!subject || typeof subject !== 'string' || subject.trim().length === 0) {
    return res.status(400).json({
      success: false,
      error: 'Please provide a subject for your study plan.',
      code: 'MISSING_SUBJECT',
    });
  }

  let cleanTopics = [];
  if (Array.isArray(topics)) {
    cleanTopics = topics.map(t => String(t).trim()).filter(Boolean);
  } else if (typeof topics === 'string' && topics.trim().length > 0) {
    cleanTopics = topics.split(/[\n,]+/).map(t => t.trim()).filter(Boolean);
  }

  if (cleanTopics.length === 0) {
    cleanTopics = [subject.trim()];
  }

  const cleanHours = Math.min(Math.max(parseFloat(hoursPerDay) || 3, 1), 12);
  const cleanDays = Math.min(Math.max(parseInt(days, 10) || 7, 1), 14);

  req.validatedStudyPlanInput = {
    subject: subject.trim().slice(0, 100),
    topics: cleanTopics.slice(0, 15),
    hoursPerDay: cleanHours,
    days: cleanDays,
  };

  next();
}
