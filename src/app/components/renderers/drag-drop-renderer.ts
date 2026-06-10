import { Component, input, output, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Question } from '../../models/interview.models';

@Component({
  selector: 'app-drag-drop-renderer',
  imports: [CommonModule],
  template: `
    <p class="dnd-instructions">Drag the items into the correct order.</p>
    <div class="dnd-list">
      @for (originalIdx of orderedIndexes(); track originalIdx; let pos = $index) {
        <div class="dnd-item"
             draggable="true"
             [class.is-dragging]="draggingPos() === pos"
             [class.is-over]="dragOverPos() === pos"
             (dragstart)="onDragStart(pos)"
             (dragover)="$event.preventDefault(); onDragOver(pos)"
             (dragleave)="onDragLeave()"
             (drop)="onDrop(pos)"
             (dragend)="onDragEnd()">
          <span class="dnd-handle" aria-hidden="true">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <circle cx="9" cy="5" r="1"/><circle cx="15" cy="5" r="1"/>
              <circle cx="9" cy="12" r="1"/><circle cx="15" cy="12" r="1"/>
              <circle cx="9" cy="19" r="1"/><circle cx="15" cy="19" r="1"/>
            </svg>
          </span>
          <span class="dnd-position">{{ pos + 1 }}</span>
          <p class="dnd-text">{{ question().options![originalIdx] }}</p>
        </div>
      }
    </div>
  `,
  styles: [`
    .dnd-instructions {
      font-size: 0.875rem;
      color: var(--text-secondary);
      margin-bottom: 16px;
    }

    .dnd-list {
      display: flex;
      flex-direction: column;
      gap: 10px;
      margin-bottom: 40px;
    }

    .dnd-item {
      display: flex;
      align-items: center;
      padding: 14px 16px;
      border-radius: var(--radius-md);
      border: 1px solid var(--border-color);
      background: var(--bg-secondary);
      cursor: grab;
      transition: all var(--transition-fast);
      gap: 14px;
      user-select: none;
    }

    .dnd-item:hover {
      border-color: var(--border-hover);
      box-shadow: var(--shadow-sm);
    }

    .dnd-item.is-dragging {
      opacity: 0.4;
      cursor: grabbing;
    }

    .dnd-item.is-over {
      border-color: var(--color-accent);
      background: var(--color-accent-light);
      transform: translateY(-2px);
      box-shadow: var(--shadow-sm);
    }

    .dnd-handle {
      display: flex;
      align-items: center;
      color: var(--text-secondary);
      flex-shrink: 0;
    }

    .dnd-position {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 26px;
      height: 26px;
      border-radius: 50%;
      background: var(--bg-input);
      color: var(--text-secondary);
      font-weight: 600;
      font-size: 0.8rem;
      flex-shrink: 0;
      transition: all var(--transition-fast);
    }

    .dnd-item.is-over .dnd-position {
      background: var(--color-accent);
      color: var(--text-on-accent);
    }

    .dnd-text {
      font-size: 1rem;
      font-weight: 500;
      line-height: 1.4;
      color: var(--text-primary);
    }
  `]
})
export class DragDropRendererComponent {
  public readonly question = input.required<Question>();
  public readonly value = input<string>();
  public readonly answerChange = output<string>();

  private readonly _draggingPos = signal<number | null>(null);
  private readonly _dragOverPos = signal<number | null>(null);

  public readonly draggingPos = this._draggingPos.asReadonly();
  public readonly dragOverPos = this._dragOverPos.asReadonly();

  public readonly orderedIndexes = computed<number[]>(() => {
    const val = this.value();
    const opts = this.question().options;
    if (!opts || opts.length === 0) return [];
    if (val && val.trim()) {
      return val.split(',').map(v => parseInt(v.trim(), 10)).filter(n => !isNaN(n));
    }
    return opts.map((_, i) => i);
  });

  public onDragStart(pos: number): void {
    this._draggingPos.set(pos);
  }

  public onDragOver(pos: number): void {
    this._dragOverPos.set(pos);
  }

  public onDragLeave(): void {
    this._dragOverPos.set(null);
  }

  public onDrop(toPos: number): void {
    const fromPos = this._draggingPos();
    if (fromPos === null || fromPos === toPos) {
      this._dragOverPos.set(null);
      return;
    }
    const current = [...this.orderedIndexes()];
    const [moved] = current.splice(fromPos, 1);
    current.splice(toPos, 0, moved);
    this.answerChange.emit(current.join(','));
    this._dragOverPos.set(null);
  }

  public onDragEnd(): void {
    this._draggingPos.set(null);
    this._dragOverPos.set(null);
  }
}
