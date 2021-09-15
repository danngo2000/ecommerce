import Link from 'next/link'
import React, { FC, useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { useAppSelector } from 'utils/redux'
import { CartActions } from 'store/reducers/cart'

const CartNotifier: FC = () => {
  const { isAddToCart } = useAppSelector((state) => state.cart)
  const dispatch = useDispatch()
  useEffect(() => {
    let timeoutKey
    if (isAddToCart) {
      timeoutKey = setTimeout(() => {
        dispatch(CartActions.REMOTE_POPUP_ADD_TO_CART(false))
      }, 5000)
    }
    return () => {
      clearTimeout(timeoutKey)
    }
  }, [isAddToCart])
  return (
    <div className={`cartNotifier ${isAddToCart && 'show'}`}>
      <div className='number'>1</div>
      <div className='content'>
        <div className='added'>Item added</div>
        <div>
          <Link href='/cart'>
            <a className='view'>View My Cart</a>
          </Link>
        </div>
      </div>
    </div>
  )
}

export default CartNotifier
