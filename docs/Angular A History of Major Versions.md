Angular: A History of Major Versions
A walk through Angular's major releases — the key scenarios for each, the problems they solved, and a bit of the technical history behind their evolution. Current as of June 2026: Angular 21 (Nov 2025) is the latest stable release, with Angular 22 in release-candidate stage and due around late May / June 2026.

The four turning points
Before the version-by-version detail, the lineage reads as four turning points:
    1    The AngularJS → Angular 2 break. The most disruptive decision in the framework's life — abandoning backward compatibility, dirty-checking, and $scope for components, TypeScript, and Zone.js. Painful then, but it bought a decade of headroom.
    2    The Ivy migration (~v8–v13). Mostly invisible to app authors but enormous internally: replacing the rendering and compilation engine while keeping millions of apps working. It's why later releases could move fast.
    3    The NgModule retreat (v14–v19). Standalone components went from preview to stable to default. This is the change most likely to make a modern codebase look unfamiliar to someone who started before 2022.
    4    The Signals / zoneless shift (v16 onward). Replacing Zone.js monkey-patching with fine-grained, explicit reactivity. v21 ships new projects without Zone.js; v22 consolidates signals-first, zoneless, OnPush-by-default as the baseline.

Version-by-version
AngularJS 1.x — Oct 2010 (The original framework)
Problems it solved
    •    Manual DOM manipulation made dynamic pages painful
    •    No structure for large client-side apps
    •    Repetitive boilerplate to sync data and UI
Technical history. Born from an internal Google side project (GetAngular). It popularised the single-page-app model and a declarative, HTML-first style years before "SPA" was common.
Signature features: two-way data binding via $scope, dependency injection, directives extending HTML, MVC / MVVM structure.

Angular 2 — Sep 2016 (A complete rewrite)
Problems it solved
    •    AngularJS digest-cycle / dirty-checking didn't scale
    •    Weak typing and hard-to-reason data flow
    •    Poor mobile performance and SEO
Technical history. A ground-up rewrite, intentionally not backward-compatible. TypeScript became the default language and RxJS was adopted for async. The break was so large the team rebranded from "AngularJS" to just "Angular".
Signature features: component-based architecture, TypeScript first, hierarchical dependency injection, RxJS observables, Zone.js change detection.

Angular 4 — Mar 2017 (Smaller, faster — and no v3)
Problems it solved
    •    Large bundle sizes from v2
    •    Verbose template conditionals
    •    Version mismatch across packages
Technical history. Version 3 was skipped: the router package was already at 3.x, so jumping to 4 aligned every package under one number. Introduced semantic versioning and a steady release rhythm.
Signature features: smaller/faster generated code, *ngIf / else syntax, improved AOT compilation, animations moved to their own package.

Angular 5 — Nov 2017 (Build optimisation)
Problems it solved
    •    Slow production builds
    •    Verbose HTTP API (the old Http)
    •    Inconsistent forms validation timing
Technical history. Focused on making AOT the practical default and trimming dead code automatically, setting up the build-performance trajectory later releases continued.
Signature features: Build Optimizer (tree-shaking), new HttpClient, AOT compiler by default, improved i18n and router events.

Angular 6 — May 2018 (Tooling alignment)
Problems it solved
    •    CLI, framework, and Material versions drifted apart
    •    No easy upgrade or add-package path
    •    Services bloating bundles
Technical history. First release where CLI, core, and Material shared a major number. Introduced ng update and ng add, and the angular.json workspace — the toolchain people still use today.
Signature features: ng update / ng add, providedIn tree-shakable services, Angular Elements, RxJS 6, CLI workspaces.

Angular 7 — Oct 2018 (CDK comes of age)
Problems it solved
    •    Rendering long lists was slow
    •    Building drag-and-drop UIs was hard
    •    No guardrails on bundle size
Technical history. The Component Dev Kit (CDK) matured into a genuinely useful toolbox, letting teams build advanced UI behaviour without heavy libraries.
Signature features: virtual scrolling, drag & drop (CDK), bundle budget warnings, CLI prompts.

Angular 8 — May 2019 (Ivy preview)
Problems it solved
    •    Old View Engine produced large bundles
    •    Eager module loading hurt startup
    •    Modern browsers paying for legacy polyfills
Technical history. Shipped an opt-in preview of Ivy, the long-in-development next-gen renderer, plus differential loading so modern browsers got smaller bundles than legacy ones.
Signature features: Ivy preview (opt-in), differential loading, dynamic-import lazy routes, web worker support.

Angular 9 — Feb 2020 (Ivy by default)
Problems it solved
    •    View Engine bundle bloat
    •    Cryptic template error messages
    •    Slow rebuilds
Technical history. The Ivy renderer became the default for every app — a multi-year engineering effort finally landing. Smaller bundles and far better debugging came essentially for free.
Signature features: Ivy default renderer, smaller bundles, better build errors, improved template type-checking.

Angular 10 / 11 — 2020 (Refinement & cleanup)
Problems it solved
    •    Loose project defaults
    •    Slow CLI builds
    •    Legacy dependencies lingering
Technical history. Two maintenance-heavy releases. v10 added stricter project settings and a date-range picker; v11 brought experimental webpack 5, automatic font inlining, and faster builds, while trimming old support.
Signature features: stricter defaults (v10), date-range picker, webpack 5 experimental (v11), automatic font inlining.

Angular 12 — May 2021 (Ivy everywhere)
Problems it solved
    •    Two compilers (Ivy + View Engine) to maintain
    •    Loose typing in templates
    •    Legacy build pipeline
Technical history. View Engine was officially deprecated and the ecosystem pushed fully onto Ivy. Strict mode became the default and nullish coalescing arrived in templates.
Signature features: View Engine deprecated, nullish coalescing in templates, strict mode default, webpack 5 default.

Angular 13 — Nov 2021 (Goodbye View Engine)
Problems it solved
    •    Dual-compiler complexity
    •    IE11 dragging the platform back
    •    Awkward dynamic component creation
Technical history. View Engine was removed entirely and IE11 support dropped — both freeing the team to modernise aggressively. Libraries could now ship in the partial-Ivy format.
Signature features: View Engine removed, IE11 support dropped, simpler ViewContainerRef.createComponent, faster prod builds (esbuild).

Angular 14 — Jun 2022 (Standalone & typed forms)
Problems it solved
    •    NgModule boilerplate everywhere
    •    Reactive forms were untyped (any)
    •    No CLI autocomplete
Technical history. A landmark release: standalone components arrived in preview, beginning the long march away from NgModules. Reactive forms finally got full type-safety.
Signature features: standalone components (preview), typed reactive forms, CLI autocomplete, the inject() function.

Angular 15 — Nov 2022 (Standalone goes stable)
Problems it solved
    •    NgModule still required for many flows
    •    Composing directive behaviour was clumsy
    •    Verbose router & HTTP setup
Technical history. Standalone APIs became stable and were threaded through the router, HttpClient, and more — making NgModule-free apps fully practical end-to-end.
Signature features: standalone APIs stable, directive composition API, functional router guards, streamlined provideHttpClient.

Angular 16 — May 2023 (Signals arrive)
Problems it solved
    •    Zone.js change detection was coarse and opaque
    •    Server-side rendering destroyed and rebuilt the DOM
    •    Slow dev-server builds
Technical history. The biggest reactivity shift since v2: Signals landed in preview, pointing toward a future without Zone.js. Non-destructive hydration made SSR genuinely fast, and esbuild/Vite powered the dev server.
Signature features: Signals (preview), non-destructive hydration, esbuild + Vite dev server, required inputs.

Angular 17 — Nov 2023 (New control flow & rebrand)
Problems it solved
    •    *ngIf / *ngFor were verbose and slow
    •    No first-class lazy-loading of template chunks
    •    Aging brand and docs
Technical history. A reintroduction of Angular: new logo, new angular.dev docs, esbuild as the default builder. Built-in control flow (@if / @for / @switch) and deferrable views (@defer) modernised templates.
Signature features: built-in control flow @if/@for/@switch, deferrable views @defer, esbuild default build, new angular.dev + branding.

Angular 18 — May 2024 (Zoneless preview)
Problems it solved
    •    Zone.js overhead and unpredictability
    •    SSR losing user clicks during hydration
    •    Material stuck on an older design
Technical history. Experimental zoneless change detection shipped, validating the Signals strategy in production-shaped apps. Event replay captured interactions during hydration; Material 3 became stable.
Signature features: zoneless change detection (experimental), event replay for SSR, Material 3 stable, unified control-flow migration.

Angular 19 — Nov 2024 (Standalone by default)
Problems it solved
    •    Standalone still opt-in for new code
    •    Manual loading/error state for async data
    •    Derived signals were awkward
Technical history. Standalone became the default, completing the NgModule transition for new projects. New reactive primitives (linkedSignal, the resource API) made async and derived state first-class.
Signature features: standalone by default, incremental hydration, linkedSignal, resource() API for async.

Angular 20 — May 2025 (Signals stabilise)
Problems it solved
    •    Signals APIs still settling
    •    Reactivity story spread across experimental flags
    •    Build & SSR polish
Technical history. A consolidation release: the core Signals APIs reached stable, making a signals-first architecture the safe, recommended default rather than an experiment.
Signature features: core Signals APIs stable, refined reactive effect timing, SSR & build improvements, continued zoneless hardening.

Angular 21 — Nov 2025 (Zoneless by default)
Problems it solved
    •    Zone.js still shipped in new apps
    •    Karma test runner deprecated
    •    Forms not yet signal-native
Technical history. The experiments pay off: new projects are zoneless by default and Zone.js is no longer included. Vitest replaces Karma as the test runner, and Signal Forms arrive in experimental form.
Signature features: zoneless default (new projects), Vitest replaces Karma, Signal Forms (experimental), selectorless-components groundwork.

What's next: Angular 22
In release-candidate stage as of mid-2026 and expected around late May / June 2026. The expected theme is consolidation rather than novelty: signals-first, zoneless, and OnPush-by-default becoming the assumed baseline, with Signal Forms and selectorless components maturing toward stable.

Practical takeaway
The most practically relevant cluster for a modern codebase is v14 onward — standalone components, typed forms, inject(), and signals. That's the line separating "modern Angular" from a legacy NgModule application.
Release dates and support status verified June 2026. Angular follows a six-month major-release cadence with ~18 months of active support per version.