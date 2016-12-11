interface ITask {
  id: string;
  name: string;
  periods: IPeriod[];
};

interface ITasks extends Array<ITask> { }

export { ITask, ITasks };

interface IPeriod {
  task: ITask;
  begin: string;
  end: string;
};

export { IPeriod };
