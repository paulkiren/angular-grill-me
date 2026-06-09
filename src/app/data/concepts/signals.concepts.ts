// Last reviewed: Angular 21.2 (2026-06)
// Next review due: Angular 22.0 release (~late 2026)
//
// FEAT-001 (v0.3.0 / WS1) — Concept layer, proven on Signals first.
// Concept bodies are derived from the matching questions' sampleAnswer + rubricMatchers
// in signals.questions.ts, so teaching stays consistent with how answers are graded.
import { Concept } from '../../models/interview.models';

export const signalsConcepts: Concept[] = [
  {
    id: 'concept-signal-basics',
    topic: 'signals',
    title: 'What a signal() is',
    summary:
      'A signal is a reactive wrapper around a value that notifies consumers whenever the value changes.',
    explanation: [
      'A signal holds a value and tracks who reads it. You call it like a function to read the current value, and use .set() or .update() to change it. When the value changes, anything that read the signal — a template binding, a computed, or an effect — is re-evaluated automatically.',
      'This is "fine-grained" reactivity: instead of re-checking an entire component tree, Angular knows exactly which consumers depend on which signal and updates only those. It works without relying on Zone.js, which is why signals are central to Angular\'s zoneless future.',
    ],
    example: `import { signal } from '@angular/core';

const count = signal(0);

count();          // read  -> 0
count.set(5);     // write -> 5
count.update(n => n + 1); // 6`,
    whyItMatters:
      'Signals are the foundation for computed() and effect(), and for zoneless change detection. Understanding read/write/notify is the prerequisite for everything else in this topic.',
    pitfalls: [
      'Forgetting to call the signal — `count` is the signal, `count()` is its value.',
      'Mutating an object inside a signal in place instead of using .set()/.update() with a new reference, so consumers are never notified.',
    ],
    docsUrl: 'https://angular.dev/guide/signals',
    sinceVersion: '16.0',
  },
  {
    id: 'concept-signals-vs-observables',
    topic: 'signals',
    title: 'Signals vs Observables',
    summary:
      'Signals model synchronous state; Observables model asynchronous streams. They complement each other.',
    explanation: [
      'Signals are best for synchronous state and derived values that the template renders directly. Reads are fine-grained and there is no subscription to manage.',
      'Observables (RxJS) are best for asynchronous and time-based work: HTTP, event streams, debounce/throttle, retries, and complex composition of multiple sources over time.',
      'A practical rule of thumb: if the value "is" something right now, reach for a signal; if the value "arrives" over time, reach for an Observable. The interop utilities toSignal() and toObservable() let you cross the boundary when needed.',
    ],
    example: `// Synchronous state -> signal
const firstName = signal('Ada');

// Async stream -> Observable
this.http.get<User>('/api/user')   // emits over time
  .subscribe(user => ...);`,
    whyItMatters:
      'Choosing the right primitive keeps components simple: signals remove subscription bookkeeping for state, while Observables remain the right tool for streams. Mixing them up leads to either manual subscription leaks or awkward synchronous code forced through RxJS.',
    pitfalls: [
      'Believing Observables are deprecated — they are not; signals and RxJS coexist by design.',
      'Pushing genuinely asynchronous, time-based logic through signals because "signals are newer".',
    ],
    docsUrl: 'https://angular.dev/guide/signals/rxjs-interop',
    sinceVersion: '16.0',
  },
  {
    id: 'concept-computed-vs-effect',
    topic: 'signals',
    title: 'computed() vs effect()',
    summary:
      'computed() derives a new read-only value from signals; effect() runs side-effects when signals change.',
    explanation: [
      'computed() produces a read-only signal derived from other signals. It must be pure — given the same inputs it returns the same value — and it is evaluated lazily, only when something reads it, then cached until a dependency changes.',
      'effect() runs a side-effect (logging, DOM work, syncing to storage) in reaction to signal changes. It is scheduled asynchronously and, by default, is not allowed to write to signals — that guard prevents infinite feedback loops.',
      'The mental model: computed answers "what is the value?", effect answers "what should happen when the value changes?". If you find yourself writing a signal inside an effect to derive state, you almost always wanted a computed.',
    ],
    example: `const price = signal(100);
const qty = signal(2);

// derive a value -> computed
const total = computed(() => price() * qty());

// react to a change -> effect
effect(() => console.log('total is', total()));`,
    whyItMatters:
      'Picking the wrong one is the most common signals mistake. computed keeps derived state predictable and cached; effect isolates side-effects. Confusing them produces redundant recomputation or accidental loops.',
    pitfalls: [
      'The classic misconception: thinking computed() can write to signals — it cannot; it only returns a value.',
      'Writing to a signal inside effect() to "derive" state, which is disallowed by default and signals you wanted computed().',
      'Expecting computed() to run eagerly — it is lazy and only recomputes when read after a dependency changed.',
    ],
    docsUrl: 'https://angular.dev/guide/signals#computed-signals',
    sinceVersion: '16.0',
  },
];
