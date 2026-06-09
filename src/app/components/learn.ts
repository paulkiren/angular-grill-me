import { Component, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { StateService } from '../services/state.service';
import { Concept, Question } from '../models/interview.models';
import {
  allConcepts,
  conceptsForTopic,
  questionsForConcept,
  topicsWithConcepts,
} from '../data/concepts/index';
import { ConceptRendererComponent } from './renderers/concept-renderer';

/**
 * FEAT-001 (v0.3.0 / WS1) — the "Learn before you're tested" surface.
 * Browse concepts grouped by topic, read one, then hand off to the existing
 * Skills Matrix practice flow. No progress/scoring state is touched (learn mode is unscored).
 */
@Component({
  selector: 'app-learn',
  imports: [CommonModule, ConceptRendererComponent],
  template: `
    <div class="learn-wrapper fade-in">
      @if (view() === 'browse') {
        <section class="intro-bar">
          <h1 class="page-title">Learn</h1>
          <p class="page-subtitle">Read the concept first, then practice it. Start here, then head to the Skills Matrix to test yourself.</p>
        </section>

        @if (allConcepts.length === 0) {
          <p class="empty">No concepts published yet.</p>
        }

        @for (topicId of topicIds(); track topicId) {
          <section class="topic-group">
            <h2 class="group-title">{{ topicTitle(topicId) }}</h2>
            <div class="concept-grid">
              @for (concept of conceptsOf(topicId); track concept.id) {
                <div class="concept-card panel" (click)="openConcept(concept)" tabindex="0"
                     (keydown.enter)="openConcept(concept)">
                  <h3 class="card-title">{{ concept.title }}</h3>
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

          @if (linkedQuestions().length) {
            <section class="practice-block">
              <h3 class="practice-title">Practice this</h3>
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

    .empty {
      color: var(--text-secondary);
      text-align: center;
    }

    .topic-group {
      margin-bottom: 32px;
    }

    .group-title {
      font-size: 1.3rem;
      font-weight: 700;
      margin-bottom: 16px;
      padding-bottom: 8px;
      border-bottom: 1px solid var(--border-color);
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

    .card-title {
      font-size: 1.2rem;
      font-weight: 700;
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

    .concept-panel {
      padding: 40px;
      display: flex;
      flex-direction: column;
      gap: 28px;
    }

    .back-btn {
      align-self: flex-start;
    }

    .practice-block {
      display: flex;
      flex-direction: column;
      gap: 14px;
      border-top: 1px solid var(--border-color);
      padding-top: 24px;
    }

    .practice-title {
      font-size: 1.1rem;
      font-weight: 700;
    }

    .q-list {
      display: flex;
      flex-direction: column;
      gap: 12px;
      list-style: none;
      padding: 0;
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

  // expose to template
  public readonly allConcepts = allConcepts;

  public readonly view = signal<'browse' | 'concept'>('browse');
  public readonly activeConcept = signal<Concept | null>(null);

  public readonly topicIds = computed(() => topicsWithConcepts());

  public readonly linkedQuestions = computed<Question[]>(() => {
    const c = this.activeConcept();
    return c ? questionsForConcept(c.id) : [];
  });

  public conceptsOf(topicId: string): Concept[] {
    return conceptsForTopic(topicId);
  }

  public linkedCount(conceptId: string): number {
    return questionsForConcept(conceptId).length;
  }

  public topicTitle(topicId: string): string {
    return this.state.quizTopics.find(t => t.id === topicId)?.title || topicId;
  }

  public openConcept(concept: Concept): void {
    this.activeConcept.set(concept);
    this.view.set('concept');
  }

  public backToBrowse(): void {
    this.view.set('browse');
    this.activeConcept.set(null);
  }

  public goPractice(): void {
    // Slice scope: hand off to the existing practice surface.
    // Deep-linking straight to the linked question is deferred to WS3 (v0.5.0).
    this.router.navigate(['/topic-matrix']);
  }
}
