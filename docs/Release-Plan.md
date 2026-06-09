# Release Plan — Learning Platform

Detailed, release-by-release sequencing of the work in `LEARNING-PLATFORM-UPGRADE-PLAN.md`.
Each release has a **single theme** so it stays shippable solo. This refines the three-phase mapping
in the upgrade plan (v0.3.0 / v0.4.0 / v1.0.0) into smaller increments.

**Conventions.** WS1–WS7 = workstreams from the upgrade plan. Effort: S (~1–2 days), M (~3–5 days),
L (~1–2 weeks) at indie pace. Each release lists *contents → short description*, *exit criteria*,
and *depends on*.

Current baseline: **v0.2.0-beta.4** (assessment engine, 13 topic files, signals state, pluggable renderers).

---

## Release map at a glance

| Version | Codename | One-line goal | WS |
|---|---|---|---|
| v0.3.0 | **Learn Before You're Tested** | A learner can read a concept, then practice it | WS1 |
| v0.4.0 | **Guided Paths** | A learner always knows the next step | WS2 |
| v0.5.0 | **Close the Loop** | A wrong answer routes you to the fix | WS3 + placement |
| v0.6.0 | **Mastery & Retention** | Difficulty adapts; weak concepts come back | WS5 |
| v0.7.0 | **Smarter Feedback** | Feedback corrects the mental model, not just the score | WS7 |
| v1.0.0 | **Production Readiness** | Polished, accessible, offline, tested | motivation + polish |
| v1.1.0+ | **Reach** | Community + sharing (stretch) | future |

Coverage authoring (WS4) runs continuously underneath every release, not as its own milestone.

---

## v0.3.0 — "Learn Before You're Tested"

**Goal.** Introduce teaching content as a first-class citizen, so practice has something to learn *from*
(today the only teaching is `sampleAnswer`, shown after grading).

| Contents | Short description |
|---|---|
| `Concept` data model | New entity: summary, explanation, example, why-it-matters, pitfalls, docs link, `sinceVersion`, prerequisites. Lives in `src/app/data/concepts/`. |
| Concept renderer | A read view for a concept — markdown body + code example — reachable from a topic. |
| Concept → Question link | Add `conceptId` to `Question`; each concept links to ≥2 practice questions. |
| Learn mode | Surface the existing `assessmentEligible: false` flag as unscored, hint-on practice. |
| Concepts for Critical areas | Author concepts for Signals, Change Detection, DI, RxJS, Routing, Forms. |
| *Quick win:* coverage spec | Turn `coverage-matrix.ts` thresholds into a failing test so coverage can't silently regress. |
| *Quick win:* KB refresh | Update the stale snapshot in `docs/KNOWLEDGE-BASE-STRATEGY.md` (6/19 → 13 topics). |

**Exit criteria.** Each Critical area has ≥1 concept; a learner can open a concept, read it, and start
practice from the same screen; the coverage spec passes.

**Depends on.** Nothing — leads the train (unblocks v0.4.0 and v0.5.0). **Effort:** M–L.

---

## v0.4.0 — "Guided Paths"

**Goal.** Replace the flat Skills Matrix with ordered curricula, so a learner is never guessing what to do next.

| Contents | Short description |
|---|---|
| `LearningPath` model | Ordered `[concept → practice → assessment]` steps with level and prerequisites. In `src/app/data/paths/`. |
| Skills Matrix → path browser | Rework `topic-matrix.ts` to present paths, not a topic grid. |
| Path progress tracking | Extend `UserProgress` / `StateService` with `pathProgress` (% complete per path). |
| Prerequisite gating | A step unlocks only when its prerequisite steps are done. |
| 3 starter paths | "Modern Angular Fundamentals", "Reactive Forms", "Signals & Reactivity". |

**Exit criteria.** ≥3 paths ship; steps gate on prerequisites; dashboard shows path completion %; a
beginner can follow one path end-to-end without guessing the next step.

**Depends on.** v0.3.0 (paths reference concepts). **Effort:** M.

---

## v0.5.0 — "Close the Loop"

**Goal.** Make assessment *teach*: a low score routes the learner straight to the concept and a retry.
Add a front door for newcomers.

| Contents | Short description |
|---|---|
| Actionable weaknesses | `EvaluationService` emits a `conceptId` per weakness; review screen renders "Learn this" links. |
| Targeted retry | After remediation, re-assess just that concept and update mastery. |
| Diagnostic placement quiz | A short adaptive intake that recommends a starting path/level off the dashboard. |
| Fill zero-coverage areas (WS4) | Author SSR & Hydration, Build & Optimization, Accessibility & i18n question files; register in `questions/index.ts`. |

**Exit criteria.** Every reviewed weakness offers one-tap "Learn → retry"; first-run users get a
recommended path within ~5 questions; `printCoverageMatrix` shows zero 🔴 rows.

**Depends on.** v0.3.0 (concepts), v0.4.0 (paths to recommend). **Effort:** M.

---

## v0.6.0 — "Mastery & Retention"

**Goal.** Move from "did you pass once" to "do you still know it" — adaptivity + spaced review.

| Contents | Short description |
|---|---|
| Adaptive difficulty engine | Quizzes start Junior and escalate to Mid/Senior on success, ease off on failure. |
| Spaced-repetition scheduler | Lightweight SM-2: `ReviewItem` (ease, interval, dueAt) per concept in `StateService`. |
| "Review due" surface | A dashboard panel listing concepts past their interval, ready to revisit. |
| Mastery decay | Mastery softens over time if a concept is never revisited, nudging review. |

**Exit criteria.** Quiz difficulty visibly tracks in-session performance; a review queue lists due
concepts; unrevisited mastery decays.

**Depends on.** v0.3.0 (concepts are the unit of review). **Effort:** M.

---

## v0.7.0 — "Smarter Feedback"

**Goal.** Make evaluation correct the *mental model*, not just hand back a number.

| Contents | Short description |
|---|---|
| Formative vs summative modes | A session `mode`: formative = unscored, hints on; summative = scored, no hints. Builds on `assessmentEligible`. |
| Misconception detection | Add `antiPatterns` to `Question` (reusing the pattern already on `PlaygroundChallenge`) so common wrong models get named. |
| Bloom completion (WS4) | Ensure every Critical area covers ≥4 Bloom levels — add missing Junior `remember`/`understand` and Senior `create` items. |

**Exit criteria.** Formative runs never gate progression and always show guidance; ≥1 misconception
matcher per Critical concept; AI feedback stays optional and clearly secondary.

**Depends on.** v0.3.0 (concepts to point misconceptions at). **Effort:** M.

---

## v1.0.0 — "Production Readiness"

**Goal.** Ship a polished, accessible, offline-capable platform real learners can rely on. Combines the
motivation layer with the production-quality bar from `ROADMAP.md`.

| Contents | Short description |
|---|---|
| Motivation layer | Streaks, "concepts mastered X/Y", path-completion badges — sustains a multi-week effort. |
| Accessibility (WCAG 2.2 AA) | Full keyboard + screen-reader support across core flows. |
| Offline / service worker | Cache concepts and quizzes for offline study. |
| Playwright E2E | End-to-end coverage of learn → practice → assess → remediate. |
| Performance & build | Optimize bundle size and Lighthouse scores; no critical build warnings. |
| Content at v1 targets | All concept areas at their `v1Target` in the coverage matrix. |

**Exit criteria.** Critical flows pass E2E; the app works offline for study; a11y resolved for
keyboard + screen reader; high Lighthouse accessibility/best-practice scores.

**Depends on.** All prior releases. **Effort:** L.

---

## v1.1.0+ — "Reach" (stretch, post-1.0)

Ideas to park, not commit to yet:

| Idea | Short description |
|---|---|
| Community contributions | Issue/PR templates + schema-validated content so others can add concepts/paths safely. |
| Shareable progress | Export/share a mastery summary or a completed path certificate. |
| Live code execution | Run playground answers in-browser (e.g. WebContainer) instead of pattern-matching. |
| Drag-and-drop questions | Implement the typed-but-unused `drag-and-drop` question type — or drop it from the union. |
| Multi-version content views | Filter content by Angular version using existing `sinceVersion` / `deprecatedIn`. |

---

## Dependency chain (why this order)

```
v0.3.0 Concepts ──┬──► v0.4.0 Paths ──┐
                  │                    ├──► v0.5.0 Close the Loop ──► v0.6.0 Mastery ──► v0.7.0 Feedback ──► v1.0.0
                  └────────────────────┘
```

Concepts (v0.3.0) are the atom everything else references — paths sequence them, remediation links to
them, review schedules them, misconceptions point at them. That's why it leads. Coverage authoring (WS4)
is spread across v0.5.0–v1.0.0 rather than batched, so each release ships usable content.

---

## How to use this with the existing roadmap

`ROADMAP.md` describes the *assessment-tool* journey (v0.0.1 → v1.0.0). This plan layers the
*learning-platform* journey on the same version numbers from v0.3.0 onward. Suggested reconciliation:
keep `ROADMAP.md` as the high-level vision, adopt this file as the execution detail, and let
`docs/KNOWLEDGE-BASE-STRATEGY.md` remain the content-coverage authority that WS4 draws from.