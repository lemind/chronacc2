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

  beginTime: any;
  endTime: any;

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
    this.lastTwoCurrentTasks = this.currentTask$.pairwise();

    this.currentTask$
      .withLatestFrom(
        this.lastTwoCurrentTasks,
        (currentTask: ITask, lastTwoCurrentTasks) =>
        ({currentTask, lastTwoCurrentTasks}))
      .subscribe(n => {
        if (n.currentTask) {
          let prevTask = n.lastTwoCurrentTasks[0];
          let task = n.lastTwoCurrentTasks[1];

          if (prevTask
            && task
            && prevTask.id !== task.id) {
              this.isNextOne = true;
              this.stop();
              this.start(n.currentTask);
          }

          if (!prevTask || !task) {
            this.start(n.currentTask);
          }

        }
      });

    this.taskForm = this.fb.group({
      id: [],
      name: [],
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
    if (task) {
      this.beginTime = this.getBeginTime(task);
    } else {
      this.beginTime = new Date().getTime();
      this.submitTask.emit({id: 'new'});
    }
  }

  stop() {
    this.endTime = new Date().getTime();

    let actualBeginTime = this.beginTime + this.taskService.getAllTaskTime(this.task.periods);
    let period: IPeriod = {begin: actualBeginTime, end: this.endTime};
    this.task.periods.push(period);
    this.submitTask.emit(this.task);
    !this.isNextOne && this.taskActions.clearSelectedTask();
    this.isNextOne = false;
  }

  getBeginTime(task) {
    return new Date().getTime() - this.taskService.getAllTaskTime(task.periods);
  }

  ngOnDestroy() {
    this.taskFormSubscriber.unsubscribe();
  }
}
