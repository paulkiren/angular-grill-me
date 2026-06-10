export interface RubricMatcher {
  pattern: string;
  term: string;
  label: string;
  weight?: number; // 1–5; higher = more credit. Defaults to 1 when absent.
}

export type QuestionType =
  | 'multiple-choice'
  | 'open-ended'
  | 'code-snippet'
  | 'select-all'
  | 'drag-and-drop';

// Bloom's Taxonomy cognitive levels — determines question depth and assessment eligibility
export type BloomLevel =
  | 'remember'   // recall facts, definitions, API names
  | 'understand' // explain behaviour, describe why
  | 'apply'      // use in code, fix a bug, implement a pattern
  | 'analyze'    // diagnose a problem, compare options, trace root causes
  | 'evaluate'   // justify a design choice, argue trade-offs
  | 'create';    // design a solution from requirements (Senior only)

export interface Topic {
  id: string;
  title: string;
  description: string;
  tags?: string[];
  metadata?: Record<string, unknown>;
}

export interface Question {
  id: string;
  topic: string;
  title: string;
  questionText: string;
  difficulty: 'Junior' | 'Mid' | 'Senior';
  questionType?: QuestionType;
  bloomLevel: BloomLevel;
  sinceVersion: string;      // Angular version that introduced this concept, e.g. '14.0'
  deprecatedIn?: string;     // Angular version where pattern became obsolete
  conceptId?: string;        // FEAT-001: links this practice question to the Concept it tests
  assessmentEligible: boolean; // false = learning mode only (hint embedded in question text)
  timeLimit: number;
  rubrics: string[];
  sampleAnswer: string;
  rubricMatchers?: RubricMatcher[];
  options?: string[];
  correctOptionIndex?: number;
  correctOptionIndexes?: number[];
  codeSnippet?: string;
  answerPlaceholder?: string;
  tags?: string[];
  metadata?: Record<string, unknown>;
}

// FEAT-001 (v0.3.0 / WS1) — the teaching atom a learner reads BEFORE being assessed.
// Bodies use structured fields (no markdown parser) per FEAT-001 Decision D1.
export interface Concept {
  id: string;            // e.g. 'concept-signals-vs-observables'
  topic: string;         // matches Topic.id / Question.topic, e.g. 'signals'
  title: string;
  summary: string;       // one-sentence "what is this"
  explanation: string[]; // paragraphs — rendered one <p> each
  example?: string;      // code snippet, rendered in <pre><code>
  whyItMatters: string;
  pitfalls: string[];    // common mistakes / misconceptions
  docsUrl?: string;      // angular.dev deep link
  sinceVersion: string;  // mirrors Question.sinceVersion
}

export interface EvaluationResult {
  score: number; // 0 - 100
  feedback: string;
  strengths: string[];
  weaknesses: string[];
  suggestions: string[];
}

export interface InterviewSession {
  id: string;
  timestamp: number;
  questions: Question[];
  currentQuestionIndex: number;
  answers: Record<string, string>; // questionId -> candidate's answer text
  evaluations: Record<string, EvaluationResult>; // questionId -> evaluation
  isCompleted: boolean;
  totalScore: number;
}

export interface PlaygroundChallenge {
  id: string;
  title: string;
  description: string;
  initialCode: string;
  solutionPatterns: string[]; // key phrases or code structures that must exist (regex strings)
  antiPatterns: {
    pattern: string; // regex string
    message: string; // why it's bad
  }[];
  hint: string;
  difficulty: 'Junior' | 'Mid' | 'Senior';
  topic: string;
}

export interface ChallengeAttempt {
  challengeId: string;
  code: string;
  isPassed: boolean;
  score: number;
  feedback: string;
}

export interface UserProgress {
  readinessScore: number;
  completedQuizzes: Record<string, number>; // topic -> best score %
  completedChallenges: Record<string, boolean>; // challengeId -> isPassed
  learnedConcepts: Record<string, number>; // FEAT-001: conceptId -> timestamp marked learned (does not affect readiness)
  history: {
    interviews: InterviewSession[];
    challenges: ChallengeAttempt[];
  };
}
