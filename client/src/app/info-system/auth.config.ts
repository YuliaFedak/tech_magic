import {IActor} from './actor.config';

export interface ISignUp {
  username: string,
  email: string,
  password: string,
  actor: IActor
}

export interface ILoginResponse {
  token?: string;
  message?: string;
}

export interface IToken {
  id: string;
  email: string;
  role: string;
}

export interface IActorId {
  actorId: string
}
