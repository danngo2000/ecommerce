import React, { FC, useState, useEffect } from 'react'
import { useFormContext, Controller } from 'react-hook-form'
import { FormControlLabel, Switch, TextField } from '@material-ui/core'
import axios from 'axios'
import Countries from 'utils/data/Countries.json'
import statesOnUs from 'utils/data/statesOnUs.json'


const getLabelAndValue = (item: any) => {
  let value: string | number = item.value || item.id || item.code || item.name
  let label: string = item.label || item.name
  return [`${label}`, `${value}`]
}

const AddressForm: FC = () => {
  const {
    setValue,
    watch,
    control,
    formState: { errors }
  } = useFormContext()

  const [provinceOptions, setProvinceOptions] = useState([])
  const [countryOptions, setCountryOptions] = useState<any>([])
  const allowedCountries = ['US']

  useEffect(() => {
    if (allowedCountries instanceof Array) {
      if (allowedCountries.includes('*')) setCountryOptions(Countries)
      if (allowedCountries.length === 1 && allowedCountries.includes('US')) {
        setValue('country', 'US')
        setCountryOptions([Countries[0]])
      }
    }
  }, [])

  useEffect(() => {
    if (watch('conutry') === 'VN' && !provinceOptions.length) {
      axios
        .get(`addressBooks/region`)
        .then((res) => setProvinceOptions(res.data))
        .catch((error) => console.log(error.message))
    }
  }, [watch('conutry')])

  return (
    <>
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
              label='Email Address'
              placeholder='Email Address'
              variant='outlined'
              error={!!errors.email}
              helperText={errors.email ? 'This field is required' : ''}
              fullWidth
              type='email'
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
          name='phone_number'
          control={control}
          defaultValue=''
          render={({ field }) => (
            <TextField
              {...field}
              label='Phone Number'
              placeholder='Phone Number'
              variant='outlined'
              error={!!errors.phone_number}
              helperText={errors.phone_number ? 'This field is required' : ''}
              fullWidth
              type='number'
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
          name='street'
          control={control}
          defaultValue=''
          render={({ field }) => (
            <TextField
              id='autocomplete'
              {...field}
              label='Address'
              placeholder='Address'
              variant='outlined'
              error={!!errors.street}
              helperText={errors.street ? 'This field is required' : ''}
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
          name='zip_code'
          control={control}
          defaultValue=''
          render={({ field }) => (
            <TextField
              {...field}
              label='Zip Code'
              placeholder='Zip code'
              variant='outlined'
              error={!!errors.zip_code}
              helperText={errors.zip_code ? 'This field is required' : ''}
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
          name='country'
          control={control}
          defaultValue='US'
          render={({ field }) => (
            <TextField
              {...field}
              label='Country'
              variant='outlined'
              error={!!errors.country}
              helperText={errors.country ? 'This field is required' : ''}
              fullWidth
              select
              SelectProps={{
                native: true
              }}
              margin='normal'
            >
              <option>Select your country</option>
              <option value={'US'}>United States</option>
            </TextField>
          )}
        />
      </div>
      <div className='field'>
        <Controller
          name='state'
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              label='State'
              variant='outlined'
              error={!!errors.state}
              helperText={errors.state ? 'This field is required' : ''}
              fullWidth
              select
              SelectProps={{
                native: true
              }}
              margin='normal'
            >
              <option>Select your state</option>
              {statesOnUs.map((item: any, index) => {
                const [label, value] = getLabelAndValue(item)
                return (
                  <option key={index} value={value}>
                    {label}
                  </option>
                )
              })}
            </TextField>
          )}
        />
      </div>
      <div className='field'>
        <Controller
          name='city'
          control={control}
          defaultValue=''
          render={({ field }) => (
            <TextField
              {...field}
              label='City'
              placeholder='City'
              variant='outlined'
              error={!!errors.city}
              helperText={errors.city ? 'This field is required' : ''}
              fullWidth
              InputLabelProps={{
                shrink: true
              }}
              margin='normal'
            />
          )}
        />
      </div>
      <div className='field'></div>
    </>
  )
}

export default AddressForm
