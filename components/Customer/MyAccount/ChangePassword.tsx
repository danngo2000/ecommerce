import React, { useState } from 'react'
import { TextField } from '@material-ui/core'

const ChangePassword = () => {
  const [state, setState] = useState<any>({
    new_password: '',
    current_password: '',
    confirm_password: ''
  })
  const [errors, setErrors] = useState<any>({})

  const handlePasswordFieldChange = (event: any) => {
    const { name, value } = event.target
    setState({ ...state, [name]: value })
  }

  const handleUpdatePassword = () => {

  }
  
  return (
    <div className='wrap'>
      <div className='form-box'>
        <form>
          <div className='row'>
            <div className='field'>
              <TextField
                onChange={handlePasswordFieldChange}
                name='new_password'
                label='New Password'
                placeholder='New Password'
                error={!!errors.NPEmpty}
                helperText={errors.NPEmpty ? 'Please Enter New Password' : ''}
                fullWidth
                required
                margin='normal'
                InputLabelProps={{
                  shrink: true
                }}
                variant='outlined'
              />
            </div>
            <div className='field'>
              <TextField
                onChange={handlePasswordFieldChange}
                name='current_password'
                label='Current Password'
                placeholder='Current Password'
                fullWidth
                required
                margin='normal'
                InputLabelProps={{
                  shrink: true
                }}
                variant='outlined'
              />
            </div>
            <div className='field'>
              <TextField
                onChange={handlePasswordFieldChange}
                name='confirm_password'
                label='Confirm Password'
                placeholder='Confirm Password'
                fullWidth
                required
                margin='normal'
                InputLabelProps={{
                  shrink: true
                }}
                variant='outlined'
              />
            </div>
          </div>
          <div className='row'>
            <div className='field'>
              <button onClick={handleUpdatePassword} type='button' className='btn'>
                Change Password
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}

export default ChangePassword
