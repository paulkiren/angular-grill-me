# Verify Content Integrity

Run all content integrity checks across questions, concepts, and type definitions.

**Steps:**

1. Run TypeScript compiler check:
   ```bash
   npx tsc --noEmit
   ```
   Report any errors. Stop if there are errors — remaining steps may produce false results.

2. Run the concept integrity test suite:
   ```bash
   npx vitest run src/app/data/concepts/concepts.spec.ts
   ```
   Report which tests pass and which fail.

3. Run the full test suite:
   ```bash
   npm test -- --run
   ```
   Report pass/fail counts and any failing test names.

4. Check for orphaned conceptId references — questions that reference a conceptId that does not exist in `allConcepts`:
   - Read `src/app/data/questions/index.ts` and `src/app/data/concepts/index.ts`
   - Cross-reference every `question.conceptId` against `allConcepts.map(c => c.id)`
   - List any orphans

5. Report a summary table:
   | Check | Status |
   |---|---|
   | TypeScript | PASS / FAIL |
   | Concept integrity tests | PASS / FAIL |
   | Full test suite | X passed, Y failed |
   | Orphaned conceptIds | None / list them |
