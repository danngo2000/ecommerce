import axios from "axios";

import { LoginPayload } from "store/interfaces";

export const LoginDefault = (request: LoginPayload) => {
  if (!request.captchaToken) request.captchaToken = "";
  return axios.post("customers/login", request).then((res) => res.data);
};

export const loginRequest = (
  email: string,
  password: string,
  captchaToken = "",
  cartToken?: string
) =>
  axios
    .post("customers/login", { email, password, captchaToken, cartToken })
    .then((res) => res.data);

export const googleLoginRequest = (
  idToken: string,
  cartToken?: string,
  refCode?: string | null
) =>
  axios
    .post("customers/loginGoogle", { idToken, cartToken, refCode })
    .then((res) => res.data);

export const facebookLoginRequest = (
  { facebookToken = "", email = "" },
  cartToken?: string
) =>
  axios
    .post("customers/loginFacebook", {
      accessToken: facebookToken,
      email,
      cartToken,
    })
    .then((res) => res.data);

export const tokenRequest = () =>
  axios.get(`auth/token/get`).then((res) => res.data);

export const registerRequest = (body: any) =>
  axios.post("customers/register", body).then((res) => res.data);

export const changePasswordRequest = ({ passwordToken, newPassword }: any) =>
  axios
    .put("customers/password", {
      passwordToken,
      newPassword,
      getLoginToken: true,
    })
    .then((res) => res.data);

export const allInOneRequest = (isGuest: boolean, customerId?: string) =>
  axios
    .post(`customers/allinone`, {
      cart: true,
      customer: !isGuest,
      addressBooks: !isGuest,
      wishList: !isGuest,
      customerId,
    })
    .then((res) => res.data);
