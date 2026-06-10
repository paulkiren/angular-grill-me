# Add Concept Atom

Scaffold a new `Concept` entry for the topic passed as the first argument (e.g. `/add-concept rxjs`).

**Steps:**

1. Identify the target topic id from the argument (e.g. `rxjs`, `change-detection`, `routing`).

2. Check whether `src/app/data/concepts/<topic>.concepts.ts` already exists.
   - If it does, append a new concept object to the exported array.
   - If it does not, create the file using this template:

```typescript
import { Concept } from '../../models/interview.models';

export const <camelTopic>Concepts: Concept[] = [
  // concepts go here
];
```

3. Write the new concept object. Required fields:
   - `id` — `'concept-<topic>-<slug>'` e.g. `'concept-rxjs-subject-types'`
   - `topic` — exact topic id string
   - `title` — plain English, ≤ 8 words
   - `summary` — one sentence "what is this"
   - `explanation` — array of 2–3 plain paragraphs (no markdown)
   - `example` — (optional) short code snippet
   - `whyItMatters` — one sentence
   - `pitfalls` — array of 2–3 common mistakes
   - `sinceVersion` — Angular version string e.g. `'2.0'`

4. If the file was newly created, add the import and spread to `src/app/data/concepts/index.ts`:
   ```typescript
   import { <camelTopic>Concepts } from './<topic>.concepts';
   // inside allConcepts array:
   ...<camelTopic>Concepts,
   ```

5. Link at least one existing question to the new concept by adding `conceptId: '<the-new-id>'` to a matching question in `src/app/data/questions/<topic>.questions.ts`. The question's `topic` must match the concept's `topic`.

6. Run `npx vitest run src/app/data/concepts/concepts.spec.ts` to verify the integrity tests pass.
