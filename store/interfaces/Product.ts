export interface Product {
  readonly _id?: string
  barcode?: string
  categories: string[]
  configurable: any
  customizable_options: any
  fast_ship: boolean
  free_ship: boolean
  gift_card: {
    auto_generated: boolean
    card_type: string
    provider: string
    service: string
    value: number
  }
  images: ProductImage[]
  height?: number
  length?: number
  weight?: number
  weight_unit: string
  name: string
  original_price: number
  price: number
  product_type: ProductType
  quantity: number
  sku: string
  slug: string
  special_price?: number
  description?: any | string
  short_description?: string,
  special_price_dates?: any[]
  status: ProductStatus
  stock_availability: string
  thumbnail?: string
  readonly created_at?: Date
  readonly updated_at?: Date
}

export type ProductImage = {
  _id?: string
  url: string
  size_type?: 'small' | 'medium' | 'large'
}

export const ProductType = {
  Simple: 'simple' as const,
  Configurable: 'configurable' as const,
  GiftCard: 'gift_card' as const,
  Downloadable: 'downloadable' as const
};
export type ProductType = typeof ProductType[keyof typeof ProductType];

export const ProductStatus = {
  Enabled: 'enable' as const,
  Disabled: 'disable' as const
};
export type ProductStatus = typeof ProductStatus[keyof typeof ProductStatus];