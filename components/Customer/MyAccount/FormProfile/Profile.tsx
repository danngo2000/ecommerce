import React from 'react'
import { TextField } from '@material-ui/core'
import { useFormContext, Controller } from 'react-hook-form'

const Profile = () => {
  const {
    control,
    formState: { errors }
  } = useFormContext()
  return (
    <div className='row'>
      <div className='field'>
        <Controller
          name='first_name'
          control={control}
          defaultValue=''
          render={({ field }) => (
            <TextField
              {...field}
              label='First Name'
              placeholder='First Name'
              variant='outlined'
              error={!!errors.first_name}
              helperText={errors.first_name ? 'This field is required' : ''}
              fullWidth
              InputLabelProps={{
                shrink: true
              }}
              margin='normal'
            />
          )}
        />
      </div>
      <div className='field'>
        <Controller
          name='last_name'
          control={control}
          defaultValue=''
          render={({ field }) => (
            <TextField
              {...field}
              label='Last Name'
              placeholder='Last Name'
              variant='outlined'
              error={!!errors.last_name}
              helperText={errors.last_name ? 'This field is required' : ''}
              fullWidth
              InputLabelProps={{
                shrink: true
              }}
              margin='normal'
            />
          )}
        />
      </div>
      <div className='field'>
        <Controller
          name='email'
          control={control}
          defaultValue=''
          render={({ field }) => (
            <TextField
              {...field}
              label='Email'
              variant='outlined'
              error={!!errors.email}
              helperText={errors.email ? 'This field is required' : ''}
              fullWidth
              disabled
              InputLabelProps={{
                shrink: true
              }}
              margin='normal'
            />
          )}
        />
      </div>
      <div className='field'>
        <Controller
          name='gender'
          control={control}
          defaultValue=''
          render={({ field }) => (
            <TextField
              {...field}
              label='Gender'
              variant='outlined'
              error={!!errors.gender}
              helperText={errors.gender ? 'This field is required' : ''}
              fullWidth
              select
              SelectProps={{
                native: true
              }}
              margin='normal'
            >
              <option value={0}>None</option>
              <option value={1}>Male</option>
              <option value={2}>Female</option>
            </TextField>
          )}
        />
      </div>
      <div className='field'>
        <Controller
          name='phone_number'
          control={control}
          defaultValue=''
          render={({ field }) => (
            <TextField
              {...field}
              label='Phone number'
              placeholder='Phone number'
              variant='outlined'
              error={!!errors.phone_number}
              helperText={errors.phone_number ? 'This field is required' : ''}
              fullWidth
              InputLabelProps={{
                shrink: true
              }}
              margin='normal'
            />
          )}
        />
      </div>
    </div>
  )
}

export default Profile
