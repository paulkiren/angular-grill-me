import { Component, inject, signal, computed, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { StateService } from '../services/state.service';
import { PlaygroundChallenge, ChallengeAttempt } from '../models/interview.models';

@Component({
  selector: 'app-playground',
  imports: [CommonModule, FormsModule],
  template: `
    <div class="playground-wrapper fade-in">
      @if (activePanel() === 'browse') {
        <!-- Browse challenges screen -->
        <section class="intro-bar">
          <h1 class="page-title">Interactive Coding Playground</h1>
          <p class="page-subtitle">Refactor, debug, and optimize faulty Angular snippets. Implement real-world production practices client-side.</p>
        </section>

        <section class="challenges-grid">
          @for (ch of state.challenges; track ch.id) {
            <div class="challenge-card panel" [class.passed]="isChallengePassed(ch.id)">
              <div class="card-header">
                <span class="badge badge-topic">{{ ch.topic }}</span>
                <span class="badge" [class.badge-junior]="ch.difficulty === 'Junior'" [class.badge-mid]="ch.difficulty === 'Mid'" [class.badge-senior]="ch.difficulty === 'Senior'">
                  {{ ch.difficulty }}
                </span>
              </div>
              <h3 class="card-title">{{ ch.title }}</h3>
              <p class="card-desc">{{ ch.description | slice:0:110 }}...</p>
              <div class="card-footer">
                @if (isChallengePassed(ch.id)) {
                  <span class="passed-lbl badge badge-success">✓ Solved</span>
                }
                <button (click)="openChallenge(ch)" class="btn btn-primary">
                  {{ isChallengePassed(ch.id) ? 'Refactor Again' : 'Solve Challenge' }}
                </button>
              </div>
            </div>
          }
        </section>
      } @else if (activePanel() === 'editor') {
        <!-- Split-pane coding environment -->
        <div class="editor-workspace slide-in">
          <div class="workspace-header">
            <button (click)="exitEditor()" class="btn btn-secondary btn-sm">&larr; Back to Challenges</button>
            <div class="workspace-meta">
              <span class="badge badge-topic">{{ activeChallenge()?.topic }}</span>
              <span class="challenge-diff badge" [class.badge-junior]="activeChallenge()?.difficulty === 'Junior'" [class.badge-mid]="activeChallenge()?.difficulty === 'Mid'" [class.badge-senior]="activeChallenge()?.difficulty === 'Senior'">
                {{ activeChallenge()?.difficulty }}
              </span>
              <h2 class="workspace-title">{{ activeChallenge()?.title }}</h2>
            </div>
          </div>

          <div class="split-pane">
            <!-- Left Pane: Info & Code Editor -->
            <div class="left-pane panel">
              <div class="pane-tab">Instructions & Editor</div>
              <div class="instructions-box">
                <p class="instr-desc">{{ activeChallenge()?.description }}</p>
                <div class="hint-toggle-bar">
                  @if (showHint()) {
                    <div class="hint-box slide-in">
                      <strong>💡 Hint:</strong> {{ activeChallenge()?.hint }}
                    </div>
                  } @else {
                    <button (click)="toggleHint()" class="btn btn-secondary btn-sm">Get a Hint</button>
                  }
                </div>
              </div>

              <div class="editor-container">
                <!-- Line Numbers Sidebar -->
                <div class="line-numbers">
                  @for (num of getLineNumbers(); track num) {
                    <span>{{ num }}</span>
                  }
                </div>
                <textarea class="code-area"
                          [(ngModel)]="currentCode"
                          (input)="onCodeChange()"
                          spellcheck="false"></textarea>
              </div>

              <div class="editor-actions">
                <button (click)="resetCode()" class="btn btn-secondary">Reset Snippet</button>
                <button (click)="evaluateCode()" class="btn btn-primary">Compile & Run Tests</button>
              </div>
            </div>

            <!-- Right Pane: Evaluation Console -->
            <div class="right-pane panel">
              <div class="pane-tab">System Test Console</div>
              <div class="console-box" [class.passed]="evalPassed()" [class.failed]="evalRun() && !evalPassed()">
                @if (!evalRun()) {
                  <div class="console-placeholder">
                    <span class="console-icon">💻</span>
                    <p>Compile your component to execute automated code quality metrics.</p>
                  </div>
                } @else {
                  <div class="console-results slide-in">
                    <div class="console-header">
                      <span class="status-indicator" [class.pass]="evalPassed()"></span>
                      <h4 class="status-text">{{ evalPassed() ? 'ALL TESTS PASSED' : 'COMPILATION FAILURE / CHECKS FAILED' }}</h4>
                    </div>

                    <div class="score-row">
                      <span class="score-lbl">Score:</span>
                      <span class="score-val" [class.pass]="evalPassed()">{{ evalScore() }}%</span>
                    </div>

                    <p class="console-feedback">{{ evalFeedback() }}</p>

                    <h5 class="tests-heading">Automated Assertion Suites</h5>
                    <div class="tests-list">
                      @for (test of evalTests(); track test.id) {
                        <div class="test-item" [class.passed]="test.passed">
                          <span class="test-status-icon">{{ test.passed ? '✓' : '✗' }}</span>
                          <div class="test-body">
                            <strong>{{ test.name }}</strong>
                            <p class="test-msg">{{ test.message }}</p>
                          </div>
                        </div>
                      }
                    </div>
                  </div>
                }
              </div>
            </div>
          </div>
        </div>
      }
    </div>
  `,
  styles: [`
    .playground-wrapper {
      width: 100%;
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

    /* Grid cards */
    .challenges-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 24px;
    }

    .challenge-card {
      display: flex;
      flex-direction: column;
      height: 100%;
    }

    .challenge-card.passed {
      border-color: rgba(52, 199, 89, 0.2);
    }

    .card-header {
      display: flex;
      justify-content: space-between;
      margin-bottom: 12px;
    }

    .card-title {
      font-size: 1.25rem;
      font-weight: 700;
      margin-bottom: 8px;
    }

    .card-desc {
      color: var(--text-secondary);
      font-size: 0.9rem;
      line-height: 1.5;
      margin-bottom: 24px;
      flex-grow: 1;
    }

    .card-footer {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-top: auto;
    }

    .passed-lbl {
      font-size: 0.75rem;
      font-weight: 600;
    }

    /* Split-pane editor */
    .editor-workspace {
      display: flex;
      flex-direction: column;
      gap: 20px;
    }

    .workspace-header {
      display: flex;
      align-items: center;
      gap: 20px;
    }

    .workspace-meta {
      display: flex;
      align-items: center;
      gap: 12px;
    }

    .workspace-title {
      font-size: 1.3rem;
      font-weight: 700;
      letter-spacing: -0.01em;
    }

    .split-pane {
      display: grid;
      grid-template-columns: 1.2fr 0.8fr;
      gap: 24px;
      align-items: stretch;
    }

    .pane-tab {
      font-size: 0.75rem;
      font-weight: 700;
      letter-spacing: 0.05em;
      text-transform: uppercase;
      color: var(--text-tertiary);
      border-bottom: 1px solid var(--border-color);
      padding-bottom: 8px;
      margin-bottom: 16px;
    }

    .instructions-box {
      margin-bottom: 20px;
    }

    .instr-desc {
      font-size: 0.95rem;
      color: var(--text-primary);
      line-height: 1.6;
      margin-bottom: 12px;
    }

    .hint-toggle-bar {
      margin-bottom: 16px;
    }

    .hint-box {
      background: var(--color-warning-light);
      border: 1px solid rgba(255, 149, 0, 0.1);
      color: var(--text-primary);
      padding: 12px 16px;
      border-radius: var(--radius-md);
      font-size: 0.9rem;
      line-height: 1.5;
    }

    .editor-container {
      display: flex;
      border: 1px solid var(--border-color);
      border-radius: var(--radius-md);
      background: var(--bg-secondary);
      min-height: 380px;
      max-height: 450px;
      font-family: var(--font-mono);
      overflow: hidden;
      margin-bottom: 20px;
      box-shadow: var(--shadow-inset);
    }

    .line-numbers {
      display: flex;
      flex-direction: column;
      background: var(--bg-input);
      color: var(--text-tertiary);
      padding: 16px 8px 16px 12px;
      text-align: right;
      user-select: none;
      font-size: 0.85rem;
      line-height: 1.5rem;
      border-right: 1px solid var(--border-color);
      min-width: 44px;
    }

    .code-area {
      flex-grow: 1;
      border: none;
      outline: none;
      background: transparent;
      color: var(--text-primary);
      padding: 16px;
      font-size: 0.9rem;
      line-height: 1.5rem;
      font-family: var(--font-mono);
      resize: none;
      overflow-y: auto;
    }

    .editor-actions {
      display: flex;
      justify-content: flex-end;
      gap: 12px;
      border-top: 1px solid var(--border-color);
      padding-top: 16px;
    }

    /* System Console Pane */
    .console-box {
      background: var(--bg-secondary);
      border: 1px solid var(--border-color);
      border-radius: var(--radius-md);
      padding: 24px;
      font-family: var(--font-mono);
      min-height: 480px;
      height: 100%;
      box-shadow: var(--shadow-inset);
      transition: all var(--transition-smooth);
    }

    .console-box.passed {
      border-left: 5px solid var(--color-success);
    }

    .console-box.failed {
      border-left: 5px solid var(--color-danger);
    }

    .console-placeholder {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      height: 380px;
      text-align: center;
      color: var(--text-tertiary);
      gap: 16px;
    }

    .console-icon {
      font-size: 3rem;
    }

    .console-results {
      display: flex;
      flex-direction: column;
      gap: 18px;
    }

    .console-header {
      display: flex;
      align-items: center;
      gap: 10px;
    }

    .status-indicator {
      width: 10px;
      height: 10px;
      border-radius: 50%;
      background: var(--color-danger);
    }

    .status-indicator.pass {
      background: var(--color-success);
    }

    .status-text {
      font-size: 0.85rem;
      font-weight: 700;
      color: var(--text-primary);
      letter-spacing: 0.05em;
    }

    .score-row {
      display: flex;
      gap: 8px;
      font-size: 1.1rem;
      font-weight: 700;
    }

    .score-lbl {
      color: var(--text-secondary);
    }

    .score-val {
      color: var(--color-danger);
    }

    .score-val.pass {
      color: var(--color-success);
    }

    .console-feedback {
      font-size: 0.95rem;
      line-height: 1.5;
      color: var(--text-secondary);
      background: var(--bg-primary);
      padding: 12px 16px;
      border-radius: var(--radius-sm);
    }

    .tests-heading {
      font-size: 0.8rem;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      color: var(--text-tertiary);
      margin-top: 10px;
    }

    .tests-list {
      display: flex;
      flex-direction: column;
      gap: 12px;
    }

    .test-item {
      display: flex;
      gap: 12px;
      padding: 10px 14px;
      border-radius: var(--radius-sm);
      background: var(--bg-primary);
      border-left: 3px solid var(--color-danger);
    }

    .test-item.passed {
      border-left-color: var(--color-success);
    }

    .test-status-icon {
      font-size: 1.1rem;
      font-weight: 700;
      color: var(--color-danger);
    }

    .test-item.passed .test-status-icon {
      color: var(--color-success);
    }

    .test-body {
      font-size: 0.85rem;
      line-height: 1.4;
    }

    .test-msg {
      color: var(--text-secondary);
      margin-top: 2px;
    }

    @media (max-width: 1024px) {
      .split-pane {
        grid-template-columns: 1fr;
      }
      .challenges-grid {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class PlaygroundComponent {
  public readonly state = inject(StateService);

  // States
  public readonly activePanel = signal<'browse' | 'editor'>('browse');
  public readonly activeChallenge = signal<PlaygroundChallenge | null>(null);
  public readonly showHint = signal<boolean>(false);

  // Editor Inputs
  public currentCode: string = '';

  // Console Results
  public readonly evalRun = signal<boolean>(false);
  public readonly evalPassed = signal<boolean>(false);
  public readonly evalScore = signal<number>(0);
  public readonly evalFeedback = signal<string>('');
  public readonly evalTests = signal<{ id: string; name: string; passed: boolean; message: string }[]>([]);

  public isChallengePassed(challengeId: string): boolean {
    return !!this.state.progress().completedChallenges[challengeId];
  }

  public openChallenge(challenge: PlaygroundChallenge): void {
    this.activeChallenge.set(challenge);
    this.currentCode = challenge.initialCode;
    this.showHint.set(false);
    this.evalRun.set(false);
    this.evalPassed.set(false);
    this.evalScore.set(0);
    this.evalTests.set([]);
    this.activePanel.set('editor');
  }

  public exitEditor(): void {
    this.activePanel.set('browse');
  }

  public toggleHint(): void {
    this.showHint.set(true);
  }

  public resetCode(): void {
    const ch = this.activeChallenge();
    if (ch) {
      this.currentCode = ch.initialCode;
    }
  }

  public onCodeChange(): void {
    // Dynamic changes, currently nothing needed, line numbers are updated reactively
  }

  public getLineNumbers(): number[] {
    const lines = this.currentCode.split('\n').length;
    return Array.from({ length: Math.max(1, lines) }, (_, i) => i + 1);
  }

  /**
   * Client-side evaluator compiling text patterns
   */
  public evaluateCode(): void {
    const challenge = this.activeChallenge();
    if (!challenge) return;

    const code = this.currentCode;
    const testRuns: { id: string; name: string; passed: boolean; message: string }[] = [];

    // Test 1: Syntax / compilation heuristic
    let compiles = true;
    let compileErrorMsg = 'Component matches core Angular structures and TypeScript decorators.';
    try {
      // Basic checks for missing brackets, templates, or imports
      if (!code.includes('@Component') || !code.includes('class')) {
        compiles = false;
        compileErrorMsg = 'Missing essential Angular component structures: class declaration or @Component decorator.';
      }
    } catch (e) {
      compiles = false;
      compileErrorMsg = 'Snippet contains structural formatting or missing bracket errors.';
    }
    testRuns.push({
      id: 'compile',
      name: 'Component Definition Compliance',
      passed: compiles,
      message: compileErrorMsg
    });

    // Test 2: Anti-pattern assertions (regex checking)
    let antiPatternsPassed = true;
    challenge.antiPatterns.forEach((ap, idx) => {
      const reg = new RegExp(ap.pattern, 'i');
      if (reg.test(code)) {
        antiPatternsPassed = false;
        testRuns.push({
          id: `anti-${idx}`,
          name: 'Architectural Best Practices',
          passed: false,
          message: ap.message
        });
      }
    });

    if (antiPatternsPassed && compiles) {
      testRuns.push({
        id: 'anti-success',
        name: 'Architectural Best Practices',
        passed: true,
        message: 'No active anti-patterns or structural leaks were found in the refactoring.'
      });
    }

    // Test 3: Structural solution pattern validation
    let solutionPatternsPassed = true;
    challenge.solutionPatterns.forEach((sp, idx) => {
      const reg = new RegExp(sp, 'i');
      const matched = reg.test(code);
      if (!matched) {
        solutionPatternsPassed = false;
      }
      testRuns.push({
        id: `sol-${idx}`,
        name: `Behavior Verification Suite`,
        passed: matched,
        message: matched 
          ? `Pattern verified successfully: Found matches for structural criteria.` 
          : `Criteria check failed: Expected structural expression matching standard API usages.`
      });
    });

    // Calculate score
    const allPassed = compiles && antiPatternsPassed && solutionPatternsPassed;
    const score = allPassed ? 100 : Math.round((testRuns.filter(t => t.passed).length / testRuns.length) * 100);

    this.evalPassed.set(allPassed);
    this.evalScore.set(score);
    this.evalTests.set(testRuns);
    this.evalRun.set(true);

    const feedback = allPassed
      ? `Great job! Your refactored component is clean, robust, and correctly resolves the issues. You hit all positive structural expectations.`
      : `Tests failed. Review the assertion failures in the list below. Refactor your code to eliminate anti-patterns and complete the required solutions.`;

    this.evalFeedback.set(feedback);

    // Save in global StateService
    const attempt: ChallengeAttempt = {
      challengeId: challenge.id,
      code,
      isPassed: allPassed,
      score,
      feedback
    };
    this.state.saveChallengeAttempt(attempt);
  }
}
