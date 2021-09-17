import React, {FC} from 'react'
import NumberFormat from 'react-number-format'

interface TypeProps {
  price?: number
}

const Price: FC <TypeProps> = (props: any) => {
  const { price } = props
  return (
    <NumberFormat
      value={price}
      displayType={'text'}
      thousandSeparator={true}
      prefix={'$'}
      renderText={(value) => <>{value}</>}
    />
  )
}

export default Price
