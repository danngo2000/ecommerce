import Image from 'next/image'
import React, { useState } from 'react'
import Slider from 'react-slick'
import { imageLoader } from 'utils'

const ProductGalleryBox = (props) => {
  let { images } = props
  const [nav1, setNav1] = useState<any>()
  const [nav2, setNav2] = useState<any>()
  const largeImages = images.filter((i) => i.size_type === 'large')

  return Array.isArray(largeImages) && largeImages.length > 1 ? (
    <div className='product-gallery-box'>
      <Slider asNavFor={nav2} arrows={false} ref={(c) => setNav1(c)}>
        {largeImages.map((img, k) => (
          <div className='wrap' key={k}>
            <div className='image'>
              <Image
                loader={imageLoader}
                src={img.url}
                width={400}
                height={500}
                className='no-thumb'
                objectFit='contain'
              />
            </div>
          </div>
        ))}
      </Slider>
      <div className='hidenmobile'>
        <Slider
          asNavFor={nav1}
          ref={(c) => setNav2(c)}
          slidesToShow={largeImages.length > 5 ? 5 : largeImages.length}
          swipeToSlide={true}
          focusOnSelect={true}
          arrows={false}
          className='lg-slider'
        >
          {largeImages.map((img, k) => (
            <div key={k}>
              <div className='image'>
                <Image
                  loader={imageLoader}
                  src={img.url}
                  width={98}
                  height={131}
                  className='no-thumb'
                  objectFit='contain'
                />
              </div>
            </div>
          ))}
        </Slider>
      </div>
    </div>
  ) : (
    <div className='product-gallery-box'>
      <div className='wrap'>
        <div className='image'>
          <Image
            loader={imageLoader}
            src={largeImages[0]?.url}
            width={400}
            height={500}
            className='no-thumb'
            objectFit='contain'
          />
        </div>
      </div>
    </div>
  )
}

export default ProductGalleryBox
