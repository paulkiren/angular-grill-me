import { Component, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StateService } from '../services/state.service';
import { InterviewSession, ChallengeAttempt } from '../models/interview.models';

@Component({
  selector: 'app-performance',
  imports: [CommonModule],
  template: `
    <div class="performance-wrapper fade-in">
      <section class="intro-bar-actions">
        <div>
          <h1 class="page-title">Performance Analytics</h1>
          <p class="page-subtitle">Examine your historic mock screenings, theoretical diagnostics, and coding metrics.</p>
        </div>
        <button (click)="resetHistory()" class="btn btn-secondary btn-danger-hover">Reset Progress Data</button>
      </section>

      <!-- Grid: Analytics & Recommendation -->
      <div class="analytics-grid">
        <!-- SVG Charts Panel -->
        <div class="chart-panel panel">
          <h3 class="panel-heading">Skills Mastery Breakdown</h3>
          <p class="panel-desc">Calculated scores across essential framework pillars (Quizzes & Interviews).</p>

          <div class="chart-container">
            <svg viewBox="0 0 400 220" class="bar-chart">
              <!-- Y-Axis Grid Lines -->
              <line x1="40" y1="20" x2="380" y2="20" class="grid-line" />
              <line x1="40" y1="60" x2="380" y2="60" class="grid-line" />
              <line x1="40" y1="100" x2="380" y2="100" class="grid-line" />
              <line x1="40" y1="140" x2="380" y2="140" class="grid-line" />
              <line x1="40" y1="180" x2="380" y2="180" class="grid-line" />

              <!-- Y-Axis labels -->
              <text x="30" y="24" class="axis-lbl">100%</text>
              <text x="30" y="64" class="axis-lbl">75%</text>
              <text x="30" y="104" class="axis-lbl">50%</text>
              <text x="30" y="144" class="axis-lbl">25%</text>
              <text x="30" y="184" class="axis-lbl">0%</text>

              <!-- Dynamic Bars representing topics -->
              @for (bar of chartBars(); track bar.topicId) {
                <g class="bar-group">
                  <!-- Active bar fill -->
                  <rect [attr.x]="bar.x"
                        [attr.y]="bar.y"
                        width="36"
                        [attr.height]="bar.height"
                        rx="4"
                        [attr.class]="'bar ' + bar.colorClass" />
                  
                  <!-- Score tool-tip text -->
                  <text [attr.x]="bar.textX"
                        [attr.y]="bar.y - 6"
                        class="bar-val">{{ bar.score }}%</text>
                </g>
              }

              <!-- X-Axis Line -->
              <line x1="40" y1="180" x2="380" y2="180" class="axis-line" />

              <!-- X-Axis labels -->
              @for (bar of chartBars(); track bar.topicId) {
                <text [attr.x]="bar.textX" y="196" class="axis-lbl-x">{{ bar.shortLabel }}</text>
              }
            </svg>
          </div>
        </div>

        <!-- Dynamic Study Suggestions -->
        <div class="suggestions-panel panel">
          <h3 class="panel-heading">Actionable Focus Matrix</h3>
          <p class="panel-desc">Tailored insights computed from your conceptual performance.</p>

          <div class="sugg-list">
            @if (suggestions().length === 0) {
              <div class="empty-sugg">
                <span class="star-icon">⭐️</span>
                <p>Complete topic quizzes or a mock screening to populate your feedback recommendation matrix!</p>
              </div>
            } @else {
              @for (sug of suggestions(); track sug.id) {
                <div class="sugg-card">
                  <div class="sugg-header">
                    <span class="badge" [class.badge-success]="sug.priority === 'Low'" [class.badge-mid]="sug.priority === 'Medium'" [class.badge-senior]="sug.priority === 'High'">
                      {{ sug.priority }} Priority
                    </span>
                    <strong class="sugg-topic">{{ sug.topic }}</strong>
                  </div>
                  <p class="sugg-text">{{ sug.text }}</p>
                </div>
              }
            }
          </div>
        </div>
      </div>

      <!-- Historical Logs section -->
      <section class="history-logs">
        <h2 class="section-heading">Mock Interview Screening Log</h2>
        <div class="table-container panel">
          @if (state.history().interviews.length === 0) {
            <p class="empty-history-txt">You have not completed any mock screening simulator sessions yet.</p>
          } @else {
            <table class="history-table">
              <thead>
                <tr>
                  <th>Session ID</th>
                  <th>Date & Time</th>
                  <th>Difficulty</th>
                  <th>Questions</th>
                  <th>Final Score</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                @for (session of state.history().interviews; track session.id) {
                  <tr>
                    <td><code>{{ session.id }}</code></td>
                    <td>{{ formatTimestamp(session.timestamp) }}</td>
                    <td><span class="badge badge-topic">{{ session.questions[0]?.difficulty || 'Standard' }}</span></td>
                    <td>{{ session.questions.length }} Qs</td>
                    <td>
                      <strong class="history-score" [class.pass]="session.totalScore >= 70" [class.fail]="session.totalScore < 70">
                        {{ session.totalScore }}%
                      </strong>
                    </td>
                    <td>
                      <button (click)="viewSessionDetails(session)" class="btn btn-secondary btn-sm">Inspect</button>
                    </td>
                  </tr>
                }
              </tbody>
            </table>
          }
        </div>
      </section>

      <!-- Code Playground Solved Log -->
      <section class="playground-logs">
        <h2 class="section-heading">Playground Refactoring History</h2>
        <div class="playground-attempts panel">
          @if (state.history().challenges.length === 0) {
            <p class="empty-history-txt">No interactive refactorings have been logged yet.</p>
          } @else {
            <div class="attempt-accordion">
              @for (att of state.history().challenges; track att.challengeId) {
                <div class="attempt-item" [class.expanded]="expandedChallengeId() === att.challengeId">
                  <div class="attempt-summary" (click)="toggleChallengeExpanded(att.challengeId)">
                    <div class="att-meta">
                      <span class="status-dot" [class.pass]="att.isPassed"></span>
                      <strong>{{ getChallengeTitle(att.challengeId) }}</strong>
                    </div>
                    <div class="att-actions">
                      <span class="badge" [class.badge-success]="att.isPassed" [class.badge-danger]="!att.isPassed">
                        {{ att.isPassed ? 'Passed' : 'Failed' }}
                      </span>
                      <span class="expand-arrow">{{ expandedChallengeId() === att.challengeId ? '▲' : '▼' }}</span>
                    </div>
                  </div>

                  @if (expandedChallengeId() === att.challengeId) {
                    <div class="attempt-details slide-in">
                      <p class="att-feedback"><strong>Feedback Summary:</strong> {{ att.feedback }}</p>
                      
                      <div class="code-snapshot">
                        <span class="code-title">Submitted Solution Component:</span>
                        <pre class="code-pre"><code>{{ att.code }}</code></pre>
                      </div>
                    </div>
                  }
                </div>
              }
            </div>
          }
        </div>
      </section>

      <!-- Session Inspector Drawer / Modal -->
      @if (activeInspectSession(); as s) {
        <div class="inspect-backdrop fade-in" (click)="closeSessionInspector()">
          <div class="inspect-drawer slide-in" (click)="$event.stopPropagation()">
            <div class="drawer-header">
              <h3>Screening Diagnostic Overview</h3>
              <button (click)="closeSessionInspector()" class="btn-close-drawer">✕</button>
            </div>

            <div class="drawer-content">
              <div class="drawer-meta panel">
                <div class="meta-row">
                  <span>Session Ref:</span>
                  <code>{{ s.id }}</code>
                </div>
                <div class="meta-row">
                  <span>Scorecard:</span>
                  <strong [class.pass]="s.totalScore >= 70" [class.fail]="s.totalScore < 70">{{ s.totalScore }}%</strong>
                </div>
              </div>

              <div class="drawer-questions">
                @for (q of s.questions; track q.id; let idx = $index) {
                  @let ev = s.evaluations[q.id];
                  <div class="drawer-q-card panel">
                    <h4>Q{{ idx + 1 }}: {{ q.title }}</h4>
                    <p class="q-desc"><em>{{ q.questionText }}</em></p>
                    
                    <div class="q-response-box">
                      <strong>Your Answer:</strong>
                      <p class="ans-text">"{{ s.answers[q.id] }}"</p>
                    </div>

                    @if (ev) {
                      <div class="q-critique">
                        <strong>Critique:</strong>
                        <p>{{ ev.feedback }}</p>
                        
                        <div class="critique-lists">
                          @if (ev.strengths.length > 0) {
                            <div>
                              <strong class="text-success">Strengths:</strong>
                              <ul>
                                @for (st of ev.strengths; track st) {
                                  <li>{{ st }}</li>
                                }
                              </ul>
                            </div>
                          }
                          @if (ev.weaknesses.length > 0) {
                            <div>
                              <strong class="text-danger">Deficiencies:</strong>
                              <ul>
                                @for (we of ev.weaknesses; track we) {
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
              </div>
            </div>
          </div>
        </div>
      }
    </div>
  `,
  styles: [`
    .performance-wrapper {
      display: flex;
      flex-direction: column;
      gap: 36px;
    }

    .intro-bar-actions {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      border-bottom: 1px solid var(--border-color);
      padding-bottom: 24px;
    }

    .btn-danger-hover:hover {
      background: var(--color-danger-light);
      color: var(--color-danger);
      border-color: rgba(255, 59, 48, 0.2);
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

    .section-heading {
      font-size: 1.5rem;
      font-weight: 700;
      margin-bottom: 16px;
    }

    /* Grid Analytics */
    .analytics-grid {
      display: grid;
      grid-template-columns: 1.1fr 0.9fr;
      gap: 28px;
    }

    .panel-heading {
      font-size: 1.3rem;
      font-weight: 700;
      margin-bottom: 4px;
    }

    .panel-desc {
      color: var(--text-secondary);
      font-size: 0.9rem;
      margin-bottom: 20px;
    }

    /* SVG Chart */
    .chart-container {
      display: flex;
      justify-content: center;
      padding: 10px 0;
    }

    .bar-chart {
      width: 100%;
      max-height: 220px;
    }

    .grid-line {
      stroke: var(--border-color);
      stroke-width: 0.8;
      stroke-dasharray: 4,4;
    }

    .axis-line {
      stroke: var(--text-secondary);
      stroke-width: 1.2;
    }

    .axis-lbl {
      fill: var(--text-tertiary);
      font-size: 9px;
      font-family: var(--font-mono);
      text-anchor: end;
      alignment-baseline: middle;
    }

    .axis-lbl-x {
      fill: var(--text-secondary);
      font-size: 10px;
      font-weight: 600;
      text-anchor: middle;
    }

    .bar {
      transition: y 0.5s ease-out, height 0.5s ease-out, fill 0.3s ease;
    }

    .bar.bar-rxjs { fill: #0071e3; }
    .bar.bar-signals { fill: #34c759; }
    .bar.bar-cd { fill: #ff9500; }
    .bar.bar-di { fill: #af52de; }

    .bar-group:hover .bar {
      opacity: 0.85;
      filter: brightness(1.05);
    }

    .bar-val {
      fill: var(--text-primary);
      font-size: 9px;
      font-family: var(--font-mono);
      font-weight: 700;
      text-anchor: middle;
    }

    /* Suggestions List */
    .sugg-list {
      display: flex;
      flex-direction: column;
      gap: 16px;
      overflow-y: auto;
      max-height: 240px;
      padding-right: 4px;
    }

    .empty-sugg {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      height: 160px;
      text-align: center;
      color: var(--text-tertiary);
      gap: 12px;
    }

    .star-icon {
      font-size: 2.2rem;
    }

    .sugg-card {
      background: var(--bg-primary);
      padding: 14px 18px;
      border-radius: var(--radius-md);
      border: 1px solid var(--border-color);
    }

    .sugg-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 8px;
    }

    .sugg-topic {
      font-size: 0.85rem;
      font-weight: 700;
      color: var(--text-primary);
    }

    .sugg-text {
      font-size: 0.9rem;
      color: var(--text-secondary);
      line-height: 1.45;
    }

    /* Tables list */
    .table-container {
      overflow-x: auto;
      padding: 0;
    }

    .empty-history-txt {
      padding: 30px;
      text-align: center;
      color: var(--text-tertiary);
      font-size: 0.95rem;
    }

    .history-table {
      width: 100%;
      border-collapse: collapse;
      text-align: left;
    }

    .history-table th, .history-table td {
      padding: 16px 24px;
      border-bottom: 1px solid var(--border-color);
      font-size: 0.95rem;
    }

    .history-table th {
      background: var(--bg-primary);
      color: var(--text-secondary);
      font-weight: 600;
      font-size: 0.85rem;
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }

    .history-table tbody tr:last-child td {
      border-bottom: none;
    }

    .history-table tbody tr:hover {
      background: rgba(0, 0, 0, 0.01);
    }

    [data-theme="dark"] .history-table tbody tr:hover {
      background: rgba(255, 255, 255, 0.01);
    }

    .history-score {
      font-family: var(--font-mono);
      font-weight: 700;
    }

    .pass { color: var(--color-success); }
    .fail { color: var(--color-danger); }

    /* Accordion Solved Logs */
    .playground-attempts {
      padding: 0;
    }

    .attempt-accordion {
      display: flex;
      flex-direction: column;
    }

    .attempt-item {
      border-bottom: 1px solid var(--border-color);
    }

    .attempt-item:last-child {
      border-bottom: none;
    }

    .attempt-summary {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 20px 24px;
      cursor: pointer;
      user-select: none;
    }

    .attempt-summary:hover {
      background: rgba(0, 0, 0, 0.01);
    }

    [data-theme="dark"] .attempt-summary:hover {
      background: rgba(255, 255, 255, 0.01);
    }

    .att-meta {
      display: flex;
      align-items: center;
      gap: 12px;
    }

    .status-dot {
      width: 8px;
      height: 8px;
      border-radius: 50%;
      background: var(--color-danger);
    }

    .status-dot.pass {
      background: var(--color-success);
    }

    .att-actions {
      display: flex;
      align-items: center;
      gap: 16px;
    }

    .expand-arrow {
      font-size: 0.75rem;
      color: var(--text-tertiary);
    }

    .attempt-details {
      padding: 0 24px 24px 24px;
    }

    .att-feedback {
      font-size: 0.95rem;
      line-height: 1.5;
      color: var(--text-secondary);
      background: var(--bg-primary);
      padding: 12px 16px;
      border-radius: var(--radius-sm);
      margin-bottom: 16px;
    }

    .code-snapshot {
      display: flex;
      flex-direction: column;
      gap: 6px;
    }

    .code-title {
      font-size: 0.8rem;
      font-weight: 700;
      color: var(--text-tertiary);
      text-transform: uppercase;
      letter-spacing: 0.02em;
    }

    .code-pre {
      background: var(--bg-secondary);
      border: 1px solid var(--border-color);
      padding: 16px;
      border-radius: var(--radius-md);
      overflow-x: auto;
      font-family: var(--font-mono);
      font-size: 0.85rem;
      line-height: 1.45;
      box-shadow: var(--shadow-inset);
    }

    /* Inspector Drawer Modal */
    .inspect-backdrop {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(0, 0, 0, 0.4);
      z-index: 2000;
      display: flex;
      justify-content: flex-end;
    }

    .inspect-drawer {
      width: 100%;
      max-width: 580px;
      height: 100%;
      background: var(--bg-secondary);
      border-left: 1px solid var(--border-color);
      box-shadow: var(--shadow-lg);
      display: flex;
      flex-direction: column;
      animation: slideIn var(--transition-smooth);
    }

    .drawer-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 20px 24px;
      border-bottom: 1px solid var(--border-color);
    }

    .btn-close-drawer {
      font-size: 1.25rem;
      color: var(--text-tertiary);
      transition: color var(--transition-fast);
    }

    .btn-close-drawer:hover {
      color: var(--text-primary);
    }

    .drawer-content {
      flex-grow: 1;
      overflow-y: auto;
      padding: 24px;
      display: flex;
      flex-direction: column;
      gap: 20px;
    }

    .drawer-meta {
      display: flex;
      justify-content: space-between;
      padding: 16px 20px;
    }

    .meta-row {
      display: flex;
      flex-direction: column;
      gap: 4px;
    }

    .meta-row span {
      font-size: 0.75rem;
      font-weight: 700;
      color: var(--text-tertiary);
      text-transform: uppercase;
    }

    .meta-row strong {
      font-family: var(--font-mono);
      font-size: 1.6rem;
      font-weight: 800;
    }

    .drawer-questions {
      display: flex;
      flex-direction: column;
      gap: 20px;
    }

    .drawer-q-card {
      border-left: 4px solid var(--color-accent);
    }

    .drawer-q-card h4 {
      font-size: 1.1rem;
      font-weight: 700;
      margin-bottom: 6px;
    }

    .q-desc {
      color: var(--text-secondary);
      font-size: 0.9rem;
      margin-bottom: 14px;
    }

    .q-response-box {
      background: var(--bg-primary);
      padding: 12px 14px;
      border-radius: var(--radius-sm);
      font-size: 0.9rem;
      margin-bottom: 14px;
    }

    .ans-text {
      color: var(--text-secondary);
      margin-top: 4px;
    }

    .q-critique {
      font-size: 0.9rem;
      line-height: 1.45;
    }

    .critique-lists {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 16px;
      margin-top: 10px;
      font-size: 0.85rem;
    }

    .critique-lists ul {
      padding-left: 16px;
      margin-top: 4px;
      color: var(--text-secondary);
    }

    @media (max-width: 900px) {
      .analytics-grid {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class PerformanceComponent {
  public readonly state = inject(StateService);

  // States
  public readonly expandedChallengeId = signal<string | null>(null);
  public readonly activeInspectSession = signal<InterviewSession | null>(null);

  // Dynamic Chart Bars binding Signals
  public readonly chartBars = computed(() => {
    const progress = this.state.progress();
    const completedQuizzes = progress.completedQuizzes;
    
    // Map topics to their scores
    const topics = [
      { id: 'rxjs', label: 'RxJS', colorClass: 'bar-rxjs', shortLabel: 'RxJS', x: 74 },
      { id: 'signals', label: 'Signals', colorClass: 'bar-signals', shortLabel: 'Signals', x: 154 },
      { id: 'change-detection', label: 'Change Det.', colorClass: 'bar-cd', shortLabel: 'Change Det.', x: 234 },
      { id: 'di', label: 'Dep. Inject', colorClass: 'bar-di', shortLabel: 'DI Scopes', x: 314 }
    ];

    return topics.map(t => {
      const score = completedQuizzes[t.id] || 0;
      // SVG Y starts at 20 (100% score) to 180 (0% score). Height range is 0 to 160.
      const height = Math.round((score / 100) * 160);
      const y = 180 - height;
      return {
        topicId: t.id,
        score,
        height,
        y,
        x: t.x,
        textX: t.x + 18,
        colorClass: t.colorClass,
        shortLabel: t.shortLabel
      };
    });
  });

  // Dynamic Study Recommendations logic
  public readonly suggestions = computed(() => {
    const progress = this.state.progress();
    const completedQuizzes = progress.completedQuizzes;
    const list: { id: string; topic: string; text: string; priority: 'High' | 'Medium' | 'Low' }[] = [];

    const topicMetadata = [
      {
        id: 'rxjs',
        name: 'RxJS & Streams',
        sugHigh: 'Review subject emission differences and switchMap unsubscription cancel behaviors in router contexts.',
        sugMed: 'Practice composing stream operators dynamically and using takeUntilDestroyed() for lifecycle hooks.'
      },
      {
        id: 'signals',
        name: 'Signals Reactivity',
        sugHigh: 'Practice writing pure derived computed() state signals and managing side-effects using effect() without writing loops.',
        sugMed: 'Adopt modern signal counters, input models, and signal-based form aggregations.'
      },
      {
        id: 'change-detection',
        name: 'Change Detection',
        sugHigh: 'Familiarize with the OnPush check strategy, skipping unchanged component sub-trees, and manual markForCheck triggers.',
        sugMed: 'Examine zoneless Angular setups and change detection execution profiles.'
      },
      {
        id: 'di',
        name: 'Dependency Injection',
        sugHigh: 'Strengthen InjectionTokens dynamic providers configurations and utilize the modern inject() helper in route guards.',
        sugMed: 'Verify hierarchical element injectors and custom provider overrides.'
      }
    ];

    topicMetadata.forEach(meta => {
      const score = completedQuizzes[meta.id];
      if (score === undefined) {
        list.push({
          id: meta.id,
          topic: meta.name,
          text: `You have not attempted this quiz yet. ${meta.sugHigh}`,
          priority: 'High'
        });
      } else if (score < 60) {
        list.push({
          id: meta.id,
          topic: meta.name,
          text: `Critical review needed: ${meta.sugHigh}`,
          priority: 'High'
        });
      } else if (score < 80) {
        list.push({
          id: meta.id,
          topic: meta.name,
          text: `Solid foundation: ${meta.sugMed}`,
          priority: 'Medium'
        });
      } else {
        list.push({
          id: meta.id,
          topic: meta.name,
          text: 'Mastery achieved! You possess excellent architectural and theoretical knowledge in this domain.',
          priority: 'Low'
        });
      }
    });

    // Sort by priority (High, Medium, Low)
    const priorityWeights = { High: 3, Medium: 2, Low: 1 };
    return [...list].sort((a, b) => priorityWeights[b.priority] - priorityWeights[a.priority]);
  });

  public getChallengeTitle(challengeId: string): string {
    return this.state.challenges.find(c => c.id === challengeId)?.title || challengeId;
  }

  public toggleChallengeExpanded(challengeId: string): void {
    if (this.expandedChallengeId() === challengeId) {
      this.expandedChallengeId.set(null);
    } else {
      this.expandedChallengeId.set(challengeId);
    }
  }

  public viewSessionDetails(session: InterviewSession): void {
    this.activeInspectSession.set(session);
  }

  public closeSessionInspector(): void {
    this.activeInspectSession.set(null);
  }

  public resetHistory(): void {
    if (confirm('Are you sure you want to clear your local assessment history? This will reset all scores and is permanent.')) {
      this.state.resetProgress();
      this.expandedChallengeId.set(null);
      this.activeInspectSession.set(null);
    }
  }

  public formatTimestamp(ts: number): string {
    const d = new Date(ts);
    return d.toLocaleDateString() + ' ' + d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }
}
