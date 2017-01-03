import { Component } from '@angular/core';
import { Observable, Subject, BehaviorSubject } from 'rxjs';
import { TaskActions } from './store/tasks';
import { select } from 'ng2-redux';

import { ITask } from './store/tasks';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  providers: [TaskActions]
})
export class AppComponent {
  title = 'Chronacc';

  tasksSubject$: Subject<any[]> = new Subject<any[]>();
  @select(['taskActive', 'currentTask']) currentTask$: Observable<any>;
  @select(['taskActive', 'isActive']) currentTaskIsActive$: Observable<boolean>;
  @select() tasks$: Observable<ITask[]>;

  constructor(private taskActions: TaskActions) {
  }

  submitTask(taskModel) {
    this.taskActions.submitTask(taskModel);
  }
}
