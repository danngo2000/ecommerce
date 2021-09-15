import React from "react"
import ProductItem from "./ProductItem"

const ProductList = (props:any) => {
  const {productList} = props
  return (
    <div className='list-wrap row'>
      {productList.map((product:any, index:any) => (
        <ProductItem
          key={index}
          title={product.name}
          price={product.price}
          image={product.images.small[0]}
          originalPrice={product.original_price}
          rating={product.rating}
          slug={product.slug}
        />
      ))}
    </div>
  )
}

export default ProductList
