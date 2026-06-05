// Last reviewed: Angular 21.2 (2026-06)
// Next review due: Angular 22.0 release (~late 2026)
import { Question } from '../../models/interview.models';

export const angularMigrationTopic = {
  id: 'angular-migration',
  title: 'Angular Migration Strategy',
  description: 'Upgrade planning, compatibility, API changes, and migration tradeoffs from older Angular versions to modern architectures.'
};

export const angularMigrationQuestions: Question[] = [
  {
    id: 'am-1',
    topic: 'angular-migration',
    title: 'Planning Angular upgrades from v13 to v21',
    difficulty: 'Senior',
    questionType: 'open-ended',
    bloomLevel: 'evaluate',
    sinceVersion: '13.0',
    assessmentEligible: true,
    tags: ['angular', 'migration', 'compatibility'],
    questionText: 'Describe the architectural and compatibility tradeoffs involved in upgrading an Angular app from v13 to v21.',
    answerPlaceholder: 'Mention NgModule migration, Ivy, Zone.js/zoneless, library compatibility, typed forms, and incremental refactors.',
    rubrics: ['NgModule', 'Ivy', 'zoneless', 'compatibility', 'tests'],
    sampleAnswer: 'Upgrading from v13 to v21 should be approached as a series of incremental improvements rather than a single jump. Key tradeoffs include preserving library compatibility while shifting from NgModules to standalone components, keeping Zone.js available while preparing for zoneless execution, validating Ivy and typed form behavior, and maintaining test coverage through the migration.',
    timeLimit: 120,
    rubricMatchers: [
      { pattern: 'NgModule|standalone', term: 'NgModule', label: 'NgModule to standalone migration', weight: 2 },
      { pattern: 'Ivy|view\\s*engine|compiler', term: 'Ivy', label: 'Ivy compatibility and build behavior', weight: 2 },
      { pattern: 'zoneless|Zone\\.js|zonejs', term: 'zoneless', label: 'Zoneless migration and compatibility', weight: 2 },
      { pattern: 'compatibility|third[- ]party|libraries', term: 'compatibility', label: 'Third-party library compatibility risks', weight: 3 },
      { pattern: 'test|coverage|unit\\s*test|e2e', term: 'tests', label: 'Preserve and update tests during migration', weight: 2 }
    ]
  },
  {
    id: 'am-2',
    topic: 'angular-migration',
    title: 'Which migration step should come first?',
    difficulty: 'Mid',
    questionType: 'multiple-choice',
    bloomLevel: 'apply',
    sinceVersion: '16.0',
    assessmentEligible: true,
    tags: ['angular', 'migration', 'strategy'],
    questionText: 'When migrating an app from Angular 16 to Angular 21, what is the most recommended first step?',
    rubrics: ['baseline', 'compatibility', 'testing', 'incremental'],
    sampleAnswer: 'The first step should be upgrading to the latest patch of the current major version, validating tests and third-party library compatibility, and then planning incremental architecture changes rather than switching everything at once.',
    options: [
      'Convert every component to standalone immediately and then run tests.',
      'Upgrade to the latest patch of the current major version, validate tests and dependencies, then plan incremental architectural changes.',
      'Remove Zone.js before any upgrade to avoid compatibility issues.',
      'Switch the codebase to plain JavaScript to reduce TypeScript-related migration risk.'
    ],
    correctOptionIndex: 1,
    timeLimit: 75,
    rubricMatchers: [
      { pattern: 'baseline|patch|current\\s*major', term: 'baseline', label: 'Establish a stable current baseline first', weight: 3 },
      { pattern: 'test|coverage|validate', term: 'testing', label: 'Validate tests and dependencies upfront', weight: 2 },
      { pattern: 'incremental|step|gradual', term: 'incremental', label: 'Apply architecture changes incrementally', weight: 3 },
      { pattern: 'compatibility|dependency|library', term: 'compatibility', label: 'Verify dependency compatibility before major changes', weight: 2 }
    ]
  }
];
