'use strict';

// Differential + RED/GREEN evidence for the ReDoS fix.
//   RED   = vulnerable.js blows up on the malicious input
//   GREEN = index.js (patched) stays fast on the same input
// The gate is machine-checkable: no human judgment about "is it slow enough".

const vulnerable = require('../vulnerable');
const patched = require('../index');

function measure(fn, input) {
  const start = process.hrtime.bigint();
  const result = fn(input);
  const ms = Number(process.hrtime.bigint() - start) / 1e6;
  return { result, ms: Number(ms.toFixed(3)) };
}

const benign = 'user@example.com';
const malicious = 'a'.repeat(30) + '!';

// 30 chars is a measured ~14ms on V8 — safe to call inline, big enough for
// the 100x differential. The signal is a RATIO, not an absolute millisecond
// value; V8's optimizer makes absolute times vary by engine/version.
const red = measure(vulnerable.validateEmail, malicious);
const green = measure(patched.validateEmail, malicious);
const benignPatched = measure(patched.validateEmail, benign);

console.log('benign    (patched)   :', JSON.stringify(benignPatched));
console.log('malicious (vulnerable):', JSON.stringify(red));
console.log('malicious (patched)  :', JSON.stringify(green));

const MIN_RATIO = 100;
const redConfirmed = red.ms > benignPatched.ms * MIN_RATIO;
const greenPasses = green.ms < benignPatched.ms * 10 && green.result === false;

console.log('RED  vulnerable is slow :', redConfirmed);
console.log('GREEN patched is fast   :', greenPasses);

if (redConfirmed && greenPasses) {
  console.log('RESULT: RED/GREEN CONFIRMED — fix eliminates the differential');
  process.exitCode = 0;
} else {
  console.log('RESULT: gate not met (engine-dependent timings)');
  process.exitCode = 1;
}
