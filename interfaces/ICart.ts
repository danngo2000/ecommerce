import { IAddress } from 'interfaces/IAddress'
import { IProduct, ProductType } from 'interfaces/IProduct'

export interface ICart {
  readonly _id?: string
  items: ICartItem[]
  items_count: number
  all_items_count: number
  address: {
    shipping?: IAddress
    billing?: IAddress
    billing_same_shipping?: Boolean
  }
  coupon: any
  promotion: any
  grand_total: number
  subtotal: number
  discount: number
  credit?: any
  tax?: any
  payment_method?: {
    method: PaymentMethod
    method_value?: any
  }
  shipping_methods?: any
  shipping_method?: {
    method: string
    method_value: any
  }
  isAbleToCheckout: boolean
  isAddressValid: boolean
  note: string
  status_code?: string
  totalCredit?: number
  readonly created_at?: Date
  readonly updated_at?: Date
}

export interface ICartItem {
  readonly _id?: string
  auto_generated: boolean
  configurable_parent?: any
  product?: IProduct
  product_id: string
  customizable_options: any
  discount_percent: number
  is_selected: boolean
  name: string
  original_price: number
  out_of_stock: boolean
  price: number
  product_type: ProductType
  qty: number
  row_total: number
  sku: string
  thumbnail: string
}

export const PaymentMethod = {
  CashOnDelivery: 'cod' as const,
  PayPal: 'paypal' as const,
  Stripe: 'stripe' as const,
  BankTransfer: 'bank' as const,
  MoMo: 'momo' as const,
  Coin: 'coin' as const
}
export type PaymentMethod = typeof PaymentMethod[keyof typeof PaymentMethod]

export const CheckoutStep = {
  Address: 'address' as const,
  Shipping: 'shipping' as const,
  Payment: 'payment' as const
}
export type CheckoutStep = typeof CheckoutStep[keyof typeof CheckoutStep]
