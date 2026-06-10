// Last reviewed: Angular 21.2 (2026-06)
// Next review due: Angular 22.0 release (~late 2026)
import { Question } from '../../models/interview.models';

export const rxjsTopic = {
  id: 'rxjs',
  title: 'RxJS & Reactive Streams',
  description: 'Observables, Operators, Subscription Management, Subjects, and declarative patterns.'
};

export const rxjsQuestions: Question[] = [
  {
    id: 'rx-1',
    conceptId: 'concept-rxjs-subject-types',
    topic: 'rxjs',
    title: 'Subject vs BehaviorSubject',
    difficulty: 'Junior',
    questionType: 'multiple-choice',
    bloomLevel: 'understand',
    sinceVersion: '2.0',
    assessmentEligible: true,
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
      { pattern: 'initial\\s*value|start\\s*value', term: 'initial value', label: 'BehaviorSubject initial value requirement', weight: 2 },
      { pattern: 'last\\s*value|current\\s*value', term: 'last value', label: 'Stores and delivers the current/last value', weight: 2 },
      { pattern: 'late\\s*subscriber|new\\s*subscriber|future\\s*subscriber', term: 'late subscriber', label: 'Delivers stored value to late subscribers', weight: 2 },
      { pattern: 'replay|emit', term: 'replay', label: 'Emission and replaying behaviors', weight: 1 }
    ]
  },
  {
    id: 'rx-2',
    conceptId: 'concept-rxjs-flattening-operators',
    topic: 'rxjs',
    title: 'switchMap vs mergeMap vs concatMap',
    difficulty: 'Mid',
    questionType: 'multiple-choice',
    bloomLevel: 'analyze',
    sinceVersion: '5.0',
    assessmentEligible: true,
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
      { pattern: 'cancel|abort|unsubscribe\\s*previous', term: 'cancel', label: 'Previous active inner stream cancellation', weight: 3 },
      { pattern: 'active\\s*inner|inner\\s*observable|inner\\s*stream', term: 'active inner', label: 'Active inner stream lifecycle management', weight: 2 },
      { pattern: 'order|sequence|queue', term: 'order', label: 'Maintains ordering and execution queues', weight: 2 },
      { pattern: 'sequential|one\\s*by\\s*one', term: 'sequential', label: 'Sequential execution for concatMap', weight: 2 },
      { pattern: 'parallel|concur', term: 'parallel', label: 'Parallel execution for mergeMap', weight: 2 }
    ]
  },
  {
    id: 'rx-3',
    conceptId: 'concept-rxjs-error-handling',
    topic: 'rxjs',
    title: 'Cancel HTTP requests with switchMap',
    difficulty: 'Senior',
    questionType: 'code-snippet',
    bloomLevel: 'apply',
    sinceVersion: '5.0',
    assessmentEligible: true,
    tags: ['rxjs', 'switchMap', 'http'],
    questionText: 'Review the code sample below and explain why using switchMap is better than mergeMap for this search stream.',
    codeSnippet: 'const searchTerm$ = new Subject<string>();\nconst results$ = searchTerm$.pipe(\n  mergeMap(term => httpClient.get<SearchResults>(`/api/search?q=${term}`))\n);\nresults$.subscribe(data => {\n  this.results = data;\n});',
    answerPlaceholder: 'Explain why mergeMap can produce stale results and how switchMap changes request behavior.',
    rubrics: ['switchMap', 'cancel previous', 'stale results', 'http requests'],
    sampleAnswer: 'Using mergeMap on a rapid search-term stream keeps every HTTP request active and can return responses out of order, which may render stale results. switchMap cancels the previous pending request when a new term arrives, ensuring the component only receives the latest response and avoiding race conditions.',
    timeLimit: 120,
    rubricMatchers: [
      { pattern: 'switchMap', term: 'switchMap', label: 'Use switchMap to cancel previous request', weight: 3 },
      { pattern: 'cancel|abort|unsubscribe', term: 'cancel previous', label: 'Previous request is cancelled on new emission', weight: 3 },
      { pattern: 'stale|out[- ]of[- ]order|race', term: 'stale results', label: 'Avoid stale or out-of-order responses', weight: 2 },
      { pattern: 'http|request|api', term: 'http requests', label: 'Relevant HTTP request behavior', weight: 1 }
    ]
  },
  {
    id: 'rx-4',
    conceptId: 'concept-rxjs-subscription-teardown',
    topic: 'rxjs',
    title: 'Memory leak from unmanaged subscriptions',
    difficulty: 'Mid',
    questionType: 'open-ended',
    bloomLevel: 'analyze',
    sinceVersion: '2.0',
    assessmentEligible: true,
    tags: ['rxjs', 'memory', 'subscriptions'],
    questionText: 'Describe how an RxJS subscription causes a memory leak in an Angular component and the two modern ways to prevent it.',
    answerPlaceholder: 'Explain the leak mechanism and describe the recommended Angular cleanup patterns.',
    rubrics: ['long-lived observable', 'component destruction', 'takeUntilDestroyed', 'DestroyRef', 'unsubscribe'],
    sampleAnswer: 'When a component subscribes to a long-lived observable (e.g., an interval or a shared service stream) and the component is destroyed, the subscription remains active unless explicitly cleaned up. This keeps the component alive in memory. The two modern solutions are: (1) takeUntilDestroyed() operator, which uses the Angular DestroyRef token to complete the observable automatically, and (2) injecting DestroyRef and calling onDestroy() to run cleanup logic.',
    timeLimit: 90,
    rubricMatchers: [
      { pattern: 'long[- ]lived|infinite|interval|subject', term: 'long-lived observable', label: 'Leak source is a long-lived observable', weight: 2 },
      { pattern: 'destroy|destroyed|component.*destroy', term: 'component destruction', label: 'Subscription outlives the component', weight: 2 },
      { pattern: 'takeUntilDestroyed', term: 'takeUntilDestroyed', label: 'Modern operator-based cleanup', weight: 3 },
      { pattern: 'DestroyRef|destroyRef', term: 'DestroyRef', label: 'Inject DestroyRef for manual cleanup', weight: 3 },
      { pattern: 'unsubscribe|ngOnDestroy', term: 'unsubscribe', label: 'Manual unsubscription as fallback', weight: 1 }
    ]
  }
];
