import axios from 'axios'

export const loginRequest = (email: string, password: string, captchaToken = '', cartToken?: string) => axios
    .post('customers/login', { email, password, captchaToken, cartToken })
    .then(res => res.data)

export const googleLoginRequest:any = (idToken: string, cartToken?: string, refCode?: string) => axios
    .post('customers/loginGoogle', { idToken, cartToken, refCode })
    .then(res => res.data)

export const facebookLoginRequest = ({ facebookToken = '', email = '' }, cartToken?: string) => axios
    .post('customers/loginFacebook', { accessToken: facebookToken, email, cartToken })
    .then(res => res.data)

export const tokenRequest = () => axios
    .get(`auth/token/get`)
    .then(res => res.data)

export const registerRequest = (body) => axios
    .post('customers/register', body)
    .then(res => res.data)

export const changePasswordRequest = ({ passwordToken, newPassword }) => axios
    .put('customers/password', {
      passwordToken,
      newPassword,
      getLoginToken: true
    })
    .then(res => res.data)

export const allInOneRequest = (isGuest: boolean, customerId?: string) => axios
    .post(`customers/allinone`, {
      cart: true,
      customer: !isGuest,
      addressBooks: !isGuest,
      wishList: !isGuest,
      customerId
    })
    .then(res => res.data)
