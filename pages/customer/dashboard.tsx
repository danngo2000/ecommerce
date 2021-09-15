import React, { FC } from "react"
import { fetchConfig } from "actions/config"
import { SagaStore, wrapper } from "store"
import { END } from "redux-saga"
import Layout from "components/Layout"
import MyAcountContent from "components/Customer/MyAccount/MyAcountContent"
import { useSelector } from "react-redux"

const dashboard = () => {
  return (
    <Layout page='dashboard'>
      <MyAcountContent page='dashboard' />
    </Layout>
  )
}

export const getStaticProps = wrapper.getStaticProps(async ({ store }: any) => {
  if (typeof window !== "object") {
    store.dispatch(fetchConfig())
    store.dispatch(END)
    await store.sagaTask.toPromise()
  }
})


export default dashboard
