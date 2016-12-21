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
  @Input() currentTask: Observable<any>;
  taskList$: Observable<ITasks>;

  constructor(private taskActions: TaskActions) { }

  ngOnInit() {
    this.currentTask.subscribe(currentTask => {
      this.taskList$ = this.tasks.map(tasks => {
        tasks.map(task => {
          task.active = (!!currentTask && currentTask.id === task.id);
        });
        return tasks.slice().reverse();
      });
    });
  }

  startTask(task) {
    this.taskActions.selectTask(task);
  }

}
