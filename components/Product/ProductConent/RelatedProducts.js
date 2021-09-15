import React, { memo, useEffect, useState } from 'react'
import ProductSlider from '../ProductSlider'
import axios from 'axios'
// import { T, t } from 'locales'

const RelatedProducts = props => {
  const { productId } = props
  const [products, setProducts] = useState([])

  const fetch = async () => {
    if (productId) {
      const { data: { products } } = await axios.get(`products/getRelated?productId=${productId}`)
      if (products) setProducts(products)
    }
  }

  useEffect(() => {
    setProducts([])
    fetch()
  }, [productId])

  if (!Array.isArray(products) || !products.length) return null
  return (
    <div className='main-box'>
      <div className='recentlyViewedSlider md-slider'>
        <h3>Related Products</h3>
        <ProductSlider products={products} />
      </div>
    </div>)
}

export default memo(RelatedProducts)
