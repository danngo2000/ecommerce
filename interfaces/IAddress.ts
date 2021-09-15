import { ICustomer } from 'interfaces/ICustomer'

export interface IAddress {
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
  customer_id: string | ICustomer
  note: string
  readonly create_at: Date
  readonly updated_at: Date
}
