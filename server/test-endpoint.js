const body = JSON.stringify({
  message: 'Explain recursion in C like I am a beginner',
  mode: 'explain',
  subject: 'Data Structures',
});

fetch('http://localhost:3001/api/ai/ask', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body,
})
  .then(async (res) => {
    const data = await res.json();
    console.log('Status:', res.status);
    console.log('Response:', JSON.stringify(data, null, 2));
  })
  .catch((err) => console.error('Fetch error:', err));
