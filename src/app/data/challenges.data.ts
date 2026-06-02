import { PlaygroundChallenge } from '../models/interview.models';

export const challengesData: PlaygroundChallenge[] = [
  {
    id: 'leak-fix',
    title: 'Fix the RxJS Subscription Memory Leak',
    topic: 'RxJS & Memory Management',
    difficulty: 'Mid',
    description: 'Refactor this component to prevent a memory leak. In modern Angular, the preferred way is to use `takeUntilDestroyed` from `@angular/core/rxjs-interop` or manually manage subscription unsubscriptions using `.unsubscribe()`.',
    initialCode: `import { Component, OnInit } from '@angular/core';
import { interval } from 'rxjs';

@Component({
  selector: 'app-leak-fix',
  template: '<div>Ticks: {{ count }}</div>'
})
export class LeakFixComponent implements OnInit {
  count = 0;

  ngOnInit() {
    interval(1000).subscribe(val => {
      this.count = val;
    });
  }
}`,
    solutionPatterns: [
      'takeUntilDestroyed',
      'unsubscribe'
    ],
    antiPatterns: [
      {
        pattern: 'interval\\(1000\\)\\.subscribe\\((?!.*unsubscribe|.*takeUntilDestroyed).*\\)',
        message: 'You are subscribing to an interval without setting up any unsubscription mechanism.'
      }
    ],
    hint: 'Import `takeUntilDestroyed` from `@angular/core/rxjs-interop` and inject `DestroyRef` or simply call it inside the constructor/initializer context, or save the subscription and call `unsubscribe()` in `ngOnDestroy`.'
  },
  {
    id: 'signal-conversion',
    title: 'Refactor standard Counter to Angular Signals',
    topic: 'Signals',
    difficulty: 'Junior',
    description: 'Refactor this standard counter component to use modern Angular Signals. Change the local state variable to a `signal` and the getter doubleClicks to a `computed` signal. Remember that signal values in templates must be read by calling them as functions (e.g., `mySignal()`).',
    initialCode: `import { Component } from '@angular/core';

@Component({
  selector: 'app-signal-counter',
  template: \`
    <div class="counter-box">
      <button (click)="increment()">Clicks: {{ clicks }}</button>
      <span class="double">Double: {{ doubleClicks }}</span>
    </div>
  \`
})
export class SignalCounterComponent {
  clicks = 0;

  get doubleClicks() {
    return this.clicks * 2;
  }

  increment() {
    this.clicks++;
  }
}`,
    solutionPatterns: [
      'signal\\(0\\)',
      'computed\\(',
      'clicks\\(\\)',
      'doubleClicks\\(\\)'
    ],
    antiPatterns: [
      {
        pattern: 'clicks = 0',
        message: 'You are still declaring clicks as a standard primitive variable instead of a signal.'
      },
      {
        pattern: 'get doubleClicks\\(\\)',
        message: 'Avoid using standard TS getters for reactive derivations when you can use the more performant `computed()` signal.'
      }
    ],
    hint: 'Replace `clicks = 0` with `clicks = signal(0)`, replace `get doubleClicks` with `doubleClicks = computed(() => this.clicks() * 2)`, and update your template bindings to `clicks()` and `doubleClicks()`.'
  },
  {
    id: 'di-token-optimization',
    title: 'Inject dynamic Configuration using InjectionToken',
    topic: 'Dependency Injection',
    difficulty: 'Senior',
    description: 'Refactor this component to inject a custom dynamic API_URL configuration token rather than hardcoding it. Define the injection token `API_URL` and use `@Inject` or `inject()` to assign it.',
    initialCode: `import { Component } from '@angular/core';

@Component({
  selector: 'app-di-opt',
  template: '<div>API URL: {{ apiUrl }}</div>'
})
export class DiOptComponent {
  apiUrl = 'https://api.production.com'; // Hardcoded URL!
}`,
    solutionPatterns: [
      'InjectionToken',
      'inject\\(API_URL\\)',
      'API_URL'
    ],
    antiPatterns: [
      {
        pattern: "apiUrl = 'https://api.production.com'",
        message: 'The API URL is still hardcoded. It should be injected using a dynamic token.'
      }
    ],
    hint: 'Define `export const API_URL = new InjectionToken<string>(\'API_URL\')` and in your class constructor/initializer use `apiUrl = inject(API_URL)`.'
  }
];
