
import React from 'react'
// import { T, t } from 'locales'

class Stock extends React.PureComponent {
  render () {
    const { product } = this.props
    let isOutOfStock = false
    if (product) {
      if (product.quantity < 5 && product.quantity > 0 &&
        product.stock_availability !== 'out-of-stock' &&
        product.status === 'enable') {
        return <div className='productStockStatus'>
          {t('Only')} {product.quantity} {t('left in stock - order soon')}.
        </div>
      }
      if (product.quantity <= 0 || product.stock_availability === 'out-of-stock' || product.status === 'disable') {
        isOutOfStock = true
      }
    } else {
      isOutOfStock = true
    }

    if (isOutOfStock) {
      return <div className='productStockStatusOnCart'>This product is out of stock.</div>
    }
    return null
  }
}
export default Stock
