import React from 'react'
import Link from 'next/link'
import Lazy from 'react-lazyload'
import RetinaImage from '../RetinaImage'

const ProductCategories = React.memo(props => {
  const { data } = props
  return (
    <Lazy height='500px' offset={100}>
      <div className='product-category-thumbs'>
        <div className='container'>
          {
            data && data.title && (
              <div className='header'><h3>{data.title}</h3></div>
            )
          }
          <div className='categories-wrapper' style={{ display: 'flex' }}>
            {
              data.categories.map((item, index) => {
                return (
                  <div className='item' key={index}>
                    <Link href={item.link}>
                      <a>
                        <div className='img-wrapper'>
                          <RetinaImage alt={item.title} src={item.imgUrl} hiresSrc={item.highResImg || item.imgUrl} />
                          <div className='img-as-bg' style={{ background: `url(${item.imgUrl})` }}>
                            <div className='inner-title'>{item.title}</div>
                          </div>
                        </div>
                        <div className='title'>{item.title}</div>
                      </a>
                    </Link>
                  </div>
                )
              })
            }
          </div>
        </div>
      </div>
    </Lazy>
  )
})

export default ProductCategories
