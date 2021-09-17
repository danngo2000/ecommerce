import React, { useState, useEffect, useMemo } from 'react'
import { Row, Col } from 'antd'
import { CheckCircleOutlined } from '@ant-design/icons'
import UseCredit from './Payment/UseCredit'
import { useDispatch, useSelector } from 'react-redux'
import {
  paymentMethodsVisibilitySelector,
  publicKeysSelector
} from 'store/config.selector'
import { loadPayPalScript } from 'utils/dom'
import { changePaymentMethod } from '../../actions/cart'
import { checkTestMode } from 'utils'

const PaymentMethod = () => {
  const [isPaypalReady, setPaypalReady] = useState(false)
  const [shouldAllowCod, setAllowCod] = useState(false)
  const enabledMethods = useSelector(paymentMethodsVisibilitySelector)
  const publicKeys = useSelector(publicKeysSelector)
  const customer = useSelector((state: any) => state.customer)
  const cart = useSelector((state: any) => state.cart)
  const {
    payment_method: paymentMethod,
    grand_total: grandTotal,
    items: productItems
  } = cart
  const dispatch = useDispatch()

  const isIncludeGirfCard = Array.isArray(productItems) && productItems.length && productItems.map(product => product.is_selected === true && product.product_type).includes('gift_card')

  const handleChange = (value) => {
    dispatch(changePaymentMethod(value))
  }

  useMemo(() => {
    const shouldAllowCod = !cart.items
      .filter(i => i.is_selected)
      .some(i => i.product_type === 'gift_card')
    setAllowCod(shouldAllowCod)
  }, [])

  useEffect(() => {
    if (enabledMethods.paypal) {
      checkTestMode(cart, customer)
        .then(testMode => {
          let payPalKey = publicKeys.paypal
          if (testMode && publicKeys.paypalSandbox) {
            payPalKey = publicKeys.paypalSandbox
          }
          if (payPalKey) loadPayPalScript(payPalKey, () => setPaypalReady(true))
        })
        .catch(console.error)
    }
  }, [])

  console.log('enabledMethods', enabledMethods);

  const pColProps = {
    lg: 4,
    md: 6,
    sm: 8,
    xs: 12
  }

  const pMethod = paymentMethod ? paymentMethod.method : null

  return (
    <div className='paymentMethodForm'>
      <ul className='paymentOptions'>
        { !isIncludeGirfCard ? <UseCredit /> : '' }
        {!shouldAllowCod && (
          <i>Cash on Delivery is not allowed when there are non-physical products in the shopping cart</i>
        )}
        {grandTotal > 0 && (
          <Row className='payment-checkout' gutter={[14, 14]}>
            {(enabledMethods.cod || (customer && customer.test_mode)) && (
              <Col {...pColProps}>
                <button
                  disabled={!shouldAllowCod}
                  className={`payment-option-wrapper ${pMethod === 'cod' ? 'active' : ''}`}
                  onClick={() => handleChange('cod')}
                >
                  <div className='payment-option'>
                    <img src='/static/images/payments/cash-payment.svg' alt='Cash On Delivery' />
                    <span>{pMethod === 'cod' && <CheckCircleOutlined />}Cash On Delivery</span>
                  </div>
                </button>
              </Col>
            )}
            {enabledMethods.stripe && !!publicKeys.stripe && (
              <Col {...pColProps}>
                <button
                  className={`payment-option-wrapper ${pMethod === 'stripe' ? 'active' : ''}`}
                  onClick={() => handleChange('stripe')}
                >
                  <div className='payment-option'>
                    <img src='/static/images/payments/credit-card.svg' alt='Cash On Delivery'/>
                    <span>{pMethod === 'stripe' && <CheckCircleOutlined />}Credit/Debit Card</span>
                  </div>
                </button>
              </Col>
            )}
            {enabledMethods.paypal && !!publicKeys.paypal && (
              <Col {...pColProps}>
                <button
                  disabled={!isPaypalReady}
                  className={`payment-option-wrapper ${pMethod === 'paypal' ? 'active' : ''}`}
                  onClick={() => handleChange('paypal')}
                >
                  <div className='payment-option'>
                    <img src='/static/images/payments/paypal.svg' alt='Paypal'/>
                    <span>{pMethod === 'paypal' && <CheckCircleOutlined />}Paypal</span>
                  </div>
                </button>
              </Col>
            )}
            {enabledMethods.momo && (
              <Col {...pColProps}>
                <button
                  className={`payment-option-wrapper ${pMethod === 'momo' ? 'active' : ''}`}
                  onClick={() => handleChange('momo')}
                >
                  <div className='payment-option'>
                    <img src='/static/images/payments/momo.png' alt='MoMo Wallet'/>
                    <span>{pMethod === 'momo' && <CheckCircleOutlined />}MoMo Wallet</span>
                  </div>
                </button>
              </Col>
            )}
            {enabledMethods.bank && (
              <Col {...pColProps}>
                <button
                  className={`payment-option-wrapper ${pMethod === 'bank' ? 'active' : ''}`}
                  onClick={() => handleChange('bank')}
                >
                  <div className='payment-option'>
                    <img src='/static/images/payments/bank.svg' alt='Bank Transfer'/>
                    <span>{pMethod === 'bank' && <CheckCircleOutlined />}Bank Transfer</span>
                  </div>
                </button>
              </Col>
            )}
            {enabledMethods.zalopay && (
              <Col {...pColProps}>
                <button
                  className={`payment-option-wrapper ${pMethod === 'zalopay' ? 'active' : ''}`}
                  onClick={() => handleChange('zalopay')}
                >
                  <div className='payment-option'>
                    <img src='/static/images/payments/zalopay.png' alt='ZaloPay'/>
                    <span>{pMethod === 'zalopay' && <CheckCircleOutlined />}ZaloPay</span>
                  </div>
                </button>
              </Col>
            )}
          </Row>
        )}
      </ul>
    </div>
  )
}

export default React.memo(PaymentMethod)

