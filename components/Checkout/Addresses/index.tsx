import { TextField } from "@material-ui/core"
import React from "react"

function index() {
  return (
    <div className={"step grow step-address active"}>
      <h3>
        <span className='number'>1</span>
                Delivery Contact &amp; Address
      </h3>
      <div className='step-content'>
        <div className='address-form row'>
          <div className='field'>
            <TextField
              label='First name'
              placeholder='First name'
              fullWidth
              margin='normal'
              InputLabelProps={{
                shrink: true,
              }}
              variant='outlined'
              name='first_name'
              id='first_name'

            />
            <div className='error' id='first_nameError' />
          </div>
          <div className='field'>
            <TextField
              label='Last name'
              placeholder='Last name'
              fullWidth
              margin='normal'
              InputLabelProps={{
                shrink: true,
              }}
              variant='outlined'
              name='last_name'
              id='last_name'
            />
            <div className='error' id='last_nameError' />
          </div>
          <div className='field'>
            <TextField
              label='Email Address'
              placeholder='Email Address'
              type='email'
              fullWidth
              margin='normal'
              variant='outlined'
              InputLabelProps={{
                shrink: true,
              }}
              name='email'
              id='email'
            />
            <div className='error' id='emailError' />
          </div>
          <div className='field'>
            <TextField
              label='Phone Number '
              placeholder='Phone Number'
              fullWidth
              type='number'
              margin='normal'
              InputLabelProps={{
                shrink: true,
              }}
              variant='outlined'
              name='phone_number'
              id='phone_number'
            />
            <div className='error' id='phone_numberError' />
          </div>
          <div className='fullField'>
            <TextField
              label='Address'
              placeholder='Your address, Apartment/Building Name'
              fullWidth
              margin='normal'
              InputLabelProps={{
                shrink: true,
              }}
              variant='outlined'
              name='address'
              id='address'

            />
            <div className='error' id='addressError' />
          </div>
          <div className='field'>
            <TextField
              label='Zipcode/Postcode'
              placeholder='Zip code'
              fullWidth
              margin='normal'
              InputLabelProps={{
                shrink: true,
              }}
              variant='outlined'
              name='zip_code'
              id='zip_code'

            />
            <div className='error' id='zip-codeError' />
          </div>
          <div className='field'>
            <TextField
              label='City'
              placeholder='City'
              fullWidth
              margin='normal'
              InputLabelProps={{
                shrink: true,
              }}
              variant='outlined'
              name='city'
              id='city'

            />
            <div className='error' id='cityError' />
          </div>
          <div className='field'>
            <TextField
              fullWidth
              label='Country'
              select
              margin='normal'
              value={0}
              variant='outlined'
              SelectProps={{
                native: true,
              }}
              id='country'
              name='country'
            >
              <option value={0}>Viet Nam</option>
              <option value={1}>1</option>
              <option value={2}>2</option>
            </TextField>
            <div className='error' id='countryError' />
          </div>
          <div className='field'>
            <TextField
              label='State/Province'
              placeholder='State/Province'
              fullWidth
              margin='normal'
              InputLabelProps={{
                shrink: true,
              }}
              variant='outlined'
              name='state'
              id='state'

            />
            <div className='error' id='stateError' />
          </div>
        </div>
        <button className='btn btnNextStep'>Continue</button>
      </div>
    </div>
  )
}

export default index
