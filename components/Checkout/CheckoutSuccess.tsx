import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { loginRequestSuccess } from 'actions/auth'
import Link from 'next/link'
import {
  CheckCircleOutlined,
  MailOutlined,
  DownOutlined,
  UpOutlined
} from '@ant-design/icons'
import Price from 'components/Product/Price'
import Moment from 'react-moment'

const CheckoutSuccess = () => {
  const { isGuest } = useSelector((state: any) => state.auth)
  const { order } = useSelector((state: any) => state.checkout)
  const config = useSelector((state: any) => state.config)

  const [showOrderDetails, setShowOrderDetails] = useState(false)
  const theme = config['site/theme']

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  if (order && order.payment && ['paypal'].includes(order.payment.method)) {
    return (
      <div className='container checkout-paypal-success'>
        <div className='checkout-paypal-content'>
          <img
            src='https://d1i5ti8rq3af58.cloudfront.net/2021/1/29/1611890589680.0156.jpg'
            alt=''
          />
          <div className='paypal-success-text title'>Thank you!</div>
          <div className='paypal-success-text'>
            Your payment has been successful
          </div>
          <Link href='/'>
            <a>
              <button className='btn btn-thank-you'>Continue shopping</button>
            </a>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className='container smallContainer CheckoutSuccessPage'>
      <div className='page-section'>
        <div className='thank-you'>
          <div className='thank-you-heading'>
            <CheckCircleOutlined className='thank-you-icon' />
            <span>Thank you for your purchase!</span>
          </div>
          <div className='thank-you-secondary-container'>
            {order && (
              <p className='orderId'>
                Your order number is: {order.order_number}.
              </p>
            )}
          </div>
        </div>
      </div>
      <div className='page-section'>
        <div className='package-delivery'>
          <span className='title'>Your Delivery Dates</span>
          <table>
            <tr>
              <td style={{ display: 'flex' }}>
                <div className='item-img-container'>
                  {order?.items.map((item, key) => {
                    return (
                      <img
                        className='thumbnail-checkout'
                        src={
                          item.product.images[0]
                            ? item.product.images[0].url
                            : ''
                        }
                        alt=''
                        key={key}
                      />
                    )
                  })}
                </div>
                <div className='pk-des'>
                  {theme === 'pink-theme' ? (
                    <Moment className='upper-day' locale='vi' format='dddd, L'>
                      {order.created_at}
                    </Moment>
                  ) : (
                    <Moment format='DD MMM YYYY'>{order.created_at}</Moment>
                  )}
                </div>
              </td>
            </tr>
            <tr>
              <td style={{ padding: 0 }}>
                <div className='pk-item-line'></div>
              </td>
            </tr>
            <tr>
              <td>
                <div className='tip'>
                  <div className='package-delivery-text-content'>
                    <span>
                      For more details, track your delivery status under{' '}
                    </span>
                    <span style={{ fontWeight: 600 }}>My Account Orders</span>
                  </div>
                  <Link
                    href={`/customer?subPage=orderDetail&id=${order._id}`}
                    as={`/customer/orders/${order._id}`}
                  >
                    <button className='view-oder-button'>View order</button>
                  </Link>
                </div>
              </td>
            </tr>
          </table>
        </div>
        <div className='payment-information'>
          <div className='payment-information-item'>
            <MailOutlined />
            <span>
              A notification about your Order Request received has been sent to{' '}
              <b>{order.address.shipping.email}</b>
            </span>
          </div>
        </div>
        <div className='order-summary'>
          <div className='checkout-summary-detail'>
            <div
              className='checkout-summary-heading'
              onClick={() => setShowOrderDetails(!showOrderDetails)}
            >
              <div className='checkout-summary-title'>Order Details</div>
              {showOrderDetails ? (
                <UpOutlined />
              ) : (
                <div className='checkout-sumary'>
                  <div className='checkout-summary-value-collapse'>
                    <Price price={order.grand_total} />
                  </div>
                  <div className='checkout-summary-icon-dow'>
                    <DownOutlined />
                  </div>
                </div>
              )}
            </div>
            {showOrderDetails && (
              <div className='checkout-summary-rows'>
                <div className='checkout-summary-row'>
                  <div className='checkout-summary-label'>Subtotal</div>
                  <div className='checkout-summary-value'>
                    <Price price={order.subtotal} />
                  </div>
                </div>
                <div className='checkout-summary-row'>
                  <div className='checkout-summary-label'>Shipping fee</div>
                  {order.shipping_methods.map((shipping, key) => {
                    return (
                      <div className='checkout-summary-value' key={key}>
                        <Price price={shipping.cost} />
                      </div>
                    )
                  })}
                </div>
                <div className='checkout-summary-row'>
                  <div className='checkout-summary-label'>Discount</div>
                  <div className='checkout-summary-value'>
                    - <Price price={order.discount} />
                  </div>
                </div>
                {order.promotion &&
                  order.promotion.sales_rule_id &&
                  order.promotion.coupon_code && (
                    <div className='checkout-summary-row'>
                      <div className='checkout-summary-label'>Coupon</div>
                      <div className='checkout-summary-value'>
                        - <Price price={order.promotion.discount} />
                      </div>
                    </div>
                  )}
                <div className='checkout-summary-row order-summary-row-total'>
                  <div className='checkout-summary-label'>Total</div>
                  <div className='checkout-summary-value'>
                    <Price price={order.grand_total} />
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
        <Link href='/'>
          <a>
            <button className='btn btn-thank-you'>Continue shopping</button>
          </a>
        </Link>
      </div>
    </div>
  )
}

export default CheckoutSuccess
