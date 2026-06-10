import { Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Question } from '../../models/interview.models';
import { McqRendererComponent } from './mcq-renderer';
import { SelectAllRendererComponent } from './select-all-renderer';
import { TextRendererComponent } from './text-renderer';
import { DragDropRendererComponent } from './drag-drop-renderer';

@Component({
  selector: 'app-question-renderer',
  imports: [
    CommonModule,
    McqRendererComponent,
    SelectAllRendererComponent,
    TextRendererComponent,
    DragDropRendererComponent
  ],
  template: `
    @switch (question().questionType) {
      @case ('select-all') {
        <app-select-all-renderer
          [question]="question()"
          [value]="value()"
          (answerChange)="onAnswerChange($event)">
        </app-select-all-renderer>
      }
      @case ('open-ended') {
        <app-text-renderer
          [question]="question()"
          [value]="value()"
          (answerChange)="onAnswerChange($event)">
        </app-text-renderer>
      }
      @case ('code-snippet') {
        <app-text-renderer
          [question]="question()"
          [value]="value()"
          (answerChange)="onAnswerChange($event)">
        </app-text-renderer>
      }
      @case ('drag-and-drop') {
        <app-drag-drop-renderer
          [question]="question()"
          [value]="value()"
          (answerChange)="onAnswerChange($event)">
        </app-drag-drop-renderer>
      }
      @default {
        <app-mcq-renderer
          [question]="question()"
          [value]="value()"
          (answerChange)="onAnswerChange($event)">
        </app-mcq-renderer>
      }
    }
  `
})
export class QuestionRendererComponent {
  public readonly question = input.required<Question>();
  public readonly value = input<string>();
  public readonly answerChange = output<string>();

  public onAnswerChange(newValue: string): void {
    this.answerChange.emit(newValue);
  }
}
