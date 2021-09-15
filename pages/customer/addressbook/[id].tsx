import MyAcountContent from 'components/Customer/MyAccount/MyAcountContent'
import Layout from 'components/Layout'
import React from 'react'

const updateAddress = () => {
  return (
    <Layout page='add-address-page'>
      <MyAcountContent page='addAddressBook' />
    </Layout>
  )
}

export default updateAddress
