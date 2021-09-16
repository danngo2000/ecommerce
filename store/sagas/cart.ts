// import { put, call, select } from "redux-saga/effects";
// /* ######### actions ######## */
// import { CartActions } from "../reducers/cart";

// /* ######### utils ######## */
// import { createFuncRootSaga } from "../../utils/redux";

// /* ######### api ######## */
// import { CartAPI } from "../../api";
// import { Action } from "store/interfaces";
// import { calculateGrandTotal } from "utils/cart";
// import { RootState } from "store";

// function* handleGetCart() {
//   try {
//     const res = yield call(CartAPI.verifyCarts);
//     if (res && res.cart) {
//       yield put(CartActions.cartSuccess(res.cart));
//     }
//   } catch (e) {
//     yield put(CartActions.cartFailed());
//   }
// }

// function* handleUpdateCart({ payload }: Action) {
//   try {
//     const { req } = payload;
//     const res = yield call(CartAPI.updateCart, req);
//     if (res && res.cart) {
//       yield put(CartActions.updateCartSuccess(res.cart));
//       if(req?.action_type === 'add_to_cart')
//         yield put(CartActions.remotePopupAddToCart(true))
//     }
//   } catch (e) {
//     yield put(CartActions.updateCartFailed());
//   }
// }

// function* changeShippingMethod({ payload }: Action) {
//   const shipping = payload
//   if (!shipping) return
//   try {
//     let totalShipping = 0
//     for (let key of Object.keys(shipping)) {
//       if (shipping[key]) totalShipping += shipping[key].rate
//     }
//     const cart = yield select((state: RootState) => state.cart.cartData)
//     const { grandTotal} = calculateGrandTotal(cart, totalShipping)
//     yield put(CartActions.changeShippingMethodSucess({grandTotal,shippingMethods: shipping}))
//   } catch (e:any) {
//     console.log(e.message)
//   }
// }

// function* setAddress (action:any) {
//   try {
//     const input = action.payload.addressCheck
//     const key = action.payload.key
//     const checkout = yield select((state: RootState) => state.checkout)
//     const address = yield select((state: RootState) => state.cart.cartData.address)
//     let body = {
//       addressCheck: {...address}
//     }
//     if (!!key) {
//       switch (key) {
//         case 'billing':
//           body.addressCheck.billing = input.billing
//           body.addressCheck.shipping = address.shipping
//           break;
//         case 'shipping':
//           body.addressCheck.shipping = input.shipping
//           body.addressCheck.billing = address.billing
//           break;
//       }
//     } else {
//       body.addressCheck = {
//         shipping: input.shipping,
//         billing: input.billing
//       }
//     }
//     const { cart } = yield call(CartAPI.updateCart, body)
//     cart.isAddressValid = true

//     if (
//         typeof cart.address?.shipping !== 'string' &&
//         cart.address?.shipping?.country === 'US' &&
//         cart.address?.shipping?.state === 'CA'
//     ) {
//       const { grandTotal, credit } = calculateGrandTotal(cart, checkout.shippingCost)
//       cart.grand_total = grandTotal
//       cart.credit = credit
//     } else {
//       cart.grand_total = cart.grand_total - cart.tax?.total
//       if (cart.totalCredit && cart.totalCredit > cart.grand_total) {
//         cart.credit = cart.grand_total
//       } else {
//         cart.credit = cart.totalCredit || 0
//       }
//       cart.grand_total -= cart.credit
//     }
//     yield put(CartActions.updateCartSuccess(cart))
//   } catch (e:any) {
//     console.log(e.message)
//   }
// }

// const cartSaga = {
//   on: CartActions.cartRequest,
//   worker: handleGetCart,
// };
// const addToCartSaga = {
//   on: CartActions.updateCartRequest,
//   worker: handleUpdateCart,
// };

// const changeShippingSaga = {
//   on: CartActions.changeShippingMethodRequest,
//   worker: changeShippingMethod,
// };

// const setAddressSaga = {
//   on: CartActions.setAddress,
//   worker: setAddress,
// };

// export default createFuncRootSaga([cartSaga, addToCartSaga, changeShippingSaga, setAddressSaga]);


import {actionChannel, call, cancelled, put, select, take, delay} from 'redux-saga/effects';
import { 
  AddToCartRequestAction,
  RemoveFromCartRequestAction,
  ToggleCartItemsRequestAction,
  ChangeCartItemQuantityAction,
  ChangeShippingMethodRequestAction,
  SetCartAddressAction,
  ApplyCouponRequestAction,
  CART_ADD_TO_CART_REQUEST,
  CART_REMOVE_FROM_CART_REQUEST,
  CART_TOGGLE_ITEMS_REQUEST,
  CART_CHANGE_ITEM_QUANTITY_REQUEST,
  CART_CHANGE_SHIPPING_METHOD_REQUEST,
  CART_APPLY_COUPON_REQUEST,
  CART_REMOVE_COUPON_REQUEST,
  CART_SET_ADDRESS_REQUEST,
  CART_USE_CREDIT,
  CART_SAVE_FOR_LATER_REQUEST,
  updateCart,
  cartChangeShippingMethodSuccess,
  remotePopupAddToCart,
} from 'actions/cart';
import Router from 'next/router';
// import {showCartNotifier} from 'actions/ui';
import {changeCheckoutStep, CheckoutState, goToCheckout} from 'actions/checkout';
import {CheckoutStep, Address, Cart} from '../interfaces';
import { 
  addToCartRequest,
  applyCouponRequest,
  changeCartItemQuantityRequest,
  removeCouponRequest,
  removeFromCartRequest,
  removeSaveForLater, saveForLaterRequest,
  toggleCartItemsRequest, updateCartRequest
} from 'store/services/cart';

import {calculateGrandTotal} from 'utils/cart';
import {RootState} from 'store/index';
// import {notification} from 'antd';
// import {t} from 'locales';
import produce from 'immer'
// import { googleAnalyticEvents } from '../../lib/analytics'

const isServer = typeof window !== 'object'



function* addToCart(action: AddToCartRequestAction) {
  try {
    const { productId, quantity, options } = action.payload
    const { cart, error } = yield call(addToCartRequest, productId, quantity, options)
    // Google Analystics: Measure additions from carts
    const items = cart.items.filter((item:any) => String(item.product_id) === String(productId))
      .map((item:any) => {
        return {
          'id': item.product_id,
          'name': item.name,
          // 'list_name': 'Search Results',
          // 'brand': 'Google',
          // 'category': 'Apparel/T-Shirts',
          // 'variant': 'Black',
          // 'list_position': 1,
          'quantity': 2,
          'price': item.price
        }
      }
    )
    // googleAnalyticEvents('add_to_cart', { 'items': items })

    yield put(updateCart(cart))
    yield put(remotePopupAddToCart(true))

    if (options?.sflItem) {
      removeSaveForLater(options.sflItem, true).then()
    }
    if (options?.buyNow) {
      yield put(changeCheckoutStep(CheckoutStep.Address))
      yield put(goToCheckout())
    }
  } catch (e:any) {
    console.log(e.message)
  } finally {
    if (yield cancelled()) {
      console.log('cancelled')
    }
  }
}

function* removeFromCart(action: RemoveFromCartRequestAction) {
  try {
    const item = action.payload
    const body: any = {}
    if (item.product_id) body.product_id = item.product_id
    else body.item = item
    const { cart } = yield call(removeFromCartRequest, body)

    // Google Analystics: Measure removals from carts
    const items = [{
      'id': item.product_id,
      'name': item.name,
      // 'list_name': 'Search Results',
      // 'brand': 'Google',
      // 'category': 'Apparel/T-Shirts',
      // 'variant': 'Black',
      // 'list_position': 1,
      'quantity': 2,
      'price': item.price
    }]
    // googleAnalyticEvents('remove_from_cart', { 'items': items })

    yield put(updateCart(cart))
  } catch (e:any) {
    console.log(e.message)
  } finally {

  }
}

function* toggleItems(action: ToggleCartItemsRequestAction) {
  // let data = action.payload
  // if(Array.isArray(data?.index)) {
  //   data.indexes = data.index
  //   delete data.index
  // }
  try {
    const { cart } = yield call(toggleCartItemsRequest, action.payload)
    yield put(updateCart(cart))
  } catch (e:any) {
    console.log(e.message)
  } finally {

  }
}

function* changeQuantity(action: ChangeCartItemQuantityAction) {
  try {
    const { cart } = yield call(changeCartItemQuantityRequest, action.payload.productId, action.payload.quantity)
    yield put(updateCart(cart))
  } catch (e:any) {
    console.log(e.message)
  } finally {

  }
}

function* changeShippingMethod(action: ChangeShippingMethodRequestAction) {
  const shipping = action.payload
  if (!shipping) return
  try {
    let totalShipping = 0
    for (let key of Object.keys(shipping)) {
      if (shipping[key]) totalShipping += shipping[key].rate
    }
    const cart:Cart = yield select((state: RootState) => state.cart)
    // cart.shipping_methods = shipping
    const { grandTotal, credit } = calculateGrandTotal(cart, totalShipping)
    yield put(cartChangeShippingMethodSuccess(grandTotal,credit,totalShipping,shipping))
  } catch (e:any) {
    console.log(e.message)
  }
}

// function* setAddress (action: SetCartAddressAction) {
//   try {
//     const input = action.payload.address
//     const key = action.payload.key

//     // if (!input) return
//     // const payload: Partial<Cart> = {}
//     // if (input.name === 'country' && input.value !== 'US') {
//     //   shipping.state = ''
//     // }
//     // shipping[input.name] = input.value
//     const checkout:CheckoutState = yield select((state: RootState) => state.checkout)
//     const address:Cart = yield select((state: RootState) => state.cart.address)

//     const body = {
//       addressCheck: {...address}
//     }

//     if (!!key) {
//       switch (key) {
//         case 'billing':
//           body.addressCheck.address.billing = input
//           break;
//         case 'shipping':
//           body.addressCheck.address.shipping = input
//           body.addressCheck.address.billing = input
//           break;
//       }
//     } else {
//       body.addressCheck.address = {
//         shipping: input,
//         billing: input
//       }
//     }
//     const data: { cart: Cart } = yield call(updateCartRequest, body)
//     const { cart }:any = data
//     cart.isAddressValid = true

//     if (
//         typeof cart.address?.shipping !== 'string' &&
//         cart.address?.shipping?.country === 'US' &&
//         cart.address?.shipping?.state === 'CA'
//     ) {
//       const { grandTotal, credit } = calculateGrandTotal(cart, checkout.shippingCost)
//       cart.grand_total = grandTotal
//       cart.credit = credit
//     } else {
//       cart.grand_total = cart.grand_total - cart.tax?.total
//       // cart.tax = { total: 0 }
//       if (cart.totalCredit && cart.totalCredit > cart.grand_total) {
//         cart.credit = cart.grand_total
//       } else {
//         cart.credit = cart.totalCredit || 0
//       }
//       cart.grand_total -= cart.credit
//     }
//     // cart.updated_at = Date.now()
//     yield put(updateCart(cart))
//   } catch (e:any) {
//     console.log(e.message)
//   }
// }

function* setAddress (action: SetCartAddressAction) {
  try {
    const input = action.payload.address
    const key = action.payload.key

    const checkout = yield select((state: RootState) => state.checkout)
    const address = yield select((state: RootState) => state.cart.address)

    const body = {
      addressCheck: {...address}
    }
    if (!!key) {
      switch (key) {
        case 'billing':
          body.addressCheck.billing = input
          break;
        case 'shipping':
          body.addressCheck.shipping = input
          break;
      }
    } else {
      body.addressCheck = {
        shipping: input,
        billing: input
      }
    }
    const data: { cart: Cart } = yield call(updateCartRequest, body)
    const { cart } = data
    cart.isAddressValid = true
    if (
        typeof cart.address?.shipping !== 'string' &&
        cart.address?.shipping?.country === 'US' &&
        cart.address?.shipping?.state === 'CA'
    ) {
      const { grandTotal, credit } = calculateGrandTotal(cart, checkout.shippingCost)
      cart.grand_total = grandTotal
      cart.credit = credit
    } else {
      cart.grand_total = cart.grand_total - cart.tax?.total
      // cart.tax = { total: 0 }
      if (cart.totalCredit && cart.totalCredit > cart.grand_total) {
        cart.credit = cart.grand_total
      } else {
        cart.credit = cart.totalCredit || 0
      }
      cart.grand_total -= cart.credit
    }
    yield put(updateCart(cart))
  } catch (e:any) {
    console.log(e.message)
  }
}

function* updateCartAfterCoupon(cart: Cart) {
  const stateCart: Cart = yield select((state: RootState) => state.cart)
  cart.payment_method = stateCart.payment_method
  cart.shipping_methods = stateCart.shipping_methods
  if (cart.shipping_methods) {
    let shippingCost = 0
    Object.keys(cart.shipping_methods).forEach(i => {
      shippingCost += cart.shipping_methods[i].rate
    })
    cart.grand_total += shippingCost
  }
  for (let i = 0; i < stateCart.items.length; i++) {
    cart.items[i].product = stateCart.items[i].product
  }
  yield put(updateCart(cart))
}

function* applyCoupon(action: ApplyCouponRequestAction) {
  try {
    const coupon = action.payload
    let { cart } = yield call(applyCouponRequest, coupon)
    yield call(updateCartAfterCoupon, cart)
  } catch (e:any) {
    console.error(e.message)
  }
}

function* removeCoupon() {
  try {
    let { cart } = yield call(removeCouponRequest)
    yield call(updateCartAfterCoupon, cart)
  } catch (e:any) {
    console.error(e.message)
  }
}

function* useCredit(action:any) {
  try {
    const amount = action.payload
    const cart: Cart = yield select((state: RootState) => state.cart)
    const checkout: CheckoutState = yield select((state: RootState) => state.checkout)
    // cart.totalCredit = amount
    // if (amount >= cart.grand_total) {
    //   cart.payment_method = { method: 'coin' }
    // }

    // cart.grand_total = grandTotal
    // cart.credit = credit

    yield put(updateCart(produce(cart, draft => {
      draft.totalCredit = amount
      if (amount >= draft.grand_total) {
        draft.payment_method = { method: 'coin' }
      }
      // remove payment_method coin when user uncheck use-credit
      if( draft.payment_method?.method === 'coin' && amount === 0) {
        draft.payment_method = { method: null }
      }
      const { grandTotal, credit } = calculateGrandTotal(draft, checkout.shippingCost)
      draft.grand_total = grandTotal
      draft.credit = credit
      return draft
    })))
  } catch (e:any) {
    console.error(e.message)
  }
}

function* saveForLater(action:any) {
  try {
    const item = action.payload
    const { message } = yield call(saveForLaterRequest, item.product_id)
    if (message) {
      // notification.success({ message: t(message) })
      const body: any = {}
      if (item.product_id) body.product_id = item.product_id
      else body.item = item
      const { cart } = yield call(removeFromCartRequest, body)
      yield put(updateCart(cart))
    }
  } catch (e:any) {
    console.error(e.message)
  }
}

export default function* cartSaga() {
  const requestChannel = yield actionChannel([
    CART_ADD_TO_CART_REQUEST,
    CART_REMOVE_FROM_CART_REQUEST,
    CART_TOGGLE_ITEMS_REQUEST,
    CART_CHANGE_ITEM_QUANTITY_REQUEST,
    CART_CHANGE_SHIPPING_METHOD_REQUEST,
    CART_APPLY_COUPON_REQUEST,
    CART_REMOVE_COUPON_REQUEST,
    CART_SET_ADDRESS_REQUEST,
    CART_USE_CREDIT,
    CART_SAVE_FOR_LATER_REQUEST
  ])
  while (!isServer) {
    const action = yield take(requestChannel)

    switch (action.type) {
      case CART_ADD_TO_CART_REQUEST:
        yield call(addToCart, action); break
      case CART_REMOVE_FROM_CART_REQUEST:
        yield call(removeFromCart, action); break
      case CART_TOGGLE_ITEMS_REQUEST:
        yield call(toggleItems, action); break
      case CART_CHANGE_ITEM_QUANTITY_REQUEST:
        yield call(changeQuantity, action); break
      case CART_APPLY_COUPON_REQUEST:
        yield call(applyCoupon, action); break
      case CART_REMOVE_COUPON_REQUEST:
        yield call(removeCoupon); break
      case CART_SET_ADDRESS_REQUEST:
        yield call(setAddress, action); break
      case CART_USE_CREDIT:
        yield call(useCredit, action); break
      case CART_SAVE_FOR_LATER_REQUEST:
        yield call(saveForLater, action); break
      case CART_CHANGE_SHIPPING_METHOD_REQUEST:
        yield call(changeShippingMethod, action); break
      default: break
    }
  }
} 