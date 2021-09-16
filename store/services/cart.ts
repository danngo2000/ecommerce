import axios from 'axios'
// import {notification} from 'antd';
// import {t} from 'locales';
import qs from 'qs';

export const getShippingMethod = async(request:any)=>{
  try {
    const res = await axios.get(
      `shipping/getrates?${qs.stringify(request)}`
    )
    return res.data;
  } catch (e) {
    throw e;
  }
} 

export const verifyCarts = async () => {
    try {
      const res = await axios.post("/quotes/verify");
      return res.data;
    } catch (e) {
      throw e;
    }
}

export const getCustomerDefaultAddressesRequest = () => axios
    .get('addressBooks/customer/default')
    .then(res => res.data)

export const updateCartRequest = async body => {
  const res = await axios.put('quotes/cart', body)
  return res.data
}

export const saveForLaterRequest = (productId: string) => axios
    .post('save-for-later', { productId })
    .then(res => res.data)

export const addToCartRequest = (
    productId,
    quantity,
    options?: any
) => axios
    .put('quotes/cart', {
      product_id: productId,
      qty: quantity,
      action_type: options?.buyNow ? 'buy_now' : 'add_to_cart'
    })
    .then(res => res.data)

export const removeFromCartRequest = body => axios
    .put('quotes/cart', {
      action_type: 'remove_item',
      ...body
    })
    .then(res => res.data)

export const toggleCartItemsRequest = body => axios
    .put('quotes/cart', {
      action_type: 'toggle',
      isSelected: body.value,
      ...body
    })
    .then(res => res.data)

export const changeCartItemQuantityRequest = (
    productId,
    quantity
) => axios
    .put('quotes/cart', {
      action_type: 'updateQty',
      product_id: productId,
      qty: quantity
    })
    .then(res => res.data)

export const applyCouponRequest = (coupon: string) => axios
    .post('quotes/applyCoupon', { coupon })
    .then(res => res.data)

export const removeCouponRequest = () => axios
    .post('quotes/cancelPromotionCoupon')
    .then(res => res.data)

export const removeSaveForLater = async (item: any, quite = false) => {
  if (item.product_id) {
    const { data: { message, error } } = await axios.delete(`save-for-later/${item._id}`)
    if (error) {
      // notification.error({ message: t(error) })
      return
    }
    // if (message && !quite) notification.success({ message: t(message) })
    // await this.actions.cart.removeFromCart(item)
  }
}
