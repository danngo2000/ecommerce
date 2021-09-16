import { createSlice } from "@reduxjs/toolkit";
// import produce from "immer";

// /* ######### interfaces ######## */
// interface AuthState {
//   isGuest: boolean;
//   token?: string;
//   tokenValidated: boolean;
// }
// /** init and define type */
// const initialState = {
//   isGuest: true,
//   token: "",
//   tokenValidated: false,
// } as AuthState;
// /** creat reducers and actions */
// const authSlice = createSlice({
//   name: "authV1",
//   initialState,
//   reducers: {
//     /** call when dispatch action login */
//     loginRequest: (state, action) => {
//       return produce(state, (draft) => {
//         return draft;
//       });
//     },
//     loginSuccess: (state, action) => {
//       return produce(state, (draft) => {
//         draft.token = action.payload.token;
//         draft.isGuest = !action.payload.customer;
//         draft.tokenValidated = true;
//         return draft;
//       });
//     },
//     loginFailure: (state) => {
//       return produce(state, (draft) => {
//         return draft;
//       });
//     },
//     /** call when dispatch action validate token */
//     tokenValidateRequest: (state) => state,
//     tokenValidateSuccess: (state, action) => {
//       return produce(state, (draft) => {
//         return draft;
//       });
//     },
//     tokenValidateFailuer: (state) => {
//       return produce(state, (draft) => {
//         return draft;
//       });
//     },
//     /** call when dispatch action get token */
//     getTokenRequest: (state) => state,
//     getTokenSuccess: (state) => state,
//     getTokenFailure: (state) => state,
//     /** call when dispatch action logout */
//     logoutRequest: (state, action) => state,
//     logoutSuccess: (state) => {
//       return produce(state, (draft) => {
//         draft.isGuest = true;
//         return draft;
//       });
//     },
//     logoutFailure: (state) => state,
//   },
// });

// /** export actions */
// export const AuthActions = authSlice.actions;

// /** export reducers */
// export default authSlice.reducer;
