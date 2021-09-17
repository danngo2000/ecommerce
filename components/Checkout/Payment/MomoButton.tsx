import React, { memo, useState } from 'react'
import axios from 'axios'
import { handleCheckoutError } from 'utils/cart'
import { useSelector, useDispatch } from 'react-redux'

const MomoButton = () => {
  const cart = useSelector((state: any) => state.cart)
  const dispatch = useDispatch()
  const [isLoading, setLoading] = useState(false)

  const handleButtonClick = async () => {
    setLoading(true)
    try {
      let {
        data: { order, payUrl, error }
      } = await axios.post('payments/createPayment', {
        quoteId: cart._id,
        shippingMethods: cart.shipping_methods,
        promotion: cart.promotion,
        method: 'momo',
        address: cart.address,
        refCode: window.localStorage.getItem('refCode'),
        credit: cart.credit || 0
      })
      if (order) {
        window.open(payUrl, '_self')
      } else handleCheckoutError(error)
    } catch (e) {
      console.log(e)
      handleCheckoutError('Internal server error.')
    }
    setLoading(false)
  }

  return (
    <div>
      <button className='btn' disabled={isLoading} onClick={handleButtonClick}>
        Place Order Now
      </button>
    </div>
  )
}

export default memo(MomoButton)
