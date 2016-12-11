import { combineReducers } from 'redux';
import { tasks, ITasks, ITask, TaskActions } from './tasks';
import { taskActive, ITaskActive} from './task-active';

export interface IAppState {
  tasks?: ITasks;
  taskActive?: ITaskActive;
};

export const rootReducer = combineReducers<IAppState>({
  tasks,
  taskActive
});
