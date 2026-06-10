import { Component, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { StateService } from '../services/state.service';
import { Concept, Question } from '../models/interview.models';
import {
  allConcepts,
  conceptsForTopic,
  questionsForConcept,
} from '../data/concepts/index';
import {
  orderedConcepts,
  orderedTopicIdsWithConcepts,
  relatedTopicsWithConcepts,
  totalConceptCount,
} from '../data/concepts/learning-path';
import { ConceptRendererComponent } from './renderers/concept-renderer';

type QuizState = 'idle' | 'asking' | 'correct' | 'wrong' | 'open-answered';

@Component({
  selector: 'app-learn',
  imports: [CommonModule, ConceptRendererComponent],
  template: `
    <div class="learn-wrapper fade-in">

      <!-- XP burst overlay -->
      @if (xpBurst()) {
        <div class="xp-burst-overlay" (animationend)="xpBurst.set(null)">
          <div class="xp-burst">{{ xpBurst() }}</div>
        </div>
      }

      <!-- Topic completion celebration -->
      @if (topicCelebration()) {
        <div class="topic-celebration" (animationend)="topicCelebration.set(null)">
          <span class="celebration-emoji">🎉</span>
          <span class="celebration-text">{{ topicCelebration() }} complete!</span>
        </div>
      }

      @if (view() === 'browse') {
        <section class="intro-bar">
          <h1 class="page-title">Learn</h1>
          <p class="page-subtitle">Read the concept first, then prove it. Work through the parts in order — or jump to whatever you need.</p>
        </section>

        <!-- XP / Level / Streak bar -->
        <section class="gamebar panel">
          <div class="gamebar-left">
            <div class="level-badge">Lv {{ state.level() }}</div>
            <div class="xp-col">
              <div class="xp-label-row">
                <span class="xp-label">XP</span>
                <span class="xp-count">{{ state.xp() }} / {{ xpNext() }}</span>
              </div>
              <div class="bar">
                <div class="bar-fill bar-xp" [style.width.%]="xpPct()"></div>
              </div>
            </div>
          </div>
          <div class="gamebar-right">
            <div class="streak-pill" [class.streak-active]="state.streak().count > 0">
              🔥 {{ state.streak().count }} day streak
            </div>
          </div>
        </section>

        @if (totalConcepts > 0) {
          <section class="overall panel">
            <div class="overall-row">
              <span class="overall-label">Your progress</span>
              <span class="overall-count">{{ learnedCount() }} / {{ totalConcepts }} concepts learned</span>
            </div>
            <div class="bar"><div class="bar-fill" [style.width.%]="overallPct()"></div></div>
            @if (resumeConcept(); as rc) {
              <button class="btn btn-primary resume-btn" (click)="openConcept(rc)">
                {{ learnedCount() > 0 ? 'Continue learning' : 'Start learning' }}: {{ rc.title }} →
              </button>
            } @else {
              <p class="all-done">🎉 You've learned every published concept. More topics are on the way.</p>
            }
          </section>
        } @else {
          <p class="empty">No concepts published yet.</p>
        }

        @for (topicId of orderedTopics; track topicId; let i = $index) {
          <section class="topic-group" [class.complete]="topicComplete(topicId)">
            <header class="group-head">
              <div class="group-head-left">
                <span class="part-num">Part {{ i + 1 }}</span>
                <h2 class="group-title">{{ topicTitle(topicId) }}</h2>
              </div>
              <span class="group-progress">
                @if (topicComplete(topicId)) {
                  <span class="badge badge-success">Completed ✓</span>
                } @else {
                  {{ topicLearnedCount(topicId) }}/{{ topicConcepts(topicId).length }} learned
                }
              </span>
            </header>
            <div class="bar slim"><div class="bar-fill" [style.width.%]="topicPct(topicId)"></div></div>

            <div class="concept-grid">
              @for (concept of topicConcepts(topicId); track concept.id) {
                <div class="concept-card panel" [class.learned]="isLearned(concept.id)"
                     (click)="openConcept(concept)" tabindex="0" (keydown.enter)="openConcept(concept)">
                  <div class="card-top">
                    <h3 class="card-title">{{ concept.title }}</h3>
                    @if (isLearned(concept.id)) {
                      <span class="learned-check" title="Learned">
                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                      </span>
                    }
                  </div>
                  <p class="card-summary">{{ concept.summary }}</p>
                  <div class="card-footer">
                    <span class="card-meta">{{ linkedCount(concept.id) }} practice question{{ linkedCount(concept.id) === 1 ? '' : 's' }}</span>
                    <span class="card-xp">+50 XP</span>
                  </div>
                </div>
              }
            </div>
          </section>
        }
      } @else if (view() === 'concept' && activeConcept()) {
        <section class="concept-panel panel slide-in">
          <button class="btn btn-secondary back-btn" (click)="backToBrowse()">← Back to concepts</button>

          <app-concept-renderer [concept]="activeConcept()!"></app-concept-renderer>

          <!-- Inline quiz or Mark-as-learned -->
          @if (quizState() === 'idle') {
            <div class="learned-toggle-row">
              <button class="btn"
                      [class.btn-primary]="!isLearned(activeConcept()!.id)"
                      [class.btn-secondary]="isLearned(activeConcept()!.id)"
                      (click)="onMarkLearned(activeConcept()!)">
                {{ isLearned(activeConcept()!.id) ? '✓ Learned — tap to undo' : 'Mark as learned · +50 XP' }}
              </button>
            </div>
          }

          <!-- MCQ / select-all quiz challenge -->
          @if (quizState() === 'asking' && quizQuestion()) {
            <section class="quiz-challenge panel">
              <div class="quiz-header">
                <span class="quiz-badge">Quick check</span>
                <span class="quiz-xp-hint">Answer correctly for +{{ bonusXp }} XP</span>
              </div>
              <p class="quiz-q">{{ quizQuestion()!.questionText }}</p>

              @if (quizQuestion()!.questionType === 'multiple-choice') {
                <div class="quiz-options">
                  @for (opt of quizQuestion()!.options; track $index; let i = $index) {
                    <button class="quiz-opt" [class.selected]="selectedOption() === i"
                            (click)="selectedOption.set(i)">
                      <span class="opt-letter">{{ optLetter(i) }}</span>
                      <span>{{ opt }}</span>
                    </button>
                  }
                </div>
                <button class="btn btn-primary quiz-submit"
                        [disabled]="selectedOption() === null"
                        (click)="submitMcq()">Submit answer</button>
              }

              @if (quizQuestion()!.questionType === 'open-ended') {
                <textarea class="quiz-textarea" rows="4"
                          [placeholder]="quizQuestion()!.answerPlaceholder || 'Type your answer…'"
                          (input)="openAnswer.set($any($event.target).value)"></textarea>
                <button class="btn btn-primary quiz-submit"
                        [disabled]="openAnswer().trim().length < 10"
                        (click)="submitOpen()">Submit answer</button>
              }
            </section>
          }

          <!-- MCQ result feedback -->
          @if (quizState() === 'correct') {
            <section class="quiz-result correct panel">
              <span class="result-icon">✓</span>
              <div class="result-body">
                <strong>Correct! +{{ bonusXp }} XP earned</strong>
                <p>{{ quizQuestion()!.sampleAnswer }}</p>
              </div>
              <button class="btn btn-primary" (click)="dismissQuiz()">Continue →</button>
            </section>
          }

          @if (quizState() === 'wrong') {
            <section class="quiz-result wrong panel">
              <span class="result-icon">✗</span>
              <div class="result-body">
                <strong>Not quite.</strong>
                <p>{{ quizQuestion()!.sampleAnswer }}</p>
              </div>
              <button class="btn btn-secondary" (click)="dismissQuiz()">Continue</button>
            </section>
          }

          @if (quizState() === 'open-answered') {
            <section class="quiz-result correct panel">
              <span class="result-icon">✓</span>
              <div class="result-body">
                <strong>Answer recorded · +{{ bonusXp }} XP earned</strong>
                <p class="sample-label">Sample answer:</p>
                <p>{{ quizQuestion()!.sampleAnswer }}</p>
              </div>
              <button class="btn btn-primary" (click)="dismissQuiz()">Continue →</button>
            </section>
          }

          @if (linkedQuestions().length) {
            <section class="practice-block">
              <h3 class="block-heading">Practice this</h3>
              <ul class="q-list">
                @for (q of linkedQuestions(); track q.id) {
                  <li class="q-item">
                    <span class="q-text">{{ q.questionText }}</span>
                    <span class="q-badges">
                      <span class="badge badge-topic">{{ q.difficulty }}</span>
                      <span class="badge">{{ q.bloomLevel }}</span>
                    </span>
                  </li>
                }
              </ul>
              <button class="btn btn-primary" (click)="goPractice()">Practice in Skills Matrix →</button>
            </section>
          }

          @if (upNext(); as un) {
            <section class="upnext">
              <span class="block-heading">Up next</span>
              <button class="upnext-card" (click)="openConcept(un.concept)">
                <span class="upnext-text">
                  <span class="upnext-title">{{ un.concept.title }}</span>
                  @if (!un.sameTopic) {
                    <span class="upnext-topic">Next topic · {{ topicTitle(un.concept.topic) }}</span>
                  }
                </span>
                <span class="upnext-arrow">→</span>
              </button>
            </section>
          } @else {
            <p class="all-done">🎉 You've learned every published concept.</p>
          }

          @if (relatedChips().length) {
            <section class="related">
              <span class="block-heading">Related topics</span>
              <div class="chips">
                @for (rt of relatedChips(); track rt) {
                  <button class="chip" (click)="openTopicFirstConcept(rt)">{{ topicTitle(rt) }} →</button>
                }
              </div>
            </section>
          }
        </section>
      }
    </div>
  `,
  styles: [`
    .learn-wrapper {
      max-width: 900px;
      margin: 0 auto;
      position: relative;
    }

    .intro-bar {
      margin-bottom: 28px;
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

    .empty {
      color: var(--text-secondary);
      text-align: center;
    }

    /* XP burst overlay */
    .xp-burst-overlay {
      position: fixed;
      top: 0; left: 0; right: 0; bottom: 0;
      pointer-events: none;
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 999;
    }

    .xp-burst {
      font-size: 3rem;
      font-weight: 900;
      color: var(--color-accent);
      animation: burstPop 1.2s ease-out forwards;
    }

    @keyframes burstPop {
      0%   { transform: scale(0.4); opacity: 1; }
      60%  { transform: scale(1.3); opacity: 1; }
      100% { transform: scale(1.6) translateY(-60px); opacity: 0; }
    }

    /* Topic celebration banner */
    .topic-celebration {
      position: fixed;
      top: 72px;
      left: 50%;
      transform: translateX(-50%);
      display: flex;
      align-items: center;
      gap: 10px;
      background: var(--color-success);
      color: #fff;
      padding: 12px 28px;
      border-radius: 999px;
      font-size: 1.1rem;
      font-weight: 700;
      box-shadow: 0 4px 24px rgba(0,0,0,0.18);
      z-index: 1000;
      animation: celebrationSlide 2.4s ease-out forwards;
      pointer-events: none;
    }

    .celebration-emoji {
      font-size: 1.4rem;
    }

    @keyframes celebrationSlide {
      0%   { opacity: 0; transform: translateX(-50%) translateY(-20px); }
      15%  { opacity: 1; transform: translateX(-50%) translateY(0); }
      75%  { opacity: 1; transform: translateX(-50%) translateY(0); }
      100% { opacity: 0; transform: translateX(-50%) translateY(-16px); }
    }

    /* Gamebar */
    .gamebar {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 20px;
      padding: 16px 20px;
      margin-bottom: 20px;
    }

    .gamebar-left {
      display: flex;
      align-items: center;
      gap: 16px;
      flex: 1;
      min-width: 0;
    }

    .level-badge {
      flex-shrink: 0;
      width: 48px;
      height: 48px;
      border-radius: 50%;
      background: var(--color-accent);
      color: var(--text-on-accent);
      font-size: 0.85rem;
      font-weight: 800;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .xp-col {
      flex: 1;
      min-width: 0;
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
      font-size: 0.78rem;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      color: var(--color-accent);
    }

    .xp-count {
      font-size: 0.82rem;
      font-weight: 600;
      color: var(--text-secondary);
    }

    .bar-xp {
      background: linear-gradient(90deg, var(--color-accent), #a78bfa);
      transition: width 0.6s cubic-bezier(.4,0,.2,1);
    }

    .streak-pill {
      padding: 8px 16px;
      border-radius: 999px;
      border: 1px solid var(--border-color);
      font-size: 0.88rem;
      font-weight: 700;
      color: var(--text-secondary);
      white-space: nowrap;
    }

    .streak-pill.streak-active {
      border-color: #f97316;
      color: #f97316;
      background: rgba(249,115,22,0.08);
    }

    /* Overall progress card */
    .overall {
      margin-bottom: 32px;
      display: flex;
      flex-direction: column;
      gap: 14px;
    }

    .overall-row {
      display: flex;
      justify-content: space-between;
      align-items: baseline;
    }

    .overall-label {
      font-weight: 700;
      font-size: 1.05rem;
    }

    .overall-count {
      color: var(--text-secondary);
      font-size: 0.92rem;
      font-weight: 600;
    }

    .resume-btn {
      align-self: flex-start;
    }

    .all-done {
      color: var(--text-secondary);
      font-size: 0.95rem;
    }

    /* Progress bar */
    .bar {
      height: 8px;
      border-radius: 999px;
      background: var(--bg-input);
      overflow: hidden;
    }

    .bar.slim {
      height: 5px;
      margin-bottom: 16px;
    }

    .bar-fill {
      height: 100%;
      border-radius: 999px;
      background: var(--color-accent);
      transition: width var(--transition-fast);
    }

    /* Topic group */
    .topic-group {
      margin-bottom: 32px;
    }

    .group-head {
      display: flex;
      justify-content: space-between;
      align-items: flex-end;
      margin-bottom: 10px;
    }

    .group-head-left {
      display: flex;
      flex-direction: column;
      gap: 2px;
    }

    .part-num {
      font-size: 0.78rem;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.06em;
      color: var(--color-accent);
    }

    .group-title {
      font-size: 1.3rem;
      font-weight: 700;
    }

    .group-progress {
      font-size: 0.85rem;
      font-weight: 600;
      color: var(--text-secondary);
      flex-shrink: 0;
    }

    .topic-group.complete .group-title {
      color: var(--text-secondary);
    }

    .concept-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 20px;
    }

    .concept-card {
      display: flex;
      flex-direction: column;
      gap: 10px;
      cursor: pointer;
      transition: all var(--transition-fast);
      outline: none;
    }

    .concept-card:hover, .concept-card:focus-visible {
      border-color: var(--color-accent);
      transform: translateY(-2px);
      box-shadow: var(--shadow-sm);
    }

    .concept-card.learned {
      border-color: var(--color-success);
    }

    .card-top {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      gap: 12px;
    }

    .card-title {
      font-size: 1.2rem;
      font-weight: 700;
    }

    .learned-check {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 24px;
      height: 24px;
      border-radius: 50%;
      background: var(--color-success);
      color: var(--text-on-accent);
      flex-shrink: 0;
    }

    .card-summary {
      color: var(--text-secondary);
      font-size: 0.95rem;
      line-height: 1.5;
      flex-grow: 1;
    }

    .card-footer {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .card-meta {
      font-size: 0.82rem;
      font-weight: 600;
      color: var(--text-secondary);
    }

    .card-xp {
      font-size: 0.78rem;
      font-weight: 700;
      color: var(--color-accent);
      background: rgba(var(--color-accent-rgb, 99,102,241), 0.08);
      padding: 2px 8px;
      border-radius: 999px;
    }

    /* Concept detail */
    .concept-panel {
      padding: 40px;
      display: flex;
      flex-direction: column;
      gap: 24px;
    }

    .back-btn {
      align-self: flex-start;
    }

    .learned-toggle-row {
      display: flex;
    }

    .block-heading {
      font-size: 1.05rem;
      font-weight: 700;
      display: block;
      margin-bottom: 8px;
    }

    /* Inline quiz */
    .quiz-challenge {
      border: 2px solid var(--color-accent);
      display: flex;
      flex-direction: column;
      gap: 16px;
    }

    .quiz-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .quiz-badge {
      font-size: 0.78rem;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.06em;
      color: var(--color-accent);
      background: rgba(var(--color-accent-rgb, 99,102,241), 0.1);
      padding: 3px 10px;
      border-radius: 999px;
    }

    .quiz-xp-hint {
      font-size: 0.82rem;
      font-weight: 600;
      color: var(--text-secondary);
    }

    .quiz-q {
      font-size: 1.05rem;
      font-weight: 600;
      line-height: 1.5;
    }

    .quiz-options {
      display: flex;
      flex-direction: column;
      gap: 10px;
    }

    .quiz-opt {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 12px 16px;
      border-radius: var(--radius-sm);
      border: 1px solid var(--border-color);
      background: var(--bg-secondary);
      text-align: left;
      cursor: pointer;
      font-size: 0.95rem;
      transition: all var(--transition-fast);
    }

    .quiz-opt:hover {
      border-color: var(--color-accent);
    }

    .quiz-opt.selected {
      border-color: var(--color-accent);
      background: rgba(var(--color-accent-rgb, 99,102,241), 0.08);
      font-weight: 600;
    }

    .opt-letter {
      width: 24px;
      height: 24px;
      border-radius: 50%;
      border: 1.5px solid var(--border-color);
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 0.8rem;
      font-weight: 700;
      flex-shrink: 0;
    }

    .quiz-opt.selected .opt-letter {
      background: var(--color-accent);
      border-color: var(--color-accent);
      color: var(--text-on-accent);
    }

    .quiz-textarea {
      width: 100%;
      padding: 12px 14px;
      border: 1px solid var(--border-color);
      border-radius: var(--radius-sm);
      background: var(--bg-secondary);
      color: var(--text-primary);
      font-size: 0.95rem;
      line-height: 1.5;
      resize: vertical;
      font-family: inherit;
      box-sizing: border-box;
    }

    .quiz-textarea:focus {
      outline: none;
      border-color: var(--color-accent);
    }

    .quiz-submit {
      align-self: flex-start;
    }

    .quiz-result {
      display: flex;
      align-items: flex-start;
      gap: 16px;
    }

    .quiz-result.correct {
      border-color: var(--color-success);
    }

    .quiz-result.wrong {
      border-color: var(--color-danger);
    }

    .result-icon {
      font-size: 1.4rem;
      font-weight: 900;
      flex-shrink: 0;
      margin-top: 2px;
    }

    .quiz-result.correct .result-icon { color: var(--color-success); }
    .quiz-result.wrong .result-icon   { color: var(--color-danger); }

    .result-body {
      flex: 1;
      display: flex;
      flex-direction: column;
      gap: 6px;
      font-size: 0.95rem;
      line-height: 1.5;
    }

    .sample-label {
      font-size: 0.8rem;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.04em;
      color: var(--text-secondary);
      margin-top: 4px;
    }

    .practice-block, .upnext, .related {
      border-top: 1px solid var(--border-color);
      padding-top: 20px;
    }

    .q-list {
      display: flex;
      flex-direction: column;
      gap: 12px;
      list-style: none;
      padding: 0;
      margin-bottom: 16px;
    }

    .q-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 16px;
      padding: 14px 16px;
      border-radius: var(--radius-sm);
      border: 1px solid var(--border-color);
      background: var(--bg-secondary);
    }

    .q-text {
      font-size: 0.95rem;
      line-height: 1.4;
    }

    .q-badges {
      display: flex;
      gap: 8px;
      flex-shrink: 0;
    }

    /* Up next */
    .upnext-card {
      width: 100%;
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 16px;
      padding: 16px 20px;
      border-radius: var(--radius-md);
      border: 1px solid var(--border-color);
      background: var(--bg-secondary);
      cursor: pointer;
      text-align: left;
      transition: all var(--transition-fast);
    }

    .upnext-card:hover {
      border-color: var(--color-accent);
      transform: translateY(-1px);
      box-shadow: var(--shadow-sm);
    }

    .upnext-text {
      display: flex;
      flex-direction: column;
      gap: 2px;
    }

    .upnext-title {
      font-weight: 700;
      font-size: 1.05rem;
      color: var(--text-primary);
    }

    .upnext-topic {
      font-size: 0.78rem;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.04em;
      color: var(--color-accent);
    }

    .upnext-arrow {
      font-size: 1.3rem;
      color: var(--color-accent);
      flex-shrink: 0;
    }

    /* Related chips */
    .chips {
      display: flex;
      flex-wrap: wrap;
      gap: 10px;
    }

    .chip {
      padding: 8px 14px;
      border-radius: 999px;
      border: 1px solid var(--border-color);
      background: var(--bg-secondary);
      color: var(--text-primary);
      font-size: 0.88rem;
      font-weight: 600;
      cursor: pointer;
      transition: all var(--transition-fast);
    }

    .chip:hover {
      border-color: var(--color-accent);
      color: var(--color-accent);
    }

    @media (max-width: 768px) {
      .concept-grid {
        grid-template-columns: 1fr;
      }
      .concept-panel {
        padding: 24px;
      }
      .q-item {
        flex-direction: column;
        align-items: flex-start;
      }
      .gamebar {
        flex-direction: column;
        align-items: stretch;
      }
      .gamebar-right {
        display: flex;
        justify-content: flex-end;
      }
      .quiz-result {
        flex-direction: column;
      }
    }
  `]
})
export class LearnComponent {
  private readonly state = inject(StateService);
  private readonly router = inject(Router);

  public readonly view = signal<'browse' | 'concept'>('browse');
  public readonly activeConcept = signal<Concept | null>(null);

  // Quiz state
  public readonly quizState = signal<QuizState>('idle');
  public readonly quizQuestion = signal<Question | null>(null);
  public readonly selectedOption = signal<number | null>(null);
  public readonly openAnswer = signal<string>('');
  public readonly bonusXp = 100;

  // Celebration signals
  public readonly xpBurst = signal<string | null>(null);
  public readonly topicCelebration = signal<string | null>(null);

  // Content ordering
  public readonly orderedTopics = orderedTopicIdsWithConcepts();
  public readonly totalConcepts = totalConceptCount();

  private readonly learnedMap = computed(() => this.state.learnedConcepts());

  public readonly learnedCount = computed(() => {
    const m = this.learnedMap();
    return allConcepts.filter(c => !!m[c.id]).length;
  });

  public readonly overallPct = computed(() =>
    this.totalConcepts ? Math.round((this.learnedCount() / this.totalConcepts) * 100) : 0,
  );

  public readonly resumeConcept = computed<Concept | null>(() => {
    const m = this.learnedMap();
    return orderedConcepts().find(c => !m[c.id]) ?? null;
  });

  public readonly linkedQuestions = computed<Question[]>(() => {
    const c = this.activeConcept();
    return c ? questionsForConcept(c.id) : [];
  });

  public readonly upNext = computed<{ concept: Concept; sameTopic: boolean } | null>(() => {
    const c = this.activeConcept();
    if (!c) return null;
    const m = this.learnedMap();
    const sameTopicNext = conceptsForTopic(c.topic).find(x => x.id !== c.id && !m[x.id]);
    if (sameTopicNext) return { concept: sameTopicNext, sameTopic: true };
    const flat = orderedConcepts();
    const pos = flat.findIndex(x => x.id === c.id);
    const after = flat.slice(pos + 1).find(x => !m[x.id]);
    if (after) return { concept: after, sameTopic: after.topic === c.topic };
    const any = flat.find(x => x.id !== c.id && !m[x.id]);
    return any ? { concept: any, sameTopic: any.topic === c.topic } : null;
  });

  public readonly relatedChips = computed<string[]>(() => {
    const c = this.activeConcept();
    return c ? relatedTopicsWithConcepts(c.topic) : [];
  });

  // XP / level helpers
  public xpPct = computed(() => {
    const base = this.state.xpForCurrentLevel();
    const next = this.state.xpForNextLevel();
    return Math.round(((this.state.xp() - base) / next) * 100);
  });

  public xpNext = computed(() => this.state.xpForCurrentLevel() + this.state.xpForNextLevel());

  // Per-topic helpers
  public isLearned(conceptId: string): boolean {
    return !!this.learnedMap()[conceptId];
  }

  public topicConcepts(topicId: string): Concept[] {
    return conceptsForTopic(topicId);
  }

  public topicLearnedCount(topicId: string): number {
    const m = this.learnedMap();
    return conceptsForTopic(topicId).filter(c => !!m[c.id]).length;
  }

  public topicPct(topicId: string): number {
    const total = conceptsForTopic(topicId).length;
    return total ? Math.round((this.topicLearnedCount(topicId) / total) * 100) : 0;
  }

  public topicComplete(topicId: string): boolean {
    const total = conceptsForTopic(topicId).length;
    return total > 0 && this.topicLearnedCount(topicId) === total;
  }

  public linkedCount(conceptId: string): number {
    return questionsForConcept(conceptId).length;
  }

  public topicTitle(topicId: string): string {
    return this.state.quizTopics.find(t => t.id === topicId)?.title || topicId;
  }

  public optLetter(i: number): string {
    return String.fromCharCode(65 + i);
  }

  // Navigation
  public openConcept(concept: Concept): void {
    this.activeConcept.set(concept);
    this.view.set('concept');
    this.quizState.set('idle');
    this.quizQuestion.set(null);
    this.selectedOption.set(null);
    this.openAnswer.set('');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  public openTopicFirstConcept(topicId: string): void {
    const first = conceptsForTopic(topicId)[0];
    if (first) this.openConcept(first);
  }

  public backToBrowse(): void {
    this.view.set('browse');
    this.activeConcept.set(null);
    this.quizState.set('idle');
    this.quizQuestion.set(null);
  }

  public onMarkLearned(concept: Concept): void {
    if (this.isLearned(concept.id)) {
      this.state.toggleConceptLearned(concept.id);
      return;
    }

    // Pick one MCQ or open-ended question linked to this concept for the quiz.
    const candidates = questionsForConcept(concept.id).filter(
      q => (q.questionType === 'multiple-choice' || q.questionType === 'open-ended')
        && q.assessmentEligible
    );

    if (candidates.length > 0) {
      const q = candidates[Math.floor(Math.random() * candidates.length)];
      this.quizQuestion.set(q);
      this.quizState.set('asking');
      this.selectedOption.set(null);
      this.openAnswer.set('');
    } else {
      // No suitable quiz question — just mark and reward.
      this.commitLearned(concept);
    }
  }

  public submitMcq(): void {
    const q = this.quizQuestion();
    const sel = this.selectedOption();
    if (!q || sel === null) return;

    this.state.toggleConceptLearned(q.conceptId!); // mark learned (fires streak + 50 XP)
    const correct = sel === q.correctOptionIndex;
    if (correct) {
      this.state.awardXp(this.bonusXp);
      this.fireXpBurst(`+${50 + this.bonusXp} XP`);
      this.quizState.set('correct');
    } else {
      this.fireXpBurst('+50 XP');
      this.quizState.set('wrong');
    }
    this.checkTopicComplete(q.topic);
  }

  public submitOpen(): void {
    const q = this.quizQuestion();
    if (!q) return;
    this.state.toggleConceptLearned(q.conceptId!);
    this.state.awardXp(this.bonusXp);
    this.fireXpBurst(`+${50 + this.bonusXp} XP`);
    this.quizState.set('open-answered');
    this.checkTopicComplete(q.topic);
  }

  public dismissQuiz(): void {
    this.quizState.set('idle');
    this.quizQuestion.set(null);
    this.selectedOption.set(null);
    this.openAnswer.set('');
  }

  public toggleLearned(concept: Concept): void {
    this.state.toggleConceptLearned(concept.id);
  }

  public goPractice(): void {
    this.router.navigate(['/topic-matrix']);
  }

  private commitLearned(concept: Concept): void {
    this.state.markConceptLearned(concept.id);
    this.fireXpBurst('+50 XP');
    this.checkTopicComplete(concept.topic);
  }

  private fireXpBurst(label: string): void {
    this.xpBurst.set(label);
  }

  private checkTopicComplete(topicId: string): void {
    if (this.topicComplete(topicId)) {
      const title = this.topicTitle(topicId);
      this.topicCelebration.set(title);
    }
  }
}
