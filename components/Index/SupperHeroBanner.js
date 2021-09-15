import React, { Component } from 'react'
// import { T, t } from 'locales'
import Link from 'next/link'
import renderHTML from 'react-render-html'
import Lazy from 'react-lazyload'
import RetinaBackground from './../RetinaBackground'

const SupperHeroBanner = React.memo((props) => {
  return (
    <div className='superheroBanner text-right'>
      <Lazy height='300px' offset={100}>
        {props.data.list.map((item, index) => {
          return (
            <div key={index}>
              <RetinaBackground
                className='banner'
                src={item.img}
                hiresSrc={item.highResImg || item.img}
              >
                <div
                  className='container'
                  style={{ display: 'flex', width: '66%' }}
                >
                  <img
                    src='https://d1i5ti8rq3af58.cloudfront.net/2021/3/3/1614760594531.3013.png'
                    alt=''
                  />
                  {item.title && <h2>{renderHTML(item.title)}</h2>}
                  <p>{item.description}</p>
                  <Link
                    as={`/c/${item.url}`}
                    href={`/category?categorySlug=${item.url}`}
                  >
                    <a className='btn btnShopNow'>SHOP NOW</a>
                  </Link>
                </div>
              </RetinaBackground>
            </div>
          )
        })}
      </Lazy>
    </div>
  )
})

export default SupperHeroBanner
