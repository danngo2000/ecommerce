
import React from 'react'
import Price from '../Product/Price'
import { decodeHTML } from 'utils'
import { CloseOutlined } from '@ant-design/icons'
import { applyCoupon, removeCoupon } from '../../actions/cart'
import { connect } from 'react-redux'

class SummaryCart extends React.PureComponent {
  constructor (props) {
    super(props)
    this.state = {
      coupon: '',
      product: null
    }
  }

  handleCouponChange = (e) => {
    this.setState({
      coupon: e.target.value
    })
  }

  handleApplyCoupon = async () => {
    this.props.applyCoupon(this.state.coupon)
    this.setState({
      coupon: ''
    })
  }

  renderItem (item, index = 1) {
    let imgThumbTag
    if (item.product && item.thumbnail !== '') imgThumbTag = <img className='itemThumb' src={item.thumbnail} />
    else imgThumbTag = <img className='itemThumb noImgThumb' src='' />
    return (
      <div className='table-row table-content' key={index}>
        <div className='table-cell'>{imgThumbTag}</div>
        <div className='table-cell item-name'>
          {decodeHTML(item.name)}
          <div className='itemQty'><label>Qty:</label> {item.qty}</div>
          { !item.product && <div className='productStockStatus'>(This product is out of stock.)</div> }
        </div>
        <div className='table-cell subtotal'>
          <span className='price'>
            <Price price={item.row_total} />
          </span>
          {
            item.original_price > item.price && (
              <span className='original-price'>
                <Price price={item.original_price * item.qty} />
              </span>
            )
          }
        </div>
      </div>
    )
  }

  render () {
    const { product, cart, removeCoupon, percentDeposit } = this.props
    let totalShipping = 0
    if (cart.shipping_methods) {
      const keys = Object.keys(cart.shipping_methods)
      for (let key of keys) {
        if (cart.shipping_methods[key] && cart.shipping_methods[key].rate > 0) totalShipping += cart.shipping_methods[key].rate
      }
    }
    const taxClass = Object.entries(cart.tax).filter(([k]) => k !== 'total')
    return (
      <div className='cartSummary'>
        <div className='table-cart'>
          <div className='table'>
            <div className='table-row table-header'>
              <div className='table-cell' />
              <div className='table-cell'>Product</div>
              <div className='table-cell'>Subtotal</div>
            </div>
            {
              !!product
                ? this.renderItem(product)
                : (Array.isArray(cart.items) && cart.items.map((item, i) => {
                  this.renderItem(item, i)
                }))
            }
          </div>
        </div>
        <div className='cartFooterBox'>
          <div className='cartTotalWrap'>
            <div className='row-total'>
              <div className='title'>Subtotal</div>
              <div className='amount'>
                <Price price={cart.subtotal} />
              </div>
            </div>
            <div className='row-total'>
              <div className='title'>Discount</div>
              <div className='amount'>- <Price price={cart.discount} /></div>
            </div>
            {
              (cart.promotion && cart.promotion.discount > 0) && (
                <div className='row-total'>
                  <div className='title'>Discount&nbsp;(Coupon)</div>
                  <div className='amount'>- <Price price={cart.promotion.discount} /></div>
                </div>
              )
            }
            <div className='row-total'>
              <div className='title'>
                Tax
                &nbsp;
                {
                  taxClass.length > 0 && (
                      '(' + taxClass.map(([, v]) => v.name).join(', ') + ')'
                  )
                }
              </div>
              <div className='amount'>
                <Price price={cart.tax.total} />
              </div>
            </div>
            <div className='row-total'>
              <div className='title'>Shipping fee</div>
              <div className='amount'>
                <Price price={totalShipping} />
              </div>
            </div>
            {
              cart.credit !== 0
                ? <div className='row-total'>
                  <div className='title'>Coin</div>
                  <div className='amount'>
                    -<Price price={cart.credit || 0} />
                  </div>
                </div> : ''
            }
            <div className='row-total rowGrandTotal'>
              <div className='title'>Grand Total Incl Tax</div>
              <div className='amount'>
                <Price price={cart.grand_total} />
              </div>
            </div>
            {
              cart.grand_total && +percentDeposit ? (
            <div className='row-total rowGrandTotal'>
              <div className='title'>Pre-Paid</div>
              <div className='amount'>
                <Price price={(cart.grand_total * +percentDeposit) / 100} />
              </div>
            </div>
              ) : ''
            }
          </div>
          {
            !product && <div className='couponBox'>
              {
                cart.promotion && cart.promotion.coupon_code ? (
                  <div>Coupon: <span className='bp3-tag bp3-large'>{cart.promotion.coupon_code} <CloseOutlined onClick={removeCoupon} className='bp3-tag-remove coupon-remove' /></span></div>
                ) : (<>
                  <div className='bp3-input-group coupon-field-group'>
                    <input value={this.state.coupon} onChange={this.handleCouponChange} style={{ height: '44px' }} type='text' className='bp3-input couponInput' placeholder='Coupon (Optional)' />
                  </div>
                  <button onClick={this.handleApplyCoupon} className='btn'>Apply</button>
                </>)
              }
            </div>
          }
          <div className='error' id='couponError' />
        </div>
      </div>
    )
  }
}

const mapState = (state) => ({
  cart: state.cart
})

export default connect(mapState, { applyCoupon, removeCoupon })(SummaryCart)
