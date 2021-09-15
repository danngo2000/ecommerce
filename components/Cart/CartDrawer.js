import { Component } from 'react'
import { Drawer } from 'antd'
import Link from 'next/link'
import { connect } from 'react-redux'
import { CartItem, CartHeading, CartSubtotal } from '../Cart/MiniCart'
import FreeShipping from './FreeShipping'
// import { t, T } from 'locales'
import { toggleCartDrawer } from 'actions/ui'

class CartDrawer extends Component {
  render () {
    const { isDrawerOpen, toggleCartDrawer, cart } = this.props
    const freeShippingLimit = this.props.config['cart/freeShippingLimit']
    return (
      <Drawer
        title={
        <div>
          <Link href='/cart'>
            <a onClick={() => toggleCartDrawer(false)}>
              <span className='cart-side-bar-header'>My cart</span>
            </a>
          </Link>
          <span>Shopping cart</span>
        </div>
      }
        width={420}
        onClose={() => toggleCartDrawer(false)}
        visible={isDrawerOpen}
        className='cart-sumary'
        footer={
          <div className='cart-side-bar-footer' >
            <CartHeading />
          </div>
        }
      >
        <CartSubtotal />
        {/* {
          cart.items.length > 0
          ? <>
            <FreeShipping freeShippingLimit={freeShippingLimit}/>
            <CartItem />
          </>
          : <div className='center'>
          <div className='CartEmptyPage'>
            <img src='/static/images/shopping-cart.svg' width='100px' />
            <p className='EmptyTxt'>Shopping Cart is Empty</p>
            <p>You have no items in your shopping cart.</p>
          </div>
        </div>
        } */}

      </Drawer>
    )
  }
}

const mapState = (state) => ({
  config: state.config,
//   isDrawerOpen: state.ui.isCartDrawerOpen,
  cart: state.cart
})

export default connect(mapState, { toggleCartDrawer })(CartDrawer)
