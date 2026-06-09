import { Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Concept } from '../../models/interview.models';

/**
 * FEAT-001 (v0.3.0 / WS1) — pure presentational read view for a single Concept.
 * No question/quiz logic lives here; orchestration is the LearnComponent's job.
 */
@Component({
  selector: 'app-concept-renderer',
  imports: [CommonModule],
  template: `
    <article class="concept">
      <header class="concept-head">
        <h2 class="concept-title">{{ concept().title }}</h2>
        <span class="since badge">Since Angular {{ concept().sinceVersion }}</span>
      </header>

      <p class="summary">{{ concept().summary }}</p>

      <section class="block">
        @for (para of concept().explanation; track $index) {
          <p class="para">{{ para }}</p>
        }
      </section>

      @if (concept().example) {
        <section class="block">
          <h3 class="block-title">Example</h3>
          <pre class="code-block"><code>{{ concept().example }}</code></pre>
        </section>
      }

      <section class="block why">
        <h3 class="block-title">Why it matters</h3>
        <p class="para">{{ concept().whyItMatters }}</p>
      </section>

      @if (concept().pitfalls.length) {
        <section class="block">
          <h3 class="block-title">Common pitfalls</h3>
          <ul class="pitfalls">
            @for (pitfall of concept().pitfalls; track $index) {
              <li>{{ pitfall }}</li>
            }
          </ul>
        </section>
      }

      @if (concept().docsUrl) {
        <a class="docs-link" [href]="concept().docsUrl" target="_blank" rel="noopener noreferrer">
          Read the official docs
          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
        </a>
      }
    </article>
  `,
  styles: [`
    .concept {
      display: flex;
      flex-direction: column;
      gap: 20px;
    }

    .concept-head {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      gap: 16px;
    }

    .concept-title {
      font-size: 1.7rem;
      font-weight: 800;
      line-height: 1.2;
    }

    .since {
      flex-shrink: 0;
      background: var(--bg-input);
      color: var(--text-secondary);
      font-size: 0.8rem;
      font-weight: 600;
    }

    .summary {
      font-size: 1.15rem;
      font-weight: 600;
      color: var(--text-primary);
      line-height: 1.5;
      padding-left: 14px;
      border-left: 4px solid var(--color-accent);
    }

    .block {
      display: flex;
      flex-direction: column;
      gap: 10px;
    }

    .block-title {
      font-size: 0.85rem;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.04em;
      color: var(--text-secondary);
    }

    .para {
      font-size: 1rem;
      line-height: 1.6;
      color: var(--text-primary);
    }

    .code-block {
      background: var(--bg-primary);
      border: 1px solid var(--border-color);
      border-radius: var(--radius-sm);
      padding: 16px;
      font-family: var(--font-mono);
      font-size: 0.9rem;
      line-height: 1.5;
      white-space: pre;
      overflow-x: auto;
      color: var(--text-primary);
    }

    .why {
      background: var(--bg-secondary);
      border-radius: var(--radius-md);
      padding: 16px 20px;
    }

    .pitfalls {
      display: flex;
      flex-direction: column;
      gap: 8px;
      padding-left: 18px;
    }

    .pitfalls li {
      font-size: 0.98rem;
      line-height: 1.5;
      color: var(--text-primary);
    }

    .pitfalls li::marker {
      color: var(--color-danger);
    }

    .docs-link {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      align-self: flex-start;
      font-weight: 600;
      color: var(--color-accent);
      text-decoration: none;
    }

    .docs-link:hover {
      text-decoration: underline;
    }
  `]
})
export class ConceptRendererComponent {
  public readonly concept = input.required<Concept>();
}
