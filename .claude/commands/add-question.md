# Add Question

Scaffold a new `Question` entry for the topic passed as the first argument (e.g. `/add-question rxjs`).

**Steps:**

1. Read `src/app/data/questions/<topic>.questions.ts` to understand existing ids, difficulty distribution, and Bloom coverage.

2. Determine what is missing — prefer filling gaps at `Senior` difficulty or higher Bloom levels (`analyze`, `evaluate`, `create`) first.

3. Append a new question object to the exported questions array. Required fields:

```typescript
{
  id: '<topic>-<nextNumber>',        // e.g. 'rxjs-6' (no duplicates)
  topic: '<topicId>',
  title: 'Short descriptive title',
  questionText: 'Full interview question text?',
  difficulty: 'Junior' | 'Mid' | 'Senior',
  questionType: 'multiple-choice' | 'open-ended' | 'code-snippet' | 'select-all' | 'drag-and-drop',
  bloomLevel: 'remember' | 'understand' | 'apply' | 'analyze' | 'evaluate' | 'create',
  sinceVersion: 'X.Y',
  assessmentEligible: true,
  timeLimit: 90,
  rubrics: ['term1', 'term2', 'term3'],
  sampleAnswer: 'Comprehensive model answer...',
  rubricMatchers: [
    { pattern: 'regex', term: 'term', label: 'Mentioned X', weight: 2 }
  ],
  // for multiple-choice and select-all only:
  options: ['A', 'B', 'C', 'D'],
  correctOptionIndex: 0,             // for multiple-choice
  correctOptionIndexes: [0, 2],      // for select-all
}
```

4. For `code-snippet` questions, add a `codeSnippet` field with the problematic or example snippet.

5. Run `npx tsc --noEmit` to confirm no type errors.

6. Optionally link to an existing concept via `conceptId: 'concept-<topic>-<slug>'` if a matching concept exists.
