// import { createSlice } from "@reduxjs/toolkit";
// import produce from "immer";

// /* ######### interfaces ######## */
// import { CartStateReducer } from "../interfaces";

// import { AuthActions } from "./authV1";
// import { CheckoutActions } from "./checkout";

// /** init and define type */
// const initialState = {
//   cartData: {},
//   isAddToCart: false,
//   getCartLoading: false,
//   addToCartLoading: false,
// } as CartStateReducer;
// /** create reducers and actions */
// const cartSlice = createSlice({
//   name: "cart",
//   initialState,
//   reducers: {
//     /** call when dispatch action get cart */
//     cartRequest: (state) => {
//       return produce(state, (draft) => {
//         draft.getCartLoading = true;
//         return draft;
//       });
//     },
//     cartSuccess: (state, action) => {
//       return produce(state, (draft) => {
//         draft.getCartLoading = false;
//         draft.cartData = action.payload;
//         return draft;
//       });
//     },
//     cartFailed: (state) => {
//       return produce(state, (draft) => {
//         draft.getCartLoading = false;
//         return draft;
//       });
//     },

//     /** call when dispatch action update cart */
//     updateCartRequest: (state, action) => {
//       return produce(state, (draft) => {
//         return draft;
//       });
//     },
//     updateCartSuccess: (state, action) => {
//       return produce(state, (draft) => {
//         draft.cartData = action.payload;
//         return draft;
//       });
//     },
//     updateCartFailed: (state) => {
//       return produce(state, (draft) => {
//         return draft;
//       });
//     },
//     /** call when dispatch action remote popup */
//     remotePopupAddToCart: (state, action) => {
//       return produce(state, (draft) => {
//         draft.isAddToCart = action.payload;
//         return draft;
//       });
//     },
//     /** call when dispatch action remote popup */
//     setAddressDefault: (state, action) => {
//       return produce(state, (draft) => {
//         draft.cartData.address = {
//           shipping: action.payload,
//           billing: action.payload,
          
//         };
//         return draft;
//       });
//     },
//     setAddress: (state, action) => {
//       return produce(state, (draft) => {
//         return draft;
//       });
//     },
//     clearAddress: (state) => {
//       return produce(state, (draft:any) => {
//         draft.cartData.address = {
//           shipping: null,
//           billing: null,
//         };
//         return draft;
//       });
//     },
//     changePaymentMethod: (state, action) => {
//       return produce(state, (draft) => {
//         draft.cartData.payment_method = {method:action.payload}
//         return draft;
//       });
//     },
//     changeShippingMethodSucess: (state, action) => {
//       return produce(state, (draft) => {
//         draft.cartData.grand_total = action.payload.grandTotal
//         draft.cartData.shipping_methods = action.payload.shippingMethods
//         return draft;
//       });
//     },
//     changeShippingMethodRequest: (state, action) => {
//       return produce(state, (draft) => {
//         return draft;
//       });
//     },
//   },
//   extraReducers: (builder) => {
//     builder
//       .addCase(AuthActions.logoutSuccess, (state) => {
//         return initialState;
//       })
//       .addCase(CheckoutActions.setOrder,(state, action)=>{
//         return produce(state, (draft:any) => {
//           draft.cartData = {
//             items_count: null,
//             grand_total: null,
//             subtotal: null,
//             items: null,
//           };
//           return draft;
//         });
//       })
//   },
// });

// /** export actions */
// export const CartActions = cartSlice.actions;

// /** export reducers */
// export default cartSlice.reducer;


import { createAction, createSlice, PayloadAction } from "@reduxjs/toolkit"
import produce from "immer";
import { HYDRATE } from "next-redux-wrapper";
import { Address, Cart, CartItems, PaymentMethod } from "store/interfaces";
import { loginRequestSuccess, logoutRequestSuccess } from "./auth";
import update from 'immutability-helper';
import { setOrder } from "./checkout";

export type AddToCartRequestAction ={
    payload: {
        productId: string
        quantity: number
        options?: {
          sflItem?: any
          buyNow?: boolean
        }
    }
}

export type RemoveFromCartRequestAction = {
    payload: Partial<CartItems>
}

export type ToggleCartItemsRequestAction = {
    payload: {
        index?: number
        indexes?: number[]
        value: boolean
    }
}

export type ChangeCartItemQuantityAction = {
    payload: {
        productId: string
        quantity: number
    }
}

export type ChangeShippingMethodRequestAction = {
    payload: any
}

export type SetCartAddressAction = {
    payload: {
        address: Address
        key?: 'billing' | 'shipping'
    }
}

export type ApplyCouponRequestAction = {
    payload: string
}




const initialState: Cart = {
    items_count: 0,
    all_items_count: 0,
    grand_total: 0,
    subtotal: 0,
    discount: 0,
    items: [],
    coupon: null,
    shipping_method: {
      method: 'free_shipping',
      method_value: null
    },
    payment_method: {
      method: null,
      method_value: ''
    },
    address: {
      shipping: null,
      billing: null
    },
    note: '',
    promotion: null,
    isAddressValid: false,
    isAbleToCheckout: false,
    isAddToCart: false,
  }

export const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    updateCart:{
        reducer: (state, action: PayloadAction<any>) => {
            if (action.payload.cart?.items) {
                const { cart } = action.payload
                if (!(cart?.address?.shipping?.email)) cart.address = {
                  billing: null,
                  shipping: null
                }
                return cart
            }
            return state
        },
        prepare: (cart:Cart) => {
            return { payload: { cart } }
        },
    },
    changePaymentMethod:{
        reducer: (state, action: PayloadAction<any>) => {
            return update(state, { payment_method: { $set: action.payload } })
        },
        prepare: (method: PaymentMethod, methodValue?: any) => {
            return { payload: { method, method_value: methodValue } }
        },
    },
    cartChangeShippingMethodSuccess:{
        reducer: (state, action: PayloadAction<any>) => {
            return update(state, {
                credit: { $set: action.payload.credit },
                grand_total: { $set: action.payload.grandTotal },
                shipping_methods: { $set: action.payload.shippingMethods }
            })
        },
        prepare: (grandTotal:number, credit:number, shippingCost:number, shippingMethods:any) => {
            return { payload: { 
                grandTotal,
                credit,
                shippingCost,
                shippingMethods
            } }
        },
    },
    clearCartAddress: (state) => {
        return update(state, {
            address: { $set: { shipping: null, billing: null } }
        })
    },
    addCartNote:{
        reducer: (state, action: PayloadAction<any>) => {
            return update(state, {
                note: { $set: action.payload }
            })
        },
        prepare: (note: string) => {
            return { payload: note }
        },
    },
    setDefaultAddresses:{
        reducer: (state, action: PayloadAction<any>) => {
            return update(state, {
                address: { $set: { shipping: action.payload, billing: action.payload } }
            })
        },
        prepare: (address: Address) => {
            return { payload: address }
        },
    },
    /** call when dispatch action remote popup */
    remotePopupAddToCart: (state, action) => {
      return produce(state, (draft) => {
        draft.isAddToCart = action.payload;
        return draft;
      });
    },
  },
  extraReducers: (builder) => {
    builder
    .addCase(HYDRATE,(state, action) => {})
    .addCase(loginRequestSuccess,(state, action) => {
        if (action.payload.cart?.items) {
            const { cart } = action.payload
            if (!(cart?.address?.shipping?.email)) cart.address = {
              billing: null,
              shipping: null
            }
            return cart
        }
        return state
    })
    .addCase(logoutRequestSuccess,(state, action) => {return initialState})
    .addCase(setOrder,(state:any, action:any) => {
        if (action.payload?.options?.doNotClearCart) return state
        return update(state, {
            items_count: { $set: null },
            grand_total: { $set: null },
            subtotal: { $set: null },
            items: { $set: [] },
            coupon: { $set: null },
            promotion: { $set: null },
            credit: { $set: 0 },
            totalCredit: { $set: 0 }
        })
    })
  }
})

/** Just use for cartsaga */
export const CART_ADD_TO_CART_REQUEST = "cart/ADD_TO_CART_REQUEST"
export const CART_REMOVE_FROM_CART_REQUEST = "cart/REMOVE_FROM_CART_REQUEST"
export const CART_TOGGLE_ITEMS_REQUEST = "cart/TOGGLE_ITEMS_REQUEST"
export const CART_CHANGE_ITEM_QUANTITY_REQUEST = "cart/CHANGE_ITEMS_QUANTITY_REQUEST"
export const CART_CHANGE_SHIPPING_METHOD_REQUEST = "cart/CHANGE_SHIPPING_METHOD_REQUEST"
export const CART_APPLY_COUPON_REQUEST = "cart/APPLY_COUPON_REQUEST"
export const CART_REMOVE_COUPON_REQUEST = "cart/REMOVE_COUPON_REQUEST"
export const CART_SET_ADDRESS_REQUEST = "cart/SET_ADDRESS_REQUEST"
export const CART_USE_CREDIT = "cart/USE_CREDIT"
export const CART_SAVE_FOR_LATER_REQUEST = "cart/SAVE_FOR_LATER_REQUEST"
/** ---------------------- */


/** If you want to reset all element, you must change type index by number and value 0 **/
export const toggleCartItems = createAction("cart/TOGGLE_ITEMS_REQUEST",
    (value:boolean, index?: string) =>({payload: {value, index}})
)

export const applyCoupon = createAction("cart/APPLY_COUPON_REQUEST",
    (coupon: string) => ({payload: coupon}),
)
export const removeCoupon = createAction("cart/REMOVE_COUPON_REQUEST")
export const addToCart = createAction("cart/ADD_TO_CART_REQUEST",
    (productId: string, quantity = 1, options?) => ({
        payload: { productId, quantity, options  }
    }),
)
export const removeFromCart = createAction("cart/REMOVE_FROM_CART_REQUEST",
    (item: Partial<CartItems>) => ({payload: item}),
)
export const changeCartItemQuantity = createAction("cart/CHANGE_ITEMS_QUANTITY_REQUEST",
    (productId: string, quantity: number) => ({
        payload: { productId, quantity}
    }),
)
export const changeShippingMethod = createAction("cart/CHANGE_SHIPPING_METHOD_REQUEST",
    (shipping: any) => ({payload: shipping}),
)
export const saveForLater = createAction("cart/SAVE_FOR_LATER_REQUEST",
    (item: Partial<CartItems>) => ({payload: item}),
)
export const useCredit = createAction("cart/USE_CREDIT",
    (amount: number) => ({payload: amount}),
)
export const setCartAddress = createAction("cart/SET_ADDRESS_REQUEST",
    (address?: Address, key?: 'billing' | 'shipping') => ({payload: {address, key}}),
)

export const { 
    updateCart, 
    changePaymentMethod,
    cartChangeShippingMethodSuccess,
    clearCartAddress,
    addCartNote,
    setDefaultAddresses,
    remotePopupAddToCart

} = cartSlice.actions
export const cartReducer = cartSlice.reducer