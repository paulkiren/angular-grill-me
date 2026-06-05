import { rxjsTopic, rxjsQuestions } from './rxjs.questions';
import { signalsTopic, signalsQuestions } from './signals.questions';
import { changeDetectionTopic, changeDetectionQuestions } from './change-detection.questions';
import { dependencyInjectionTopic, dependencyInjectionQuestions } from './dependency-injection.questions';
import { angularEvolutionTopic, angularEvolutionQuestions } from './angular-evolution.questions';
import { angularMigrationTopic, angularMigrationQuestions } from './angular-migration.questions';
import { routingTopic, routingQuestions } from './routing.questions';
import { formsTopic, formsQuestions } from './forms.questions';
import { httpTopic, httpQuestions } from './http.questions';

// — Add new topic imports here as content grows —
// import { directivesPipesTopic, directivesPipesQuestions } from './directives-pipes.questions';
// import { componentArchitectureTopic, componentArchitectureQuestions } from './component-architecture.questions';
// import { testingTopic, testingQuestions } from './testing.questions';
// import { ssrTopic, ssrQuestions } from './ssr-hydration.questions';
// import { buildTopic, buildQuestions } from './build-optimization.questions';

export const allTopics = [
  rxjsTopic,
  signalsTopic,
  changeDetectionTopic,
  dependencyInjectionTopic,
  angularEvolutionTopic,
  angularMigrationTopic,
  routingTopic,
  formsTopic,
  httpTopic,
];

export const allQuestions = [
  ...rxjsQuestions,
  ...signalsQuestions,
  ...changeDetectionQuestions,
  ...dependencyInjectionQuestions,
  ...angularEvolutionQuestions,
  ...angularMigrationQuestions,
  ...routingQuestions,
  ...formsQuestions,
  ...httpQuestions,
];
