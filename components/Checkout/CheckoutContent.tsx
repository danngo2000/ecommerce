import React, { useState } from 'react'
import { Steps } from 'antd'
import { useDispatch, useSelector } from 'react-redux'
import LoginDialog from 'components/Customer/LoginDialog'
import AddressStep from './Addresses'
import { scroller } from 'react-scroll'
import { CheckoutStep } from 'store/interfaces'
import ShippingMethod from './ShippingMethod'
import PaymentMethod from './PaymentMethod'
import PaypalButton from './Payment/PaypalButton'
import axios from 'axios'
import { clearCartAddress, setCartAddress } from 'store/reducers/cart'
import { changeCheckoutStep, setOrder, placeOrder } from 'actions/checkout'
import { getDefaultAddressSuccess } from 'actions/customer'
import { getCustomerDefaultAddressesRequest } from "store/services/cart"
import { handleCheckoutError, isCartValid } from 'utils/cart'
import { publicKeysSelector } from "store/config.selector"
import CardForm from './CardForm'
import MomoButton from './Payment/MomoButton'
import VNPayButton from './Payment/VNPayButton'
import ZaloPayButton from './Payment/ZaloPayButton'
import CustomerNotes from './CustomerNotes'
import SummaryCart from './SummaryCart'


const { Step } = Steps

const CheckoutContent = () => {
  const [customerNotes, setCustomerNotes] = useState(false)
  const { isGuest } = useSelector((state: any) => state.auth)
  const checkout = useSelector((state: any) => state.checkout)
  const cart = useSelector((state: any) => state.cart)
  const customer = useSelector((state: any) => state.customer)
  const config = useSelector((state: any) => state.config)
  const publicKeys = useSelector(publicKeysSelector)
  const [openLoginDialog, setOpenLoginDialog] = useState(false)
  const dispatch = useDispatch()
  let readyToPlaceOrder = isCartValid(cart, customer)
  let supportEmail = config['site/support/email']
  let percentDeposit = config['deposit_payment/percent_grand_total']

  console.log('readyToPlaceOrder', readyToPlaceOrder);

  const openCustomerNote = () => {
    setCustomerNotes(!customerNotes)
  }

  const scrollTo = (element, offset = 0, actions) => {
    scroller.scrollTo(element, {
      duration: 800,
      delay: 0,
      smooth: 'easeInOutQuart',
      offset,
      actions
    })
  }

  const onStripeToken = async (token, isNew = true) => {
    try {
      let { data: { order, error } } = await axios.post('payments/createPayment', {
        quoteId: cart._id,
        shippingMethods: cart.shipping_methods,
        promotion: cart.promotion,
        method: 'stripe',
        address: cart.address,
        stripeData: { id: token.id, isNew },
        credit: cart.credit,
        note: cart.note,
        refCode: window.localStorage.getItem('refCode')
      })
      if (error) handleCheckoutError(error, order)
      else if (order) setOrder(order, true)
    } catch (error) {
      handleCheckoutError('Internal server error')
    }
  }

  const handlePaypalCheckout = async (paypalOrderId: any) => {
    try {
      let { data: { order, error } } = await axios.post('payments/createPayment', {
        quoteId: cart._id,
        shippingMethods: cart.shipping_methods,
        promotion: cart.promotion,
        method: 'paypal',
        address: cart.address,
        refCode: window.localStorage.getItem('refCode'),
        paypalOrderId,
        credit: cart.credit || 0,
        note: cart.note
      })
      if (order) {
        setOrder(order, true)
      } else {
        handleCheckoutError(error)
      }
    } catch (error) {
      console.log(error.message)
      handleCheckoutError('Internal server error')
    }
  }

  const handlePlaceOrder = () => {
    dispatch(placeOrder())
  }

  return (
    <>
      <div className='checkout-steps-content'>
        <div className='checkoutHeader'>
          <Steps size='small' direction='horizontal'>
            <Step title='Address' status='process' />
            <Step title='Delivery' status={['shipping', 'payment'].includes(checkout.step) ? 'process' : 'wait' }/>
            <Step title='Payment' status={checkout.step === 'payment' ? 'process' : 'wait'} />
          </Steps>
        </div>
      </div>
      <div className='container checkoutPageBox'>
        <h1 style={{ display: 'none' }}>Secured Checkout</h1>
        <div className='checkoutPage'>
          <div className='checkoutMainBody'>
            <div className='columnFirst'>
              {isGuest ? (
                <div className='loginLink'>
                  <a onClick={(e) => { 
                    if (isGuest) {
                      e.preventDefault()
                      setOpenLoginDialog(true)
                    }}}
                  >
                    Already have an account? Log in.
                  </a>
                </div>
              ) : (
                <div />
              )}

              <AddressStep scrollTo={scrollTo} />

              <div className={'step grow stepShipping' + (checkout.step === CheckoutStep.Shipping ? ' active' : '')}>
                <div className='shippingMethodForm'>
                  <h3><span className='number'>2</span> Shipping Methods</h3>
                  <ShippingMethod />
                </div>
              </div>

              <div className={'step grow stepPayment' + (checkout.step === CheckoutStep.Payment ? ' active' : '')}>
                <h3><span className='number'>3</span> Payment Methods</h3>
                <div className='stepContent'>
                  <PaymentMethod />
                  <div className='buttons'>
                    {cart.grand_total > 0 ? (
                      <div className='col1 placeOrderBox'>
                        {(() => {
                          if (cart.payment_method && cart.payment_method.method === 'paypal') {
                            return (
                              <PaypalButton
                                grandTotal={cart.grand_total}
                                onSuccess={paypalOrderId => handlePaypalCheckout(paypalOrderId)} 
                              />
                            )
                          } else if (cart.payment_method && cart.payment_method.method === 'stripe') {
                            if (publicKeys.stripe) {
                              let email = ''
                              if (cart.address && cart.address.shipping && cart.address.shipping.email) {
                                email = cart.address.shipping.email
                              }
                              if (!email) {
                                if (customer && customer.email) email = customer.email
                              }
                              return (
                                <CardForm
                                  onGoBack={() => changeCheckoutStep('shipping')}
                                  onToken={onStripeToken}
                                />
                              )
                            } else {
                              return null
                            }
                          } else if (cart.payment_method && cart.payment_method.method === 'momo') {
                            return (
                              <MomoButton />
                            )
                          }  else if (cart.payment_method && cart.payment_method.method === 'vnpay') {
                            return (
                              <VNPayButton />
                            )
                          } else if (cart.payment_method && cart.payment_method.method === 'zalopay') {
                            return (
                              <ZaloPayButton />
                            )
                          } else {
                            return (
                              <button onClick={handlePlaceOrder} className='btn' disabled={!readyToPlaceOrder}>
                                Place Order Now 
                              </button>
                            )
                          }
                        })}
                      </div>
                    ) : (
                      <button onClick={handlePlaceOrder} className='btn' disabled={!readyToPlaceOrder}>
                        Place Order Now
                      </button>
                    )}
                    {!(cart.payment_method && cart.payment_method.method === 'stripe') && (
                      <div className='col2'>
                        <span className='goBackBtn'
                          onClick={() => scrollTo('stepPayment', -150, changeCheckoutStep('shipping'))}
                        >
                          Go back
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              <div className='step grow active'>
                <div className='shippingMethodForm note-order'>
                  <h3 onClick={() => openCustomerNote()}>
                    <span className='number'>4</span> Notes for Order 
                  </h3>
                  <span>optional</span>
                  <CustomerNotes />
                </div>
              </div>
            </div>
            <div className='columnSecond'>
              <div className='checkoutSidebar'>
                <p>Need Assistance?&nbsp;&nbsp;
                  <span className='orange'><i className='fa fa-phone' />&nbsp;
                    <b dir='ltr'><a href={'mailto:' + supportEmail}>{supportEmail}</a></b></span>
                </p>
                <div className='orderSummary'>
                  <h3>Order Summary</h3>
                  <SummaryCart percentDeposit={percentDeposit} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <LoginDialog
        openLoginDialog={openLoginDialog}
        onClose={() => setOpenLoginDialog(false)}
      />
    </>
  )
}

export default CheckoutContent
