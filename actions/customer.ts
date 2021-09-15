import {IAddress} from 'interfaces';

export const CUSTOMER_ACTIVE_EMAIL_SUCCESS = 'customer/ACTIVE_EMAIL_SUCCESS'
export const CUSTOMER_GET_DEFAULT_ADDRESSES_SUCCESS = 'customer/GET_DEFAULT_ADDRESSES_SUCCESS'
export const CUSTOMER_ACTIVE_SHOPPER_SUCCESS = 'customer/ACTIVE_SHOPPER_SUCCESS'

export interface IActiveEmailAction {
  type: typeof CUSTOMER_ACTIVE_EMAIL_SUCCESS
}

export interface IActiveShopperAction {
  type: typeof CUSTOMER_ACTIVE_SHOPPER_SUCCESS
}

export interface IGetDefaultAddressesSuccess {
  type: typeof CUSTOMER_GET_DEFAULT_ADDRESSES_SUCCESS
  payload: {
    default_shipping?: IAddress
    default_billing?: IAddress
  }
}

export const activeEmailSuccess = (): CustomerAction => ({
  type: CUSTOMER_ACTIVE_EMAIL_SUCCESS
})

export const activeShopperSuccess = (): CustomerAction => ({
  type: CUSTOMER_ACTIVE_SHOPPER_SUCCESS
})

export const getDefaultAddressSuccess = (payload): CustomerAction => ({
  type: CUSTOMER_GET_DEFAULT_ADDRESSES_SUCCESS,
  payload
})

export type CustomerAction = IActiveEmailAction
  | IGetDefaultAddressesSuccess
  | IActiveShopperAction