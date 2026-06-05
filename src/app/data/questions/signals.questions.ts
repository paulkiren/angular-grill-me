// Last reviewed: Angular 21.2 (2026-06)
// Next review due: Angular 22.0 release (~late 2026)
import { Question } from '../../models/interview.models';

export const signalsTopic = {
  id: 'signals',
  title: 'Angular Signals',
  description: 'Fine-grained reactivity, signal(), computed(), effect(), and model inputs.'
};

export const signalsQuestions: Question[] = [
  {
    id: 'sig-1',
    topic: 'signals',
    title: 'Signals vs Observables',
    difficulty: 'Mid',
    questionType: 'multiple-choice',
    bloomLevel: 'analyze',
    sinceVersion: '16.0',
    assessmentEligible: true,
    tags: ['signals', 'reactivity'],
    questionText: 'When would you prefer using Angular Signals over RxJS Observables?',
    rubrics: ['fine-grained', 'synchronous', 'derived state', 'asynchronous', 'streams'],
    sampleAnswer: 'Signals are best for synchronous state tracking, derived calculations (computed), and template rendering due to fine-grained reactivity without Zone.js. Observables are preferred for asynchronous data streams, complex event composition, time-based operations, and side-effects (e.g., HTTP polling, debounce).',
    options: [
      'Always use Signals; Observables are deprecated in Angular 21.',
      'Use Signals for synchronous state and reactive template rendering; use RxJS Observables for async streams, event streams, and time-based operations.',
      'Observables are faster than Signals for simple counter states.',
      'Signals are only used for global routing configuration.'
    ],
    correctOptionIndex: 1,
    timeLimit: 60,
    rubricMatchers: [
      { pattern: 'fine-grained|fine\\s*grain', term: 'fine-grained', label: 'Fine-grained reactivity without Zone.js', weight: 2 },
      { pattern: 'synchronous|sync', term: 'synchronous', label: 'Synchronous state management', weight: 2 },
      { pattern: 'derived\\s*state|computed', term: 'derived state', label: 'Derived calculations via computed()', weight: 2 },
      { pattern: 'asynchronous|async', term: 'asynchronous', label: 'Asynchronous event stream composition', weight: 2 },
      { pattern: 'stream|event', term: 'streams', label: 'Handling dynamic asynchronous streams', weight: 1 }
    ]
  },
  {
    id: 'sig-2',
    topic: 'signals',
    title: 'computed() vs effect()',
    difficulty: 'Junior',
    questionType: 'multiple-choice',
    bloomLevel: 'understand',
    sinceVersion: '16.0',
    assessmentEligible: true,
    tags: ['signals', 'computed', 'effect'],
    questionText: 'What is the primary difference in purpose between `computed()` and `effect()` in Angular Signals?',
    rubrics: ['read-only', 'side-effect', 'derive', 'write signal'],
    sampleAnswer: '`computed()` is used to derive a read-only state signal from other signals; it must be pure and return a value. `effect()` is used to run side-effects (e.g., DOM operations, logging) in response to signal changes and must not write to signals unless explicitly allowed.',
    options: [
      'computed() can write to any signal, while effect() is strictly read-only.',
      'effect() is executed at compile time; computed() runs at runtime.',
      'computed() is for pure, synchronous state derivation; effect() is for side-effects like logging or DOM manipulation.',
      'They are exactly identical and interchangeable.'
    ],
    correctOptionIndex: 2,
    timeLimit: 45,
    rubricMatchers: [
      { pattern: 'read-only|read\\s*only', term: 'read-only', label: 'Computed creates read-only reactive signals', weight: 2 },
      { pattern: 'side-effect|side\\s*effect|effect', term: 'side-effect', label: 'Effect encapsulates side-effects', weight: 2 },
      { pattern: 'derive|calculation', term: 'derive', label: 'Pure derived reactive state calculation', weight: 2 },
      { pattern: 'write\\s*signal|set\\s*signal', term: 'write signal', label: 'Avoid writing to signals inside effects', weight: 2 }
    ]
  },
  {
    id: 'sig-3',
    topic: 'signals',
    title: 'Signal Readability & Effects',
    difficulty: 'Mid',
    questionType: 'select-all',
    bloomLevel: 'understand',
    sinceVersion: '16.0',
    assessmentEligible: true,
    tags: ['signals', 'effect', 'computed'],
    questionText: 'Which of the following statements about Angular Signals and effects are correct? Select all that apply.',
    rubrics: ['lazy computation', 'effect scheduling', 'signal writes', 'auto unsubscribe'],
    sampleAnswer: 'Effects schedule executions asynchronously on a microtask boundary and disallow signal writes by default to prevent infinite feedback loops. Computed signals are evaluated lazily only when read. Effects automatically track dependencies and release them upon destruction.',
    options: [
      'effect() runs asynchronously during the change detection microtask queue.',
      'computed() values are evaluated eagerly as soon as their dependency signals change.',
      'By default, writing to signals inside an effect() is disallowed to prevent infinite loops.',
      'An effect() automatically tracks and unsubscribes from signal dependencies when they are destroyed.'
    ],
    correctOptionIndexes: [0, 2, 3],
    timeLimit: 75
  },
  {
    id: 'sig-4',
    topic: 'signals',
    title: 'model() input for two-way binding',
    difficulty: 'Mid',
    questionType: 'multiple-choice',
    bloomLevel: 'apply',
    sinceVersion: '17.1',
    assessmentEligible: true,
    tags: ['signals', 'model', 'two-way binding'],
    questionText: 'What does the `model()` input in Angular do and how does it differ from a regular `input()` signal?',
    rubrics: ['writable', 'two-way', 'child updates', 'parent sync'],
    sampleAnswer: "`model()` creates a writable signal input that enables two-way data binding. Unlike `input()` which is read-only from the child's perspective, `model()` allows the child component to update the value, and the change is automatically propagated back to the parent via the corresponding `(modelChange)` event binding.",
    options: [
      'model() is identical to input() but adds validation.',
      'model() creates a writable signal input enabling two-way binding; the child can update the value and the parent is automatically notified.',
      'model() replaces @Output() entirely in all cases.',
      'model() is only available inside directives, not components.'
    ],
    correctOptionIndex: 1,
    timeLimit: 60,
    rubricMatchers: [
      { pattern: 'writable|write|mutable', term: 'writable', label: 'model() signal is writable from the child', weight: 3 },
      { pattern: 'two-way|two way|bidirectional', term: 'two-way', label: 'Enables two-way data binding', weight: 3 },
      { pattern: 'child.*update|set.*value|child.*write', term: 'child updates', label: 'Child component can update the value', weight: 2 },
      { pattern: 'parent|sync|propagat|notify', term: 'parent sync', label: 'Parent is notified of changes', weight: 2 }
    ]
  },
  {
    id: 'sig-5',
    topic: 'signals',
    title: 'toSignal() and toObservable()',
    difficulty: 'Senior',
    questionType: 'open-ended',
    bloomLevel: 'evaluate',
    sinceVersion: '16.0',
    assessmentEligible: true,
    tags: ['signals', 'rxjs', 'interop'],
    questionText: 'Describe the interoperability utilities `toSignal()` and `toObservable()` and when you would use each when migrating a component from RxJS to signals.',
    answerPlaceholder: 'Explain the purpose of each, their subscription lifecycle, and the migration scenario they address.',
    rubrics: ['toSignal', 'toObservable', 'injection context', 'subscription cleanup', 'migration strategy'],
    sampleAnswer: '`toSignal()` wraps an Observable in a signal, managing the subscription automatically within the injection context — it completes when the component is destroyed. Use it when you want to consume an existing Observable in a signals-based template. `toObservable()` converts a signal to an Observable using an effect internally; use it when you need to pipe a signal value through RxJS operators. During migration, start by wrapping existing service Observables with toSignal() in components, then gradually replace with native signals as the data sources are migrated.',
    timeLimit: 120,
    rubricMatchers: [
      { pattern: 'toSignal', term: 'toSignal', label: 'toSignal wraps Observable as a signal', weight: 3 },
      { pattern: 'toObservable', term: 'toObservable', label: 'toObservable converts signal to Observable', weight: 3 },
      { pattern: 'injection\\s*context|inject.*context', term: 'injection context', label: 'Must be called in injection context', weight: 2 },
      { pattern: 'cleanup|destroy|unsubscri', term: 'subscription cleanup', label: 'Subscription managed automatically on destroy', weight: 2 },
      { pattern: 'migrat|gradual|incremental', term: 'migration strategy', label: 'Incremental RxJS-to-signals migration path', weight: 2 }
    ]
  }
];
