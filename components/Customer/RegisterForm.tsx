import Link from 'next/link'
import React, { useState } from 'react'
import { registerRequest } from 'store/reducers/auth'
import { useDispatch, useSelector } from 'react-redux'
import { useRouter } from 'next/dist/client/router'
import { RootState } from 'store'
import axios from 'axios'
import { useForm, SubmitHandler } from 'react-hook-form'

interface IFormInputs {
  email: string
  password: string
}

const RegisterForm = () => {
  const Router = useRouter()
  const nameRef = React.useRef('fullName')
  const emailRef = React.useRef('email')
  const passwordRef = React.useRef('password')
  const dispatch = useDispatch()
  // const data = useSelector((state) => state.auth)

  const [formRegister, setFormRegister] = useState({
    // fullName: "",
    // email: "",
    // password: "",
    isFormValid: false,
    fullName: '',
    firstName: '',
    lastName: '',
    email: '',
    phone_number: '',
    password: '',
    showPassword: false,
    refCode: '',
    nameRefer: '',
    serverError: '',
    monthOfBirth: '',
    yearOfBirth: '',
    dayOfBirth: '',
    birthday: '',
    gender: '',
    isLoading: false,
    checked: true
  })

  const changeInput = (event) => {
    const { name, value } = event.target
    setFormRegister({
      ...formRegister,
      [name]: value
    })
    showInputError(name)
  }

  const showInputError = (refName) => {
    const ele = document.getElementById(`${refName}`)
    const error = document.getElementById(`${refName}Error`)
    const isPassword = refName.indexOf('password') !== -1
    // const validity = ele?.validity

    // if (!validity.valid) {
    //     if (validity.valueMissing) {
    //         error.textContent = 'is a required field'
    //     } else if (validity.typeMismatch) {
    //         error.textContent = 'should be a valid email address'
    //     } else if (isPassword && validity.patternMismatch) {
    //         error.textContent = 'should be longer than 4 chars'
    //     }
    //     return false
    // }
    // error.textContent = ''
    return true
  }

  const checkAllFields = () => {
    let isFormValid = true
    const inputs = ['firstName', 'email', 'password']
    inputs.forEach((input) => {
      if (!showInputError(input)) {
        isFormValid = false
      }
    })
    return isFormValid
  }

  const validateOnServer = async () => {
    const { data } = await axios.post('customers/check', {
      type: 'existing_email',
      email: formRegister.email
    })
    if (!data.status) {
      setFormRegister({ ...formRegister, serverError: data.messenger })
    }
    return data.status
  }

  const readySunmit = async () => {
    const isFormValid = checkAllFields()
    setFormRegister({ ...formRegister, isFormValid: isFormValid })
    if (isFormValid) {
      const statusCheck = await validateOnServer()
      if (statusCheck) {
        return true
      }
    }
    return false
  }

  const handleLogin = async () => {
    const valid = await readySunmit()
    if (valid) {
      dispatch(registerRequest(formRegister))
    }
  }

  return (
    <div className='register-form account-form container'>
      <h1>Let’s create your new account</h1>
      <div className='form-wrap'>
        <div className='field form-group field-name'>
          <label>Name</label>
          <input
            id='firstName'
            onChange={changeInput}
            value={formRegister.firstName}
            className='input-text form-control'
            type='text'
            name='firstName'
            // ref={nameRef}
            minLength={4}
            maxLength={70}
            placeholder='Your Full Name'
            required
          />
          <div className='error' id='firstNameError' />
        </div>
        <div className='field form-group field-email'>
          <label>Email</label>
          <input
            id='email'
            value={formRegister.email}
            onChange={changeInput}
            required
            minLength={5}
            maxLength={70}
            // ref={emailRef}
            className='required-entry input-text form-control'
            type='email'
            name='email'
            placeholder='your@email.com'
          />
          <div className='error' id='emailError'>
            {formRegister.serverError}
          </div>
        </div>
        <div className='field form-group field-password'>
          <label id='passwordLabel'>Password</label>
          <input
            id='password'
            value={formRegister.password}
            onChange={changeInput}
            className='required-entry input-text form-control'
            type='password'
            name='password'
            // ref={passwordRef}
            pattern='.{5,}'
            required
          />
          <div className='error' id='passwordError' />
        </div>
        <div className='field form-group fieldButton'>
          <div className='field fieldButton'>
            <button onClick={handleLogin} type='submit' className='btn'>
              Register
            </button>
          </div>
        </div>
        <div className='link-actions'>
          Already have an account?&nbsp;
          <Link href='/customer/login'>
            <a>Login</a>
          </Link>
        </div>
      </div>
    </div>
  )
}

export default RegisterForm
