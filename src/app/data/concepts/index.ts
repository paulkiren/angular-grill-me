// FEAT-001 (v0.3.0 / WS1) — Concept registry.
// Mirrors the questions/index.ts aggregation pattern. To add a topic's concepts:
// create a `<topic>.concepts.ts` file and register it here.
import { Concept, Question } from '../../models/interview.models';
import { allQuestions } from '../questions/index';
import { signalsConcepts } from './signals.concepts';
import { rxjsConcepts } from './rxjs.concepts';
import { changeDetectionConcepts } from './change-detection.concepts';
import { dependencyInjectionConcepts } from './dependency-injection.concepts';
import { routingConcepts } from './routing.concepts';
import { formsConcepts } from './forms.concepts';
import { httpConcepts } from './http.concepts';
import { standaloneConcepts } from './standalone.concepts';
import { directivesPipesConcepts } from './directives-pipes.concepts';
import { componentArchitectureConcepts } from './component-architecture.concepts';
import { testingConcepts } from './testing.concepts';
import { angularEvolutionConcepts } from './angular-evolution.concepts';
import { angularMigrationConcepts } from './angular-migration.concepts';

export const allConcepts: Concept[] = [
  ...signalsConcepts,
  ...rxjsConcepts,
  ...changeDetectionConcepts,
  ...dependencyInjectionConcepts,
  ...routingConcepts,
  ...formsConcepts,
  ...httpConcepts,
  ...standaloneConcepts,
  ...directivesPipesConcepts,
  ...componentArchitectureConcepts,
  ...testingConcepts,
  ...angularEvolutionConcepts,
  ...angularMigrationConcepts,
];

/** All practice questions linked to a given concept. Pure lookup — no state. */
export function questionsForConcept(conceptId: string): Question[] {
  return allQuestions.filter(q => q.conceptId === conceptId);
}

/** All concepts belonging to a topic id, in declaration order. */
export function conceptsForTopic(topicId: string): Concept[] {
  return allConcepts.filter(c => c.topic === topicId);
}

/** Distinct topic ids that currently have at least one concept. */
export function topicsWithConcepts(): string[] {
  return [...new Set(allConcepts.map(c => c.topic))];
}
