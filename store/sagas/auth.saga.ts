import jwt from 'jsonwebtoken'
import axios from 'axios'
import {take, fork, put, cancelled, cancel, call, select} from 'redux-saga/effects';
import {
  FacebookLoginPayload,
  GoogleLoginPayload,
  LoginResponseData, SignUpPayload,
  LoginPayload,
  Customer
} from '../interfaces'
import {RootState} from 'store/index';
import {
  allInOneRequest, changePasswordRequest,
  facebookLoginRequest,
  googleLoginRequest,
  loginRequest, registerRequest,
  tokenRequest
} from '../services/auth';
// import {toggleCartLoading} from 'actions/ui'
import Router from 'next/router';
// import {publicKeysSelector} from 'store/config/config.selector'

import { AuthState, AUTH_SIGHUP_REQUEST,
  loginRequestSuccess, logoutRequestSuccess,
  authLogoutRequest, AUTH_CHANGE_PASSWORD_REQUEST,
  AUTH_LOGIN_REQUEST, AUTH_LOGIN_FAILED, loginFailure,
} from 'actions/auth'

const isServer = typeof window !== 'object'

const validateCaptcha = (action = 'login', publicKey?: string) => {
    return new Promise((res, rej) => {
      const grecaptcha = (<any>window).grecaptcha
      if (!publicKey || !grecaptcha) return res(null)
      grecaptcha.ready(() => {
        grecaptcha
            .execute(publicKey,{ action })
            .then((token: AuthState) => { return res(token) })
            .catch(rej)
      })
  })
}

const saveToken = (token: string) => {
  window.localStorage.setItem('token', token)
  axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
}

function* initialTokenValidate() {
  try {
    let token = window.localStorage.getItem('token')
    if(token==null) token =''
    let tokenExpired = false
    let decodedTokenStorage:any = jwt.decode(token)
    if (decodedTokenStorage && decodedTokenStorage.exp && Date.now() >= decodedTokenStorage.exp * 1000) tokenExpired = true
    if (!token || token === 'undefined' || tokenExpired) {
      ({ token } = yield call(tokenRequest))
      if(token==null) token =''//add new
      window.localStorage.setItem('token', token)
    }
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
    let decodedToken: any= jwt.decode(token)
    const isGuest = !decodedToken.customer
    const aioData:{customer:any, cart:any} = yield call(allInOneRequest, isGuest, decodedToken.customer ? decodedToken.customer._id : undefined)
    const { customer, cart } = aioData
    yield put(loginRequestSuccess(token, customer, cart))
    // yield put(toggleCartLoading(false))
    return isGuest
  } catch (e) {
    const { token } = yield call(tokenRequest)
    window.localStorage.setItem('token', token)
    console.error(e)
    return null
  }
}

function* login(payload: LoginPayload | GoogleLoginPayload | FacebookLoginPayload, originalToken:any) {
  let data: LoginResponseData
  try {
    const refCode = window.localStorage.getItem('refCode')
    if ((<GoogleLoginPayload>payload).googleToken) {
      data = yield call(googleLoginRequest, (<GoogleLoginPayload>payload).googleToken, originalToken, refCode)
    } else if ((<FacebookLoginPayload>payload).facebookToken) {
      data = yield call(facebookLoginRequest, (<FacebookLoginPayload>payload), originalToken)
    } else {
      const { password, email } = payload as LoginPayload
      data = yield call(loginRequest, email, password,  originalToken)
    }
    const { token, customer, cart } = data
    yield call(saveToken, token)
    yield put(loginRequestSuccess(token, customer, cart))
    window.localStorage.removeItem('refCode')
  } catch (error:any) {
    console.error(error.message)
    // yield put({type: AUTH_LOGIN_FAILED, error: error.message || error.data })
    yield put(loginFailure())
  } finally {
    if (yield cancelled()) {
      yield put(loginFailure())
    }
  }
}

function* changePassword(action:any) {
  try {
    // const stateToken = yield select((state: RootState) => state.auth.token)
    const { token, customer } = yield call(changePasswordRequest, action.payload)
    yield call(saveToken, token)
    yield put(loginRequestSuccess(token, customer))
    yield call(Router.push, '/')
  } catch (e:any) {
    console.error(e.message)
  }
}

function* logout() {
  const { token } = yield call(tokenRequest)
  window.localStorage.setItem('token', token)
  axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
  yield put(logoutRequestSuccess(token))
  yield call(Router.push, '/')
}

function* register(form: SignUpPayload, cartToken:any) {
  const { firstName, lastName , email, phone_number, password, captcha, birthday, gender } = form
//   const { recaptcha: recaptchaKey } = yield select(publicKeysSelector)
  const captchaToken = null // yield call(validateCaptcha, 'register', recaptchaKey)

  const q = {
    customer: {
      first_name: firstName,
      last_name: lastName,
      email,
      password,
      captcha,
      birthday,
      gender,
      phone_number
    },
    refCode: window.localStorage.getItem('refCode'),
    cartToken,
    captchaToken
  }

  const data: {token:any, customer:any, cart:any} = yield call(registerRequest, q)
  const { token, customer, cart } = data
  window.localStorage.removeItem('refCode')
  if (customer && token) {
    yield call(saveToken, token)
    yield put(loginRequestSuccess(token, customer, cart))
  }
}

export default function* authSaga() {
  let isGuest: boolean | null = null
  if (!isServer) {
    isGuest = yield call(initialTokenValidate)
  }

  while (!isServer) {
    if (!isGuest) {
      yield take(`${authLogoutRequest}`)
      yield call(logout)
    }
    let action: {type:any,payload:any} = yield take([
      AUTH_LOGIN_REQUEST,
      AUTH_SIGHUP_REQUEST,
      AUTH_CHANGE_PASSWORD_REQUEST
    ])
    let task:any[] =[]
    const token: {} = yield select((state: RootState) => state.auth.token)

    if (action.type === AUTH_LOGIN_REQUEST) task = yield fork(login, action.payload, token)
    else if(action.type === AUTH_SIGHUP_REQUEST) task = yield fork(register, action.payload, token)
    else if (action.type === AUTH_CHANGE_PASSWORD_REQUEST) task = yield fork(changePassword, action)

    action = yield take([
      `${authLogoutRequest}`,
      AUTH_SIGHUP_REQUEST,
      AUTH_LOGIN_FAILED
    ])

    switch (action.type) {
      case `${authLogoutRequest}`:
        yield cancel(task)
        yield call(logout)
        break
      case AUTH_CHANGE_PASSWORD_REQUEST:
        yield call(changePassword, action)
        break
      case AUTH_LOGIN_FAILED:
        break
    }
  }
}