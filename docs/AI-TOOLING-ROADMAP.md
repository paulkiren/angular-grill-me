# AI Tooling & Future Roadmap

> Analysis date: 2026-06-10  
> Project version: v0.2.0-beta.4 · Angular 21.2 · Signals-first · Data-driven content

---

## Project Baseline

| Dimension | Current state |
|---|---|
| Content | 80 questions / 13 topics / 6 concepts (Signals only) / 2 challenges |
| AI | Gemini 2.5-flash for open-ended scoring (optional, session-key only) |
| Testing | 2 spec files for 39 TS files — critical coverage gap |
| Backend | None — 100% client-side, plain TS data files |
| Missing renderer | `drag-and-drop` type defined in models, no component exists |
| Timestamps | Just added to `ChallengeAttempt` — enables SRS/scheduling |

---

## 1. AI Teams Agents

The `ai-teams` plugin provides multi-agent orchestration directly inside Claude Code. These are the highest-value entry points for this project.

### `/ai-teams:implementation:plan` + `/ai-teams:implementation:implement`

Spec-driven development — give it a story, it produces parallelizable SPEC files, then implements them with tests and parallel code review agents. Best applied to:

- "Add concept atoms for all 12 remaining topics (RxJS, Change Detection, DI, …)" — fans out 12 parallel content writers
- "Build the drag-and-drop renderer component" — single SPEC, implements and reviews
- "Add spaced repetition scheduling to StateService" — one SPEC, coded and tested

### `/ai-teams:testing:test-pipeline`

Runs the full AI testing pipeline: generate test cases → implement → run → report. Given the near-zero test coverage this is the highest-ROI single agent available. It would generate Vitest specs for `StateService`, `EvaluationService`, all 6 route components, and all 5 renderers.

### `/ai-teams:testing:create-test-cases`

Creates structured test cases from requirements before writing code — useful when expanding `EvaluationService` (rubric-matcher accuracy, Gemini fallback logic, edge-case scoring).

### `/ai-teams:doc-ops:update-technical-documentation`

Generates arc42-style architecture docs. Recommended before any major refactor (adding a backend, SSR, or a second AI provider).

---

## 2. MCP Servers

### Gemini / Google AI MCP server

Currently Gemini is called via raw `fetch()` inside `EvaluationService`. Wrapping it as an MCP adapter would let Claude Code itself call Gemini during content generation:

- "Generate 5 RxJS questions at Senior/Analyze level" → structured data ready to paste into `rxjs.questions.ts`
- Synthesise rubric matchers from a sample answer
- Draft concept atom explanations from Angular docs

**Setup:** `@modelcontextprotocol/server-google-genai` or a custom server pointing at the same `generativelanguage.googleapis.com/v1beta` endpoint already used in the app.

### GitHub MCP (`@modelcontextprotocol/server-github`)

No CI or issue tracking is wired to Claude today. Adding the GitHub MCP enables:

- Filing bugs when test runs fail
- Creating PRs for content additions automatically
- Tracking FEAT-002/FEAT-003 backlog via GitHub Issues

Add to `.claude/settings.local.json` under `mcpServers`.

### Content Filesystem MCP (custom)

Since all content is `.ts` data files, a lightweight MCP that wraps `src/app/data/` with TypeScript-AST-aware read/write would let agents safely append topics and questions without breaking existing exports.

---

## 3. Claude Code Hooks

Hooks run shell commands automatically on Claude Code events.

### Auto-run tests after any file edit (`PostToolUse`)

```json
{
  "hooks": {
    "PostToolUse": [{
      "matcher": "Edit|Write",
      "hooks": [{ "type": "command", "command": "npm test -- --run 2>&1 | tail -20" }]
    }]
  }
}
```

Catches regressions immediately after every data file or component change.

### TypeScript check after edits (`PostToolUse`)

```json
{
  "matcher": "Edit|Write",
  "hooks": [{ "type": "command", "command": "npx tsc --noEmit 2>&1 | head -30" }]
}
```

The strict `tsconfig` means type errors surface instantly rather than at build time.

### Session diff summary on stop (`Stop`)

```json
{
  "hooks": {
    "Stop": [{
      "hooks": [{ "type": "command", "command": "git diff --stat HEAD" }]
    }]
  }
}
```

Shows what changed at the end of every Claude Code session.

> Configure all hooks via `/update-config`.

---

## 4. Project-Local Claude Code Skills

Add `.claude/commands/` scripts to create `/slash-commands` scoped to this project:

| Command | What it does |
|---|---|
| `/add-question <topic>` | Scaffolds a new question with the full interface shape, correct ID, rubricMatchers stub |
| `/add-concept <topic>` | Scaffolds a new Concept atom for a topic that has questions but no concepts yet |
| `/add-challenge` | Scaffolds a new `PlaygroundChallenge` with `solutionPatterns`/`antiPatterns` stubs |
| `/coverage-check` | Reports which topics have no questions at a given difficulty or Bloom level |
| `/eval-test <questionId>` | Runs the offline rubric evaluator against a sample answer to spot-check scoring |
| `/verify-content` | Runs `concepts.spec.ts` + tsc + checks for orphaned `conceptId` references |

These are markdown files in `.claude/commands/` — written once, live in the repo, available to every contributor.

---

## 5. Spec-Driven Development Scope

The project is well-suited to spec-driven development because:

- All content is pure TypeScript data (no backend state, no migrations)
- Interfaces already define exact shapes — specs can be precise
- The `ai-teams` `plan → implement` pipeline handles parallel SPECs natively

### Content SPECs (all parallelisable)

| SPEC | Deliverable | Effort |
|---|---|---|
| SPEC-C01 | RxJS concept atoms (6–8 concepts) | Small |
| SPEC-C02 | Change Detection concept atoms | Small |
| SPEC-C03 | Dependency Injection concept atoms | Small |
| SPEC-C04–C13 | Remaining 10 topics (Routing, Forms, HTTP, Standalone, …) | Small each |
| SPEC-Q01 | 20 new questions — Senior + Analyze/Evaluate level across 5 topics | Medium |
| SPEC-CH01 | 8 new playground challenges covering more topics | Medium |

### Feature SPECs

| SPEC | Deliverable | Depends on |
|---|---|---|
| SPEC-F01 | `drag-and-drop` renderer component | — |
| SPEC-F02 | Spaced repetition in `StateService` (timestamp field is ready) | SPEC-F01 |
| SPEC-F03 | Progress export (JSON + clipboard) in `PerformanceComponent` | — |
| SPEC-F04 | Concept search / filter in `LearnComponent` | SPEC-C01–C13 |
| SPEC-F05 | AI-powered hint generation (Gemini call in `InterviewComponent`) | — |
| SPEC-F06 | Multi-provider AI adapter (Gemini + OpenAI + Claude) in `EvaluationService` | — |
| SPEC-F07 | Backend API (Express/Hono) for centralised content + user sessions | — |

### Testing SPECs (all parallelisable)

| SPEC | Deliverable |
|---|---|
| SPEC-T01 | `StateService` full spec — all methods, localStorage, legacy migration |
| SPEC-T02 | `EvaluationService` spec — offline rubric, Gemini mock, fallback |
| SPEC-T03 | `InterviewComponent` spec — setup → interview → results flow |
| SPEC-T04 | `PlaygroundComponent` spec — compile flow, pattern matching, score calc |
| SPEC-T05 | `LearnComponent` spec — concept tracking, progress signals |
| SPEC-T06 | Renderer components spec — MCQ, SelectAll, Text, DragDrop |

---

## 6. Prioritised Roadmap

```
Phase 1 — Foundation  (now → v0.3.0)
  [AI Teams]  /ai-teams:testing:test-pipeline     close the zero-coverage debt
  [Hooks]     PostToolUse: tsc + vitest            guard every edit automatically
  [SPEC-F01]  drag-and-drop renderer               closes open model/component gap
  [Skills]    /add-concept, /add-question          speed up content work

Phase 2 — Content Scale  (v0.3.0 → v0.4.0)
  [AI Teams]  /ai-teams:implementation:plan        SPEC-C01–C13, all 12 missing topics
  [MCP]       Gemini MCP server                    AI-assisted content generation
  [SPEC-F02]  Spaced repetition                    timestamp infrastructure is ready

Phase 3 — Intelligence  (v0.4.0 → v0.5.0)
  [SPEC-F05]  Hint generation in interview mode
  [SPEC-F06]  Multi-provider AI adapter (Claude + Gemini + OpenAI)
  [SPEC-F03]  Progress export + shareable readiness reports
  [MCP]       GitHub MCP for issue tracking

Phase 4 — Platform  (v1.0.0)
  [SPEC-F07]  Backend API (content management, user sessions)
  [MCP]       Custom content MCP server
  [CI]        Automated content validation pipeline
```

---

## Immediate Next Steps

1. Run `/ai-teams:onboarding` to set up the ai-teams working directory
2. Run `/update-config` to add the `PostToolUse` tsc + vitest hooks
3. Pick any `SPEC-T0x` and run `/ai-teams:testing:test-pipeline` to close the coverage gap
