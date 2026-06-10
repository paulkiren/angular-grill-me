import { Concept } from '../../models/interview.models';

export const angularEvolutionConcepts: Concept[] = [
  {
    id: 'concept-ae-major-milestones',
    topic: 'angular-evolution',
    title: 'Angular major version milestones',
    summary: 'Each Angular major version since Angular 2 has introduced a defining architectural shift — from modules to standalone, from Zone.js to signals, from class-based APIs to functional ones.',
    explanation: [
      'Angular 2 (2016) was a complete rewrite of AngularJS, introducing TypeScript-first development, components with decorators, and the NgModule system. Angular 4 (2017) reduced generated code size significantly with a new view engine. Angular 8 (2019) introduced Ivy as opt-in.',
      'Angular 9 (2020) made Ivy the default renderer, dramatically reducing bundle sizes through better tree-shaking and enabling purely compile-time template analysis. Angular 12–13 deprecated View Engine entirely and improved strict mode defaults.',
      'Angular 14 (2022) introduced standalone components and typed reactive forms. Angular 16 (2023) brought signal primitives (signal, computed, effect) as stable APIs. Angular 17 (2023) made standalone the default and introduced the new @if / @for / @switch template syntax. Angular 18+ is progressively shipping zoneless change detection.',
    ],
    example: `// Angular 2–16: NgModule required
@NgModule({ declarations: [AppComponent], bootstrap: [AppComponent] })
export class AppModule {}

// Angular 17+: standalone default, no NgModule
bootstrapApplication(AppComponent, {
  providers: [provideRouter(routes), provideHttpClient()]
});`,
    whyItMatters: 'Understanding the evolution prevents cargo-culting outdated patterns. A developer who knows why NgModules existed (and why standalone replaced them) can make better architectural decisions than one who just follows examples.',
    pitfalls: [
      'Assuming Angular follows semver strictly — Angular intentionally releases two major versions per year; a "major" bump often indicates deprecations rather than breaking changes in normal use.',
      'Treating the AngularJS (1.x) migration guides as relevant to modern Angular — they are separate products with no shared codebase.',
      'Confusing Ivy (the compiler/renderer) with the developer-facing API changes that shipped alongside it.',
    ],
    docsUrl: 'https://angular.dev/reference/releases',
    sinceVersion: '2.0',
  },
  {
    id: 'concept-ae-ivy-advantages',
    topic: 'angular-evolution',
    title: 'Ivy — incremental compilation and locality principle',
    summary: 'Ivy compiles each component independently using only its own metadata, enabling faster rebuilds, better tree-shaking, and accurate error messages without global analysis.',
    explanation: [
      'The View Engine compiler (pre-Ivy) needed to analyse all NgModules together to understand which components depended on which — a global compilation step. Rebuilding any file could require reanalysing the whole program.',
      'Ivy\'s "locality principle" means each component\'s compiled output is self-contained. It stores all dependency information it needs inside its own generated code. The compiler can rebuild a single component without touching others, cutting incremental rebuild times substantially for large apps.',
      'Tree-shaking improved dramatically because Ivy\'s generated code only references the Angular runtime functions actually used — @if with no else branch does not include the else-branch code path. Angular libraries compiled with Ivy can also be further optimised by the application\'s bundler.',
    ],
    example: `// Ivy stores component metadata inline in the compiled output
// Each component knows its own deps — no global NgModule graph needed
// This file ↓ is all Ivy needs to understand UserCardComponent
@Component({
  standalone: true,
  imports: [RouterLink, DatePipe],  // explicit dep list
  ...
})
export class UserCardComponent { ... }`,
    whyItMatters: 'Ivy is the prerequisite for standalone components, signals, and every modern Angular performance feature. Interview questions about "what improved in modern Angular" almost always trace back to what Ivy unlocked.',
    pitfalls: [
      'Assuming Ivy-compiled library code is always smaller — partial compilation (what libraries ship) still needs linking at app build time; the size gain comes from the application\'s tree-shaking pass.',
      'Believing Ivy changed the developer-facing decorator API significantly — the component/directive/pipe decorators look the same; Ivy is a compiler and runtime implementation detail.',
    ],
    docsUrl: 'https://angular.dev/guide/ivy',
    sinceVersion: '9.0',
  },
];
