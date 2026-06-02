import { Component, signal, effect, inject } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { StateService } from './services/state.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  public readonly state = inject(StateService);
  public readonly theme = signal<'light' | 'dark'>('light');

  constructor() {
    // Synchronize default system theme or stored theme on load
    const stored = localStorage.getItem('angular_grill_me_theme') as 'light' | 'dark' | null;
    if (stored) {
      this.theme.set(stored);
    } else {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      this.theme.set(prefersDark ? 'dark' : 'light');
    }

    // Effect to dynamically apply theme token to document
    effect(() => {
      const current = this.theme();
      document.documentElement.setAttribute('data-theme', current);
      localStorage.setItem('angular_grill_me_theme', current);
    });
  }

  public toggleTheme(): void {
    this.theme.update(t => t === 'light' ? 'dark' : 'light');
  }
}
