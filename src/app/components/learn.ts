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

/**
 * FEAT-001 (v0.3.0 / WS1) — the "Learn before you're tested" surface.
 * Concepts are grouped into ordered "parts" (fullstackopen-style), with per-concept,
 * per-topic and overall completion tracking, a resume button, and "up next" / related
 * encouragement. Completion is an explicit user toggle and does NOT affect Readiness.
 */
@Component({
  selector: 'app-learn',
  imports: [CommonModule, ConceptRendererComponent],
  template: `
    <div class="learn-wrapper fade-in">
      @if (view() === 'browse') {
        <section class="intro-bar">
          <h1 class="page-title">Learn</h1>
          <p class="page-subtitle">Read the concept first, then practice it. Work through the parts in order — or jump to whatever you need.</p>
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
                  <span class="card-meta">{{ linkedCount(concept.id) }} practice question{{ linkedCount(concept.id) === 1 ? '' : 's' }}</span>
                </div>
              }
            </div>
          </section>
        }
      } @else if (view() === 'concept' && activeConcept()) {
        <section class="concept-panel panel slide-in">
          <button class="btn btn-secondary back-btn" (click)="backToBrowse()">← Back to concepts</button>

          <app-concept-renderer [concept]="activeConcept()!"></app-concept-renderer>

          <div class="learned-toggle-row">
            <button class="btn"
                    [class.btn-primary]="!isLearned(activeConcept()!.id)"
                    [class.btn-secondary]="isLearned(activeConcept()!.id)"
                    (click)="toggleLearned(activeConcept()!)">
              {{ isLearned(activeConcept()!.id) ? '✓ Learned — tap to undo' : 'Mark as learned' }}
            </button>
          </div>

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

    /* Topic "part" group */
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

    .card-meta {
      font-size: 0.82rem;
      font-weight: 600;
      color: var(--text-secondary);
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
    }
  `]
})
export class LearnComponent {
  private readonly state = inject(StateService);
  private readonly router = inject(Router);

  public readonly view = signal<'browse' | 'concept'>('browse');
  public readonly activeConcept = signal<Concept | null>(null);

  // Content is static at runtime — compute ordering once.
  public readonly orderedTopics = orderedTopicIdsWithConcepts();
  public readonly totalConcepts = totalConceptCount();

  // Reactive learned-state map (conceptId -> timestamp).
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

    // Prefer the next unlearned concept in the same topic.
    const sameTopicNext = conceptsForTopic(c.topic).find(x => x.id !== c.id && !m[x.id]);
    if (sameTopicNext) return { concept: sameTopicNext, sameTopic: true };

    // Otherwise the next unlearned concept along the ordered path.
    const flat = orderedConcepts();
    const pos = flat.findIndex(x => x.id === c.id);
    const after = flat.slice(pos + 1).find(x => !m[x.id]);
    if (after) return { concept: after, sameTopic: after.topic === c.topic };

    // Fall back to any remaining unlearned concept.
    const any = flat.find(x => x.id !== c.id && !m[x.id]);
    return any ? { concept: any, sameTopic: any.topic === c.topic } : null;
  });

  public readonly relatedChips = computed<string[]>(() => {
    const c = this.activeConcept();
    return c ? relatedTopicsWithConcepts(c.topic) : [];
  });

  // — Per-topic + per-concept helpers (read learnedMap() so they stay reactive) —
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

  // — Navigation / actions —
  public openConcept(concept: Concept): void {
    this.activeConcept.set(concept);
    this.view.set('concept');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  public openTopicFirstConcept(topicId: string): void {
    const first = conceptsForTopic(topicId)[0];
    if (first) this.openConcept(first);
  }

  public backToBrowse(): void {
    this.view.set('browse');
    this.activeConcept.set(null);
  }

  public toggleLearned(concept: Concept): void {
    this.state.toggleConceptLearned(concept.id);
  }

  public goPractice(): void {
    // Slice scope: hand off to the existing practice surface.
    // Deep-linking straight to the linked question is deferred to WS3 (v0.5.0).
    this.router.navigate(['/topic-matrix']);
  }
}
