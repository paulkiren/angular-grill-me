# Learning Platform Upgrade Plan

**From assessment engine → complete guide for Angular learners**

This document defines *how* Angular Grill-Me evolves from a proficiency builder / assessment app into a
self-contained learning platform. It is the **platform** counterpart to `docs/KNOWLEDGE-BASE-STRATEGY.md`
(which governs *content*) and feeds the same release train (`ROADMAP.md`, v0.3.0 → v1.0.0+).

> Scope note: this is a plan, not an implementation. Data-model sketches below are *design intent*
> in the style of your existing ADRs/specs — not code to merge as-is.

---

## 1. Thesis

The architecture is already production-grade: signals-only state (`state.service.ts`), pluggable
renderers (`components/renderers/`), data-driven content (`data/questions/*`), Bloom-tagged questions,
version provenance (`sinceVersion` / `deprecatedIn`), and a derived coverage matrix (`coverage-matrix.ts`).

The gap is **purpose, not engineering**. Today the product answers *"how ready am I?"*. A complete guide
must also answer *"what do I learn next, and how?"* — and then close the loop back to assessment.

**The missing primitive is the learning loop:**

```
   LEARN  →  PRACTICE  →  ASSESS  →  DIAGNOSE  →  REMEDIATE  →  RETAIN
     ↑                                                            │
     └──────────────────── spaced review ────────────────────────┘
```

Grill-Me today implements only **ASSESS** well, and **DIAGNOSE** partially (rubric weaknesses).
Everything else is the work below.

---

## 2. Current State (accurate as of v0.2.0-beta.4)

| Area | State |
|---|---|
| Topics with question files | 13 (rxjs, signals, change-detection, di, routing, forms, http, standalone, directives-pipes, component-architecture, testing, angular-evolution, angular-migration) |
| Concept areas targeted in matrix | 16 |
| **Zero-coverage areas** | **3 — SSR & Hydration, Build & Optimization, Accessibility & i18n** |
| Question types | multiple-choice, open-ended, code-snippet, select-all (drag-and-drop typed but unused) |
| Evaluation | local rubric matcher + optional Gemini adapter (correctly non-blocking) |
| Teaching surface | `sampleAnswer` only — shown *after* grading |
| Learning-mode hook | `assessmentEligible: false` flag exists but is underused |

**Verdict:** strong assessment engine, no learning engine. The flag and Bloom metadata mean the
foundation for learning already exists — it just isn't surfaced.

---

## 3. Workstreams (priority order)

Each workstream lists *what*, *why it matters for learners*, *touch points* in the current code,
acceptance criteria, rough effort, and target release phase.

### WS1 — Concept/Lesson layer  ⭐ highest leverage
**What.** Introduce a first-class `Concept` entity: a short explanation, one runnable example,
"why it matters", common pitfalls, an official-docs link, and `sinceVersion`. Each `Question` gains
`conceptId`, linking practice to teaching.

**Why.** The only teaching today (`sampleAnswer`) appears *after* a learner is graded — backwards for
learning. A concept is the thing you *read first*. This single change converts "grill me" into
"teach me, then grill me."

**Touch points.** New `src/app/data/concepts/`; extend `Question` in `interview.models.ts`; new
`concept.ts` renderer; reuse the `assessmentEligible: false` flag for learn-mode items.

**Acceptance.** Every Critical/High concept area has ≥1 concept; each concept links to ≥2 questions;
a learner can open a concept, read it, then start practice from the same screen.

**Effort.** M–L (schema + content authoring is the bulk). **Phase:** v0.3.0.

---

### WS2 — Learning paths (Skills Matrix revamp)  ⭐
**What.** Replace the flat Skills Matrix grid with ordered `LearningPath`s: prerequisite-aware
sequences of `[concept → practice → assessment]` with completion %. Example paths:
"Modern Angular Fundamentals" → "Reactive Forms" → "Signals & Reactivity" → "Performance & Change Detection".

**Why.** Learners need a *next step*, not a buffet. This is almost certainly the "update my skills"
intent — the Skills Matrix becoming a guided curriculum.

**Touch points.** New `src/app/data/paths/`; `topic-matrix.ts` becomes a path browser; `StateService`
tracks path progress (signals already in place for mastery).

**Acceptance.** ≥3 paths shipped; each step gates on prerequisites; dashboard shows path completion %;
a true beginner can follow one path end-to-end without guessing what to do next.

**Effort.** M. **Phase:** v0.3.0.

---

### WS3 — Close the loop: remediation linking  ⭐
**What.** Make `EvaluationResult.weaknesses` / `suggestions` *actionable links* — a low score on a
rubric concept deep-links to the matching `Concept` (WS1) plus targeted practice.

**Why.** Diagnose-then-remediate is the core learning mechanic. Right now the app tells you *what* you
missed but not *where to go*. The data is already there (rubric terms → concepts).

**Touch points.** `evaluation.service.ts` (emit `conceptId` per weakness); results/review screen;
depends on WS1.

**Acceptance.** Every reviewed weakness offers a one-tap "Learn this" → concept + retry; re-assessing
the same concept updates mastery.

**Effort.** S–M. **Phase:** v0.3.0 (after WS1).

---

### WS4 — Coverage completion
**What.** (a) Author the 3 zero-coverage areas: SSR & Hydration, Build & Optimization, Accessibility & i18n.
(b) Push Critical areas to their `v1Target`. (c) Fix Bloom spread.

**Why.** "Complete guide" is a literal claim — gaps undermine it. Current content also skews Mid/Senior
interview-style; learners need genuine **Junior `remember`/`understand`** on-ramps and a few
**Senior `create`-level** capstones.

**Touch points.** New `*.questions.ts` files + register in `questions/index.ts`; refresh the snapshot in
`docs/KNOWLEDGE-BASE-STRATEGY.md`; let the existing `coverage-matrix.ts` enforce thresholds in a spec.

**Acceptance.** All 16 areas at MVP target; every Critical area covers ≥4 Bloom levels; `printCoverageMatrix`
shows zero 🔴 rows.

**Effort.** L (content authoring). **Phase:** v0.3.0 → v0.4.0, continuous.

---

### WS5 — Adaptive difficulty + spaced repetition
**What.** (a) Adaptive quizzes: start Junior, escalate to Mid/Senior on success, ease off on failure.
(b) A lightweight SM-2-style review scheduler that resurfaces weak concepts over time.

**Why.** Fixed per-topic quizzes test; adaptivity *teaches at the edge of ability*, and spaced review
drives **retention** — the difference between cramming and learning.

**Touch points.** Quiz orchestration in `topic-matrix.ts` / a new `quiz-engine`; `StateService` gains a
review queue (per-concept ease + due date); persists alongside existing mastery.

**Acceptance.** Quiz difficulty visibly tracks performance within a session; a "Review due" surface lists
concepts past their interval; mastery decays if a concept is never revisited.

**Effort.** M. **Phase:** v0.4.0.

---

### WS6 — Beginner on-ramp + motivation
**What.** (a) A diagnostic placement quiz that recommends a starting path/level. (b) Motivation layer:
streaks, "concepts mastered X/Y", path-completion badges.

**Why.** An interviewee knows what they want; a learner often doesn't. Placement removes the "where do I
start?" cliff, and progress signals sustain a multi-week learning effort.

**Touch points.** New onboarding flow off `dashboard.ts`; reuse `readinessScore`; extend `UserProgress`.

**Acceptance.** First-run users get a recommended path within ~5 questions; dashboard shows streak +
mastery counts; nothing here blocks experienced users from jumping straight in.

**Effort.** S–M. **Phase:** v0.4.0 → v1.0.0.

---

### WS7 — Evaluation quality (formative vs summative + misconceptions)
**What.** (a) Distinguish **formative** (low-stakes, hints on, unscored) from **summative** (scored,
no hints) modes — `assessmentEligible` is the seed of this. (b) Misconception detection: extend the
`antiPatterns` matchers you already use on `PlaygroundChallenge` to open-ended questions, so wrong-but-common
mental models get named and corrected.

**Why.** Learning-based evaluation isn't just scoring — it's *feedback that changes the mental model*.
Naming a misconception ("you're conflating `computed` with `effect`") teaches more than a number.

**Touch points.** `evaluation.service.ts`; add `antiPatterns?` to `Question`; a `mode` flag on the quiz session.

**Acceptance.** Formative runs never gate progression and always show guidance; ≥1 misconception matcher
per Critical concept; AI feedback (WS-existing) stays optional and clearly secondary.

**Effort.** M. **Phase:** v0.4.0.

---

## 4. Proposed data-model additions (design sketch)

Framed as intent, consistent with your existing `interview.models.ts` style.

```typescript
// New — the teaching primitive (WS1)
export interface Concept {
  id: string;
  topic: string;                 // matches coverage-matrix area id
  title: string;
  summary: string;               // 1–2 sentence "what"
  explanation: string;           // the lesson body (markdown)
  example?: string;              // runnable snippet
  whyItMatters: string;
  pitfalls: string[];
  docsUrl?: string;              // angular.dev deep link
  sinceVersion: string;
  prerequisites?: string[];      // other concept ids
}

// New — guided curriculum (WS2)
export interface LearningPath {
  id: string;
  title: string;
  description: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced';
  steps: LearningStep[];
}
export interface LearningStep {
  kind: 'concept' | 'practice' | 'assessment';
  refId: string;                 // conceptId | questionId | topicId
  prerequisiteStepIds?: string[];
}

// New — retention (WS5)
export interface ReviewItem {
  conceptId: string;
  ease: number;                  // SM-2 ease factor
  intervalDays: number;
  dueAt: number;                 // epoch ms
  lastScore: number;
}

// Extensions to existing Question (WS1, WS3, WS7)
//   conceptId?: string;
//   antiPatterns?: { pattern: string; misconception: string }[];

// Extension to existing UserProgress (WS2, WS5, WS6)
//   pathProgress: Record<string, number>;   // pathId -> % complete
//   reviewQueue: ReviewItem[];
//   streakDays: number;
```

---

## 5. Sequenced rollout (mapped to existing phases)

| Phase | Theme | Workstreams |
|---|---|---|
| **v0.3.0** | Learning foundation | WS1 (concepts), WS2 (paths), WS3 (remediation), WS4 (start coverage) |
| **v0.4.0** | Mastery & retention | WS5 (adaptive + spaced), WS7 (formative/misconceptions), WS4 (finish coverage), WS6 (placement) |
| **v1.0.0** | Polish & reach | WS6 (motivation), a11y (WCAG 2.2 AA from ROADMAP), offline/SW, Playwright E2E |

Rationale: WS1 unblocks WS2 and WS3, so it leads. Coverage (WS4) runs continuously underneath. Retention
(WS5) and feedback quality (WS7) only pay off once there's content to retain and remediate toward.

---

## 6. Definition of done — "a complete guide for Angular learners"

The product earns the claim when a motivated beginner can:

1. Take a placement quiz and receive a recommended path.
2. Open a concept, **learn** it (read + example), then practice it — in one flow.
3. Get scored feedback that **links back** to the exact concept they're weak on.
4. Be **re-shown** that concept later via spaced review until it sticks.
5. See coverage across **all 16 concept areas** with no 🔴 gaps and a sane Bloom spread.
6. Track progress they care about (path %, mastery count, streak) — without any of it blocking an
   experienced user who just wants to grill themselves.

Steps 2–4 are entirely new capability; steps 1, 5, 6 are extensions of what exists.

---

## 7. Open decisions (for you)

- **Concept body format** — markdown rendered in-app, or MDX-ish with embedded live examples?
  (Affects WS1 renderer complexity.)
- **Path authoring** — hand-curated paths, or derived from `coverage-matrix.ts` + prerequisites?
- **Spaced repetition scope** — per-concept only, or also per-question? (SM-2 granularity.)
- **Beginner content split** — new Junior files per area, or a `bloomLevel: 'remember'` filter creating a
  "Fundamentals" view over existing topics?

---

## 8. Quick wins (independent, low-risk, do anytime)

- Refresh the stale snapshot table in `docs/KNOWLEDGE-BASE-STRATEGY.md` (6/19 → current 13 topics).
- Turn `coverage-matrix.ts` thresholds into a failing **spec** so coverage can't regress silently.
- Add a CI check that flags any `*.questions.ts` past its "Next review due" header comment.
- Surface `sinceVersion` in the UI as a teaching signal ("Introduced in Angular 16").
- Wire up the typed-but-unused `drag-and-drop` question type, or drop it from the union to keep the
  contract honest.