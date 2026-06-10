import { Concept } from '../../models/interview.models';

export const standaloneConcepts: Concept[] = [
  {
    id: 'concept-standalone-basics',
    topic: 'standalone',
    title: 'Standalone components — no NgModules',
    summary: 'Standalone components declare their own imports directly, eliminating the NgModule layer and making each component self-contained and independently loadable.',
    explanation: [
      'Before Angular 14, every component had to belong to an NgModule that declared it and listed its dependencies. Standalone components set standalone: true (the default in Angular 17+) and list their template dependencies — other components, directives, pipes, and imported modules — in their own imports array.',
      'This removes the indirection of NgModule: when you read a standalone component you see everything it needs in one place. Tree-shaking improves because the bundler can determine exactly which components are used without tracing NgModule dependency graphs.',
      'The Angular CLI generates standalone components by default since Angular 17. To bootstrap a standalone app: bootstrapApplication(AppComponent, appConfig) in main.ts, with providers configured in app.config.ts using provide* functions.',
    ],
    example: `// Self-contained — no NgModule needed
@Component({
  selector: 'app-user-card',
  standalone: true,           // explicit in Angular <17
  imports: [CommonModule, RouterLink, DatePipe],
  template: \`
    <a [routerLink]="['/users', user.id]">{{ user.name }}</a>
    <span>Joined {{ user.joinedAt | date }}</span>
  \`
})
export class UserCardComponent {
  user = input.required<User>();
}`,
    whyItMatters: 'NgModule-based apps require touching 3+ files to add a new component (declare, export, import in module). Standalone reduces this to one file and makes components portable — copy a standalone component to another project and it just works.',
    pitfalls: [
      'Importing a module in a standalone component\'s imports that is only needed for one directive — this inflates the component\'s bundle boundary; prefer importing the specific standalone directive.',
      'Forgetting that NgModule-declared components cannot be imported directly — they must be wrapped in their NgModule or migrated to standalone.',
      'Confusing standalone: true on a component with providedIn: "root" on a service — they are independent concepts.',
    ],
    docsUrl: 'https://angular.dev/guide/components/importing',
    sinceVersion: '14.0',
  },
  {
    id: 'concept-standalone-bootstrapping',
    topic: 'standalone',
    title: 'bootstrapApplication and ApplicationConfig',
    summary: 'Standalone apps bootstrap with bootstrapApplication() instead of platformBrowserDynamic().bootstrapModule(), configuring providers in a plain ApplicationConfig object.',
    explanation: [
      'bootstrapApplication(AppComponent, appConfig) takes the root component and an ApplicationConfig object. The config\'s providers array replaces the AppModule providers — use the provide* helper functions: provideRouter(routes), provideHttpClient(), provideAnimations(), and any custom providers.',
      'ApplicationConfig is composable: mergeApplicationConfig(baseConfig, featureConfig) lets you build configs from smaller pieces, which is useful for testing (override specific providers) and library authors (provide defaults that consumers can override).',
      'Server-side rendering uses the same pattern with provideServerRendering() added to the config, enabling a shared app.config.ts between browser and server builds.',
    ],
    example: `// main.ts
import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app';

bootstrapApplication(AppComponent, appConfig).catch(console.error);

// app.config.ts
export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes, withPreloading(PreloadAllModules)),
    provideHttpClient(withFetch(), withInterceptors([authInterceptor])),
    provideAnimationsAsync(),
  ]
};`,
    whyItMatters: 'The ApplicationConfig object is plain data — easy to read, easy to test (create a test config with mocked providers), and easy to compose across environments.',
    pitfalls: [
      'Mixing bootstrapApplication and platformBrowserDynamic().bootstrapModule() — only one bootstrap method can run per page.',
      'Adding global providers inside a component\'s providers array instead of appConfig — they will be scoped to the component subtree, not the root injector.',
      'Forgetting provideRouter() when using Angular Router — navigating throws a NullInjectorError for Router without it.',
    ],
    docsUrl: 'https://angular.dev/api/platform-browser/bootstrapApplication',
    sinceVersion: '14.0',
  },
];
