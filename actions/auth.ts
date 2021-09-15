import {IHydrateAction} from './core';
import {ICart, ICustomer, ISignUpPayload} from 'interfaces';
import {IFacebookLoginPayload, IGoogleLoginPayload, LoginPayload} from 'interfaces/ILoginPayload';

export const AUTH_LOGIN_REQUEST = 'auth/LOGIN_REQUEST'
export const AUTH_LOGIN_SUCCESSFUL = 'auth/LOGIN_SUCCESSFUL'
export const AUTH_LOGIN_FAILED = 'auth/LOGIN_FAILED'
export const AUTH_LOGIN_CANCELED = 'auth/LOGIN_CANCELED'

export const AUTH_LOGOUT_REQUEST = 'auth/LOGOUT_REQUEST'
export const AUTH_LOGOUT_SUCCESSFUL = 'auth/LOGOUT_SUCCESSFUL'

export const AUTH_SIGHUP_REQUEST = 'auth/SIGHUP_REQUEST'

export const AUTH_CHANGE_PASSWORD_REQUEST = 'auth/CHANGE_PASSWORD_REQUEST'

export interface IChancePasswordRequestAction {
  type: typeof AUTH_CHANGE_PASSWORD_REQUEST,
  payload: {
    passwordToken: string,
    newPassword: string
  }
}

export interface ILoginRequestAction {
  type: typeof AUTH_LOGIN_REQUEST,
  payload: LoginPayload
}

export interface ILoginSuccessAction {
  type: typeof AUTH_LOGIN_SUCCESSFUL,
  payload: {
    token: string,
    customer: ICustomer
    cart?: ICart
  }
}

export interface ILoginFailureAction {
  type: typeof AUTH_LOGIN_FAILED,
  error: any
}

export interface ILogoutRequestAction {
  type: typeof AUTH_LOGOUT_REQUEST
}

export interface ILogoutSuccessAction {
  type: typeof AUTH_LOGOUT_SUCCESSFUL
  payload: { token: string }
}

export interface ISignUpRequestAction {
  type: typeof AUTH_SIGHUP_REQUEST
  payload: ISignUpPayload
}

export interface ISignUpSuccessAction {
  type: typeof AUTH_SIGHUP_REQUEST
}

export const loginRequestSuccess = (token: string, customer: ICustomer, cart?: ICart): AuthAction => ({
  type: AUTH_LOGIN_SUCCESSFUL,
  payload: { token, customer, cart }
})

export const logoutRequest = (): AuthAction => ({
  type: AUTH_LOGOUT_REQUEST
})

export const logoutRequestSuccess = (token: string): AuthAction => ({
  type: AUTH_LOGOUT_SUCCESSFUL,
  payload: { token }
})

export const loginRequestFailure = (error): AuthAction => ({
  type: AUTH_LOGIN_FAILED,
  error
})

export const registerRequest = (form: ISignUpPayload): AuthAction => ({
  type: AUTH_SIGHUP_REQUEST,
  payload: form
})

export const changePasswordRequest = (passwordToken: string, newPassword: string): AuthAction => ({
  type: AUTH_CHANGE_PASSWORD_REQUEST,
  payload: { passwordToken, newPassword }
})

export function loginRequest (object: IFacebookLoginPayload): AuthAction;
export function loginRequest (object: IGoogleLoginPayload): AuthAction;
export function loginRequest (email: string, password: string): AuthAction;
export function loginRequest (arg1: any, password?: any): AuthAction {
  return {
    type: AUTH_LOGIN_REQUEST,
    payload: typeof arg1 === 'object'
      ? arg1
      : { email: arg1, password }
  }
}

export type AuthAction = IHydrateAction
  | ILoginRequestAction
  | ILoginSuccessAction
  | ILoginFailureAction
  | ILogoutRequestAction
  | ILogoutSuccessAction
  | ISignUpSuccessAction
  | ISignUpRequestAction
  | IChancePasswordRequestAction