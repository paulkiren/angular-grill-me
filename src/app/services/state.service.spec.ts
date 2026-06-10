import { TestBed } from '@angular/core/testing';
import { StateService } from './state.service';
import { InterviewSession, ChallengeAttempt } from '../models/interview.models';

// jsdom localStorage is real but isolated per test — no mocking needed.

function makeSession(overrides: Partial<InterviewSession> = {}): InterviewSession {
  return {
    id: 's1',
    timestamp: 1000,
    questions: [],
    currentQuestionIndex: 0,
    answers: {},
    evaluations: {},
    isCompleted: true,
    totalScore: 80,
    ...overrides
  };
}

function makeAttempt(overrides: Partial<ChallengeAttempt> = {}): ChallengeAttempt {
  return {
    challengeId: 'c1',
    timestamp: 2000,
    code: 'class Foo {}',
    isPassed: true,
    score: 100,
    feedback: 'ok',
    ...overrides
  };
}

describe('StateService', () => {
  let service: StateService;

  beforeEach(() => {
    localStorage.clear();
    TestBed.configureTestingModule({});
    service = TestBed.inject(StateService);
  });

  // --- initial state ---

  it('starts with zero readiness and empty history', () => {
    expect(service.readinessScore()).toBe(0);
    expect(service.history().interviews).toEqual([]);
    expect(service.history().challenges).toEqual([]);
  });

  // --- interview sessions ---

  it('saves an interview session and updates history', () => {
    service.saveInterviewSession(makeSession());
    expect(service.history().interviews).toHaveLength(1);
    expect(service.history().interviews[0].id).toBe('s1');
  });

  it('replaces an existing session with the same id', () => {
    service.saveInterviewSession(makeSession({ totalScore: 60 }));
    service.saveInterviewSession(makeSession({ totalScore: 90 }));
    expect(service.history().interviews).toHaveLength(1);
    expect(service.history().interviews[0].totalScore).toBe(90);
  });

  it('recalculates readiness after saving a completed session', () => {
    service.saveInterviewSession(makeSession({ totalScore: 100 }));
    expect(service.readinessScore()).toBeGreaterThan(0);
  });

  it('does not count incomplete sessions in readiness', () => {
    service.saveInterviewSession(makeSession({ isCompleted: false, totalScore: 100 }));
    expect(service.readinessScore()).toBe(0);
  });

  // --- challenges ---

  it('saves a challenge attempt', () => {
    service.saveChallengeAttempt(makeAttempt());
    expect(service.history().challenges).toHaveLength(1);
  });

  it('marks a challenge completed when isPassed is true', () => {
    service.saveChallengeAttempt(makeAttempt({ challengeId: 'c1', isPassed: true }));
    expect(service.progress().completedChallenges['c1']).toBe(true);
  });

  it('does not mark a challenge completed when isPassed is false', () => {
    service.saveChallengeAttempt(makeAttempt({ isPassed: false }));
    expect(service.progress().completedChallenges['c1']).toBeUndefined();
  });

  it('replaces existing attempt for the same challengeId', () => {
    service.saveChallengeAttempt(makeAttempt({ score: 50 }));
    service.saveChallengeAttempt(makeAttempt({ score: 100 }));
    expect(service.history().challenges).toHaveLength(1);
    expect(service.history().challenges[0].score).toBe(100);
  });

  it('stores the timestamp on a challenge attempt', () => {
    const attempt = makeAttempt({ timestamp: 999999 });
    service.saveChallengeAttempt(attempt);
    expect(service.history().challenges[0].timestamp).toBe(999999);
  });

  // --- quiz scores ---

  it('saves the best quiz score for a topic', () => {
    service.saveQuizScore('signals', 70);
    expect(service.progress().completedQuizzes['signals']).toBe(70);
  });

  it('does not overwrite a better quiz score with a lower one', () => {
    service.saveQuizScore('signals', 90);
    service.saveQuizScore('signals', 60);
    expect(service.progress().completedQuizzes['signals']).toBe(90);
  });

  it('updates the quiz score when the new one is higher', () => {
    service.saveQuizScore('signals', 60);
    service.saveQuizScore('signals', 95);
    expect(service.progress().completedQuizzes['signals']).toBe(95);
  });

  // --- concept learning (FEAT-001) ---

  it('marks a concept as learned', () => {
    service.markConceptLearned('concept-signal-basics');
    expect(service.isConceptLearned('concept-signal-basics')).toBe(true);
  });

  it('stores a timestamp when marking a concept learned', () => {
    service.markConceptLearned('concept-signal-basics');
    expect(service.learnedConcepts()['concept-signal-basics']).toBeGreaterThan(0);
  });

  it('unmarks a learned concept', () => {
    service.markConceptLearned('concept-signal-basics');
    service.unmarkConceptLearned('concept-signal-basics');
    expect(service.isConceptLearned('concept-signal-basics')).toBe(false);
  });

  it('toggles a concept from learned to unlearned', () => {
    service.markConceptLearned('c');
    service.toggleConceptLearned('c');
    expect(service.isConceptLearned('c')).toBe(false);
  });

  it('toggles a concept from unlearned to learned', () => {
    service.toggleConceptLearned('c');
    expect(service.isConceptLearned('c')).toBe(true);
  });

  it('markConceptLearned is idempotent — does not overwrite an existing timestamp', () => {
    service.markConceptLearned('c');
    const first = service.learnedConcepts()['c'];
    service.markConceptLearned('c');
    expect(service.learnedConcepts()['c']).toBe(first);
  });

  // --- reset ---

  it('resetProgress clears all state', () => {
    service.saveInterviewSession(makeSession());
    service.saveChallengeAttempt(makeAttempt());
    service.markConceptLearned('c');
    service.resetProgress();
    expect(service.readinessScore()).toBe(0);
    expect(service.history().interviews).toEqual([]);
    expect(service.history().challenges).toEqual([]);
    expect(service.learnedConcepts()).toEqual({});
  });

  // --- localStorage persistence ---

  it('persists progress to localStorage after changes', () => {
    service.saveInterviewSession(makeSession());
    TestBed.flushEffects();
    const raw = localStorage.getItem('angular_grill_me_progress_compressed');
    expect(raw).not.toBeNull();
    const parsed = JSON.parse(raw!);
    expect(parsed.history.interviews).toHaveLength(1);
  });

  it('hydrates state from localStorage on boot', () => {
    // Pre-seed localStorage with a compressed session, then boot a fresh service instance
    const compressed = {
      readinessScore: 42,
      completedQuizzes: {},
      completedChallenges: {},
      learnedConcepts: {},
      history: {
        interviews: [{
          id: 'hydrated', timestamp: 1000, currentQuestionIndex: 0,
          isCompleted: true, totalScore: 80, answers: {}, evaluations: {}, questionIds: []
        }],
        challenges: []
      }
    };
    localStorage.setItem('angular_grill_me_progress_compressed', JSON.stringify(compressed));

    // Instantiate a fresh service directly (constructor reads localStorage on creation)
    const fresh = TestBed.runInInjectionContext(() => new StateService());
    expect(fresh.history().interviews[0].id).toBe('hydrated');
  });

  it('stores only question ids in compressed format (not full question objects)', () => {
    service.saveInterviewSession(makeSession({ questions: [] }));
    TestBed.flushEffects();
    const raw = JSON.parse(localStorage.getItem('angular_grill_me_progress_compressed')!);
    const sess = raw.history.interviews[0];
    expect(sess.questionIds).toBeDefined();
    expect(sess.questions).toBeUndefined();
  });

  // --- readiness scoring ---

  it('readiness is capped at 100', () => {
    service.saveInterviewSession(makeSession({ totalScore: 100 }));
    service.saveQuizScore('t1', 100);
    expect(service.readinessScore()).toBeLessThanOrEqual(100);
  });
});
