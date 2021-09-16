// import { createSlice, PayloadAction } from "@reduxjs/toolkit"
// import produce from "immer";
// import { HYDRATE } from "next-redux-wrapper";

// const CheckoutStep = {
//     Address: 'address' as const,
//     Shipping: 'shipping' as const,
//     Payment: 'payment' as const
//   };
// type CheckoutStep = typeof CheckoutStep[keyof typeof CheckoutStep]

// export type CheckoutState = {
//     step: CheckoutStep
//     shippingCost: number,
//     order?: any,
//   }
//   const initialState: CheckoutState = {
//     step: CheckoutStep.Address,
//     shippingCost: 0,
//     order: null
//   }

// const checkoutSlice = createSlice({
//   name: "checkout",
//   initialState,
//   reducers: {
//     changeCheckoutStep: (state, action: PayloadAction<CheckoutStep>) => {
//         return produce(state, (draft) => {
//             draft.step = action.payload;
//             return draft;
//         });
//     },
//     setOrder:{
//         reducer: (state, action: PayloadAction<any>) => {
//             return produce(state, (draft) => {
//                 draft.order = action.payload.order;
//                 return draft;
//             });
//         },
//         prepare: (order: any, isCheckoutSuccess:boolean = true, shouldClearCart:boolean = true) => {
//             return { payload: { 
//                 order,
//                 options: {
//                 doNotClearCart: !shouldClearCart,
//                 isCheckoutSuccess
//                 }
//              } }
//         },
//     },
//     goToCheckout: (state) => {
//         return produce(state, (draft) => {
//             draft.step = CheckoutStep.Address;
//             return draft;
//         });
//     },
//     placeOrderRequest: (state) => {
//       return produce(state, (draft) => {
//         return draft;
//       });
//     },
//     checkoutGoToCheckout: (state) => {
//       return produce(state, (draft) => {
//         return draft;
//       });
//     },
//   },
//   extraReducers: (builder) => {
//     builder.addCase(HYDRATE,(state, action: any) => {
//       return produce(state, draft => Object.assign(draft, action.payload.config))
//     })
//   }
// })

// /** export actions */
// export const CheckoutActions = checkoutSlice.actions;

// /** export reducers */
// export default checkoutSlice.reducer;

import { createAction, createSlice, PayloadAction } from "@reduxjs/toolkit"
import produce from "immer";
import { HYDRATE } from "next-redux-wrapper";
import {CheckoutStep} from '../interfaces'
import update from 'immutability-helper';

export type CheckoutState = {
    step: CheckoutStep
    shippingCost: number,
    showCheckoutSuccess: boolean,
    order?: any,
  }
  const initialState: CheckoutState = {
    step: CheckoutStep.Address,
    shippingCost: 0,
    showCheckoutSuccess: false,
    order: null
  }

export const checkoutSlice = createSlice({
  name: "checkout",
  initialState,
  reducers: {
    changeCheckoutStep: (state, action: PayloadAction<CheckoutStep>) => {
        return update(state, {
            step: { $set: action.payload }
        })
    },
    setOrder:{
        reducer: (state, action: PayloadAction<any>) => {
            return update(state, {
                order: { $set: action.payload.order },
                showCheckoutSuccess: {$set: action.payload.options.isCheckoutSuccess}
            })
        },
        prepare: (order: any, isCheckoutSuccess:boolean = true, shouldClearCart:boolean = true) => {
            return { payload: { 
                order,
                options: {
                doNotClearCart: !shouldClearCart,
                isCheckoutSuccess
                }
             } }
        },
    },
    goToCheckout: (state) => {
        return update(state, {
            step: { $set: CheckoutStep.Address }
        })
    }
  },
  extraReducers: (builder) => {
    builder.addCase(HYDRATE,(state, action: any) => {
      return produce(state, draft => Object.assign(draft, action.payload.checkout))
    })
  }
})

export const placeOrder = createAction("checkout/PLACE_ORDER_REQUEST")
export const checkoutGoToCheckout = createAction("checkout/GO_TO_CHECKOUT")
export const checkoutPlaceOrderRequest = createAction("checkout/PLACE_ORDER_REQUEST")
export const { changeCheckoutStep, setOrder, goToCheckout } = checkoutSlice.actions
export const checkoutReducer = checkoutSlice.reducer