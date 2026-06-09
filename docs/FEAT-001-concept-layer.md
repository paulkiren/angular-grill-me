# FEAT-001 — Concept Layer (v0.3.0 vertical slice)

**Status:** Draft · **Target:** v0.3.0 · **Slice scope:** Signals only
**Theme:** "Learn Before You're Tested" · **Workstream:** WS1

> This is a *vertical slice*: build the full Learn → Practice path for **one** topic (Signals), end to end,
> to lock the content schema before bulk authoring. It is intentionally narrow. Paths, remediation,
> spaced repetition, and progress tracking are **out of scope** and land in later releases.

---

## 1. Context

Today the only teaching surface is `Question.sampleAnswer`, shown *after* grading. There is no entity a
learner can read *before* being tested. The engine is otherwise strong: 13 topic files, signals-based
`StateService`, pluggable renderers (`question-renderer.ts` switches on `questionType`), Bloom metadata,
and version provenance.

We introduce a `Concept` — the teaching atom — and prove it works against Signals, the strongest existing
content (`sig-1`…`sig-n` in `signals.questions.ts`).

## 2. Goal

A learner can open a Signals concept, read it (explanation + example + pitfalls), and jump straight into
the existing practice questions for that concept — without any change to scoring, persistence, or the
other 12 topics.

## 3. Scope

**In scope**
- `Concept` interface + optional `conceptId` link on `Question` (additive, non-breaking).
- `src/app/data/concepts/signals.concepts.ts` (3 concepts) + `concepts/index.ts` registry.
- `ConceptRendererComponent` — read view listing linked questions with a "Practice this" action.
- One route + one entry point from the Signals topic to reach concepts.
- An integrity spec (no orphan links).

**Out of scope (deferred)**
- Learning paths / prerequisites → v0.4.0 (WS2).
- Remediation deep-links from evaluation → v0.5.0 (WS3).
- Progress/mastery for learn mode, spaced repetition → v0.6.0 (WS5).
- Markdown/MDX rendering → use structured fields now (see §6, Decision D1).
- Concepts for any topic other than Signals → after the schema is locked.

## 4. Non-goals / guardrails

- **No change** to `StateService` persistence (the localStorage compression `effect` stays untouched).
- **No change** to `readinessScore` math — learn mode is unscored.
- **No migration** of the existing 13 question files — `conceptId` is optional.

## 5. Data model changes (`models/interview.models.ts`)

```typescript
// NEW — the teaching atom
export interface Concept {
  id: string;            // e.g. 'concept-signals-vs-observables'
  topic: string;         // matches Topic.id / Question.topic, e.g. 'signals'
  title: string;
  summary: string;       // one-sentence "what is this"
  explanation: string[]; // paragraphs — array avoids a markdown dependency (D1)
  example?: string;      // code snippet, rendered in <pre><code>
  whyItMatters: string;
  pitfalls: string[];    // common mistakes, plain strings
  docsUrl?: string;      // angular.dev deep link
  sinceVersion: string;  // mirrors Question.sinceVersion
}

// CHANGE — additive, optional, no data migration
export interface Question {
  // ...existing fields unchanged...
  conceptId?: string;    // links practice back to the concept it tests
}
```

## 6. File-by-file plan

| File | Action | Detail |
|---|---|---|
| `models/interview.models.ts` | edit | Add `Concept`; add optional `conceptId` to `Question`. |
| `data/concepts/signals.concepts.ts` | new | 3 concepts (see §7), with `// Last reviewed` header mirroring the questions files. |
| `data/concepts/index.ts` | new | Export `allConcepts` array — mirror `questions/index.ts` pattern. |
| `data/questions/signals.questions.ts` | edit | Add `conceptId` to `sig-1`, `sig-2`, `sig-3` (link only Signals questions). |
| `components/renderers/concept-renderer.ts` | new | Standalone, `input.required<Concept>()`, `@switch`-free read view; renders summary, explanation, `<pre>` example, pitfalls, docs link, and linked questions. |
| `components/learn.ts` *(or extend `topic-matrix.ts`)* | new/edit | Lists concepts for a topic; a "Learn" entry on the Signals card opens them. |
| `app.routes.ts` | edit | Add `concept/:conceptId` (and/or `learn/:topicId`) lazy route. |
| `data/concepts/concepts.spec.ts` | new | Integrity tests (see §9). |

> Note: `StateService` reads questions via `quiz.data.ts`. Concept→question lookup is a pure helper over
> `allConcepts` + `allQuestions` (`questionsForConcept(id) = allQuestions.filter(q => q.conceptId === id)`).
> No state mutation needed for this slice.

## 7. Content — the Signals proof (3 concepts)

| Concept id | Title | Links to | Source |
|---|---|---|---|
| `concept-signals-vs-observables` | Signals vs Observables | `sig-1` | existing |
| `concept-computed-vs-effect` | `computed()` vs `effect()` | `sig-2`, `sig-3` | existing |
| `concept-signal-basics` | What a `signal()` is | (new Junior `remember` Q, optional) | new |

Concept bodies are written from the existing `sampleAnswer` + `rubricMatchers` so content stays
consistent with how questions are graded. `concept-computed-vs-effect` should explicitly name the classic
misconception ("`computed()` can write signals") — that text becomes an `antiPatterns` matcher in v0.7.0.

## 8. UX flow (slice)

```
Signals topic card → [Learn] → concept list → open concept
   → read (summary · explanation · example · pitfalls · docs)
   → [Practice this] → existing quiz flow for the linked question(s)
```

No new scoring screens; "Practice this" hands off to the quiz engine already in place.

## 9. Acceptance criteria

1. `Concept` interface exists; `Question.conceptId` is optional; the other 12 topic files compile unchanged.
2. `signals.concepts.ts` ships 3 concepts; `allConcepts` is exported and registered.
3. `sig-1/2/3` carry a valid `conceptId`.
4. `ConceptRendererComponent` renders all fields and lists linked questions with a working "Practice this".
5. A learner can reach a Signals concept from the UI and start practice from it.
6. **Integrity spec passes:** every `conceptId` on a question resolves to a real concept; every
   `concept.topic` exists in `allTopics`; no concept has zero linked questions (warn-level).
7. Existing test suite (`npm test`) stays green; no `any` introduced; prettier clean.
8. `localStorage` schema and `readinessScore` output are byte-for-byte unchanged for existing users.

## 10. Test plan

- **Unit (integrity):** orphan-link detection; topic existence; concept↔question round-trip helper.
- **Unit (renderer):** renders summary, each explanation paragraph, the `<pre>` example when present,
  pitfalls list, and emits the practice action.
- **Manual:** open Signals concept → read → Practice this → existing quiz renders the linked question.

## 11. Risks & mitigations

| Risk | Mitigation |
|---|---|
| Scope creep into paths/progress | Hard guardrails in §4; this slice writes no progress state. |
| Markdown temptation pulls in a dependency | D1: structured fields (`explanation: string[]`, `example` code) — no parser. |
| Schema churn after bulk authoring | That's the whole point of the slice — lock the shape on 3 concepts first. |
| Backwards-compat break | `conceptId` optional + `Concept` additive; persistence effect untouched. |

## 12. Decisions

- **D1 — concept body format:** structured fields now (no markdown parser). Revisit if rich formatting is
  needed once multiple topics exist. *(Recommended.)*
- **D2 — route shape:** `concept/:conceptId` standalone vs a `learn/:topicId` index. Recommend shipping
  both: an index per topic + a deep-linkable concept route.
- **D3 — third concept:** author one new Junior `remember` question for `concept-signal-basics`, or ship
  only the two concepts that map to existing questions. Recommend authoring the one Junior Q — it also
  starts closing the Bloom gap (WS7) for Signals.

## 13. Rollout

- Branch: `feature/concept-layer-signals-slice`.
- Commits in repo style: `feat: add Concept model and conceptId link`, `feat: signals concepts + renderer`,
  `test: concept integrity spec`, `docs: FEAT-001 concept layer`.
- Merge criteria: §9 all green. After merge, the schema is locked → bulk concept authoring for other
  Critical areas proceeds in parallel with v0.4.0 (paths).
