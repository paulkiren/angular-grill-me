// FEAT-001 (v0.3.0 / WS1) — lightweight learning-path config.
// A precursor to full LearningPath objects (WS2 / v0.4.0). For now it just gives the
// Learn surface a stable topic ORDER (so concepts render as ordered "parts") and a
// related-topics map to encourage what to learn next.
import { Concept } from '../../models/interview.models';
import { allConcepts, conceptsForTopic, topicsWithConcepts } from './index';

// Beginner -> advanced. Covers all coverage-matrix areas, including ones that do not
// have concepts yet — topics without concepts are simply skipped when rendering.
export const LEARN_TOPIC_ORDER: string[] = [
  'angular-evolution',
  'standalone',
  'component-architecture',
  'directives-pipes',
  'signals',
  'change-detection',
  'dependency-injection',
  'routing',
  'forms',
  'http',
  'rxjs',
  'testing',
  'ssr',
  'build',
  'a11y-i18n',
  'angular-migration',
];

// "If you liked this, learn these next." Only entries that currently have concepts
// will be surfaced, so this degrades gracefully as content grows.
export const RELATED_TOPICS: Record<string, string[]> = {
  signals: ['change-detection', 'rxjs', 'component-architecture'],
  'change-detection': ['signals', 'component-architecture'],
  rxjs: ['signals', 'http'],
  forms: ['signals', 'component-architecture'],
};

/** Topic ids that have concepts, sorted by LEARN_TOPIC_ORDER (unknown topics last). */
export function orderedTopicIdsWithConcepts(): string[] {
  const rank = (id: string) => {
    const i = LEARN_TOPIC_ORDER.indexOf(id);
    return i === -1 ? Number.MAX_SAFE_INTEGER : i;
  };
  return [...topicsWithConcepts()].sort((a, b) => rank(a) - rank(b));
}

/** Flat list of every concept in learning-path order. */
export function orderedConcepts(): Concept[] {
  return orderedTopicIdsWithConcepts().flatMap(topicId => conceptsForTopic(topicId));
}

/** The next topic (after the given one) that actually has concepts, or null. */
export function nextTopicWithConcepts(topicId: string): string | null {
  const ordered = orderedTopicIdsWithConcepts();
  const idx = ordered.indexOf(topicId);
  return idx >= 0 && idx + 1 < ordered.length ? ordered[idx + 1] : null;
}

/** Related topic ids for a topic, filtered to those that currently have concepts. */
export function relatedTopicsWithConcepts(topicId: string): string[] {
  const withConcepts = new Set(topicsWithConcepts());
  return (RELATED_TOPICS[topicId] ?? []).filter(id => withConcepts.has(id));
}

/** Count of all concepts that exist (denominator for overall progress). */
export function totalConceptCount(): number {
  return allConcepts.length;
}
