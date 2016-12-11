import { TaskActions } from '../tasks';
import { ITaskActive } from './task-active.types';
import { INITIAL_STATE } from './task-active.initial-state';

let setPending = (state, isPending) => Object.assign({}, state, { isPending });

let { TASK_SELECTED,
  UPDATING_TASK,
  CREATING_TASK,
  TASK_CREATED,
  TASK_UPDATED,
  TASK_UPDATE_ERROR,
  TASK_CREATE_ERROR, TASK_FORM_UPDATED } = TaskActions;

export const taskActive = (state: ITaskActive = INITIAL_STATE, action) => {

  switch (action.type) {
    case TASK_FORM_UPDATED:
    return Object.assign({},
      state,
      {currentTask: action.payload});
    case TASK_SELECTED:
      return Object.assign({},
        state,
        { isActive: true },
        action.payload);
    case UPDATING_TASK:
    case CREATING_TASK:
      return setPending(state, true);
    case TASK_CREATED:
    case TASK_UPDATED:
    case TASK_UPDATE_ERROR:
    case TASK_CREATE_ERROR:
      return setPending(state, false);
    default:
      return state;
  }
};
