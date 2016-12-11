import { generateId } from '../../utils/utils';
import { Injectable } from '@angular/core';
import { NgRedux } from 'ng2-redux';
import { IAppState } from '../../store';

@Injectable()
export class TaskActions {
  static CREATE_TASK = 'CREATE_TASK';
  static CREATING_TASK = 'CREATING_TASK';
  static TASK_CREATED = 'TASK_CREATED';
  static TASK_CREATE_ERROR = 'TASK_CREATE_ERROR';

  static UPDATE_TASK = 'UPDATE_TASK';
  static TASK_UPDATED = 'TASK_UPDATED';
  static UPDATING_TASK = 'UPDATING_TASK';
  static TASK_UPDATE_ERROR = 'TASK_UPDATE_ERROR';

  static TASKS_LOADING = 'TASKS_LOADING';
  static TASKS_LOADING_ERROR = 'TASKS_LOADING_ERROR';
  static TASKS_LOADED = 'TASKS_LOADED';
  static TASK_DELETED = 'TASK_DELETED';
  static TASK_SELECTED = 'TASK_SELECTED';
  static TASK_FORM_UPDATE = 'TASK_FORM_UPDATE';
  static TASK_FORM_UPDATED = 'TASK_FORM_UPDATED';

  private dispatch;
  constructor(private ngRedux: NgRedux<IAppState>) {
    this.dispatch = ngRedux.dispatch;
  };

  updateTaskForm = (task) => {
    //will be with epics
    //this.dispatch({ type: TaskActions.TASK_FORM_UPDATE, payload: task });
    this.dispatch({ type: TaskActions.TASK_FORM_UPDATED, payload: task });
  }

  selectTask = (task) => {
    const selectedTask = Object.assign({}, { currentTask: task });
    this.dispatch({ type: TaskActions.TASK_SELECTED, payload: selectedTask });
  };

  submitTask = (task) => {
    if (!task.id || task.id === 'new') {
      this.createTask(task);
    } else {
      this.updateTask(task);
    }
  };

  createTask = ({name, periods}) => {
    const id = generateId();
    let newTask = {id, name, periods: periods || []};
    this.dispatch({
      //type: TaskActions.CREATE_TASK, //will be with epics and back-end
      type: TaskActions.TASK_CREATED,
      payload: newTask
    });
    this.selectTask(newTask);
  };

  updateTask = (task) => {
    //this.dispatch({ type: TaskActions.UPDATE_TASK, payload: task });
    this.dispatch({ type: TaskActions.TASK_UPDATED, payload: task });
  };

}
