const TIMEOUT_MS = 60000;

async function verify() {
  console.log('1. Checking Ollama reachability at http://localhost:11434...');
  const t0 = Date.now();
  try {
    const res = await fetch('http://localhost:11434/');
    const text = await res.text();
    console.log(`-> Ollama root status: ${res.status} (${((Date.now() - t0)/1000).toFixed(2)}s): "${text.trim()}"`);
  } catch (err) {
    console.error(`-> Failed to reach Ollama:`, err.message);
    return;
  }

  console.log('\n2. Querying GET /api/tags for gemma3:4b...');
  const t1 = Date.now();
  try {
    const res = await fetch('http://localhost:11434/api/tags');
    const data = await res.json();
    const modelNames = (data.models || []).map(m => m.name);
    console.log(`-> Models found (${((Date.now() - t1)/1000).toFixed(2)}s):`, modelNames);
    if (!modelNames.includes('gemma3:4b')) {
      console.error('-> gemma3:4b NOT found in Ollama tags!');
      return;
    }
  } catch (err) {
    console.error(`-> Failed to query tags:`, err.message);
    return;
  }

  console.log('\n3. Testing minimal /api/generate (prompt: "Hi", num_predict: 5, timeout: 60s)...');
  const t2 = Date.now();
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);

  try {
    const res = await fetch('http://localhost:11434/api/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: 'gemma3:4b',
        prompt: 'Hi',
        stream: false,
        options: {
          num_predict: 5,
        },
      }),
      signal: controller.signal,
    });
    clearTimeout(timer);

    const data = await res.json();
    console.log(`-> Minimal inference SUCCEEDED in ${((Date.now() - t2)/1000).toFixed(1)}s!`);
    console.log('-> Response:', JSON.stringify(data.response));
    console.log('-> Stats: eval_count =', data.eval_count, ', eval_duration =', (data.eval_duration / 1e9).toFixed(2) + 's');
  } catch (err) {
    clearTimeout(timer);
    if (err.name === 'AbortError') {
      console.error(`-> Minimal generate TIMED OUT after ${TIMEOUT_MS/1000}s.`);
    } else {
      console.error(`-> Minimal generate FAILED:`, err.message);
    }
  }
}

verify();
