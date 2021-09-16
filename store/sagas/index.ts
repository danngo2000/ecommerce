// import { createForkSagas } from "../../utils/redux";
// import {fork,all} from 'redux-saga/effects'
// import configSaga from "./config.saga";
// import categoriesSaga from "./categories.saga";
// // import authV1Saga from "./authV1";
// import authSaga from "./auth.saga";
// import bookingSaga from "./booking.saga";
// import cartSaga from "./cart";
// import checkoutSaga from "./checkout.saga";

// export default createForkSagas([
//   configSaga,
//   categoriesSaga,
//   authSaga,
//   // authV1Saga,
//   bookingSaga,
//   cartSaga,
//   checkoutSaga
// ]);
// // export default function* root(){
// //   yield all([
// //     fork(cartSaga),
// //     fork(configSaga),
// //     fork(categoriesSaga),
// //     fork(authV1Saga),
// //   ])
// // }

import {fork} from 'redux-saga/effects';
import configSaga from "./config.saga";
import categoriesSaga from './categories.saga';
import authSaga from './auth.saga';
import bookingSaga from './booking.saga';
import cartSaga from './cart';
import checkoutSaga from './checkout.saga';

function* index() {
    yield fork(configSaga)
    yield fork(categoriesSaga)
    yield fork(authSaga)
    yield fork(bookingSaga)
    yield fork(cartSaga)
    yield fork(checkoutSaga)
}

export default index