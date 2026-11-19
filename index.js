'use strict';

// PATCHED VERSION — the fix for the ReDoS in vulnerable.js.
//
// Before: /^([a-z]+)+@example\.com$/   nested quantifier -> exponential blowup
// After:  /^[a-z]+@example\.com$/      single quantifier -> linear time
//
// The two accept the same language: one-or-more lowercase letters followed by
// the literal "@example.com". Removing the redundant outer `+` removes the
// ambiguous partition the engine had to backtrack through — same matches, no
// catastrophic backtracking.

const EMAIL_RE = /^[a-z]+@example\.com$/;

function validateEmail(input) {
  return EMAIL_RE.test(input);
}

module.exports = { validateEmail, EMAIL_RE };
