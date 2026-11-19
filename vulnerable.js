'use strict';

// KEPT FOR THE RED SIDE OF THE RED/GREEN TEST.
// Do not use in production. The nested quantifier ([a-z]+)+ is the canonical
// catastrophic-backtracking shape: on 'a'.repeat(n) + '!' the engine explores
// an exponential number of partitions before failing.
const EMAIL_RE = /^([a-z]+)+@example\.com$/;

function validateEmail(input) {
  return EMAIL_RE.test(input);
}

module.exports = { validateEmail, EMAIL_RE };
