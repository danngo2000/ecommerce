import React, { useState, useEffect } from 'react'
import { fetchConfig } from 'actions/config'
import { wrapper } from 'store'
import { END } from 'redux-saga'
import { withRouter } from 'next/router'
import Layout from 'components/Layout'
import { NextSeo } from 'next-seo'
import { useSelector } from 'react-redux'
import axios from 'axios'
import { notification } from 'antd'
import { logoutRequest } from '../actions/auth'
import { updateCart } from '../actions/cart'
import LoginForm from '../components/Customer/LoginForm'
import Loading from '../components/Blocks/Loading'
import CartEmptyContent from '../components/Cart/CartEmptyContent'
import NewCartContent from '../components/Cart/NewCartContent'

const Cart = (props: any) => {
  const [status, setStatus] = useState(null)
  const customer = useSelector((state: any) => state.customer)
  const { token } = props.router.query
  const cart = useSelector((state: any) => state.cart)
  const [isCartLoading, setIsCartLoading] = useState(false)

  useEffect(() => {
    ;(async function () {
      if (token) {
        try {
          const {
            data: { message, error, status, quote }
          } = await axios.post('cart-abandoned/token/verify', { token })
          const inform: any = {
            message: message || error,
            placement: 'topRight'
          }
          if (message) notification.open(inform)
          if (error) notification.warning(inform)

          if (status) {
            if (
              ['unauthorized', 'quest'].includes(status) &&
              customer &&
              customer._id
            ) {
              logoutRequest()
              if (status === 'unauthorized')
                notification.warning({
                  message: 'Please log in to continue',
                  placement: 'topRight'
                })
              if (status === 'quest' && quote) updateCart(quote)
            }
            setStatus(status)
          }
        } catch (error) {
          console.log(error.message)
        }
      }
    })
  }, [])

  useEffect(() => {
    const { token } = props.router.query
    if (!token) setStatus(status)
  }, [])

  return (
    <Layout pageName='cartPage'>
      <NextSeo title='Shopping Cart' />
      {status === 'unauthorized' ? (
        <LoginForm redirect={`/cart`} />
      ) : !cart.items?.length ? (
        isCartLoading ? (
          <Loading height={160} width={400} speed={200} />
        ) : (
          <CartEmptyContent />
        )
      ) : (
        <NewCartContent />
      )}
    </Layout>
  )
}

export const getServerSideProps = wrapper.getServerSideProps(
  async ({ store }: any) => {
    store.dispatch(fetchConfig())
    store.dispatch(END)
    await store.sagaTask.toPromise()
    return {}
  }
)

export default withRouter(Cart)
