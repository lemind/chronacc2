import { Component, OnInit, Output, Input, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { Observable, Subject, BehaviorSubject } from 'rxjs';
import { select } from 'ng2-redux';
import { FormBuilder, FormControl, FormGroup} from '@angular/forms';

import { generateId } from '../../utils/utils';
import { tasks, ITasks, ITask, TaskActions, IPeriod } from '../../store/tasks';

@Component({
  selector: 'app-current-task',
  templateUrl: './current-task.component.html',
  styleUrls: ['./current-task.component.css'],
  providers: [TaskActions]
})
export class CurrentTaskComponent implements OnInit, OnChanges {
  private taskForm: FormGroup;
  settingValue$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  @Input() task: any;
  @select(['taskActive', 'currentTask']) currentTask$: Observable<ITask>;
  @select() tasks$: Observable<ITask[]>;
  @Output() submitTask: EventEmitter<any> = new EventEmitter<any>();
  @Output() taskChange: EventEmitter<any> = new EventEmitter<any>();

  isActive$: Observable<any>;
  isActiveSubject$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  beginTime$: Observable<any>;
  beginTimeSubject$: Subject<any> = new Subject<any>();

  endTime$: Observable<any>;
  endTimeSubject$: Subject<any> = new Subject<any>();

  periods$: Observable<any[]>;

  constructor(
      private taskActions: TaskActions,
      private fb: FormBuilder
    ) {}

  ngOnInit() {
    this.isActive$ = this.isActiveSubject$;
    this.beginTime$ = this.beginTimeSubject$;
    this.endTime$ = this.endTimeSubject$;

    this.beginTimeSubject$.next(new Date().getTime());

    this.taskForm = this.fb.group({
      id: [this.task.id],
      name: [this.task.name],
    });

    this.endTime$.withLatestFrom(
      this.beginTime$,
      this.currentTask$,
      (end, begin, currentTask: ITask) => 
      ({end, begin, currentTask})
      // {
      //   let period: IPeriod = {begin: begin, end: end, task: currentTask};
      //   currentTask.periods.push(period);
      //   this.submitTask.emit(currentTask);
      //   return {begin: begin, end: end, task: currentTask}
      // }
    )
    .subscribe(n => {
      let period: IPeriod = {begin: n.begin, end: n.end, task: n.currentTask};
      n.currentTask.periods.push(period);
      this.submitTask.emit(n.currentTask);
    });
    // .scan((periods, period) => {
    //   periods.push(period);
    //   return periods;
    // }, []);

    this.taskForm
      .valueChanges
      .withLatestFrom(
        this.settingValue$,
        this.currentTask$, (value, setting, current:ITask) => ({value, setting, current}))
      .filter(n => {return n.setting === false})
      .subscribe(n => {
        n.value.periods = n.current.periods;
        this.taskChange.emit(n.value);
      });
  }

  ngOnChanges(changes: SimpleChanges) { 
    let { task } = changes;

    if (this.taskForm && task) {
      this.settingValue$.next(true);
      this.taskForm.patchValue(task.currentValue, {onlySelf: false});
      this.settingValue$.next(false);
    }
  }

  start() {
    this.beginTimeSubject$.next(new Date().getTime());
    this.isActiveSubject$.next(true);

    this.submitTask.emit({id: 'new'});
  }

  stop() {
    this.endTimeSubject$.next(new Date().getTime());
    this.isActiveSubject$.next(false);
  }
}
