# Angular Grill Me

**Angular Grill Me** is a browser-based Angular proficiency builder. Practice with topic quizzes, run mock interview simulations, solve coding challenges, and track your readiness score — all locally in your browser, no account needed.

Live app: **https://paulkiren.github.io/angular-grill-me/**

## Key Features

- **Mock Interview Simulator** — role-play technical screening scenarios with timed questions and real-time AI-assisted feedback.
- **Skills Matrix & Quizzes** — pick any Angular topic, run a scored quiz, and review sample answers with concept explanations.
- **Learn Mode** — read structured concept articles before attempting practice questions.
- **Code Playground** — solve Angular refactoring challenges with automated pass/fail evaluation.
- **Performance Analytics** — track your readiness score, session history, and per-topic mastery over time.
- **100% local** — all progress is saved in your browser. No signup, no server, no data leaves your machine.
- **Light / dark theme** — persisted across sessions.

## Tech Stack

- Angular 21.2.x
- TypeScript 5.9
- Vitest for unit testing
- Prettier for formatting
- RxJS for reactive state patterns

## Getting Started

### Prerequisites

- Node.js 20+ (recommended)
- npm 10+

### Install

```bash
npm install
```

### Run locally

```bash
npm start
```

Open `http://localhost:4200` in your browser.

### Build for production

```bash
npm run build
```

### Watch mode

```bash
npm run watch
```

### Run unit tests

```bash
npm test
```

## Deployment (GitHub Pages)

Every push to `master` automatically builds and deploys via GitHub Actions (`.github/workflows/deploy.yml`).

**First-time setup:**

1. Push this repo to GitHub (if not already done).
2. Go to **Settings → Pages** in your GitHub repo.
3. Under **Source**, select **GitHub Actions**.
4. Push any commit to `master` — the workflow builds and deploys automatically.

The live URL will be: `https://<your-github-username>.github.io/angular-grill-me/`

**How the deploy works:**

- Builds with `--base-href /angular-grill-me/` so asset paths resolve correctly at the sub-path.
- Copies `index.html` → `404.html` so Angular's client-side router handles direct URL loads (e.g. `/learn`, `/interview`).
- Adds `.nojekyll` so GitHub Pages doesn't process Angular's `_` prefixed files.

**To deploy a different branch or trigger manually:**

Go to **Actions → Deploy to GitHub Pages → Run workflow** in the GitHub UI.

## User Guide

### Getting started

Open the app (live or locally) and you'll land on the **Dashboard** — your home base showing your current Readiness Score and quick links to every mode.

---

### Readiness Score

The score in the top-right header (and on the Dashboard) is a weighted composite:

| Activity | Weight |
|---|---|
| Mock Interview sessions | 40% |
| Playground challenges passed | 40% |
| Topic quiz coverage | 20% |

Quiz weight rewards breadth — scoring high on a few topics won't max it out. Work across all 13 topics to push it higher.

> **Important:** your score is stored only in this browser. Clearing site data or using a different browser/device starts fresh.

---

### Learn

Go here first if a topic is unfamiliar. Each concept card has:
- A plain-English explanation
- A code example
- Common pitfalls
- A link to official Angular docs

Click **Mark as Learned** to track which concepts you've covered. This does not affect your Readiness Score — it's a personal checklist.

---

### Skills Matrix (Quizzes)

1. Select a topic card.
2. Click **Start Quiz** (or **Retake** if you've done it before — retakes always keep your best score).
3. Answer each question:
   - **Multiple choice** — click the option you want, then confirm.
   - **Open-ended** — type your answer in the textarea; it's evaluated against key concept keywords.
   - **Code snippet** — read the code block shown above, then explain what it does or what's wrong with it.
   - **Select all** — tick every correct option before confirming.
4. Click **Finish Quiz** on the last question.
5. The review screen shows your score, per-question feedback, and the sample answer for each item.

Your best percentage per topic is saved and shown as a badge on the topic card.

---

### Mock Interview Simulator

1. Go to **Simulator** and choose a difficulty: Junior, Mid, or Senior.
2. A set of timed questions is drawn from across all topics.
3. Answer each one within the time limit — the timer is advisory, not enforced.
4. At the end, optionally paste a **Gemini API key** to get AI-powered feedback on top of the local rubric scoring.
5. Your session is saved to **Analytics** automatically.

---

### Playground (Coding Challenges)

1. Go to **Playground** and pick a challenge.
2. Edit the code in the editor to fix or refactor it per the instructions.
3. Click **Run Tests** — the evaluator checks your code against solution patterns and anti-pattern rules.
4. A pass/fail result and feedback are shown inline. Passed challenges are counted in your Readiness Score.

---

### Analytics

Shows your full history:
- Readiness Score trend
- All past interview sessions with per-question breakdowns
- Challenge attempt results
- Topic quiz best scores and coverage gaps

Use the **Reset Progress** button at the bottom to wipe all stored data and start over.

### Manual test scenarios

1. Verify startup
   - Run `npm install` then `npm start`.
   - Open `http://localhost:4200` and confirm the Skills Matrix loads.
2. Validate topic navigation
   - Select a topic card and click `Start Quiz`.
   - Confirm the quiz panel shows the question text and progress indicator.
3. Validate multiple-choice flow
   - Answer a multiple-choice question.
   - Confirm the `Next Question` button becomes enabled and the next question appears.
4. Validate open-ended flow
   - Answer an open-ended question with a meaningful response.
   - Confirm the app accepts the text and allows progression.
5. Validate code-snippet flow
   - Start a topic containing a `code-snippet` question.
   - Confirm the code sample is visible above the answer textarea.
   - Submit an answer and proceed.
6. Validate results and review
   - Finish the quiz and confirm a score appears.
   - Review each question item, user answer, and feedback.
7. Validate persistence
   - Reload the browser after completing a quiz.
   - Confirm the topic card now shows a best‑score badge.
8. Validate build/test
   - Run `npm test` and confirm the suite passes.
   - Run `npm run build` and confirm a production build completes successfully.

### Extending topics as an Angular developer or architect

The app is data-driven: new topics and questions are defined in `src/app/data/quiz.data.ts`.

To add a new topic:

1. Open `src/app/data/quiz.data.ts`.
2. Add a new object to `quizTopicsData` with:
   - `id`: a unique key for the topic.
   - `title`: the topic title shown in the Skills Matrix.
   - `description`: a short summary of the topic.

To add questions for that topic:

1. Add new objects to `quizQuestionsData`.
2. Each question object should include:
   - `id`: unique question identifier.
   - `topic`: the topic `id` it belongs to.
   - `title`: a brief question title.
   - `difficulty`: `Junior`, `Mid`, or `Senior`.
   - `questionType`: `multiple-choice`, `open-ended`, or `code-snippet`.
   - `questionText`: the prompt shown to the user.
   - `tags`: keywords for the question.
   - `rubrics`: scoring concepts used for open-ended review.
   - `sampleAnswer`: a model answer or explanation.
   - `timeLimit`: optional time guidance.

For `multiple-choice` questions, also include:

- `options`: string array of choices.
- `correctOptionIndex`: index of the correct choice.

For `code-snippet` questions, optionally include:

- `codeSnippet`: a code block string displayed above the answer field.

Example:

```ts
quizTopicsData.push({
  id: 'ngrx',
  title: 'State Management',
  description: 'NgRx, signals, stores, effects, and best practices for application state.'
});

quizQuestionsData.push({
  id: 'ngrx-1',
  topic: 'ngrx',
  title: 'Store vs Component State',
  difficulty: 'Mid',
  questionType: 'open-ended',
  tags: ['state management', 'ngrx'],
  questionText: 'When should you keep state in NgRx store versus local component state?',
  answerPlaceholder: 'Explain the tradeoffs and when each approach fits best.',
  rubrics: ['global state', 'local state', 'performance', 'encapsulation'],
  sampleAnswer: 'Use NgRx store for shared domain state and cross-component communication, while local component state is better for UI-only data and ephemeral values.',
  timeLimit: 90,
  rubricMatchers: [
    { pattern: 'global|shared|application', term: 'global state', label: 'Shared application state in store' },
    { pattern: 'local|component|view', term: 'local state', label: 'Component-local state for UI concerns' }
  ]
});
```

Because the app already reads both `quizTopicsData` and `quizQuestionsData`, no component code changes are needed for most new topic additions.

## Application Overview

This project is organized around a lightweight Angular app using standalone components.

### Core application files

- `src/app/app.ts` - root component that manages theme state and app shell behavior.
- `src/app/app.routes.ts` - Angular router configuration with lazy-loaded routes for each page.
- `src/app/components/dashboard.ts` - welcome dashboard with readiness score and feature links.
- `src/app/components/interview.ts` - mock interview simulator and evaluation workflow.
- `src/app/components/topic-matrix.ts` - topic quiz selection and interactive quiz UI.
- `src/app/components/playground.ts` - interactive coding practice area.
- `src/app/components/performance.ts` - analytics, history, and progress insights.
- `src/app/services/state.service.ts` - application state and persistence.
- `src/app/services/evaluation.service.ts` - interview evaluation logic and scoring.
- `src/app/models/interview.models.ts` - shared types for questions, sessions, and evaluations.
- `src/app/data/quiz.data.ts` - plugin-friendly quiz topic and question registry for extending topics without changing core state logic.

## Project Structure

- `src/` - main Angular source code
- `public/` - static assets included in the build
- `dist/` - production output folder after build
- `angular.json` - Angular workspace configuration
- `package.json` - scripts and dependencies

## Notes

- The application currently uses local evaluation logic for interview feedback. The interview screen offers an *optional* Gemini API key input for external AI scoring when configured.
- E2E tests are not included by default. You can add a framework such as Cypress, Playwright, or Protractor if desired.

## Recommended Improvements

- Add end-to-end test coverage (Playwright is a good fit for the quiz flows)
- Add issue and PR templates for contributor workflows
- Add a `LICENSE` file before sharing publicly

## Contributing

Please see `CONTRIBUTING.md` for contribution guidelines.
