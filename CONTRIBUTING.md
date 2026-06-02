# Contributing to Angular Grill Me

Thank you for helping improve Angular Grill Me! This document explains how to contribute code, fix bugs, and propose enhancements.

## Getting started

1. Fork the repository or clone it locally.
2. Install dependencies:

```bash
npm install
```

3. Run the app for development:

```bash
npm start
```

4. Run the test suite:

```bash
npm test
```

## Branching

- Create feature branches with descriptive names, such as `feature/add-quiz-topic` or `fix/app-routing`.
- Rebase or merge the latest main branch before opening a pull request.

## Coding standards

- Keep the code consistent with the existing Angular 21 standalone component style.
- Prefer strongly typed TypeScript and avoid `any` when possible.
- Use `prettier` formatting rules.

## Commit messages

Use clear, short commit messages in the imperative mood, for example:

- `feat: add new topic quiz card`
- `fix: correct routing guard behavior`
- `docs: update README with install instructions`

## Pull requests

When opening a pull request, please include:

- A short summary of the change
- Why the change is needed
- Any testing performed
- If relevant, note any areas that need review or follow-up

## Issues

If you find a bug or want to suggest a new feature, please open an issue with:

- clear description of the problem or improvement
- reproduction steps if applicable
- expected behavior vs actual behavior

## Notes

- This repository does not currently include a formal `CODE_OF_CONDUCT`, but one can be added if the project accepts external contributors.
- For public releases, consider adding a license file and GitHub issue templates.
