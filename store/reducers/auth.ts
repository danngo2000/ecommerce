import {
  createAction,
  createSlice,
  PayloadAction,
  PayloadActionCreator,
} from "@reduxjs/toolkit";
import produce from "immer";
import { SignUpPayload } from "../interfaces";


export type AuthState = {
  isGuest: boolean;
  token?: string;
  tokenValidated: boolean;
};
const initialState: AuthState = {
  isGuest: true,
  token: "",
  tokenValidated: false,
};

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    loginRequestSuccess: {
      reducer: (state, action: PayloadAction<any>) => {
        return produce(state, (draft) => {
          draft.token = action.payload.token;
          draft.isGuest = !action.payload.customer;
          draft.tokenValidated = true;
          return draft;
        });
      },
      prepare: (token, customer, cart?) => {
        return { payload: { token, customer, cart } };
      },
    },
    logoutRequestSuccess: (state, action) => {
      return produce(state, (draft) => {
        draft.token = action.payload.token;
        draft.isGuest = true;
        return draft;
      });
    },
    loginFailure: (state) => {
      return produce(state, (draft) => {
        return draft;
      });
    },
   
  },
    // extraReducers: (builder) => {
    //   builder.addCase(AuthActions.logoutSuccess,(state, action: any) => {
    //     return produce(state, (draft) => {
    //       draft.isGuest = true;
    //       return draft;
    //     });
    //   })

    // }
});

/** Just use for authsaga */
export const AUTH_LOGIN_FAILED = "auth/LOGIN_FAILED";
export const AUTH_LOGIN_REQUEST = "auth/LOGIN_REQUEST";
export const AUTH_CHANGE_PASSWORD_REQUEST = "auth/CHANGE_PASSWORD_REQUEST";
export const AUTH_SIGHUP_REQUEST = "auth/SIGHUP_REQUEST";
/** ---------------------- */

export const authLogoutRequest = createAction("auth/LOGOUT_REQUEST");
export const loginRequest = createAction(
  "auth/LOGIN_REQUEST",
  (arg1: any, password?: any) => ({
    payload: typeof arg1 === "object" ? arg1 : { email: arg1, password },
  })
);
export const changePasswordRequest = createAction(
  "auth/CHANGE_PASSWORD_REQUEST",
  (passwordToken: string, newPassword: string) => ({
    payload: { passwordToken, newPassword },
  })
);
export const registerRequest = createAction(
  "auth/SIGHUP_REQUEST",
  (form: SignUpPayload) => ({ payload: form })
);

export const { loginRequestSuccess, logoutRequestSuccess, loginFailure } = authSlice.actions;
export const authReducer = authSlice.reducer;
