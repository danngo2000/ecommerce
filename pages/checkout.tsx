import React, { useEffect } from 'react'
import { fetchConfig } from 'actions/config'
import { wrapper } from 'store'
import { NextSeo } from 'next-seo'
import { END } from 'redux-saga'
import Layout from 'components/Layout'
import { withRouter } from 'next/router'
import { useSelector } from 'react-redux'
import CheckoutSuccess from 'components/Checkout/CheckoutSuccess'
import CheckoutContent from 'components/Checkout/CheckoutContent'
import CartEmptyContent from 'components/Cart/CartEmptyContent'

const Checkout = (props: any) => {
  const { router } = props
  const { isGuest } = useSelector((state: any) => state.auth)
  const { showCheckoutSuccess } = useSelector((state: any) => state.checkout)
  const cart = useSelector((state: any) => state.cart)

  return (
    <Layout pageName='checkout'>
      <NextSeo title='Shopping Checkout' />
      {showCheckoutSuccess ? (
        <CheckoutSuccess />
      ) : cart.item_count === null ? (
        <div />
      ) : cart.items_count > 0 ? (
        <CheckoutContent />
      ) : (
        <CartEmptyContent />
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

export default withRouter(Checkout)
