import { Concept } from '../../models/interview.models';

export const directivesPipesConcepts: Concept[] = [
  {
    id: 'concept-directives-attribute-vs-structural',
    topic: 'directives-pipes',
    title: 'Attribute vs structural directives',
    summary: 'Attribute directives modify the appearance or behaviour of an existing element; structural directives change the DOM structure by adding, removing, or replacing elements.',
    explanation: [
      'Attribute directives are the simpler form: they attach to a host element and alter it — changing styles (NgStyle, NgClass), adding/removing CSS classes, or responding to host events. They do not add or remove DOM nodes. You write them with @Directive and inject ElementRef or HostListener to interact with the host.',
      'Structural directives receive a TemplateRef and ViewContainerRef and use them to stamp (createEmbeddedView) or clear (clear()) the template into the DOM. The * syntax is sugar: *ngIf="show" expands to [ngIf]="show" on an <ng-template> host. Angular 17+ replaces NgIf/NgFor/NgSwitch with the built-in @if, @for, and @switch control flow, which are not directives at all — they are template syntax.',
      'Custom structural directives follow the same pattern: inject TemplateRef<any> and ViewContainerRef, then call vcr.createEmbeddedView(this.template) or vcr.clear() based on your input.',
    ],
    example: `// Attribute directive — adds/removes a CSS class based on a condition
@Directive({ selector: '[appHighlight]', standalone: true })
export class HighlightDirective {
  @HostBinding('class.highlight') isHighlighted = false;
  @HostListener('mouseenter') onEnter() { this.isHighlighted = true; }
  @HostListener('mouseleave') onLeave() { this.isHighlighted = false; }
}

// Structural directive — conditionally stamps a template
@Directive({ selector: '[appFeatureFlag]', standalone: true })
export class FeatureFlagDirective {
  constructor(private tpl: TemplateRef<any>, private vcr: ViewContainerRef) {}
  @Input() set appFeatureFlag(enabled: boolean) {
    enabled ? this.vcr.createEmbeddedView(this.tpl) : this.vcr.clear();
  }
}`,
    whyItMatters: 'Understanding the TemplateRef/ViewContainerRef pattern is the prerequisite for building dynamic UI — modal portals, virtual scroll, drag-and-drop containers all use the same structural directive primitives.',
    pitfalls: [
      'Trying to use ElementRef to insert new DOM nodes in an attribute directive — use ViewContainerRef instead; direct DOM manipulation bypasses Angular\'s rendering pipeline.',
      'Forgetting that Angular 17+ @if / @for are not directives — they cannot be imported into a component\'s imports array.',
      'Applying multiple structural directives to the same element (e.g. *ngIf and *ngFor together) — Angular does not support this; wrap one in an <ng-container>.',
    ],
    docsUrl: 'https://angular.dev/guide/directives',
    sinceVersion: '2.0',
  },
  {
    id: 'concept-directives-custom-pipes',
    topic: 'directives-pipes',
    title: 'Custom pipes — pure vs impure',
    summary: 'Pure pipes re-evaluate only when the input reference changes; impure pipes re-evaluate on every change detection cycle.',
    explanation: [
      'A pipe is a class decorated with @Pipe({ name: "..." }) that implements PipeTransform.transform(value, ...args). Pure pipes (the default) are memoised by reference — if the input value reference has not changed since the last check, Angular skips the transform entirely and returns the cached result.',
      'Impure pipes (pure: false) run on every change detection cycle regardless of input changes. They are needed for pipes that depend on external state — a translate pipe that reads from a language store, or a filter pipe working on a mutable array (though the latter is better solved by creating a new array reference).',
      'Pipe performance: pure pipes with cheap transforms are essentially free. Avoid impure pipes in high-frequency components — a pipe called in *ngFor over 1000 items runs 1000 times per CD cycle.',
    ],
    example: `// Pure pipe — runs only when 'value' reference changes
@Pipe({ name: 'truncate', standalone: true })
export class TruncatePipe implements PipeTransform {
  transform(value: string, limit = 100): string {
    return value.length > limit ? value.slice(0, limit) + '…' : value;
  }
}

// In template
{{ longText | truncate:50 }}`,
    whyItMatters: 'Pipes are the cleanest way to format display values without polluting the component class with formatting logic. Understanding purity prevents subtle performance bugs and stale-render surprises.',
    pitfalls: [
      'Making a pipe that formats dates or currency impure when it does not need external state — it will recalculate on every CD cycle for no benefit.',
      'Mutating an array and expecting a pure pipe to pick up the change — the reference stays the same, so the pipe returns the cached result; push to a new array reference instead.',
      'Using a pipe for async transformation (HTTP call inside transform) — pipes should be synchronous; use an async pipe + service for async data.',
    ],
    docsUrl: 'https://angular.dev/guide/pipes',
    sinceVersion: '2.0',
  },
];
