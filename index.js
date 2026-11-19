'use strict';

// The regex under audit. The nested quantifier ([a-z]+)+ is the classic
// catastrophic-backtracking shape: it is quadratic-to-exponential on input
// like ('a'.repeat(n) + '!'), and trivial on a benign address.
const EMAIL_RE = /^([a-z]+)+@example\.com$/;

function validateEmail(input) {
  return EMAIL_RE.test(input);
}

module.exports = { validateEmail, EMAIL_RE };
