import axios from "axios";
// import dayjs from "dayjs";
// import jwt from "jsonwebtoken";
// import { put, call } from "redux-saga/effects";
// /* ######### actions ######## */
// import { AuthActions } from "../reducers/authV1";

// /* ######### utils ######## */
// import { createFuncRootSaga } from "../../utils/redux";
// /* ######### interface ######## */
// import { Action } from "store/interfaces";

// /* ######### api ######## */
// import { AuthAPI } from "../../api";
// import { CartActions } from "actions/cart";

// const saveToken = (token: string) => {
//   window.localStorage.setItem("token", token);
//   axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
// };

// function* handleGetToken() {
//   try {
//     const res = yield call(AuthAPI.tokenRequest);
//     if (res && res.token) {
//       yield call(saveToken, res.token);
//       yield put(AuthActions.getTokenSuccess());
//     }
//   } catch (e) {
//     console.log("e", e);
//     yield put(AuthActions.getTokenFailure());
//   }
// }

// function* handleTokenValidate() {
//   try {
//     let token = window.localStorage.getItem("token");
//     let tokenExpired = false;
//     if (token != null) {
//       const decoded: any = jwt.decode(token);
//       if (
//         decoded != null &&
//         Object.entries(decoded).length > 0 &&
//         decoded.exp
//       ) {
//         const dateExpired = dayjs(decoded.exp * 1000);
//         if (dayjs().isAfter(dateExpired)) {
//           tokenExpired = true;
//         }
//       }
//       const isGuest = !decoded.customer;
//       const aioData: { customer: any; cart: any } = yield call(
//         AuthAPI.allInOneRequest,
//         isGuest,
//         !isGuest ? decoded.customer._id : undefined
//       );
//       yield put(AuthActions.loginSuccess(aioData));
//       if (aioData.cart) yield put(CartActions.cartSuccess(aioData.cart));
//     }
//     if (!token || token === "undefined" || tokenExpired) {
//       yield put(AuthActions.getTokenRequest());
//     }
//   } catch (e) {
//     console.log("e", e);
//     yield put(AuthActions.tokenValidateFailuer());
//   }
// }

// function* handleLogin({ payload }: Action) {
//   try {
//     // const refCode = window.localStorage.getItem("refCode");
//     const { req, cb } = payload;
//     let res = null;
//     switch (req.type) {
//       case "default":
//         res = yield call(AuthAPI.loginDefault, req);
//         break;
//       case "google":
//         res = yield call(AuthAPI.googleLoginRequest, { ...req });
//         break;
//       case "facebook":
//         res = yield call(AuthAPI.facebookLoginRequest, req);
//         break;
//       default:
//         yield put(AuthActions.loginFailure());
//         return;
//     }
//     if (res != null) {
//       const { token } = res;
//       yield call(saveToken, token);
//       yield put(AuthActions.loginSuccess(res));
//       if (cb && typeof cb === "function") yield cb({ isLogin: true });
//     } else yield put(AuthActions.loginFailure());
//   } catch (e) {
//     console.log("e", e);
//     yield put(AuthActions.loginFailure());
//   }
// }

// function* handleLogout({ payload }: Action) {
//   try {
//     const { cb } = payload;
//     if (cb && typeof cb === "function") yield cb({ isSuccess: true });
//     yield put(AuthActions.getTokenRequest());
//     yield put(AuthActions.logoutSuccess());
//   } catch (e) {
//     yield put(AuthActions.logoutFailure());
//   }
// }

// const getTokenSaga = {
//   on: AuthActions.getTokenRequest,
//   worker: handleGetToken,
// };
// const tokenValidateSaga = {
//   on: AuthActions.tokenValidateRequest,
//   worker: handleTokenValidate,
// };
// const loginSaga = {
//   on: AuthActions.loginRequest,
//   worker: handleLogin,
// };

// const logoutSaga = {
//   on: AuthActions.logoutRequest,
//   worker: handleLogout,
// };

// export default createFuncRootSaga([
//   getTokenSaga,
//   tokenValidateSaga,
//   loginSaga,
//   logoutSaga,
// ]);
