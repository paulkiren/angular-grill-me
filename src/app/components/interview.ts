import { Component, inject, signal, computed, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { StateService } from '../services/state.service';
import { EvaluationService } from '../services/evaluation.service';
import { XpBurstComponent } from './shared/xp-burst.component';
import { Question, InterviewSession, EvaluationResult } from '../models/interview.models';

@Component({
  selector: 'app-interview',
  imports: [CommonModule, FormsModule, XpBurstComponent],
  template: `
    <div class="interview-wrapper fade-in">
      @if (sessionState() === 'setup') {
        <!-- Setup Screen -->
        <section class="setup-panel panel slide-in">
          <h1 class="setup-title">♨️ Start a New Mock Interview</h1>
          <p class="setup-desc">Simulate a high-pressure technical screening with a virtual engineering manager. You can choose to use our local rubric engine or add your Gemini API key for dynamic AI evaluations.</p>

          <div class="setup-form">
            <!-- Gemini Key input -->
            <div class="form-group">
              <label class="form-label">Optional: Gemini API Key</label>
              <div class="input-password-wrapper">
                <input [type]="showApiKey() ? 'text' : 'password'"
                       class="form-input"
                       [(ngModel)]="apiKey"
                       placeholder="AI-powered evaluations (stored only in active memory)" />
                <button (click)="toggleShowKey()" class="btn-toggle-visibility">
                  {{ showApiKey() ? '🙈' : '👁️' }}
                </button>
              </div>
              <span class="input-help">If omitted, we use our local high-fidelity diagnostic engine (perfectly offline and fast).</span>
            </div>

            <div class="setup-row">
              <!-- Target Difficulty -->
              <div class="form-group">
                <label class="form-label">Target Difficulty Level</label>
                <select class="form-input" [(ngModel)]="targetDifficulty">
                  <option value="Junior">Junior Developer (Signals, Basic Directives)</option>
                  <option value="Mid">Mid-Level Developer (RxJS, OnPush, Forms)</option>
                  <option value="Senior">Senior Architect (DI tokens, SSR/Hydration, Advanced RxJS)</option>
                </select>
              </div>

              <!-- Questions Count -->
              <div class="form-group">
                <label class="form-label">Grill Count (Number of Questions)</label>
                <select class="form-input" [(ngModel)]="questionLimit">
                  <option [ngValue]="2">2 Questions (Fast Check)</option>
                  <option [ngValue]="3">3 Questions (Standard)</option>
                  <option [ngValue]="5">5 Questions (Deep Drill)</option>
                </select>
              </div>
            </div>

            <div class="setup-actions">
              <button (click)="beginSession()" class="btn btn-primary btn-lg">Launch Interview Simulator</button>
            </div>
          </div>
        </section>
      } @else if (sessionState() === 'interviewing') {
        <!-- Chat Simulator Workspace -->
        <div class="simulator-workspace">
          <div class="workspace-header panel">
            <div class="interviewer-profile">
              <span class="avatar">👨‍💻</span>
              <div class="profile-text">
                <strong class="avatar-name">Marcus</strong>
                <span class="avatar-title">Director of Web Engineering</span>
              </div>
            </div>

            <!-- Global Timer -->
            <div class="question-timer-box" [class.danger]="timeLeft() <= 10">
              <span class="timer-lbl">Time Limit:</span>
              <span class="timer-val">{{ timeLeft() }}s</span>
            </div>

            <div class="question-progress">
              Question {{ currentQuestionIndex() + 1 }} of {{ activeQuestions().length }}
            </div>
          </div>

          <!-- Chat bubble display panel -->
          <div class="chat-container">
            @for (msg of chatLog(); track $index) {
              <div class="chat-bubble" [class.interviewer]="msg.sender === 'interviewer'" [class.candidate]="msg.sender === 'candidate'">
                <div class="bubble-meta">
                  <span>{{ msg.sender === 'interviewer' ? 'Marcus (Interviewer)' : 'You (Candidate)' }}</span>
                  <span>{{ msg.time }}</span>
                </div>
                <p class="bubble-text">{{ msg.text }}</p>

                <!-- Embedded Micro-evaluation if completed -->
                @if (msg.evaluation) {
                  <div class="bubble-eval panel slide-in" [class.pass]="msg.evaluation.score >= 70">
                    <div class="eval-header">
                      <span class="score-pill badge" [class.badge-success]="msg.evaluation.score >= 70" [class.badge-danger]="msg.evaluation.score < 70">
                        Score: {{ msg.evaluation.score }}/100
                      </span>
                      <strong class="eval-title">{{ msg.evaluation.score >= 70 ? 'Strong Answer' : 'Weak Points Identified' }}</strong>
                    </div>
                    <p class="eval-text">{{ msg.evaluation.feedback }}</p>
                    
                    <div class="eval-lists">
                      @if (msg.evaluation.strengths.length > 0) {
                        <div class="eval-sub-list">
                          <strong>✓ Technical Strengths:</strong>
                          <ul>
                            @for (st of msg.evaluation.strengths; track st) {
                              <li>{{ st }}</li>
                            }
                          </ul>
                        </div>
                      }
                      @if (msg.evaluation.weaknesses.length > 0) {
                        <div class="eval-sub-list">
                          <strong>✗ Conceptual Misses:</strong>
                          <ul>
                            @for (we of msg.evaluation.weaknesses; track we) {
                              <li>{{ we }}</li>
                            }
                          </ul>
                        </div>
                      }
                    </div>
                  </div>
                }
              </div>
            }

            @if (isAnalyzing()) {
              <div class="chat-bubble interviewer">
                <div class="bubble-meta">Marcus is thinking...</div>
                <div class="typing-indicator">
                  <span></span><span></span><span></span>
                </div>
              </div>
            }
          </div>

          <!-- Interactive Candidate Input Box -->
          @if (!isAnalyzing()) {
            <div class="input-panel panel slide-in">
              <label class="form-label">Compose your technical answer:</label>
              <textarea class="candidate-text-area"
                        [(ngModel)]="activeAnswer"
                        placeholder="Explain the concepts, architectures, and design patterns. Be as descriptive as possible..."></textarea>
              
              <div class="input-actions">
                <button (click)="terminateInterview()" class="btn btn-secondary">Force Exit</button>
                <button (click)="submitAnswer()" class="btn btn-primary" [disabled]="activeAnswer.trim().length < 5">
                  Submit Technical Answer
                </button>
              </div>
            </div>
          }
        </div>
      } @else if (sessionState() === 'results') {
        <!-- final comprehensive scorecard -->
        <section class="scorecard-panel panel slide-in">
          <div class="scorecard-hero">
            <h1 class="score-title">{{ finalSession()?.totalScore }}%</h1>
            <h2>Interview Feedback Summary</h2>
            <p class="score-desc">Marcus has reviewed your overall technical depth on {{ targetDifficulty }} topics.</p>
            <div class="scorecard-cta">
              <button (click)="exitResults()" class="btn btn-primary">Back to Simulator Dashboard</button>
            </div>
          </div>

          <h3 class="breakdown-heading">Detailed Question Score breakdown</h3>
          <div class="breakdown-list">
            @for (q of finalSession()?.questions; track q.id; let idx = $index) {
              @let ev = finalSession()?.evaluations?.[q.id];
              <div class="breakdown-item panel" [class.passed]="ev && ev.score >= 70">
                <div class="breakdown-header">
                  <span class="breakdown-topic badge badge-topic">{{ q.topic }}</span>
                  <span class="breakdown-score badge" [class.badge-success]="ev && ev.score >= 70" [class.badge-danger]="ev && ev.score < 70">
                    {{ ev ? ev.score : 0 }}/100
                  </span>
                </div>
                <h4 class="breakdown-q-title">Q{{ idx + 1 }}: {{ q.title }}</h4>
                <p class="breakdown-q-text"><em>{{ q.questionText }}</em></p>

                <div class="breakdown-details">
                  <p class="candidate-response"><strong>Your Answer:</strong> "{{ finalSession()?.answers?.[q.id] }}"</p>
                  
                  @if (ev) {
                    <p class="interviewer-feedback"><strong>Critique:</strong> {{ ev.feedback }}</p>
                    <div class="detail-lists">
                      @if (ev.strengths.length > 0) {
                        <div>
                          <strong>Key concepts hit:</strong>
                          <ul class="scorecard-ul text-success">
                            @for (st of ev.strengths; track st) {
                              <li>{{ st }}</li>
                            }
                          </ul>
                        </div>
                      }
                      @if (ev.weaknesses.length > 0) {
                        <div>
                          <strong>Key concepts missed:</strong>
                          <ul class="scorecard-ul text-danger">
                            @for (we of ev.weaknesses; track we) {
                              <li>{{ we }}</li>
                            }
                          </ul>
                        </div>
                      }
                      @if (ev.suggestions.length > 0) {
                        <div class="suggestions-box">
                          <strong>Actionable study recommendations:</strong>
                          <ul class="scorecard-ul">
                            @for (su of ev.suggestions; track su) {
                              <li>💡 {{ su }}</li>
                            }
                          </ul>
                        </div>
                      }
                    </div>
                  }

                  <div class="scorecard-sample">
                    <strong>Interviewer Reference Answer:</strong>
                    <p class="sample-p">{{ q.sampleAnswer }}</p>
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
    .interview-wrapper {
      max-width: 900px;
      margin: 0 auto;
    }

    /* Setup screen */
    .setup-panel {
      padding: 40px;
    }

    .setup-title {
      font-size: 2.2rem;
      font-weight: 800;
      margin-bottom: 12px;
      text-align: center;
    }

    .setup-desc {
      color: var(--text-secondary);
      font-size: 1.1rem;
      line-height: 1.5;
      text-align: center;
      margin-bottom: 36px;
      max-width: 700px;
      margin-left: auto;
      margin-right: auto;
    }

    .setup-form {
      display: flex;
      flex-direction: column;
      gap: 24px;
      max-width: 650px;
      margin: 0 auto;
    }

    .form-group {
      display: flex;
      flex-direction: column;
    }

    .setup-row {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 20px;
    }

    .input-password-wrapper {
      position: relative;
      display: flex;
      align-items: center;
    }

    .btn-toggle-visibility {
      position: absolute;
      right: 12px;
      font-size: 1.1rem;
      color: var(--text-secondary);
      background: none;
      border: none;
    }

    .input-help {
      font-size: 0.8rem;
      color: var(--text-tertiary);
      margin-top: 4px;
    }

    .setup-actions {
      display: flex;
      justify-content: center;
      margin-top: 16px;
    }

    .btn-lg {
      padding: 14px 32px;
      font-size: 1.1rem;
    }

    /* Simulator Chat layout */
    .simulator-workspace {
      display: flex;
      flex-direction: column;
      gap: 20px;
    }

    .workspace-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 16px 24px;
    }

    .interviewer-profile {
      display: flex;
      align-items: center;
      gap: 12px;
    }

    .avatar {
      font-size: 2.2rem;
    }

    .profile-text {
      display: flex;
      flex-direction: column;
    }

    .avatar-name {
      font-size: 1.05rem;
      font-weight: 700;
    }

    .avatar-title {
      font-size: 0.75rem;
      color: var(--text-tertiary);
      font-weight: 600;
      letter-spacing: 0.02em;
      text-transform: uppercase;
    }

    .question-timer-box {
      display: flex;
      align-items: center;
      gap: 6px;
      padding: 6px 16px;
      border-radius: var(--radius-full);
      background: var(--bg-input);
      color: var(--text-primary);
      font-family: var(--font-mono);
      font-weight: 700;
      border: 1px solid var(--border-color);
      transition: all var(--transition-fast);
    }

    .question-timer-box.danger {
      background: var(--color-danger-light);
      color: var(--color-danger);
      border-color: rgba(255, 59, 48, 0.1);
      animation: pulse 1s infinite alternate;
    }

    .timer-lbl {
      font-weight: 500;
      font-size: 0.85rem;
      color: var(--text-secondary);
    }

    .question-progress {
      font-size: 0.9rem;
      font-weight: 600;
      color: var(--text-secondary);
    }

    .chat-container {
      display: flex;
      flex-direction: column;
      gap: 24px;
      background: var(--bg-secondary);
      border: 1px solid var(--border-color);
      border-radius: var(--radius-lg);
      padding: 30px;
      min-height: 350px;
      max-height: 480px;
      overflow-y: auto;
      box-shadow: var(--shadow-inset);
    }

    .chat-bubble {
      display: flex;
      flex-direction: column;
      max-width: 85%;
      animation: fadeIn var(--transition-smooth);
    }

    .chat-bubble.interviewer {
      align-self: flex-start;
    }

    .chat-bubble.candidate {
      align-self: flex-end;
    }

    .bubble-meta {
      font-size: 0.75rem;
      font-weight: 600;
      color: var(--text-tertiary);
      margin-bottom: 6px;
      display: flex;
      gap: 8px;
    }

    .candidate .bubble-meta {
      align-self: flex-end;
    }

    .bubble-text {
      padding: 16px 20px;
      border-radius: var(--radius-lg);
      font-size: 0.98rem;
      line-height: 1.5;
    }

    .interviewer .bubble-text {
      background: var(--bg-primary);
      color: var(--text-primary);
      border-bottom-left-radius: var(--radius-sm);
    }

    .candidate .bubble-text {
      background: var(--color-accent);
      color: var(--text-on-accent);
      border-bottom-right-radius: var(--radius-sm);
    }

    .bubble-eval {
      margin-top: 14px;
      border-left: 4px solid var(--color-danger);
    }

    .bubble-eval.pass {
      border-left-color: var(--color-success);
    }

    .eval-header {
      display: flex;
      align-items: center;
      gap: 12px;
      margin-bottom: 8px;
    }

    .eval-title {
      font-size: 0.95rem;
    }

    .eval-text {
      font-size: 0.9rem;
      color: var(--text-secondary);
      line-height: 1.45;
      margin-bottom: 12px;
    }

    .eval-lists {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 16px;
    }

    .eval-sub-list {
      font-size: 0.85rem;
    }

    .eval-sub-list ul {
      padding-left: 16px;
      margin-top: 4px;
      color: var(--text-secondary);
    }

    .typing-indicator {
      display: flex;
      align-items: center;
      gap: 4px;
      padding: 16px 20px;
      border-radius: var(--radius-lg);
      background: var(--bg-primary);
      width: 70px;
    }

    .typing-indicator span {
      width: 6px;
      height: 6px;
      background: var(--text-tertiary);
      border-radius: 50%;
      animation: bounce 1.3s infinite;
    }

    .typing-indicator span:nth-child(2) { animation-delay: 0.15s; }
    .typing-indicator span:nth-child(3) { animation-delay: 0.3s; }

    /* Input area */
    .input-panel {
      padding: 24px;
    }

    .candidate-text-area {
      width: 100%;
      height: 110px;
      padding: 16px;
      border-radius: var(--radius-md);
      border: 1px solid var(--border-color);
      background: var(--bg-secondary);
      color: var(--text-primary);
      outline: none;
      font-family: var(--font-body);
      font-size: 0.98rem;
      line-height: 1.5;
      resize: none;
      margin-bottom: 16px;
      transition: all var(--transition-fast);
    }

    .candidate-text-area:focus {
      border-color: var(--color-accent);
      box-shadow: 0 0 0 4px var(--color-accent-light);
    }

    .input-actions {
      display: flex;
      justify-content: space-between;
    }

    /* Scorecard final screen */
    .scorecard-panel {
      padding: 40px;
    }

    .scorecard-hero {
      display: flex;
      flex-direction: column;
      align-items: center;
      text-align: center;
      border-bottom: 1px solid var(--border-color);
      padding-bottom: 32px;
      margin-bottom: 32px;
    }

    .score-title {
      font-family: var(--font-heading);
      font-size: 5rem;
      font-weight: 800;
      color: var(--color-accent);
      line-height: 1;
      margin-bottom: 12px;
    }

    .score-desc {
      color: var(--text-secondary);
      font-size: 1.1rem;
      margin-top: 6px;
      margin-bottom: 24px;
    }

    .breakdown-heading {
      font-size: 1.4rem;
      font-weight: 700;
      margin-bottom: 20px;
    }

    .breakdown-list {
      display: flex;
      flex-direction: column;
      gap: 24px;
    }

    .breakdown-item {
      border-left: 5px solid var(--color-danger);
    }

    .breakdown-item.passed {
      border-left-color: var(--color-success);
    }

    .breakdown-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 12px;
    }

    .breakdown-q-title {
      font-size: 1.15rem;
      font-weight: 700;
      margin-bottom: 6px;
    }

    .breakdown-q-text {
      color: var(--text-secondary);
      font-size: 0.95rem;
      margin-bottom: 20px;
    }

    .breakdown-details {
      display: flex;
      flex-direction: column;
      gap: 16px;
      font-size: 0.95rem;
      border-top: 1px solid var(--border-color);
      padding-top: 16px;
    }

    .candidate-response {
      color: var(--text-primary);
      background: var(--bg-primary);
      padding: 12px 16px;
      border-radius: var(--radius-sm);
    }

    .interviewer-feedback {
      line-height: 1.5;
    }

    .detail-lists {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 20px;
    }

    .suggestions-box {
      grid-column: span 2;
      background: var(--color-accent-light);
      padding: 16px;
      border-radius: var(--radius-md);
      border: 1px solid rgba(41, 151, 255, 0.1);
    }

    .scorecard-ul {
      padding-left: 20px;
      margin-top: 6px;
      line-height: 1.6;
    }

    .text-success { color: var(--color-success); }
    .text-danger { color: var(--color-danger); }

    .scorecard-sample {
      background: var(--bg-primary);
      padding: 16px;
      border-radius: var(--radius-md);
    }

    .sample-p {
      color: var(--text-secondary);
      margin-top: 6px;
      line-height: 1.5;
    }

    @keyframes bounce {
      0%, 100% { transform: translateY(0); }
      50% { transform: translateY(-6px); }
    }

    @keyframes pulse {
      from { box-shadow: 0 0 0 0 rgba(255, 59, 48, 0.3); }
      to { box-shadow: 0 0 0 8px rgba(255, 59, 48, 0); }
    }

    @media (max-width: 768px) {
      .setup-panel, .scorecard-panel { padding: 24px; }
      .setup-row { grid-template-columns: 1fr; }
      .eval-lists, .detail-lists { grid-template-columns: 1fr; }
      .suggestions-box { grid-column: span 1; }
      .score-title { font-size: 4rem; }
    }
  `]
})
export class InterviewComponent {
  public readonly state = inject(StateService);
  private readonly evalService = inject(EvaluationService);

  // Configuration States
  public readonly sessionState = signal<'setup' | 'interviewing' | 'results'>('setup');
  public readonly showApiKey = signal<boolean>(false);
  public apiKey: string = '';
  public targetDifficulty: 'Junior' | 'Mid' | 'Senior' = 'Mid';
  public questionLimit: number = 3;

  // Active Session Tracks
  public readonly activeQuestions = signal<Question[]>([]);
  public readonly currentQuestionIndex = signal<number>(0);
  public readonly timeLeft = signal<number>(60);
  public readonly chatLog = signal<{ sender: 'interviewer' | 'candidate'; text: string; time: string; evaluation?: EvaluationResult }[]>([]);
  
  public activeAnswer: string = '';
  public readonly isAnalyzing = signal<boolean>(false);
  
  // Storage arrays matching our model
  private activeAnswers: Record<string, string> = {};
  private activeEvaluations: Record<string, EvaluationResult> = {};
  private activeSessionId: string = '';

  // Final scorecard session
  public readonly finalSession = signal<InterviewSession | null>(null);

  private timerInterval: any = null;

  constructor() {
    // Clean up timer if destroyed
    effect(() => {
      return () => this.clearTimer();
    });
  }

  public toggleShowKey(): void {
    this.showApiKey.update(v => !v);
  }

  public beginSession(): void {
    // Filter questions matching target difficulty
    let pool = this.state.quizQuestions.filter(q => q.difficulty === this.targetDifficulty);
    
    // Fallback if not enough questions
    if (pool.length === 0) {
      pool = this.state.quizQuestions;
    }

    // Shuffle and pick limit
    const picked = [...pool].sort(() => 0.5 - Math.random()).slice(0, this.questionLimit);
    this.activeQuestions.set(picked);

    // Initialize session state variables
    this.currentQuestionIndex.set(0);
    this.activeAnswers = {};
    this.activeEvaluations = {};
    this.activeSessionId = 'int-' + Date.now();
    this.chatLog.set([]);

    // Open chat
    this.sessionState.set('interviewing');

    // Marcus asks the first question
    this.speakFirstQuestion();
  }

  private speakFirstQuestion(): void {
    const q = this.activeQuestions()[0];
    if (q) {
      this.isAnalyzing.set(true);
      setTimeout(() => {
        const welcomeMsg = `Welcome to the interview. My name is Marcus, and I'll be assessing your frontend expertise today. Let's start with a core concept.\n\nHere is your first question:\n${q.questionText}`;
        
        this.chatLog.set([{
          sender: 'interviewer',
          text: welcomeMsg,
          time: this.getFormattedTime()
        }]);
        this.isAnalyzing.set(false);
        this.resetTimer(q.timeLimit);
      }, 1200);
    }
  }

  public async submitAnswer(): Promise<void> {
    const qIndex = this.currentQuestionIndex();
    const questions = this.activeQuestions();
    const q = questions[qIndex];
    const answer = this.activeAnswer;

    if (!q || !answer.trim()) return;

    this.clearTimer();

    // Log candidate's response in chat
    const updatedChat = [...this.chatLog(), {
      sender: 'candidate' as const,
      text: answer,
      time: this.getFormattedTime()
    }];
    this.chatLog.set(updatedChat);

    this.activeAnswers[q.id] = answer;
    this.activeAnswer = '';

    // Trigger analysis loader
    this.isAnalyzing.set(true);

    try {
      // Evaluate response
      const evaluation = await this.evalService.evaluateAnswer(q, answer, this.apiKey);
      this.activeEvaluations[q.id] = evaluation;

      // Log interviewer's critique bubble
      this.isAnalyzing.set(false);

      const responseWithEval = [...this.chatLog()];
      // Attach the evaluation outcome inside the candidate's chat bubble
      const lastBubbleIdx = responseWithEval.length - 1;
      responseWithEval[lastBubbleIdx] = {
        ...responseWithEval[lastBubbleIdx],
        evaluation
      };
      this.chatLog.set(responseWithEval);

      // Move to next question or complete interview
      const nextIdx = qIndex + 1;
      if (nextIdx < questions.length) {
        this.isAnalyzing.set(true);
        setTimeout(() => {
          const nextQ = questions[nextIdx];
          const transitions = [
            `Excellent. Let's transition to the next topic.`,
            `Thanks for that explanation. Let's move on.`,
            `Understood. Let's shift our focus a bit.`,
            `Good. Let's look at another core area.`
          ];
          const randomTrans = transitions[Math.floor(Math.random() * transitions.length)];
          
          this.chatLog.set([...this.chatLog(), {
            sender: 'interviewer',
            text: `${randomTrans}\n\nQuestion ${nextIdx + 1}:\n${nextQ.questionText}`,
            time: this.getFormattedTime()
          }]);
          
          this.isAnalyzing.set(false);
          this.currentQuestionIndex.set(nextIdx);
          this.resetTimer(nextQ.timeLimit);
        }, 2000);
      } else {
        // Complete the mock session
        this.isAnalyzing.set(true);
        setTimeout(() => {
          this.isAnalyzing.set(false);
          this.concludeInterview();
        }, 1500);
      }

    } catch (e) {
      this.isAnalyzing.set(false);
      console.error(e);
    }
  }

  private concludeInterview(): void {
    const questions = this.activeQuestions();
    let sum = 0;
    questions.forEach(q => {
      sum += this.activeEvaluations[q.id]?.score || 0;
    });
    const avgScore = Math.round(sum / questions.length);

    const session: InterviewSession = {
      id: this.activeSessionId,
      timestamp: Date.now(),
      questions: this.activeQuestions(),
      currentQuestionIndex: this.currentQuestionIndex(),
      answers: this.activeAnswers,
      evaluations: this.activeEvaluations,
      isCompleted: true,
      totalScore: avgScore
    };

    // Save history
    this.state.saveInterviewSession(session);

    this.finalSession.set(session);
    this.sessionState.set('results');
  }

  public terminateInterview(): void {
    this.clearTimer();
    this.sessionState.set('setup');
  }

  public exitResults(): void {
    this.sessionState.set('setup');
  }

  // Helper Timer Controls
  private resetTimer(seconds: number): void {
    this.clearTimer();
    this.timeLeft.set(seconds);
    this.timerInterval = setInterval(() => {
      const remaining = this.timeLeft() - 1;
      if (remaining <= 0) {
        this.timeLeft.set(0);
        this.clearTimer();
        // Time ran out! Auto submit whatever candidate wrote or submit blank
        if (!this.activeAnswer.trim()) {
          this.activeAnswer = 'No response provided within the given question time limit.';
        }
        this.submitAnswer();
      } else {
        this.timeLeft.set(remaining);
      }
    }, 1000);
  }

  private clearTimer(): void {
    if (this.timerInterval) {
      clearInterval(this.timerInterval);
      this.timerInterval = null;
    }
  }

  private getFormattedTime(): string {
    const d = new Date();
    return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }
}
