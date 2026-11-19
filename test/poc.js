'use strict';

// Differential PoC for the ReDoS audit.
// Benign input should return fast; malicious input should blow past the
// timing threshold due to catastrophic backtracking in ([a-z]+)+.
const { validateEmail } = require('../index');

function measure(input) {
  const start = process.hrtime.bigint();
  const result = validateEmail(input);
  const ms = Number(process.hrtime.bigint() - start) / 1e6;
  return { input: input.length > 40 ? input.slice(0, 40) + '...' : input, result, ms: Number(ms.toFixed(3)) };
}

const benign = measure('user@example.com');
// Bounded input: long enough to show a large differential, short enough to
// terminate fast. The signal is the RATIO, not an absolute wall-clock number —
// V8's regex optimizer keeps absolute times engine-dependent.
const malicious = measure('a'.repeat(30) + '!');

console.log('benign   :', JSON.stringify(benign));
console.log('malicious:', JSON.stringify(malicious));

// Hard gate: the malicious input must run at least 100x slower than benign.
// The reusable signal is the differential ratio, not a fixed millisecond value
// (V8's optimizer makes absolute timings vary by engine/version).
const MIN_RATIO = 100;
if (malicious.ms > benign.ms * MIN_RATIO) {
  console.log('RESULT: ReDoS CONFIRMED (differential + hard timing threshold)');
  process.exitCode = 0;
} else {
  console.log('RESULT: not reproduced in this run (engine may have optimized)');
  process.exitCode = 1;
}
