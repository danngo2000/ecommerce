import {Cart, Customer} from '../store/interfaces';
// import config from 'settings';
// import {t} from 'locales';
import Router from 'next/router';
// import {Modal} from 'antd';

export const calculateGrandTotal = (cart: any, shippingCost: number) => {
  let taxTotal = cart.tax ? cart.tax.total : 0
  let result = ((cart.subtotal + taxTotal + shippingCost) - cart.discount)
  let credit = 0
  if (cart.totalCredit !== null && cart.totalCredit !== undefined) {
  if (cart.totalCredit > result) {
    credit = result
  } else {
    credit = cart.totalCredit
  }
  result -= credit
  }
  if (cart.promotion && cart.promotion.discount) result -= cart.promotion.discount
  if (result < 0) result = 0
  return { grandTotal: +(result).toFixed(2), credit }
}

export const isLimitShippingCostLower = (cart: any) => {
  let isLower = true
  if (Array.isArray(cart.shipping_methods)) {
    let cost = cart.shipping_methods.reduce((previous:any, current:any) => previous + current.cost, 0)
    // if (cost > config.cart.limitShippingCost) {
    //   isLower = false
    // }
  }
  return isLower
}

// export const isCartAddressValid = (cart: Cart, customer?: Customer) => {
//   if (customer?.address?.default_shipping) return true
//   return cart.isAddressValid
// }

// export const isCartValid = (cart: Cart, customer?: Customer) => {
//   // if (isGuest) return false
//   if (!cart.payment_method || !cart.payment_method.method) return false
//   const noAllowCod = cart.items
//       .filter(i => i.is_selected)
//       .some(i => i.product_type === 'gift_card')
//   if (noAllowCod && cart.payment_method && cart.payment_method.method === 'cod') return false
//   return isCartAddressValid(cart, customer)
// }

export const handleCheckoutError = (content:any, order?:any) => {
  const errorProps: any = {
    title: 'An error occurred',
    content: content || 'Sorry! You have an error on the checkout process',
    okText: 'Reload page'
  }
  if (order?._id) {
    errorProps.okText = 'OK'
    Router.push(`/customer/orders/${order._id}`).then()
  } else {
    errorProps.onOk = () => {
      Router.reload()
    }
  }
  // Modal.error(errorProps)
}