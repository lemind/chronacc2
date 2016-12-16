import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

import { TaskService } from '../../services/task.service';

const moment = require('moment');

@Component({
  selector: 'app-task-list-item',
  templateUrl: './task-list-item.component.html',
  styleUrls: ['./task-list-item.component.css'],
  providers: [TaskService]
})
export class TaskListItemComponent implements OnInit {
  @Input() task: any;
  @Output() startTask: EventEmitter<string> = new EventEmitter<string>();

  constructor(private taskService: TaskService) { }

  ngOnInit() {
    var currentTime = this.taskService.getAllTaskTime(this.task.periods);
    this.task.time = moment.utc(currentTime).format('HH:mm:ss');
  }

}
