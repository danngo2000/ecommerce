import React, { FC } from 'react'
import { Drawer } from 'antd'
import Link from 'next/link'
import { useSelector } from 'react-redux'
import { CartItem, CartHeading, CartSubtotal } from './MiniCart'
import FreeShipping from './FreeShipping'

interface TypeProps {
  isDrawerOpen?: any
  onClose?: any
}

const CartDrawer: FC<TypeProps> = ({ isDrawerOpen, onClose }) => {
  const config = useSelector((state: any) => state.config)
  const cart = useSelector((state: any) => state.cart)
  const freeShippingLimit = config['cart/freeShippingLimit']

  return (
    <Drawer
      title={
        <div>
          <Link href='/cart'>
            <a onClick={onClose}>
              <span className='cart-side-bar-header'>My cart</span>
            </a>
          </Link>
          <span>Shopping cart</span>
        </div>
      }
      width={420}
      onClose={onClose}
      visible={isDrawerOpen}
      className='cart-sumary'
      footer={
        <div className='cart-side-bar-footer'>
          <CartHeading />
        </div>
      }
    >
      <CartSubtotal />
      {cart.items.length > 0 ? (
        <>
          <FreeShipping freeShippingLimit={freeShippingLimit} />
          <CartItem />
        </>
      ) : (
        <div className='center'>
          <div className='CartEmptyPage'>
            <img src='/static/images/shopping-cart.svg' width='100px' />
            <p className='EmptyTxt'>Shopping Cart is Empty</p>
            <p>You have no items in your shopping cart.</p>
          </div>
        </div>
      )}
    </Drawer>
  )
}

export default CartDrawer
