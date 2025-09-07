import {IActor} from './actor.config';

export interface IPerformance {
  _id: string;
  name: string;
  year: string;
  budget: number;
  actors: IActor[]
}

export interface IUpdatePerformance {
  name?: string;
  year?: string;
  budget?: number;
  actors?: IActor[]
}

export interface IPerformanceDialogData {
  title: string;
  buttonName: string;
  form?: {
    _id: string;
    name?: string;
    year?: string;
    budget?: string;
    actors?: IPerformance[];
  };
}
