import {HYDRATE} from 'next-redux-wrapper';

export interface IHydrateAction {
  type: typeof HYDRATE,
  payload: any,
  error?: any
}

export interface IPayload{
  req?:any,
  ID?:string
}
