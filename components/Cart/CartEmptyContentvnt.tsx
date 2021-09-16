import Image from "next/image"
import Link from "next/link"
import React from "react"
import { imageLoader } from "utils"

const CartEmptyContent = () => {
  return (
    <div className='cart-container' style={{ minHeight: "50vh" }}>
      <div className='cart-empty-page'>
        <Image
          loader={imageLoader}
          src='/images/shopping-cart.svg'
          width={100}
          height={128}
          objectFit='contain'
          alt=''
        />
        <h1>Shopping Cart is Empty</h1>
        <p>You have no items in your shopping cart</p>
        <Link href='/'>
          <a>
            <button className='btn'>Continue shopping</button>
          </a>
        </Link>
      </div>
    </div>
  )
}

export default CartEmptyContent
