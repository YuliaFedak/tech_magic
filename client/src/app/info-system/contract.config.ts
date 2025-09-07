import {IPerformance} from './performance.config';

export interface IContract {
  _id: string;
  actor: string;
  performance: IPerformance;
  role: string;
  salary: number;
}

export interface IContractDialogData {
  title: string;
  buttonName: string;
  actor: string;
  form?: {
    _id: string;
    performance?: string;
    role?: string;
    salary?: number;
  };
}
