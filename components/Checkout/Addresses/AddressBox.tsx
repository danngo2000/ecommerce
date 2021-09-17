import React from 'react'
import { IAddress } from 'interfaces'

type AddressBoxProps = {
  address: IAddress
  hideAddress?: boolean
}
const AddressBox = (props: AddressBoxProps) => {
  const { address, hideAddress } = props
  console.log('address', address);
  
  const addressCountry = address && address.country
  if (!address) return null
  return (
    <div className='AddressBox'>
      {['VN'].includes(addressCountry) ? (
        <div>
          {address.first_name} {address.last_name}
          <br />
          {!hideAddress && (
            <>
              {address.company ? (
                <div>Company: {address.company}</div>
              ) : (
                <div />
              )}
              Address: {address.display_address} - {address.ward} -{' '}
              {address.street}
              <br />
              {/* Country: {getFullAddress(addressCountry, 'country')} */}
              <br />
              Telephone: {address.phone_number}
              <br />
            </>
          )}
        </div>
      ) : (
        <div>
          {address.first_name} {address.last_name}
          <br />
          {!hideAddress && (
            <>
              {address.company ? (
                <div>Company: {address.company}</div>
              ) : (
                <div />
              )}
              Address: {address.street} - {address.city} -{' '}
              {/* {getFullAddress(address.state, 'state')} */}
              <br />
              {/* Country: {getFullAddress(addressCountry, 'country')} */}
              <br />
              Zip code: {address.zip_code}
              <br />
              Telephone: {address.phone_number}
              <br />
            </>
          )}
        </div>
      )}
    </div>
  )
}

export default AddressBox
