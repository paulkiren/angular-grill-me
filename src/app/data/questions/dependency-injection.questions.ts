// Last reviewed: Angular 21.2 (2026-06)
// Next review due: Angular 22.0 release (~late 2026)
import { Question } from '../../models/interview.models';

export const dependencyInjectionTopic = {
  id: 'di',
  title: 'Dependency Injection (DI)',
  description: 'Hierarchical injection, inject(), InjectionToken, and custom providers.'
};

export const dependencyInjectionQuestions: Question[] = [
  {
    id: 'di-1',
    conceptId: 'concept-di-inject-function',
    topic: 'di',
    title: 'inject() vs Constructor Injection',
    difficulty: 'Mid',
    questionType: 'multiple-choice',
    bloomLevel: 'understand',
    sinceVersion: '14.0',
    assessmentEligible: true,
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
      { pattern: 'context|injection\\s*context', term: 'context', label: 'Requires execution within active injection context', weight: 2 },
      { pattern: 'inheritance|super', term: 'inheritance', label: 'Simplifies inheritance by avoiding super() constructors', weight: 2 },
      { pattern: 'type\\s*safety|type\\s*infer', term: 'type safety', label: 'Excellent type inference support', weight: 2 },
      { pattern: 'functional|function', term: 'functional', label: 'Enables DI in functional route guards and operators', weight: 3 }
    ]
  },
  {
    id: 'di-2',
    topic: 'di',
    title: 'Hierarchical Dependency Injection',
    difficulty: 'Senior',
    questionType: 'open-ended',
    bloomLevel: 'analyze',
    sinceVersion: '2.0',
    assessmentEligible: true,
    tags: ['di', 'hierarchy', 'providers'],
    questionText: 'Explain how Angular resolves a dependency when requested in a child component using hierarchical injectors, and how tree-shakable providers affect bundle sizes.',
    rubrics: ['bubble up', 'element injector', 'environment injector', 'providedIn root', 'tree-shaking'],
    sampleAnswer: 'When a dependency is requested, Angular first searches the Element Injector hierarchy, starting from the requesting component and bubbling up through parent components. If not found, it traverses the Environment Injector hierarchy (route injectors, root environment injector). Tree-shakable providers using @Injectable({ providedIn: "root" }) allow the compiler to omit unused service classes from the final production bundle.',
    timeLimit: 120,
    rubricMatchers: [
      { pattern: 'bubble|lookup|traverse|up', term: 'bubble up', label: 'Traverses the parent element hierarchy', weight: 2 },
      { pattern: 'element\\s*injector', term: 'element injector', label: 'Looks up through Element Injector tree', weight: 3 },
      { pattern: 'environment|root|platform', term: 'environment injector', label: 'Looks up through Environment/Root Injectors', weight: 3 },
      { pattern: 'providedIn|root\\s*provider', term: 'providedIn root', label: 'Registers via providedIn config', weight: 2 },
      { pattern: 'tree-shak|unused|shake', term: 'tree-shaking', label: 'Enables tree-shaking of unused service instances', weight: 3 }
    ]
  },
  {
    id: 'di-3',
    topic: 'di',
    title: 'InjectionToken for typed configuration',
    difficulty: 'Mid',
    questionType: 'multiple-choice',
    bloomLevel: 'apply',
    sinceVersion: '4.0',
    assessmentEligible: true,
    tags: ['di', 'InjectionToken', 'configuration'],
    questionText: 'Why would you use an InjectionToken instead of a class as a DI provider token?',
    rubrics: ['non-class value', 'string collision', 'type safe', 'factory'],
    sampleAnswer: 'InjectionToken is used when you need to inject a non-class value (primitive, interface, object literal, or function). Classes cannot represent interfaces at runtime, and using a string token risks collisions across the app. InjectionToken provides a unique, type-safe token with an optional factory function for the default value.',
    options: [
      'InjectionToken is only used for lazy-loaded module configuration.',
      'You use InjectionToken to inject non-class values (primitives, configs, interfaces) in a type-safe way without string collision risk.',
      'InjectionToken replaces all class providers in Angular 21.',
      'InjectionToken automatically registers the service in the root injector.'
    ],
    correctOptionIndex: 1,
    timeLimit: 60,
    rubricMatchers: [
      { pattern: 'non-class|primitive|interface|config|object', term: 'non-class value', label: 'Inject non-class values', weight: 3 },
      { pattern: 'collision|unique|string token', term: 'string collision', label: 'Avoids string token collisions', weight: 2 },
      { pattern: 'type.?safe|generic|typed', term: 'type safe', label: 'Type-safe injection token', weight: 2 },
      { pattern: 'factory|default.*value|providedIn', term: 'factory', label: 'Optional factory for default value', weight: 1 }
    ]
  },
  {
    id: 'di-4',
    topic: 'di',
    title: 'Component-scoped providers',
    difficulty: 'Senior',
    questionType: 'open-ended',
    bloomLevel: 'evaluate',
    sinceVersion: '2.0',
    assessmentEligible: true,
    tags: ['di', 'scoped providers', 'component'],
    questionText: 'When would you scope a service to a component using `providers: [MyService]` instead of `providedIn: root`? What are the risks?',
    answerPlaceholder: 'Describe the lifecycle difference, use cases, and potential pitfalls.',
    rubrics: ['instance per component', 'destroyed with component', 'use case', 'multiple instances', 'risk'],
    sampleAnswer: 'A component-scoped provider creates a new service instance for each component instance, destroyed when the component is destroyed. Use it when the service holds per-component state (e.g., a form wizard step controller or a component-local cache). The risk is multiple instances: child components get their own instance unless they explicitly look up the parent, which can cause state divergence and hard-to-trace bugs.',
    timeLimit: 120,
    rubricMatchers: [
      { pattern: 'instance.*component|per.*component|one.*each', term: 'instance per component', label: 'New instance per component', weight: 3 },
      { pattern: 'destroy|lifecycle|component.*destroy', term: 'destroyed with component', label: 'Service destroyed with the component', weight: 2 },
      { pattern: 'state|wizard|cache|form|local', term: 'use case', label: 'Per-component state use case', weight: 2 },
      { pattern: 'multiple.*instance|child.*instance|separate', term: 'multiple instances', label: 'Child components get separate instances', weight: 3 },
      { pattern: 'risk|pitfall|diverge|bug|inconsist', term: 'risk', label: 'Risk of state divergence between instances', weight: 2 }
    ]
  }
];
