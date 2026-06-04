import { Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Question } from '../../models/interview.models';

@Component({
  selector: 'app-text-renderer',
  imports: [CommonModule],
  template: `
    <div class="open-ended-quiz">
      @if (question().codeSnippet) {
        <pre class="code-snippet"><code>{{ question().codeSnippet }}</code></pre>
      }
      <label class="form-label" for="ans-text">Your answer</label>
      <textarea id="ans-text"
                class="form-input answer-textarea"
                [value]="value() || ''"
                (input)="onInput($event)"
                [placeholder]="question().answerPlaceholder || 'Explain your reasoning in at least 15 characters...'">
      </textarea>
      <p class="input-help">Open-ended questions are scored by concept coverage, not exact wording.</p>
    </div>
  `,
  styles: [`
    .open-ended-quiz {
      display: flex;
      flex-direction: column;
      margin-bottom: 40px;
    }

    .form-label {
      font-size: 0.9rem;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      color: var(--text-secondary);
      margin-bottom: 8px;
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
      margin-top: 4px;
      margin-bottom: 8px;
      outline: none;
      transition: border-color var(--transition-fast), box-shadow var(--transition-fast);
    }

    .answer-textarea:focus {
      border-color: var(--color-accent);
      box-shadow: 0 0 0 3px var(--color-accent-light);
    }

    .code-snippet {
      background: var(--bg-primary);
      border: 1px solid var(--border-color);
      border-radius: var(--radius-sm);
      padding: 16px;
      font-family: var(--font-mono);
      white-space: pre-wrap;
      margin-bottom: 18px;
      overflow-x: auto;
      color: var(--text-primary);
      font-size: 0.9rem;
      line-height: 1.4;
    }

    .input-help {
      font-size: 0.85rem;
      color: var(--text-secondary);
      margin: 0;
    }
  `]
})
export class TextRendererComponent {
  public readonly question = input.required<Question>();
  public readonly value = input<string>();
  public readonly answerChange = output<string>();

  public onInput(event: Event): void {
    const textarea = event.target as HTMLTextAreaElement;
    this.answerChange.emit(textarea.value);
  }
}
