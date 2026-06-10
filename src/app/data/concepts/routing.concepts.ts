import { Concept } from '../../models/interview.models';

export const routingConcepts: Concept[] = [
  {
    id: 'concept-routing-lazy-loading',
    topic: 'routing',
    title: 'Lazy loading routes',
    summary: 'Lazy loading defers downloading a route\'s JavaScript until the user navigates to it, reducing the initial bundle size and speeding up first load.',
    explanation: [
      'Without lazy loading all route components are included in the main bundle even if the user never visits those routes. A dashboard app where 80% of users never open the settings page still ships all settings code on every page load.',
      'With loadComponent() (standalone) or loadChildren() (module-based legacy), the router code-splits the component into a separate chunk. The browser only requests that chunk when the user navigates to the route — or when you hint at it with prefetchStrategy.',
      'Lazy loading in standalone apps is simpler: loadComponent: () => import(\'./settings/settings\').then(m => m.SettingsComponent). No NgModule wrapper needed. Preloading strategies (PreloadAllModules, QuicklinkStrategy) can fetch lazy chunks in the background after initial load for instant navigation.',
    ],
    example: `export const routes: Routes = [
  { path: '',          component: HomeComponent },         // eager
  { path: 'settings',
    loadComponent: () =>                                   // lazy
      import('./settings/settings').then(m => m.SettingsComponent)
  },
  { path: 'admin',
    loadChildren: () =>                                    // lazy child routes
      import('./admin/admin.routes').then(m => m.ADMIN_ROUTES)
  },
];`,
    whyItMatters: 'Every kilobyte deferred from the initial bundle improves Time to Interactive. Large SPAs can cut their initial JS budget by 50–70% by lazy-loading feature areas.',
    pitfalls: [
      'Importing a lazy component eagerly in another file (e.g. in a shared module) — the import creates a static reference that collapses the code-split boundary back into the main bundle.',
      'Using loadChildren with a standalone component instead of loadComponent — loadChildren expects an array of routes or an NgModule, not a bare component.',
      'Not setting a preloading strategy and assuming lazy routes will feel instant — without prefetching, the first navigation to a lazy route always has a network round-trip.',
    ],
    docsUrl: 'https://angular.dev/guide/routing/lazy-loading',
    sinceVersion: '2.0',
  },
  {
    id: 'concept-routing-guards',
    topic: 'routing',
    title: 'Route guards — canActivate, canDeactivate, canMatch',
    summary: 'Guards are functions (or classes) that run before navigation completes to allow, redirect, or block it.',
    explanation: [
      'canActivate runs before a route component is created. Return true to proceed, false to cancel, a UrlTree to redirect. It is the standard gate for auth — if the user is not logged in, redirect to /login. Modern Angular prefers the functional form: a plain function using inject().',
      'canDeactivate runs when the user is navigating away from a route. It receives the component instance and can return false to prevent leaving — useful for unsaved form warnings. The functional form receives the component as the first argument.',
      'canMatch runs before the router even matches a route definition. It is the right guard when you want to completely hide a route from certain users — if canMatch returns false the router tries the next matching route definition instead of just blocking navigation.',
    ],
    example: `// Functional guard (Angular 15+)
export const authGuard: CanActivateFn = () => {
  const auth = inject(AuthService);
  return auth.isLoggedIn()
    ? true
    : inject(Router).createUrlTree(['/login']);
};

// canDeactivate for unsaved changes
export const unsavedGuard: CanDeactivateFn<EditFormComponent> =
  (component) => component.hasUnsavedChanges()
    ? confirm('Leave without saving?')
    : true;`,
    whyItMatters: 'Guards are the declarative security layer for Angular routing. Misplaced guard logic (e.g. checking auth inside the component constructor instead of a guard) runs too late and causes visible flashes of protected content.',
    pitfalls: [
      'Returning a boolean synchronously from a guard that needs async data (e.g. checking an API) — the guard must return an Observable or Promise for async checks.',
      'Using canActivate to hide a route that should not exist for certain roles — canMatch is the correct choice because it removes the route from matching entirely.',
      'Placing guards on child routes but forgetting the parent — a user can navigate directly to a deep URL and bypass parent guards.',
    ],
    docsUrl: 'https://angular.dev/guide/routing/common-router-tasks#preventing-unauthorized-access',
    sinceVersion: '2.0',
  },
  {
    id: 'concept-routing-resolvers',
    topic: 'routing',
    title: 'Route resolvers and data pre-fetching',
    summary: 'Resolvers fetch data before a route activates, guaranteeing the component receives its data on first render without a loading state.',
    explanation: [
      'A resolver is a function (or class implementing Resolve) that the router calls before the component is created. It returns an Observable, Promise, or plain value. The router waits for it to complete and passes the result to the component via ActivatedRoute.snapshot.data.',
      'The functional form (ResolveFn) is the modern approach: a plain function using inject() that returns an Observable. Return of(null) or handle errors with catchError to prevent navigation from stalling indefinitely.',
      'Resolvers trade a loading indicator for a navigation delay. Use them when the component cannot meaningfully render without the data (a product detail page without the product). Avoid them for supplementary data (related products, recommendations) that can load after the page appears.',
    ],
    example: `export const productResolver: ResolveFn<Product> = (route) => {
  return inject(ProductService).getById(route.paramMap.get('id')!).pipe(
    catchError(() => inject(Router).createUrlTree(['/not-found']))
  );
};

{ path: 'product/:id',
  component: ProductDetailComponent,
  resolve: { product: productResolver } }

// In component:
const product = inject(ActivatedRoute).snapshot.data['product'] as Product;`,
    whyItMatters: 'Without a resolver, a component that loads data on ngOnInit shows a spinner before any content appears. With a resolver, the previous page stays visible during the fetch and the new page appears fully populated.',
    pitfalls: [
      'A resolver that never completes (Observable that does not complete) stalls navigation forever — always ensure the Observable terminates (use first(), take(1), or a completing HTTP observable).',
      'Using resolvers for data that changes frequently — the resolved value is a snapshot; the component will not react to later changes without a separate subscription.',
      'Forgetting error handling — an uncaught resolver error prevents navigation and leaves the router stuck.',
    ],
    docsUrl: 'https://angular.dev/api/router/ResolveFn',
    sinceVersion: '2.0',
  },
];
