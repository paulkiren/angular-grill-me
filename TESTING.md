# Testing Guide for Angular Grill Me

This document describes how to run and validate the application after the latest quiz updates.

## 1. Setup

Install dependencies:

```bash
npm install
```

## 2. Run the app locally

Start the development server:

```bash
npm start
```

Open your browser at:

```text
http://localhost:4200
```

## 3. Core validation flow

### 3.1 Skills Matrix load

- Confirm the home page loads successfully.
- Ensure topic cards are visible.
- Each topic card should show a title, description, and a `Start Quiz` or `Retake Assessment` button.

### 3.2 Topic selection

- Click any topic card.
- Confirm the quiz view opens and the progress indicator appears.

### 3.3 Multiple-choice question validation

- Answer a multiple-choice question by clicking one of the option cards.
- Confirm the selection is accepted.
- Confirm the `Next Question` button becomes enabled.
- Click `Next Question` and verify the next question loads.

### 3.4 Open-ended question validation

- Answer an open-ended question by typing a response in the textarea.
- Confirm the app allows you to continue after entering text.
- Ensure the text remains visible while navigating to the next question.

### 3.5 Code-snippet question validation

- Choose a topic containing a `code-snippet` question.
- Confirm the page displays a code block above the answer field.
- Type a conceptual answer about the code sample.
- Confirm progression through the quiz still works.

### 3.6 Result screen validation

- Finish the quiz to reach the result screen.
- Confirm a final score is shown.
- Confirm a feedback message is displayed based on performance.
- Confirm the review list includes:
  - question text
  - user answer
  - feedback / score for open-ended questions
  - correct answer for multiple-choice questions
  - sample answer / technical context

### 3.7 Persistence validation

- Reload the page after completing a quiz.
- Confirm the Skills Matrix shows a `Best: X%` badge on the completed topic card.
- Confirm the badge updates after retaking the quiz.

## 4. Build and test commands

### 4.1 Run unit tests

```bash
npm test
```

- Verify the test suite runs and passes successfully.
- If failures occur, inspect the output to identify broken components or evaluation logic.

### 4.2 Production build

```bash
npm run build
```

- Confirm the application builds successfully without compilation errors.

## 5. Focus areas for this update

The following areas changed in the latest update and should be validated carefully:

- `src/app/data/quiz.data.ts`
  - new `code-snippet` questions
  - question metadata for `questionType`, `rubricMatchers`, and `codeSnippet`
- `src/app/components/topic-matrix.ts`
  - UI support for `multiple-choice`, `open-ended`, and `code-snippet`
  - review screen feedback for open-ended scoring
- `src/app/services/evaluation.service.ts`
  - rubric-based answer evaluation

## 6. Optional exploratory checks

- Try entering partial or incomplete answers for open-ended questions and see how the review feedback changes.
- Verify that code-snippet questions render the sample code clearly and do not break layout.
- Confirm the application still works after switching browser tabs, reloading, or navigating back to the Skills Matrix.
