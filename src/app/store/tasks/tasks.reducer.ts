//add actions
import { TaskActions } from './task.actions';
import { ITasks } from './task.types';

const INITIAL_STATE: ITasks = [];

const { TASK_CREATED, TASK_DELETED, TASKS_LOADED, TASK_UPDATED } = TaskActions;

export const tasks = (state: ITasks = INITIAL_STATE, action) => {

  switch (action.type) {
    case TASK_DELETED:
      return state.filter(n => n.id !== action.payload.id);
    case TASKS_LOADED:
      return [...action.payload];
    case TASK_CREATED:
      return [...state, action.payload];
    case TASK_UPDATED:
    return state.map(n => {
      return n.id !== action.payload.id ? n : Object.assign({}, n, action.payload);
    });
    default:
      return state;
  }

};
