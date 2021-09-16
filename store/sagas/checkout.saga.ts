// import { put, call, select } from "redux-saga/effects";
// /* ######### actions ######## */
// import { CheckoutActions } from "../reducers/checkout";
// import { CartActions } from "../reducers/cart";

// /* ######### utils ######## */
// import { createFuncRootSaga } from "../../utils/redux";

// /* ######### api ######## */
// import { CheckoutAPI } from "../../api";
// import { Action } from "store/interfaces";
// import { calculateGrandTotal } from "utils/cart";
// import { RootState } from "store";
// import Router from 'next/router'


// function* placeOrder () {
//   try {
//     const {cartData} = yield select((state: RootState) => state.cart)
//     const customer:any = yield select((state: RootState) => state.customer)
//     // if (!isCartValid(cart, customer)) {
//     //   // notification.warning({ message: 'Not ready to checkout' })
//     //   return
//     // }
//     // if (!cartData.shipping_methods) {
//     //   // notification.error({ message: 'Please select a shipping method' })
//     //   return
//     // }
//     const data:{order:any,error:any, newQuote:any} = yield call(CheckoutAPI.placeOrderRequest,{
//       address: cartData.address,
//       payment_method: cartData.payment_method,
//       shipping_methods: cartData.shipping_methods,
//       refCode: window.localStorage.getItem('refCode'),
//     })

//     const { order, error } = data

//     if (error) {
//       console.log('errror',error);
//       // notification.error({ message: error })
//       return
//     }
//     if (!!order) {
//       yield put(CheckoutActions.setOrder(order, true, true))
//       if (data.newQuote) yield put(CartActions.updateCartRequest(data.newQuote))
//     }
//   } catch (e:any) {
//     console.error(e.message)
//     console.error(e.stack)
//   } finally {
//     // yield put(togglePlacingOrder(false))
//   }
// }

// function* goToCheckout() {
//   const {cartData} = yield select((state: RootState) => state.cart)
//   const items = cartData.items.filter(item => item.is_selected === true)
//     .map(item => {
//       return {
//         'id': item._id,
//         'name': item.name,
//         'quantity': item.qty,
//         'price': item.price
//       }
//     })
//   yield put(CheckoutActions.setOrder(null, false, false))
//   yield call(Router.push, '/checkout')
// }


// const placeOrderSaga = {
//   on: CheckoutActions.placeOrderRequest,
//   worker: placeOrder,
// };

// const gotoCheckoutSaga = {
//   on: CheckoutActions.checkoutGoToCheckout,
//   worker: goToCheckout,
// };

// export default createFuncRootSaga([placeOrderSaga, gotoCheckoutSaga]);

import { setOrder, checkoutGoToCheckout, checkoutPlaceOrderRequest } from 'actions/checkout';
import {call, put, select, takeLeading, all} from 'redux-saga/effects';
// import {notification} from 'antd';
import {RootState} from 'store/index';
import { isCartValid } from 'utils/cart';
import axios from 'axios';
import Router from 'next/router'
import {Cart, Customer} from '../interfaces';
import {updateCart} from 'actions/cart';
// import { togglePlacingOrder } from 'actions/ui';
// import { googleAnalyticEvents } from '../../lib/analytics'

const isServer = typeof window !== 'object'

const placeOrderRequest = (body: any) => axios
    .post('quotes/checkout', body)
    .then(res => res.data)

function* placeOrder () {
  try {
    // const isGuest = yield select((state: RootState) => state.auth.isGuest)
    // if (isGuest) return

    // yield put(togglePlacingOrder(true))
    const cart: Cart = yield select((state: RootState) => state.cart)
    const customer:Customer = yield select((state: RootState) => state.customer)

    if (!isCartValid(cart, customer)) {
      console.log('Not ready to checkout');
      // notification.warning({ message: 'Not ready to checkout' })
      return
    }
    if (!cart.shipping_methods) {
      console.log('Please select a shipping method');
      // notification.error({ message: 'Please select a shipping method' })
      return
    }
    const data:{order:any,error:any, newQuote:any} = yield call(placeOrderRequest, {
      address: cart.address,
      note: cart.note,
      payment_method: cart.payment_method,
      shipping_methods: cart.shipping_methods,
      promotion: cart.promotion,
      refCode: window.localStorage.getItem('refCode'),
      credit: cart.credit || 0
    })

    const { order, error } = data

    if (error) {
      console.log(error);
      // notification.error({ message: error })
      return
    }
    if (!!order) {
      yield put(setOrder(order, true, true))
      if (data.newQuote) yield put(updateCart(data.newQuote))
    }
  } catch (e:any) {
    console.error(e.message)
    console.error(e.stack)
  } finally {
    // yield put(togglePlacingOrder(false))
  }
}

function* goToCheckout() {
  // Google Analytics: Measure checkouts
  const cart: Cart = yield select((state: RootState) => state.cart)
  const items = cart.items.filter(item => item.is_selected === true)
    .map(item => {
      return {
        'id': item._id,
        'name': item.name,
        'quantity': item.qty,
        'price': item.price
      }
    })
  // googleAnalyticEvents('begin_checkout', {
  //   'items': items,
  //   'coupon': ''
  // })

  yield put(setOrder(null, false, false))
  yield call(Router.push, '/checkout')
}

export default function* checkoutSaga () {
  if (!isServer) {
    yield all([
      takeLeading(`${checkoutPlaceOrderRequest}`, placeOrder),
      takeLeading(`${checkoutGoToCheckout}`, goToCheckout)
    ])
  }
} 