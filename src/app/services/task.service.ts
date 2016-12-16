import { Injectable } from '@angular/core';

@Injectable()
export class TaskService {

  constructor() { }

  getAllTaskTime(periods) {
    let allTaskTime: number;
    allTaskTime = periods.reduce((acc, period) => {
      return acc += (period.end - period.begin);
    }, 0);

    return allTaskTime;
  }

}
