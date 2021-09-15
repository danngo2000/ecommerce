// import { setOrder, CHECKOUT_GO_TO_CHECKOUT, CHECKOUT_PLACE_ORDER_REQUEST } from 'actions/checkout';
import {call, put, select, takeLeading, all} from 'redux-saga/effects';
// import {notification} from 'antd';
import {RootState} from 'store/index';
// import { isCartValid } from 'utils/cart';
import axios from 'axios';
import Router from 'next/router'
import {Cart, Customer} from '../interfaces';
// import {updateCart} from 'actions/cart';
// import { togglePlacingOrder } from 'actions/ui';
// import { googleAnalyticEvents } from '../../lib/analytics'

const isServer = typeof window !== 'object'

const placeOrderRequest = (body: any) => axios
    .post('quotes/checkout', body)
    .then(res => res.data)

// function* placeOrder () {
//   try {
//     // const isGuest = yield select((state: RootState) => state.auth.isGuest)
//     // if (isGuest) return

//     // yield put(togglePlacingOrder(true))
//     const cart: Cart = yield select((state: RootState) => state.cart)
//     const customer:Customer = yield select((state: RootState) => state.customer)

//     if (!isCartValid(cart, customer)) {
//       notification.warning({ message: 'Not ready to checkout' })
//       return
//     }
//     if (!cart.shipping_methods) {
//       notification.error({ message: 'Please select a shipping method' })
//       return
//     }
//     const data:{order:any,error:any, newQuote:any} = yield call(placeOrderRequest, {
//       address: cart.address,
//       note: cart.note,
//       payment_method: cart.payment_method,
//       shipping_methods: cart.shipping_methods,
//       promotion: cart.promotion,
//       refCode: window.localStorage.getItem('refCode'),
//       credit: cart.credit || 0
//     })

//     const { order, error } = data

//     if (error) {
//       notification.error({ message: error })
//       return
//     }
//     if (!!order) {
//       yield put(setOrder(order, true, true))
//       if (data.newQuote) yield put(updateCart(data.newQuote))
//     }
//   } catch (e) {
//     console.error(e.message)
//     console.error(e.stack)
//   } finally {
//     // yield put(togglePlacingOrder(false))
//   }
// }

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

  // yield put(setOrder(null, false, false))
  yield call(Router.push, '/checkout')
}

export default function* checkoutSaga () {
  if (!isServer) {
    yield all([
      // takeLeading(`${CHECKOUT_PLACE_ORDER_REQUEST}`, placeOrder),
      // takeLeading(`${CHECKOUT_GO_TO_CHECKOUT}`, goToCheckout)
    ])
  }
}