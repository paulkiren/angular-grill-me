import { Component, input, output, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Question } from '../../models/interview.models';

@Component({
  selector: 'app-select-all-renderer',
  imports: [CommonModule],
  template: `
    <div class="options-list">
      @for (option of question().options; track $index) {
        <div class="option-card"
             [class.selected]="isOptionSelected($index)"
             (click)="toggleOption($index)"
             tabindex="0"
             (keydown.enter)="toggleOption($index)"
             (keydown.space)="$event.preventDefault(); toggleOption($index)">
          <div class="checkbox-box">
            @if (isOptionSelected($index)) {
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
            }
          </div>
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

    .checkbox-box {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 22px;
      height: 22px;
      border-radius: 4px;
      border: 2px solid var(--text-secondary);
      background: var(--bg-input);
      color: var(--text-on-accent);
      flex-shrink: 0;
      transition: all var(--transition-fast);
    }

    .option-card.selected .checkbox-box {
      border-color: var(--color-accent);
      background: var(--color-accent);
    }

    .option-text {
      font-size: 1rem;
      font-weight: 500;
      line-height: 1.4;
      color: var(--text-primary);
    }
  `]
})
export class SelectAllRendererComponent {
  public readonly question = input.required<Question>();
  public readonly value = input<string>();
  public readonly answerChange = output<string>();

  public readonly selectedIndexes = computed<number[]>(() => {
    const val = this.value();
    if (!val) {
      return [];
    }
    return val.split(',').map(v => parseInt(v.trim(), 10)).filter(n => !isNaN(n));
  });

  public isOptionSelected(index: number): boolean {
    return this.selectedIndexes().includes(index);
  }

  public toggleOption(index: number): void {
    const current = [...this.selectedIndexes()];
    const idx = current.indexOf(index);
    if (idx > -1) {
      current.splice(idx, 1);
    } else {
      current.push(index);
    }
    
    // Sort selected indices numerically and output as comma-separated string
    const result = current.sort((a, b) => a - b).join(',');
    this.answerChange.emit(result);
  }
}
