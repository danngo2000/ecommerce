import React from 'react'

const PaymentMethods = ({ payment }) => {
  return (
    <div className='payment-methods'>
      <label>Payment method:</label>
      <span>{payment && payment.method}</span>
    </div>
  )
}

export default PaymentMethods
