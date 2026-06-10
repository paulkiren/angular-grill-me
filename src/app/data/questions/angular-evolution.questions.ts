// Last reviewed: Angular 21.2 (2026-06)
// Next review due: Angular 22.0 release (~late 2026)
import { Question } from '../../models/interview.models';

export const angularEvolutionTopic = {
  id: 'angular-evolution',
  title: 'Angular Evolution & Architecture',
  description: 'Major Angular version transitions, migration decisions, standalone components, and signals/zoneless architecture.'
};

export const angularEvolutionQuestions: Question[] = [
  {
    id: 'ae-1',
    conceptId: 'concept-ae-major-milestones',
    topic: 'angular-evolution',
    title: 'Why standalone components arrived',
    difficulty: 'Mid',
    questionType: 'multiple-choice',
    bloomLevel: 'understand',
    sinceVersion: '14.0',
    assessmentEligible: true,
    tags: ['angular', 'standalone', 'architecture'],
    questionText: 'What was the main motivation for Angular introducing standalone components in v14/v15?',
    rubrics: ['boilerplate', 'NgModule', 'composition', 'developer ergonomics'],
    sampleAnswer: 'Standalone components were introduced to reduce NgModule boilerplate, simplify application composition, and make Angular easier to bootstrap and reason about without module metadata.',
    options: [
      'To make Angular incompatible with older versions of TypeScript.',
      'To eliminate NgModule boilerplate, simplify component composition, and make Angular easier to bootstrap and reason about.',
      'To force all applications to use signals instead of Observables.',
      'To remove dependency injection from component development.'
    ],
    correctOptionIndex: 1,
    timeLimit: 60,
    rubricMatchers: [
      { pattern: 'NgModule|module\\s*boilerplate', term: 'boilerplate', label: 'Reduce NgModule boilerplate', weight: 3 },
      { pattern: 'compose|composition|simplify', term: 'composition', label: 'Simplify application composition', weight: 2 },
      { pattern: 'bootstrap|startup|initialize', term: 'bootstrap', label: 'Make bootstrapping simpler', weight: 1 },
      { pattern: 'developer|ergonomics|easy', term: 'developer ergonomics', label: 'Improve developer ergonomics', weight: 1 }
    ]
  },
  {
    id: 'ae-2',
    topic: 'angular-evolution',
    title: 'Zoneless default and Signals first',
    difficulty: 'Senior',
    questionType: 'open-ended',
    bloomLevel: 'evaluate',
    sinceVersion: '18.0',
    assessmentEligible: true,
    tags: ['angular', 'signals', 'zoneless', 'architecture'],
    questionText: "Explain how Angular 21's zoneless default and signals-first direction change application architecture compared to earlier Zone.js-based versions.",
    answerPlaceholder: 'Describe the architectural impact, change detection behavior, and developer benefits of zoneless apps.',
    rubrics: ['zoneless', 'signals-first', 'change detection', 'performance', 'testability'],
    sampleAnswer: "Angular 21's zoneless default shifts applications away from Zone.js monkey-patching toward explicit reactivity. Signals-first architecture makes UI updates deterministic, reduces hidden side effects, improves testability, and enables better performance by scoping updates to affected computations instead of full-zone change detection.",
    timeLimit: 120,
    rubricMatchers: [
      { pattern: 'zoneless|Zone\\.js|zonejs', term: 'zoneless', label: 'Move away from Zone.js to zoneless execution', weight: 3 },
      { pattern: 'signal|signals-first|computed|effect', term: 'signals-first', label: 'Signals-first reactivity model', weight: 3 },
      { pattern: 'deterministic|predictable|explicit', term: 'change detection', label: 'Deterministic explicit change detection', weight: 2 },
      { pattern: 'performance|fast|overhead', term: 'performance', label: 'Performance and reduced overhead', weight: 2 },
      { pattern: 'test|testability|unit test', term: 'testability', label: 'Improved testability and fewer hidden side effects', weight: 2 }
    ]
  },
  {
    id: 'ae-3',
    topic: 'angular-evolution',
    title: 'Signals-first data flow',
    difficulty: 'Senior',
    questionType: 'code-snippet',
    bloomLevel: 'analyze',
    sinceVersion: '16.0',
    assessmentEligible: true,
    tags: ['angular', 'signals', 'reactivity'],
    questionText: 'Review the code sample below and explain why signals-first data flow is a better fit for zoneless Angular than Zone.js-driven change detection.',
    codeSnippet: 'const count = signal(0);\nconst doubled = computed(() => count() * 2);\nconst logEffect = effect(() => console.log(`Count changed: ${count()}`));',
    answerPlaceholder: 'Describe how this pattern differs from Zone.js and why it is more predictable for Angular 21.',
    rubrics: ['signal', 'computed', 'effect', 'zoneless', 'predictable'],
    sampleAnswer: 'In signals-first data flow, derived values and side effects are explicitly declared. The runtime only re-evaluates the computed value and effect when the source signal changes. This is more predictable than Zone.js because updates are bounded by dependency graphs rather than a global async patching mechanism.',
    timeLimit: 120,
    rubricMatchers: [
      { pattern: 'signal\\(|signals', term: 'signal', label: 'Use explicit signals for state', weight: 2 },
      { pattern: 'computed\\(|derived|memo', term: 'computed', label: 'Derived values are declared and memoized', weight: 2 },
      { pattern: 'effect\\(|side[- ]effect|logging', term: 'effect', label: 'Side effects are declared explicitly', weight: 2 },
      { pattern: 'zoneless|Zone\\.js|zonejs', term: 'zoneless', label: 'Zoneless architecture avoids global patching', weight: 3 },
      { pattern: 'predictable|deterministic|explicit', term: 'predictable', label: 'Predictable reactive update behavior', weight: 2 }
    ]
  }
];
