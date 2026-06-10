import { Concept } from '../../models/interview.models';

export const formsConcepts: Concept[] = [
  {
    id: 'concept-forms-reactive-vs-template',
    topic: 'forms',
    title: 'Reactive vs template-driven forms',
    summary: 'Reactive forms define structure in the class using FormControl/FormGroup; template-driven forms define structure in the template using ngModel directives.',
    explanation: [
      'Reactive forms (ReactiveFormsModule) are model-driven: you create the form structure in the component class using FormGroup and FormControl, then bind it to the template with formControlName. The form state is a plain synchronous object you can inspect, test, and manipulate directly without touching the DOM.',
      'Template-driven forms (FormsModule) use Angular directives (ngModel, ngForm) to build the form implicitly in the template. The class only needs a data model. They are faster to write for simple cases but harder to test because the form structure lives in the template, not the class.',
      'The practical heuristic: use reactive forms for any form with dynamic fields, complex validation, programmatic resets, or server-driven structure. Use template-driven for very simple forms (newsletter signup, search box) where unit-testing the form logic is not a priority.',
    ],
    example: `// Reactive
this.loginForm = new FormGroup({
  email: new FormControl('', [Validators.required, Validators.email]),
  password: new FormControl('', Validators.minLength(8))
});

// Template-driven
<input name="email" ngModel required email>`,
    whyItMatters: 'Choosing template-driven for a 10-field wizard with dynamic field visibility and cross-field validation leads to unmaintainable template logic. Choosing reactive for a single newsletter input adds unnecessary boilerplate.',
    pitfalls: [
      'Mixing ReactiveFormsModule and FormsModule directives on the same form — formControlName and ngModel cannot be used together on the same control.',
      'Mutating a FormControl\'s value directly (control.value = x) instead of control.setValue(x) — direct mutation bypasses validators and does not notify subscribers.',
      'Not calling form.reset() after a successful submit — the form retains dirty/touched state and shows stale validation errors.',
    ],
    docsUrl: 'https://angular.dev/guide/forms',
    sinceVersion: '2.0',
  },
  {
    id: 'concept-forms-validation',
    topic: 'forms',
    title: 'Built-in validators and custom validators',
    summary: 'Validators are functions that receive an AbstractControl and return a ValidationErrors object or null, composable via Validators.compose() or as an array.',
    explanation: [
      'Built-in validators (Validators.required, Validators.email, Validators.min, Validators.pattern) cover most simple cases. Pass them as the second argument to FormControl or as a validators array. They are synchronous — they return immediately.',
      'Custom synchronous validators are plain functions with the signature (control: AbstractControl) => ValidationErrors | null. Return an object with an error key and a truthy value to mark the control invalid, or null to indicate valid.',
      'Async validators (third argument to FormControl, or asyncValidators option) return Observable<ValidationErrors | null> or Promise<ValidationErrors | null>. Angular runs them after all synchronous validators pass. The control enters the "PENDING" status during async validation. Always debounce async validators — do not fire an API call on every keystroke.',
    ],
    example: `// Custom sync validator
function noWhitespace(control: AbstractControl): ValidationErrors | null {
  return /\s/.test(control.value) ? { whitespace: true } : null;
}

// Async validator using inject()
function uniqueEmailValidator(): AsyncValidatorFn {
  const svc = inject(UserService);
  return control => svc.checkEmail(control.value).pipe(
    debounceTime(400),
    map(taken => taken ? { emailTaken: true } : null)
  );
}`,
    whyItMatters: 'Form validation is often the first place business rules appear in the UI. A poorly structured validator that hits the API on every keystroke adds hundreds of unnecessary requests per session.',
    pitfalls: [
      'Async validator not returning null on a valid value — if the Observable completes without emitting, Angular leaves the control in PENDING forever.',
      'Not using debounceTime in async validators — each keystroke fires an API call, hammering the server.',
      'Cross-field validation put on individual controls — it belongs on the FormGroup so it has access to all sibling controls.',
    ],
    docsUrl: 'https://angular.dev/guide/forms/form-validation',
    sinceVersion: '2.0',
  },
  {
    id: 'concept-forms-value-changes',
    topic: 'forms',
    title: 'valueChanges, statusChanges, and patchValue',
    summary: 'FormControl and FormGroup expose reactive Observables for value and status, and methods to update values programmatically without triggering full form resets.',
    explanation: [
      'valueChanges is an Observable that emits the control\'s latest value on every change. Combine it with debounceTime, distinctUntilChanged, and switchMap to build a reactive search or auto-save without writing event handlers.',
      'statusChanges emits "VALID", "INVALID", or "PENDING" on every validation cycle. Use it to drive a submit button\'s disabled state or to show a spinner during async validation.',
      'patchValue updates only the specified fields of a FormGroup, leaving unspecified fields untouched. setValue requires ALL fields to be provided and throws if any are missing. Use patchValue when populating a form from an API response that may not include every field.',
    ],
    example: `// Live search with debounce
this.searchControl.valueChanges.pipe(
  debounceTime(300),
  distinctUntilChanged(),
  switchMap(term => this.api.search(term))
).subscribe(results => this.results = results);

// Partial update from API
this.form.patchValue({ email: user.email, name: user.name });
// phone is not in the patch — its FormControl is left unchanged`,
    whyItMatters: 'valueChanges enables reactive form interactions (conditional field visibility, cascading selects, live validation feedback) without imperative event listeners.',
    pitfalls: [
      'Subscribing to valueChanges inside ngOnInit without cleaning up — the subscription outlives the component and leaks.',
      'Using setValue on a large FormGroup when only one field changed — it triggers validators and valueChanges for every control unnecessarily.',
      'Reading form.value directly instead of form.getRawValue() when some controls are disabled — disabled controls are excluded from form.value but included in getRawValue().',
    ],
    docsUrl: 'https://angular.dev/guide/forms/reactive-forms',
    sinceVersion: '2.0',
  },
];
