import React from 'react'
import Link from 'next/link'
// import { T } from 'locales'
import * as Icon from '@ant-design/icons'
import { useDispatch, useSelector } from 'react-redux'
// import { logoutRequest } from '../../actions/auth'

export default function AccountTooltip () {
  const dispatch = useDispatch()
  const customer = useSelector(state => state.customer)
  return (
    <div className='account-noti-wrapper'>
      <div className='account-wrapper'>
        <Link href='/customer?subPage=dashboard' as='/customer/dashboard'>
          <a className='profile-infor'> 
            {(customer && customer.avatar)
              ? <img src={customer.avatar} alt='' className='account-avatar' />
              : <img src='/static/images/default_user.png' alt='' className='account-avatar' />
            }
            <div className='profile-content'>
              {customer && <span> {customer.first_name} {customer.last_name}</span>}
              View Profile
              {/* <T>View Profile</T> */}

            </div>
            <img src='/static/images/customerProfile/profile-arrow.svg' alt='' className='profile-arrow' />
          </a>
        </Link>
        <Link href='/customer?subPage=myWishlist' as='/customer/myWishlist'>
          <a href='' className='profile-heart profile-item'>
            <Icon.HeartOutlined />
            {/* <T>Wishlist</T> */}
            Wishlist
          </a>
        </Link>
        <Link href='/cart'>
          <a href='' className='profile-cart profile-item'>
            <Icon.ShoppingOutlined />Shopping Cart
          </a>
        </Link>
        <Link href='/customer?subPage=saved' as='/customer/saved'>
          <a href='' className='profile-cart profile-item'>
            <Icon.ClockCircleOutlined />Saved for later
          </a>
        </Link>
        <Link href='/customer?subPage=orders' as='/customer/orders'>
          <a href='' className='profile-order-history profile-item'>
            <Icon.UnorderedListOutlined />Order History
          </a>
        </Link>
        <Link href='/page/help-center'>
          <a href='' className='profile-option profile-item profile-FAQ'>
            <Icon.QuestionOutlined />FAQ
          </a>
        </Link>
        <Link href='#'>
          <a className='profile-option profile-item' onClick={e => dispatch(logoutRequest())}>
            <Icon.LogoutOutlined />Logout
          </a>
        </Link>
      </div>
    </div>
  )
}
