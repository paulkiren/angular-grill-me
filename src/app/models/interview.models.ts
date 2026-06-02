export interface RubricMatcher {
  pattern: string;       // Regex pattern string
  term: string;          // Key term (e.g. 'initial value')
  label: string;         // Descriptive evaluation label
}

export interface Question {
  id: string;
  topic: string;
  title: string;
  questionText: string;
  difficulty: 'Junior' | 'Mid' | 'Senior';
  timeLimit: number; // in seconds
  rubrics: string[]; // essential keywords / concepts
  sampleAnswer: string;
  rubricMatchers?: RubricMatcher[]; // Embedded regex rubrics for dynamic evaluations
  options?: string[]; // Optional: for micro-quizzes
  correctOptionIndex?: number; // Optional: for micro-quizzes
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
  history: {
    interviews: InterviewSession[];
    challenges: ChallengeAttempt[];
  };
}
