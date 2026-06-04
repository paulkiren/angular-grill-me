import { Component, input, output, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Question } from '../../models/interview.models';

@Component({
  selector: 'app-mcq-renderer',
  imports: [CommonModule],
  template: `
    <div class="options-list">
      @for (option of question().options; track $index) {
        <div class="option-card"
             [class.selected]="selectedOptionIndex() === $index"
             (click)="selectOption($index)"
             tabindex="0"
             (keydown.enter)="selectOption($index)"
             (keydown.space)="$event.preventDefault(); selectOption($index)">
          <span class="option-bullet">{{ getOptionLetter($index) }}</span>
          <p class="option-text">{{ option }}</p>
        </div>
      }
    </div>
  `,
  styles: [`
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
      outline: none;
    }

    .option-card:hover, .option-card:focus-visible {
      border-color: var(--border-hover);
      transform: translateY(-1px);
      box-shadow: var(--shadow-sm);
    }

    .option-card:focus-visible {
      border-color: var(--color-accent);
      box-shadow: 0 0 0 3px var(--color-accent-light);
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
  `]
})
export class McqRendererComponent {
  public readonly question = input.required<Question>();
  public readonly value = input<string>();
  public readonly answerChange = output<string>();

  public readonly selectedOptionIndex = computed(() => {
    const val = this.value();
    return val !== undefined && val !== '' ? parseInt(val, 10) : null;
  });

  public selectOption(index: number): void {
    this.answerChange.emit(index.toString());
  }

  public getOptionLetter(index: number): string {
    return String.fromCharCode(65 + index); // A, B, C, D...
  }
}
