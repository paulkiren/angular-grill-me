# Changelog

All notable changes to Angular Grill-Me are documented here.
Format follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/).
Versioning follows [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [Unreleased]

---

## [0.2.0-beta.2] — 2026-06-05

### Added
- **Routing & Navigation** topic (`routing.questions.ts`) — 8 questions (MVP target met):
  - `rt-1` params vs queryParams (Junior, Understand)
  - `rt-2` loadComponent lazy loading (Junior, Understand)
  - `rt-3` Functional route guards with inject() (Mid, Apply)
  - `rt-4` Route resolvers and trade-offs (Mid, Apply)
  - `rt-5` Child routes and shared layouts (Mid, Apply)
  - `rt-6` UrlTree redirects vs router.navigate() (Mid, Analyze)
  - `rt-7` Preloading strategies compared (Senior, Evaluate)
  - `rt-8` Router events and navigation lifecycle (Senior, Analyze)
- **Reactive Forms** topic (`forms.questions.ts`) — 8 questions (MVP target met):
  - `fm-1` FormControl vs FormGroup vs FormArray (Junior, Understand)
  - `fm-2` Built-in vs custom validators (Mid, Apply)
  - `fm-3` Async validators with debounce (Mid, Apply)
  - `fm-4` Typed Reactive Forms — Angular 14+ (Mid, Understand)
  - `fm-5` valueChanges and nested subscribe anti-pattern (Mid, Apply)
  - `fm-6` Dynamic form controls with FormArray (Mid, Apply)
  - `fm-7` Cross-field validation on FormGroup (Senior, Analyze)
  - `fm-8` Reactive vs Template-driven Forms trade-offs (Junior, Evaluate)
- **HTTP & Interceptors** topic (`http.questions.ts`) — 6 questions (MVP target met):
  - `http-1` HttpClient typed responses (Junior, Understand)
  - `http-2` Functional HTTP interceptors (Mid, Apply)
  - `http-3` Error handling with catchError (Mid, Apply)
  - `http-4` Retry strategies with exponential backoff (Senior, Analyze)
  - `http-5` HttpContext tokens to skip interceptors (Senior, Evaluate)
  - `http-6` Request caching interceptor design (Senior, Create)
- All three topics registered in `questions/index.ts`.

### Stats
- Total questions: **49** (was 27)
- Topics with content: **9** (was 6)
- Critical-priority areas at MVP coverage: **5 / 6** (Standalone Architecture remaining)

---

## [0.2.0-beta.1] — 2026-06-05

### Added
- **Knowledge Base Strategy document** (`KNOWLEDGE-BASE-STRATEGY.md`) — full content authority document covering coverage matrix, Bloom's taxonomy targets, quality standards, maintenance rhythm, and beta release targets per phase.
- **Per-topic question files** — `quiz.data.ts` split into six independent files under `src/app/data/questions/`. Adding a new topic now requires only creating a file and registering it in `index.ts`; no other code changes needed.
- **Live coverage matrix** (`src/app/data/coverage-matrix.ts`) — computed from actual question data; shows gap-to-MVP per concept area and Bloom level distribution. Can be imported in specs to assert minimum thresholds. Never goes stale.
- **6 new questions** targeting the Analyze and Evaluate Bloom levels:
  - `rx-4` — Memory leak from unmanaged RxJS subscriptions (Mid, Analyze)
  - `sig-4` — `model()` input for two-way binding (Mid, Apply)
  - `sig-5` — `toSignal()` and `toObservable()` interop utilities (Senior, Evaluate)
  - `cd-3` — Zoneless change detection and developer responsibilities (Senior, Evaluate)
  - `di-3` — `InjectionToken` for typed configuration (Mid, Apply)
  - `di-4` — Component-scoped providers: when and risks (Senior, Evaluate)
- **`BloomLevel` type** added to `interview.models.ts` — `remember | understand | apply | analyze | evaluate | create`.

### Changed
- **`Question` interface** — three new required fields:
  - `bloomLevel: BloomLevel` — cognitive depth of the question
  - `sinceVersion: string` — Angular version that introduced the tested concept
  - `assessmentEligible: boolean` — whether the question is valid for graded (non-hint) sessions
- **`RubricMatcher`** — added optional `weight?: number` (1–5) field to enable partial credit scoring based on concept importance.
- All existing questions backfilled with `bloomLevel`, `sinceVersion`, `assessmentEligible`, and rubric `weight` values.

### Infrastructure
- `quiz.data.ts` reduced to a one-line re-export; `state.service.ts` requires no changes.
- `src/app/data/questions/index.ts` created as the single aggregation point for all topics and questions; stub imports included for all planned v0.2.0–v0.3.0 topics.

---

## [0.1.0] — 2026-06-01

### Added
- Stable `QuestionType` contract: `multiple-choice`, `open-ended`, `code-snippet`, `select-all`.
- Generic renderer host (`question-renderer.ts`) with specialized sub-renderers for each question type.
- Review screen showing scores, feedback, and sample answers after quiz completion.
- Validation state — quiz progression blocked until answer is provided.

### Changed
- Unit test spec configurations fixed for Vitest compatibility.

---

## [0.0.1] — 2026-05-28

### Added
- Initial prototype: topic quiz flow, interview simulator, playground, performance dashboard.
- `quiz.data.ts` and `challenges.data.ts` as declarative content files.
- `StateService` with signals-based state management and localStorage persistence.
- `EvaluationService` with local rubric matching and optional Gemini AI adapter.
- Light/dark theme support synced to localStorage.
- Lazy-loaded standalone routes for all feature areas.

### Changed
- Storage payload reduced by >80% via question ID compression (stores IDs only, reconstructs on hydration).
- History persistence survives full browser refresh.
