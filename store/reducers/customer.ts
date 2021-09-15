import { createSlice } from "@reduxjs/toolkit";
import produce from "immer";
import { HYDRATE } from "next-redux-wrapper";

import { CustomerStateReducer } from "../interfaces";
// import {loginRequestSuccess, logoutRequestSuccess} from '../reducers/auth'
import { AuthActions } from "../reducers/authV1";

const emptyAddress = {
  default_shipping: null,
  default_billing: null,
};

// const initialState: Customer | null = null
/** init and define type */
const initialState = {
  customerData: null,
} as CustomerStateReducer;

export const customerSlice = createSlice({
  name: "customer",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // .addCase(HYDRATE, (state, action) => {
      //   console.log("action", action);
      //   return produce(state, (draft) => {
      //     return draft;
      //   });
      // })
      .addCase(AuthActions.LOGIN_SUCCESS, (state, action) => {
        let { customer }: any = action.payload;
        return produce(state, (draft) => {
          draft.customerData = customer;
          if (customer && !customer.address) customer.address = emptyAddress;
          return draft;
        });
      })
      .addCase(AuthActions.LOGOUT_SUCCESS, (state) => {
        return produce(state, (draft) => {
          draft.customerData = null;
          return draft;
        });
      });
    // builder
    //   .addCase(HYDRATE,(state, action: any) => {
    //     return action.payload.customer
    //   })
    //   .addCase(AuthActions.LOGIN_SUCCESS, (state, action: any) => {
    //     let { customer }: any = action.payload;
    //     return produce(state, (draft) => {
    //       draft.customerData=customer;
    //       if (customer && !customer.address) customer.address = emptyAddress;
    //       return draft;
    //     });
    //   }).addCase(AuthActions.LOGOUT_SUCCESS,(state, action: any) => {
    //   return null
    // })
  },
});

export const customerReducer = customerSlice.reducer;
