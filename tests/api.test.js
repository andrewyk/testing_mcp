// Basic API tests for the todo application
// These tests would normally use Jest or Mocha

const API_BASE = 'http://localhost:3000/api/tasks';

// Test helper function
async function testEndpoint(name, testFn) {
  try {
    await testFn();
    console.log(`✓ ${name}`);
  } catch (error) {
    console.error(`✗ ${name}: ${error.message}`);
  }
}

// Run all tests
async function runTests() {
  console.log('Running API Tests...\n');

  await testEndpoint('Health check returns OK', async () => {
    const response = await fetch('http://localhost:3000/health');
    const data = await response.json();
    if (data.status !== 'ok') throw new Error('Health check failed');
  });

  await testEndpoint('GET /api/tasks returns array', async () => {
    const response = await fetch(API_BASE);
    const data = await response.json();
    if (!Array.isArray(data)) throw new Error('Expected array');
  });

  await testEndpoint('POST /api/tasks creates new task', async () => {
    const response = await fetch(API_BASE, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title: 'Test Task',
        description: 'Test Description',
        priority: 'high',
        status: 'not_started'
      })
    });
    const data = await response.json();
    if (!data.id || data.title !== 'Test Task') {
      throw new Error('Task not created correctly');
    }
  });

  await testEndpoint('POST /api/tasks validates required title', async () => {
    const response = await fetch(API_BASE, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ description: 'No title' })
    });
    if (response.status !== 400) {
      throw new Error('Should return 400 for missing title');
    }
  });

  await testEndpoint('POST /api/tasks validates title length', async () => {
    const response = await fetch(API_BASE, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title: 'a'.repeat(256) })
    });
    if (response.status !== 400) {
      throw new Error('Should return 400 for title > 255 chars');
    }
  });

  console.log('\nTests completed!');
  console.log('Note: This is a basic test suite. For production, use Jest or Mocha.');
}

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { runTests };
}

// Run tests if executed directly
if (typeof require !== 'undefined' && require.main === module) {
  runTests().catch(console.error);
}
