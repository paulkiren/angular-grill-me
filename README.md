# Angular Grill Me

Angular Grill Me is a modern Angular interview prep application built with Angular 21. It delivers an interactive mock interview simulator, topic-based quizzes, performance analytics, and a developer playground for practicing and reviewing Angular concepts.

## Key Features

- **Mock Interview Simulator**: role-play technical screening scenarios, answer interview-style questions, and receive real-time feedback.
- **Topic Matrix & Quizzes**: choose core Angular topics and complete quizzes with instant scoring and review explanations.
- **Performance Dashboard**: view historical interview sessions, focus recommendations, and topic mastery analytics.
- **Code Playground**: practice refactoring and Angular-specific code challenges.
- **Theme Support**: light/dark mode persisted across sessions.
- **Standalone Component Architecture**: uses Angular v21 standalone components and router lazy-loading.

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

- add end-to-end test coverage
- introduce issue and PR templates for contributor workflows
- add a `LICENSE` file if this repository will be shared publicly

## Contributing

Please see `CONTRIBUTING.md` for contribution guidelines.
