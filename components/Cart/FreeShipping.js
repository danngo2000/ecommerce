
import React, { Component } from 'react'
import Price from '../Product/Price'
import { connect } from 'react-redux'

class FreeShipping extends Component {
  countToFree = (value) => {
    return (
      <>
        <Price price={value} />to FREE shipping!
      </>
    )
  }

  render () {
    const freeShippingLimit = this.props.config['cart/freeShippingLimit']
    if (!freeShippingLimit || freeShippingLimit === "0") return null
    const { cart } = this.props
    let subtotalInclDiscount = (cart.subtotal - cart.discount)
    let width = subtotalInclDiscount * 100 / freeShippingLimit
    return (
      <div className='shipping-container'>
        <p className='shipping-text'>{
          subtotalInclDiscount < freeShippingLimit
            ? this.countToFree(freeShippingLimit - subtotalInclDiscount)
            : "You've earned FREE shipping!"
        }</p>
        <div className='shipping-progressbar-container'>
          <div className='bp3-progress-bar bp3-no-stripes custom-progress-bar'>
            <div className='bp3-progress-meter' style={{ width: `${width > 100 ? 100 : width.toFixed(2)}%` }} />
          </div>
          <div className='freeshipping-truck'>
            <div className={`truck-icon ${width >= 100 ? 'done' : ''}`}>
              <img alt='free shipping icon' src='/static/images/ico-truck.png' width='100px' />
            </div>
            <div className='tooltip'>Free!</div>
          </div>
        </div>
      </div>
    )
  }
}

const mapState = (state) => ({
  config: state.config,
  cart: state.cart
})

export default connect(mapState)(FreeShipping)
