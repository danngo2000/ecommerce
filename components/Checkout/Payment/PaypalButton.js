import React from 'react'
import config from 'settings'

class PaypalButton extends React.Component {
  componentDidMount () {
    try {
      const { grandTotal } = this.props
      let value = grandTotal
      if (window.paypal) {
        window.paypal.Buttons({
          createOrder: (_, actions) => {
            return actions.order.create({
              purchase_units: [{
                amount: {
                  currency: config.locale.currency || 'USD',
                  value: parseFloat(value).toFixed(2)
                }
              }]
            })
          },
          onApprove: (data) => {
            this.props.onSuccess(data.orderID)
          },
          style: {
            size: 'small',
            color: 'gold',
            shape: 'pill',
            label: 'checkout'
          }
        }).render('#paypal-button-container')
      }
    } catch (error) {
      console.warn(error.message)
    }
  }

  render () {
    return (
      <div className='paypalButton'>
        <div id='paypal-button-container' />
      </div>
    )
  }
}

export default PaypalButton
