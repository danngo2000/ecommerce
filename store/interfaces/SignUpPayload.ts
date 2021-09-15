export interface SignUpPayload {
  fullName: string
  firstName: string
  lastName: string
  email: string
  phone_number: string
  password: string
  captcha?: string
  birthday: string
  // gender: 'male' | 'female'
  gender: string
}