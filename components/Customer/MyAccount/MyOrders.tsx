import React, { useEffect, useState } from 'react'
import { Button } from '@material-ui/core'
import { Pagination } from '@material-ui/lab'
import Link from 'next/link'
import ArrowBackIcon from '@material-ui/icons/ArrowBack'
import { useRouter } from 'next/router'
import Image from 'next/image'
import { imageLoader } from 'utils'
import axios from 'axios'
import OrderLoading from './OrderLoading'
import { DateTime } from 'luxon'

const getStatus = (code: string) => {
  return (code.charAt(0).toUpperCase() + code.slice(1)).replace('_', ' ')
}

const MyOrders = () => {
  const router = useRouter()
  const [orders, setOrders] = useState([])
  const [page, setPage] = useState(1)
  const [limit, setLimit] = useState(10)
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(false)

  const Time = ({time}) => {
    const date = DateTime.fromISO(time)
    const dateTime = date.toLocaleString(DateTime.DATETIME_MED);
    return (
      <span>{dateTime}</span>
    )
  }

  useEffect(() => {
    getCustomerOrder()
  }, [page])

  const getCustomerOrder = async () => {
    setLoading(true)
    try {
      const {
        data: { orders, total }
      } = await axios.get(
        `orders/getCustomerOrders?count=true&page=${page}&limit=${limit}`
      )
      setOrders(orders)
      setTotal(total)
      setLoading(false)
    } catch (error) {}
  }

  const handlePageChange = (event: any, value: any) => {
    window.scroll({ top: 0 })
    setPage(value)
  }

  return (
    <div className='my-account-content order-page'>
      <div className='my-account-title'>
        <div className='title'>
          <Button
            className='back-icon'
            onClick={() => router.push('/customer')}
          >
            <ArrowBackIcon />
          </Button>
          <h1>My Orders</h1>
        </div>
      </div>
      <div className='order-list'>
        {loading && <OrderLoading />}
        {orders.map((order: any) => (
          <div key={order._id} className='content-box'>
            <div className='box-header'>
              <label>Order ID:</label>
              <Link href={`/customer/orders/${order._id}`}>
                <a>#{order.order_number}</a>
              </Link>
              <div className='created'>
                Place on&nbsp;
                <Time time={order.created_at} />
              </div>
              <div className='actions'>
                <div className='column column-status'>
                  <span className={'order-status ' + order.status_code}>
                    {getStatus(order.status_code)}
                  </span>
                </div>
                <Link href={`/customer/orders/${order._id}`}>
                  <a>Manage</a>
                </Link>
              </div>
            </div>
            <div className='content-body'>
              {order.items.map((item: any, index: number) => (
                <div key={index} className='order-item'>
                  <div className='column column-item-thumbnail'>
                    {item.thumbnail && (
                      <Image
                        loader={imageLoader}
                        src={item?.thumbnail}
                        width={97.5}
                        height={130}
                        objectFit='contain'
                        alt=''
                      />
                    )}
                  </div>
                  <div className='column column-item-name'>{item.name}</div>
                  <div className='column coloumn-qty'>
                    <span>Qty: {item.qty}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
      <div className='pagination-container'>
        <Pagination
          defaultPage={page}
          count={total}
          shape='rounded'
          onChange={handlePageChange}
        />
      </div>
    </div>
  )
}

export default MyOrders
