import ProductItem from 'components/Product/ProductItem'
import React from 'react'
import { useSelector } from 'react-redux'

const ProductList = ({ q, productList }) => {
  const config = useSelector((state: any) => state.config)
  const quickMode = config['products/add_to_cart/quick_mode']
  let words: any = []
  if (typeof q === 'string') {
    words = q.split(' ')
  }
  return (
    <div className='listWrap row'>
      {productList.map((product, index) => (
        <ProductItem
          showSeller={false}
          showAddToCartButton={quickMode}
          key={index}
          product={product}
          highlignWords={words}
        />
      ))}
    </div>
  )
}

export default ProductList
