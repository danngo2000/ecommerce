import { createSlice } from "@reduxjs/toolkit";
import produce from "immer";

/* ######### interfaces ######## */
interface AuthState {
  isGuest: boolean;
  token?: string;
  tokenValidated: boolean;
}
/** init and define type */
const initialState = {
  isGuest: true,
  token: "",
  tokenValidated: false,
} as AuthState;
/** creat reducers and actions */
const authSlice = createSlice({
  name: "authV1",
  initialState,
  reducers: {
    /** call when dispatch action login */
    LOGIN_REQUEST: (state, action) => {
      return produce(state, (draft) => {
        return draft;
      });
    },
    LOGIN_SUCCESS: (state, action) => {
      return produce(state, (draft) => {
        draft.token = action.payload.token;
        draft.isGuest = !action.payload.customer;
        draft.tokenValidated = true;
        return draft;
      });
    },
    LOGIN_FAILURE: (state) => {
      return produce(state, (draft) => {
        return draft;
      });
    },
    /** call when dispatch action validate token */
    TOKEN_VALIDATE_REQUEST: (state) => state,
    TOKEN_VALIDATE_SUCCESS: (state, action) => {
      return produce(state, (draft) => {
        return draft;
      });
    },
    TOKEN_VALIDATE_FAILURE: (state) => {
      return produce(state, (draft) => {
        return draft;
      });
    },
    /** call when dispatch action get token */
    GET_TOKEN_REQUEST: (state) => state,
    GET_TOKEN_SUCCESS: (state) => state,
    GET_TOKEN_FAILURE: (state) => state,
    /** call when dispatch action logout */
    LOGOUT_REQUEST: (state, action) => state,
    LOGOUT_SUCCESS: (state) => {
      return produce(state, (draft) => {
        draft.isGuest = true;
        return draft;
      });
    },
    LOGOUT_FAILURE: (state) => state,
  },
});

/** export actions */
export const AuthActions = authSlice.actions;

/** export reducers */
export default authSlice.reducer;
