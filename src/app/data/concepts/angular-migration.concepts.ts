import { Concept } from '../../models/interview.models';

export const angularMigrationConcepts: Concept[] = [
  {
    id: 'concept-migration-standalone',
    topic: 'angular-migration',
    title: 'Migrating to standalone components',
    summary: 'The ng generate migration standalone schematic converts NgModule-based apps incrementally, moving declarations to standalone components one at a time.',
    explanation: [
      'Migration does not have to be all-at-once. Standalone components can coexist with NgModule-declared components — a standalone component can be imported into an NgModule\'s imports array, and an NgModule-declared component can be imported by a standalone component via its NgModule.',
      'The Angular CLI ships a built-in migration: npx ng generate @angular/core:standalone runs in three modes — convert components/directives/pipes to standalone, remove unnecessary NgModules, and convert bootstrapModule to bootstrapApplication. Run each mode in sequence, committing between steps.',
      'After migrating, audit for common issues: modules that only existed to re-export other modules (can be deleted), forRoot() providers that now belong in app.config.ts, and lazy-loaded NgModules replaced with loadComponent() or route-level providers arrays.',
    ],
    example: `# Step 1: convert declarations to standalone
npx ng generate @angular/core:standalone --mode=convert-to-standalone

# Step 2: remove empty NgModules
npx ng generate @angular/core:standalone --mode=prune-ng-modules

# Step 3: switch to bootstrapApplication
npx ng generate @angular/core:standalone --mode=standalone-bootstrap`,
    whyItMatters: 'Most real-world Angular projects were created before standalone existed. Knowing the incremental migration path signals that you can improve existing codebases, not just greenfield ones.',
    pitfalls: [
      'Running all three migration modes at once without testing between steps — each step changes a lot of files; if something breaks it is hard to pinpoint the cause.',
      'Assuming the schematic handles 100% of cases — it handles the mechanical transformation but may leave route provider arrays or APP_INITIALIZER patterns that need manual adjustment.',
      'Forgetting to run tests after each migration step — many Angular tests rely on the module structure and need updating.',
    ],
    docsUrl: 'https://angular.dev/reference/migrations/standalone',
    sinceVersion: '15.2',
  },
  {
    id: 'concept-migration-signals',
    topic: 'angular-migration',
    title: 'Migrating from RxJS state to signals',
    summary: 'The signals migration replaces BehaviorSubject state with signal(), computed(), and effect() incrementally using the Angular CLI signals migration schematic.',
    explanation: [
      'The typical pattern being replaced is a service with private BehaviorSubjects exposed as Observables (private _user$ = new BehaviorSubject(null); user$ = this._user$.asObservable()). The signal equivalent is private _user = signal<User | null>(null); user = this._user.asReadonly().',
      'Components that consume BehaviorSubject values via async pipe in templates can be migrated to read signals directly ({{ user().name }}) — no async pipe, no subscription, no null check on the async pipe value.',
      'The incremental approach: migrate leaf-level service state first (values that nothing else derives from), then derived state (replace .pipe(map(...)) chains with computed()), and finally effects (replace .subscribe(...) side-effects with effect()). Do not migrate and remove Zone.js simultaneously — do signals first, then switch to provideZonelessChangeDetection() once the entire app uses signals.',
    ],
    example: `// Before (BehaviorSubject)
private _count$ = new BehaviorSubject(0);
count$ = this._count$.asObservable();
increment() { this._count$.next(this._count$.value + 1); }

// After (signals)
private _count = signal(0);
count = this._count.asReadonly();
increment() { this._count.update(n => n + 1); }`,
    whyItMatters: 'Signals migration is the path to zoneless Angular. An interviewer asking about signals migration is really asking whether you understand the trade-offs and can execute a safe, incremental upgrade on a production codebase.',
    pitfalls: [
      'Migrating services that are consumed by external libraries that expect Observables — keep the Observable interface and derive it with toObservable() from the signal.',
      'Removing Zone.js and migrating to signals in the same PR — this conflates two concerns and makes debugging regressions harder.',
      'Forgetting that effect() is not a replacement for every subscribe() — pure data derivation belongs in computed(), not effect(). Only side-effects (logging, localStorage sync) belong in effect().',
    ],
    docsUrl: 'https://angular.dev/guide/signals',
    sinceVersion: '17.2',
  },
];
