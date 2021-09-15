import React, { FC } from 'react'
import { IdCardIcon, LocationIcon, NotePadIcon } from '../../Icons'
import Link from 'next/link'
import { Button } from '@material-ui/core'
import { useRouter } from 'next/router'
import { FormProvider, useForm } from 'react-hook-form'
import ArrowBackIcon from '@material-ui/icons/ArrowBack'

interface TypeProp {
  customer: any
}

const Dashboard: FC<TypeProp> = ({ customer }) => {
  const router = useRouter()
  if (!customer) return null
  let shippingAddress =
    customer && customer.address && customer.address.default_shipping
  let billingAddress =
    customer && customer.address && customer.address.default_billing
  if (typeof shippingAddress !== 'object') shippingAddress = {}
  if (typeof billingAddress !== 'object') billingAddress = {}
  const { first_name, last_name, email } = customer
  
  return (
    <div className='my-account-content dashboard-page'>
      <div className='my-account-title'>
        <div className='title'>
          <Button
            className='back-icon'
            onClick={() => router.push('/customer')}
          >
            <ArrowBackIcon />
          </Button>
          <h1>
            Hello, {first_name} {last_name}
          </h1>
        </div>
        <div className='customer-name-promotion-content'>
          From your My Account Dashboard you have the ability to view a snapshot
          of your recent account activity and update your account information
        </div>
      </div>
      <div className='block block-dashboard-info'>
        <div className='block-title'>
          <span>Account Information</span>
        </div>
        <div className='box box-information'>
          <IdCardIcon />
          <div>
            <strong className='box-title'>
              <span>Contact Information</span>
            </strong>
            <div className='box-content'>
              <p>
                {first_name} {last_name}
              </p>
              <p>{email}</p>
            </div>
            <div className='box-actions'>
              <Link href='/customer/myprofile'>
                <a className='action edit-profile'>Edit</a>
              </Link>
              <Link href='/customer/myprofile'>
                <a className='action change-password'>Change Password</a>
              </Link>
            </div>
          </div>
        </div>
      </div>
      <div className='block block-dashboard-addresses'>
        <div className='block-title'>
          <strong>Address Book</strong>
          <span className='box-actions'>
            <Link href='/customer/myprofile'>
              <a className='action manage-addresses'>Manage Addresses</a>
            </Link>
          </span>
        </div>
        <div className='block-content'>
          <div className='table-address-book'>
            <div className='box box-shipping-address'>
              <LocationIcon size={30} />
              <div>
                <strong className='box-title'>
                  <span>Default Shipping Address</span>
                </strong>
                <div className='box-content'>
                  <div className='sameAddress'>
                    {!shippingAddress ? (
                      'You have not set a default shipping address.'
                    ) : (
                      <>
                        <span></span>
                      </>
                    )}
                  </div>
                </div>
                <div className='box-actions'>
                  <Link href='/customer/addAddressBook'>
                    <a className='action manage-addresses'>Add New Address</a>
                  </Link>
                </div>
              </div>
            </div>
            <div className='box box-billing-address'>
              <NotePadIcon />
              <div>
                <strong className='box-title'>
                  <span>Default Billing Address</span>
                </strong>
                <div className='box-content'>
                  <div className='sameAddress'>(Billing some shipping)</div>
                </div>
                <div className='box-actions'>
                  <Link href='/customer/addressBook'>
                    <a className='action manage-addresses'>Edit Addresses</a>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard
