import {IHydrateAction} from './core';

export const CONFIG_FETCH_REQUESTED = 'config/FETCH_REQUESTED'
export const CONFIG_FETCH_FAILED = 'config/FETCH_FAILED'
export const CONFIG_FETCH_SUCCESSFUL = 'config/FETCH_SUCCESSFUL'

export interface IFetchConfigSuccessfulAction {
  type: typeof CONFIG_FETCH_SUCCESSFUL,
  payload: any
}

export interface IFetchConfigFailedAction {
  type: typeof CONFIG_FETCH_FAILED,
  error: any
}

export interface IFetchConfigAction {
  type: typeof CONFIG_FETCH_REQUESTED
}

export const fetchConfigSuccess = (payload) => ({
  type: CONFIG_FETCH_SUCCESSFUL,
  payload
})

export const fetchConfigFailure = (error) => ({
  type: CONFIG_FETCH_FAILED,
  error
})

export const fetchConfig = () => ({
  type: CONFIG_FETCH_REQUESTED,
})

export type ConfigAction =
    IHydrateAction
    | IFetchConfigAction
    | IFetchConfigFailedAction
    | IFetchConfigSuccessfulAction
