// export interface CartStateReducer {
//   cartData: Cart;
//   getCartLoading: boolean;
//   addToCartLoading: boolean;
//   isAddToCart: boolean;
// }

// export interface Cart {
//   readonly _id: string;
//   tax: Tax;
//   address: Address;
//   status_code: string;
//   customer_id: string;
//   items: ProductItem[];
//   created_at: Date;
//   updated_at: Date;
//   discount: number;
//   subtotal: number;
//   items_count: number;
//   all_items_count: number;
//   grand_total: number;
//   isAbleToCheckout: boolean;
//   allowed_shipping_methods?: AllowedShippingMethods;
//   payment_method?: {
//     method: PaymentMethod
//     method_value?: any
//   }
//   shipping_methods?: any
// }

// const PaymentMethod = {
//   CashOnDelivery: 'cod' as const,
//   PayPal: 'paypal' as const,
//   Stripe: 'stripe' as const,
//   BankTransfer: 'bank' as const,
//   MoMo: 'momo' as const,
//   Coin: 'coin' as const
// };
// type PaymentMethod = typeof PaymentMethod[keyof typeof PaymentMethod];

// export const CheckoutStep = {
//   Address: 'address' as const,
//   Shipping: 'shipping' as const,
//   Payment: 'payment' as const
// };
// export type CheckoutStep = typeof CheckoutStep[keyof typeof CheckoutStep]

// interface Address {
//   billing: Ing;
//   shipping: Ing;
//   billing_id?: string;
//   shipping_id?: string;
// }

// interface Ing {
//   country: string;
//   state: string;
//   zip_code: string;
//   first_name: string;
//   last_name: string;
//   email: string;
//   phone_number: string;
//   street: string;
//   city: string;
// }

// interface AllowedShippingMethods {
//   default: Default[];
// }

// interface Default {
//   readonly _id: string;
//   created_at: Date;
//   updated_at: Date;
//   from_zipcode: number;
//   weight: number;
//   zone: number;
//   service_api_code: string;
//   service_name: string;
//   rate: number;
//   vendor: string;
//   delivery_time_days: number;
//   __v: number;
// }

// export interface ProductItem {
//   is_selected: boolean;
//   auto_generated: boolean;
//   out_of_stock: boolean;
//   customizable_options: any[];
//   readonly _id: string;
//   product_id: string;
//   product_type: ProductType;
//   configurable_parent: null;
//   product: CartProduct;
//   name: string;
//   sku: string;
//   price: number;
//   stock_location: StockLocation;
//   barcode: string;
//   bin_location: string;
//   preference_vendor_item: string;
//   qty: number;
//   original_price: number;
//   dropship: Dropship;
//   discount_percent: number;
//   row_total: number;
//   thumbnail: string;
// }

// interface Dropship {
//   region: Region;
//   is_dropship: boolean;
//   created_at: Date;
//   updated_at: Date;
//   source_url?: string;
// }

// enum Region {
//   Us = "us",
// }

// interface CartProduct {
//   readonly _id: string;
//   gift_card: GiftCard;
//   configurable: Configurable;
//   weight: number;
//   categories: string[];
//   images: Image[];
//   status: Status;
//   product_type: ProductType;
//   sku: string;
//   warehouses: WarehouseElement[];
//   customizable_options: any[];
//   name: string;
//   barcode?: string;
//   unit_cost: number;
//   slug: string;
//   quantity: number;
//   original_price: number;
//   price: number;
//   height: number;
//   length: number;
//   special_price: null;
//   weight_unit: WeightUnit;
//   width: number;
//   stock_availability: StockAvailability;
//   thumbnail: string;
//   tax_class?: string;
// }

// interface Configurable {
//   attributes: any[];
//   products: any[];
//   options: any[];
// }

// interface GiftCard {
//   card_type: CardType;
//   provider: Provider;
//   service: Provider;
//   auto_generated: boolean;
//   value: number;
// }

// enum CardType {
//   Prepaid = "prepaid",
// }

// enum Provider {
//   Default = "default",
// }

// interface Image {
//   _id: string;
//   size_type: SizeType;
//   url: string;
// }

// enum SizeType {
//   Large = "large",
//   Medium = "medium",
//   Original = "original",
//   Small = "small",
// }

// enum ProductType {
//   Simple = "simple",
// }

// enum Status {
//   Disable = "disable",
//   Enable = "enable",
// }

// enum StockAvailability {
//   InStock = "in-stock",
//   OutOfStock = "out-of-stock",
// }

// interface WarehouseElement {
//   quantity: number;
//   priority: number;
//   warehouse: WarehouseEnum;
//   aisle?: string;
//   bin?: string;
// }

// enum WarehouseEnum {
//   The5D77825D8F343B52Ad875267 = "5d77825d8f343b52ad875267",
// }

// enum WeightUnit {
//   LB = "lb",
//   Lbs = "lbs",
// }
// enum StockLocation {
//   Anhm = "ANHM",
// }

// interface Tax {
//   total: number;
// }

import {Address} from './Address';
import {Product, ProductType} from './Product';

export interface Cart {
  readonly _id?: string
  items: CartItems[]
  items_count: number | null
  all_items_count: number
  address: {
    shipping?: Address | null
    billing?: Address | null
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
    method: PaymentMethod | null
    method_value?: any
  }
  shipping_methods?: any
  shipping_method?: {
    method: string,
    method_value: any
  }
  isAbleToCheckout: boolean
  isAddressValid: boolean
  note: string
  status_code?: string
  totalCredit?: number
  readonly created_at?: Date
  readonly updated_at?: Date
  isAddToCart: boolean;
}

export interface CartItems {
  readonly _id?: string
  auto_generated: boolean
  configurable_parent?: any
  product?: Product
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
};
export type PaymentMethod = typeof PaymentMethod[keyof typeof PaymentMethod];

export const CheckoutStep = {
  Address: 'address' as const,
  Shipping: 'shipping' as const,
  Payment: 'payment' as const
};
export type CheckoutStep = typeof CheckoutStep[keyof typeof CheckoutStep] 
