import { Injectable } from '@angular/core';

const moment = require('moment');

@Injectable()
export class TaskService {

  constructor() { }

  getAllTaskTime(periods) {
    let allTaskTime: number;

    allTaskTime = periods.reduce((acc, period) => {
      if (period.end !== '') {
        return acc += (period.end - period.begin);
      }
    }, 0);

    return allTaskTime || 0;
  }

  lastPeriodIsCurrentDay(periods) {
    let lastPeriodEndTime = periods[periods.length - 1].end;
    if (lastPeriodEndTime === '') return true;

    return moment(new Date().getTime()).startOf('day').isSame(moment(lastPeriodEndTime, 'x').startOf('day'))
  }

}
