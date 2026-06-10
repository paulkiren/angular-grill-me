import { Concept } from '../../models/interview.models';

export const componentArchitectureConcepts: Concept[] = [
  {
    id: 'concept-ca-input-output',
    topic: 'component-arch',
    title: 'Signal inputs, outputs, and two-way binding',
    summary: 'Angular 17.1+ input() and output() replace @Input/@Output decorators with a signals-based, type-safe API that integrates with the change detection graph.',
    explanation: [
      'input() creates a signal-based input. input<string>() is optional; input.required<string>() throws a compile-time error if the parent does not bind a value. Unlike @Input, the value is a read-only signal — you read it by calling the signal: this.label(). The component re-renders reactively when the signal changes.',
      'output() replaces @Output + EventEmitter. Call the output\'s .emit(value) method — the result is the same EventEmitter subscription in the parent template but without requiring the class to extend EventEmitter. Combined with outputFromObservable(), it bridges RxJS streams to the output contract.',
      'model() implements two-way binding. The parent binds with [(value)]="prop" — under the hood Angular wires up a [value] input and (valueChange) output. Use model<T>() in form control components where the parent needs to read and write the child\'s value.',
    ],
    example: `@Component({ selector: 'app-rating', ... })
export class RatingComponent {
  // Signal input — reactive read
  maxStars = input<number>(5);
  label    = input.required<string>();

  // Two-way binding
  value = model<number>(0);

  // Output
  hovered = output<number>();

  onHover(star: number) {
    this.hovered.emit(star);
  }
}

// Parent template
<app-rating [(value)]="userRating" label="Score" (hovered)="onHover($event)" />`,
    whyItMatters: 'Signal inputs integrate with the signals change detection graph — Angular knows exactly which components need re-checking without Zone.js diffing the entire tree.',
    pitfalls: [
      'Using input() value as a plain property (this.label instead of this.label()) — it returns the signal object, not the string.',
      'Calling model() on a non-writable scenario — model() signals that the parent can write the value; use input() when the child should not mutate it.',
      'Mixing decorator-based @Input with signal input() on the same component — they work independently but the mixed API is confusing; migrate fully to signal inputs.',
    ],
    docsUrl: 'https://angular.dev/guide/components/inputs',
    sinceVersion: '17.1',
  },
  {
    id: 'concept-ca-lifecycle',
    topic: 'component-arch',
    title: 'Component lifecycle hooks',
    summary: 'Lifecycle hooks are interface methods Angular calls at specific moments: creation, input changes, view init, and destruction.',
    explanation: [
      'ngOnChanges fires first, before ngOnInit, whenever a data-bound input property changes. It receives a SimpleChanges map of previous and current values. Use it to react to @Input changes in NgModule-based components; with signal inputs, use computed() or effect() instead.',
      'ngOnInit fires once after the first ngOnChanges (if any) and after the constructor. The component\'s inputs have their initial values and the dependency injection tree is resolved. This is the right place to make HTTP calls and set up subscriptions.',
      'ngOnDestroy fires just before the component is removed from the DOM. It is the mandatory cleanup hook: unsubscribe from Observables (or let takeUntilDestroyed handle it), clear timers, release resources. ngAfterViewInit fires after the component\'s view and child views are initialised — the first safe moment to access @ViewChild references.',
    ],
    example: `@Component({ ... })
export class TimerComponent implements OnInit, OnDestroy {
  private interval?: ReturnType<typeof setInterval>;

  ngOnInit() {
    this.interval = setInterval(() => this.tick(), 1000);
  }

  ngOnDestroy() {
    clearInterval(this.interval); // always clean up
  }
}`,
    whyItMatters: 'ngOnInit vs constructor is a common interview focus: the constructor should only set up DI. Logic requiring inputs or services that themselves use DI belongs in ngOnInit where Angular guarantees resolution is complete.',
    pitfalls: [
      'Making HTTP calls in the constructor — the constructor runs before inputs are set, so request parameters are often undefined.',
      'Accessing @ViewChild in ngOnInit — the view is not yet initialised; use ngAfterViewInit.',
      'Not implementing OnDestroy when you subscribe manually — the component is removed from the DOM but the subscription (and the component reference it holds) keeps living in memory.',
    ],
    docsUrl: 'https://angular.dev/guide/components/lifecycle',
    sinceVersion: '2.0',
  },
  {
    id: 'concept-ca-content-projection',
    topic: 'component-arch',
    title: 'Content projection — ng-content and named slots',
    summary: 'Content projection lets a parent pass template content into designated slots inside a child component, enabling composable UI like cards, dialogs, and layout shells.',
    explanation: [
      'A single <ng-content> projects all content the parent places between the child component\'s opening and closing tags. This is the simplest form — a card component that accepts any body HTML.',
      'Named slots use the select attribute: <ng-content select="[slot=header]"> matches only elements with the slot="header" attribute. The parent can fill multiple named slots independently. Unmatched content falls back to a default <ng-content> slot if present.',
      'ngProjectAs lets you project a component into a named slot without adding the slot attribute to the projected element directly — useful when projecting third-party components or Angular Material components that you cannot modify.',
    ],
    example: `// Card component with named slots
@Component({
  selector: 'app-card',
  template: \`
    <div class="card">
      <div class="card-header"><ng-content select="[slot=header]"/></div>
      <div class="card-body"><ng-content/></div>
      <div class="card-footer"><ng-content select="[slot=footer]"/></div>
    </div>
  \`
})
export class CardComponent {}

// Usage
<app-card>
  <h2 slot="header">Title</h2>
  <p>Body goes here</p>
  <button slot="footer">Save</button>
</app-card>`,
    whyItMatters: 'Content projection is how Angular component libraries (Material, PrimeNG) provide flexible, composable APIs. Without it, every variant of a card or dialog needs a separate component or an ever-growing inputs API.',
    pitfalls: [
      'Using @ContentChild to access projected content in ngOnInit — it is only available after ngAfterContentInit.',
      'Multiple default <ng-content> slots in one component — only the first one receives content; the rest are ignored.',
      'Trying to project components that have not been imported — standalone components must be listed in the parent\'s imports array even if they are only used as projected content.',
    ],
    docsUrl: 'https://angular.dev/guide/components/content-projection',
    sinceVersion: '2.0',
  },
];
