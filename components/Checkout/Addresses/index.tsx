import React, { useState, useEffect } from 'react'
import AddressForm from 'components/Checkout/Addresses/AddressForm'
import { CheckoutStep } from '../../../store/interfaces'
// import AddressBox from 'components/Checkout/Addresses/AddressBox'
// import AddressList from 'components/Checkout/Addresses/AddressList'
import { useDispatch, useSelector } from 'react-redux'
import { changeCheckoutStep } from 'actions/checkout'
import { RootState } from 'store'
import { createSelector } from 'reselect'
import { IAddress } from 'interfaces'
import { FormProvider, useForm, SubmitHandler } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import { clearCartAddress, setCartAddress } from 'store/reducers/cart'
import { checkoutPlaceOrderRequest, placeOrder } from 'actions/checkout'
import { getCustomerDefaultAddressesRequest } from 'store/services/cart'
import { getDefaultAddressSuccess } from 'actions/customer'
import { useAppSelector } from 'utils/redux'
import AddressList from './AddressList'
import AddressBox from './AddressBox'

export const addressSelector = createSelector(
  (state: RootState) => state.cart.address,
  (address) => ({
    defaultShipping: address.shipping,
    defaultBilling: address.billing,
    billingSameAddress: address.billing_same_shipping
  })
)

const schema = yup.object().shape({
  first_name: yup.string().required(),
  last_name: yup.string().required(),
  phone_number: yup.string().required(),
  address: yup.string().required(),
  city: yup.string().required(),
  email: yup.string().email().required(),
  zip_code: yup.string().required(),
  state: yup.string().required(),
  country: yup.string().required()
})

const AddressStep = ({ scrollTo }: any) => {
  const dispatch = useDispatch()
  const { defaultShipping, defaultBilling, billingSameAddress } = useSelector(
    (state: RootState) => addressSelector(state)
  )
  const cart: any = useAppSelector((state) => state.cart)
  const step = useSelector((state: RootState) => state.checkout.step)
  const isGuest = useSelector((state: RootState) => state.auth.isGuest)
  const [openAddressForm, setOpenAddressForm] = useState(false)
  const [addressKey, setAddressKey] = useState<'shipping' | 'billing'>(
    'shipping'
  )

  const methods = useForm<IAddress>({
    resolver: yupResolver(schema)
  })

  useEffect(() => {
    dispatch(clearCartAddress())
    if (isGuest) return
    async function fetchCustomerAddresses() {
      const address = await getCustomerDefaultAddressesRequest()
      dispatch(getDefaultAddressSuccess(address))
      dispatch(setCartAddress(address ? address.default_shipping : null))
    }
    fetchCustomerAddresses()
    if (cart?.address?.shipping) setOpenAddressForm(true)
  }, [])

  const handleNewAddress: SubmitHandler<IAddress> = (address: IAddress) => {
    console.log('address', address)
    dispatch(setCartAddress(address, addressKey))
    dispatch(changeCheckoutStep('shipping'))
    setOpenAddressForm(false)
  }

  return (
    <div
      className={
        'step grow stepAddress' +
        (step === CheckoutStep.Address ? ' active' : '')
      }
    >
      <h3 onClick={() => dispatch(changeCheckoutStep('address'))}>
        <span className='number'>1</span>
        Delivery Contact & Address
      </h3>
      <div className='stepContent'>
        {!defaultShipping || openAddressForm ? (
          <FormProvider {...methods}>
            <form onSubmit={methods.handleSubmit(handleNewAddress)}>
              <AddressForm />
              <button
                type='submit'
                onClick={methods.handleSubmit(handleNewAddress)}
                className='btn btnNextStep'
              >
                Continue
              </button>
            </form>
          </FormProvider>
        ) : (
          <div>
            <div className='shipTo'>Ship to:</div>
            <div className='shipTo'>Billing to:</div>
            <button
              className='btn btnNextStep'
              onClick={() =>
                scrollTo(
                  'stepAddress',
                  50,
                  dispatch(changeCheckoutStep('shipping'))
                )
              }
            >
              Continue
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default AddressStep
