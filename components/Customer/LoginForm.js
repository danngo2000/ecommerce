import React, { Component } from 'react'
import Link from 'next/link'
import { connect } from 'react-redux'
import ExternalLogin from '../ExternalLogin'
import { Input, Button } from 'antd'
import { LeftOutlined, UserAddOutlined } from '@ant-design/icons'
import { loginRequest } from '../../actions/auth'

class LoginForm extends Component {
  constructor(props) {
    super(props)
    this.state = {
      form: {
        email: '',
        password: ''
      },
      isLoading: false,
      showPassword: false,
      error: {},
      serverError: ''
    }
  }

  componentDidMount = () => {
    window.scrollTo(0, 0)
  }

  inputChange = (e) => {
    const form = this.state.form
    form[e.target.name] = e.target.value
    this.validateInput(e.target.name, e.target.value)
    this.setState({ form: { ...form } })
  }

  validateAllFields() {
    let allFieldsValid = true
    const inputs = ['email', 'password']
    for (let i = 0, l = inputs.length; i < l; i++) {
      let inputName = inputs[i]
      let val = this.state.form[inputName]
      let validField = this.validateInput(inputName, val)
      if (allFieldsValid && validField === false) {
        allFieldsValid = false
      }
    }
    return allFieldsValid
  }

  validateInput(refName, value) {
    const error = document.getElementById(`${refName}Error`)
    let Rexexp =
      /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    if (error === null) {
      return true
    }
    let requiredFields = ['email', 'password']
    if (requiredFields.includes(refName) && value === '') {
      error.textContent = `This field is required`
      return false
    }
    if (['email'].includes(refName)) {
      if (value !== '' && !Rexexp.test(value)) {
        error.textContent = 'This email is not valid.'
        return false
      }
    }
    error.textContent = ''
    return true
  }

  handleLogin = async () => {
    this.setState({ isLoading: true })
    const { email, password } = this.state.form
    if (this.validateAllFields()) {
      this.props.loginRequest(email, password)
    } else {
      this.setState({ serverError: '', isLoading: false })
    }
  }

  handleKeyDown = (e, callback) => {
    if (e.key === 'Enter') callback()
  }

  render() {
    const { facebookRedirectUri } = this.props
    const externalLogin = (
      <ExternalLogin
        facebookProps={{
          shouldRedirect: true,
          redirectUri: facebookRedirectUri,
          textButton: <span>Facebook</span>,
          disableMobileRedirect: true
        }}
        googleProps={{
          buttonText: <span>Google</span>,
          shouldRedirect: false
        }}
      />
    )
    return (
      <div className='signIn-layout'>
        <div className='container AccountForm responsive'>
          <div className='loginHeaderBackground'>
            <div className='HideBackground'>
              <div className='ContentHeaderBackground'>
                <Link href='/'>
                  <a>
                    <LeftOutlined className='iconHideHeader' />
                    <div className='ContentHideHeader'>Home</div>
                  </a>
                </Link>
                <Link href='/customer?subPage=register' as='/customer/register'>
                  <a>
                    <div className='ContentHideHeader'>Register</div>
                    <UserAddOutlined className='iconHideHeader' />
                  </a>
                </Link>
              </div>
            </div>
          </div>
          <div className='signIn-form'>
            <div className='login-title'>
              <h3>
                Welcome to
                <span className='theme-title'>
                  {this.props.config['site/name']}
                </span>
                ! Please login.
              </h3>
              <span className='login-other'>
                <span>
                  New member?
                  <Link
                    href='/customer?subPage=register'
                    as='/customer/register'
                  >
                    <a>Register</a>
                  </Link>
                </span>
              </span>
            </div>
            <div className='login-content'>
              <div className='mod-login'>
                <div className='mod-login-col1'>
                  <div className='field fieldEmail'>
                    <label htmlFor='email'>Email*</label>
                    <input
                      onChange={this.inputChange}
                      value={this.state.form.email}
                      className='required-entry input-text'
                      type='text'
                      name='email'
                      id='email'
                      autoComplete='off'
                      placeholder='Email'
                      maxLength='70'
                    />
                    <div className='error' id='emailError' />
                  </div>
                  <div className='field fieldPassword borderPassword'>
                    <label htmlFor='password'>Password*</label>
                    <Input.Password
                      className='lso-password-input inputPassword'
                      type={this.state.showPassword ? 'text' : 'password'}
                      value={this.state.form.password}
                      name='password'
                      id='password'
                      autoComplete='off'
                      placeholder='Password'
                      onKeyDown={(e) => this.handleKeyDown(e, this.handleLogin)}
                      onChange={this.inputChange}
                      required
                    />
                    <div className='error' id='passwordError' />
                    <div className='error' id='showError'>
                      {this.state.serverError === 'unauthorized'
                        ? 'Your account is currently locked.'
                        : this.state.serverError}
                    </div>
                  </div>

                  <div className='field fieldButton'>
                    <Link
                      href='/customer?subPage=forgotPassword'
                      as='/customer/forgotPassword'
                    >
                      <a>Forgot Your Password?</a>
                    </Link>
                  </div>
                </div>

                <div className='mod-login-col3 loginForm'>
                  <Button onClick={this.handleLogin} className='btn loginBtn'>
                    Sign In
                  </Button>
                  <span className='signup-with'>Or, login with </span>
                  {externalLogin}
                  <div className='register-mobile'>
                    <div className='register-label'>Don’t have an account?</div>
                    <div className='btn loginBtn'>
                      <Link
                        href='/customer?subPage=register'
                        as='/customer/register'
                      >
                        <a>Create an account</a>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

const mapState = (state) => ({
  config: state.config
})
export default connect(mapState, {
  loginRequest
})(LoginForm)
