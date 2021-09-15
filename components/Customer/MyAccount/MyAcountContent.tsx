import React, { FC, useEffect } from 'react'
import AddressBookForm from './AddressBookForm'
import AddressBooks from './AddressBooks'
import Dashboard from './Dashboard'
import Menu from './Menu'
import MyOrders from './MyOrders'
import MyWishlist from './MyWishlist'
import MyProfile from './MyProfile'
import OrderDetail from './OrderDetail'
import { useRouter } from 'next/router'
import MyReviews from './MyReviews'
import { useSelector } from 'react-redux'
import { RootState } from 'store'
import { useAppSelector } from 'utils/redux'

interface IContent {
  page: any
  customer: any
  id: any
}
interface TypesProp {
  page: any
}

const Content: FC<IContent> = ({ page, customer, id }) => {
  switch (page) {
    case '/customer':
      return <></>
    case '/customer/dashboard':
      return <Dashboard customer={customer} />
    case '/customer/orders':
      return <MyOrders />
    case '/customer/orders/[id]':
      return <OrderDetail orderId={id} />
    case '/customer/addressbook/[id]':
      return <AddressBookForm _id={id} />
    case '/customer/addressbook':
      return <AddressBooks />
    case '/customer/addaddressbook':
      return <AddressBookForm />
    case '/customer/mywishlist':
      return <MyWishlist />
    case '/customer/myprofile':
      return <MyProfile />
    case '/customer/myreviews':
      return <MyReviews />
    default:
      return <Dashboard customer={customer} />
  }
}

const Redireact = ({ to }) => {
  const router = useRouter()

  useEffect(() => {
    router.push(to)
  }, [to])

  return null
}


const MyAcountContent: FC<TypesProp> = ({ page }) => {
  const router = useRouter()
  const { route } = router
  const { id } = router.query 

  const { isGuest } = useAppSelector((state) => state.authv1);
  const { customerData } = useAppSelector((state: RootState | any) => state.customer);
  
  if (isGuest) {
    return <Redireact to='/customer/login' />
  }

  return (
    <div className='my-account-page'>
      <div className='container'>
        <div className='row'>
          <div className='menu-my-account'>
            <div className='dashboard-header'>
              <h1>
                Hello, {customerData.first_name} {customerData.last_name}
              </h1>
              <span>{customerData.email}</span>
            </div>
            <Menu page={page} />
          </div>
          <div className='content'>
            <Content page={route} customer={customerData} id={id} />
          </div>
        </div>
      </div>
    </div>
  )
}

export default MyAcountContent
