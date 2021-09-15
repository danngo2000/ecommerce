import React from 'react'
import MyAcountContent from 'components/Customer/MyAccount/MyAcountContent'
import Layout from 'components/Layout'
import { wrapper } from 'store'
import { fetchConfig } from 'actions/config'
import { END } from 'redux-saga'
import axios from 'axios'
import qs from 'qs'

const OrderID = ({ order }) => {
  console.log('order', order)

  return (
    <Layout page='orderDetail'>
      <MyAcountContent page='null' />
    </Layout>
  )
}

export const getServerSideProps = wrapper.getServerSideProps(
  async (context: any) => {
    try {
      let isServer = typeof window == 'undefined'
      const { id } = context.query

      if (isServer) {
        context.store.dispatch(fetchConfig())
        context.store.dispatch(END)
        await context.store.sagaTask.toPromise()
      }
      
      const {
        data: { order }
      } = await axios.get(`orders/customer/${id}`)
      return {
        props: {
          order
        }
      }
    } catch (error) {
      console.log('getServerSideProps', error)
      return { props: {} }
    }
  }
)

export default OrderID
