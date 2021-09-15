import {IHydrateAction} from './core';

export const CATEGORIES_FETCH_SUCCESSFUL = 'categories/FETCH_SUCCESSFUL'
export const CATEGORIES_FETCH_REQUESTED = 'categories/FETCH_REQUESTED'
export const CATEGORIES_FETCH_FAILED = 'categories/FETCH_FAILED'

export interface IFetchCategoriesSuccessfulAction {
  type: typeof CATEGORIES_FETCH_SUCCESSFUL,
  payload: any
}

export interface IFetchCategoriesFailedAction {
  type: typeof CATEGORIES_FETCH_FAILED,
  error: any
}

export interface IFetchCategoriesAction {
  type: typeof CATEGORIES_FETCH_REQUESTED
}

export const fetchCategoriesSuccess = (payload) => ({
  type: CATEGORIES_FETCH_SUCCESSFUL,
  payload
})

export const fetchCategoriesFailure = (error) => ({
  type: CATEGORIES_FETCH_FAILED,
  error
})

export const fetchCategories = () => ({
  type: CATEGORIES_FETCH_REQUESTED,
})

export type CategoriesActions =
    IHydrateAction
    | IFetchCategoriesSuccessfulAction
    | IFetchCategoriesFailedAction
    | IFetchCategoriesAction