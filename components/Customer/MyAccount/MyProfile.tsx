import { Button, TextField } from '@material-ui/core'
import React, { useState, useEffect, FC } from 'react'
import ArrowBackIcon from '@material-ui/icons/ArrowBack'
import { useRouter } from 'next/router'
import axios from 'axios'
import Profile from './FormProfile/Profile'
import { FormProvider, useForm, SubmitHandler } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import { loginRequestSuccess } from 'actions/auth'
import ChangePassword from './ChangePassword'

interface IForm {
  first_name: string
  last_name: string
  email: string
  phone: string
}

const schema = yup.object().shape({
  first_name: yup.string().required(),
  last_name: yup.string().required(),
  phone_number: yup.string().required()
})

const MyProfile: FC = () => {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState({})

  useEffect(() => {
    getProfile()
  }, [])

  const getProfile = async () => {
    setIsLoading(true)
    const {
      data: { customer }
    } = await axios.get('customers/myProfile')
    if (!customer.address) {
      customer.address = {}
    }
    if (!customer.gender) {
      customer.gender = ''
    }
    if (!customer.phone_number) {
      customer.phone_number = ''
    }
    methods.reset(customer)
    setIsLoading(false)
  }

  const methods = useForm<IForm>({ resolver: yupResolver(schema) })

  const handleUpdateProfile: SubmitHandler<IForm> = async (customer: IForm) => {
    const { data } = await axios.post('customers/myProfile', {
      ...customer
    })
    if (data.status === false) {
      setError({ email: data.messenger })
    } else {
      loginRequestSuccess(data.token, data.customer)
    }
  }

  return (
    <div className='my-account-content profile-page'>
      <div className='my-account-title'>
        <div className='title'>
          <Button
            className='back-icon'
            onClick={() => router.push('/customer')}
          >
            <ArrowBackIcon />
          </Button>
          <h1>My Profile</h1>
        </div>
      </div>
      <div className='profile-content'>
        <div className='wrap'>
          <div className='form-box'>
            <FormProvider {...methods}>
              <form onSubmit={methods.handleSubmit(handleUpdateProfile)}>
                <Profile />
                <div className='row'>
                  <div className='field'>
                    <button
                      onClick={methods.handleSubmit(handleUpdateProfile)}
                      type='button'
                      className='btn'
                    >
                      Update Profile
                    </button>
                  </div>
                </div>
              </form>
            </FormProvider>
          </div>
        </div>
        <ChangePassword />
      </div>
    </div>
  )
}

export default MyProfile
