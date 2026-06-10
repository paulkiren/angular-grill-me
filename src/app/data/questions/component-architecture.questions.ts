// Last reviewed: Angular 21.2 (2026-06)
// Next review due: Angular 22.0 release (~late 2026)
import { Question } from '../../models/interview.models';

export const componentArchitectureTopic = {
  id: 'component-arch',
  title: 'Component Architecture',
  description: 'Smart vs presentational components, input/output patterns, content projection, lifecycle hooks, and component communication.'
};

export const componentArchitectureQuestions: Question[] = [
  {
    id: 'ca-1',
    conceptId: 'concept-ca-input-output',
    topic: 'component-arch',
    title: 'Smart vs presentational components',
    difficulty: 'Mid',
    questionType: 'multiple-choice',
    bloomLevel: 'analyze',
    sinceVersion: '2.0',
    assessmentEligible: true,
    tags: ['architecture', 'smart', 'presentational', 'separation of concerns'],
    questionText: 'What is the smart/presentational (container/dumb) component pattern and what problem does it solve?',
    rubrics: ['smart holds state', 'presentational receives inputs', 'reusability', 'testability', 'separation of concerns'],
    sampleAnswer: 'Smart (container) components own state, inject services, and orchestrate data flow. Presentational (dumb) components receive data via `@Input()` and emit events via `@Output()` — they have no knowledge of services or application state. The pattern solves reusability (presentational components can be used anywhere) and testability (presentational components are tested with just inputs/outputs, no service mocks needed).',
    options: [
      'Smart components use signals; presentational components use observables.',
      'Smart components own state and inject services; presentational components receive data via inputs and emit via outputs — separating orchestration from display for reusability and testability.',
      'Presentational components must always use OnPush change detection.',
      'The pattern requires NgRx — it is not applicable to signals-based apps.'
    ],
    correctOptionIndex: 1,
    timeLimit: 60,
    rubricMatchers: [
      { pattern: 'smart.*state|container.*state|owns.*state|holds.*state', term: 'smart holds state', label: 'Smart component owns state and services', weight: 3 },
      { pattern: 'input|@Input|receives.*data|props', term: 'presentational receives inputs', label: 'Presentational receives data via @Input()', weight: 3 },
      { pattern: 'reusab|reuse|anywhere', term: 'reusability', label: 'Presentational components are reusable', weight: 2 },
      { pattern: 'test|unit.*test|no.*mock|testab', term: 'testability', label: 'Presentational components are easier to test', weight: 2 }
    ]
  },
  {
    id: 'ca-2',
    conceptId: 'concept-ca-lifecycle',
    topic: 'component-arch',
    title: 'input() signal vs @Input() decorator',
    difficulty: 'Mid',
    questionType: 'multiple-choice',
    bloomLevel: 'understand',
    sinceVersion: '17.1',
    assessmentEligible: true,
    tags: ['component', 'input', 'signals', 'decorator'],
    questionText: 'What does the new `input()` function (Angular 17.1+) offer over the traditional `@Input()` decorator?',
    rubrics: ['signal-based', 'required input', 'transform option', 'type safety', 'no ngOnChanges needed'],
    sampleAnswer: '`input()` returns a signal, so its value is read reactively in templates and `computed()` without needing `ngOnChanges`. It supports `input.required<T>()` for inputs that must always be provided (enforced at compile time), a built-in `transform` option (e.g., `input(0, { transform: numberAttribute })`), and full type inference. It eliminates the need to manually subscribe to input changes via `ngOnChanges`.',
    options: [
      'input() is identical to @Input() but with a shorter syntax.',
      'input() returns a signal enabling reactive reads and computed derivation, supports required inputs enforced at compile time, and eliminates ngOnChanges for responding to input changes.',
      'input() only works with primitive types like string and number.',
      '@Input() is deprecated and will be removed in Angular 22.'
    ],
    correctOptionIndex: 1,
    timeLimit: 60,
    rubricMatchers: [
      { pattern: 'signal|reactive.*read|computed.*from.*input', term: 'signal-based', label: 'input() returns a signal', weight: 3 },
      { pattern: 'required|input\\.required|must.*provid|compile.*time.*required', term: 'required input', label: 'input.required() enforced at compile time', weight: 3 },
      { pattern: 'transform|numberAttribute|booleanAttribute', term: 'transform option', label: 'Built-in transform option on input()', weight: 2 },
      { pattern: 'ngOnChanges|no.*ngOnChanges|without.*ngOnChanges', term: 'no ngOnChanges needed', label: 'Replaces ngOnChanges for input change reactions', weight: 2 }
    ]
  },
  {
    id: 'ca-3',
    topic: 'component-arch',
    title: 'Content projection with ng-content',
    difficulty: 'Mid',
    questionType: 'open-ended',
    bloomLevel: 'apply',
    sinceVersion: '2.0',
    assessmentEligible: true,
    tags: ['component', 'ng-content', 'content projection', 'slots'],
    questionText: 'Explain how you would build a reusable card component that supports two named content slots: a header and a body. How does the consumer use it?',
    answerPlaceholder: 'Describe the ng-content select attribute, multi-slot projection, and how the consumer passes content.',
    rubrics: ['ng-content select', 'named slot', 'consumer uses attribute or element', 'fallback content', 'multi-slot'],
    sampleAnswer: 'Use multiple `<ng-content>` elements with `select` attributes: `<ng-content select="[card-header]">` and `<ng-content select="[card-body]">`. The consumer wraps content in elements with the matching attribute: `<div card-header>My Title</div>`. Any projected content that does not match a slot falls through to an unscoped `<ng-content>`. Default (fallback) content can be placed inside the `ng-content` tag — it renders only when nothing is projected into that slot.',
    timeLimit: 90,
    rubricMatchers: [
      { pattern: 'ng-content.*select|select.*ng-content|select.*attribute', term: 'ng-content select', label: 'Uses ng-content with select attribute', weight: 3 },
      { pattern: 'named.*slot|slot.*name|multiple.*ng-content', term: 'named slot', label: 'Defines multiple named ng-content slots', weight: 3 },
      { pattern: 'consumer|parent.*passes|attribute.*match|card-header|card-body', term: 'consumer uses attribute or element', label: 'Consumer marks content with matching attribute/element', weight: 3 },
      { pattern: 'fallback|default.*content|empty.*slot', term: 'fallback content', label: 'Fallback content when slot is empty', weight: 1 }
    ]
  },
  {
    id: 'ca-4',
    conceptId: 'concept-ca-content-projection',
    topic: 'component-arch',
    title: 'Lifecycle hooks execution order',
    difficulty: 'Mid',
    questionType: 'multiple-choice',
    bloomLevel: 'analyze',
    sinceVersion: '2.0',
    assessmentEligible: true,
    tags: ['component', 'lifecycle', 'ngOnInit', 'ngAfterViewInit'],
    questionText: 'In what order do Angular lifecycle hooks execute for a component that has child components, and when is it safe to access ViewChild references?',
    rubrics: ['ngOnInit before children', 'ngAfterViewInit after children', 'ViewChild safe in AfterViewInit', 'ngOnChanges first', 'constructor vs ngOnInit'],
    sampleAnswer: 'Hook order for a parent: constructor → ngOnChanges (if inputs) → ngOnInit → ngDoCheck → ngAfterContentInit → ngAfterContentChecked → (child hooks run) → ngAfterViewInit → ngAfterViewChecked. `@ViewChild` queries are resolved after the view is initialised, so it is only safe to access them in `ngAfterViewInit` or later — reading a ViewChild in `ngOnInit` returns undefined.',
    options: [
      'ngOnInit runs after all child components are fully initialised.',
      'Hook order is: constructor → ngOnChanges → ngOnInit → (child hooks) → ngAfterViewInit. ViewChild references are safe to access in ngAfterViewInit — they are undefined in ngOnInit.',
      'ViewChild is always available from the constructor.',
      'ngAfterViewInit only runs once per application lifetime, not per component instance.'
    ],
    correctOptionIndex: 1,
    timeLimit: 60,
    rubricMatchers: [
      { pattern: 'ngOnInit.*before|before.*child|parent.*ngOnInit', term: 'ngOnInit before children', label: 'Parent ngOnInit runs before child hooks', weight: 2 },
      { pattern: 'ngAfterViewInit.*after|after.*child.*init|after.*view', term: 'ngAfterViewInit after children', label: 'ngAfterViewInit fires after all child views init', weight: 3 },
      { pattern: 'ViewChild.*AfterViewInit|AfterViewInit.*ViewChild|safe.*AfterViewInit', term: 'ViewChild safe in AfterViewInit', label: 'ViewChild only safe to access in ngAfterViewInit', weight: 3 },
      { pattern: 'undefined.*ngOnInit|ngOnInit.*undefined|not.*available.*ngOnInit', term: 'constructor vs ngOnInit', label: 'ViewChild is undefined during ngOnInit', weight: 2 }
    ]
  },
  {
    id: 'ca-5',
    topic: 'component-arch',
    title: 'Component communication patterns',
    difficulty: 'Senior',
    questionType: 'open-ended',
    bloomLevel: 'evaluate',
    sinceVersion: '2.0',
    assessmentEligible: true,
    tags: ['component', 'communication', 'input', 'output', 'service', 'signals'],
    questionText: 'Compare three component communication patterns — @Input/@Output, a shared service with signals, and a shared service with a Subject — and describe when each is the right tool.',
    answerPlaceholder: 'Describe each pattern, its scope, and give a concrete scenario where each is appropriate.',
    rubrics: ['Input Output for parent child', 'service signals for cross-tree', 'Subject for events', 'coupling trade-off', 'correct scope'],
    sampleAnswer: '@Input/@Output is the right default for direct parent–child communication: it is explicit, testable, and keeps coupling visible in the template. A shared service with signals fits cross-tree or sibling communication where multiple components need to read the same state reactively — the signal is always current and any subscriber re-renders automatically. A service with a Subject (or BehaviorSubject) fits one-shot or imperative events (e.g., "user logged out", "file upload completed") that are not persistent state — subscribers only care about the event happening, not the current value. Mixing patterns (Input/Output down, service up) keeps components reusable while centralising cross-cutting state.',
    timeLimit: 120,
    rubricMatchers: [
      { pattern: 'parent.*child|direct.*parent|@Input.*@Output|Input.*Output.*parent', term: 'Input Output for parent child', label: '@Input/@Output for direct parent-child', weight: 3 },
      { pattern: 'shared.*service.*signal|signal.*shared|cross.*tree|sibling.*signal', term: 'service signals for cross-tree', label: 'Shared service with signals for cross-tree state', weight: 3 },
      { pattern: 'Subject|BehaviorSubject|event.*stream|one.?shot|imperative.*event', term: 'Subject for events', label: 'Subject for one-shot imperative events', weight: 3 },
      { pattern: 'coupling|explicit|visible|reusab', term: 'coupling trade-off', label: 'Explicit coupling trade-off considered', weight: 2 }
    ]
  },
  {
    id: 'ca-6',
    topic: 'component-arch',
    title: 'ViewEncapsulation modes',
    difficulty: 'Senior',
    questionType: 'open-ended',
    bloomLevel: 'analyze',
    sinceVersion: '2.0',
    assessmentEligible: true,
    tags: ['component', 'ViewEncapsulation', 'CSS', 'Shadow DOM'],
    questionText: 'Describe the three ViewEncapsulation modes in Angular and give a real scenario where you would switch away from the default.',
    answerPlaceholder: 'Explain Emulated, None, and ShadowDom — how each scopes CSS and when you would use a non-default mode.',
    rubrics: ['Emulated default', 'None for global styles', 'ShadowDom native isolation', 'attribute scoping', 'style leakage'],
    sampleAnswer: '`Emulated` (default) adds unique attribute selectors to component styles and their host elements, simulating scoping without the real Shadow DOM. `None` disables scoping entirely — styles leak into the global stylesheet, useful for override-heavy third-party components or design system base styles. `ShadowDom` uses the native browser Shadow DOM, providing true CSS isolation but making external style overrides (e.g., from a parent theme) impossible without CSS custom properties. Switch to `None` when building a shared style component that must affect child content; switch to `ShadowDom` only when hard isolation is a requirement (e.g., embeddable widgets).',
    timeLimit: 120,
    rubricMatchers: [
      { pattern: 'Emulated|default.*encapsulat|attribute.*selectors|_ngcontent', term: 'Emulated default', label: 'Emulated is default — uses attribute selectors', weight: 3 },
      { pattern: 'None|no.*encapsulat|global.*style|leak.*global', term: 'None for global styles', label: 'None disables scoping — styles go global', weight: 3 },
      { pattern: 'ShadowDom|Shadow.*DOM|native.*isolat|browser.*shadow', term: 'ShadowDom native isolation', label: 'ShadowDom uses native browser Shadow DOM', weight: 3 },
      { pattern: 'override|theme|external.*style|custom.*prop', term: 'style leakage', label: 'External style override implications', weight: 2 }
    ]
  }
];
