import { Customer } from "./Customer";
import { Cart } from "./Cart";

export interface LoginPayload {
  email: string;
  password: string;
  captchaToken?: any;
  cartToken?: string;
}
export interface GoogleLoginPayload {
  googleToken: string;
}
export interface FacebookLoginPayload {
  facebookToken: string;
  email: string;
}

export interface LoginResponseData {
  customer: Customer;
  token: string;
  cart: Cart;
}
