async function check() {
  console.log('Testing Backend: http://localhost:3001/api/health...');
  try {
    const res = await fetch('http://localhost:3001/api/health');
    const data = await res.json();
    console.log('Backend Status:', res.status, data.status);
    console.log('Local AI Connected:', data.localAi.connected, 'Model:', data.localAi.model);
  } catch (e) {
    console.error('Backend check failed:', e.message);
  }

  console.log('\nTesting Frontend: http://localhost:5173...');
  try {
    const res = await fetch('http://localhost:5173');
    console.log('Frontend Status:', res.status, res.statusText);
  } catch (e) {
    console.error('Frontend check failed:', e.message);
  }
}

check();
