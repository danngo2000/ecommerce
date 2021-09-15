import React, { useState, useEffect } from 'react'
import { fetchConfig } from 'actions/config'
import { wrapper } from 'store'
import { END } from 'redux-saga'
import { withRouter } from 'next/router'
import Layout from 'components/Layout'
import { NextSeo } from 'next-seo'
import { useSelector } from 'react-redux'

const Cart = (props: any) => {
  const [status, setStatus] = useState(null)
  const { customerData } = useSelector((state: any) => state.customer)

  useEffect(() => {
    const { token } = props.router.query
  }, [])

  return (
    <Layout pageName='cartPage'>
      <NextSeo title='Shopping Cart' />
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
