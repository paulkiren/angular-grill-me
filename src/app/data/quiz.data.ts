// Thin re-export — kept for backwards compatibility with state.service.ts.
// All question content lives in src/app/data/questions/*.questions.ts
// To add a new topic: create a questions file, register it in questions/index.ts
export { allTopics as quizTopicsData, allQuestions as quizQuestionsData } from './questions/index';
