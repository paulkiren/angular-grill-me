// Last reviewed: Angular 21.2 (2026-06)
// Next review due: Angular 22.0 release (~late 2026)
import { Question } from '../../models/interview.models';

export const httpTopic = {
  id: 'http',
  title: 'HTTP & Interceptors',
  description: 'HttpClient, interceptors, error handling, retry strategies, caching, and HTTP context tokens.'
};

export const httpQuestions: Question[] = [
  {
    id: 'http-1',
    topic: 'http',
    title: 'HttpClient typed responses',
    difficulty: 'Junior',
    questionType: 'multiple-choice',
    bloomLevel: 'understand',
    sinceVersion: '4.3',
    assessmentEligible: true,
    tags: ['http', 'HttpClient', 'typed'],
    questionText: 'How do you get a strongly-typed response from an HttpClient GET call, and why does it matter?',
    rubrics: ['generic type parameter', 'compile-time type safety', 'no cast', 'interface'],
    sampleAnswer: 'Pass the expected type as a generic parameter: `httpClient.get<User>(\'/api/user/1\')`. Angular will type the returned Observable as `Observable<User>`, so the value downstream is typed without casting. This catches property-name mismatches at compile time and improves IDE autocomplete.',
    options: [
      'Cast the result with `as User` after subscribing — the generic is optional.',
      'Pass the interface as a generic: httpClient.get<User>(\'/api/...\'), which types the Observable so TypeScript catches mismatches at compile time.',
      'HttpClient always returns Observable<any> regardless of generics.',
      'Use httpClient.getTyped() instead of httpClient.get() for typed responses.'
    ],
    correctOptionIndex: 1,
    timeLimit: 45,
    rubricMatchers: [
      { pattern: 'generic|<\\w+>|type.*param', term: 'generic type parameter', label: 'Uses generic type parameter on get<T>()', weight: 3 },
      { pattern: 'compile.?time|TypeScript|type.*check', term: 'compile-time type safety', label: 'Type checked at compile time', weight: 3 },
      { pattern: 'no.*cast|without.*cast|avoid.*any', term: 'no cast', label: 'No manual casting required', weight: 2 },
      { pattern: 'interface|type|model', term: 'interface', label: 'Type matches a TypeScript interface or type', weight: 1 }
    ]
  },
  {
    id: 'http-2',
    topic: 'http',
    title: 'HTTP interceptors',
    difficulty: 'Mid',
    questionType: 'open-ended',
    bloomLevel: 'apply',
    sinceVersion: '4.3',
    assessmentEligible: true,
    tags: ['http', 'interceptors', 'auth'],
    questionText: 'Describe how you would write a functional HTTP interceptor that attaches a Bearer token to every outgoing request.',
    answerPlaceholder: 'Explain the interceptor function signature, how to clone the request, and how to register it.',
    rubrics: ['HttpInterceptorFn', 'clone request', 'setHeaders', 'next handler', 'withInterceptors'],
    sampleAnswer: 'A functional interceptor is an `HttpInterceptorFn` — a function that receives the request and a `next` handler. To add the token, call `request.clone({ setHeaders: { Authorization: `Bearer ${token}` } })` to produce an immutable modified copy, then pass it to `next(clonedRequest)`. Register it in `provideHttpClient(withInterceptors([authInterceptor]))` in `app.config.ts`.',
    timeLimit: 90,
    rubricMatchers: [
      { pattern: 'HttpInterceptorFn|interceptor.*fn|functional.*intercept', term: 'HttpInterceptorFn', label: 'Uses functional interceptor signature', weight: 3 },
      { pattern: 'clone|request\\.clone|immutable', term: 'clone request', label: 'Clones request before modifying (immutability)', weight: 3 },
      { pattern: 'setHeaders|Authorization|Bearer', term: 'setHeaders', label: 'Adds Authorization header via setHeaders', weight: 3 },
      { pattern: 'next\\(|next handler|pass.*next|forward', term: 'next handler', label: 'Passes cloned request to next handler', weight: 2 },
      { pattern: 'withInterceptors|provideHttpClient|register', term: 'withInterceptors', label: 'Registered via withInterceptors()', weight: 2 }
    ]
  },
  {
    id: 'http-3',
    topic: 'http',
    title: 'Error handling with catchError',
    difficulty: 'Mid',
    questionType: 'code-snippet',
    bloomLevel: 'apply',
    sinceVersion: '4.3',
    assessmentEligible: true,
    tags: ['http', 'error handling', 'catchError'],
    questionText: 'Review the code below. What is wrong with the error handling, and how would you fix it properly?',
    codeSnippet: "loadUser(id: number) {\n  return this.http.get<User>(`/api/users/${id}`)\n    .subscribe({\n      next: user => this.user = user,\n      error: err => console.log(err)\n    });\n}",
    answerPlaceholder: 'Identify the two problems and show the improved version with catchError in the pipe.',
    rubrics: ['subscribe in service', 'catchError in pipe', 'throwError or EMPTY', 'let component decide', 'error recovery'],
    sampleAnswer: 'Two problems: (1) subscribing inside the service removes the caller\'s ability to react to the observable — services should return Observables, not subscriptions; (2) `console.log` swallows the error without recovery or re-throw. Fix: pipe through `catchError(err => { this.notifyError(err); return EMPTY; })` or re-throw with `throwError(() => err)` so the component can handle it. Let the component call `.subscribe()` or use the `async` pipe.',
    timeLimit: 90,
    rubricMatchers: [
      { pattern: 'subscribe.*service|service.*subscribe|return.*observable', term: 'subscribe in service', label: 'Service should return Observable, not subscribe', weight: 3 },
      { pattern: 'catchError|catch.*error.*pipe', term: 'catchError in pipe', label: 'Use catchError operator in the pipe chain', weight: 3 },
      { pattern: 'throwError|EMPTY|of\\(|recover', term: 'throwError or EMPTY', label: 'Return EMPTY or rethrow in catchError', weight: 2 },
      { pattern: 'component.*handle|caller.*decide|caller.*subscri', term: 'let component decide', label: 'Let the consumer subscribe and handle errors', weight: 2 }
    ]
  },
  {
    id: 'http-4',
    topic: 'http',
    title: 'Retry strategies for transient failures',
    difficulty: 'Senior',
    questionType: 'open-ended',
    bloomLevel: 'analyze',
    sinceVersion: '4.3',
    assessmentEligible: true,
    tags: ['http', 'retry', 'resilience'],
    questionText: 'Describe how you would implement a resilient HTTP retry strategy that retries on network errors but not on 4xx client errors, with exponential backoff.',
    answerPlaceholder: 'Explain the RxJS operators involved, how to distinguish retryable errors, and how to implement backoff.',
    rubrics: ['retryWhen or retry config', 'filter 4xx', 'exponential backoff', 'max retries', 'timer or delay'],
    sampleAnswer: 'Use the `retry({ count: 3, delay: (error, attempt) => timer(2 ** attempt * 500) })` config form introduced in RxJS 7. In the `delay` function, inspect the error: if it is an `HttpErrorResponse` with a 4xx status, return `throwError(() => error)` immediately (no retry). For network errors or 5xx, return the timer to implement exponential backoff (500ms, 1s, 2s). Wrap in an interceptor to apply the strategy globally.',
    timeLimit: 120,
    rubricMatchers: [
      { pattern: 'retry|retryWhen|retry.*config', term: 'retryWhen or retry config', label: 'Uses retry() or retryWhen() operator', weight: 3 },
      { pattern: '4xx|400|401|403|404|client.*error|status.*4', term: 'filter 4xx', label: 'Does not retry 4xx client errors', weight: 3 },
      { pattern: 'exponential|backoff|2\\^|pow|double', term: 'exponential backoff', label: 'Implements exponential backoff between retries', weight: 3 },
      { pattern: 'max.*retr|count|limit.*retr', term: 'max retries', label: 'Caps the number of retry attempts', weight: 2 },
      { pattern: 'timer|delay|interval|setTimeout', term: 'timer or delay', label: 'Uses timer() or delay() for backoff timing', weight: 2 }
    ]
  },
  {
    id: 'http-5',
    topic: 'http',
    title: 'HTTP context tokens',
    difficulty: 'Senior',
    questionType: 'open-ended',
    bloomLevel: 'evaluate',
    sinceVersion: '12.0',
    assessmentEligible: true,
    tags: ['http', 'HttpContext', 'interceptors'],
    questionText: 'What problem does `HttpContext` solve for interceptors and how would you use it to skip the auth interceptor for specific requests?',
    answerPlaceholder: 'Explain what HttpContext is, how to define a token, pass it on a request, and read it in the interceptor.',
    rubrics: ['per-request metadata', 'HttpContextToken', 'pass in options', 'read in interceptor', 'avoid global flag'],
    sampleAnswer: 'Before HttpContext, skipping an interceptor for specific requests required fragile workarounds like checking URL patterns or using global flags. HttpContext provides a type-safe, per-request metadata store. Define a token: `const SKIP_AUTH = new HttpContextToken(() => false)`. Pass it: `http.get(url, { context: new HttpContext().set(SKIP_AUTH, true) })`. In the interceptor, read it: `if (request.context.get(SKIP_AUTH)) return next(request)`. This keeps logic clean and avoids coupling interceptors to URL patterns.',
    timeLimit: 120,
    rubricMatchers: [
      { pattern: 'per.?request|request.*metadata|metadata.*request', term: 'per-request metadata', label: 'HttpContext stores per-request metadata', weight: 3 },
      { pattern: 'HttpContextToken|new.*HttpContextToken', term: 'HttpContextToken', label: 'Define token with HttpContextToken', weight: 3 },
      { pattern: 'context.*set|set.*context|pass.*context|HttpContext\\(\\)', term: 'pass in options', label: 'Pass context in request options', weight: 3 },
      { pattern: 'context\\.get|request\\.context|read.*interceptor', term: 'read in interceptor', label: 'Read the token inside the interceptor', weight: 3 },
      { pattern: 'URL.*pattern|global.*flag|avoid.*hack|workaround', term: 'avoid global flag', label: 'Avoids URL pattern matching or global flags', weight: 2 }
    ]
  },
  {
    id: 'http-6',
    topic: 'http',
    title: 'Request caching with an interceptor',
    difficulty: 'Senior',
    questionType: 'open-ended',
    bloomLevel: 'create',
    sinceVersion: '4.3',
    assessmentEligible: true,
    tags: ['http', 'caching', 'interceptors'],
    questionText: 'Design a simple GET request cache interceptor. What data structure would you use, what should invalidate the cache, and what are the risks of this approach?',
    answerPlaceholder: 'Describe the cache store, lookup logic, cache-control considerations, and at least two risks.',
    rubrics: ['Map as cache store', 'check before next', 'of() for cache hit', 'cache invalidation', 'memory and stale data risk'],
    sampleAnswer: 'Use a `Map<string, HttpResponse>` keyed by request URL (and serialised params). In the interceptor, check if the method is GET and the URL is in the cache — if so, return `of(cachedResponse)` without calling next. Otherwise, pipe next through `tap` to store the response. Invalidation options: TTL (timestamp on entry), manual clear on mutation requests, or honour Cache-Control headers. Risks: (1) memory growth for large or high-cardinality URLs, (2) stale data if the server updates between requests and there is no TTL, (3) cache does not account for different authenticated users sharing the same URL key.',
    timeLimit: 120,
    rubricMatchers: [
      { pattern: 'Map|cache.*store|key.*url|url.*key', term: 'Map as cache store', label: 'Uses a Map keyed by URL', weight: 3 },
      { pattern: 'check.*cache|lookup|cache.*hit|if.*cache', term: 'check before next', label: 'Checks cache before forwarding request', weight: 3 },
      { pattern: 'of\\(|return.*cached|short.circuit', term: 'of() for cache hit', label: 'Returns of(cachedResponse) on hit', weight: 3 },
      { pattern: 'invalidat|TTL|expire|stale|clear', term: 'cache invalidation', label: 'Addresses cache invalidation strategy', weight: 2 },
      { pattern: 'memory|stale|risk|grow|user|auth', term: 'memory and stale data risk', label: 'Identifies memory or stale data risks', weight: 2 }
    ]
  }
];
