import { Concept } from '../../models/interview.models';

export const httpConcepts: Concept[] = [
  {
    id: 'concept-http-client-setup',
    topic: 'http',
    title: 'HttpClient — provideHttpClient and typed requests',
    summary: 'HttpClient is Angular\'s HTTP layer; provide it with provideHttpClient() in the app config and use generic type parameters to get typed responses.',
    explanation: [
      'In standalone Angular apps, HTTP support is wired in app.config.ts with provideHttpClient(). Optionally add withInterceptors([...]) or withFetch() (uses the browser Fetch API instead of XMLHttpRequest) to opt into modern features.',
      'Every HttpClient method (get, post, put, delete) is generic: this.http.get<User[]>(\'/api/users\') returns Observable<User[]>. The type is a compile-time assertion — Angular does not validate the runtime response shape, so validate with a schema library (Zod, class-transformer) for production hardening.',
      'HttpClient observables are cold and unicast — each subscribe() triggers a new HTTP request. They also complete automatically after the response arrives, so there is no need to unsubscribe (though using takeUntilDestroyed is still a good habit for pending requests on component destroy).',
    ],
    example: `// app.config.ts
export const appConfig: ApplicationConfig = {
  providers: [
    provideHttpClient(withFetch()),
    provideRouter(routes)
  ]
};

// Service usage
@Injectable({ providedIn: 'root' })
export class UserService {
  private http = inject(HttpClient);
  getUser(id: string) {
    return this.http.get<User>(\`/api/users/\${id}\`);
  }
}`,
    whyItMatters: 'Forgetting to provide HttpClient throws a cryptic NullInjectorError at runtime. Using withFetch() aligns Angular\'s HTTP layer with the platform Fetch API, enabling SSR and edge deployment without polyfills.',
    pitfalls: [
      'Calling subscribe() on an HttpClient observable twice — each call fires a separate HTTP request. Share with shareReplay(1) if you need multicast.',
      'Assuming the generic type validates the response at runtime — it only types the TypeScript layer. A server returning unexpected data will not throw.',
      'Using HttpClient inside a constructor instead of ngOnInit — the constructor runs before inputs are set, so request parameters may be undefined.',
    ],
    docsUrl: 'https://angular.dev/guide/http',
    sinceVersion: '4.3',
  },
  {
    id: 'concept-http-interceptors',
    topic: 'http',
    title: 'HTTP interceptors',
    summary: 'Interceptors are middleware functions that intercept every outgoing request and incoming response, enabling cross-cutting concerns like auth tokens, logging, and caching.',
    explanation: [
      'An interceptor is a function (HttpInterceptorFn) that receives a request and a next handler. It can modify the request, call next(modifiedReq), transform the response Observable, or short-circuit with a cached response. Multiple interceptors chain together in registration order.',
      'The auth token interceptor is the canonical example: clone the request to add an Authorization header, then pass the clone to next(). Always clone — HttpRequest objects are immutable by design to prevent accidental mutations in parallel interceptors.',
      'Interceptors registered with withInterceptors([...]) in provideHttpClient are functional and tree-shakeable. The legacy HttpInterceptor class-based approach still works but is being phased out in favour of the functional style.',
    ],
    example: `export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const token = inject(AuthService).getToken();
  if (!token) return next(req);

  const authed = req.clone({
    headers: req.headers.set('Authorization', \`Bearer \${token}\`)
  });
  return next(authed);
};

// Register in app.config.ts
provideHttpClient(withInterceptors([authInterceptor, loggingInterceptor]))`,
    whyItMatters: 'Without interceptors, every service method that makes an authenticated request must duplicate the token-attachment logic. A single interceptor centralises this, making it easy to swap auth schemes or add retry logic in one place.',
    pitfalls: [
      'Mutating the original request instead of cloning it — HttpRequest is immutable; mutation throws at runtime.',
      'Interceptors that do not call next() — the request never reaches the server and the Observable never emits.',
      'Circular dependency: an interceptor that injects a service that itself uses HttpClient — inject a factory or use the ROOT_INJECTOR pattern to break the cycle.',
    ],
    docsUrl: 'https://angular.dev/guide/http/interceptors',
    sinceVersion: '4.3',
  },
  {
    id: 'concept-http-error-retry',
    topic: 'http',
    title: 'Error handling and retry strategies',
    summary: 'HTTP errors are RxJS error notifications; handle them with catchError and retry transient failures with retry() or retryWhen() before surfacing to the user.',
    explanation: [
      'HttpClient throws HttpErrorResponse for 4xx/5xx status codes and network errors. The error.status, error.message, and error.error (parsed body) properties tell you what went wrong. Catch at the service layer with catchError so components receive a clean Observable.',
      'retry(n) resubscribes to the source Observable (re-fires the request) up to n times on error. Use it for transient network failures. retry({ count: 3, delay: 1000 }) adds a fixed delay between attempts. For exponential backoff, use timer() inside retryWhen().',
      'Global error handling belongs in a dedicated error interceptor. Component-level handling (catchError in the service method) is appropriate for business-logic errors where different routes need different fallbacks.',
    ],
    example: `// Service: type-safe error handling with retry
getUser(id: string): Observable<User> {
  return this.http.get<User>(\`/api/users/\${id}\`).pipe(
    retry({ count: 2, delay: 500 }),       // retry twice on network error
    catchError((err: HttpErrorResponse) => {
      if (err.status === 404) return of(null);
      return throwError(() => err);
    })
  );
}`,
    whyItMatters: 'Unhandled HTTP errors propagate as unhandled promise rejections or silently complete the stream, making it impossible for components to distinguish "no data" from "error" without explicit error state.',
    pitfalls: [
      'Placing retry() after catchError — catchError swallows the error before retry can react to it; retry must come before catchError.',
      'Retrying on non-transient errors (401, 403, 422) — these will never succeed; retry adds unnecessary latency and server load.',
      'Not resetting error state on subsequent successful requests — the UI stays in the error state even after recovery.',
    ],
    docsUrl: 'https://angular.dev/guide/http/make-requests#handling-request-failure',
    sinceVersion: '4.3',
  },
];
