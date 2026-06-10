import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DragDropRendererComponent } from './drag-drop-renderer';
import { Question } from '../../models/interview.models';
import { ComponentRef } from '@angular/core';

const DND_QUESTION: Question = {
  id: 'dnd-1',
  topic: 'testing',
  title: 'Order the lifecycle hooks',
  questionText: 'Arrange the hooks in execution order.',
  difficulty: 'Mid',
  bloomLevel: 'remember',
  sinceVersion: '2.0',
  assessmentEligible: true,
  timeLimit: 60,
  rubrics: ['ngOnInit', 'ngOnChanges'],
  sampleAnswer: 'ngOnChanges → ngOnInit → ngDoCheck → ngOnDestroy',
  questionType: 'drag-and-drop',
  options: ['ngOnInit', 'ngOnChanges', 'ngDoCheck', 'ngOnDestroy'],
};

describe('DragDropRendererComponent', () => {
  let fixture: ComponentFixture<DragDropRendererComponent>;
  let component: DragDropRendererComponent;
  let ref: ComponentRef<DragDropRendererComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DragDropRendererComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(DragDropRendererComponent);
    ref = fixture.componentRef;
    ref.setInput('question', DND_QUESTION);
    fixture.detectChanges();
  });

  it('creates the component', () => {
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('renders all options', () => {
    const items = fixture.nativeElement.querySelectorAll('.dnd-item');
    expect(items.length).toBe(4);
  });

  it('shows default order (0,1,2,3) when no value is set', () => {
    const positions = fixture.nativeElement.querySelectorAll('.dnd-position');
    expect(positions[0].textContent.trim()).toBe('1');
    expect(positions[3].textContent.trim()).toBe('4');
  });

  it('restores order from a provided value string', () => {
    ref.setInput('value', '3,0,1,2');
    fixture.detectChanges();
    const texts = Array.from(fixture.nativeElement.querySelectorAll('.dnd-text')) as HTMLElement[];
    expect(texts[0].textContent?.trim()).toBe('ngOnDestroy');
    expect(texts[1].textContent?.trim()).toBe('ngOnInit');
  });

  it('emits answerChange on drop with updated order', () => {
    const emitted: string[] = [];
    fixture.componentInstance.answerChange.subscribe((v: string) => emitted.push(v));

    // simulate drag from position 0 to position 2
    fixture.componentInstance.onDragStart(0);
    fixture.componentInstance.onDrop(2);

    expect(emitted.length).toBe(1);
    expect(emitted[0]).toBe('1,2,0,3');
  });

  it('does not emit when dropping on the same position', () => {
    const emitted: string[] = [];
    fixture.componentInstance.answerChange.subscribe((v: string) => emitted.push(v));

    fixture.componentInstance.onDragStart(1);
    fixture.componentInstance.onDrop(1);

    expect(emitted.length).toBe(0);
  });

  it('clears drag state after dragEnd', () => {
    fixture.componentInstance.onDragStart(0);
    fixture.componentInstance.onDragEnd();
    expect(fixture.componentInstance.draggingPos()).toBeNull();
  });

  it('clears dragOver state after dragLeave', () => {
    fixture.componentInstance.onDragOver(2);
    fixture.componentInstance.onDragLeave();
    expect(fixture.componentInstance.dragOverPos()).toBeNull();
  });

  it('renders an instructions paragraph', () => {
    const instructions = fixture.nativeElement.querySelector('.dnd-instructions');
    expect(instructions).not.toBeNull();
  });
});
