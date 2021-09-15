import {IHydrateAction} from './core';
import {ILoginSuccessAction, ILogoutSuccessAction} from 'actions/auth';
import {IAddress, ICart, ICartItem, PaymentMethod} from 'interfaces';
import {ISetOrderAction} from 'actions/checkout';

export const CART_UPDATE_CART = 'cart/UPDATE_CART'
export const CART_ADD_TO_CART_REQUEST = 'cart/ADD_TO_CART_REQUEST'
export const CART_ADD_TO_CART_FAIL = 'cart/ADD_TO_CART_FAIL'
export const CART_REMOVE_FROM_CART_REQUEST = 'cart/REMOVE_FROM_CART_REQUEST'
export const CART_TOGGLE_ITEMS_REQUEST = 'cart/TOGGLE_ITEMS_REQUEST'
export const CART_CHANGE_ITEM_QUANTITY_REQUEST = 'cart/CHANGE_ITEMS_QUANTITY_REQUEST'
export const CART_CHANGE_PAYMENT_METHOD = 'cart/CHANGE_PAYMENT_METHOD'
export const CART_CHANGE_SHIPPING_METHOD_REQUEST = 'cart/CHANGE_SHIPPING_METHOD_REQUEST'
export const CART_CHANGE_SHIPPING_METHOD_SUCCESS = 'cart/CHANGE_SHIPPING_METHOD_SUCCESS'
export const CART_APPLY_COUPON_REQUEST = 'cart/APPLY_COUPON_REQUEST'
export const CART_REMOVE_COUPON_REQUEST = 'cart/REMOVE_COUPON_REQUEST'
export const CART_CLEAR_ADDRESS = 'cart/CLEAR_ADDRESS'
export const CART_SET_ADDRESS_REQUEST = 'cart/SET_ADDRESS_REQUEST'
export const CART_USE_CREDIT = 'cart/USE_CREDIT'
export const CART_SAVE_FOR_LATER_REQUEST = 'cart/SAVE_FOR_LATER_REQUEST'
export const CART_ADD_NOTE = 'cart/ADD_NOTE'
export const CART_SET_DEFAULT_ADDRESSES = 'cart/SET_DEFAULT_ADDRESSES'

export interface IApplyCouponRequestAction {
  type: typeof CART_APPLY_COUPON_REQUEST
  payload: string
}

export interface IRemoveCouponRequestAction {
  type: typeof CART_REMOVE_COUPON_REQUEST
}


export interface ISetDefaultCartAddressesAction {
  type: typeof CART_SET_DEFAULT_ADDRESSES,
  payload: IAddress
}

export interface IUseCreditAction {
  type: typeof CART_USE_CREDIT
  payload: number
}

export interface IAddNoteAction {
  type: typeof CART_ADD_NOTE
  payload: string
}

export interface IAddToCartRequestAction {
  type: typeof CART_ADD_TO_CART_REQUEST
  payload: {
    productId: string
    quantity: number
    options?: {
      sflItem?: any
      buyNow?: boolean
    }
  }
}

export interface IRemoveFromCartRequestAction {
  type: typeof CART_REMOVE_FROM_CART_REQUEST
  payload: Partial<ICartItem>
}

export interface ISaveForLaterRequestAction {
  type: typeof CART_SAVE_FOR_LATER_REQUEST
  payload: Partial<ICartItem>
}

export interface IToggleCartItemsRequestAction {
  type: typeof CART_TOGGLE_ITEMS_REQUEST
  payload: {
    index?: number
    indexes?: number[]
    value: boolean
  }
}

export interface IChangeCartItemQuantityAction {
  type: typeof CART_CHANGE_ITEM_QUANTITY_REQUEST,
  payload: {
    productId: string
    quantity: number
  }
}

interface IClearCartAddressAction {
  type: typeof CART_CLEAR_ADDRESS
}

export interface ISetCartAddressAction {
  type: typeof CART_SET_ADDRESS_REQUEST
  payload: {
    address: IAddress
    key?: 'billing' | 'shipping'
  }
}

interface IUpdateCartAction {
  type: typeof CART_UPDATE_CART
  payload: {
    cart: ICart
  }
}

interface IChangePaymentMethodAction {
  type: typeof CART_CHANGE_PAYMENT_METHOD
  payload: {
    method: PaymentMethod,
    method_value?: any
  }
}

export interface IChangeShippingMethodRequestAction {
  type: typeof CART_CHANGE_SHIPPING_METHOD_REQUEST
  payload: any
}

export interface IChangeShippingMethodSuccessAction {
  type: typeof CART_CHANGE_SHIPPING_METHOD_SUCCESS
  payload: {
    grandTotal: number,
    credit: number,
    shippingCost: number,
    shippingMethods: any
  }
}

export const applyCoupon = (coupon: string): CartAction => ({
  type: CART_APPLY_COUPON_REQUEST,
  payload: coupon
})

export const removeCoupon = (): CartAction => ({
  type: CART_REMOVE_COUPON_REQUEST
})

export const addToCart = (productId: string, quantity = 1, options?): CartAction => ({
  type: CART_ADD_TO_CART_REQUEST,
  payload: { productId, quantity, options }
})

export const removeFromCart = (item: Partial<ICartItem>): CartAction => ({
  type: CART_REMOVE_FROM_CART_REQUEST,
  payload: item
})

export const updateCart = (cart: ICart) => ({
  type: CART_UPDATE_CART,
  payload: { cart }
})

export const changeCartItemQuantity = (productId: string, quantity: number): CartAction => ({
  type: CART_CHANGE_ITEM_QUANTITY_REQUEST,
  payload: {
    productId,
    quantity
  }
})

export const changePaymentMethod = (method: PaymentMethod, methodValue?: any): CartAction => ({
  type: CART_CHANGE_PAYMENT_METHOD,
  payload: {
    method,
    method_value: methodValue
  }
})

export const changeShippingMethod = (shipping: any): CartAction => ({
  type: CART_CHANGE_SHIPPING_METHOD_REQUEST,
  payload: shipping
})

export function toggleCartItems (value: boolean, index: number): CartAction; // one
export function toggleCartItems (value: boolean, indexes: number[]): CartAction; // many
export function toggleCartItems (value: boolean): CartAction; // all
export function toggleCartItems (value: boolean, i?: number | number[]): CartAction {
  const payload: IToggleCartItemsRequestAction['payload'] = { value }
  if (Array.isArray(i)) payload.indexes = i
  else if (!isNaN(i)) payload.index = i
  return {
    type: CART_TOGGLE_ITEMS_REQUEST,
    payload
  }
}

export const setDefaultAddresses = (address: IAddress): CartAction => ({
  type: CART_SET_DEFAULT_ADDRESSES,
  payload: address
})

export const saveForLater = (item: Partial<ICartItem>): CartAction => ({
  type: CART_SAVE_FOR_LATER_REQUEST,
  payload: item
})

export const useCredit = (amount: number): CartAction => ({
  type: CART_USE_CREDIT,
  payload: amount
})

export const clearCartAddress = () => ({
  type: CART_CLEAR_ADDRESS
})

export const setCartAddress = (address?: IAddress, key?: 'billing' | 'shipping'): CartAction => ({
  type: CART_SET_ADDRESS_REQUEST,
  payload: {
    address,
    key
  }
})

export const addCartNote = (note: string): CartAction => ({
  type: CART_ADD_NOTE,
  payload: note
})

export type CartAction = IHydrateAction
  | IUpdateCartAction
  | ILoginSuccessAction
  | ILogoutSuccessAction
  | IAddToCartRequestAction
  | IRemoveFromCartRequestAction
  | IToggleCartItemsRequestAction
  | IChangeCartItemQuantityAction
  | IChangePaymentMethodAction
  | IChangeShippingMethodRequestAction
  | IChangeShippingMethodSuccessAction
  | IApplyCouponRequestAction
  | IRemoveCouponRequestAction
  | IClearCartAddressAction
  | ISetCartAddressAction
  | IUseCreditAction
  | ISaveForLaterRequestAction
  | IAddNoteAction
  | ISetDefaultCartAddressesAction
  | ISetOrderAction
