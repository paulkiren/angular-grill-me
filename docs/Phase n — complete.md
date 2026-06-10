
  ---
  Phase 1 — complete
  
  SPEC-F01: drag-and-drop renderer

  - src/app/components/renderers/drag-drop-renderer.ts — new component, same signals/CSS-var pattern as the other renderers. Drag state
  (draggingPos, dragOverPos) are signals. Value is a comma-separated string of original option indexes, same serialisation convention as
  select-all.
  - src/app/components/renderers/question-renderer.ts — wired up the new @case ('drag-and-drop') branch and import.
  - drag-drop-renderer.spec.ts — 9 tests covering rendering, order restore, emit on drop, no-op on same-position, drag state cleanup.

  Test coverage (SPEC-T01 + SPEC-T02)

  - state.service.spec.ts — 24 tests covering all mutators, readiness scoring, concept tracking (FEAT-001), localStorage persistence +
  hydration, compression format.
  - evaluation.service.spec.ts — 18 tests covering empty/short answers, rubric matching, dynamic fallback, length bonus, score range, Gemini
  fallback path.

  Data bugfix

  - learning-path.ts — RELATED_TOPICS was referencing 'component-architecture' but the real topic id is 'component-arch'. Fixed — the
  pre-existing concepts.spec.ts integrity test now passes.

  Hooks (settings.local.json)

  - PostToolUse on Edit|Write → runs tsc --noEmit automatically after every file change.
  - Stop → runs git diff --stat HEAD at the end of each session.

  Project-local slash commands (.claude/commands/)

  - /add-concept <topic> — scaffolds a new concept atom with all required fields, wires it into the registry, links a practice question.
  - /add-question <topic> — scaffolds a new question with the full interface shape.
  - /add-challenge — scaffolds a new PlaygroundChallenge.
  - /verify-content — runs tsc + concept integrity tests + full suite + orphaned-conceptId check.


 ---
  Phase 2 content — done
  
  12 new concept files created — every topic in the learning surface now has atoms:

  ┌────────────────────────┬────────────────────────────────────────────────────────────────────────────┐
  │         Topic          │                               Concepts added                               │
  ├────────────────────────┼────────────────────────────────────────────────────────────────────────────┤
  │ RxJS                   │ Subject types, flattening operators, error handling, subscription teardown │
  ├────────────────────────┼────────────────────────────────────────────────────────────────────────────┤
  │ Change Detection       │ Default vs OnPush, markForCheck/detectChanges, Zoneless                    │
  ├────────────────────────┼────────────────────────────────────────────────────────────────────────────┤
  │ Dependency Injection   │ providedIn scopes, inject() function, hierarchical injectors               │
  ├────────────────────────┼────────────────────────────────────────────────────────────────────────────┤
  │ Routing                │ Lazy loading, guards, resolvers                                            │
  ├────────────────────────┼────────────────────────────────────────────────────────────────────────────┤
  │ Forms                  │ Reactive vs template-driven, validators, valueChanges/patchValue           │
  ├────────────────────────┼────────────────────────────────────────────────────────────────────────────┤
  │ HTTP                   │ HttpClient setup, interceptors, error/retry                                │
  ├────────────────────────┼────────────────────────────────────────────────────────────────────────────┤
  │ Standalone             │ Basics, bootstrapApplication                                               │
  ├────────────────────────┼────────────────────────────────────────────────────────────────────────────┤
  │ Directives & Pipes     │ Attribute vs structural, custom pipes                                      │
  ├────────────────────────┼────────────────────────────────────────────────────────────────────────────┤
  │ Component Architecture │ Signal inputs/outputs, lifecycle hooks, content projection                 │
  ├────────────────────────┼────────────────────────────────────────────────────────────────────────────┤
  │ Testing                │ TestBed, mocking services                                                  │
  ├────────────────────────┼────────────────────────────────────────────────────────────────────────────┤
  │ Angular Evolution      │ Major milestones, Ivy                                                      │
  ├────────────────────────┼────────────────────────────────────────────────────────────────────────────┤
  ├────────────────────────┼────────────────────────────────────────────────────────────────────────────┤
  │ Angular Evolution      │ Major milestones, Ivy                                                      │
  ├────────────────────────┼────────────────────────────────────────────────────────────────────────────┤
  │ Angular Migration      │ Standalone migration, signals migration                                    │
  └────────────────────────┴────────────────────────────────────────────────────────────────────────────┘

  Total concepts: 6 (Signals, pre-existing) + 29 new = 35 concepts across all 13 topics.

  Also fixed:
  - LEARN_TOPIC_ORDER had wrong topic ids (component-architecture, ssr, build, a11y-i18n) — corrected to real ids
  - RELATED_TOPICS was referencing the wrong id — fixed and expanded with cross-topic links for all 12 new topics
  - Every concept has at least one conceptId link back from a question — all integrity tests pass

  The /learn surface now has content for the full curriculum. Next natural step would be Phase 3 (hint generation / multi-provider AI
  adapter) or more challenges — your call.
