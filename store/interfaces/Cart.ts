export interface CartStateReducer {
  cartData: Cart;
  getCartLoading: boolean;
  addToCartLoading: boolean;
  isAddToCart: boolean;
}

export interface Cart {
  readonly _id: string;
  tax: Tax;
  address: Address;
  status_code: string;
  customer_id: string;
  items: ProductItem[];
  created_at: Date;
  updated_at: Date;
  discount: number;
  subtotal: number;
  items_count: number;
  all_items_count: number;
  grand_total: number;
  isAbleToCheckout: boolean;
  allowed_shipping_methods?: AllowedShippingMethods;
}

interface Address {
  billing: Ing;
  shipping: Ing;
  billing_id?: string;
  shipping_id?: string;
}

interface Ing {
  country: string;
  state: string;
  zip_code: string;
  first_name: string;
  last_name: string;
  email: string;
  phone_number: string;
  street: string;
  city: string;
}

interface AllowedShippingMethods {
  default: Default[];
}

interface Default {
  readonly _id: string;
  created_at: Date;
  updated_at: Date;
  from_zipcode: number;
  weight: number;
  zone: number;
  service_api_code: string;
  service_name: string;
  rate: number;
  vendor: string;
  delivery_time_days: number;
  __v: number;
}

export interface ProductItem {
  is_selected: boolean;
  auto_generated: boolean;
  out_of_stock: boolean;
  customizable_options: any[];
  readonly _id: string;
  product_id: string;
  product_type: ProductType;
  configurable_parent: null;
  product: CartProduct;
  name: string;
  sku: string;
  price: number;
  stock_location: StockLocation;
  barcode: string;
  bin_location: string;
  preference_vendor_item: string;
  qty: number;
  original_price: number;
  dropship: Dropship;
  discount_percent: number;
  row_total: number;
  thumbnail: string;
}

interface Dropship {
  region: Region;
  is_dropship: boolean;
  created_at: Date;
  updated_at: Date;
  source_url?: string;
}

enum Region {
  Us = "us",
}

interface CartProduct {
  readonly _id: string;
  gift_card: GiftCard;
  configurable: Configurable;
  weight: number;
  categories: string[];
  images: Image[];
  status: Status;
  product_type: ProductType;
  sku: string;
  warehouses: WarehouseElement[];
  customizable_options: any[];
  name: string;
  barcode?: string;
  unit_cost: number;
  slug: string;
  quantity: number;
  original_price: number;
  price: number;
  height: number;
  length: number;
  special_price: null;
  weight_unit: WeightUnit;
  width: number;
  stock_availability: StockAvailability;
  thumbnail: string;
  tax_class?: string;
}

interface Configurable {
  attributes: any[];
  products: any[];
  options: any[];
}

interface GiftCard {
  card_type: CardType;
  provider: Provider;
  service: Provider;
  auto_generated: boolean;
  value: number;
}

enum CardType {
  Prepaid = "prepaid",
}

enum Provider {
  Default = "default",
}

interface Image {
  _id: string;
  size_type: SizeType;
  url: string;
}

enum SizeType {
  Large = "large",
  Medium = "medium",
  Original = "original",
  Small = "small",
}

enum ProductType {
  Simple = "simple",
}

enum Status {
  Disable = "disable",
  Enable = "enable",
}

enum StockAvailability {
  InStock = "in-stock",
  OutOfStock = "out-of-stock",
}

interface WarehouseElement {
  quantity: number;
  priority: number;
  warehouse: WarehouseEnum;
  aisle?: string;
  bin?: string;
}

enum WarehouseEnum {
  The5D77825D8F343B52Ad875267 = "5d77825d8f343b52ad875267",
}

enum WeightUnit {
  LB = "lb",
  Lbs = "lbs",
}
enum StockLocation {
  Anhm = "ANHM",
}

interface Tax {
  total: number;
}
