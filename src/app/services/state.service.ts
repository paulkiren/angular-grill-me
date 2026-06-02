import { Injectable, signal, computed, effect } from '@angular/core';
import { Question, PlaygroundChallenge, UserProgress, InterviewSession, ChallengeAttempt } from '../models/interview.models';

@Injectable({
  providedIn: 'root'
})
export class StateService {
  // Global Signals
  private readonly _progress = signal<UserProgress>({
    readinessScore: 0,
    completedQuizzes: {},
    completedChallenges: {},
    history: { interviews: [], challenges: [] }
  });

  // Read-only exposing signals
  public readonly progress = computed(() => this._progress());
  public readonly history = computed(() => this._progress().history);
  public readonly readinessScore = computed(() => this._progress().readinessScore);

  // static list of interactive coding challenges
  public readonly challenges: PlaygroundChallenge[] = [
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

  // Static list of topics and their quiz questions
  public readonly quizTopics = [
    {
      id: 'rxjs',
      title: 'RxJS & Reactive Streams',
      description: 'Observables, Operators, Subscription Management, Subjects, and declarative patterns.'
    },
    {
      id: 'signals',
      title: 'Angular Signals',
      description: 'Fine-grained reactivity, signal(), computed(), effect(), and model inputs.'
    },
    {
      id: 'change-detection',
      title: 'Change Detection & Performance',
      description: 'Zone.js, Zoneless, OnPush Strategy, ChangeDetectorRef, and hydration.'
    },
    {
      id: 'di',
      title: 'Dependency Injection (DI)',
      description: 'Hierarchical injection, inject(), InjectionToken, and custom providers.'
    }
  ];

  public readonly quizQuestions: Question[] = [
    // RxJS Topic
    {
      id: 'rx-1',
      topic: 'rxjs',
      title: 'Subject vs BehaviorSubject',
      difficulty: 'Junior',
      questionText: 'What is the key difference between a RxJS Subject and a BehaviorSubject?',
      rubrics: ['initial value', 'last value', 'late subscriber', 'replay'],
      sampleAnswer: 'A Subject does not store a value and only emits values to subscribers that join after the emission. A BehaviorSubject stores the current value, requires an initial value upon creation, and immediately emits its current/last value to any new subscriber.',
      options: [
        'BehaviorSubject does not allow new subscribers, while Subject does.',
        'Subject stores the last emitted value, while BehaviorSubject does not.',
        'BehaviorSubject requires an initial value and immediately replays the last value to new subscribers, whereas Subject does neither.',
        'There is no functional difference; BehaviorSubject is simply newer.'
      ],
      correctOptionIndex: 2,
      timeLimit: 45
    },
    {
      id: 'rx-2',
      topic: 'rxjs',
      title: 'switchMap vs mergeMap vs concatMap',
      difficulty: 'Mid',
      questionText: 'Explain the behavior of switchMap compared to mergeMap and concatMap when a new outer observable item is emitted.',
      rubrics: ['cancel', 'active inner', 'order', 'sequential', 'parallel'],
      sampleAnswer: 'switchMap cancels the previous active inner observable subscription and switches to the new one. mergeMap subscribes to all inner observables in parallel without cancellation. concatMap queues inner observables and executes them sequentially in the order of emission.',
      options: [
        'switchMap processes in parallel, mergeMap cancels active, concatMap runs sequentially.',
        'switchMap cancels the previous active subscription; mergeMap runs inner streams in parallel; concatMap queues them to run sequentially.',
        'concatMap is the only one that supports error handling.',
        'switchMap is used for forms, mergeMap for routing, and concatMap for HTTP requests.'
      ],
      correctOptionIndex: 1,
      timeLimit: 90
    },
    // Signals Topic
    {
      id: 'sig-1',
      topic: 'signals',
      title: 'Signals vs Observables',
      difficulty: 'Mid',
      questionText: 'When would you prefer using Angular Signals over RxJS Observables?',
      rubrics: ['fine-grained', 'synchronous', 'derived state', 'asynchronous', 'streams'],
      sampleAnswer: 'Signals are best for synchronous state tracking, derived calculations (computed), and template rendering due to fine-grained reactivity without Zone.js. Observables are preferred for asynchronous data streams, complex event composition, time-based operations, and side-effects (e.g., HTTP polling, debounce).',
      options: [
        'Always use Signals; Observables are deprecated in Angular 21.',
        'Use Signals for synchronous state and reactive template rendering; use RxJS Observables for async streams, event streams, and time-based operations.',
        'Observables are faster than Signals for simple counter states.',
        'Signals are only used for global routing configuration.'
      ],
      correctOptionIndex: 1,
      timeLimit: 60
    },
    {
      id: 'sig-2',
      topic: 'signals',
      title: 'computed() vs effect()',
      difficulty: 'Junior',
      questionText: 'What is the primary difference in purpose between `computed()` and `effect()` in Angular Signals?',
      rubrics: ['read-only', 'side-effect', 'derive', 'write signal'],
      sampleAnswer: '`computed()` is used to derive a read-only state signal from other signals; it must be pure and return a value. `effect()` is used to run side-effects (e.g., DOM operations, logging) in response to signal changes and must not write to signals unless explicitly allowed.',
      options: [
        'computed() can write to any signal, while effect() is strictly read-only.',
        'effect() is executed at compile time; computed() runs at runtime.',
        'computed() is for pure, synchronous state derivation; effect() is for side-effects like logging or DOM manipulation.',
        'They are exactly identical and interchangeable.'
      ],
      correctOptionIndex: 2,
      timeLimit: 45
    },
    // Change Detection Topic
    {
      id: 'cd-1',
      topic: 'change-detection',
      title: 'OnPush Change Detection',
      difficulty: 'Mid',
      questionText: 'How does the OnPush change detection strategy improve performance in Angular?',
      rubrics: ['input references', 'explicit trigger', 'markForCheck', 'sub-tree', 'immutable'],
      sampleAnswer: 'OnPush limits change detection checks to only when component @Input properties change their reference, when events originate within the component, or when change detection is triggered explicitly (e.g., via markForCheck). This prevents unnecessary rendering of unchanged sub-trees.',
      options: [
        'OnPush disables all JavaScript animations in the component.',
        'It checks the component only when inputs change reference, internal events fire, or when markForCheck() is manually called, skipping unchanged sub-trees.',
        'It forces the component to render on every frame at 60fps.',
        'OnPush removes Zone.js completely from the application automatically.'
      ],
      correctOptionIndex: 1,
      timeLimit: 60
    },
    // DI Topic
    {
      id: 'di-1',
      topic: 'di',
      title: 'inject() vs Constructor Injection',
      difficulty: 'Mid',
      questionText: 'What are the benefits of using the modern `inject()` function over constructor-based injection in Angular?',
      rubrics: ['context', 'inheritance', 'type safety', 'functional', 'cleaner'],
      sampleAnswer: 'The `inject()` function enables injection of dependencies in functional contexts (like route guards, custom RxJS operators, and utility functions), simplifies base class inheritance (no need to call `super(deps)`), and offers excellent type inference.',
      options: [
        'Constructor injection is faster at runtime, but inject() uses less memory.',
        'inject() allows dependency injection outside constructors (guards, functions) and eliminates tedious super() calls in class inheritance.',
        'inject() works on standard plain JavaScript objects without Angular.',
        'Constructor injection is fully deprecated in Angular v21.'
      ],
      correctOptionIndex: 1,
      timeLimit: 60
    }
  ];

  constructor() {
    // Synchronize global progress from localStorage on boot
    const stored = localStorage.getItem('angular_grill_me_progress');
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        this._progress.set(parsed);
      } catch (e) {
        console.warn('Failed to parse stored progress, initializing empty state.');
      }
    }

    // Effect to automatically save progress whenever it changes
    effect(() => {
      localStorage.setItem('angular_grill_me_progress', JSON.stringify(this._progress()));
    });
  }

  // State Mutators
  public saveInterviewSession(session: InterviewSession): void {
    const current = this._progress();
    const updatedInterviews = [
      session,
      ...current.history.interviews.filter(i => i.id !== session.id)
    ];

    // Compute new readiness score
    const newReadiness = this.calculateReadinessScore(updatedInterviews, current.history.challenges);

    this._progress.update(prev => ({
      ...prev,
      readinessScore: newReadiness,
      history: {
        ...prev.history,
        interviews: updatedInterviews
      }
    }));
  }

  public saveChallengeAttempt(attempt: ChallengeAttempt): void {
    const current = this._progress();
    const updatedChallenges = [
      attempt,
      ...current.history.challenges.filter(c => c.challengeId !== attempt.challengeId)
    ];

    const completedChallengesMap = { ...current.completedChallenges };
    if (attempt.isPassed) {
      completedChallengesMap[attempt.challengeId] = true;
    }

    // Compute new readiness score
    const newReadiness = this.calculateReadinessScore(current.history.interviews, updatedChallenges);

    this._progress.update(prev => ({
      ...prev,
      readinessScore: newReadiness,
      completedChallenges: completedChallengesMap,
      history: {
        ...prev.history,
        challenges: updatedChallenges
      }
    }));
  }

  public saveQuizScore(topicId: string, percentage: number): void {
    const current = this._progress();
    const updatedQuizzes = { ...current.completedQuizzes };
    const currentBest = updatedQuizzes[topicId] || 0;
    if (percentage > currentBest) {
      updatedQuizzes[topicId] = percentage;
    }

    // Recalculate readiness
    const mockInterviews = current.history.interviews;
    const mockChallenges = current.history.challenges;
    const newReadiness = this.calculateReadinessScore(mockInterviews, mockChallenges, updatedQuizzes);

    this._progress.update(prev => ({
      ...prev,
      readinessScore: newReadiness,
      completedQuizzes: updatedQuizzes
    }));
  }

  public resetProgress(): void {
    const cleared: UserProgress = {
      readinessScore: 0,
      completedQuizzes: {},
      completedChallenges: {},
      history: { interviews: [], challenges: [] }
    };
    this._progress.set(cleared);
  }

  // Scoring Math
  private calculateReadinessScore(
    interviews: InterviewSession[],
    challenges: ChallengeAttempt[],
    quizzes: Record<string, number> = this._progress().completedQuizzes
  ): number {
    // Breakdown weights:
    // Interviews: 40%
    // Coding Challenges: 40%
    // Topic Quizzes: 20%
    let interviewSum = 0;
    let interviewCount = 0;
    interviews.forEach(session => {
      if (session.isCompleted) {
        interviewSum += session.totalScore;
        interviewCount++;
      }
    });
    const interviewWeight = interviewCount > 0 ? (interviewSum / interviewCount) : 0;

    let challengePassedCount = 0;
    const uniqueChallengeMap = new Map<string, boolean>();
    challenges.forEach(att => {
      const existing = uniqueChallengeMap.get(att.challengeId);
      if (!existing && att.isPassed) {
        uniqueChallengeMap.set(att.challengeId, true);
        challengePassedCount++;
      }
    });
    const totalPlaygroundChallengesCount = this.challenges.length;
    const challengeWeight = totalPlaygroundChallengesCount > 0
      ? (challengePassedCount / totalPlaygroundChallengesCount) * 100
      : 0;

    let quizSum = 0;
    let quizCount = 0;
    Object.keys(quizzes).forEach(key => {
      quizSum += quizzes[key];
      quizCount++;
    });
    const quizWeight = quizCount > 0 ? (quizSum / this.quizTopics.length) : 0;

    const weightedScore = (interviewWeight * 0.40) + (challengeWeight * 0.40) + (quizWeight * 0.20);
    return Math.round(weightedScore);
  }
}
