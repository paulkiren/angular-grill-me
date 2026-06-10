// Last reviewed: Angular 21.2 (2026-06)
// Next review due: Angular 22.0 release (~late 2026)
import { Question } from '../../models/interview.models';

export const routingTopic = {
  id: 'routing',
  title: 'Routing & Navigation',
  description: 'Router configuration, guards, resolvers, lazy loading, route parameters, and navigation lifecycle.'
};

export const routingQuestions: Question[] = [
  {
    id: 'rt-1',
    conceptId: 'concept-routing-lazy-loading',
    topic: 'routing',
    title: 'ActivatedRoute: params vs queryParams',
    difficulty: 'Junior',
    questionType: 'multiple-choice',
    bloomLevel: 'understand',
    sinceVersion: '2.0',
    assessmentEligible: true,
    tags: ['routing', 'activatedRoute', 'parameters'],
    questionText: 'What is the difference between `ActivatedRoute.params` and `ActivatedRoute.queryParams`?',
    rubrics: ['path segment', 'URL query string', 'required', 'optional', 'definition location'],
    sampleAnswer: '`params` contains parameters defined as part of the route path (e.g., `/user/:id`). They are tied to the route definition and considered required for that route. `queryParams` contains key-value pairs appended to the URL after `?` (e.g., `?page=2&sort=asc`). They are optional and not declared in the route config.',
    options: [
      'params is for query strings; queryParams is for path segments.',
      'params holds path segment variables defined in the route config; queryParams holds optional key-value pairs after the ? in the URL.',
      'They are identical — both read from the URL path.',
      'queryParams only works with POST requests.'
    ],
    correctOptionIndex: 1,
    timeLimit: 45,
    rubricMatchers: [
      { pattern: 'path\\s*segment|route\\s*param|:id|:slug', term: 'path segment', label: 'params maps to path segments in route definition', weight: 3 },
      { pattern: 'query\\s*string|\\?|after.*\\?', term: 'URL query string', label: 'queryParams maps to URL query string', weight: 3 },
      { pattern: 'required|defined.*route|route.*defin', term: 'required', label: 'Path params are required by route definition', weight: 2 },
      { pattern: 'optional|not.*declared|any.*route', term: 'optional', label: 'Query params are optional and not in route config', weight: 2 }
    ]
  },
  {
    id: 'rt-2',
    topic: 'routing',
    title: 'Lazy loading with loadComponent',
    difficulty: 'Junior',
    questionType: 'multiple-choice',
    bloomLevel: 'understand',
    sinceVersion: '14.0',
    assessmentEligible: true,
    tags: ['routing', 'lazy-loading', 'standalone'],
    questionText: 'What is the purpose of `loadComponent` in an Angular route definition, and what does it improve?',
    rubrics: ['dynamic import', 'initial bundle', 'lazy load', 'standalone component'],
    sampleAnswer: '`loadComponent` uses a dynamic import to load a standalone component only when that route is first navigated to. This keeps the component out of the initial application bundle, reducing the startup download size and improving initial load performance.',
    options: [
      'loadComponent forces a component to load synchronously before the app starts.',
      'loadComponent dynamically imports a standalone component when its route is first visited, reducing the initial bundle size.',
      'loadComponent replaces @Component decorator with a factory function.',
      'loadComponent is only for NgModule-based architectures.'
    ],
    correctOptionIndex: 1,
    timeLimit: 45,
    rubricMatchers: [
      { pattern: 'dynamic\\s*import|import\\(', term: 'dynamic import', label: 'Uses dynamic import() syntax', weight: 3 },
      { pattern: 'initial.*bundle|bundle.*size|startup', term: 'initial bundle', label: 'Reduces initial bundle size', weight: 3 },
      { pattern: 'lazy|on.*demand|when.*navigat', term: 'lazy load', label: 'Component loads on first navigation', weight: 2 },
      { pattern: 'standalone', term: 'standalone component', label: 'Works with standalone components', weight: 1 }
    ]
  },
  {
    id: 'rt-3',
    topic: 'routing',
    title: 'Functional route guards',
    difficulty: 'Mid',
    questionType: 'multiple-choice',
    bloomLevel: 'apply',
    sinceVersion: '14.0',
    assessmentEligible: true,
    tags: ['routing', 'guards', 'canActivate'],
    questionText: 'What is the modern way to write a `canActivate` guard in Angular 14+ and why is it preferred over class-based guards?',
    rubrics: ['inject function', 'plain function', 'no class', 'tree-shakable', 'router state'],
    sampleAnswer: 'Modern guards are plain functions that use `inject()` to access services, returning a boolean, UrlTree, or Observable/Promise thereof. They are preferred because they are simpler to write, need no class boilerplate, are tree-shakable, and can be composed inline in the route config without separate injection tokens.',
    options: [
      'Use a class implementing CanActivate with a canActivate() method decorated with @Injectable.',
      'Use a plain function with inject() for dependencies, returning boolean or UrlTree — simpler, tree-shakable, and composable inline.',
      'Guards must always be async and return a Promise<boolean>.',
      'Functional guards require a separate module to be imported.'
    ],
    correctOptionIndex: 1,
    timeLimit: 60,
    rubricMatchers: [
      { pattern: 'inject\\(|inject function', term: 'inject function', label: 'Uses inject() inside the guard function', weight: 3 },
      { pattern: 'plain\\s*function|arrow\\s*function|no.*class', term: 'plain function', label: 'Guard is a plain function, not a class', weight: 3 },
      { pattern: 'tree.?shak|unused|bundle', term: 'tree-shakable', label: 'Plain functions are tree-shakable', weight: 2 },
      { pattern: 'UrlTree|redirect|boolean', term: 'router state', label: 'Returns boolean, UrlTree, or async equivalent', weight: 2 }
    ]
  },
  {
    id: 'rt-4',
    topic: 'routing',
    title: 'Route resolvers',
    difficulty: 'Mid',
    questionType: 'open-ended',
    bloomLevel: 'apply',
    sinceVersion: '2.0',
    assessmentEligible: true,
    tags: ['routing', 'resolver', 'data'],
    questionText: 'Explain what a route resolver does and when you would use one instead of loading data inside the component.',
    answerPlaceholder: 'Describe the resolver lifecycle, what it guarantees, and the trade-off versus loading inside the component.',
    rubrics: ['pre-fetch', 'before render', 'ActivatedRoute data', 'loading state', 'trade-off'],
    sampleAnswer: 'A resolver pre-fetches data before the route is activated, making the data available via `ActivatedRoute.data` the moment the component renders. Use it when the component must not render at all without its data (e.g., a detail page that would be empty or broken without an entity). The trade-off is that navigation is delayed until the resolver completes, so for large or slow data it can feel unresponsive — in those cases loading inside the component with a skeleton/loading state is better UX.',
    timeLimit: 90,
    rubricMatchers: [
      { pattern: 'pre.?fetch|before.*render|before.*navigat|before.*activat', term: 'pre-fetch', label: 'Data is fetched before the route activates', weight: 3 },
      { pattern: 'ActivatedRoute|route\\.data|data\\s*snapshot', term: 'ActivatedRoute data', label: 'Data available via ActivatedRoute.data', weight: 3 },
      { pattern: 'loading.*state|skeleton|spinner', term: 'loading state', label: 'Alternative: loading state inside component', weight: 2 },
      { pattern: 'delay|slow|unresponsive|trade.?off|block', term: 'trade-off', label: 'Navigation is blocked until resolver completes', weight: 2 }
    ]
  },
  {
    id: 'rt-5',
    topic: 'routing',
    title: 'Child routes and named outlets',
    difficulty: 'Mid',
    questionType: 'multiple-choice',
    bloomLevel: 'apply',
    sinceVersion: '2.0',
    assessmentEligible: true,
    tags: ['routing', 'child routes', 'router-outlet'],
    questionText: 'When would you define child routes under a parent route rather than flat sibling routes?',
    rubrics: ['shared layout', 'nested outlet', 'parent component', 'URL segment', 'common UI'],
    sampleAnswer: 'Child routes are used when several routes share a parent component that provides a common layout (e.g., a sidebar, breadcrumb, or tab bar). The parent component renders a `<router-outlet>` where child views are projected. The child URL is built by appending the child path to the parent path, keeping the URL structure and the component hierarchy in sync.',
    options: [
      'Child routes are required for any route that uses lazy loading.',
      'Child routes are used when routes share a parent component providing a common layout, with the parent rendering a <router-outlet> for child views.',
      'Child routes are only for authenticated sections of the app.',
      'Child routes automatically apply the parent canActivate guard to all children.'
    ],
    correctOptionIndex: 1,
    timeLimit: 60,
    rubricMatchers: [
      { pattern: 'shared.*layout|common.*layout|layout.*component', term: 'shared layout', label: 'Parent provides a shared layout', weight: 3 },
      { pattern: 'router.outlet|nested.*outlet|outlet', term: 'nested outlet', label: 'Parent renders a <router-outlet>', weight: 3 },
      { pattern: 'parent.*component|shell.*component', term: 'parent component', label: 'Parent component wraps child views', weight: 2 },
      { pattern: 'URL|path.*append|segment', term: 'URL segment', label: 'Child URL appended to parent URL', weight: 1 }
    ]
  },
  {
    id: 'rt-6',
    topic: 'routing',
    title: 'Router navigation and UrlTree redirects',
    difficulty: 'Mid',
    questionType: 'code-snippet',
    bloomLevel: 'analyze',
    sinceVersion: '7.1',
    assessmentEligible: true,
    tags: ['routing', 'guards', 'UrlTree', 'redirect'],
    questionText: 'Review the guard below. What does returning a UrlTree do, and why is this preferred over calling `router.navigate()` inside the guard?',
    codeSnippet: "export const authGuard = () => {\n  const auth = inject(AuthService);\n  const router = inject(Router);\n  return auth.isLoggedIn()\n    ? true\n    : router.createUrlTree(['/login']);\n};",
    answerPlaceholder: 'Explain what UrlTree signals to the router and the problem with calling router.navigate() instead.',
    rubrics: ['cancel navigation', 'single navigation', 'no race condition', 'router controlled', 'UrlTree'],
    sampleAnswer: 'Returning a UrlTree tells the Angular router to cancel the current navigation and immediately start a new navigation to the given URL — all within a single router transaction. Calling `router.navigate()` inside a guard triggers a second independent navigation while the first is still being cancelled, which can cause race conditions, incorrect history entries, and double guard evaluation.',
    timeLimit: 90,
    rubricMatchers: [
      { pattern: 'cancel.*navigat|abort.*navigat', term: 'cancel navigation', label: 'Current navigation is cancelled', weight: 3 },
      { pattern: 'single.*navigat|one.*navigat|atomic', term: 'single navigation', label: 'Redirect happens in one router transaction', weight: 3 },
      { pattern: 'race.*condition|concurrent|double', term: 'no race condition', label: 'Avoids race conditions from two navigations', weight: 3 },
      { pattern: 'router.*control|router.*handle|router.*manage', term: 'router controlled', label: 'Router manages the redirect, not the guard', weight: 2 }
    ]
  },
  {
    id: 'rt-7',
    topic: 'routing',
    title: 'Preloading strategies',
    difficulty: 'Senior',
    questionType: 'open-ended',
    bloomLevel: 'evaluate',
    sinceVersion: '2.0',
    assessmentEligible: true,
    tags: ['routing', 'preloading', 'performance'],
    questionText: 'Compare `PreloadAllModules`, `NoPreloading`, and a custom preloading strategy. When would you choose each?',
    answerPlaceholder: 'Describe what each strategy does and give a real scenario where each is the right choice.',
    rubrics: ['PreloadAllModules', 'NoPreloading', 'custom strategy', 'bandwidth', 'data attribute'],
    sampleAnswer: '`NoPreloading` (default) loads lazy modules only on demand — best for low-traffic apps or when bandwidth is a concern. `PreloadAllModules` downloads all lazy bundles in the background after the initial load — good for apps where all routes are commonly visited. A custom preloading strategy (implementing `PreloadingStrategy`) lets you selectively preload based on route data (e.g., `data: { preload: true }`), user role, network quality, or viewport position — ideal for large apps where preloading everything would waste bandwidth.',
    timeLimit: 120,
    rubricMatchers: [
      { pattern: 'PreloadAllModules|preload.*all', term: 'PreloadAllModules', label: 'Preloads all lazy modules in background', weight: 2 },
      { pattern: 'NoPreloading|no.*preload|on.*demand', term: 'NoPreloading', label: 'Loads modules only when navigated to', weight: 2 },
      { pattern: 'custom.*strategy|PreloadingStrategy|implement.*preload', term: 'custom strategy', label: 'Custom strategy implementing PreloadingStrategy', weight: 3 },
      { pattern: 'bandwidth|network|data.*saver|connection', term: 'bandwidth', label: 'Network/bandwidth consideration for strategy choice', weight: 2 },
      { pattern: 'route.*data|data.*preload|selective|flag', term: 'data attribute', label: 'Custom strategy uses route data flags', weight: 2 }
    ]
  },
  {
    id: 'rt-8',
    topic: 'routing',
    title: 'Router events and navigation lifecycle',
    difficulty: 'Senior',
    questionType: 'open-ended',
    bloomLevel: 'analyze',
    sinceVersion: '2.0',
    assessmentEligible: true,
    tags: ['routing', 'router events', 'lifecycle'],
    questionText: 'Describe the sequence of Router events fired during a successful navigation and how you would use them to implement a global navigation progress indicator.',
    answerPlaceholder: 'List the key events in order and explain how you would subscribe and update UI state.',
    rubrics: ['NavigationStart', 'NavigationEnd', 'NavigationCancel', 'NavigationError', 'router.events', 'filter operator'],
    sampleAnswer: 'A successful navigation fires: NavigationStart → RoutesRecognized → GuardsCheckStart → GuardsCheckEnd → ResolveStart → ResolveEnd → NavigationEnd. A cancelled navigation ends with NavigationCancel; an error with NavigationError. For a progress indicator, inject Router, subscribe to `router.events`, pipe through `filter()` to detect NavigationStart (show spinner) and NavigationEnd/Cancel/Error (hide spinner). Use `takeUntilDestroyed()` to clean up.',
    timeLimit: 120,
    rubricMatchers: [
      { pattern: 'NavigationStart', term: 'NavigationStart', label: 'NavigationStart marks beginning of navigation', weight: 2 },
      { pattern: 'NavigationEnd', term: 'NavigationEnd', label: 'NavigationEnd marks successful completion', weight: 2 },
      { pattern: 'NavigationCancel|NavigationError', term: 'NavigationCancel', label: 'Cancel/Error events handled for cleanup', weight: 2 },
      { pattern: 'router\\.events|events\\$', term: 'router.events', label: 'Subscribe to router.events observable', weight: 3 },
      { pattern: 'filter|instanceof|pipe', term: 'filter operator', label: 'Filter events by type using RxJS filter()', weight: 3 }
    ]
  }
];
