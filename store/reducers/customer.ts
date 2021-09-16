// import { createSlice } from "@reduxjs/toolkit";
// import produce from "immer";
// import { HYDRATE } from "next-redux-wrapper";

// import { CustomerStateReducer } from "../interfaces";
// // import {loginRequestSuccess, logoutRequestSuccess} from '../reducers/auth'
// import { AuthActions } from "../reducers/authV1";

// const emptyAddress = {
//   default_shipping: null,
//   default_billing: null,
// };

// // const initialState: Customer | null = null
// /** init and define type */
// const initialState = {
//   customerData: null,
// } as CustomerStateReducer;

// export const customerSlice = createSlice({
//   name: "customer",
//   initialState,
//   reducers: {},
//   extraReducers: (builder) => {
//     builder
//       // .addCase(HYDRATE, (state, action) => {
//       //   console.log("action", action);
//       //   return produce(state, (draft) => {
//       //     return draft;
//       //   });
//       // })
//       .addCase(AuthActions.loginSuccess, (state, action) => {
//         let { customer }: any = action.payload;
//         return produce(state, (draft) => {
//           draft.customerData = customer;
//           if (customer && !customer.address) customer.address = emptyAddress;
//           return draft;
//         });
//       })
//       .addCase(AuthActions.logoutSuccess, (state) => {
//         return produce(state, (draft) => {
//           draft.customerData = null;
//           return draft;
//         });
//       });
//     // builder
//     //   .addCase(HYDRATE,(state, action: any) => {
//     //     return action.payload.customer
//     //   })
//     //   .addCase(AuthActions.LOGIN_SUCCESS, (state, action: any) => {
//     //     let { customer }: any = action.payload;
//     //     return produce(state, (draft) => {
//     //       draft.customerData=customer;
//     //       if (customer && !customer.address) customer.address = emptyAddress;
//     //       return draft;
//     //     });
//     //   }).addCase(AuthActions.LOGOUT_SUCCESS,(state, action: any) => {
//     //   return null
//     // })
//   },
// });

// export const customerReducer = customerSlice.reducer;


import { createAction, createSlice, PayloadAction } from "@reduxjs/toolkit"
import produce from "immer";
import { HYDRATE } from "next-redux-wrapper";
import {Customer} from '../interfaces';
import {loginRequestSuccess, logoutRequestSuccess} from '../reducers/auth'
import update from 'immutability-helper';

const emptyAddress = {
    default_shipping: null,
    default_billing: null
}

const initialState: Customer | null = null

export const customerSlice = createSlice({
  name: "customer",
  initialState,
  reducers: {
    activeEmailSuccess:(state:any) => {
      if (!state) return null
      return update(state, {
        verified_email: {
          verified: { $set: true }
        }
      })
    },
    getDefaultAddressSuccess: (state:any, action) => {
      if (!state) return null
      return update(state, {
        address: { $set: action.payload || emptyAddress }
      })
    },
    activeShopperSuccess:(state:any) => {
      if (!state) return null
      return update(state, {
        shopper: {
          active: { $set: true }
        }
      })
    }
  },
  extraReducers: (builder) => {
    builder
    .addCase(loginRequestSuccess,(state, action: any) => {
        let { customer }:any = action.payload
        if (customer && !customer.address) customer.address = emptyAddress
        return customer
    })
    .addCase(logoutRequestSuccess,(state, action: any) => {
      return null
    })
  }
})
export const { 
  activeEmailSuccess, 
  getDefaultAddressSuccess,
  activeShopperSuccess  
}  = customerSlice.actions
export const customerReducer = customerSlice.reducer