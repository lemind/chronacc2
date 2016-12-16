import { Component, OnInit, Output, Input, EventEmitter, OnChanges, SimpleChanges, OnDestroy } from '@angular/core';
import { Observable, Subject, BehaviorSubject } from 'rxjs';
import { select } from 'ng2-redux';
import { FormBuilder, FormControl, FormGroup} from '@angular/forms';

import { generateId } from '../../utils/utils';
import { tasks, ITasks, ITask, TaskActions, IPeriod } from '../../store/tasks';
import { TaskService } from '../../services/task.service';

@Component({
  selector: 'app-current-task',
  templateUrl: './current-task.component.html',
  styleUrls: ['./current-task.component.css'],
  providers: [TaskActions, TaskService]
})
export class CurrentTaskComponent implements OnInit, OnChanges, OnDestroy {
  private taskForm: FormGroup;
  settingValue$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  @Input() task: any;
  @Input() isActive: Observable<boolean>;

  @Output() submitTask: EventEmitter<any> = new EventEmitter<any>();
  @Output() taskChange: EventEmitter<any> = new EventEmitter<any>();

  @select(['taskActive', 'currentTask']) currentTask$: Observable<ITask>;
  @select() tasks$: Observable<ITask[]>;


  timerIsActive$: Observable<any>;
  isActiveSubject$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  beginTime$: Observable<any>;
  beginTimeSubject$: Subject<any> = new Subject<any>();

  endTime$: Observable<any>;
  endTimeSubject$: Subject<any> = new Subject<any>();

  periods$: Observable<any[]>;
  taskFormSubscriber: any;

  constructor(
      private taskActions: TaskActions,
      private fb: FormBuilder,
      private taskService: TaskService
    ) {}

  ngOnInit() {
    this.timerIsActive$ = this.isActiveSubject$;
    this.beginTime$ = this.beginTimeSubject$;
    this.endTime$ = this.endTimeSubject$;

    this.currentTask$
      .withLatestFrom(
        this.isActive,
        this.timerIsActive$,
        (currentTask: ITask, isActive, timerIsActive) =>
        ({isActive, currentTask, timerIsActive}))
      .subscribe(n => {
        if (!!n.isActive && !n.timerIsActive &&  n.currentTask) {
          this.start(n.currentTask);
        }
      });

    this.taskForm = this.fb.group({
      id: [],
      name: [],
    });

    this.endTime$
      .withLatestFrom(
        this.beginTime$,
        this.currentTask$,
        (end, begin, currentTask: ITask) =>
        ({end, begin, currentTask}))
      .subscribe(n => {
        let actualBeginTime = n.begin + this.taskService.getAllTaskTime(n.currentTask.periods);
        let period: IPeriod = {begin: actualBeginTime, end: n.end};
        n.currentTask.periods.push(period);
        this.submitTask.emit(n.currentTask);
        this.taskActions.clearSelectedTask();
      });

    this.taskFormSubscriber = this.taskForm
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
      let newTask = task.currentValue || {name: ''};
      this.taskForm.patchValue(newTask, {onlySelf: false});
      this.settingValue$.next(false);
    }
  }

  start(task) {
    let beginTime = task ? this.getBeginTime(task) : new Date().getTime();
    this.beginTimeSubject$.next(beginTime);
    this.isActiveSubject$.next(true);

    this.submitTask.emit(task || {id: 'new'});
  }

  stop() {
    this.endTimeSubject$.next(new Date().getTime());
    this.isActiveSubject$.next(false);
  }

  getBeginTime(task) {
    return new Date().getTime() - this.taskService.getAllTaskTime(task.periods);
  }

  ngOnDestroy() {
    this.taskFormSubscriber.unsubscribe();
  }
}
