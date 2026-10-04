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
