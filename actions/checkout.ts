import {CheckoutStep} from 'interfaces';
import {IChangeShippingMethodSuccessAction} from 'actions/cart';

export const CHECKOUT_CHANGE_STEP = 'checkout/CHANGE_STEP'
export const CHECKOUT_SET_ORDER = 'checkout/SET_ORDER'
export const CHECKOUT_GO_TO_CHECKOUT = 'checkout/GO_TO_CHECKOUT'
export const CHECKOUT_PLACE_ORDER_REQUEST = 'checkout/PLACE_ORDER_REQUEST'

interface IChangeCheckoutStepAction {
  type: typeof CHECKOUT_CHANGE_STEP
  payload: CheckoutStep
}

interface IPlaceOrderRequestAction {
  type: typeof CHECKOUT_PLACE_ORDER_REQUEST
}

export interface IGoToCheckout {
  type: typeof CHECKOUT_GO_TO_CHECKOUT
}

export interface ISetOrderAction {
  type: typeof CHECKOUT_SET_ORDER
  payload: {
    order: any,
    options: {
      doNotClearCart: boolean,
      isCheckoutSuccess: boolean
    }
  }
}

export const changeCheckoutStep = (step: CheckoutStep): CheckoutAction => ({
  type: CHECKOUT_CHANGE_STEP,
  payload: step
})

export const setOrder = (order: any, isCheckoutSuccess = true, shouldClearCart = true): CheckoutAction => ({
  type: CHECKOUT_SET_ORDER,
  payload: {
    order,
    options: {
      doNotClearCart: !shouldClearCart,
      isCheckoutSuccess
    }
  }
})

export const placeOrder = (): CheckoutAction => ({
  type: CHECKOUT_PLACE_ORDER_REQUEST
})

export const goToCheckout = (): CheckoutAction => ({
  type: CHECKOUT_GO_TO_CHECKOUT
})

export type CheckoutAction =
  IChangeCheckoutStepAction
  | IChangeShippingMethodSuccessAction
  | ISetOrderAction
  | IPlaceOrderRequestAction
  | IGoToCheckout