# redos-lab

A small, real fixture demonstrating an evidence-gated ReDoS fix — the code is
genuine, the tests run, and the security claim is machine-checkable rather than
a matter of opinion. Built as the proving ground for an autonomous-audit idea.

## The bug

`vulnerable.js` has a catastrophic-backtracking regex:

```js
/^([a-z]+)+@example\.com$/   // nested quantifier -> exponential
```

`index.js` is the fix — same accepted language, single quantifier, linear time:

```js
/^[a-z]+@example\.com$/      // linear
```

Both accept one-or-more lowercase letters followed by `@example.com`. The
redundant outer `+` in the vulnerable version creates an ambiguous partition
the engine backtracks through on input like `'a'.repeat(30) + '!'`.

## Verify

```bash
npm install   # optional — zero dependencies, Node 22 built-ins only
npm run verify
```

`npm run verify` runs two things:

1. **`npm test`** — functional regression tests (Node's built-in runner):
   the fix accepts/rejects correctly and behaves identically to the vulnerable
   version on all safe inputs. Timing changed; behaviour did not.
2. **`npm run poc`** — the RED/GREEN differential gate:
   - RED: `vulnerable.js` is slow on the malicious input
   - GREEN: `index.js` is fast on the same input

Sample output:

```
benign    (patched)   : {"result":true,"ms":0.027}
malicious (vulnerable): {"result":false,"ms":30.764}
malicious (patched)  : {"result":false,"ms":0.056}
RED  vulnerable is slow : true
GREEN patched is fast   : true
RESULT: RED/GREEN CONFIRMED — fix eliminates the differential
```

The gate is a **ratio** (`malicious > 100x benign`), not a fixed millisecond
value — V8's optimizer makes absolute timings vary by engine. CI runs the same
two commands on every push and PR.

## Method: evidence-gated, not judgment-gated

1. **Reproduce** — executable PoC with a measurable signal.
2. **Differential** — same input against vulnerable vs. patched.
3. **Red/green** — regression proves the bug before and the fix after.
4. **CI gate** — full suite green before any merge.
5. **Evidence bundle** — PoC output, test log, CI run.

The agent proposes; the sandbox decides.

## Layout

```
index.js               patched validator (production)
vulnerable.js          original bug, kept for the RED side
test/poc.js            RED/GREEN differential gate
test/validate.test.js  functional + equivalence regression tests
.github/workflows/ci.yml   CI: runs tests + PoC on push/PR
```
