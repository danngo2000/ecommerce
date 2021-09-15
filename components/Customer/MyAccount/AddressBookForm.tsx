import React, { useState, FC, useEffect } from 'react'
import { Button, FormControlLabel, Switch } from '@material-ui/core'
import Snackbar from '@material-ui/core/Snackbar'
import MuiAlert, { AlertProps } from '@material-ui/lab/Alert'
import { useRouter } from 'next/router'
import ArrowBackIcon from '@material-ui/icons/ArrowBack'
import { FormProvider, useForm, SubmitHandler } from 'react-hook-form'
import { IAddress } from 'interfaces'
import axios from 'axios'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import AddressForm from 'components/Checkout/Addresses/AddressForm'
import { useSelector } from 'react-redux'
import { RootState } from 'store'

interface TypeProp {
  _id?: string
}

const schema = yup.object().shape({
  first_name: yup.string().required(),
  last_name: yup.string().required(),
  phone_number: yup.string().required(),
  street: yup.string().required(),
  city: yup.string().required(),
  email: yup.string().email().required(),
  zip_code: yup.string().required(),
  state: yup.string().required(),
  country: yup.string().required()
})

function Alert(props: AlertProps) {
  return <MuiAlert elevation={6} variant='filled' {...props} />
}

const AddressBookForm: FC<TypeProp> = ({ _id }) => {
  const router = useRouter()
  const customer = useSelector((state: RootState | any) => state.customer)
  const [isLoading, setLoading] = useState(false)
  const [notification, setNotification] = useState(false)
  const [isDefaultShipping, setDefaultShipping] = useState(false)
  const [isDefaultBilling, setDefaultBilling] = useState(false)

  const methods = useForm<IAddress>({
    resolver: yupResolver(schema)
  })
  
  console.log("customer", customer);  

  useEffect(() => {
    if (!customer) return
    if (_id) {
      setLoading(true)
      axios
        .get(`addressBooks/customer/${_id}`)
        .then((res) => res.data.addressBook)
        .then((address) => {
          const defaultShippingId =
            typeof customer.address.default_shipping === 'string'
              ? customer.address.default_shipping
              : customer.address.default_shipping?._id
          const defaultBillingId =
            typeof customer.address.default_billing === 'string'
              ? customer.address.default_billing
              : customer.address.default_billing?._id
          if (defaultShippingId === address._id) setDefaultShipping(true)
          if (defaultBillingId === address._id) setDefaultBilling(true)
          methods.reset(address)
          setLoading(false)
        })
    }
  }, [])

  const formSubmitHandler: SubmitHandler<IAddress> = async (
    address: IAddress
  ) => {
    console.log('submit', address)
    setLoading(true)
    try {
      const payload: any = {
        address,
        isDefaultShipping,
        isDefaultBilling
      }
      const { data } = _id
        ? await axios.put(`addressBooks/customer/${_id}`, payload)
        : await axios.post('addressBooks/customer', payload)
      const newAddress = data.addressBooks
      setNotification(true)

      setLoading(false)
      router.push('/customer/addressbook')
    } catch (error) {
      console.log(error.message)
      setLoading(false)
    }
  }

  const handleDelete = async () => {
    setLoading(true)
    try {
      await axios.delete(`addressBookscustomer/${_id}`)
      setNotification(true)
      setLoading(false)
      router.push('/customer/addressbook')
    } catch (error) {
      console.error(error.message)
      setLoading(false)
    }
  }

  const handleClose = (event?: React.SyntheticEvent, reason?: string) => {
    if (reason === 'clickaway') {
      return
    }
    setNotification(false)
  }

  const Notification = () => {
    return (
      <Snackbar
        open={notification}
        autoHideDuration={4000}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'right'
        }}
      >
        <Alert onClose={handleClose} severity='success'>
          Deleted successfully
        </Alert>
      </Snackbar>
    )
  }

  return (
    <>
      <div className='my-account-content profile-page'>
        <div className='my-account-title'>
          <div className='title'>
            <Button
              className='back-icon'
              onClick={() => router.push('/customer')}
            >
              <ArrowBackIcon />
            </Button>
            <h1>{_id ? 'Edit address' : 'Add new address'}</h1>
          </div>
        </div>
        <div className=' profile-content address-form'>
          <div className='wrap'>
            <div className='form-box'>
              <FormProvider {...methods}>
                <form onSubmit={methods.handleSubmit(formSubmitHandler)}>
                  <div className='row'>
                    <AddressForm />
                    <div className='field'>
                      <FormControlLabel
                        control={
                          <Switch
                            onClick={() =>
                              setDefaultShipping(!isDefaultShipping)
                            }
                            checked={isDefaultShipping}
                            color='primary'
                          />
                        }
                        label='Default shipping address'
                      />
                    </div>
                    <div className='field'>
                      <FormControlLabel
                        control={
                          <Switch
                            onClick={() => setDefaultBilling(!isDefaultBilling)}
                            checked={isDefaultBilling}
                            color='primary'
                          />
                        }
                        label='Default billing address'
                      />
                    </div>
                  </div>
                  <div className='action-buttons'>
                    <button
                      onClick={methods.handleSubmit(formSubmitHandler)}
                      type='submit'
                      className='btn'
                    >
                      {_id ? 'Update Address' : 'Add Address'}
                    </button>
                    <button
                      type='button'
                      onClick={() => router.push('/customer/addressbook')}
                      className='btn-cancel'
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </FormProvider>
            </div>
          </div>
        </div>
      </div>
      {Notification()}
    </>
  )
}

export default AddressBookForm
