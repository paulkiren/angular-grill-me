import { Injectable, signal, computed, effect } from '@angular/core';
import { Question, PlaygroundChallenge, UserProgress, InterviewSession, ChallengeAttempt } from '../models/interview.models';
import { quizQuestionsData, quizTopicsData } from '../data/quiz.data';
import { challengesData } from '../data/challenges.data';

@Injectable({
  providedIn: 'root'
})
export class StateService {
  // Global Signals
  private readonly _progress = signal<UserProgress>({
    readinessScore: 0,
    completedQuizzes: {},
    completedChallenges: {},
    learnedConcepts: {},
    history: { interviews: [], challenges: [] }
  });

  // Read-only exposing signals
  public readonly progress = computed(() => this._progress());
  public readonly history = computed(() => this._progress().history);
  public readonly readinessScore = computed(() => this._progress().readinessScore);
  public readonly learnedConcepts = computed(() => this._progress().learnedConcepts);

  // Static decoupled arrays registries
  public readonly challenges: PlaygroundChallenge[] = challengesData;
  public readonly quizTopics = quizTopicsData;
  public readonly quizQuestions = quizQuestionsData;

  constructor() {
    // Synchronize global progress from localStorage on boot with hydration decompression
    const stored = localStorage.getItem('angular_grill_me_progress_compressed');
    if (stored) {
      try {
        const compressed = JSON.parse(stored);
        
        // Hydrate/Decompress interview sessions: reconstruct questions references
        const hydratedInterviews = (compressed.history?.interviews || []).map((sess: any) => {
          // Reconstruct the full Question array using saved IDs
          const questions = (sess.questionIds || []).map((id: string) => 
            this.quizQuestions.find(q => q.id === id)
          ).filter((q: any) => !!q) as Question[];

          return {
            id: sess.id,
            timestamp: sess.timestamp,
            currentQuestionIndex: sess.currentQuestionIndex || 0,
            answers: sess.answers || {},
            evaluations: sess.evaluations || {},
            isCompleted: sess.isCompleted || false,
            totalScore: sess.totalScore || 0,
            questions
          } as InterviewSession;
        });

        this._progress.set({
          readinessScore: compressed.readinessScore || 0,
          completedQuizzes: compressed.completedQuizzes || {},
          completedChallenges: compressed.completedChallenges || {},
          learnedConcepts: compressed.learnedConcepts || {},
          history: {
            interviews: hydratedInterviews,
            challenges: compressed.history?.challenges || []
          }
        });
      } catch (e) {
        console.warn('Failed to hydrate compressed progress, falls back to empty state.');
      }
    } else {
      // Compatibility fallback: load older format if exists and migrate it
      const legacy = localStorage.getItem('angular_grill_me_progress');
      if (legacy) {
        try {
          const parsed = JSON.parse(legacy);
          parsed.learnedConcepts = parsed.learnedConcepts || {};
          this._progress.set(parsed);
          localStorage.removeItem('angular_grill_me_progress'); // Clear legacy format
        } catch (e) {}
      }
    }

    // Effect to automatically save progress with high-efficiency serialization compression
    effect(() => {
      const current = this._progress();

      // Compress history: strip massive questions objects inside sessions
      const compressedInterviews = current.history.interviews.map(sess => ({
        id: sess.id,
        timestamp: sess.timestamp,
        currentQuestionIndex: sess.currentQuestionIndex,
        isCompleted: sess.isCompleted,
        totalScore: sess.totalScore,
        answers: sess.answers,
        evaluations: sess.evaluations,
        questionIds: sess.questions.map(q => q.id) // Save only IDs!
      }));

      const compressedState = {
        readinessScore: current.readinessScore,
        completedQuizzes: current.completedQuizzes,
        completedChallenges: current.completedChallenges,
        learnedConcepts: current.learnedConcepts,
        history: {
          interviews: compressedInterviews,
          challenges: current.history.challenges
        }
      };

      localStorage.setItem('angular_grill_me_progress_compressed', JSON.stringify(compressedState));
    });
  }

  // State Mutators
  public saveInterviewSession(session: InterviewSession): void {
    const current = this._progress();
    const updatedInterviews = [
      session,
      ...current.history.interviews.filter(i => i.id !== session.id)
    ];

    // Compute new readiness score
    const newReadiness = this.calculateReadinessScore(updatedInterviews, current.history.challenges);

    this._progress.update(prev => ({
      ...prev,
      readinessScore: newReadiness,
      history: {
        ...prev.history,
        interviews: updatedInterviews
      }
    }));
  }

  public saveChallengeAttempt(attempt: ChallengeAttempt): void {
    const current = this._progress();
    const updatedChallenges = [
      attempt,
      ...current.history.challenges.filter(c => c.challengeId !== attempt.challengeId)
    ];

    const completedChallengesMap = { ...current.completedChallenges };
    if (attempt.isPassed) {
      completedChallengesMap[attempt.challengeId] = true;
    }

    // Compute new readiness score
    const newReadiness = this.calculateReadinessScore(current.history.interviews, updatedChallenges);

    this._progress.update(prev => ({
      ...prev,
      readinessScore: newReadiness,
      completedChallenges: completedChallengesMap,
      history: {
        ...prev.history,
        challenges: updatedChallenges
      }
    }));
  }

  public saveQuizScore(topicId: string, percentage: number): void {
    const current = this._progress();
    const updatedQuizzes = { ...current.completedQuizzes };
    const currentBest = updatedQuizzes[topicId] || 0;
    if (percentage > currentBest) {
      updatedQuizzes[topicId] = percentage;
    }

    // Recalculate readiness
    const mockInterviews = current.history.interviews;
    const mockChallenges = current.history.challenges;
    const newReadiness = this.calculateReadinessScore(mockInterviews, mockChallenges, updatedQuizzes);

    this._progress.update(prev => ({
      ...prev,
      readinessScore: newReadiness,
      completedQuizzes: updatedQuizzes
    }));
  }

  // FEAT-001: learning progress (intentionally separate from readiness scoring)
  public markConceptLearned(conceptId: string): void {
    this._progress.update(prev =>
      prev.learnedConcepts[conceptId]
        ? prev
        : { ...prev, learnedConcepts: { ...prev.learnedConcepts, [conceptId]: Date.now() } }
    );
  }

  public unmarkConceptLearned(conceptId: string): void {
    this._progress.update(prev => {
      if (!prev.learnedConcepts[conceptId]) return prev;
      const next = { ...prev.learnedConcepts };
      delete next[conceptId];
      return { ...prev, learnedConcepts: next };
    });
  }

  public toggleConceptLearned(conceptId: string): void {
    if (this._progress().learnedConcepts[conceptId]) {
      this.unmarkConceptLearned(conceptId);
    } else {
      this.markConceptLearned(conceptId);
    }
  }

  public isConceptLearned(conceptId: string): boolean {
    return !!this._progress().learnedConcepts[conceptId];
  }

  public resetProgress(): void {
    const cleared: UserProgress = {
      readinessScore: 0,
      completedQuizzes: {},
      completedChallenges: {},
      learnedConcepts: {},
      history: { interviews: [], challenges: [] }
    };
    this._progress.set(cleared);
  }

  // Scoring Math
  private calculateReadinessScore(
    interviews: InterviewSession[],
    challenges: ChallengeAttempt[],
    quizzes: Record<string, number> = this._progress().completedQuizzes
  ): number {
    // Breakdown weights:
    // Interviews: 40%
    // Coding Challenges: 40%
    // Topic Quizzes: 20%
    let interviewSum = 0;
    let interviewCount = 0;
    interviews.forEach(session => {
      if (session.isCompleted) {
        interviewSum += session.totalScore;
        interviewCount++;
      }
    });
    const interviewWeight = interviewCount > 0 ? (interviewSum / interviewCount) : 0;

    let challengePassedCount = 0;
    const uniqueChallengeMap = new Map<string, boolean>();
    challenges.forEach(att => {
      const existing = uniqueChallengeMap.get(att.challengeId);
      if (!existing && att.isPassed) {
        uniqueChallengeMap.set(att.challengeId, true);
        challengePassedCount++;
      }
    });
    const totalPlaygroundChallengesCount = this.challenges.length;
    const challengeWeight = totalPlaygroundChallengesCount > 0
      ? (challengePassedCount / totalPlaygroundChallengesCount) * 100
      : 0;

    let quizSum = 0;
    let quizCount = 0;
    Object.keys(quizzes).forEach(key => {
      quizSum += quizzes[key];
      quizCount++;
    });
    const quizWeight = quizCount > 0 ? (quizSum / this.quizTopics.length) : 0;

    const weightedScore = (interviewWeight * 0.40) + (challengeWeight * 0.40) + (quizWeight * 0.20);
    return Math.round(weightedScore);
  }
}
