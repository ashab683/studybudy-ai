import { server } from './src/server.js';

async function runTests() {
  const PORT = process.env.PORT || 3001;
  const baseUrl = `http://localhost:${PORT}`;

  console.log('\n--- TEST 1: Health Check (GET /api/health) ---');
  const healthRes = await fetch(`${baseUrl}/api/health`);
  const healthData = await healthRes.json();
  console.log('Status code:', healthRes.status);
  console.log('Health Data:', JSON.stringify(healthData, null, 2));

  if (!healthData.localAi?.connected || !healthData.localAi?.modelInstalled) {
    throw new Error('Local AI or model not ready!');
  }
  console.log('>>> TEST 1 PASSED: Ollama & Gemma 3 4B connected.\n');

  console.log('--- TEST 2: Empty Input Validation (POST /api/ai/ask) ---');
  const emptyRes = await fetch(`${baseUrl}/api/ai/ask`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ message: '   ', mode: 'explain' }),
  });
  const emptyData = await emptyRes.json();
  console.log('Status code:', emptyRes.status);
  console.log('Validation Error Response:', JSON.stringify(emptyData, null, 2));
  if (emptyRes.status !== 400 || emptyData.code !== 'EMPTY_INPUT') {
    throw new Error('Empty input validation failed!');
  }
  console.log('>>> TEST 2 PASSED: Empty input correctly rejected with 400.\n');

  console.log('--- TEST 3: Real Gemma 3 4B Inference (POST /api/ai/ask) ---');
  console.log('Sending question: "Explain recursion in C like I am a beginner"...');
  const start = Date.now();
  const askRes = await fetch(`${baseUrl}/api/ai/ask`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      message: 'Explain recursion in C like I am a beginner',
      mode: 'explain',
      subject: 'Data Structures',
    }),
  });

  const durationSec = ((Date.now() - start) / 1000).toFixed(1);
  const askData = await askRes.json();
  console.log(`Received response in ${durationSec}s! Status code:`, askRes.status);
  console.log('Response Success:', askData.success);
  console.log('Model Used:', askData.model);
  console.log('\n=== GENERATED RESPONSE FROM LOCAL GEMMA 3 4B ===\n');
  console.log(askData.response);
  console.log('\n================================================\n');

  if (!askData.success || !askData.response) {
    throw new Error('AI generation did not return success!');
  }
  console.log('>>> TEST 3 PASSED: Real local inference successfully returned from Gemma!\n');

  console.log('ALL PHASE 1 E2E TESTS PASSED SUCCESSFULLY! 🎉\n');

  // Close server cleanly
  server.close(() => {
    console.log('Server stopped cleanly.');
    process.exit(0);
  });
}

runTests().catch((err) => {
  console.error('Test Suite Failed:', err);
  server.close(() => process.exit(1));
});
