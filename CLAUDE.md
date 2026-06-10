# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm start          # dev server at http://localhost:4200
npm run build      # production build
npm test           # run unit tests (Vitest)
npm run watch      # build in watch mode (dev)
```

To run a single test file:
```bash
npx vitest run src/app/app.spec.ts
```

## Architecture

**Angular Grill Me** is an Angular proficiency builder with topic-based quizzes, mock interview simulations, a coding playground, and performance analytics.

### Key Design Decisions

- **Standalone components only** — no NgModules anywhere. Every component uses `imports: [...]` directly.
- **Lazy-loaded routes** — all feature routes use `loadComponent()` with dynamic imports (`src/app/app.routes.ts`).
- **Signals-based state** — no NgRx, no RxJS observables in UI. State lives in `StateService` (`src/app/services/state.service.ts`) using `signal()`, `computed()`, and `effect()`.
- **Data-driven content** — questions and challenges are plain data files (`src/app/data/`). Adding a new topic or question requires only editing data files, not components.

### State Management

`StateService` is the single source of truth, injected as a singleton. It holds:
- User progress (readiness score, completed quizzes/challenges)
- Interview session history (stored compressed — only question IDs in localStorage, reconstructed on hydration)
- Computed read-only signals for derived values

Persistence to `localStorage` is handled inside `StateService`. Legacy format migration is also done there.

### Question Rendering

Questions have a type system:
```typescript
type QuestionType = 'multiple-choice' | 'open-ended' | 'code-snippet' | 'select-all' | 'drag-and-drop'
```

Rendering is handled by pluggable components in `src/app/components/renderers/`:
- `question-renderer.ts` — host/dispatcher
- `mcq-renderer.ts` — multiple-choice
- `text-renderer.ts` — open-ended and code-snippet
- `select-all-renderer.ts` — multi-select

### Evaluation

`EvaluationService` (`src/app/services/evaluation.service.ts`) scores answers using:
1. A local rubric matcher with dynamic regex-based concept matching
2. Optional Gemini API adapter — gracefully disabled when no API key is present

### Testing

Uses **Vitest** (not Jest, not Karma). Test files are `*.spec.ts` alongside source. jsdom v28 provides the DOM environment. Components are tested with Angular `TestBed`.

Note: `window.matchMedia` must be mocked in specs that render the root component (see `src/app/app.spec.ts` for the pattern).
