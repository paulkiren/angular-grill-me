import { Concept } from '../../models/interview.models';

export const changeDetectionConcepts: Concept[] = [
  {
    id: 'concept-cd-default-vs-onpush',
    topic: 'change-detection',
    title: 'Default vs OnPush change detection',
    summary: 'Default checks every component on every browser event; OnPush checks a component only when its inputs change, an event fires inside it, or it is explicitly marked dirty.',
    explanation: [
      'In Default mode Angular runs change detection starting from the root after every asynchronous browser event (click, setTimeout, HTTP response). It walks the entire component tree and re-evaluates every binding. This is simple but wasteful for large trees.',
      'OnPush tells Angular to skip a subtree unless one of three things happens: an @Input reference changes (shallow equality), an event originates inside the component, or the component is explicitly marked with markForCheck(). Because most components are leaf nodes that only update on input changes, OnPush can cut re-check cycles dramatically.',
      'With signals, Angular\'s scheduler marks only the specific components whose signal dependencies changed — a finer granularity than even OnPush. This is the foundation of zoneless Angular.',
    ],
    example: `@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: \`{{ item().name }}\`
})
export class ItemComponent {
  item = input.required<Item>(); // OnPush: re-checks when item reference changes
}`,
    whyItMatters: 'OnPush is the first performance lever available in Angular. A large dashboard where every tile re-checks on every mouse move is a noticeable source of jank that OnPush eliminates for free.',
    pitfalls: [
      'Mutating an object in-place (array.push(), obj.prop = x) rather than creating a new reference — OnPush sees the same reference and skips the component despite the change.',
      'Using Default strategy with signals — signals work best with OnPush or zoneless; Default wastes cycles re-checking components whose signal dependencies have not changed.',
      'Forgetting that OnPush still re-checks when any DOM event fires inside the component — it is not "never re-check", just "skip unless triggered".',
    ],
    docsUrl: 'https://angular.dev/best-practices/skipping-subtrees',
    sinceVersion: '2.0',
  },
  {
    id: 'concept-cd-change-detector-ref',
    topic: 'change-detection',
    title: 'markForCheck() vs detectChanges()',
    summary: 'markForCheck schedules a future check for an OnPush component by marking its ancestors dirty; detectChanges runs a synchronous check immediately on the current component subtree.',
    explanation: [
      'markForCheck() walks up to the root and marks every ancestor view as dirty, scheduling them for Angular\'s next change detection pass. It does not run detection immediately. Use it when you mutate state from outside Angular\'s zone — a WebSocket message, a third-party callback — and want to re-render on the next tick.',
      'detectChanges() runs change detection synchronously right now on the component and its children. It does not depend on Zone.js. Use it in tests (fixture.detectChanges()) or when you need the DOM updated before reading a measurement (getBoundingClientRect). In production code, prefer markForCheck() unless you have a concrete reason for synchronous flushing.',
      'ApplicationRef.tick() is the nuclear option — it runs change detection on the entire application tree synchronously. Rarely needed outside bootstrapping or server-side rendering.',
    ],
    example: `@Component({ changeDetection: ChangeDetectionStrategy.OnPush })
export class LiveFeedComponent implements OnInit {
  constructor(private cdr: ChangeDetectorRef, private ws: WebSocketService) {}

  ngOnInit() {
    this.ws.messages$.subscribe(msg => {
      this.latestMessage = msg;
      this.cdr.markForCheck(); // schedule re-check on next CD pass
    });
  }
}`,
    whyItMatters: 'Calling detectChanges() in a loop, or markForCheck() inside a tight stream, are common causes of performance regressions. Understanding the difference lets you pick the cheaper option.',
    pitfalls: [
      'Calling detectChanges() after every state change inside a loop — each call is synchronous and creates O(n) CD cycles.',
      'Using markForCheck() when you need an immediate DOM update (e.g., before a measurement) — it only schedules, so the measurement will read the stale layout.',
      'Holding a ChangeDetectorRef after the view is destroyed — the reference becomes invalid and throws.',
    ],
    docsUrl: 'https://angular.dev/api/core/ChangeDetectorRef',
    sinceVersion: '2.0',
  },
  {
    id: 'concept-cd-zoneless',
    topic: 'change-detection',
    title: 'Zoneless Angular',
    summary: 'Zoneless mode removes the Zone.js dependency so Angular only runs change detection when signals or explicit scheduler calls indicate a change.',
    explanation: [
      'Zone.js patches all browser async APIs (setTimeout, Promises, event listeners) to notify Angular after every callback so it can run change detection. This "always on" approach works everywhere but runs unnecessarily even when nothing changed, adds ~100 kB (minified+gzip: ~14 kB), and makes debugging harder by obscuring stack traces.',
      'Zoneless Angular, enabled with provideZonelessChangeDetection() (stable in Angular 18), removes that patching. Change detection only fires when a signal is written, markForCheck() is called, or AsyncPipe receives a new emission. Components must use signals or explicitly trigger detection — passive setTimeout without a signal write no longer re-renders anything.',
      'Migrating to zoneless is incremental. Start with NOOP_ZONE (provideZoneChangeDetection({ eventCoalescing: true })) to coalesce events, then move to provideZonelessChangeDetection() and convert component state to signals.',
    ],
    example: `// app.config.ts
import { provideZonelessChangeDetection } from '@angular/core';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZonelessChangeDetection(), // replaces Zone.js entirely
    provideRouter(routes),
  ]
};`,
    whyItMatters: 'Zoneless unlocks server-side rendering performance (no Zone patching on Node), Web Workers (Zone cannot run there), and significantly smaller bundle sizes for library authors.',
    pitfalls: [
      'Calling setTimeout or setInterval to update state without wrapping the write in a signal or markForCheck() — the DOM silently stays stale.',
      'Third-party libraries that depend on Zone.js being present — they may break or need a wrapper service to bridge their callbacks back into Angular\'s scheduler.',
      'Mixing Zone.js and zoneless providers — only one can be active; mixing causes undefined scheduler behaviour.',
    ],
    docsUrl: 'https://angular.dev/guide/experimental/zoneless',
    sinceVersion: '18.0',
  },
];
