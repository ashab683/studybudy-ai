import { normalizeQuizData, normalizeStudyPlan, extractJson } from './src/utils/parseJsonResponse.js';
import { app, server } from './src/server.js';

async function testBackend() {
  const PORT = process.env.PORT || 3001;
  const baseUrl = `http://localhost:${PORT}`;

  console.log('=== TEST 1: Unit Test JSON Normalization Utilities ===');

  // Test 1a: Code-fenced JSON
  const markdownFencedJson = '```json\n{"title": "Test Quiz", "questions": [{"question": "Q1?", "options": ["A", "B", "C", "D"], "correctAnswer": 1, "explanation": "Because."}]}\n```';
  const quiz = normalizeQuizData(markdownFencedJson, 'Test');
  console.log('Parsed quiz questions count:', quiz.questions.length);
  if (quiz.questions.length !== 1 || quiz.questions[0].correctAnswer !== 1) {
    throw new Error('normalizeQuizData failed on fenced markdown!');
  }
  console.log('-> Quiz normalization test passed.');

  // Test 1b: Study plan normalization
  const samplePlanJson = JSON.stringify({
    subject: 'Algorithms',
    schedule: [
      { day: 1, title: 'Day 1: Sorting', hours: 2, tasks: ['Read mergesort', 'Implement quicksort'] }
    ]
  });
  const plan = normalizeStudyPlan(samplePlanJson, 'Algorithms');
  console.log('Parsed study plan total days:', plan.totalDays);
  if (plan.totalDays !== 1 || plan.schedule[0].hours !== 2) {
    throw new Error('normalizeStudyPlan failed!');
  }
  console.log('-> Study plan normalization test passed.\n');

  console.log('=== TEST 2: Validation on New Endpoints ===');
  // Test 2a: Quiz missing topic
  const quizMissing = await fetch(`${baseUrl}/api/ai/quiz`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({}),
  });
  const quizMissingData = await quizMissing.json();
  console.log('Quiz missing topic status:', quizMissing.status, quizMissingData.code);
  if (quizMissing.status !== 400 || quizMissingData.code !== 'MISSING_TOPIC') {
    throw new Error('Quiz validation failed!');
  }

  // Test 2b: Study plan missing subject
  const planMissing = await fetch(`${baseUrl}/api/ai/study-plan`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({}),
  });
  const planMissingData = await planMissing.json();
  console.log('Plan missing subject status:', planMissing.status, planMissingData.code);
  if (planMissing.status !== 400 || planMissingData.code !== 'MISSING_SUBJECT') {
    throw new Error('Study plan validation failed!');
  }
  console.log('-> Endpoint validation tests passed.\n');

  console.log('=== TEST 3: Live Quiz Generation with Ollama & Gemma 3 4B ===');
  console.log('Requesting 2-question quiz on "Stack in Data Structures" (difficulty: easy)...');
  const start = Date.now();
  const quizRes = await fetch(`${baseUrl}/api/ai/quiz`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      topic: 'Stack in Data Structures',
      difficulty: 'easy',
      questionCount: 2,
    }),
  });

  const quizData = await quizRes.json();
  const elapsed = ((Date.now() - start) / 1000).toFixed(1);
  console.log(`Quiz generation completed in ${elapsed}s! Status:`, quizRes.status);
  console.log('Quiz Result:\n', JSON.stringify(quizData.quiz, null, 2));

  if (!quizData.success || !quizData.quiz?.questions?.length) {
    throw new Error('Quiz generation did not return valid quiz data!');
  }
  console.log('-> Live Quiz generation passed!\n');

  console.log('ALL PHASE 2 BACKEND TESTS PASSED! 🎉');

  server.close(() => {
    console.log('Server stopped cleanly.');
    process.exit(0);
  });
}

testBackend().catch(err => {
  console.error('Backend Tests Failed:', err);
  server.close(() => process.exit(1));
});
