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

  beginTime$: Observable<any>;
  beginTimeSubject$: Subject<any> = new Subject<any>();

  endTime$: Observable<any>;
  endTimeSubject$: Subject<any> = new Subject<any>();

  periods$: Observable<any[]>;
  taskFormSubscriber: any;
  lastTwoCurrentTasks: Observable<ITask[]>;
  isNextOne: boolean = false;

  constructor(
      private taskActions: TaskActions,
      private fb: FormBuilder,
      private taskService: TaskService
    ) {}

  ngOnInit() {
    this.beginTime$ = this.beginTimeSubject$;
    this.endTime$ = this.endTimeSubject$;

    this.lastTwoCurrentTasks = this.currentTask$.pairwise();

    this.currentTask$
      .withLatestFrom(
        this.isActive,
        this.lastTwoCurrentTasks,
        (currentTask: ITask, isActive, lastTwoCurrentTasks) =>
        ({isActive, currentTask, lastTwoCurrentTasks}))
      .subscribe(n => {
        if (!!n.isActive && n.currentTask) {
          let prevTask = n.lastTwoCurrentTasks[0];
          let task = n.lastTwoCurrentTasks[1];
          if (prevTask
            && task
            && prevTask.id !== task.id) {
            this.isNextOne = true;
            this.stop();
          }
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
        this.lastTwoCurrentTasks,
        (end, begin, currentTask: ITask, lastTwoCurrentTasks) =>
        ({end, begin, currentTask, lastTwoCurrentTasks}))
      .subscribe(n => {
        let actualBeginTime = n.begin + this.taskService.getAllTaskTime(n.currentTask.periods);
        let period: IPeriod = {begin: actualBeginTime, end: n.end};
        n.currentTask.periods.push(period);
        this.submitTask.emit(n.currentTask);
        !this.isNextOne && this.taskActions.clearSelectedTask();
        this.isNextOne = false;
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

    this.submitTask.emit(task || {id: 'new'});
  }

  stop() {
    this.endTimeSubject$.next(new Date().getTime());
  }

  getBeginTime(task) {
    return new Date().getTime() - this.taskService.getAllTaskTime(task.periods);
  }

  ngOnDestroy() {
    this.taskFormSubscriber.unsubscribe();
  }
}
