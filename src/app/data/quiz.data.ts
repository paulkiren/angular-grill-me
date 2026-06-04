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
  },
  {
    id: 'angular-evolution',
    title: 'Angular Evolution & Architecture',
    description: 'Major Angular version transitions, migration decisions, standalone components, and signals/zoneless architecture.'
  },
  {
    id: 'angular-migration',
    title: 'Angular Migration Strategy',
    description: 'Upgrade planning, compatibility, API changes, and migration tradeoffs from older Angular versions to modern architectures.'
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
  {
    id: 'cd-2',
    topic: 'change-detection',
    title: 'OnPush and Immutable Input References',
    difficulty: 'Senior',
    questionType: 'open-ended',
    tags: ['change-detection', 'performance', 'immutable'],
    questionText: 'Describe a situation where OnPush change detection can fail to update the view and how you would fix it.',
    answerPlaceholder: 'Describe the root cause, reference change requirements, and the practical fix in Angular.',
    rubrics: ['immutable', 'markForCheck', 'input reference', 'event', 'change detection'],
    sampleAnswer: 'OnPush can fail when a component receives an object input whose internal properties change without the object reference changing. The fix is to update the input with a new object reference, use immutable state updates, or call markForCheck() after the change. Ensure data flows through reference-safe updates or use signals/computed values for derived UI state.',
    timeLimit: 90,
    rubricMatchers: [
      { pattern: 'immutable|immutability', term: 'immutable', label: 'Use immutable object/reference updates' },
      { pattern: 'markForCheck|detectChanges', term: 'markForCheck', label: 'Use markForCheck() or manual change detection' },
      { pattern: 'input\\s*reference|reference\\s*change', term: 'input reference', label: 'Input reference changes trigger OnPush' },
      { pattern: 'event|zone|angular zone', term: 'event', label: 'Event/zone-driven updates or manual detection' },
      { pattern: 'change\\s*detection', term: 'change detection', label: 'Understanding how OnPush evaluates component trees' }
    ]
  },
  {
    id: 'ae-1',
    topic: 'angular-evolution',
    title: 'Why standalone components arrived',
    difficulty: 'Mid',
    questionType: 'multiple-choice',
    tags: ['angular', 'standalone', 'architecture'],
    questionText: 'What was the main motivation for Angular introducing standalone components in v14/v15?',
    rubrics: ['boilerplate', 'NgModule', 'composition', 'developer ergonomics'],
    sampleAnswer: 'Standalone components were introduced to reduce NgModule boilerplate, simplify application composition, and make Angular easier to bootstrap and reason about without module metadata.',
    options: [
      'To make Angular incompatible with older versions of TypeScript.',
      'To eliminate NgModule boilerplate, simplify component composition, and make Angular easier to bootstrap and reason about.',
      'To force all applications to use signals instead of Observables.',
      'To remove dependency injection from component development.'
    ],
    correctOptionIndex: 1,
    timeLimit: 60,
    rubricMatchers: [
      { pattern: 'NgModule|module\\s*boilerplate', term: 'boilerplate', label: 'Reduce NgModule boilerplate' },
      { pattern: 'compose|composition|simplify', term: 'composition', label: 'Simplify application composition' },
      { pattern: 'bootstrap|startup|initialize', term: 'bootstrap', label: 'Make bootstrapping simpler' },
      { pattern: 'developer|ergonomics|easy', term: 'developer ergonomics', label: 'Improve developer ergonomics' }
    ]
  },
  {
    id: 'ae-2',
    topic: 'angular-evolution',
    title: 'Zoneless default and Signals first',
    difficulty: 'Senior',
    questionType: 'open-ended',
    tags: ['angular', 'signals', 'zoneless', 'architecture'],
    questionText: 'Explain how Angular 21’s zoneless default and signals-first direction change application architecture compared to earlier Zone.js-based versions.',
    answerPlaceholder: 'Describe the architectural impact, change detection behavior, and developer benefits of zoneless apps.',
    rubrics: ['zoneless', 'signals-first', 'change detection', 'performance', 'testability'],
    sampleAnswer: 'Angular 21’s zoneless default shifts applications away from Zone.js monkey-patching toward explicit reactivity. Signals-first architecture makes UI updates deterministic, reduces hidden side effects, improves testability, and enables better performance by scoping updates to affected computations instead of full-zone change detection.',
    timeLimit: 120,
    rubricMatchers: [
      { pattern: 'zoneless|Zone\\.js|zonejs', term: 'zoneless', label: 'Move away from Zone.js to zoneless execution' },
      { pattern: 'signal|signals-first|computed|effect', term: 'signals-first', label: 'Signals-first reactivity model' },
      { pattern: 'deterministic|predictable|explicit', term: 'change detection', label: 'Deterministic explicit change detection' },
      { pattern: 'performance|fast|overhead', term: 'performance', label: 'Performance and reduced overhead' },
      { pattern: 'test|testability|unit test', term: 'testability', label: 'Improved testability and fewer hidden side effects' }
    ]
  },
  {
    id: 'ae-3',
    topic: 'angular-evolution',
    title: 'Signals-first data flow',
    difficulty: 'Senior',
    questionType: 'code-snippet',
    tags: ['angular', 'signals', 'reactivity'],
    questionText: 'Review the code sample below and explain why signals-first data flow is a better fit for zoneless Angular than Zone.js-driven change detection.',
    codeSnippet: 'const count = signal(0);\nconst doubled = computed(() => count() * 2);\nconst logEffect = effect(() => console.log(`Count changed: ${count()}`));',
    answerPlaceholder: 'Describe how this pattern differs from Zone.js and why it is more predictable for Angular 21.',
    rubrics: ['signal', 'computed', 'effect', 'zoneless', 'predictable'],
    sampleAnswer: 'In signals-first data flow, derived values and side effects are explicitly declared. The runtime only re-evaluates the computed value and effect when the source signal changes. This is more predictable than Zone.js because updates are bounded by dependency graphs rather than a global async patching mechanism.',
    timeLimit: 120,
    rubricMatchers: [
      { pattern: 'signal\(|signals', term: 'signal', label: 'Use explicit signals for state' },
      { pattern: 'computed\(|derived|memo', term: 'computed', label: 'Derived values are declared and memoized' },
      { pattern: 'effect\(|side[- ]effect|logging', term: 'effect', label: 'Side effects are declared explicitly' },
      { pattern: 'zoneless|Zone\\.js|zonejs', term: 'zoneless', label: 'Zoneless architecture avoids global patching' },
      { pattern: 'predictable|deterministic|explicit', term: 'predictable', label: 'Predictable reactive update behavior' }
    ]
  },
  {
    id: 'am-1',
    topic: 'angular-migration',
    title: 'Planning Angular upgrades from v13 to v21',
    difficulty: 'Senior',
    questionType: 'open-ended',
    tags: ['angular', 'migration', 'compatibility'],
    questionText: 'Describe the architectural and compatibility tradeoffs involved in upgrading an Angular app from v13 to v21.',
    answerPlaceholder: 'Mention NgModule migration, Ivy, Zone.js/zoneless, library compatibility, typed forms, and incremental refactors.',
    rubrics: ['NgModule', 'Ivy', 'zoneless', 'compatibility', 'tests'],
    sampleAnswer: 'Upgrading from v13 to v21 should be approached as a series of incremental improvements rather than a single jump. Key tradeoffs include preserving library compatibility while shifting from NgModules to standalone components, keeping Zone.js available while preparing for zoneless execution, validating Ivy and typed form behavior, and maintaining test coverage through the migration.',
    timeLimit: 120,
    rubricMatchers: [
      { pattern: 'NgModule|standalone', term: 'NgModule', label: 'NgModule to standalone migration' },
      { pattern: 'Ivy|view\s*engine|compiler', term: 'Ivy', label: 'Ivy compatibility and build behavior' },
      { pattern: 'zoneless|Zone\.js|zonejs', term: 'zoneless', label: 'Zoneless migration and compatibility' },
      { pattern: 'compatibility|third[- ]party|libraries', term: 'compatibility', label: 'Third-party library compatibility risks' },
      { pattern: 'test|coverage|unit\s*test|e2e', term: 'tests', label: 'Preserve and update tests during migration' }
    ]
  },
  {
    id: 'am-2',
    topic: 'angular-migration',
    title: 'Which migration step should come first?',
    difficulty: 'Mid',
    questionType: 'multiple-choice',
    tags: ['angular', 'migration', 'strategy'],
    questionText: 'When migrating an app from Angular 16 to Angular 21, what is the most recommended first step?',
    rubrics: ['baseline', 'compatibility', 'testing', 'incremental'],
    sampleAnswer: 'The first step should be upgrading to the latest patch of the current major version, validating tests and third-party library compatibility, and then planning incremental architecture changes rather than switching everything at once.',
    options: [
      'Convert every component to standalone immediately and then run tests.',
      'Upgrade to the latest patch of the current major version, validate tests and dependencies, then plan incremental architectural changes.',
      'Remove Zone.js before any upgrade to avoid compatibility issues.',
      'Switch the codebase to plain JavaScript to reduce TypeScript-related migration risk.'
    ],
    correctOptionIndex: 1,
    timeLimit: 75,
    rubricMatchers: [
      { pattern: 'baseline|patch|current\s*major', term: 'baseline', label: 'Establish a stable current baseline first' },
      { pattern: 'test|coverage|validate', term: 'testing', label: 'Validate tests and dependencies upfront' },
      { pattern: 'incremental|step|gradual', term: 'incremental', label: 'Apply architecture changes incrementally' },
      { pattern: 'compatibility|dependency|library', term: 'compatibility', label: 'Verify dependency compatibility before major changes' }
    ]
  },
  {
    id: 'rx-3',
    topic: 'rxjs',
    title: 'Cancel HTTP requests with switchMap',
    difficulty: 'Senior',
    questionType: 'code-snippet',
    tags: ['rxjs', 'switchMap', 'http'],
    questionText: 'Review the code sample below and explain why using switchMap is better than mergeMap for this search stream.',
    codeSnippet: 'const searchTerm$ = new Subject<string>();\nconst results$ = searchTerm$.pipe(\n  mergeMap(term => httpClient.get<SearchResults>(`/api/search?q=${term}`))\n);\nresults$.subscribe(data => {\n  this.results = data;\n});',
    answerPlaceholder: 'Explain why mergeMap can produce stale results and how switchMap changes request behavior.',
    rubrics: ['switchMap', 'cancel previous', 'stale results', 'http requests'],
    sampleAnswer: 'Using mergeMap on a rapid search-term stream keeps every HTTP request active and can return responses out of order, which may render stale results. switchMap cancels the previous pending request when a new term arrives, ensuring the component only receives the latest response and avoiding race conditions.',
    timeLimit: 120,
    rubricMatchers: [
      { pattern: 'switchMap', term: 'switchMap', label: 'Use switchMap to cancel previous request' },
      { pattern: 'cancel|abort|unsubscribe', term: 'cancel previous', label: 'Previous request is cancelled on new emission' },
      { pattern: 'stale|out[- ]of[- ]order|race', term: 'stale results', label: 'Avoid stale or out-of-order responses' },
      { pattern: 'http|request|api', term: 'http requests', label: 'Relevant HTTP request behavior' }
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
  },
  {
    id: 'sig-3',
    topic: 'signals',
    title: 'Signal Readability & Effects',
    difficulty: 'Mid',
    questionType: 'select-all',
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
    id: 'di-2',
    topic: 'di',
    title: 'Hierarchical Dependency Injection',
    difficulty: 'Senior',
    questionType: 'open-ended',
    tags: ['di', 'hierarchy', 'providers'],
    questionText: 'Explain how Angular resolves a dependency when requested in a child component using hierarchical injectors, and how tree-shakable providers affect bundle sizes.',
    rubrics: ['bubble up', 'element injector', 'environment injector', 'providedIn root', 'tree-shaking'],
    sampleAnswer: 'When a dependency is requested, Angular first searches the Element Injector hierarchy, starting from the requesting component and bubbling up through parent components. If not found, it traverses the Environment Injector hierarchy (route injectors, root environment injector). Tree-shakable providers using @Injectable({ providedIn: "root" }) allow the compiler to omit unused service classes from the final production bundle.',
    timeLimit: 120,
    rubricMatchers: [
      { pattern: 'bubble|lookup|traverse|up', term: 'bubble up', label: 'Traverses the parent element hierarchy' },
      { pattern: 'element\\s*injector', term: 'element injector', label: 'Looks up through Element Injector tree' },
      { pattern: 'environment|root|platform', term: 'environment injector', label: 'Looks up through Environment/Root Injectors' },
      { pattern: 'providedIn|root\\s*provider', term: 'providedIn root', label: 'Registers via providedIn config' },
      { pattern: 'tree-shak|unused|shake', term: 'tree-shaking', label: 'Enables tree-shaking of unused service instances' }
    ]
  }
];
