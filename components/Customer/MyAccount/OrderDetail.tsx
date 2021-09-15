import React, { FC, useState, useEffect } from 'react'
import { imageLoader } from 'utils'
import Image from 'next/image'
import axios from 'axios'
import Address from './OrderDetail/Address'
import PaymentMethods from './OrderDetail/PaymentMethods'
import ShippingMethod from './OrderDetail/ShippingMethod'
import { DateTime } from 'luxon'

interface TypeProp {
  orderId: string
}

const statusPending = ['pending', 'awaiting_payment']

const OrderDetail: FC<TypeProp> = ({ orderId }) => {
  const [order, setOrder] = useState<any>(null)
  const [totalShipping, setTotalShipping] = useState(0)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    getOrderDetail()
  }, [])

  const Time = ({time}) => {
    const date = DateTime.fromISO(time)
    const dateTime = date.toLocaleString(DateTime.DATETIME_MED);
    return (
      <span>{dateTime}</span>
    )
  }

  const getOrderDetail = async () => {
    setLoading(true)
    try {
      const {
        data: { order, sellerOrder, addressBookRegon }
      } = await axios.get(`orders/customer/${orderId}`)
      let totalShipping = 0
      let orderClone = { ...order }

      if (order.shipping && order.shipping.fee) {
        totalShipping = order.shipping.fee
      } else {
        if (Array.isArray(order.shipping_methods)) {
          for (let i of order.shipping_methods) {
            totalShipping += i.cost
          }
        }
      }
      if (statusPending.includes(order.status_code)) {
        orderClone.cancelable = true
      }
      setOrder(orderClone)
      setTotalShipping(totalShipping)
      setLoading(false)
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <div className='my-account-content order-detail'>
      <div className='my-account-title'>
        <h1>Order Details</h1>
      </div>
      <div className='content-box'>
        <div className='box-header'>
          <div className='order-number'>
            Order #{order && order.order_number}
          </div>
          <div className='created'>
            Placed on &nbsp;
            <Time time={order && order.created_at} />
          </div>
          <div className='order-total'>
            <span>Total: ${order && order.grand_total}</span>
          </div>
        </div>
        <div className='row'>
          <div className='order-wrap'>
            <div className='order-item-list'>
              <table className='order-items'>
                <thead>
                  <tr>
                    <th></th>
                    <th>Name</th>
                    <th>SKU</th>
                    <th>Price</th>
                    <th>Quantity</th>
                    <th>Total</th>
                  </tr>
                </thead>
                <tbody>
                  {order &&
                    order.items.map((item: any, index: any) => (
                      <tr key={`tr-${index}`}>
                        <td>
                          {item.thumbnail && (
                            <Image
                              loader={imageLoader}
                              src={item.thumbnail}
                              width={150}
                              height={200}
                              objectFit='contain'
                            />
                          )}
                        </td>
                        <td>{item.name}</td>
                        <td>{item.sku}</td>
                        <td>
                          <span>${item.price}</span>
                        </td>
                        <td>{item.qty}</td>
                        <td>
                          <span>${item.row_total}</span>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
      <div className='address-box row'>
        <div className='column column-address'>
          <Address
            title='Shipping Address'
            showSameAddressText={false}
            address={order && order.address.shipping}
          />
          <Address
            title='Builling address'
            showSameAddressText={order && order.address.billing_same_shipping}
            address={order && order.address.billing}
          />
        </div>
        <div className='column column-total-summary'>
          <div className='tolal-summary'>
            <h3>Total Summary</h3>
            <div className='total-wrap'>
              <div className='total-item'>
                <label>Subtotal:</label>
                <span>${order && order.subtotal}</span>
              </div>
              <div className='total-item'>
                <label>Discount:</label>
                {order &&
                order.promotion &&
                order.promotion.sales_rule &&
                order.promotion.sales_rule.coupon_code ? (
                  <span>{order.promotion.sales_rule.coupon_code}</span>
                ) : (
                  <span />
                )}
                <span>- ${order && order.discount}</span>
              </div>
              <div className='total-item'>
                <label>
                  Tax{order && order.tax.name ? '(' + order.tax.name + ')' : ''}
                  :
                </label>
                <span>${order && order.tax.total}</span>
              </div>
              <div className='total-item'>
                {order && order.shipping && order.shipping.fee ? (
                  <>
                    <label>Shipping fee:</label>
                    <span>{order && order.shipping.fee}</span>
                  </>
                ) : (
                  <>
                    <label>Shipping fee:</label>
                    <span>${totalShipping}</span>
                  </>
                )}
              </div>
              <div className='total-item grand-total'>
                <label>Grand total:</label>
                <span>${order && order.grand_total}</span>
              </div>
            </div>
            <PaymentMethods payment={order && order.payment} />
            <ShippingMethod shipping={order && order.shipping_methods} />
          </div>
        </div>
      </div>
    </div>
  )
}

export default OrderDetail
