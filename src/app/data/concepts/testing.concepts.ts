import { Concept } from '../../models/interview.models';

export const testingConcepts: Concept[] = [
  {
    id: 'concept-testing-testbed',
    topic: 'testing',
    title: 'TestBed and ComponentFixture',
    summary: 'TestBed creates an isolated Angular testing module with its own injector; ComponentFixture wraps the component instance and its DOM for assertions.',
    explanation: [
      'TestBed.configureTestingModule() sets up a mini Angular environment for a test. For standalone components, list the component in imports (not declarations) — the distinction matters because standalone components are self-describing. Call compileComponents() to compile template and styles before creating the component.',
      'TestBed.createComponent() returns a ComponentFixture that gives you three handles: fixture.componentInstance (the class), fixture.nativeElement (the raw DOM), and fixture.debugElement (Angular\'s wrapper with query utilities). Call fixture.detectChanges() to trigger the first change detection pass and render the initial template.',
      'For testing signal-driven components: update the signal value on the component instance (component.mySignal.set(x)), then call fixture.detectChanges() to flush change detection. For effect-driven output, call TestBed.flushEffects() first.',
    ],
    example: `it('should display the user name', async () => {
  await TestBed.configureTestingModule({
    imports: [UserCardComponent],
    providers: [{ provide: UserService, useValue: fakeUserService }]
  }).compileComponents();

  const fixture = TestBed.createComponent(UserCardComponent);
  fixture.componentRef.setInput('user', { name: 'Alice' });
  fixture.detectChanges();

  const el = fixture.nativeElement.querySelector('.user-name');
  expect(el.textContent).toContain('Alice');
});`,
    whyItMatters: 'TestBed is the foundation for all Angular component tests. Knowing which array to list a standalone component in (imports, not declarations) is a discriminating question in Angular interviews.',
    pitfalls: [
      'Adding a standalone component to declarations instead of imports — Angular throws a compile error.',
      'Querying the DOM before calling fixture.detectChanges() — the template has not rendered yet.',
      'Not mocking injected services — the test will use the real service, which may make real HTTP calls or require complex setup.',
    ],
    docsUrl: 'https://angular.dev/guide/testing/components-basics',
    sinceVersion: '2.0',
  },
  {
    id: 'concept-testing-mocking',
    topic: 'testing',
    title: 'Mocking services — useValue and useClass',
    summary: 'Provide mock services in TestBed via useValue with a spy object for simple cases, or useClass with a fake implementation for complex shared fakes.',
    explanation: [
      'useValue: jasmine.createSpyObj(\'UserService\', [\'getUser\']) provides a mock object where every listed method is a configurable spy. Control return values with spy.getUser.and.returnValue(of(mockUser)). Fast to write, ideal for isolated unit tests with a small number of methods.',
      'useClass: FakeUserService provides a full class that implements the same interface. The fake can maintain state across multiple calls — useful when the service is used by many test files and the fake needs realistic behaviour (in-memory data store, state machine).',
      'Either way the mock goes in the providers array of configureTestingModule under { provide: RealService, useValue/useClass: mock }. The component gets the mock injected transparently because Angular resolves by token, not by class name.',
    ],
    example: `// useValue — simple spy
const fakeUserSvc = jasmine.createSpyObj('UserService', ['getUser']);
fakeUserSvc.getUser.and.returnValue(of({ name: 'Bob' }));

await TestBed.configureTestingModule({
  imports: [UserCardComponent],
  providers: [{ provide: UserService, useValue: fakeUserSvc }]
}).compileComponents();

// useClass — shared fake
class FakeUserService {
  users = [{ name: 'Bob' }];
  getUser = () => of(this.users[0]);
}
providers: [{ provide: UserService, useClass: FakeUserService }]`,
    whyItMatters: 'Tests that use the real service are integration tests — valuable but slow and flaky if the real service calls a network. Mocking draws a clear boundary that makes the component test fast and deterministic.',
    pitfalls: [
      'Forgetting to configure a spy\'s return value — the spy returns undefined by default, causing type errors or rendering empty templates with no obvious error.',
      'Using useClass with a fake that has different method signatures than the real service — type errors surface only at test runtime, not compile time.',
      'Over-mocking: spying on every private method — test only the public contract; internal implementation is subject to change.',
    ],
    docsUrl: 'https://angular.dev/guide/testing/services',
    sinceVersion: '2.0',
  },
];
