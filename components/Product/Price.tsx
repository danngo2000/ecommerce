
import React from 'react'
import { FC } from 'react'
import config from 'settings'

let {  currency  } = config.locale

const intl = new Intl.NumberFormat(
  currency === 'VND' ? 'vi-VN' : 'en-US' ,
  {
    style: 'currency',
    currency
  }
)

interface Props {
  price: any
  children?: any
}

const Price: FC<Props> = React.memo(({ price, children }) => {
  const value = price || children || 0
  return !isNaN(value) && typeof value !== 'undefined' ? intl.format(value) : ''
})

const P = Price

export { Price, P }
export default { Price, P }
