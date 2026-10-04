import http from 'http';

// Test 1: Ollama tags
console.log('Testing Ollama tags on http://localhost:11434/api/tags...');
try {
  const res = await fetch('http://localhost:11434/api/tags');
  const data = await res.json();
  console.log('Ollama models:', data.models.map(m => m.name));
} catch (e) {
  console.error('Ollama connection failed:', e.message);
}

// Test 2: Try a simple 1-token prompt to Ollama to test inference
console.log('Testing short generation with gemma3:4b...');
try {
  const start = Date.now();
  const res = await fetch('http://localhost:11434/api/generate', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model: 'gemma3:4b',
      prompt: 'Hello! Respond with one word: Ready.',
      stream: false,
      options: { num_predict: 10 }
    })
  });
  const data = await res.json();
  const dur = ((Date.now() - start) / 1000).toFixed(1);
  console.log(`Generation succeeded in ${dur}s:`, data.response);
} catch (e) {
  console.error('Generation failed:', e.message);
}
