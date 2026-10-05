import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, '../../../.env') });
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

const OLLAMA_URL = (process.env.OLLAMA_URL || 'http://localhost:11434').replace(/\/$/, '');
const DEFAULT_MODEL = process.env.OLLAMA_MODEL || 'gemma3:4b';
const TIMEOUT_MS = parseInt(process.env.REQUEST_TIMEOUT_MS || '300000', 10);


/**
 * Check if Ollama is reachable and whether the configured model is installed.
 */
export async function checkOllamaHealth() {
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 5000);

    const res = await fetch(`${OLLAMA_URL}/api/tags`, {
      method: 'GET',
      signal: controller.signal,
    });
    clearTimeout(timeout);

    if (!res.ok) {
      return {
        isConnected: false,
        error: `Ollama returned status ${res.status}: ${res.statusText}`,
        targetModel: DEFAULT_MODEL,
        url: OLLAMA_URL,
        models: [],
        modelInstalled: false,
      };
    }

    const data = await res.json();
    const models = Array.isArray(data.models) ? data.models : [];
    const modelNames = models.map((m) => m.name || m.model || '');

    // Check if target model or any tag (e.g. gemma3:4b or gemma3:latest) matches
    const targetModelLower = DEFAULT_MODEL.toLowerCase();
    const targetBase = targetModelLower.split(':')[0];
    const isInstalled = modelNames.some(
      (name) =>
        name.toLowerCase() === targetModelLower ||
        name.toLowerCase().startsWith(`${targetBase}:`) ||
        name.toLowerCase() === targetBase
    );

    return {
      isConnected: true,
      targetModel: DEFAULT_MODEL,
      url: OLLAMA_URL,
      models: modelNames,
      modelInstalled: isInstalled,
    };
  } catch (err) {
    let errorMsg = 'StudyBuddy cannot connect to the local AI. Please start Ollama and try again.';
    if (err.name === 'AbortError') {
      errorMsg = 'Connection to Ollama timed out. Ensure the Ollama service is responsive.';
    } else if (err.cause && err.cause.code === 'ECONNREFUSED') {
      errorMsg = `Ollama is offline or not running at ${OLLAMA_URL}. Start Ollama to enable AI explanations.`;
    }

    return {
      isConnected: false,
      error: errorMsg,
      targetModel: DEFAULT_MODEL,
      url: OLLAMA_URL,
      models: [],
      modelInstalled: false,
    };
  }
}

/**
 * Generate a complete explanation from Ollama (non-streaming for Phase 1).
 */
export async function generateStudyResponse({ prompt, model = DEFAULT_MODEL, format = undefined, options = {} }) {
  // Step 1: Health / availability pre-check
  const health = await checkOllamaHealth();
  if (!health.isConnected) {
    const err = new Error(health.error);
    err.code = 'OLLAMA_OFFLINE';
    err.status = 503;
    throw err;
  }

  if (!health.modelInstalled) {
    const availableList = health.models.length > 0 ? ` (Available: ${health.models.join(', ')})` : '';
    const err = new Error(
      `The configured model "${model}" is not installed locally. Please run "ollama pull ${model}" in your terminal.${availableList}`
    );
    err.code = 'MODEL_NOT_FOUND';
    err.status = 404;
    throw err;
  }

  // Step 2: Query Ollama
  console.log(`[Ollama] Dispatching inference request to model "${model}" (format: ${format || 'text'})...`);
  const startTime = Date.now();
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), TIMEOUT_MS);

  try {
    const response = await fetch(`${OLLAMA_URL}/api/generate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model,
        prompt,
        stream: false,
        format,
        options: {
          temperature: options.temperature ?? 0.6,
          top_p: options.top_p ?? 0.9,
          num_predict: options.num_predict ?? 380,
          ...options,
        },
      }),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      const errorText = await response.text();
      const err = new Error(`Ollama API error (${response.status}): ${errorText || response.statusText}`);
      err.status = response.status;
      throw err;
    }

    const data = await response.json();
    const elapsedSec = ((Date.now() - startTime) / 1000).toFixed(1);
    console.log(`[Ollama] Generation complete in ${elapsedSec}s. Generated ${data.response?.length || 0} characters.`);

    return {
      success: true,
      response: data.response,
      model: data.model || model,
      totalDuration: data.total_duration,
    };
  } catch (err) {
    clearTimeout(timeoutId);

    if (err.name === 'AbortError') {
      const timeoutError = new Error(
        'The AI is taking longer than expected to generate a response. Try asking a more specific or shorter question.'
      );
      timeoutError.code = 'REQUEST_TIMEOUT';
      timeoutError.status = 504;
      throw timeoutError;
    }

    if (!err.status) {
      err.status = 500;
    }
    throw err;
  }
}
