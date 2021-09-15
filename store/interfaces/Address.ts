import {Customer} from './Customer';

export interface Address {
  _id?: string
  rdi: 'commercial' | 'residential'
  first_name: string
  last_name: string
  phone_number: string
  street: string
  email: string
  zip_code: string
  country: string
  address: string
  city?: string
  state?: string
  province?: string
  district?: string
  ward?: string
  display_address?: string
  company?: string
  customer_id: string | Customer
  note: string
  readonly create_at: Date
  readonly updated_at: Date
}