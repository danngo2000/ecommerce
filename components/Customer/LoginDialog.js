import React from 'react'
import { Input, Modal } from 'antd'
import Link from 'next/link'
import { connect } from 'react-redux'
// import ExternalLogin from '../ExternalLogin'
// import RegisterForm from './RegisterForm'
import { toggleLoginDialog, isLoginDialogOpen } from '../../actions/ui'
import { loginRequest } from '../../actions/auth'

class LoginDialog extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      form: {
        email: null,
        password: null
      },
      message: '',
      error: {},
      serverError: '',
      isLogin: true
    }
  }

  inputChange = (field, value) => {
    let form = this.state.form
    form[field] = value
    this.validateInput(field, value)
    this.setState({ form: { ...form }, message: '' })
  }

  handleClose = () => {
    this.props.toggleLoginDialog(false)
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
    const error = document.getElementById(`${refName}Errors`)
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
        error.textContent = `This email is not valid.`
        return false
      }
    }
    error.textContent = ''
    return true
  }

  handleLogin = async () => {
    if (this.validateAllFields()) {
      this.props.loginRequest(this.state.form.email, this.state.form.password)
      this.props.onClose
    } else {
      this.setState({ message: 'Invalid email or password' })
    }
  }

  responseFacebook = (response) => {
    if (response) this.props.toggleLoginDialog(false)
  }

  handleKeyDown = (e, callback) => {
    if (e.key === 'Enter') callback()
  }

  render() {
    const {
      message,
      form: { email, password },
      isLogin
    } = this.state
    const { isLoginDialogOpen, toggleLoginDialog } = this.props

    const theme = this.props.config['site/theme']
    return (
      <div>
        <div style={{ display: 'none' }}>
          {/* <ExternalLogin
            facebookProps={{
              shouldRedirect: false,
              textButton: 'Facebook',
              cssClass: 'fbButtonDialog',
              onResponse: (response) => this.responseFacebook(response)
            }}
            googleProps={{
              buttonText: 'Google',
              onResponse: (response) => this.responseFacebook(response)
            }}
          /> */}
        </div>
        <Modal
          width='80%'
          title={null}
          onCancel={this.props.onClose}
          footer={null}
          className={`${theme} loginDialog bp3-dialog popupLight product-modal`}
          visible={this.props.openLoginDialog}
        >
          <div className='bp3-dialog-body'>
            <h1>
              {isLogin
                ? 'Welcome! Please Login to continue.'
                : 'Welcome! Please Register to continue.'}
            </h1>
            <p className='register-text'>
              {isLogin ? 'New member?' : 'Already member?'}{' '}
              <a onClick={(e) => this.setState({ isLogin: !isLogin })}>
                {isLogin ? 'Register' : 'Login'}
              </a>
            </p>
            {isLogin ? (
              <div className='dialog-form'>
                <div className='form-login-left'>
                  <div className='email-input'>
                    <p className='label'>{'Email'}</p>
                    <Input
                      className='input-ant'
                      type='text'
                      id='email'
                      placeholder={'Email'}
                      size='large'
                      onChange={(e) =>
                        this.inputChange('email', e.target.value)
                      }
                      value={email || ''}
                    />
                    <div className='error' id='emailErrors' />
                  </div>
                  <div className='password-input'>
                    <p className='label'>{'Password'}</p>
                    <Input
                      className='input-ant'
                      size='large'
                      type='password'
                      id='password'
                      placeholder={'Password'}
                      onKeyDown={(e) =>
                        this.handleKeyDown(e, () => this.handleLogin())
                      }
                      onChange={(e) =>
                        this.inputChange('password', e.target.value)
                      }
                      value={password}
                    />
                    <div style={{ color: 'red' }}>{message}</div>
                    <p className='forgot-text'>
                      <Link href='/customer/forgotPassword'>
                        <a onClick={() => toggleLoginDialog(false)}>
                          Forgot Password?
                        </a>
                      </Link>
                    </p>
                  </div>
                  <div className='error' id='passwordErrors' />
                  <div className='error' id='showError'>
                    {this.state.serverError}
                  </div>
                </div>
                <div className='actions'>
                  <div className='col1' style={{ textAlign: 'center' }}>
                    <button onClick={this.handleLogin} className='btn login'>
                      Login
                    </button>
                    <div className='strike'>
                      <span>Or, login with</span>
                    </div>
                    {/* <ExternalLogin
                      facebookProps={{
                        shouldRedirect: false,
                        textButton: 'Facebook',
                        cssClass: 'fbButtonDialog',
                        onResponse: (response) =>
                          this.responseFacebook(response)
                      }}
                      googleProps={{
                        buttonText: 'Google',
                        cssClass: 'googleButtonDialog',
                        onResponse: (response) =>
                          this.responseFacebook(response)
                      }}
                    /> */}
                  </div>
                </div>
              </div>
            ) : (
              //   <RegisterForm />
              ''
            )}
          </div>
        </Modal>
      </div>
    )
  }
}

const mapState = (state) => ({
  config: state.config
})

export default connect(mapState, { toggleLoginDialog, loginRequest })(
  LoginDialog
)
