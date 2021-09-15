import React from "react"

const ForgotPasswordForm = () => {
  return (
    <div className='register-form account-form container'>
      <h1>Login to VNT Signature</h1>
      <div className='form-wrap'>
        <div className='field form-group field-email'>
          <label id='emailLabel'>Email address</label>
          <input
            required
            minLength={5}
            className='required-entry input-text form-control' type='email' name='email'
            placeholder='Your Email' />
          <div className='error' id='emailError' />
        </div>
        <div className='field form-group fieldButton'>
          <div className='field fieldButton'>
            <button
              type='submit'
              className='btn'
            >
                            reset my password
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ForgotPasswordForm
