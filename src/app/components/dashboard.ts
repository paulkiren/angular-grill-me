import { Component, inject, computed } from '@angular/core';
import { RouterLink } from '@angular/router';
import { StateService } from '../services/state.service';
import { XpBurstComponent } from './shared/xp-burst.component';

@Component({
  selector: 'app-dashboard',
  imports: [RouterLink, XpBurstComponent],
  template: `
    <div class="dashboard-wrapper fade-in">
      <!-- Stats / Gamification HUD -->
      <section class="gamebar panel">
        <div class="gamebar-level">
          <div class="level-badge">Lv {{ state.level() }}</div>
          <div class="xp-col">
            <div class="xp-label-row">
              <span class="xp-label">XP</span>
              <span class="xp-count">{{ state.xp() }} · Next level at {{ xpNext() }}</span>
            </div>
            <div class="xp-bar-track">
              <div class="xp-bar-fill" [style.width.%]="xpPct()"></div>
            </div>
          </div>
        </div>
        <div class="gamebar-stats">
          <div class="hud-stat">
            <span class="hud-val">{{ mockInterviewsCount() }}</span>
            <span class="hud-lbl">Interviews</span>
          </div>
          <div class="hud-stat">
            <span class="hud-val">{{ challengesCount() }}</span>
            <span class="hud-lbl">Challenges</span>
          </div>
          <div class="hud-stat">
            <span class="hud-val">{{ quizzesCount() }}</span>
            <span class="hud-lbl">Quizzes</span>
          </div>
          <div class="hud-stat">
            <span class="hud-val streak-val" [class.active]="state.streak().count > 0">
              🔥 {{ state.streak().count }}
            </span>
            <span class="hud-lbl">Day streak</span>
          </div>
        </div>
      </section>

      <!-- Hero Welcome Banner -->
      <section class="hero-section panel">
        <div class="hero-grid">
          <div class="hero-text">
            <h1 class="hero-title">Prepare for your next Angular interview.</h1>
            <p class="hero-subtitle">Grill your skills in RxJS, Signals, Dependency Injection, and modern frontend architecture. Track your readiness and receive real-time structural feedback.</p>
            <div class="hero-cta">
              <a routerLink="/interview" class="btn btn-primary">Start Mock Interview</a>
              <a routerLink="/topic-matrix" class="btn btn-secondary">Skills Matrix</a>
            </div>
          </div>
          <div class="readiness-gauge">
            <div class="gauge-circle">
              <svg viewBox="0 0 36 36" class="circular-chart">
                <path class="circle-bg"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
                <path class="circle"
                  [style.stroke-dasharray]="state.readinessScore() + ', 100'"
                  [class.mid]="state.readinessScore() >= 50 && state.readinessScore() < 80"
                  [class.high]="state.readinessScore() >= 80"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
                <text x="18" y="20.35" class="percentage">{{ state.readinessScore() }}%</text>
              </svg>
            </div>
            <span class="gauge-label">Interview Readiness</span>
          </div>
        </div>
      </section>


      <!-- Core Features Hub -->
      <section class="features-hub">
        <h2 class="section-heading">Interactive Assessment Modules</h2>
        <div class="features-grid">
          <!-- Card 1: Interview Simulator -->
          <div class="feature-card panel" routerLink="/interview">
            <div class="feature-header">
              <span class="feature-icon">🎙️</span>
              <h3 class="feature-title">Mock Interview Simulator</h3>
            </div>
            <p class="feature-desc">Engage with our conversational AI interviewer. Receive real-time assessment scores and a breakdown of matched concepts, missed terminology, and improvement rubrics.</p>
            <span class="feature-link">Launch Simulator &rarr;</span>
          </div>

          <!-- Card 2: Topic Quizzes -->
          <div class="feature-card panel" routerLink="/topic-matrix">
            <div class="feature-header">
              <span class="feature-icon">🧩</span>
              <h3 class="feature-title">Topic Matrix & Quizzes</h3>
            </div>
            <p class="feature-desc">Test your theoretical and architectural knowledge on core Angular concepts. Practice Signals, Change Detection strategies, and Dependency Injection scopes.</p>
            <span class="feature-link">Browse Matrix &rarr;</span>
          </div>

          <!-- Card 3: Code Playground -->
          <div class="feature-card panel" routerLink="/playground">
            <div class="feature-header">
              <span class="feature-icon">💻</span>
              <h3 class="feature-title">Interactive Code Playground</h3>
            </div>
            <p class="feature-desc">Refactor and optimize faulty Angular code. Fix memory leaks in RxJS subscriptions, convert getters to Signals, and define providers via InjectionTokens.</p>
            <span class="feature-link">Open Playground &rarr;</span>
          </div>
        </div>
      </section>

      <!-- Focus Recommendations -->
      @if (focusAreas().length > 0) {
        <section class="focus-section panel">
          <h3 class="focus-title">💡 Focus Recommendations</h3>
          <p class="focus-desc">Based on your assessment scores, we recommend strengthening your knowledge in the following areas:</p>
          <div class="focus-list">
            @for (area of focusAreas(); track area.id) {
              <div class="focus-item">
                <span class="focus-dot"></span>
                <div class="focus-text">
                  <strong>{{ area.title }}</strong> - {{ area.desc }}
                </div>
                <a routerLink="/topic-matrix" class="btn btn-secondary btn-sm">Review Quiz</a>
              </div>
            }
          </div>
        </section>
      }
    </div>
  `,
  styles: [`
    .dashboard-wrapper {
      display: flex;
      flex-direction: column;
      gap: 32px;
    }

    /* Gamification HUD */
    .gamebar {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 24px;
      padding: 16px 24px;
      flex-wrap: wrap;
    }

    .gamebar-level {
      display: flex;
      align-items: center;
      gap: 16px;
      flex: 1;
      min-width: 220px;
    }

    .level-badge {
      flex-shrink: 0;
      width: 52px;
      height: 52px;
      border-radius: 50%;
      background: var(--color-accent);
      color: var(--text-on-accent);
      font-size: 0.88rem;
      font-weight: 800;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .xp-col {
      flex: 1;
      display: flex;
      flex-direction: column;
      gap: 6px;
    }

    .xp-label-row {
      display: flex;
      justify-content: space-between;
      align-items: baseline;
    }

    .xp-label {
      font-size: 0.75rem;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.06em;
      color: var(--color-accent);
    }

    .xp-count {
      font-size: 0.8rem;
      font-weight: 600;
      color: var(--text-secondary);
    }

    .xp-bar-track {
      height: 8px;
      border-radius: 999px;
      background: var(--bg-input);
      overflow: hidden;
    }

    .xp-bar-fill {
      height: 100%;
      border-radius: 999px;
      background: linear-gradient(90deg, var(--color-accent), #a78bfa);
      transition: width 0.7s cubic-bezier(.4,0,.2,1);
    }

    .gamebar-stats {
      display: flex;
      gap: 28px;
      flex-shrink: 0;
    }

    .hud-stat {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 2px;
    }

    .hud-val {
      font-size: 1.5rem;
      font-weight: 800;
      color: var(--color-accent);
      line-height: 1;
    }

    .hud-val.streak-val {
      color: var(--text-secondary);
    }

    .hud-val.streak-val.active {
      color: #f97316;
    }

    .hud-lbl {
      font-size: 0.75rem;
      font-weight: 600;
      color: var(--text-secondary);
      text-transform: uppercase;
      letter-spacing: 0.04em;
    }

    .hero-section {
      padding: 40px;
    }

    .hero-grid {
      display: grid;
      grid-template-columns: 2fr 1fr;
      align-items: center;
      gap: 40px;
    }

    .hero-title {
      font-size: 2.8rem;
      line-height: 1.15;
      margin-bottom: 16px;
      font-weight: 800;
    }

    .hero-subtitle {
      font-size: 1.15rem;
      color: var(--text-secondary);
      line-height: 1.6;
      margin-bottom: 24px;
    }

    .hero-cta {
      display: flex;
      gap: 12px;
    }

    .readiness-gauge {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
    }

    .gauge-circle {
      width: 160px;
      height: 160px;
    }

    .circular-chart {
      display: block;
      margin: 0 auto;
      max-width: 100%;
      max-height: 100%;
    }

    .circle-bg {
      fill: none;
      stroke: var(--bg-input);
      stroke-width: 2.5;
    }

    .circle {
      fill: none;
      stroke: var(--color-danger);
      stroke-width: 2.8;
      stroke-linecap: round;
      transition: stroke-dasharray 0.8s ease-in-out, stroke 0.5s ease;
    }

    .circle.mid {
      stroke: var(--color-warning);
    }

    .circle.high {
      stroke: var(--color-success);
    }

    .percentage {
      font-family: var(--font-heading);
      fill: var(--text-primary);
      font-size: 8px;
      font-weight: 700;
      text-anchor: middle;
    }

    .gauge-label {
      font-size: 0.9rem;
      font-weight: 600;
      color: var(--text-secondary);
      margin-top: 12px;
    }


    /* Features Hub */
    .section-heading {
      font-size: 1.6rem;
      font-weight: 700;
      margin-bottom: 20px;
    }

    .features-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 24px;
    }

    .feature-card {
      display: flex;
      flex-direction: column;
      cursor: pointer;
      height: 100%;
    }

    .feature-header {
      display: flex;
      align-items: center;
      gap: 12px;
      margin-bottom: 12px;
    }

    .feature-icon {
      font-size: 1.8rem;
    }

    .feature-title {
      font-size: 1.2rem;
      font-weight: 600;
    }

    .feature-desc {
      font-size: 0.95rem;
      color: var(--text-secondary);
      line-height: 1.5;
      flex-grow: 1;
      margin-bottom: 20px;
    }

    .feature-link {
      font-size: 0.9rem;
      font-weight: 600;
      color: var(--color-accent);
      margin-top: auto;
    }

    /* Focus Recommendations */
    .focus-section {
      border-left: 4px solid var(--color-warning);
    }

    .focus-title {
      font-size: 1.25rem;
      margin-bottom: 8px;
    }

    .focus-desc {
      color: var(--text-secondary);
      font-size: 0.95rem;
      margin-bottom: 16px;
    }

    .focus-list {
      display: flex;
      flex-direction: column;
      gap: 12px;
    }

    .focus-item {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 8px 0;
      border-bottom: 1px solid var(--border-color);
    }

    .focus-dot {
      width: 8px;
      height: 8px;
      border-radius: 50%;
      background: var(--color-warning);
    }

    .focus-text {
      font-size: 0.95rem;
      flex-grow: 1;
    }

    .btn-sm {
      padding: 6px 12px;
      font-size: 0.8rem;
    }

    @media (max-width: 900px) {
      .hero-grid {
        grid-template-columns: 1fr;
        gap: 30px;
        text-align: center;
      }
      .hero-cta {
        justify-content: center;
      }
      .features-grid {
        grid-template-columns: 1fr;
      }
      .stats-grid {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class DashboardComponent {
  public readonly state = inject(StateService);

  public readonly mockInterviewsCount = computed(() =>
    this.state.history().interviews.filter(i => i.isCompleted).length
  );

  public readonly challengesCount = computed(() =>
    this.state.history().challenges.filter(c => c.isPassed).length
  );

  public readonly quizzesCount = computed(() =>
    Object.keys(this.state.progress().completedQuizzes).length
  );

  public readonly xpPct = computed(() => {
    const base = this.state.xpForCurrentLevel();
    const size = this.state.xpForNextLevel();
    return Math.min(100, Math.round(((this.state.xp() - base) / size) * 100));
  });

  public readonly xpNext = computed(() =>
    this.state.xpForCurrentLevel() + this.state.xpForNextLevel()
  );

  public readonly focusAreas = computed(() => {
    const quizzes = this.state.progress().completedQuizzes;
    const areas: { id: string; title: string; desc: string }[] = [];

    this.state.quizTopics.forEach(topic => {
      const score = quizzes[topic.id];
      // Low score (< 70%) or uncompleted quizzes are marked for focus
      if (score === undefined || score < 70) {
        areas.push({
          id: topic.id,
          title: topic.title,
          desc: score !== undefined ? `Scored ${score}% (Needs review)` : 'Not yet attempted'
        });
      }
    });

    return areas;
  });
}
