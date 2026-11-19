# redos-lab

A tiny, real code fixture for evidence-gated ReDoS differential testing — the
first proving ground for the AEGIS autonomous supply-chain audit loop.

## The bug under audit

`index.js` exports `validateEmail`, backed by:

```
/^([a-z]+)+@example\.com$/
```

The nested quantifier `([a-z]+)+` is the canonical catastrophic-backtracking
shape. Benign input (`user@example.com`) resolves in microseconds; a long run
of `a` followed by a non-matching char causes the engine to explore an
exponential number of partitions.

## Reproduce

```
npm run poc
```

The PoC measures benign vs. malicious input and gates on a hard differential
(malicious > 100x benign). It exits 0 only when the differential is real — no
subjective judgment from the agent. The signal is the RATIO, not an absolute
millisecond value, because V8's optimizer makes absolute timings vary by engine.

> Note: modern V8 has regex optimizations that may shorten blowup time for
> short strings. Increase the `a` run length in `test/poc.js` if you need to
> cross the threshold on a given engine. The point of the fixture is the
> *method* (executable PoC → differential → red/green → CI gate), not a single
> fixed number.

## Method: evidence-gated, not LLM-judgment-gated

1. **Reproduce** — executable PoC with measurable signal.
2. **Differential** — same input against HEAD vs. candidate patch.
3. **Red/green** — regression test fails before, passes after.
4. **CI gate** — full suite green before any PR.
5. **Evidence bundle** — PoC, timings, red/green output, CI log.

The agent proposes; the sandbox decides.
