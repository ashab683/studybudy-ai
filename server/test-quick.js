const start = Date.now();
console.log('Testing concise explanation with num_predict: 150...');

const res = await fetch('http://localhost:11434/api/generate', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    model: 'gemma3:4b',
    prompt: `You are StudyBuddy AI. Explain recursion in C concisely for a beginner student. Include:
1. One-sentence definition
2. Real-world analogy (Russian nesting doll)
3. 4-line C code snippet
4. Base case importance

Keep it brief and friendly.`,
    stream: false,
    options: {
      num_predict: 180,
      temperature: 0.5,
    },
  }),
});

const data = await res.json();
const elapsed = ((Date.now() - start) / 1000).toFixed(1);
console.log(`\nCompleted in ${elapsed}s!`);
console.log('\nResponse:\n', data.response);
