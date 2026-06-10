// Last reviewed: Angular 21.2 (2026-06)
// Next review due: Angular 22.0 release (~late 2026)
import { Question } from '../../models/interview.models';

export const directivesPipesTopic = {
  id: 'directives-pipes',
  title: 'Directives & Pipes',
  description: 'Structural directives, attribute directives, custom pipes, pure vs impure pipes, and the new control flow syntax.'
};

export const directivesPipesQuestions: Question[] = [
  {
    id: 'dp-1',
    conceptId: 'concept-directives-attribute-vs-structural',
    topic: 'directives-pipes',
    title: 'Structural vs attribute directives',
    difficulty: 'Junior',
    questionType: 'multiple-choice',
    bloomLevel: 'understand',
    sinceVersion: '2.0',
    assessmentEligible: true,
    tags: ['directives', 'structural', 'attribute'],
    questionText: 'What is the fundamental difference between a structural directive and an attribute directive?',
    rubrics: ['DOM structure', 'add or remove elements', 'appearance or behaviour', 'asterisk syntax'],
    sampleAnswer: 'A structural directive changes the DOM layout by adding, removing, or manipulating host elements — it is prefixed with `*` in templates (e.g., `*ngIf`, `*ngFor`). An attribute directive changes the appearance or behaviour of an existing element without altering the DOM structure (e.g., `[ngClass]`, `[ngStyle]`, custom highlight directives).',
    options: [
      'Structural directives only work on <div> elements; attribute directives work on any element.',
      'Structural directives add or remove DOM elements; attribute directives modify the look or behaviour of an existing element.',
      'Attribute directives are deprecated in favour of signals.',
      'Structural directives require an NgModule; attribute directives do not.'
    ],
    correctOptionIndex: 1,
    timeLimit: 45,
    rubricMatchers: [
      { pattern: 'add.*remove|remove.*element|DOM.*struct|structure.*DOM', term: 'DOM structure', label: 'Structural directives change DOM layout', weight: 3 },
      { pattern: '\\*ngIf|\\*ngFor|\\*|asterisk', term: 'asterisk syntax', label: 'Structural directives use * prefix', weight: 2 },
      { pattern: 'appearance|behaviour|style|class|look', term: 'appearance or behaviour', label: 'Attribute directives modify appearance/behaviour', weight: 3 },
      { pattern: 'existing.*element|same.*element|not.*add', term: 'add or remove elements', label: 'Attribute directives keep the element in place', weight: 1 }
    ]
  },
  {
    id: 'dp-2',
    topic: 'directives-pipes',
    title: 'New control flow: @if, @for, @switch',
    difficulty: 'Junior',
    questionType: 'multiple-choice',
    bloomLevel: 'understand',
    sinceVersion: '17.0',
    assessmentEligible: true,
    tags: ['directives', 'control flow', '@if', '@for'],
    questionText: 'What advantages does the new built-in control flow syntax (`@if`, `@for`, `@switch`) introduced in Angular 17 have over `*ngIf` and `*ngFor`?',
    rubrics: ['no import needed', 'type narrowing', 'track required', 'better performance', 'else block'],
    sampleAnswer: 'The new control flow blocks are built into the Angular template compiler — no `CommonModule` or `NgIf` import needed. `@if` supports type narrowing in the true branch. `@for` requires a `track` expression, which Angular uses to minimise DOM updates, improving performance. `@switch` supports exhaustive matching. Syntax is also more readable and closer to TypeScript control flow.',
    options: [
      'They are purely cosmetic — there is no functional difference.',
      'They are compiler-native, require no imports, support type narrowing in @if, mandate a track expression in @for for better diffing performance, and have cleaner else/empty block syntax.',
      'They only work with zoneless applications.',
      'They replace dependency injection for conditional rendering.'
    ],
    correctOptionIndex: 1,
    timeLimit: 45,
    rubricMatchers: [
      { pattern: 'no.*import|CommonModule|NgIf.*import|without.*import', term: 'no import needed', label: 'No CommonModule or NgIf import required', weight: 2 },
      { pattern: 'type.*narrow|narrow.*type|TypeScript.*narrow', term: 'type narrowing', label: '@if enables type narrowing in true branch', weight: 3 },
      { pattern: 'track|track.*by|track.*expression', term: 'track required', label: '@for requires a track expression', weight: 3 },
      { pattern: 'performance|DOM.*update|diffing|reconcil', term: 'better performance', label: 'track improves DOM reconciliation performance', weight: 2 }
    ]
  },
  {
    id: 'dp-3',
    topic: 'directives-pipes',
    title: 'Building a custom attribute directive',
    difficulty: 'Mid',
    questionType: 'open-ended',
    bloomLevel: 'apply',
    sinceVersion: '2.0',
    assessmentEligible: true,
    tags: ['directives', 'custom', 'HostListener', 'HostBinding'],
    questionText: 'Describe how you would build a custom directive that highlights an element yellow on mouseenter and removes the highlight on mouseleave.',
    answerPlaceholder: 'Explain the directive class, how to access the host element, and how to respond to host events.',
    rubrics: ['@Directive selector', 'ElementRef or HostBinding', 'HostListener', 'Renderer2 or direct style', 'standalone'],
    sampleAnswer: 'Declare `@Directive({ selector: \'[appHighlight]\', standalone: true })`. Inject `ElementRef` and optionally `Renderer2` (preferred over direct DOM access for SSR safety). Use `@HostListener(\'mouseenter\')` and `@HostListener(\'mouseleave\')` methods to set and clear the background colour via `renderer.setStyle` / `renderer.removeStyle`. Alternatively, use `@HostBinding(\'style.backgroundColor\')` bound to a component property that the host listener toggles.',
    timeLimit: 90,
    rubricMatchers: [
      { pattern: '@Directive|selector.*\\[|attribute.*selector', term: '@Directive selector', label: 'Uses @Directive with attribute selector', weight: 3 },
      { pattern: 'ElementRef|HostBinding|host.*element', term: 'ElementRef or HostBinding', label: 'Accesses host element via ElementRef or @HostBinding', weight: 3 },
      { pattern: 'HostListener|mouseenter|mouseleave|host.*event', term: 'HostListener', label: 'Responds to host events via @HostListener', weight: 3 },
      { pattern: 'Renderer2|setStyle|removeStyle|renderer', term: 'Renderer2 or direct style', label: 'Uses Renderer2 for SSR-safe DOM manipulation', weight: 2 },
      { pattern: 'standalone.*true|standalone.*directive', term: 'standalone', label: 'Directive marked standalone: true', weight: 1 }
    ]
  },
  {
    id: 'dp-4',
    topic: 'directives-pipes',
    title: 'Pure vs impure pipes',
    difficulty: 'Mid',
    questionType: 'multiple-choice',
    bloomLevel: 'analyze',
    sinceVersion: '2.0',
    assessmentEligible: true,
    tags: ['pipes', 'pure', 'impure', 'performance'],
    questionText: 'What is the difference between a pure and an impure pipe, and when would making a pipe impure cause a performance problem?',
    rubrics: ['pure runs on reference change', 'impure runs every CD cycle', 'memoisation', 'expensive operation', 'use sparingly'],
    sampleAnswer: 'A pure pipe (the default) is only re-executed when its input reference changes — Angular memoises the result, so it is safe and cheap. An impure pipe runs on every change detection cycle regardless of input change, which is expensive for large lists or complex transformations. Mark a pipe impure (`pure: false`) only when the output must reflect mutations inside an object or array that do not change the reference — and even then, consider whether a signal or a component method would be cleaner.',
    options: [
      'Pure pipes are deprecated; impure pipes are the new standard in Angular 17+.',
      'A pure pipe runs only when its input reference changes (memoised); an impure pipe runs on every change detection cycle, which is expensive for complex transforms or large data.',
      'Impure pipes are required for async operations.',
      'Pure pipes cannot accept object inputs — only primitives.'
    ],
    correctOptionIndex: 1,
    timeLimit: 60,
    rubricMatchers: [
      { pattern: 'reference.*change|input.*change|ref.*change|pure.*memos|memois', term: 'pure runs on reference change', label: 'Pure pipe runs only on input reference change', weight: 3 },
      { pattern: 'every.*cycle|every.*change.*detect|each.*cycle|CD.*cycle', term: 'impure runs every CD cycle', label: 'Impure pipe runs on every change detection cycle', weight: 3 },
      { pattern: 'expensive|performance|slow|large.*list|cost', term: 'expensive operation', label: 'Impure pipe is expensive for complex transforms', weight: 2 },
      { pattern: 'memois|cache|memoize|result.*store', term: 'memoisation', label: 'Pure pipe result is memoised by Angular', weight: 2 }
    ]
  },
  {
    id: 'dp-5',
    topic: 'directives-pipes',
    title: 'Building a custom pipe',
    difficulty: 'Mid',
    questionType: 'code-snippet',
    bloomLevel: 'apply',
    sinceVersion: '2.0',
    assessmentEligible: true,
    tags: ['pipes', 'custom', 'transform'],
    questionText: 'Review the pipe below and identify one problem with its current implementation.',
    codeSnippet: "@Pipe({ name: 'truncate' })\nexport class TruncatePipe implements PipeTransform {\n  transform(value: string, limit: number): string {\n    if (value.length > limit) {\n      return value.substring(0, limit) + '...';\n    }\n    return value;\n  }\n}",
    answerPlaceholder: 'Identify the problem and describe the fix.',
    rubrics: ['not standalone', 'null safety', 'standalone: true', 'NgModule declaration'],
    sampleAnswer: 'Two issues: (1) The pipe is not marked `standalone: true` — in a standalone-first app it must declare `standalone: true` in the `@Pipe` metadata to be used directly in component `imports` arrays without an NgModule. (2) The `transform` method does not handle a null or undefined `value`, which would cause a runtime error if the pipe receives an unset binding. Fix: add `standalone: true` and guard with `if (!value) return value ?? \'\'`.',
    timeLimit: 60,
    rubricMatchers: [
      { pattern: 'standalone.*true|standalone.*pipe|not.*standalone', term: 'not standalone', label: 'Missing standalone: true in @Pipe metadata', weight: 3 },
      { pattern: 'null|undefined|guard|null.*check|falsy', term: 'null safety', label: 'No null/undefined guard on value parameter', weight: 3 },
      { pattern: 'NgModule|declaration|declare.*module', term: 'NgModule declaration', label: 'Without standalone, must be declared in NgModule', weight: 2 }
    ]
  },
  {
    id: 'dp-6',
    topic: 'directives-pipes',
    title: 'Directive composition API',
    difficulty: 'Senior',
    questionType: 'open-ended',
    bloomLevel: 'evaluate',
    sinceVersion: '15.0',
    assessmentEligible: true,
    tags: ['directives', 'composition', 'hostDirectives'],
    questionText: 'What is the directive composition API (`hostDirectives`) and when is it a better choice than inheritance or a shared service?',
    answerPlaceholder: 'Explain what hostDirectives does, how to expose inputs/outputs, and describe a concrete use case where it beats the alternatives.',
    rubrics: ['hostDirectives', 'compose behaviour', 'expose inputs outputs', 'no inheritance', 'use case'],
    sampleAnswer: '`hostDirectives` lets you attach other directives to a component or directive\'s host element declaratively, composing their behaviour without inheritance. You can selectively expose their `inputs` and `outputs` as if they were your own. Example: a button component that composes a `RippleDirective` and a `TooltipDirective` — both apply to the same host element without the button needing to extend either class. This is better than inheritance (which is single-chain and tightly couples implementation) and better than a shared service (which cannot bind to the host element). The result is reusable, mix-and-match behaviour primitives.',
    timeLimit: 120,
    rubricMatchers: [
      { pattern: 'hostDirectives|host.*directive', term: 'hostDirectives', label: 'Uses hostDirectives API', weight: 3 },
      { pattern: 'compose|mix|combine|attach', term: 'compose behaviour', label: 'Composes behaviour from multiple directives', weight: 3 },
      { pattern: 'expose.*input|expose.*output|forward.*input', term: 'expose inputs outputs', label: 'Selectively exposes inputs and outputs', weight: 2 },
      { pattern: 'no.*inherit|not.*extend|avoid.*inherit|single.*chain', term: 'no inheritance', label: 'Avoids class inheritance limitations', weight: 2 },
      { pattern: 'ripple|tooltip|button|concrete|example', term: 'use case', label: 'Provides a concrete composable use case', weight: 1 }
    ]
  }
];
