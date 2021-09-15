import { combineReducers } from "redux";
import { configReducer } from "./config";
import { categoriesReducer } from "./categories";
import { bookingReducer } from "./booking";
import authReducerV1 from "./authV1";
import { authReducer } from "./auth";
import { customerReducer } from "./customer";
// import { checkoutReducer } from './checkout';
import cartReducer from "./cart";

const rootReducer = combineReducers({
  config: configReducer,
  categories: categoriesReducer,
  // booking: bookingReducer,
  authv1: authReducerV1,
  auth: authReducer,
  customer: customerReducer,
  // checkout: checkoutReducer,
  cart: cartReducer,
});



export default rootReducer;
