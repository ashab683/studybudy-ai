import { checkOllamaHealth, generateStudyResponse } from '../services/ollamaService.js';
import { buildPrompt } from '../prompts/studyBuddyPrompt.js';

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
