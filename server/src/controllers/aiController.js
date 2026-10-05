import { checkOllamaHealth, generateStudyResponse } from '../services/ollamaService.js';
import { buildPrompt, buildQuizPrompt, buildStudyPlanPrompt } from '../prompts/studyBuddyPrompt.js';
import { normalizeQuizData, normalizeStudyPlan } from '../utils/parseJsonResponse.js';

export async function getHealth(req, res) {
  try {
    const health = await checkOllamaHealth();
    return res.status(200).json({
      status: health.isConnected ? 'ok' : 'degraded',
      localAi: {
        connected: health.isConnected,
        model: health.targetModel,
        modelInstalled: health.modelInstalled,
        availableModels: health.models,
        url: health.url,
        error: health.error || null,
      },
    });
  } catch (err) {
    return res.status(500).json({
      status: 'error',
      localAi: {
        connected: false,
        error: err.message,
      },
    });
  }
}

export async function askStudyBuddy(req, res) {
  const { message, mode, subject } = req.validatedInput;

  try {
    const prompt = buildPrompt({ message, mode, subject });
    const result = await generateStudyResponse({ prompt });

    return res.status(200).json({
      success: true,
      response: result.response,
      mode,
      subject,
      model: result.model,
    });
  } catch (err) {
    const status = err.status || 500;
    return res.status(status).json({
      success: false,
      error: err.message || 'An unexpected error occurred while communicating with the local AI.',
      code: err.code || 'AI_ERROR',
    });
  }
}

export async function generateQuiz(req, res) {
  const { topic, difficulty, questionCount } = req.validatedQuizInput;

  try {
    const prompt = buildQuizPrompt({ topic, difficulty, questionCount });
    const result = await generateStudyResponse({
      prompt,
      format: 'json',
      options: {
        num_predict: 550,
        temperature: 0.5,
      },
    });

    let quizData;
    try {
      quizData = normalizeQuizData(result.response, topic);
    } catch (parseErr) {
      console.warn('[Quiz] Initial JSON parse warning:', parseErr.message, '- attempting relaxed extraction');
      quizData = normalizeQuizData(result.response, topic);
    }

    return res.status(200).json({
      success: true,
      quiz: quizData,
      model: result.model,
    });
  } catch (err) {
    console.error('[Quiz] Generation error:', err.message);
    const status = err.status || 500;
    return res.status(status).json({
      success: false,
      error: err.message || 'Unable to generate quiz. Please try again.',
      code: err.code || 'QUIZ_GENERATION_FAILED',
    });
  }
}

export async function generateStudyPlan(req, res) {
  const { subject, topics, hoursPerDay, days } = req.validatedStudyPlanInput;

  try {
    const prompt = buildStudyPlanPrompt({ subject, topics, hoursPerDay, days });
    const result = await generateStudyResponse({
      prompt,
      format: 'json',
      options: {
        num_predict: 600,
        temperature: 0.5,
      },
    });

    const planData = normalizeStudyPlan(result.response, subject);

    return res.status(200).json({
      success: true,
      plan: planData,
      model: result.model,
    });
  } catch (err) {
    console.error('[StudyPlan] Generation error:', err.message);
    const status = err.status || 500;
    return res.status(status).json({
      success: false,
      error: err.message || 'Unable to generate study plan. Please try again.',
      code: err.code || 'STUDY_PLAN_FAILED',
    });
  }
}
