import { IAddress } from 'interfaces/IAddress'

export interface ICustomer {
  _id: string
  credit: number
  loyalty: number
  email: string
  first_name: string
  last_name?: string
  notifications: any[]
  address: {
    default_shipping?: string | IAddress
    default_billing?: string | IAddress
  }
  addressBooks: any[]
  ref_code: string
  reports: {
    grand_total: number
    orders: number
  }
  status_code: 'active' | 'inactive'
  stripe: any
  tag: any[]
  test_mode: boolean
  verified_email: {
    verified: boolean
    reset_count: number
    readonly created_at: Date
  }
  avatar?: string
  shopper?: {
    active: boolean
  }
  readonly created_at: Date
  readonly updated_at: Date
}
