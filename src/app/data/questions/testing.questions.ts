// Last reviewed: Angular 21.2 (2026-06)
// Next review due: Angular 22.0 release (~late 2026)
import { Question } from '../../models/interview.models';

export const testingTopic = {
  id: 'testing',
  title: 'Testing',
  description: 'Component testing with TestBed, mocking dependencies, testing signals, async testing, and component harnesses.'
};

export const testingQuestions: Question[] = [
  {
    id: 'tst-1',
    conceptId: 'concept-testing-testbed',
    topic: 'testing',
    title: 'TestBed.configureTestingModule',
    difficulty: 'Junior',
    questionType: 'multiple-choice',
    bloomLevel: 'understand',
    sinceVersion: '2.0',
    assessmentEligible: true,
    tags: ['testing', 'TestBed', 'component testing'],
    questionText: 'What is the role of `TestBed.configureTestingModule` and what is the minimum setup required to test a standalone component?',
    rubrics: ['creates test injector', 'imports standalone component', 'providers array', 'ComponentFixture', 'no NgModule needed'],
    sampleAnswer: 'TestBed.configureTestingModule creates an Angular testing module with its own injector, compiler, and component factory. For a standalone component, the minimum setup is `imports: [MyComponent]` (plus any stubs for its dependencies). You no longer need `declarations` — standalone components go in `imports`. Call `TestBed.createComponent(MyComponent)` to get a `ComponentFixture`, then `fixture.detectChanges()` to trigger initial rendering.',
    options: [
      'It compiles TypeScript to JavaScript before running tests.',
      'It creates a test Angular module with its own injector; for standalone components, list them in imports (not declarations) and call createComponent to get a ComponentFixture.',
      'It is only needed for NgModule-based components — standalone components skip TestBed entirely.',
      'TestBed is being replaced by Vitest in Angular 21.'
    ],
    correctOptionIndex: 1,
    timeLimit: 60,
    rubricMatchers: [
      { pattern: 'test.*injector|injector.*test|own.*injector', term: 'creates test injector', label: 'TestBed creates an isolated test injector', weight: 2 },
      { pattern: 'imports.*standalone|standalone.*imports|not.*declarations', term: 'imports standalone component', label: 'Standalone components go in imports not declarations', weight: 3 },
      { pattern: 'ComponentFixture|createComponent|fixture', term: 'ComponentFixture', label: 'createComponent returns a ComponentFixture', weight: 3 },
      { pattern: 'detectChanges|initial.*render|trigger.*render', term: 'no NgModule needed', label: 'detectChanges triggers initial rendering', weight: 2 }
    ]
  },
  {
    id: 'tst-2',
    conceptId: 'concept-testing-mocking',
    topic: 'testing',
    title: 'Mocking services in component tests',
    difficulty: 'Mid',
    questionType: 'open-ended',
    bloomLevel: 'apply',
    sinceVersion: '2.0',
    assessmentEligible: true,
    tags: ['testing', 'mocking', 'providers', 'spies'],
    questionText: 'Describe two ways to provide a mock implementation of a service in a TestBed component test, and when you would choose each.',
    answerPlaceholder: 'Explain useValue with a plain object spy and useClass with a fake class, including the trade-offs.',
    rubrics: ['useValue with spy', 'useClass with fake', 'provide in TestBed', 'spy on return value', 'when to choose'],
    sampleAnswer: 'Option 1: `{ provide: MyService, useValue: jasmine.createSpyObj(\'MyService\', [\'getData\']) }` — fast to write, best for simple services with a few methods you need to control. Option 2: `{ provide: MyService, useClass: FakeMyService }` where FakeMyService is a full class that implements the same interface — better when the fake needs realistic state or complex logic across multiple calls. Both go in the `providers` array of configureTestingModule. Prefer `useValue` + spy for isolated unit tests; prefer `useClass` when the fake is shared across multiple test files.',
    timeLimit: 90,
    rubricMatchers: [
      { pattern: 'useValue|spy.*obj|createSpyObj|jasmine.*spy|vi.*fn|vi.*spy', term: 'useValue with spy', label: 'useValue with a spy object', weight: 3 },
      { pattern: 'useClass|fake.*class|FakeService|stub.*class', term: 'useClass with fake', label: 'useClass with a fake implementation class', weight: 3 },
      { pattern: 'providers.*TestBed|TestBed.*providers|configureTestingModule.*provider', term: 'provide in TestBed', label: 'Registered in TestBed providers array', weight: 2 },
      { pattern: 'when.*choose|trade.?off|simple.*spy|complex.*fake|shared', term: 'when to choose', label: 'Explains when to choose each approach', weight: 2 }
    ]
  },
  {
    id: 'tst-3',
    topic: 'testing',
    title: 'Testing signals in components',
    difficulty: 'Mid',
    questionType: 'open-ended',
    bloomLevel: 'apply',
    sinceVersion: '16.0',
    assessmentEligible: true,
    tags: ['testing', 'signals', 'detectChanges'],
    questionText: 'How do you test a component that derives its template output from a signal? What must you call after updating the signal value to see the change in the DOM?',
    answerPlaceholder: 'Explain how to update a signal in a test, how to flush the change detection, and how to assert the DOM result.',
    rubrics: ['set signal value', 'fixture.detectChanges', 'TestBed.flushEffects', 'query DOM', 'no fakeAsync needed'],
    sampleAnswer: 'To update the signal, call `component.mySignal.set(newValue)` directly on the component instance. Then call `fixture.detectChanges()` to flush the Angular change detection cycle and update the DOM. If the signal drives an `effect()`, call `TestBed.flushEffects()` first to ensure the effect runs before asserting. Query the DOM with `fixture.debugElement.query(By.css(...)).nativeElement`. Unlike RxJS-based async tests, signals are synchronous — no `fakeAsync` or `tick()` needed in most cases.',
    timeLimit: 90,
    rubricMatchers: [
      { pattern: '\\.set\\(|signal\\.set|set.*signal|update.*signal', term: 'set signal value', label: 'Updates signal via .set() on the component', weight: 3 },
      { pattern: 'detectChanges|fixture\\.detectChanges', term: 'fixture.detectChanges', label: 'Calls fixture.detectChanges() after signal update', weight: 3 },
      { pattern: 'flushEffects|TestBed\\.flushEffects', term: 'TestBed.flushEffects', label: 'TestBed.flushEffects() for effect-driven output', weight: 3 },
      { pattern: 'synchronous|no.*fakeAsync|no.*tick|sync', term: 'no fakeAsync needed', label: 'Signals are synchronous — no fakeAsync needed', weight: 2 },
      { pattern: 'query|By\\.css|nativeElement|debugElement', term: 'query DOM', label: 'Queries DOM to assert rendered output', weight: 1 }
    ]
  },
  {
    id: 'tst-4',
    topic: 'testing',
    title: 'Testing async operations with fakeAsync',
    difficulty: 'Mid',
    questionType: 'code-snippet',
    bloomLevel: 'apply',
    sinceVersion: '2.0',
    assessmentEligible: true,
    tags: ['testing', 'fakeAsync', 'tick', 'async'],
    questionText: 'Review the test below. Why does the assertion fail, and what is the correct fix?',
    codeSnippet: "it('should show user after load', () => {\n  component.loadUser();\n  fixture.detectChanges();\n  const el = fixture.debugElement.query(By.css('.user-name'));\n  expect(el.nativeElement.textContent).toBe('Alice');\n});",
    answerPlaceholder: 'Explain why the assertion runs before the async operation completes and show the corrected version.',
    rubrics: ['async not awaited', 'fakeAsync and tick', 'or async and whenStable', 'detectChanges after async', 'test zone'],
    sampleAnswer: 'The assertion runs synchronously before the async `loadUser()` operation resolves, so the DOM has not updated yet. Fix with `fakeAsync`: wrap the test body in `fakeAsync(() => { component.loadUser(); tick(); fixture.detectChanges(); expect(...) })` — `tick()` advances the virtual clock, flushing pending promises and timers. Alternatively, use `async/await` with `await fixture.whenStable()` after calling the method.',
    timeLimit: 90,
    rubricMatchers: [
      { pattern: 'sync.*before|before.*resolve|not.*await|before.*complete', term: 'async not awaited', label: 'Assertion runs before async resolves', weight: 3 },
      { pattern: 'fakeAsync|fake.*async', term: 'fakeAsync and tick', label: 'Wraps test in fakeAsync()', weight: 3 },
      { pattern: 'tick\\(|tick\\)', term: 'fakeAsync and tick', label: 'Uses tick() to flush async operations', weight: 3 },
      { pattern: 'whenStable|async.*await.*stable', term: 'or async and whenStable', label: 'Alternative: async + whenStable()', weight: 2 },
      { pattern: 'detectChanges.*after|after.*tick.*detect|flush.*detect', term: 'detectChanges after async', label: 'detectChanges called after async resolves', weight: 2 }
    ]
  },
  {
    id: 'tst-5',
    topic: 'testing',
    title: 'Component harnesses',
    difficulty: 'Senior',
    questionType: 'open-ended',
    bloomLevel: 'evaluate',
    sinceVersion: '9.0',
    assessmentEligible: true,
    tags: ['testing', 'harness', 'CDK', 'Angular Material'],
    questionText: 'What is a component test harness and when is it preferable to querying the DOM directly with `By.css`?',
    answerPlaceholder: 'Describe what a harness provides, what it abstracts, and give a scenario where it is clearly the better choice.',
    rubrics: ['stable API over DOM', 'implementation independent', 'async interactions', 'reusable across tests', 'Angular CDK HarnessLoader'],
    sampleAnswer: 'A component harness (defined using Angular CDK\'s `ComponentHarness`) provides a typed, stable API to interact with a component\'s public surface — click a button, read displayed text, fill an input — without coupling tests to CSS selectors or internal DOM structure. When a component\'s template is refactored, tests using a harness continue to pass as long as the public interaction API stays the same. Use harnesses when: (1) testing Angular Material or CDK components (official harnesses already exist), (2) building a shared library where consumers should test interactions without knowing internals, or (3) interactions involve async animations or async validators that the harness handles transparently.',
    timeLimit: 120,
    rubricMatchers: [
      { pattern: 'stable.*API|public.*API|typed.*API|abstraction', term: 'stable API over DOM', label: 'Harness provides stable API over raw DOM', weight: 3 },
      { pattern: 'implementation.*independent|CSS.*selector|internal.*DOM|refactor.*safe', term: 'implementation independent', label: 'Decouples tests from DOM/CSS implementation', weight: 3 },
      { pattern: 'async.*interaction|animation|async.*valid|transparent.*async', term: 'async interactions', label: 'Harness handles async interactions transparently', weight: 2 },
      { pattern: 'reusab|shared.*library|consumer.*test|across.*test', term: 'reusable across tests', label: 'Harness is reusable across multiple test files', weight: 2 },
      { pattern: 'HarnessLoader|ComponentHarness|CDK.*harness|Material.*harness', term: 'Angular CDK HarnessLoader', label: 'References CDK HarnessLoader or ComponentHarness', weight: 2 }
    ]
  },
  {
    id: 'tst-6',
    topic: 'testing',
    title: 'What and what not to test in a component',
    difficulty: 'Senior',
    questionType: 'open-ended',
    bloomLevel: 'evaluate',
    sinceVersion: '2.0',
    assessmentEligible: true,
    tags: ['testing', 'strategy', 'what to test'],
    questionText: 'A colleague argues that every method in a component class should have a unit test. Do you agree? Describe what is worth testing in an Angular component and what is not.',
    answerPlaceholder: 'Explain the boundary of a component test, what adds confidence, and what creates brittle tests.',
    rubrics: ['test behaviour not implementation', 'skip trivial getters', 'test template bindings', 'test input output contract', 'avoid testing Angular itself'],
    sampleAnswer: 'Disagreed. Testing every method couples tests to implementation, making refactors expensive without adding confidence. Worth testing: (1) the input → rendered output contract (given this @Input, does the template show the right text?), (2) event bindings (does clicking the button emit the expected @Output?), (3) conditional rendering logic (@if blocks), (4) integration with injected services (given the service returns X, does the component render Y?). Not worth testing: simple getters/setters with no logic, the fact that Angular\'s own change detection works, or private implementation details that could be moved to a service. Tests should break when behaviour changes, not when you rename a private variable.',
    timeLimit: 120,
    rubricMatchers: [
      { pattern: 'behaviour|behavior|not.*implement|public.*contract', term: 'test behaviour not implementation', label: 'Test behaviour not implementation details', weight: 3 },
      { pattern: 'getter|setter|trivial|simple.*method|no.*logic', term: 'skip trivial getters', label: 'Skip trivial getters and setters', weight: 2 },
      { pattern: 'template.*binding|rendered.*output|DOM.*output|input.*render', term: 'test template bindings', label: 'Test @Input to rendered output contract', weight: 3 },
      { pattern: '@Output|emit|event.*binding|click.*emit', term: 'test input output contract', label: 'Test @Output event emissions', weight: 2 },
      { pattern: "Angular.*itself|framework|don't.*test.*Angular|avoid.*Angular", term: 'avoid testing Angular itself', label: 'Avoid testing Angular framework behaviour', weight: 2 }
    ]
  }
];
