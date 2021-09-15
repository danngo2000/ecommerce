import React from 'react'

const Address = ({ title, address, showSameAddressText }) => {
  return (
    <div className='address-item'>
      <h3>{title}</h3>
      {showSameAddressText === false ? (
        <div className='address-wrap'>
          <div className='address'>Address: {address && address.street}, {address && address.city}, {address && address.state}, {address && address.zip_code}</div>
          <div className='city'>City: {address && address.city}</div>
          <div className='country'>Country: {address && address.country}</div>
          <div className='full-name'>Fullname: {address && address.first_name} {address && address.last_name}</div>
          <div className='phone'>Phone number: {address && address.phone_number}</div>
        </div>
      ) : (
        <div className='sameAddress'>(Billing same shipping)</div>
      )}
    </div>
  )
}

export default Address
