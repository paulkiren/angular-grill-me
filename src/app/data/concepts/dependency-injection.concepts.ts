import { Concept } from '../../models/interview.models';

export const dependencyInjectionConcepts: Concept[] = [
  {
    id: 'concept-di-provided-in',
    topic: 'di',
    title: 'providedIn: root vs component vs platform',
    summary: 'The providedIn field controls which injector registers a service and therefore how many instances exist and when they are destroyed.',
    explanation: [
      'providedIn: "root" registers the service in the root application injector, creating a single shared instance for the entire app. It is also tree-shakeable — if nothing imports it, the bundler removes it. This is the correct default for most singleton services (StateService, AuthService, ApiClient).',
      'providedIn: "any" (deprecated in Angular 14) or providing in a specific component\'s providers array creates a fresh instance per injector. A component-scoped service is instantiated when the component is created and destroyed when the component is destroyed. Use it when the service must own local state tied to one component subtree — a wizard step, a dialog, a dynamically-loaded feature.',
      'Providing in a route\'s providers array (via the route definition) scopes the service to that route\'s injector tree, sharing it across all components in that route while a separate instance exists for each route activation. This is the preferred pattern for feature-level state.',
    ],
    example: `// Root singleton (tree-shakeable)
@Injectable({ providedIn: 'root' })
export class AuthService {}

// Component-scoped (fresh instance per component)
@Component({
  providers: [CartService]  // destroyed with component
})
export class CheckoutComponent {}

// Route-scoped
{ path: 'checkout', component: CheckoutComponent,
  providers: [CheckoutStateService] }`,
    whyItMatters: 'Wrong scope causes either unexpected shared state between features (root when you needed component scope) or unnecessary re-instantiation and missing singleton behaviour (component scope when you needed root).',
    pitfalls: [
      'Providing a stateful service in both root providers AND a component — the component gets its own instance and ignores the root singleton entirely.',
      'Relying on providedIn: "root" for tree-shaking but importing the service in a lazy-loaded module — it gets included in the main bundle anyway due to the injection token reference.',
      'Not providing a service anywhere and injecting it — Angular throws a NullInjectorError at runtime, not at compile time.',
    ],
    docsUrl: 'https://angular.dev/guide/di/dependency-injection-providers',
    sinceVersion: '6.0',
  },
  {
    id: 'concept-di-inject-function',
    topic: 'di',
    title: 'inject() vs constructor injection',
    summary: 'The inject() function resolves a dependency from the current injection context without requiring a constructor parameter, enabling DI in functions, computed values, and class fields.',
    explanation: [
      'Constructor injection is the classic Angular pattern: declare dependencies as typed constructor parameters and Angular resolves them. It is explicit and works everywhere but forces you to list every dependency in the constructor signature, which grows verbose in complex classes.',
      'inject() is a function call that can appear in class fields, factory functions, or any code running inside an injection context (constructor, field initializer, factory provider). It reads the current injector to resolve the token. The chief benefit is that standalone functions — route guards, interceptors, resolver functions — can use DI without a class.',
      'inject() also enables a cleaner pattern for derived signals: declare a computed() signal at field level using inject() in the same initializer, keeping related code together rather than splitting across the constructor and class body.',
    ],
    example: `// Functional guard (Angular 15+) — no class needed
export const authGuard: CanActivateFn = () => {
  const auth = inject(AuthService);
  return auth.isLoggedIn() ? true : inject(Router).createUrlTree(['/login']);
};

// Class field initializer
@Component({ ... })
export class MyComponent {
  private auth = inject(AuthService);
  isAdmin = computed(() => this.auth.currentUser()?.role === 'admin');
}`,
    whyItMatters: 'inject() is the foundation of Angular\'s functional programming model — guards, interceptors, resolvers, and pipes are now single functions rather than classes, which reduces boilerplate and improves tree-shaking.',
    pitfalls: [
      'Calling inject() outside an injection context (e.g. inside an event handler, setTimeout callback, or after construction) — it throws a runtime error.',
      'Using inject() and constructor injection for the same class — mixing works but inject() field initializers run before the constructor body, so constructor code cannot read fields set via inject() before the super call in derived classes.',
      'Forgetting that inject() inside a factory function needs to be called during the factory invocation, not stored for later.',
    ],
    docsUrl: 'https://angular.dev/api/core/inject',
    sinceVersion: '14.0',
  },
  {
    id: 'concept-di-hierarchical',
    topic: 'di',
    title: 'Hierarchical injectors and multi-providers',
    summary: 'Angular maintains a tree of injectors mirroring the component tree; a token lookup walks up the tree until a provider is found or the root is reached.',
    explanation: [
      'Every component, directive, and route can have its own injector. When Angular resolves a dependency it starts at the requesting component\'s injector and walks up through parent component injectors, then the module/environment injector, then the root injector. The first matching provider wins.',
      'This allows child components to override a service for their subtree by re-providing the token in their providers array. The parent still uses the parent\'s instance; only the child subtree gets the override. This pattern enables feature isolation — a dialog component can have its own FormService without affecting the page.',
      'Multi-providers accumulate contributions from multiple providers under a single injection token. Define the token with InjectionToken and use multi: true on each provider. The injector returns an array containing all contributions. This is how Angular\'s HTTP_INTERCEPTORS and APP_INITIALIZER tokens work — each interceptor registers itself and Angular collects them all.',
    ],
    example: `// Multi-provider: collecting interceptors
export const LOG_INTERCEPTOR: Provider = {
  provide: HTTP_INTERCEPTORS,
  useClass: LoggingInterceptor,
  multi: true
};

// Custom InjectionToken with multi
export const VALIDATORS_TOKEN = new InjectionToken<Validator[]>('validators');
{ provide: VALIDATORS_TOKEN, useValue: emailValidator, multi: true }
{ provide: VALIDATORS_TOKEN, useValue: phoneValidator, multi: true }
// inject(VALIDATORS_TOKEN) → [emailValidator, phoneValidator]`,
    whyItMatters: 'Understanding the injector tree prevents "why is my service not updating?" bugs — when you provide a service in a component, you shadow the root singleton for that subtree, which is both a powerful tool and a common source of confusion.',
    pitfalls: [
      'Omitting multi: true when adding to an existing multi-provider token — the new provider silently replaces the entire array instead of appending.',
      'Providing a service lower in the tree and expecting the root singleton to reflect changes — the two instances are independent.',
      'Over-using component-level providers for performance-sensitivity — each component instance creates a new service instance, which adds GC pressure for frequently created/destroyed components.',
    ],
    docsUrl: 'https://angular.dev/guide/di/hierarchical-dependency-injection',
    sinceVersion: '2.0',
  },
];
