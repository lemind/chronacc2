import { Component, OnInit, Input } from '@angular/core';
import { Observable } from 'rxjs';

import { ITasks, TaskActions } from '../../store/tasks';

@Component({
  selector: 'app-task-list',
  templateUrl: './task-list.component.html',
  styleUrls: ['./task-list.component.css'],
  providers: [TaskActions]
})
export class TaskListComponent implements OnInit {
  @Input() tasks: Observable<ITasks>;
  taskList$: Observable<ITasks>;

  constructor(private taskActions: TaskActions) { }

  ngOnInit() {
    this.taskList$ = this.tasks.map(t => {
      return t.slice().reverse();
    })
  }

  startTask(task) {
    this.taskActions.selectTask(task);
  }

}
