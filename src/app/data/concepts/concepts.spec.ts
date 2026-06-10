// FEAT-001 (v0.3.0 / WS1) — Concept layer integrity tests.
// Pure data assertions (no TestBed): guarantees the Concept<->Question graph stays consistent
// as content grows, so the coverage promise can't silently rot.
import { allConcepts, questionsForConcept } from './index';
import { allQuestions, allTopics } from '../questions/index';
import { LEARN_TOPIC_ORDER, RELATED_TOPICS } from './learning-path';

describe('Concept layer integrity (FEAT-001)', () => {
  it('has unique concept ids', () => {
    const ids = allConcepts.map(c => c.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('every concept.topic resolves to a real topic', () => {
    const topicIds = new Set(allTopics.map(t => t.id));
    const orphans = allConcepts.filter(c => !topicIds.has(c.topic));
    expect(orphans.map(c => c.id)).toEqual([]);
  });

  it('every question.conceptId resolves to a real concept', () => {
    const conceptIds = new Set(allConcepts.map(c => c.id));
    const dangling = allQuestions
      .filter(q => q.conceptId !== undefined)
      .filter(q => !conceptIds.has(q.conceptId as string));
    expect(dangling.map(q => q.id)).toEqual([]);
  });

  it('every concept has at least one linked practice question', () => {
    const empty = allConcepts.filter(c => questionsForConcept(c.id).length === 0);
    expect(empty.map(c => c.id)).toEqual([]);
  });

  it('a linked question shares its concept topic (no cross-topic links)', () => {
    const byId = new Map(allConcepts.map(c => [c.id, c]));
    const mismatched = allQuestions
      .filter(q => q.conceptId && byId.has(q.conceptId))
      .filter(q => byId.get(q.conceptId as string)!.topic !== q.topic);
    expect(mismatched.map(q => q.id)).toEqual([]);
  });

  it('every concept exposes the required teaching fields', () => {
    const incomplete = allConcepts.filter(
      c => !c.summary || c.explanation.length === 0 || !c.whyItMatters,
    );
    expect(incomplete.map(c => c.id)).toEqual([]);
  });
});

describe('Learning-path config integrity (FEAT-001)', () => {
  const topicIds = new Set(allTopics.map(t => t.id));

  it('every topic that has concepts is placed in LEARN_TOPIC_ORDER', () => {
    const order = new Set(LEARN_TOPIC_ORDER);
    const conceptTopics = [...new Set(allConcepts.map(c => c.topic))];
    const missing = conceptTopics.filter(t => !order.has(t));
    expect(missing).toEqual([]);
  });

  it('LEARN_TOPIC_ORDER has no duplicates', () => {
    expect(new Set(LEARN_TOPIC_ORDER).size).toBe(LEARN_TOPIC_ORDER.length);
  });

  it('RELATED_TOPICS keys and values reference real topics', () => {
    const bad: string[] = [];
    for (const [key, related] of Object.entries(RELATED_TOPICS)) {
      if (!topicIds.has(key)) bad.push(key);
      related.forEach(r => { if (!topicIds.has(r)) bad.push(r); });
    }
    expect(bad).toEqual([]);
  });
});
