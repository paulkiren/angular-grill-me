// Last reviewed: Angular 21.2 (2026-06)
// Next review due: Angular 22.0 release (~late 2026)
import { Question } from '../../models/interview.models';

export const changeDetectionTopic = {
  id: 'change-detection',
  title: 'Change Detection & Performance',
  description: 'Zone.js, Zoneless, OnPush Strategy, ChangeDetectorRef, and hydration.'
};

export const changeDetectionQuestions: Question[] = [
  {
    id: 'cd-1',
    conceptId: 'concept-cd-default-vs-onpush',
    topic: 'change-detection',
    title: 'OnPush Change Detection',
    difficulty: 'Mid',
    questionType: 'multiple-choice',
    bloomLevel: 'understand',
    sinceVersion: '2.0',
    assessmentEligible: true,
    tags: ['change-detection', 'performance'],
    questionText: 'How does the OnPush change detection strategy improve performance in Angular?',
    rubrics: ['input references', 'explicit trigger', 'markForCheck', 'sub-tree', 'immutable'],
    sampleAnswer: 'OnPush limits change detection checks to only when component @Input properties change their reference, when events originate within the component, or when change detection is triggered explicitly (e.g., via markForCheck). This prevents unnecessary rendering of unchanged sub-trees.',
    options: [
      'OnPush disables all JavaScript animations in the component.',
      'It checks the component only when inputs change reference, internal events fire, or when markForCheck() is manually called, skipping unchanged sub-trees.',
      'It forces the component to render on every frame at 60fps.',
      'OnPush removes Zone.js completely from the application automatically.'
    ],
    correctOptionIndex: 1,
    timeLimit: 60,
    rubricMatchers: [
      { pattern: 'input\\s*reference|input\\s*change', term: 'input references', label: 'Checks when Inputs references change', weight: 3 },
      { pattern: 'explicit|manual', term: 'explicit trigger', label: 'Explicit change detection triggers', weight: 2 },
      { pattern: 'markForCheck|detectChanges', term: 'markForCheck', label: 'Explicit markForCheck() or ChangeDetectorRef calls', weight: 2 },
      { pattern: 'sub-tree|branch', term: 'sub-tree', label: 'Skips rendering unchanged component sub-trees', weight: 2 },
      { pattern: 'immutable|reference', term: 'immutable', label: 'Promotes immutable data patterns', weight: 1 }
    ]
  },
  {
    id: 'cd-2',
    topic: 'change-detection',
    title: 'OnPush and Immutable Input References',
    difficulty: 'Senior',
    questionType: 'open-ended',
    bloomLevel: 'analyze',
    sinceVersion: '2.0',
    assessmentEligible: true,
    tags: ['change-detection', 'performance', 'immutable'],
    questionText: 'Describe a situation where OnPush change detection can fail to update the view and how you would fix it.',
    answerPlaceholder: 'Describe the root cause, reference change requirements, and the practical fix in Angular.',
    rubrics: ['immutable', 'markForCheck', 'input reference', 'event', 'change detection'],
    sampleAnswer: 'OnPush can fail when a component receives an object input whose internal properties change without the object reference changing. The fix is to update the input with a new object reference, use immutable state updates, or call markForCheck() after the change. Ensure data flows through reference-safe updates or use signals/computed values for derived UI state.',
    timeLimit: 90,
    rubricMatchers: [
      { pattern: 'immutable|immutability', term: 'immutable', label: 'Use immutable object/reference updates', weight: 3 },
      { pattern: 'markForCheck|detectChanges', term: 'markForCheck', label: 'Use markForCheck() or manual change detection', weight: 3 },
      { pattern: 'input\\s*reference|reference\\s*change', term: 'input reference', label: 'Input reference changes trigger OnPush', weight: 3 },
      { pattern: 'event|zone|angular zone', term: 'event', label: 'Event/zone-driven updates or manual detection', weight: 1 },
      { pattern: 'change\\s*detection', term: 'change detection', label: 'Understanding how OnPush evaluates component trees', weight: 1 }
    ]
  },
  {
    id: 'cd-3',
    topic: 'change-detection',
    title: 'Zoneless change detection',
    difficulty: 'Senior',
    questionType: 'open-ended',
    bloomLevel: 'evaluate',
    sinceVersion: '18.0',
    assessmentEligible: true,
    tags: ['change-detection', 'zoneless', 'performance'],
    questionText: 'What does enabling zoneless change detection mean for an Angular application, and what must developers do differently?',
    answerPlaceholder: 'Describe what Zone.js was doing, what replaces it, and the developer responsibilities in a zoneless app.',
    rubrics: ['Zone.js removed', 'signals or markForCheck', 'async pipe', 'explicit updates', 'testing'],
    sampleAnswer: 'Zoneless apps do not include Zone.js, so Angular no longer automatically detects changes after async events. Developers must drive change detection explicitly: using signals (preferred), the async pipe, markForCheck(), or scheduleMicroTask. This produces more predictable, faster apps with smaller bundle sizes. Tests also no longer need fakeAsync or tick() for most scenarios — but any code relying on implicit Zone.js change detection will silently break.',
    timeLimit: 120,
    rubricMatchers: [
      { pattern: 'Zone\\.js|zonejs|zone removed', term: 'Zone.js removed', label: 'Zone.js no longer triggers change detection', weight: 3 },
      { pattern: 'signal|markForCheck|scheduleMicro', term: 'signals or markForCheck', label: 'Explicit update mechanisms required', weight: 3 },
      { pattern: 'async\\s*pipe', term: 'async pipe', label: 'async pipe still works in zoneless', weight: 2 },
      { pattern: 'explicit|manual|intentional', term: 'explicit updates', label: 'All updates must be explicit', weight: 2 },
      { pattern: 'test|fakeAsync|tick', term: 'testing', label: 'Testing changes without fakeAsync', weight: 1 }
    ]
  }
];
