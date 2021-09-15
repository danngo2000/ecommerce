import React, { useState, useEffect, FC } from 'react'
import isRetina from 'is-retina'

interface Type {
  className?: string
  src: string
  hiresSrc: string
  alt: any
}

const RetinaImage:FC<Type> = ({ className, src, hiresSrc, alt }) => {
  const [state, setState] = useState(src)

  useEffect(() => {
    retinaCalc()
  },[])

  const retinaCalc = () => {
    let url = ''
    if (isRetina()) {
      url = hiresSrc || src
    } else {
      url = src
    }
    setState(url)
  }

  return <img src={state} alt={alt} className={className} />
}

export default RetinaImage
