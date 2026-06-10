// Last reviewed: Angular 21.2 (2026-06)
// Next review due: Angular 22.0 release (~late 2026)
import { Question } from '../../models/interview.models';

export const standaloneTopic = {
  id: 'standalone',
  title: 'Standalone Architecture',
  description: 'Standalone components, directives, pipes, bootstrapApplication, importProvidersFrom, and migration from NgModules.'
};

export const standaloneQuestions: Question[] = [
  {
    id: 'sa-1',
    conceptId: 'concept-standalone-basics',
    topic: 'standalone',
    title: 'What standalone: true removes',
    difficulty: 'Junior',
    questionType: 'multiple-choice',
    bloomLevel: 'understand',
    sinceVersion: '14.0',
    assessmentEligible: true,
    tags: ['standalone', 'NgModule', 'component'],
    questionText: 'When you mark a component `standalone: true`, what does it no longer need, and what replaces it?',
    rubrics: ['no NgModule declaration', 'imports array on component', 'direct dependency', 'self-contained'],
    sampleAnswer: 'A standalone component no longer needs to be declared in an NgModule. Instead, it lists its own dependencies (other standalone components, directives, pipes, and modules) directly in its own `imports` array. This makes the component self-contained — its compile-time dependencies are co-located with the component itself rather than scattered across module files.',
    options: [
      'It no longer needs a template — logic is handled in the class.',
      'It no longer needs to be declared in an NgModule; instead it lists its own dependencies in its own imports array.',
      'It no longer needs @Component — standalone components use @Directive instead.',
      'It no longer needs dependency injection — all services must be inlined.'
    ],
    correctOptionIndex: 1,
    timeLimit: 45,
    rubricMatchers: [
      { pattern: 'NgModule|declaration|declare', term: 'no NgModule declaration', label: 'No longer declared in an NgModule', weight: 3 },
      { pattern: 'imports.*array|component.*imports|own.*imports', term: 'imports array on component', label: 'Imports array on the component itself', weight: 3 },
      { pattern: 'self.?contained|co.?located|own.*dependency', term: 'self-contained', label: 'Dependencies are co-located with the component', weight: 2 },
      { pattern: 'direct|explicit|list.*dep', term: 'direct dependency', label: 'Dependencies listed directly on the component', weight: 1 }
    ]
  },
  {
    id: 'sa-2',
    topic: 'standalone',
    title: 'bootstrapApplication vs platformBrowserDynamic',
    difficulty: 'Mid',
    questionType: 'multiple-choice',
    bloomLevel: 'understand',
    sinceVersion: '14.0',
    assessmentEligible: true,
    tags: ['standalone', 'bootstrap', 'providers'],
    questionText: 'What is the difference between `bootstrapApplication` (standalone) and the older `platformBrowserDynamic().bootstrapModule()` approach?',
    rubrics: ['no root NgModule', 'ApplicationConfig', 'provideRouter', 'tree-shakable providers', 'functional providers'],
    sampleAnswer: '`bootstrapApplication` bootstraps a standalone root component with an `ApplicationConfig` object — no AppModule needed. Providers are registered using tree-shakable functional APIs (`provideRouter`, `provideHttpClient`, `provideAnimations`) rather than via module imports. This gives the bundler better tree-shaking opportunities and keeps the bootstrap call explicit about every feature being enabled.',
    options: [
      'They are identical — bootstrapApplication is just a shorthand alias.',
      'bootstrapApplication takes a standalone root component and ApplicationConfig with functional providers, eliminating the root NgModule entirely.',
      'bootstrapApplication only works for server-side rendering.',
      'platformBrowserDynamic is faster at runtime than bootstrapApplication.'
    ],
    correctOptionIndex: 1,
    timeLimit: 60,
    rubricMatchers: [
      { pattern: 'no.*NgModule|no.*AppModule|without.*module', term: 'no root NgModule', label: 'No root NgModule required', weight: 3 },
      { pattern: 'ApplicationConfig|app\\.config', term: 'ApplicationConfig', label: 'Uses ApplicationConfig object', weight: 3 },
      { pattern: 'provideRouter|provideHttpClient|provideAnimation|functional.*provider', term: 'provideRouter', label: 'Functional provider APIs replace module imports', weight: 3 },
      { pattern: 'tree.?shak|bundle|unused', term: 'tree-shakable providers', label: 'Functional providers are tree-shakable', weight: 2 }
    ]
  },
  {
    id: 'sa-3',
    topic: 'standalone',
    title: 'Importing NgModule-based libraries into standalone components',
    difficulty: 'Mid',
    questionType: 'open-ended',
    bloomLevel: 'apply',
    sinceVersion: '14.0',
    assessmentEligible: true,
    tags: ['standalone', 'NgModule', 'interop', 'importProvidersFrom'],
    questionText: 'You are building a standalone component that needs to use a third-party library that only exposes an NgModule (e.g., `MatButtonModule`). How do you consume it?',
    answerPlaceholder: 'Explain how a standalone component consumes an NgModule-based dependency, and when importProvidersFrom is needed.',
    rubrics: ['import NgModule in imports array', 'declarables from module', 'importProvidersFrom for providers', 'app.config vs component'],
    sampleAnswer: 'A standalone component can add an NgModule directly to its own `imports` array — Angular will make the module\'s exported declarables available inside that component. If the NgModule also registers providers (e.g., `HttpClientModule`), those providers are available within the component\'s injector scope. For root-level providers from NgModules, use `importProvidersFrom(SomeModule)` inside `ApplicationConfig.providers` so they are available application-wide without importing a full module at the root.',
    timeLimit: 90,
    rubricMatchers: [
      { pattern: 'imports.*array|add.*NgModule.*imports|NgModule.*imports', term: 'import NgModule in imports array', label: 'NgModule added to standalone component imports', weight: 3 },
      { pattern: 'exported.*declarable|directive|pipe.*from.*module', term: 'declarables from module', label: 'Exported declarables become available', weight: 2 },
      { pattern: 'importProvidersFrom', term: 'importProvidersFrom for providers', label: 'importProvidersFrom bridges NgModule providers', weight: 3 },
      { pattern: 'app\\.config|ApplicationConfig|root.*provider|global.*provider', term: 'app.config vs component', label: 'Root providers go in ApplicationConfig', weight: 2 }
    ]
  },
  {
    id: 'sa-4',
    topic: 'standalone',
    title: 'Migrating a feature module to standalone',
    difficulty: 'Senior',
    questionType: 'open-ended',
    bloomLevel: 'evaluate',
    sinceVersion: '15.0',
    assessmentEligible: true,
    tags: ['standalone', 'migration', 'NgModule', 'ng generate'],
    questionText: 'Describe the safest incremental approach to migrating an existing NgModule-based feature to standalone components, without breaking the rest of the app.',
    answerPlaceholder: 'Outline the migration order, how to keep the module working during transition, and the final step to remove it.',
    rubrics: ['ng generate migration', 'convert leaf components first', 'keep module as wrapper', 'remove module last', 'test after each step'],
    sampleAnswer: 'The safest approach is leaf-first: convert components that have no child components first, adding `standalone: true` and moving their dependencies into their own `imports` array. The existing NgModule can continue to declare or import them during the transition — Angular supports mixing. Once all components in the module are standalone, convert the module itself to a simple barrel (or remove it if lazy-loaded via `loadComponent`). Use the Angular CLI schematic `ng generate @angular/core:standalone` to automate the conversion. Run tests after each component migration to catch regressions early.',
    timeLimit: 120,
    rubricMatchers: [
      { pattern: 'ng generate|schematic|angular.*core.*standalone|cli.*migrat', term: 'ng generate migration', label: 'Angular CLI schematic automates conversion', weight: 2 },
      { pattern: 'leaf.*first|bottom.*up|no.*child.*first|innermost', term: 'convert leaf components first', label: 'Converts leaf components before parents', weight: 3 },
      { pattern: 'keep.*module|module.*wrapper|module.*still|during.*transit', term: 'keep module as wrapper', label: 'Module continues working during transition', weight: 3 },
      { pattern: 'remove.*module.*last|delete.*module|final.*step.*module', term: 'remove module last', label: 'Module removed only after all components migrated', weight: 2 },
      { pattern: 'test.*each|test.*step|after.*each|incrementally', term: 'test after each step', label: 'Tests run after each incremental step', weight: 2 }
    ]
  }
];
