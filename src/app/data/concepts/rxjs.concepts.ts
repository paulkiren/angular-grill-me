import { Concept } from '../../models/interview.models';

export const rxjsConcepts: Concept[] = [
  {
    id: 'concept-rxjs-subject-types',
    topic: 'rxjs',
    title: 'Subject vs BehaviorSubject vs ReplaySubject',
    summary: 'The three Subject variants differ in whether they replay past values to late subscribers and whether they require an initial value.',
    explanation: [
      'A plain Subject is a hot multicast source that emits to current subscribers only — a late subscriber receives nothing from before it subscribed. Use it for events like button clicks where history is irrelevant.',
      'A BehaviorSubject always holds the most recent value and immediately emits it to any new subscriber. It requires an initial value at construction. This makes it the right choice for state that always has a "current" reading — a loading flag, the signed-in user, a theme setting.',
      'A ReplaySubject buffers the last N emissions (configurable) and replays them to every new subscriber. It does not require an initial value. Use it when late subscribers need recent history, such as replaying the last few log messages.',
    ],
    example: `const subject      = new Subject<number>();          // no replay
const behavior     = new BehaviorSubject<number>(0);  // replays 1 (initial)
const replay       = new ReplaySubject<number>(2);    // replays last 2

behavior.subscribe(v => console.log('late:', v));     // prints 0 immediately
behavior.next(1);                                      // late sub receives 1`,
    whyItMatters: 'Choosing the wrong Subject type causes silent bugs — a BehaviorSubject used for events will confuse subscribers with stale values, while a plain Subject used for state will miss the current value on every new subscription.',
    pitfalls: [
      'Using BehaviorSubject for events (clicks, route changes) — the stale "last click" replays to every new subscriber.',
      'Forgetting that BehaviorSubject.getValue() reads the current value synchronously but bypasses the reactive chain — use value$ as an Observable instead.',
      'Leaking a Subject as a public Observable — expose it via .asObservable() so consumers cannot call .next() from outside the owning class.',
    ],
    docsUrl: 'https://rxjs.dev/guide/subject',
    sinceVersion: '2.0',
  },
  {
    id: 'concept-rxjs-flattening-operators',
    topic: 'rxjs',
    title: 'switchMap, mergeMap, concatMap, exhaustMap',
    summary: 'Flattening operators determine how an outer Observable\'s inner Observables are subscribed to, cancelled, or queued.',
    explanation: [
      'switchMap cancels the previous inner Observable when a new outer emission arrives. This makes it ideal for search-as-you-type: you only care about the result for the latest query, and stale in-flight requests are discarded automatically.',
      'mergeMap subscribes to every inner Observable concurrently, merging their output in arrival order. Use it for independent parallel work — uploading multiple files at the same time — where all results matter and order does not.',
      'concatMap queues inner Observables and subscribes to them strictly one at a time in emission order. Use it when operations must run sequentially — saving records one by one — and you cannot afford to lose or reorder any.',
      'exhaustMap ignores new outer emissions while an inner Observable is still active. Use it for a login button: a second click while the first request is pending should be dropped, not queued.',
    ],
    example: `// Search: cancel stale request on each keystroke
searchInput.valueChanges.pipe(
  debounceTime(300),
  switchMap(term => this.api.search(term))
).subscribe(results => ...);

// Parallel uploads: run all at once
fileQueue$.pipe(
  mergeMap(file => this.api.upload(file))
).subscribe();`,
    whyItMatters: 'Using the wrong operator leads to race conditions (mergeMap for search returns stale results), dropped requests (exhaustMap for sequential saves), or unbounded concurrency (mergeMap when you needed switchMap).',
    pitfalls: [
      'Defaulting to mergeMap for everything — it is concurrent and can send responses out of order.',
      'Using switchMap for mutations (POST/PUT/DELETE) — a slow save gets cancelled mid-flight when the user triggers a second action.',
      'Forgetting that concatMap buffers indefinitely — if the source emits faster than the inner completes, memory grows unboundedly.',
    ],
    docsUrl: 'https://rxjs.dev/api/operators/switchMap',
    sinceVersion: '2.0',
  },
  {
    id: 'concept-rxjs-error-handling',
    topic: 'rxjs',
    title: 'catchError, throwError, and EMPTY',
    summary: 'RxJS error handling operators let you intercept errors mid-stream, recover, rethrow, or silently complete without breaking the entire Observable chain.',
    explanation: [
      'catchError intercepts an error notification and returns a replacement Observable. Return a fallback value (of([]), of(defaultValue)) to recover gracefully, or rethrow with throwError(() => err) to propagate. The key insight is that catchError must return an Observable — not a plain value.',
      'throwError(() => new Error(...)) creates an Observable that immediately errors. The factory function form (not the deprecated direct value form) is the current API. Use it inside catchError when you want to rethrow after logging, or to map one error type to another.',
      'EMPTY is an Observable that completes immediately without emitting. Returning it from catchError silently swallows the error and completes the stream — useful when the caller only cares about success and errors are expected no-ops.',
    ],
    example: `this.http.get('/api/data').pipe(
  catchError(err => {
    if (err.status === 404) return of([]);          // recover
    if (err.status === 401) return EMPTY;           // silent no-op
    return throwError(() => err);                   // rethrow
  })
).subscribe(data => ...);`,
    whyItMatters: 'Without explicit error handling the first HTTP error unsubscribes the stream permanently — every subsequent call silently does nothing, breaking the UI with no console error after the first failure.',
    pitfalls: [
      'Placing catchError outside a retry — it catches errors after all retries are exhausted; placing it inside retryWhen changes retry semantics.',
      'Using the deprecated throwError(error) single-argument form instead of throwError(() => error) — the factory form avoids the error being created at subscription time.',
      'Returning EMPTY when you actually need to surface the error to the user — silent completion looks like success to the subscriber.',
    ],
    docsUrl: 'https://rxjs.dev/api/operators/catchError',
    sinceVersion: '2.0',
  },
  {
    id: 'concept-rxjs-subscription-teardown',
    topic: 'rxjs',
    title: 'Preventing memory leaks — takeUntil and takeUntilDestroyed',
    summary: 'Long-lived Observables must be unsubscribed when a component is destroyed; takeUntilDestroyed is the modern idiomatic way to do this.',
    explanation: [
      'Every subscribe() call that is never unsubscribed is a potential memory leak. If the Observable is long-lived (interval, WebSocket, store select), the callback keeps executing and the component is never garbage-collected even after it leaves the DOM.',
      'The classic pattern is a destroy$ Subject: call destroy$.next() in ngOnDestroy, then pipe each stream through takeUntil(this.destroy$). This works but requires boilerplate in every component.',
      'The modern Angular 16+ approach is takeUntilDestroyed() — a standalone operator that automatically completes streams when the injection context (component, directive, or service) is destroyed. Call it inside the constructor or pass a DestroyRef explicitly when used outside the injection context.',
    ],
    example: `// Modern (Angular 16+)
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({ ... })
export class MyComponent {
  constructor() {
    interval(1000).pipe(
      takeUntilDestroyed()
    ).subscribe(tick => console.log(tick));
  }
}`,
    whyItMatters: 'Subscription leaks are invisible in normal use but compound over time — navigating between routes hundreds of times (e.g. in E2E tests or aggressive user flows) causes memory to grow steadily until the tab crashes.',
    pitfalls: [
      'Calling takeUntilDestroyed() outside an injection context (e.g. in a method, not the constructor) without passing a DestroyRef — it throws at runtime.',
      'Forgetting to complete the destroy$ Subject itself in the old pattern, causing a second minor leak.',
      'Assuming async pipe handles teardown automatically for template subscriptions — it does, but manually subscribed streams in the class still need explicit teardown.',
    ],
    docsUrl: 'https://angular.dev/api/core/rxjs-interop/takeUntilDestroyed',
    sinceVersion: '16.0',
  },
];
