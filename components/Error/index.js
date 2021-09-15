import React from 'react'
import { useSelector } from 'react-redux'
import Link from 'next/link'
import { NextSeo } from 'next-seo'
// import {T, t} from 'locales'

const Error = React.memo(() => {
  const _config = useSelector((state) => state.config)
  const theme = _config['site/theme']

  return (
    <>
      <NextSeo title='404 Not Found' />
      <div className={`${theme} container smallContainer NotFoundPage`}>
        <img src='/static/images/error-page-image.png' width='100px' />
        <h1>UH OH</h1>
        <p>Don\'t worry we got you covered!</p>
        <Link href='/'>
          <a>
            <button className='btn'>Continue Shopping</button>
          </a>
        </Link>
      </div>
    </>
  )
})

export default Error
