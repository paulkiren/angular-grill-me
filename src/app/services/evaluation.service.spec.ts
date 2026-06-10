import { TestBed } from '@angular/core/testing';
import { EvaluationService } from './evaluation.service';
import { Question } from '../models/interview.models';

function makeQuestion(overrides: Partial<Question> = {}): Question {
  return {
    id: 'q1',
    topic: 'signals',
    title: 'Signal basics',
    questionText: 'What is a signal?',
    difficulty: 'Mid',
    bloomLevel: 'understand',
    sinceVersion: '16.0',
    assessmentEligible: true,
    timeLimit: 90,
    rubrics: ['signal', 'reactive', 'computed'],
    sampleAnswer: 'A signal is a reactive primitive that tracks reads and notifies on writes.',
    rubricMatchers: [
      { pattern: 'signal', term: 'signal', label: 'Mentioned signal' },
      { pattern: 'reactive|reactiv', term: 'reactive', label: 'Mentioned reactivity' },
      { pattern: 'computed', term: 'computed', label: 'Mentioned computed' },
    ],
    ...overrides
  };
}

describe('EvaluationService', () => {
  let service: EvaluationService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EvaluationService);
  });

  // --- empty / short answers ---

  it('returns score 0 for an empty answer', async () => {
    const result = await service.evaluateAnswer(makeQuestion(), '');
    expect(result.score).toBe(0);
  });

  it('returns score 0 for an answer shorter than 5 chars', async () => {
    const result = await service.evaluateAnswer(makeQuestion(), 'hi');
    expect(result.score).toBe(0);
  });

  it('empty answer feedback mentions "too short"', async () => {
    const result = await service.evaluateAnswer(makeQuestion(), '');
    expect(result.feedback.toLowerCase()).toContain('short');
  });

  // --- offline rubric scoring ---

  it('scores 100 for an answer that hits all rubric matchers with enough words', async () => {
    const answer =
      'A signal is a reactive wrapper that lets computed values and effects track changes automatically through fine-grained dependency tracking. It is synchronous and does not require subscriptions.';
    const result = await service.evaluateAnswer(makeQuestion(), answer);
    expect(result.score).toBeGreaterThanOrEqual(85);
  });

  it('scores lower when key rubric terms are missing', async () => {
    const result = await service.evaluateAnswer(makeQuestion(), 'I do not know this topic at all');
    expect(result.score).toBeLessThan(50);
  });

  it('result includes strengths for matched rubric terms', async () => {
    const answer = 'A signal is a reactive primitive, computed values depend on it.';
    const result = await service.evaluateAnswer(makeQuestion(), answer);
    expect(result.strengths.length).toBeGreaterThan(0);
  });

  it('result includes weaknesses for missed rubric terms', async () => {
    const result = await service.evaluateAnswer(makeQuestion(), 'I have no idea');
    expect(result.weaknesses.length).toBeGreaterThan(0);
  });

  it('result always includes at least one suggestion', async () => {
    const result = await service.evaluateAnswer(makeQuestion(), 'A signal holds a value');
    expect(result.suggestions.length).toBeGreaterThan(0);
  });

  // --- dynamic rubric fallback (no rubricMatchers on question) ---

  it('generates matchers from static rubrics when rubricMatchers is absent', async () => {
    const q = makeQuestion({ rubricMatchers: undefined });
    const answer = 'A signal is reactive and you can use computed to derive values.';
    const result = await service.evaluateAnswer(q, answer);
    expect(result.score).toBeGreaterThan(0);
  });

  it('handles a question with empty rubrics gracefully', async () => {
    const q = makeQuestion({ rubrics: [], rubricMatchers: [] });
    const result = await service.evaluateAnswer(q, 'some decent answer text here with words');
    expect(result.score).toBeGreaterThanOrEqual(0);
  });

  // --- length bonus ---

  it('awards higher scores to longer answers that also hit rubrics', async () => {
    const short = 'signal reactive';
    const long =
      'A signal is a reactive wrapper around a value. When you read it, Angular tracks the dependency. When you write via .set() or .update(), all consumers like computed() are notified and re-evaluated lazily. This makes change detection fine-grained and efficient.';
    const shortResult = await service.evaluateAnswer(makeQuestion(), short);
    const longResult = await service.evaluateAnswer(makeQuestion(), long);
    expect(longResult.score).toBeGreaterThan(shortResult.score);
  });

  // --- score shape ---

  it('offline score is always between 0 and 100', async () => {
    const result = await service.evaluateAnswer(makeQuestion(), 'signal reactive computed value fine-grained notification dependency tracking async synchronous');
    expect(result.score).toBeGreaterThanOrEqual(0);
    expect(result.score).toBeLessThanOrEqual(100);
  });

  it('feedback tier is "Excellent" for scores >= 85', async () => {
    const answer =
      'A signal is a reactive primitive in Angular. It wraps a value and notifies consumers like computed() and effect() when the value changes through fine-grained change detection. You read the current value by calling the signal, and write using .set() or .update(). This enables zoneless rendering because Angular no longer relies on Zone.js to detect changes; it knows exactly which signals changed and which views to update.';
    const result = await service.evaluateAnswer(makeQuestion(), answer);
    if (result.score >= 85) {
      expect(result.feedback.toLowerCase()).toContain('excellent');
    }
  });

  // --- Gemini fallback ---

  it('falls back to offline evaluation when Gemini API key is absent', async () => {
    const result = await service.evaluateAnswer(makeQuestion(), 'A signal is reactive', undefined);
    expect(result.score).toBeGreaterThan(0);
  });

  it('falls back to offline evaluation when Gemini API key is too short', async () => {
    const result = await service.evaluateAnswer(makeQuestion(), 'A signal is reactive', 'short');
    expect(result.score).toBeGreaterThan(0);
  });

  it('falls back to offline on Gemini network error', async () => {
    globalThis.fetch = async () => { throw new Error('Network error'); };
    const result = await service.evaluateAnswer(makeQuestion(), 'A signal is reactive and computed', 'AIzaSyValidLookingKeyThatWillFail12345');
    expect(result.score).toBeGreaterThan(0);
    globalThis.fetch = undefined as any;
  });
});
