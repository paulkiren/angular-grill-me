# Add Challenge

Scaffold a new `PlaygroundChallenge` entry for the Playground (e.g. `/add-challenge`).

**Steps:**

1. Read `src/app/data/challenges.data.ts` to see existing ids, topics covered, and difficulty distribution.

2. Pick a topic and difficulty that is not yet covered or underrepresented.

3. Append a new challenge object to the exported `challengesData` array:

```typescript
{
  id: '<topic>-<slug>',              // e.g. 'rxjs-takeuntil'
  title: 'Short imperative title',   // e.g. 'Replace takeWhile with takeUntil'
  description: 'What the candidate must do (2–3 sentences).',
  initialCode: `
// paste starter code here — must be broken or incomplete
  `.trim(),
  solutionPatterns: [
    'takeUntil',                     // regex strings that MUST appear in a passing solution
    'Subject',
  ],
  antiPatterns: [
    { pattern: 'takeWhile', message: 'Use takeUntil with a Subject for clean teardown.' }
  ],
  hint: 'One clear sentence pointing toward the solution without giving it away.',
  difficulty: 'Junior' | 'Mid' | 'Senior',
  topic: '<topicId>',
}
```

4. Ensure `solutionPatterns` tests the intent (not just presence of the keyword), and `antiPatterns` flags the specific mistake the starter code demonstrates.

5. Run `npx tsc --noEmit` to confirm no type errors.
