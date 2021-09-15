import { put, call } from "redux-saga/effects";
/* ######### actions ######## */
import { CartActions } from "../reducers/cart";

/* ######### utils ######## */
import { createFuncRootSaga } from "../../utils/redux";

/* ######### api ######## */
import { CartAPI } from "../../api";
import { Action } from "store/interfaces";

function* handleGetCart() {
  try {
    const res = yield call(CartAPI.VerifyCarts);
    if (res && res.cart) {
      yield put(CartActions.CART_SUCCESS(res.cart));
    }
  } catch (e) {
    yield put(CartActions.CART_FAILED());
  }
}

function* handleUpdateCart({ payload }: Action) {
  try {
    const { req } = payload;
    const res = yield call(CartAPI.UpdateCart, req);
    if (res && res.cart) {
      yield put(CartActions.UPDATE_CART_SUCCESS(res.cart));
      if(req?.action_type === 'add_to_cart')
        yield put(CartActions.REMOTE_POPUP_ADD_TO_CART(true))
    }
  } catch (e) {
    yield put(CartActions.UPDATE_CART_FAILED());
  }
}

const cartSaga = {
  on: CartActions.CART_REQUEST,
  worker: handleGetCart,
};
const addToCartSaga = {
  on: CartActions.UPDATE_CART_REQUEST,
  worker: handleUpdateCart,
};

export default createFuncRootSaga([cartSaga, addToCartSaga]);
