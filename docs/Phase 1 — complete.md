
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
