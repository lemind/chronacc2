import { ITask } from '../tasks';

export interface ITaskActive  {
  isActive: boolean;
  isPending: boolean;
  currentTask: ITask;
};
