import Menu from "components/Customer/MyAccount/Menu"
import MyAcountContent from "components/Customer/MyAccount/MyAcountContent"
import Layout from "components/Layout"
import React from "react"

const index = () => {
  return (
    <Layout page='my-account'>
      <MyAcountContent page='customer' />
    </Layout>
  )
}

export default index
