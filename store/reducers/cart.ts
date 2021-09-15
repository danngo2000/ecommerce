import { createSlice } from "@reduxjs/toolkit";
import produce from "immer";

/* ######### interfaces ######## */
import { CartStateReducer } from "../interfaces";

import { AuthActions } from "./authV1";

/** init and define type */
const initialState = {
  cartData: {},
  isAddToCart: false,
  getCartLoading: false,
  addToCartLoading: false,
} as CartStateReducer;
/** create reducers and actions */
const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    /** call when dispatch action get cart */
    CART_REQUEST: (state) => {
      return produce(state, (draft) => {
        draft.getCartLoading = true;
        return draft;
      });
    },
    CART_SUCCESS: (state, action) => {
      return produce(state, (draft) => {
        draft.getCartLoading = false;
        draft.cartData = action.payload;
        return draft;
      });
    },
    CART_FAILED: (state) => {
      return produce(state, (draft) => {
        draft.getCartLoading = false;
        return draft;
      });
    },

    /** call when dispatch action update cart */
    UPDATE_CART_REQUEST: (state, action) => {
      return produce(state, (draft) => {
        return draft;
      });
    },
    UPDATE_CART_SUCCESS: (state, action) => {
      return produce(state, (draft) => {
        draft.cartData = action.payload;
        return draft;
      });
    },
    UPDATE_CART_FAILED: (state) => {
      return produce(state, (draft) => {
        return draft;
      });
    },
    /** call when dispatch action remote popup */
    REMOTE_POPUP_ADD_TO_CART: (state, action) => {
      return produce(state, (draft) => {
        draft.isAddToCart = action.payload;
        return draft;
      });
    },
    /** call when dispatch action remote popup */
    SET_ADDRESS_DEFAULT: (state, action) => {
      return produce(state, (draft) => {
        draft.cartData.address = {
          shipping: action.payload,
          billing: action.payload,
          
        };
        return draft;
      });
    },
  },
  extraReducers: (builder) => {
    builder.addCase(AuthActions.LOGOUT_SUCCESS, (state) => {
      return initialState;
    });
  },
});

/** export actions */
export const CartActions = cartSlice.actions;

/** export reducers */
export default cartSlice.reducer;
