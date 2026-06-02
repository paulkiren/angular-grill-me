import { Component, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StateService } from '../services/state.service';
import { EvaluationService } from '../services/evaluation.service';
import { InterviewSession, Question, EvaluationResult } from '../models/interview.models';

@Component({
  selector: 'app-topic-matrix',
  imports: [CommonModule],
  template: `
    <div class="matrix-wrapper fade-in">
      @if (activeQuizState() === 'browse') {
        <!-- Topic Selection Screen -->
        <section class="intro-bar">
          <h1 class="page-title">Angular Topic/Skills Matrix</h1>
          <p class="page-subtitle">Assess your structural knowledge on core Angular concepts. Practice and unlock higher levels of interview readiness.</p>
        </section>

        <section class="topics-grid">
          @for (topic of state.quizTopics; track topic.id) {
            <div class="topic-card panel" [class.completed]="getBestScore(topic.id) !== undefined">
              <div class="topic-header">
                <h3 class="topic-title">{{ topic.title }}</h3>
                @if (getBestScore(topic.id) !== undefined) {
                  <span class="score-badge badge" [class.badge-success]="getBestScore(topic.id)! >= 70" [class.badge-mid]="getBestScore(topic.id)! < 70">
                    Best: {{ getBestScore(topic.id) }}%
                  </span>
                }
              </div>
              <p class="topic-description">{{ topic.description }}</p>
              <div class="topic-footer">
                <button (click)="startQuiz(topic.id)" class="btn btn-primary">
                  {{ getBestScore(topic.id) !== undefined ? 'Retake Assessment' : 'Start Quiz' }}
                </button>
              </div>
            </div>
          }
        </section>
      } @else if (activeQuizState() === 'quiz') {
        <!-- Interactive Quiz UI -->
        <section class="quiz-panel panel slide-in">
          <div class="quiz-header">
            <span class="quiz-badge badge badge-topic">{{ activeTopicTitle() }}</span>
            <span class="quiz-progress">Question {{ currentQuestionIndex() + 1 }} of {{ activeQuestions().length }}</span>
          </div>

          <h2 class="question-text">{{ currentQuestion()?.questionText }}</h2>

          @if (currentQuestionType() === 'multiple-choice') {
            <div class="options-list">
              @for (option of currentQuestion()?.options; track $index) {
                <div class="option-card"
                     [class.selected]="selectedOptionIndex() === $index"
                     (click)="selectOption($index)">
                  <span class="option-bullet">{{ getOptionLetter($index) }}</span>
                  <p class="option-text">{{ option }}</p>
                </div>
              }
            </div>
          } @else {
            <div class="open-ended-quiz panel">
              @if (currentQuestion()?.codeSnippet) {
                <pre class="code-snippet">{{ currentQuestion()?.codeSnippet }}</pre>
              }
              <label class="form-label">Your answer</label>
              <textarea class="form-input answer-textarea"
                        [(ngModel)]="openEndedAnswerValue"
                        placeholder="{{ currentQuestion()?.answerPlaceholder || 'Explain your reasoning in at least 15 characters...' }}">
              </textarea>
              <p class="input-help">Open-ended questions are scored by concept coverage, not exact wording.</p>
            </div>
          }

          <div class="quiz-footer">
            <button (click)="cancelQuiz()" class="btn btn-secondary">Exit Quiz</button>
            <button (click)="nextQuestion()" class="btn btn-primary" [disabled]="!isCurrentQuestionAnswered()">
              {{ currentQuestionIndex() === activeQuestions().length - 1 ? 'Finish Quiz' : 'Next Question' }}
            </button>
          </div>
        </section>
      } @else if (activeQuizState() === 'result') {
        <!-- Quiz Results Panel -->
        <section class="result-panel panel slide-in">
          <div class="result-gauge-box">
            <div class="result-icon-circle" [class.passed]="quizScore() >= 70">
              @if (quizScore() >= 70) {
                <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
              } @else {
                <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>
              }
            </div>
            <h1 class="result-score">{{ quizScore() }}%</h1>
            <p class="result-heading">{{ quizScore() >= 70 ? 'Assessment Cleared!' : 'Quiz Completed' }}</p>
            <p class="result-feedback">
              {{ quizScore() >= 80 ? 'Excellent! You possess a robust theoretical foundation in this topic.' : 
                 quizScore() >= 60 ? 'Nice effort! You understand the core, but would benefit from reviewing the explanations below.' :
                 'Take some time to read through the recommended study items and try again!' }}
            </p>
          </div>

          <div class="result-actions">
            <button (click)="resetQuizState()" class="btn btn-primary">Back to Skills Matrix</button>
          </div>

          <h3 class="review-heading">Question-by-Question Review</h3>
          <div class="review-list">
            @for (q of finalQuizResult()?.questions || activeQuestions(); track q.id; let idx = $index) {
              @let evalResult = finalQuizResult()?.evaluations?.[q.id];
              @let userAnswer = finalQuizResult()?.answers?.[q.id] || '';
              <div class="review-item" [class.correct]="q.questionType === 'multiple-choice' ? quizAnswers()[q.id] === q.correctOptionIndex : evalResult?.score >= 70">
                <div class="review-header">
                  <span class="q-num">Q{{ idx + 1 }}</span>
                  <span class="review-status badge" [class.badge-success]="q.questionType === 'multiple-choice' ? quizAnswers()[q.id] === q.correctOptionIndex : evalResult?.score >= 70" [class.badge-danger]="q.questionType === 'multiple-choice' ? quizAnswers()[q.id] !== q.correctOptionIndex : evalResult?.score < 70">
                    {{ q.questionType === 'multiple-choice' ? (quizAnswers()[q.id] === q.correctOptionIndex ? 'Correct' : 'Incorrect') : (evalResult?.score >= 70 ? 'Strong' : 'Needs improvement') }}
                  </span>
                </div>
                <p class="q-txt"><strong>{{ q.questionText }}</strong></p>
                <div class="review-details">
                  <div class="user-ans">Your answer: <em>
                    @if (q.questionType === 'multiple-choice') {
                      {{ q.options?.[quizAnswers()[q.id]] }}
                    } @else {
                      {{ userAnswer }}
                    }
                  </em></div>

                  @if (q.questionType === 'multiple-choice') {
                    @if (quizAnswers()[q.id] !== q.correctOptionIndex) {
                      <div class="correct-ans">Correct answer: <strong>{{ q.options?.[q.correctOptionIndex || 0] }}</strong></div>
                    }
                  } @else if (evalResult) {
                    <div class="open-ended-score">Score: <strong>{{ evalResult.score }}%</strong></div>
                    <div class="concept-explanation">
                      <strong>Feedback:</strong> {{ evalResult.feedback }}
                    </div>
                  }

                  <div class="concept-explanation">
                    <strong>Technical Context:</strong> {{ q.sampleAnswer }}
                  </div>
                </div>
              </div>
            }
          </div>
        </section>
      }
    </div>
  `,
  styles: [`
    .matrix-wrapper {
      max-width: 900px;
      margin: 0 auto;
    }

    .intro-bar {
      margin-bottom: 32px;
      text-align: center;
    }

    .page-title {
      font-size: 2.2rem;
      font-weight: 800;
      margin-bottom: 8px;
    }

    .page-subtitle {
      color: var(--text-secondary);
      font-size: 1.1rem;
    }

    /* Grid layout */
    .topics-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 24px;
    }

    .topic-card {
      display: flex;
      flex-direction: column;
      height: 100%;
    }

    .topic-card.completed {
      border-color: rgba(52, 199, 89, 0.2);
      background: var(--bg-card);
    }

    .topic-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: 12px;
    }

    .topic-title {
      font-size: 1.3rem;
      font-weight: 700;
    }

    .topic-description {
      color: var(--text-secondary);
      font-size: 0.95rem;
      line-height: 1.5;
      flex-grow: 1;
      margin-bottom: 24px;
    }

    .topic-footer {
      margin-top: auto;
    }

    /* Interactive Quiz */
    .quiz-panel {
      padding: 40px;
    }

    .quiz-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 24px;
    }

    .quiz-progress {
      font-size: 0.9rem;
      font-weight: 600;
      color: var(--text-secondary);
    }

    .question-text {
      font-size: 1.6rem;
      font-weight: 700;
      line-height: 1.3;
      margin-bottom: 30px;
    }

    .options-list {
      display: flex;
      flex-direction: column;
      gap: 16px;
      margin-bottom: 40px;
    }

    .option-card {
      display: flex;
      align-items: center;
      padding: 16px 20px;
      border-radius: var(--radius-md);
      border: 1px solid var(--border-color);
      background: var(--bg-secondary);
      cursor: pointer;
      transition: all var(--transition-fast);
      gap: 16px;
    }

    .option-card:hover {
      border-color: var(--border-hover);
      transform: translateY(-1px);
    }

    .option-card.selected {
      border-color: var(--color-accent);
      background: var(--color-accent-light);
    }

    .option-bullet {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 28px;
      height: 28px;
      border-radius: 50%;
      background: var(--bg-input);
      color: var(--text-primary);
      font-weight: 600;
      font-size: 0.85rem;
      flex-shrink: 0;
      transition: all var(--transition-fast);
    }

    .option-card.selected .option-bullet {
      background: var(--color-accent);
      color: var(--text-on-accent);
    }

    .answer-textarea {
      width: 100%;
      min-height: 160px;
      resize: vertical;
      padding: 16px;
      border-radius: var(--radius-md);
      border: 1px solid var(--border-color);
      background: var(--bg-secondary);
      color: var(--text-primary);
      font-family: var(--font-mono);
      font-size: 0.95rem;
      line-height: 1.5;
      margin-top: 12px;
      margin-bottom: 12px;
    }

    .code-snippet {
      background: var(--bg-primary);
      border: 1px solid var(--border-color);
      border-radius: var(--radius-sm);
      padding: 16px;
      font-family: var(--font-mono);
      white-space: pre-wrap;
      margin-bottom: 16px;
      overflow-x: auto;
    }

    .option-text {
      font-size: 1rem;
      font-weight: 500;
      line-height: 1.4;
      color: var(--text-primary);
    }

    .quiz-footer {
      display: flex;
      justify-content: space-between;
      align-items: center;
      border-top: 1px solid var(--border-color);
      padding-top: 24px;
    }

    /* Result Panel */
    .result-panel {
      padding: 40px;
    }

    .result-gauge-box {
      display: flex;
      flex-direction: column;
      align-items: center;
      text-align: center;
      margin-bottom: 36px;
    }

    .result-icon-circle {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 72px;
      height: 72px;
      border-radius: 50%;
      background: var(--color-danger-light);
      color: var(--color-danger);
      margin-bottom: 16px;
    }

    .result-icon-circle.passed {
      background: var(--color-success-light);
      color: var(--color-success);
    }

    .result-score {
      font-family: var(--font-heading);
      font-size: 3.5rem;
      font-weight: 800;
      line-height: 1.1;
      margin-bottom: 4px;
    }

    .result-heading {
      font-size: 1.4rem;
      font-weight: 700;
      margin-bottom: 8px;
    }

    .result-feedback {
      color: var(--text-secondary);
      font-size: 1.05rem;
      max-width: 500px;
      line-height: 1.5;
    }

    .result-actions {
      display: flex;
      justify-content: center;
      margin-bottom: 40px;
    }

    .review-heading {
      font-size: 1.3rem;
      font-weight: 700;
      border-bottom: 1px solid var(--border-color);
      padding-bottom: 12px;
      margin-bottom: 20px;
    }

    .review-list {
      display: flex;
      flex-direction: column;
      gap: 20px;
    }

    .review-item {
      padding: 20px;
      border-radius: var(--radius-md);
      border: 1px solid var(--border-color);
      background: var(--bg-secondary);
      border-left: 4px solid var(--color-danger);
    }

    .review-item.correct {
      border-left-color: var(--color-success);
    }

    .review-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 10px;
    }

    .q-num {
      font-weight: 700;
      color: var(--text-secondary);
    }

    .q-txt {
      font-size: 1.05rem;
      margin-bottom: 14px;
      line-height: 1.4;
    }

    .review-details {
      display: flex;
      flex-direction: column;
      gap: 8px;
      font-size: 0.95rem;
    }

    .user-ans {
      color: var(--text-secondary);
    }

    .correct-ans {
      color: var(--color-success);
    }

    .concept-explanation {
      background: var(--bg-primary);
      padding: 12px;
      border-radius: var(--radius-sm);
      margin-top: 6px;
      color: var(--text-primary);
      line-height: 1.5;
    }

    @media (max-width: 768px) {
      .topics-grid {
        grid-template-columns: 1fr;
      }
      .quiz-panel, .result-panel {
        padding: 24px;
      }
    }
  `]
})
export class TopicMatrixComponent {
  public readonly state = inject(StateService);

  // States
  public readonly activeQuizState = signal<'browse' | 'quiz' | 'result'>('browse');
  public readonly activeTopicId = signal<string>('');
  public readonly currentQuestionIndex = signal<number>(0);
  public readonly selectedOptionIndex = signal<number | null>(null);
  public readonly openEndedAnswer = signal<string>('');
  public readonly openEndedResponses = signal<Record<string, string>>({});
  public readonly finalQuizResult = signal<InterviewSession | null>(null);

  // Storage for active session responses
  public readonly quizAnswers = signal<Record<string, number>>({});
  public readonly quizScore = signal<number>(0);
  private readonly evaluationService = inject(EvaluationService);

  // Computed views
  public readonly activeTopicTitle = computed(() => {
    const activeId = this.activeTopicId();
    return this.state.quizTopics.find(t => t.id === activeId)?.title || '';
  });

  public readonly activeQuestions = computed(() => {
    const activeId = this.activeTopicId();
    return this.state.quizQuestions.filter(q => q.topic === activeId);
  });

  public readonly currentQuestion = computed<Question | null>(() => {
    const questions = this.activeQuestions();
    const idx = this.currentQuestionIndex();
    return questions[idx] || null;
  });

  public readonly currentQuestionType = computed(() => this.currentQuestion()?.questionType || 'multiple-choice');
  public readonly isCurrentQuestionAnswered = computed(() => {
    const type = this.currentQuestionType();
    if (type === 'multiple-choice') {
      return this.selectedOptionIndex() !== null;
    }
    return this.openEndedAnswer().trim().length >= 15;
  });

  public get openEndedAnswerValue(): string {
    return this.openEndedAnswer();
  }

  public set openEndedAnswerValue(value: string) {
    this.openEndedAnswer.set(value);
  }

  // Action methods
  public getBestScore(topicId: string): number | undefined {
    return this.state.progress().completedQuizzes[topicId];
  }

  public startQuiz(topicId: string): void {
    this.activeTopicId.set(topicId);
    this.currentQuestionIndex.set(0);
    this.selectedOptionIndex.set(null);
    this.openEndedAnswer.set('');
    this.openEndedResponses.set({});
    this.finalQuizResult.set(null);
    this.quizAnswers.set({});
    this.activeQuizState.set('quiz');
  }

  public cancelQuiz(): void {
    this.activeQuizState.set('browse');
  }

  public selectOption(index: number): void {
    this.selectedOptionIndex.set(index);
  }

  public getOptionLetter(index: number): string {
    return String.fromCharCode(65 + index); // A, B, C, D...
  }

  public async nextQuestion(): Promise<void> {
    const curQ = this.currentQuestion();
    if (!curQ) {
      return;
    }

    const type = this.currentQuestionType();
    if (type === 'multiple-choice') {
      const selected = this.selectedOptionIndex();
      if (selected === null) {
        return;
      }
      const answersMap = { ...this.quizAnswers() };
      answersMap[curQ.id] = selected;
      this.quizAnswers.set(answersMap);
    } else {
      const text = this.openEndedAnswer().trim();
      if (text.length < 15) {
        return;
      }
      const answersMap = { ...this.openEndedResponses() };
      answersMap[curQ.id] = text;
      this.openEndedResponses.set(answersMap);
      this.openEndedAnswer.set('');
    }

    const nextIdx = this.currentQuestionIndex() + 1;
    const totalQs = this.activeQuestions().length;

    if (nextIdx < totalQs) {
      this.currentQuestionIndex.set(nextIdx);
      this.selectedOptionIndex.set(null);
    } else {
      await this.evaluateQuizResult();
    }
  }

  private async evaluateQuizResult(): Promise<void> {
    const questions = this.activeQuestions();
    const mcAnswers = this.quizAnswers();
    const openAnswers = this.openEndedResponses();
    const evaluations: Record<string, EvaluationResult> = {};
    let totalScore = 0;

    await Promise.all(questions.map(async q => {
      if (q.questionType === 'multiple-choice') {
        const score = q.correctOptionIndex !== undefined && mcAnswers[q.id] === q.correctOptionIndex ? 100 : 0;
        totalScore += score;
      } else {
        const answerText = openAnswers[q.id] || '';
        const evalResult = await this.evaluationService.evaluateAnswer(q, answerText);
        evaluations[q.id] = evalResult;
        totalScore += evalResult.score;
      }
    }));

    const percentage = Math.round(totalScore / questions.length);
    this.quizScore.set(percentage);

    // Save score in state
    this.state.saveQuizScore(this.activeTopicId(), percentage);

    const session: InterviewSession = {
      id: `quiz-${Date.now()}`,
      timestamp: Date.now(),
      questions,
      currentQuestionIndex: questions.length - 1,
      answers: {
        ...Object.fromEntries(Object.entries(mcAnswers).map(([id, index]) => [id, String(index)])),
        ...openAnswers
      },
      evaluations,
      isCompleted: true,
      totalScore: percentage
    };

    this.finalQuizResult.set(session);
    this.activeQuizState.set('result');
  }

  public resetQuizState(): void {
    this.activeQuizState.set('browse');
    this.selectedOptionIndex.set(null);
    this.openEndedAnswer.set('');
    this.openEndedResponses.set({});
    this.quizAnswers.set({});
    this.finalQuizResult.set(null);
  }
}
