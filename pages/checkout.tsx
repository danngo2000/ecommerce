import React from "react"
import { useDispatch } from "react-redux";
import { fetchConfig } from "actions/config";
import { SagaStore, wrapper } from "store"
import { END } from "redux-saga";
import Layout from "components/Layout";
import CheckoutContent from "components/Checkout/CheckoutContent";

const checkout = () => {
  return (
    <Layout page='checkout-page'>
      <CheckoutContent />
    </Layout>
  )
}

export const getServerSideProps = wrapper.getServerSideProps(async ({ store }: any) => {
  store.dispatch(END)
  await store.sagaTask.toPromise()
  return {}
})

export default checkout
