interface ITask {
  id: string;
  name: string;
  active: boolean,
  periods: IPeriod[];
};

interface ITasks extends Array<ITask> { }

export { ITask, ITasks };

interface IPeriod {
  begin: string;
  end: string;
};

export { IPeriod };
