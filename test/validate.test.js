'use strict';

// Functional equivalence + regression tests using Node's built-in runner.
// Tangible proof that the security fix changed the timing, not the behaviour.

const test = require('node:test');
const assert = require('node:assert/strict');
const patched = require('../index');
const vulnerable = require('../vulnerable');

test('patched validator accepts valid addresses', () => {
  for (const input of ['a@example.com', 'user@example.com', 'abcxyz@example.com']) {
    assert.equal(patched.validateEmail(input), true, `should accept ${input}`);
  }
});

test('patched validator rejects invalid addresses', () => {
  for (const input of ['', 'user', 'user@other.com', 'User@example.com', 'user1@example.com', 'a@example.com!']) {
    assert.equal(patched.validateEmail(input), false, `should reject ${input}`);
  }
});

test('patched and vulnerable agree on all safe inputs (behaviour unchanged)', () => {
  const safe = ['a@example.com', 'user@example.com', 'abc@example.com', 'bad', 'user@other.com', 'A@example.com', ''];
  for (const input of safe) {
    assert.equal(
      patched.validateEmail(input),
      vulnerable.validateEmail(input),
      `divergence on ${input}`
    );
  }
});
