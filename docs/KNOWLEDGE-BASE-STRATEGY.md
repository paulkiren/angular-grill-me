# Knowledge Base Strategy

This document is the content authority for Angular Grill-Me. It defines what to build, in what order, and to what standard — feeding the roadmap from v0.2.0 through v0.4.0.

---

## 1. Current State Snapshot

| Metric | Today |
|---|---|
| Topics covered | 6 |
| Total questions | 19 |
| Coding challenges | 3 |
| Angular concept areas with zero coverage | 9 |
| Question types present | multiple-choice, open-ended, code-snippet, select-all |
| Bloom's levels covered | Remember, Understand, Apply (light) |

**Verdict**: The schema and tooling are production-ready. The content is a proof of concept, not a knowledge base.

---

## 2. Coverage Matrix — Angular Concept Areas

This is the master tracking table. Update it as content is added.

| Concept Area | Priority | Questions Today | Target (MVP) | Target (v1.0) | Roadmap Phase |
|---|---|---|---|---|---|
| Signals & Reactivity | Critical | 4 | 10 | 18 | v0.2.0 |
| Change Detection & Performance | Critical | 3 | 8 | 15 | v0.2.0 |
| Dependency Injection | Critical | 4 | 10 | 18 | v0.2.0 |
| RxJS & Reactive Streams | Critical | 4 | 10 | 18 | v0.2.0 |
| Routing & Navigation | Critical | 0 | 8 | 15 | v0.2.0 |
| Reactive Forms | Critical | 0 | 8 | 15 | v0.2.0 |
| HTTP & Interceptors | High | 0 | 6 | 12 | v0.2.0 |
| Directives & Pipes | High | 0 | 6 | 12 | v0.3.0 |
| Component Architecture | High | 0 | 6 | 12 | v0.3.0 |
| Testing (Unit & Component) | High | 0 | 6 | 12 | v0.3.0 |
| SSR & Hydration | Medium | 0 | 4 | 8 | v0.3.0 |
| Build & Optimization | Medium | 0 | 4 | 8 | v0.3.0 |
| Angular Evolution & Migration | Medium | 4 | 6 | 10 | v0.3.0 |
| Standalone Architecture | Medium | 0 | 4 | 8 | v0.2.0 |
| Accessibility & Internationalization | Low | 0 | 2 | 6 | v0.4.0 |

**MVP** = minimum for a credible assessment tool. **v1.0** = comprehensive coverage.

---

## 3. Bloom's Taxonomy Distribution

Every concept area needs questions across at least four cognitive levels. A score only means something when it tests thinking, not just recall.

| Level | What it tests | Current count | Target per area |
|---|---|---|---|
| **Remember** | Definitions, syntax, API names | ~10 (53%) | 1–2 |
| **Understand** | Explain why, describe behaviour | ~6 (32%) | 2–3 |
| **Apply** | Fix this code, use this API | ~3 (15%) | 2–3 |
| **Analyze** | Diagnose a problem, compare options | 0 | 2–3 |
| **Evaluate** | Justify a design choice, trade-offs | 0 | 1–2 |
| **Create** | Design a solution from requirements | 0 | 1 (Senior only) |

**Target distribution**: 15% Remember / 20% Understand / 25% Apply / 25% Analyze / 10% Evaluate / 5% Create.

---

## 4. Content Quality Standards

Every question added must pass these gates before merging.

### 4.1 Required Fields

```typescript
{
  id: string;                  // kebab-case, globally unique, never reused
  sinceVersion: string;        // Angular version that introduced this concept, e.g. '17.0'
  deprecatedIn?: string;       // Angular version where pattern became obsolete
  bloomLevel: BloomLevel;      // 'remember' | 'understand' | 'apply' | 'analyze' | 'evaluate' | 'create'
  difficulty: 'Junior' | 'Mid' | 'Senior';
  assessmentEligible: boolean; // false = learning-mode only (hints embedded in question text)
}
```

`sinceVersion` and `deprecatedIn` are the most important additions. Angular ships every 6 months — without them, the content rots silently.

### 4.2 Rubric Design Rules

Rubric matchers must have both coverage and precision.

**Bad** (too narrow — misses equivalent answers):
```typescript
{ pattern: /takeUntilDestroyed/, label: 'Cleanup pattern' }
```

**Good** (covers valid phrasings, uses weight for partial credit):
```typescript
{ pattern: /takeUntilDestroyed|DestroyRef.*onDestroy|ngOnDestroy.*unsubscribe/, label: 'Cleanup pattern', weight: 3 },
{ pattern: /memory.?leak|prevent.*leak|leak.?prevent/, label: 'Understands the risk', weight: 1 },
```

Rules:
- Each matcher must have a `weight` (1–5). Score = sum of matched weights / max possible.
- Cover at least 3 syntactically different ways to express the correct concept.
- Test your regexes against at least one strong answer and one weak answer before committing.
- If a regex would match irrelevant text (e.g., a common word), make it more specific.

### 4.3 The Discrimination Test

Before adding a question, ask:
- Would a Junior developer guess the right answer without knowing the concept? If yes for MCQ, restructure the distractors.
- Would a Senior developer with deep knowledge ever get it wrong? If yes, the rubric or question wording is ambiguous — fix it.

### 4.4 Sample Answer Quality

`sampleAnswer` must be a complete, interview-quality answer — not a list of keywords. It should be what a strong Mid candidate would say out loud in 60–90 seconds. This doubles as training data for the AI scorer.

---

## 5. Content Maintenance Rhythm

| Trigger | Action | Owner |
|---|---|---|
| Angular major release | Audit questions tagged with affected APIs; mark `deprecatedIn` where needed | Content lead |
| New Angular RFC merged | Flag concept for potential new question | Any contributor |
| Question average score < 20% | Review wording — likely ambiguous | Content lead |
| Question average score > 90% | Promote to warm-up tier or replace with harder variant | Content lead |
| Question skip rate > 30% | Rewrite — the question is confusing learners | Content lead |

### Version Review Schedule

```
// Add to top of each questions file:
// Last reviewed: Angular 21.2 (2026-06)
// Next review due: Angular 22.0 release (~late 2026)
```

---

## 6. File Structure — Scaling the Data Layer

`quiz.data.ts` will become unmanageable past ~60 questions. Migrate to this structure before v0.2.0 ships:

```
src/app/data/
  questions/
    signals.questions.ts          // Angular Signals & Reactivity
    change-detection.questions.ts
    dependency-injection.questions.ts
    rxjs.questions.ts
    routing.questions.ts          // NEW in v0.2.0
    forms.questions.ts            // NEW in v0.2.0
    http.questions.ts             // NEW in v0.2.0
    directives-pipes.questions.ts // NEW in v0.3.0
    component-architecture.questions.ts
    testing.questions.ts
    ssr-hydration.questions.ts
    build-optimization.questions.ts
    migration.questions.ts
    standalone.questions.ts
  challenges/
    rxjs.challenges.ts
    signals.challenges.ts
    di.challenges.ts
    forms.challenges.ts           // NEW in v0.3.0
  index.ts                        // aggregates and exports all topics + questions
```

Each file is independently reviewable — a forms expert reviews only `forms.questions.ts`. This also prevents merge conflicts when multiple contributors work simultaneously.

---

## 7. Assessment vs Learning Mode

The tool needs to serve two distinct use cases without conflicting:

| Dimension | Learning Mode | Assessment Mode |
|---|---|---|
| Hints | Shown | Hidden |
| Retries | Allowed | Not allowed |
| Question order | Fixed | Randomized |
| Question pool | All | `assessmentEligible: true` only |
| Time limit | Soft (warning only) | Hard |
| Score feedback | Immediate | After full session |
| Sample answers | Shown after attempt | Shown after full session |

Add `assessmentEligible: boolean` to the `Question` interface. Questions where the hint is embedded in the question text (common in "what does this code print?" style) should be `assessmentEligible: false`.

**Minimum for a valid assessment score**: 5 questions per concept area across at least 3 Bloom levels. Below this threshold, display a warning rather than a percentile score — one lucky/unlucky answer swings the result too much.

---

## 8. Beta Release Content Targets

### v0.2.0 — Coverage Expansion (Critical Gaps)

Deliver the six concept areas that appear in virtually every real Angular interview.

| Area | New questions | New challenges | Bloom focus |
|---|---|---|---|
| Routing & Navigation | 8 | 1 | Apply, Analyze |
| Reactive Forms | 8 | 1 | Apply, Analyze |
| HTTP & Interceptors | 6 | 1 | Apply, Analyze |
| Standalone Architecture | 4 | 0 | Understand, Apply |
| Signals (expand) | +6 | +1 | Analyze, Evaluate |
| DI (expand) | +4 | 0 | Analyze, Evaluate |
| **Total adds** | **36** | **4** | |

**Exit criteria**: 55+ questions, 7+ challenges, all critical areas covered at 6+ questions each.

### v0.3.0 — Assessment Quality

Deepen existing areas and introduce Analyze/Evaluate level questions.

| Area | New questions | New challenges | Bloom focus |
|---|---|---|---|
| Directives & Pipes | 6 | 1 | Apply, Analyze |
| Component Architecture | 6 | 1 | Analyze, Evaluate |
| Testing | 6 | 2 | Apply, Analyze |
| SSR & Hydration | 4 | 0 | Understand, Apply |
| Build & Optimization | 4 | 0 | Analyze, Evaluate |
| Cross-area: Senior-tier questions | +10 | 0 | Evaluate, Create |
| **Total adds** | **36** | **4** | |

**Exit criteria**: 90+ questions, 11+ challenges, Bloom's distribution within 5% of target across all areas.

### v0.4.0 — Polish and AI Integration

- `assessmentEligible` flagging across all 90+ questions
- Weighted rubric scoring deployed
- Per-question performance metrics tracked
- AI scorer tested against rubric scores for agreement rate
- Accessibility & i18n questions added (lower priority area)

---

## 9. What Not to Build Yet

These are explicitly deferred — they add complexity without improving assessment validity at this stage:

- **User accounts / auth** — localStorage is sufficient until v1.0
- **Drag-and-drop question type** — the renderer type exists but no questions use it; add questions first
- **Leaderboards** — requires auth, adds gaming pressure that undermines honest learning
- **Video explanations** — high production cost; text + code samples serve the use case
- **Mobile-native app** — the PWA path in v1.0 covers offline; a native shell is post-v1.0
