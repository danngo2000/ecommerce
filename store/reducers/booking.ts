import { createAction, createSlice, PayloadAction } from "@reduxjs/toolkit"
import produce from "immer";
import { HYDRATE } from "next-redux-wrapper";

export type BookingState = {
    isBookingOpen: boolean
    cart: {
      buyer: string,
      shopper: string,
      items_count: number,
      items: any[],
      payment_method: 'COD' | 'PAYPAL',
      sub_total: number,
      grand_total: number,
      shipping_fee: number,
      address: {
        hide_address: boolean,
        shipping: {
          first_name: string,
          last_name: string,
          company_name: string,
          phone_number: string,
          street: string,
          city: string,
          zip_code: string,
          state: string,
          province: string,
          district: string,
          ward: string,
          country: string,
          display_address: string,
          _id: string
        },
      },
      note: string,
      isAddressValid: boolean
    }
  }
const initialState: BookingState = {
    isBookingOpen: false,
    cart: {
      buyer: '',
      shopper: '',
      items_count: 0,
      items: [],
      payment_method: 'COD',
      sub_total: 0,
      grand_total: 0,
      shipping_fee: 0,
      address: {
        hide_address: false,
        shipping: {
          first_name: '',
          last_name: '',
          company_name: '',
          phone_number: '',
          street: '',
          city: '',
          zip_code: '',
          state: '',
          province: '',
          district: '',
          ward: '',
          country: '',
          display_address: '',
          _id: '',
        },
      },
      note: '',
      isAddressValid: false
    }
}

export const bookingSlice = createSlice({
  name: "booking",
  initialState,
  reducers: {
    fetchBookingsSuccess: (state, action) => {
      return action.payload
    },
    hideBookingModal: (state) => {
        return produce(state, draft => {
            draft.isBookingOpen = false
            return draft
        })
    },
    showBookingModal: (state) => {
        return produce(state, draft => {
            draft.isBookingOpen = true
            return draft
        })
    },
    addToCartBooking: (state, action) => {
        return produce(state, draft => {
            const { product, quantity, customer, shipping_fee} = action.payload
            const item = { product: product._id,
                           name: product.name,
                           slug: product.slug,
                           sku: product.sku,
                          quantity: quantity,
                          price: product.price,
                          thumbnail: product.images[0]?.url || product.images.medium[0] }
      
            draft.cart.items.push(item)
            draft.cart.sub_total += product.price * quantity
            draft.cart.shipping_fee = shipping_fee
            draft.cart.grand_total = draft.cart.sub_total + draft.cart.shipping_fee
            draft.cart.items_count+= quantity
      
            if(customer.address?.default_shipping){
              draft.cart.address.shipping = customer.address.default_shipping
              draft.cart.isAddressValid = true
            }
            draft.cart.buyer = customer._id
            draft.cart.shopper = product.shopper
            return draft
        })
    },
    decreaseQuantity: (state, action) => {
      return produce(state, draft => {
        const productId = action.payload
        for( let item of draft.cart.items)
        {
          if(item.product === productId){
            item.quantity -= 1
            draft.cart.sub_total -= item.price
            draft.cart.grand_total -= item.price
            if( item.quantity <= 0) {
              draft.cart.items = draft.cart.items.filter(i => i.product !== item.product)
            }
          }
        }
        draft.cart.items_count -= 1
        return draft
      })
    },
    increaseQuantity: (state, action) => {
      return produce(state, draft => {
        const productId = action.payload
        for( let item of draft.cart.items)
        {
          if(item.product === productId){
            item.quantity += 1
            draft.cart.sub_total += item.price
            draft.cart.grand_total += item.price
          }
        }
        draft.cart.items_count += 1
        return draft
      })
    },
    setPaymentMethodBooking: (state, action) => {
      return produce(state, draft => {
        const method = action.payload
        if( method ) draft.cart.payment_method = method 
        return draft
      })
    },
    setAddressBooking: {
      reducer: (state, action: PayloadAction<any>) => {
        return produce(state, draft => {
          const { address, hideAddress } = action.payload
          if( address) {
            draft.cart.address.shipping = address
            draft.cart.isAddressValid = true
          }
          if(hideAddress !== 'undefind') {
            draft.cart.address.hide_address = hideAddress
          }
          // if( method ) draft.cart.payment_method = method 
          return draft
        })
      },
      prepare: (address, hideAddress) => {
          return { payload: { address, hideAddress } }
      },
    },
    resetCartBooking: (state) => {
      return initialState
    }
  },
  extraReducers: (builder) => {
    builder.addCase(HYDRATE,(state, action: any) => {
      return produce(state, draft => Object.assign(draft, action.payload.cart))
    })
  }
})

export const fetchBooking = createAction("booking/FETCH_ITEM")
export const { 
  fetchBookingsSuccess,
  hideBookingModal,
  showBookingModal,
  addToCartBooking,
  decreaseQuantity,
  increaseQuantity,
  setPaymentMethodBooking,
  setAddressBooking,
  resetCartBooking
} = bookingSlice.actions
export const bookingReducer = bookingSlice.reducer

