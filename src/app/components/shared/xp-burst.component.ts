import { Component, input, output } from '@angular/core';

@Component({
  selector: 'app-xp-burst',
  template: `
    @if (label()) {
      <div class="xp-burst-overlay">
        <div class="xp-burst" (animationend)="dismissed.emit()">{{ label() }}</div>
      </div>
    }
  `,
  styles: [`
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
      text-shadow: 0 2px 16px rgba(0,0,0,0.15);
    }

    @keyframes burstPop {
      0%   { transform: scale(0.4); opacity: 1; }
      60%  { transform: scale(1.3); opacity: 1; }
      100% { transform: scale(1.6) translateY(-60px); opacity: 0; }
    }
  `]
})
export class XpBurstComponent {
  public readonly label = input<string | null>(null);
  public readonly dismissed = output<void>();
}
