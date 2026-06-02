import { Component, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StateService } from '../services/state.service';
import { Question } from '../models/interview.models';

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

          <div class="quiz-footer">
            <button (click)="cancelQuiz()" class="btn btn-secondary">Exit Quiz</button>
            <button (click)="nextQuestion()" class="btn btn-primary" [disabled]="selectedOptionIndex() === null">
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
            @for (q of activeQuestions(); track q.id; let idx = $index) {
              <div class="review-item" [class.correct]="quizAnswers()[q.id] === q.correctOptionIndex">
                <div class="review-header">
                  <span class="q-num">Q{{ idx + 1 }}</span>
                  <span class="review-status badge" [class.badge-success]="quizAnswers()[q.id] === q.correctOptionIndex" [class.badge-danger]="quizAnswers()[q.id] !== q.correctOptionIndex">
                    {{ quizAnswers()[q.id] === q.correctOptionIndex ? 'Correct' : 'Incorrect' }}
                  </span>
                </div>
                <p class="q-txt"><strong>{{ q.questionText }}</strong></p>
                <div class="review-details">
                  <div class="user-ans">Your answer: <em>{{ q.options?.[quizAnswers()[q.id]] }}</em></div>
                  @if (quizAnswers()[q.id] !== q.correctOptionIndex) {
                    <div class="correct-ans">Correct answer: <strong>{{ q.options?.[q.correctOptionIndex || 0] }}</strong></div>
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

  // Storage for active session responses
  public readonly quizAnswers = signal<Record<string, number>>({});
  public readonly quizScore = signal<number>(0);

  // Computed views
  public readonly activeTopicTitle = computed(() => {
    const activeId = this.activeTopicId();
    return this.state.quizTopics.find(t => t.id === activeId)?.title || '';
  });

  public readonly activeQuestions = computed(() => {
    const activeId = this.activeTopicId();
    return this.state.quizQuestions.filter(q => q.topic === activeId);
  });

  public readonly currentQuestion = computed(() => {
    const questions = this.activeQuestions();
    const idx = this.currentQuestionIndex();
    return questions[idx] || null;
  });

  // Action methods
  public getBestScore(topicId: string): number | undefined {
    return this.state.progress().completedQuizzes[topicId];
  }

  public startQuiz(topicId: string): void {
    this.activeTopicId.set(topicId);
    this.currentQuestionIndex.set(0);
    this.selectedOptionIndex.set(null);
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

  public nextQuestion(): void {
    const curQ = this.currentQuestion();
    const selected = this.selectedOptionIndex();

    if (curQ && selected !== null) {
      // Record answer
      const answersMap = { ...this.quizAnswers() };
      answersMap[curQ.id] = selected;
      this.quizAnswers.set(answersMap);

      const nextIdx = this.currentQuestionIndex() + 1;
      const totalQs = this.activeQuestions().length;

      if (nextIdx < totalQs) {
        this.currentQuestionIndex.set(nextIdx);
        this.selectedOptionIndex.set(null);
      } else {
        // Evaluate overall score
        this.evaluateQuizResult();
      }
    }
  }

  private evaluateQuizResult(): void {
    const questions = this.activeQuestions();
    const answers = this.quizAnswers();
    let correctCount = 0;

    questions.forEach(q => {
      if (answers[q.id] === q.correctOptionIndex) {
        correctCount++;
      }
    });

    const percentage = Math.round((correctCount / questions.length) * 100);
    this.quizScore.set(percentage);

    // Save score in state
    this.state.saveQuizScore(this.activeTopicId(), percentage);

    this.activeQuizState.set('result');
  }

  public resetQuizState(): void {
    this.activeQuizState.set('browse');
  }
}
