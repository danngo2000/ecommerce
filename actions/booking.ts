import { IHydrateAction } from './core'

export const BOOKING_HIDE_MODAL = 'booking/HIDE_MODAL'
export const BOOKING_SHOW_MODAL = 'booking/SHOW_MODAL'
export const BOOKING_ADD_CART = 'booking/ADD_CART'
export const BOOKING_FETCH_ITEM = 'booking/FETCH_ITEM'
export const BOOKING_FETCH_SUCCESS = 'booking/FETCH_SUCCESS'
export const BOOKING_FETCH_FAIL = 'booking/FETCH_FAIL'
export const BOOKING_DECREASE_QUANTITY_ITEM = 'booking/DECREASE_QUANTITY_ITEM'
export const BOOKING_INCREASE_QUANTITY_ITEM = 'booking/INCREASE_QUANTITY_ITEM'
export const BOOKING_SET_PAYMENT = 'booking/SET_PAYMENT'
export const BOOKING_RESET_CART = 'booking/RESET_CART'
export const BOOKING_SET_ADDRESS = 'booking/SET_ADDRESS'

export interface IShowBookingModalAction {
  type: typeof BOOKING_SHOW_MODAL
}

export interface IHideBookingModalAction {
  type: typeof BOOKING_HIDE_MODAL
}

export interface IAddCartBookingAction {
  type: typeof BOOKING_ADD_CART,
  payload: any
}

export interface IResetCartBookingAction {
  type: typeof BOOKING_RESET_CART
}

export interface IDecreaseQuantityAction {
  type: typeof BOOKING_DECREASE_QUANTITY_ITEM,
  payload: any
}

export interface IIncreaseQuantityAction {
  type: typeof BOOKING_INCREASE_QUANTITY_ITEM,
  payload: any
}

export interface ISetPaymentMethodAction {
  type: typeof BOOKING_SET_PAYMENT,
  payload: any
}

export interface ISetAddressAction {
  type: typeof BOOKING_SET_ADDRESS,
  payload: any
}

export const fetchItemBooking = (payload) => ({
  type: BOOKING_FETCH_ITEM,
  payload
})

export const fetchBookingsSuccess = (payload) => ({
  type: BOOKING_FETCH_SUCCESS,
  payload
})

export const fetchBookingsFail = (error) => ({
  type: BOOKING_FETCH_FAIL,
  error
})

export const hideBookingModal = () => ({ type: BOOKING_HIDE_MODAL })
export const showBookingModal = () => ({ type: BOOKING_SHOW_MODAL })
export const addToCartBooking = (payload) => ({ type: BOOKING_ADD_CART, payload })
export const decreaseQuantity = (payload) => ({ type: BOOKING_DECREASE_QUANTITY_ITEM, payload })
export const increaseQuantity = (payload) => ({ type: BOOKING_INCREASE_QUANTITY_ITEM, payload })
export const setPaymentMethodBooking = (payload) => ({ type: BOOKING_SET_PAYMENT, payload })
export const setAddressBooking = (address, hideAddress) => ({ type: BOOKING_SET_ADDRESS, payload: { address, hideAddress } })
export const resetCartBooking = () => ({ type: BOOKING_RESET_CART })
export type BookingAction = IHydrateAction
    | IShowBookingModalAction
    | IHideBookingModalAction
    | IAddCartBookingAction
    | IDecreaseQuantityAction
    | IIncreaseQuantityAction
    | ISetPaymentMethodAction
    | IResetCartBookingAction
    | ISetAddressAction
