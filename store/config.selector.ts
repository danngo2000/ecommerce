import { createSelector } from 'reselect'
import {RootState} from 'store/index';

export const configSelector = (state: RootState) => state.config

export const paymentMethodsVisibilitySelector = createSelector(
    configSelector,
    config => ({
      stripe: config['payment/stripe/enable'],
      cod: config['payment/cod/enable'],
      paypal: config['payment/paypal/enable'],
      momo: config['payment/momo/enable'],
      bank: config['payment/bank/enable'],
      vnpay: config['payment/vnpay/enable'],
      zalopay: config['payment/zalopay/enable']
    })
)

export const publicKeysSelector = createSelector(
    configSelector,
    config => ({
      facebook: config['facebook/api_keys'],
      oauth: config['google/oauth/api_keys'],
      recaptcha: config['recaptcha/api_keys'],
      stripe: config['payment/stripe/api_keys'],
      stripeSandbox: config['payment/stripe/api_keys/test'],
      paypal: config['payment/paypal/api_keys'],
      paypalSandbox: config['payment/paypal/api_keys/test'],
    })
)