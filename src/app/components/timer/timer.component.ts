import { Component, OnInit, Output, Input, EventEmitter } from '@angular/core';
import { Observable } from 'rxjs';

const moment = require('moment');

@Component({
  selector: 'app-timer',
  templateUrl: './timer.component.html',
  styleUrls: ['./timer.component.css']
})
export class TimerComponent implements OnInit {
  time$: Observable<any>;
  @Input() isActive: boolean;
  @Input() beginTime: any;
  @Output() start = new EventEmitter<any>();
  @Output() stop = new EventEmitter<any>();

  constructor() { }

  ngOnInit() {
    this.time$ = Observable.interval(1000).map(f => {
      let currentTime = new Date().getTime() - this.beginTime;
      return this.isActive ? moment.utc(currentTime).format('HH:mm:ss') : '';
    });
  }

}
