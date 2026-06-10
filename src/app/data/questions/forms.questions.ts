// Last reviewed: Angular 21.2 (2026-06)
// Next review due: Angular 22.0 release (~late 2026)
import { Question } from '../../models/interview.models';

export const formsTopic = {
  id: 'forms',
  title: 'Reactive Forms',
  description: 'FormGroup, FormControl, FormArray, validators, async validators, typed forms, and dynamic controls.'
};

export const formsQuestions: Question[] = [
  {
    id: 'fm-1',
    conceptId: 'concept-forms-reactive-vs-template',
    topic: 'forms',
    title: 'FormControl vs FormGroup vs FormArray',
    difficulty: 'Junior',
    questionType: 'multiple-choice',
    bloomLevel: 'understand',
    sinceVersion: '2.0',
    assessmentEligible: true,
    tags: ['forms', 'FormControl', 'FormGroup', 'FormArray'],
    questionText: 'What is the role of each: FormControl, FormGroup, and FormArray?',
    rubrics: ['single field', 'group of controls', 'array of controls', 'value and validity'],
    sampleAnswer: 'FormControl tracks the value and validity state of a single form field. FormGroup aggregates multiple FormControls (or nested groups) by key into a single object, tracking their combined validity. FormArray manages an ordered, dynamic list of FormControls or FormGroups — useful for repeating sections like a list of phone numbers.',
    options: [
      'All three are interchangeable; they just differ in syntax.',
      'FormControl tracks a single field; FormGroup aggregates named controls into an object; FormArray manages an ordered list of controls.',
      'FormArray is only for select/dropdown elements.',
      'FormGroup replaces HTML form elements entirely.'
    ],
    correctOptionIndex: 1,
    timeLimit: 45,
    rubricMatchers: [
      { pattern: 'single.*field|one.*field|individual.*control', term: 'single field', label: 'FormControl tracks a single field', weight: 3 },
      { pattern: 'group|named.*control|object|keyed', term: 'group of controls', label: 'FormGroup aggregates named controls', weight: 3 },
      { pattern: 'array|list|ordered|dynamic.*list|repeating', term: 'array of controls', label: 'FormArray manages an ordered list', weight: 3 },
      { pattern: 'value|validity|valid|invalid|dirty', term: 'value and validity', label: 'All track value and validity state', weight: 1 }
    ]
  },
  {
    id: 'fm-2',
    topic: 'forms',
    title: 'Built-in vs custom validators',
    difficulty: 'Mid',
    questionType: 'multiple-choice',
    bloomLevel: 'apply',
    sinceVersion: '2.0',
    assessmentEligible: true,
    tags: ['forms', 'validators', 'custom'],
    questionText: 'When would you write a custom synchronous validator instead of using built-in validators, and what must it return?',
    rubrics: ['ValidatorFn', 'null on valid', 'error object', 'business logic', 'cross-field'],
    sampleAnswer: 'Write a custom validator when built-in validators (required, minLength, pattern, etc.) cannot express the rule — for example, a password strength check or cross-field comparison. A ValidatorFn receives an AbstractControl and must return null when valid, or an object with an error key when invalid (e.g., `{ passwordMismatch: true }`). The error key appears on the control\'s `errors` property.',
    options: [
      'Custom validators replace all built-in validators and must return a string.',
      'Write a custom validator for business rules built-ins cannot express; it returns null when valid or an error object (e.g. { myError: true }) when invalid.',
      'Custom validators must be async and return a Promise.',
      'Custom validators only work on FormArray, not FormControl.'
    ],
    correctOptionIndex: 1,
    timeLimit: 60,
    rubricMatchers: [
      { pattern: 'ValidatorFn|AbstractControl', term: 'ValidatorFn', label: 'Signature: ValidatorFn takes AbstractControl', weight: 2 },
      { pattern: 'null.*valid|return null', term: 'null on valid', label: 'Returns null when the control is valid', weight: 3 },
      { pattern: 'error.*object|\\{.*:.*true\\}|error.*key', term: 'error object', label: 'Returns error object when invalid', weight: 3 },
      { pattern: 'business.*logic|custom.*rule|not.*built.in', term: 'business logic', label: 'Used for rules built-ins cannot express', weight: 2 },
      { pattern: 'cross.field|compare|match|password', term: 'cross-field', label: 'Cross-field validation example', weight: 1 }
    ]
  },
  {
    id: 'fm-3',
    topic: 'forms',
    title: 'Async validators',
    difficulty: 'Mid',
    questionType: 'open-ended',
    bloomLevel: 'apply',
    sinceVersion: '2.0',
    assessmentEligible: true,
    tags: ['forms', 'async validators', 'HTTP'],
    questionText: 'Describe how you would implement an async validator that checks whether a username is already taken via an HTTP call, including how to handle debounce.',
    answerPlaceholder: 'Describe the AsyncValidatorFn signature, the HTTP call, debounce approach, and what the validator returns.',
    rubrics: ['AsyncValidatorFn', 'Observable or Promise', 'debounceTime', 'switchMap', 'pending state'],
    sampleAnswer: 'An AsyncValidatorFn receives an AbstractControl and returns an Observable<ValidationErrors | null> or Promise equivalent. Inject HttpClient and pipe the control value through debounceTime (to avoid a request on every keystroke), switchMap (to cancel previous requests), and map the response to null (available) or an error object (taken). The control enters a "pending" status while the validator is running, which you can use in the template to show a spinner.',
    timeLimit: 120,
    rubricMatchers: [
      { pattern: 'AsyncValidatorFn|async.*validator.*fn', term: 'AsyncValidatorFn', label: 'Correct async validator function signature', weight: 2 },
      { pattern: 'Observable|Promise', term: 'Observable or Promise', label: 'Returns Observable or Promise', weight: 2 },
      { pattern: 'debounceTime|debounce', term: 'debounceTime', label: 'Debounce to reduce HTTP requests', weight: 3 },
      { pattern: 'switchMap|cancel.*previous|cancel.*request', term: 'switchMap', label: 'switchMap to cancel stale requests', weight: 3 },
      { pattern: 'pending|PENDING|status.*pending', term: 'pending state', label: 'Control shows pending status while validating', weight: 2 }
    ]
  },
  {
    id: 'fm-4',
    topic: 'forms',
    title: 'Typed Reactive Forms',
    difficulty: 'Mid',
    questionType: 'multiple-choice',
    bloomLevel: 'understand',
    sinceVersion: '14.0',
    assessmentEligible: true,
    tags: ['forms', 'typed forms', 'TypeScript'],
    questionText: 'What did Angular 14 change about Reactive Forms typing and what problem does it solve?',
    rubrics: ['strongly typed', 'FormControl value type', 'no any', 'compile-time error', 'NonNullableFormBuilder'],
    sampleAnswer: 'Angular 14 made FormControl, FormGroup, and FormArray fully generic and strongly typed. Previously, `.value` on any control returned `any`, hiding type mismatches until runtime. Now the generic parameter (e.g., `FormControl<string>`) constrains the value type, and the compiler catches mismatches. `NonNullableFormBuilder` prevents `.reset()` from making values nullable when a default is always present.',
    options: [
      'Angular 14 removed FormGroup in favour of signal-based forms.',
      'Angular 14 made FormControl generic, so .value is strongly typed and type mismatches are caught at compile time instead of runtime.',
      'Typed forms only work with template-driven forms.',
      'Angular 14 typed forms require a separate @angular/forms-typed package.'
    ],
    correctOptionIndex: 1,
    timeLimit: 60,
    rubricMatchers: [
      { pattern: 'strongly.*typed|generic|type.*param', term: 'strongly typed', label: 'FormControl is now generic / strongly typed', weight: 3 },
      { pattern: '\\.value.*type|typed.*value|value.*no.*any', term: 'FormControl value type', label: '.value type is inferred from generic param', weight: 3 },
      { pattern: 'compile.?time|type.*error|TypeScript.*error', term: 'compile-time error', label: 'Errors caught at compile time', weight: 3 },
      { pattern: 'NonNullableFormBuilder|non.?nullable|reset', term: 'NonNullableFormBuilder', label: 'NonNullableFormBuilder prevents nullable resets', weight: 2 }
    ]
  },
  {
    id: 'fm-5',
    topic: 'forms',
    title: 'valueChanges for reactive UX',
    difficulty: 'Mid',
    questionType: 'code-snippet',
    bloomLevel: 'apply',
    sinceVersion: '2.0',
    assessmentEligible: true,
    tags: ['forms', 'valueChanges', 'rxjs'],
    questionText: 'Review the code below. What does it do, and what RxJS improvement would you make for a real search input?',
    codeSnippet: "this.searchControl.valueChanges.subscribe(value => {\n  this.searchService.search(value).subscribe(results => {\n    this.results = results;\n  });\n});",
    answerPlaceholder: 'Identify the problem with nested subscribes and describe the improved version using RxJS operators.',
    rubrics: ['nested subscribe', 'switchMap', 'debounceTime', 'memory leak', 'takeUntilDestroyed'],
    sampleAnswer: 'The code has two problems: nested subscribes (an anti-pattern that creates hard-to-manage subscriptions and potential memory leaks) and no debounce (fires an HTTP request on every keystroke). The fix is to pipe valueChanges through debounceTime, distinctUntilChanged, and switchMap into the search call — producing a single, self-managing observable chain that cancels stale requests and can be cleaned up with takeUntilDestroyed.',
    timeLimit: 90,
    rubricMatchers: [
      { pattern: 'nested.*subscri|subscri.*inside.*subscri|anti.?pattern', term: 'nested subscribe', label: 'Identifies nested subscribe as anti-pattern', weight: 3 },
      { pattern: 'switchMap', term: 'switchMap', label: 'switchMap flattens and cancels stale requests', weight: 3 },
      { pattern: 'debounceTime|debounce', term: 'debounceTime', label: 'debounceTime reduces request frequency', weight: 2 },
      { pattern: 'memory.*leak|unsubscri|takeUntilDestroyed|destroy', term: 'memory leak', label: 'Subscription cleanup to prevent leaks', weight: 2 },
      { pattern: 'distinctUntilChanged|distinct', term: 'takeUntilDestroyed', label: 'distinctUntilChanged skips duplicate values', weight: 1 }
    ]
  },
  {
    id: 'fm-6',
    topic: 'forms',
    title: 'Dynamic form controls with FormArray',
    difficulty: 'Mid',
    questionType: 'open-ended',
    bloomLevel: 'apply',
    sinceVersion: '2.0',
    assessmentEligible: true,
    tags: ['forms', 'FormArray', 'dynamic'],
    questionText: 'Describe how you would implement a dynamic list of phone number inputs where users can add and remove entries at runtime.',
    answerPlaceholder: 'Explain the FormArray setup, how to add/remove controls, and how to access values.',
    rubrics: ['FormArray', 'push new control', 'removeAt', 'FormBuilder', 'template loop'],
    sampleAnswer: 'Define a FormArray in the FormGroup. To add a phone number, call `phoneNumbers.push(this.fb.control(\'\', Validators.pattern(...)))`. To remove one, call `phoneNumbers.removeAt(index)`. In the template, loop over `phoneNumbers.controls` with `*ngFor` (or `@for`), binding each to a form control using `[formControl]` or `formControlName`. Access all values via `phoneNumbers.value`, which returns a typed array.',
    timeLimit: 90,
    rubricMatchers: [
      { pattern: 'FormArray|formArray', term: 'FormArray', label: 'Uses FormArray to hold dynamic controls', weight: 3 },
      { pattern: '\\.push|push.*control|add.*control', term: 'push new control', label: 'Adds controls via .push()', weight: 3 },
      { pattern: 'removeAt|remove.*index|splice', term: 'removeAt', label: 'Removes controls via .removeAt(index)', weight: 3 },
      { pattern: 'controls|\\*ngFor|@for|loop|iterate', term: 'template loop', label: 'Template loops over FormArray.controls', weight: 2 },
      { pattern: 'FormBuilder|fb\\.array|fb\\.control', term: 'FormBuilder', label: 'FormBuilder simplifies array creation', weight: 1 }
    ]
  },
  {
    id: 'fm-7',
    topic: 'forms',
    title: 'Cross-field validation',
    difficulty: 'Senior',
    questionType: 'open-ended',
    bloomLevel: 'analyze',
    sinceVersion: '2.0',
    assessmentEligible: true,
    tags: ['forms', 'validators', 'cross-field'],
    questionText: 'How do you implement a validator that compares two fields in the same FormGroup — for example, confirming that a password and confirm-password input match?',
    answerPlaceholder: 'Explain where the validator is attached, how it accesses sibling controls, and how to display the error in the template.',
    rubrics: ['group-level validator', 'get sibling control', 'set error on child', 'template error binding', 'AbstractControl'],
    sampleAnswer: 'Attach the validator to the FormGroup, not to individual controls, so it receives the group as its AbstractControl argument. Inside, call `group.get(\'password\')` and `group.get(\'confirmPassword\')` to compare values. If they differ, return an error object (e.g., `{ passwordMismatch: true }`). To surface the error in the template, check `form.errors?.passwordMismatch` — not `confirmPassword.errors` — since the error lives on the group. Optionally, call `confirmPassword.setErrors({ passwordMismatch: true })` to also mark the child control as invalid.',
    timeLimit: 120,
    rubricMatchers: [
      { pattern: 'group.*validator|validator.*group|FormGroup.*valid', term: 'group-level validator', label: 'Validator applied to FormGroup, not a control', weight: 3 },
      { pattern: 'group\\.get|control\\.get|sibling', term: 'get sibling control', label: 'Accesses sibling controls via group.get()', weight: 3 },
      { pattern: 'setErrors|set.*error.*child|child.*error', term: 'set error on child', label: 'Optionally propagates error to child control', weight: 2 },
      { pattern: 'form\\.errors|group\\.errors|template.*error', term: 'template error binding', label: 'Error read from group.errors in template', weight: 2 },
      { pattern: 'AbstractControl|control.*argument', term: 'AbstractControl', label: 'ValidatorFn receives AbstractControl', weight: 1 }
    ]
  },
  {
    id: 'fm-8',
    topic: 'forms',
    title: 'Reactive Forms vs Template-driven Forms',
    difficulty: 'Junior',
    questionType: 'multiple-choice',
    bloomLevel: 'evaluate',
    sinceVersion: '2.0',
    assessmentEligible: true,
    tags: ['forms', 'template-driven', 'reactive'],
    questionText: 'When would you choose Reactive Forms over Template-driven Forms for a new Angular feature?',
    rubrics: ['explicit model', 'testable', 'complex validation', 'dynamic controls', 'type safety'],
    sampleAnswer: 'Choose Reactive Forms when the form has complex or conditional validation, dynamic fields (add/remove controls at runtime), or when you need to unit-test form logic without rendering the template. The form model is defined explicitly in the component class, making it type-safe and fully testable. Template-driven forms are simpler for straightforward CRUD forms with basic validation and minimal programmatic interaction.',
    options: [
      'Always use Reactive Forms; template-driven forms are deprecated.',
      'Use Reactive Forms for complex validation, dynamic controls, and testability; use template-driven for simple forms with basic validation.',
      'Template-driven forms are faster at runtime.',
      'Reactive Forms require a separate module not included in @angular/forms.'
    ],
    correctOptionIndex: 1,
    timeLimit: 45,
    rubricMatchers: [
      { pattern: 'complex.*valid|conditional.*valid|custom.*valid', term: 'complex validation', label: 'Reactive forms handle complex validation', weight: 2 },
      { pattern: 'dynamic|add.*remove|runtime.*control', term: 'dynamic controls', label: 'Dynamic add/remove of controls', weight: 2 },
      { pattern: 'test|unit.*test|testab', term: 'testable', label: 'Form logic is testable without template', weight: 3 },
      { pattern: 'explicit|class.*defined|programmatic', term: 'explicit model', label: 'Model defined explicitly in the class', weight: 2 },
      { pattern: 'type.?safe|typed|TypeScript', term: 'type safety', label: 'Better type safety with typed forms', weight: 1 }
    ]
  }
];
