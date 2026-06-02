import { Question } from '../models/interview.models';

export const quizTopicsData = [
  {
    id: 'rxjs',
    title: 'RxJS & Reactive Streams',
    description: 'Observables, Operators, Subscription Management, Subjects, and declarative patterns.'
  },
  {
    id: 'signals',
    title: 'Angular Signals',
    description: 'Fine-grained reactivity, signal(), computed(), effect(), and model inputs.'
  },
  {
    id: 'change-detection',
    title: 'Change Detection & Performance',
    description: 'Zone.js, Zoneless, OnPush Strategy, ChangeDetectorRef, and hydration.'
  },
  {
    id: 'di',
    title: 'Dependency Injection (DI)',
    description: 'Hierarchical injection, inject(), InjectionToken, and custom providers.'
  }
];

export const quizQuestionsData: Question[] = [
  // RxJS Topic
  {
    id: 'rx-1',
    topic: 'rxjs',
    title: 'Subject vs BehaviorSubject',
    difficulty: 'Junior',
    questionType: 'multiple-choice',
    tags: ['rxjs', 'subjects'],
    questionText: 'What is the key difference between a RxJS Subject and a BehaviorSubject?',
    rubrics: ['initial value', 'last value', 'late subscriber', 'replay'],
    sampleAnswer: 'A Subject does not store a value and only emits values to subscribers that join after the emission. A BehaviorSubject stores the current value, requires an initial value upon creation, and immediately emits its current/last value to any new subscriber.',
    options: [
      'BehaviorSubject does not allow new subscribers, while Subject does.',
      'Subject stores the last emitted value, while BehaviorSubject does not.',
      'BehaviorSubject requires an initial value and immediately replays the last value to new subscribers, whereas Subject does neither.',
      'There is no functional difference; BehaviorSubject is simply newer.'
    ],
    correctOptionIndex: 2,
    timeLimit: 45,
    rubricMatchers: [
      { pattern: 'initial\\s*value|start\\s*value', term: 'initial value', label: 'BehaviorSubject initial value requirement' },
      { pattern: 'last\\s*value|current\\s*value', term: 'last value', label: 'Stores and delivers the current/last value' },
      { pattern: 'late\\s*subscriber|new\\s*subscriber|future\\s*subscriber', term: 'late subscriber', label: 'Delivers stored value to late subscribers' },
      { pattern: 'replay|emit', term: 'replay', label: 'Emission and replaying behaviors' }
    ]
  },
  {
    id: 'rx-2',
    topic: 'rxjs',
    title: 'switchMap vs mergeMap vs concatMap',
    difficulty: 'Mid',
    questionType: 'multiple-choice',
    tags: ['rxjs', 'operators'],
    questionText: 'Explain the behavior of switchMap compared to mergeMap and concatMap when a new outer observable item is emitted.',
    rubrics: ['cancel', 'active inner', 'order', 'sequential', 'parallel'],
    sampleAnswer: 'switchMap cancels the previous active inner observable subscription and switches to the new one. mergeMap subscribes to all inner observables in parallel without cancellation. concatMap queues inner observables and executes them sequentially in the order of emission.',
    options: [
      'switchMap processes in parallel, mergeMap cancels active, concatMap runs sequentially.',
      'switchMap cancels the previous active subscription; mergeMap runs inner streams in parallel; concatMap queues them to run sequentially.',
      'concatMap is the only one that supports error handling.',
      'switchMap is used for forms, mergeMap for routing, and concatMap for HTTP requests.'
    ],
    correctOptionIndex: 1,
    timeLimit: 90,
    rubricMatchers: [
      { pattern: 'cancel|abort|unsubscribe\\s*previous', term: 'cancel', label: 'Previous active inner stream cancellation' },
      { pattern: 'active\\s*inner|inner\\s*observable|inner\\s*stream', term: 'active inner', label: 'Active inner stream lifecycle management' },
      { pattern: 'order|sequence|queue', term: 'order', label: 'Maintains ordering and execution queues' },
      { pattern: 'sequential|one\\s*by\s*one', term: 'sequential', label: 'Sequential execution for concatMap' },
      { pattern: 'parallel|concur', term: 'parallel', label: 'Parallel execution for mergeMap' }
    ]
  },
  // Signals Topic
  {
    id: 'sig-1',
    topic: 'signals',
    title: 'Signals vs Observables',
    difficulty: 'Mid',
    questionType: 'multiple-choice',
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
      { pattern: 'fine-grained|fine\\s*grain', term: 'fine-grained', label: 'Fine-grained reactivity without Zone.js' },
      { pattern: 'synchronous|sync', term: 'synchronous', label: 'Synchronous state management' },
      { pattern: 'derived\\s*state|computed', term: 'derived state', label: 'Derived calculations via computed()' },
      { pattern: 'asynchronous|async', term: 'asynchronous', label: 'Asynchronous event stream composition' },
      { pattern: 'stream|event', term: 'streams', label: 'Handling dynamic asynchronous streams' }
    ]
  },
  {
    id: 'sig-2',
    topic: 'signals',
    title: 'computed() vs effect()',
    difficulty: 'Junior',
    questionType: 'multiple-choice',
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
      { pattern: 'read-only|read\\s*only', term: 'read-only', label: 'Computed creates read-only reactive signals' },
      { pattern: 'side-effect|side\\s*effect|effect', term: 'side-effect', label: 'Effect encapsulates side-effects' },
      { pattern: 'derive|calculation', term: 'derive', label: 'Pure derived reactive state calculation' },
      { pattern: 'write\\s*signal|set\\s*signal', term: 'write signal', label: 'Avoid writing to signals inside effects' }
    ]
  },
  // Change Detection Topic
  {
    id: 'cd-1',
    topic: 'change-detection',
    title: 'OnPush Change Detection',
    difficulty: 'Mid',
    questionType: 'multiple-choice',
    tags: ['change-detection', 'performance'],
    questionText: 'How does the OnPush change detection strategy improve performance in Angular?',
    rubrics: ['input references', 'explicit trigger', 'markForCheck', 'sub-tree', 'immutable'],
    sampleAnswer: 'OnPush limits change detection checks to only when component @Input properties change their reference, when events originate within the component, or when change detection is triggered explicitly (e.g., via markForCheck). This prevents unnecessary rendering of unchanged sub-trees.',
    options: [
      'OnPush disables all JavaScript animations in the component.',
      'It checks the component only when inputs change reference, internal events fire, or when markForCheck() is manually called, skipping unchanged sub-trees.',
      'It forces the component to render on every frame at 60fps.',
      'OnPush removes Zone.js completely from the application automatically.'
    ],
    correctOptionIndex: 1,
    timeLimit: 60,
    rubricMatchers: [
      { pattern: 'input\\s*reference|input\\s*change', term: 'input references', label: 'Checks when Inputs references change' },
      { pattern: 'explicit|manual', term: 'explicit trigger', label: 'Explicit change detection triggers' },
      { pattern: 'markForCheck|detectChanges', term: 'markForCheck', label: 'Explicit markForCheck() or ChangeDetectorRef calls' },
      { pattern: 'sub-tree|branch', term: 'sub-tree', label: 'Skips rendering unchanged component sub-trees' },
      { pattern: 'immutable|reference', term: 'immutable', label: 'Promotes immutable data patterns' }
    ]
  },
  // DI Topic
  {
    id: 'di-1',
    topic: 'di',
    title: 'inject() vs Constructor Injection',
    difficulty: 'Mid',
    questionType: 'multiple-choice',
    tags: ['di', 'inject'],
    questionText: 'What are the benefits of using the modern `inject()` function over constructor-based injection in Angular?',
    rubrics: ['context', 'inheritance', 'type safety', 'functional', 'cleaner'],
    sampleAnswer: 'The `inject()` function enables injection of dependencies in functional contexts (like route guards, custom RxJS operators, and utility functions), simplifies base class inheritance (no need to call `super(deps)`), and offers excellent type inference.',
    options: [
      'Constructor injection is faster at runtime, but inject() uses less memory.',
      'inject() allows dependency injection outside constructors (guards, functions) and eliminates tedious super() calls in class inheritance.',
      'inject() works on standard plain JavaScript objects without Angular.',
      'Constructor injection is fully deprecated in Angular v21.'
    ],
    correctOptionIndex: 1,
    timeLimit: 60,
    rubricMatchers: [
      { pattern: 'context|injection\\s*context', term: 'context', label: 'Requires execution within active injection context' },
      { pattern: 'inheritance|super', term: 'inheritance', label: 'Simplifies inheritance by avoiding super() constructors' },
      { pattern: 'type\\s*safety|type\\s*infer', term: 'type safety', label: 'Excellent type inference support' },
      { pattern: 'functional|function', term: 'functional', label: 'Enables DI in functional route guards and operators' }
    ]
  }
];
