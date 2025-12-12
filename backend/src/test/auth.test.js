import assert from 'assert';
import { hashPassword, comparePassword, generateToken } from '../utils/auth.js';

// Test password hashing
async function testPasswordHashing() {
  console.log('Testing password hashing...');
  
  const password = 'testPassword123';
  const hashed = await hashPassword(password);
  
  // Hash should be different from original
  assert.notStrictEqual(password, hashed);
  
  // Should be able to verify correct password
  const isValid = await comparePassword(password, hashed);
  assert.strictEqual(isValid, true);
  
  // Should reject wrong password
  const isInvalid = await comparePassword('wrongPassword', hashed);
  assert.strictEqual(isInvalid, false);
  
  console.log('✓ Password hashing tests passed');
}

// Test JWT token generation
function testTokenGeneration() {
  console.log('Testing JWT token generation...');
  
  const userId = 123;
  const token = generateToken(userId);
  
  // Token should be a non-empty string
  assert.strictEqual(typeof token, 'string');
  assert.ok(token.length > 0);
  
  // Token should have three parts (header.payload.signature)
  const parts = token.split('.');
  assert.strictEqual(parts.length, 3);
  
  console.log('✓ JWT token generation tests passed');
}

// Run all tests
async function runTests() {
  console.log('Running backend tests...\n');
  
  try {
    await testPasswordHashing();
    testTokenGeneration();
    
    console.log('\n✅ All tests passed!');
    process.exit(0);
  } catch (error) {
    console.error('\n❌ Test failed:', error.message);
    process.exit(1);
  }
}

runTests();
