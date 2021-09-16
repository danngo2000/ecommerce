import React, { memo, useEffect, useState } from 'react'
import { SlideArrow } from './../Blocks/SlideArrow'
import { SlideArrowAlt } from './../Blocks/SlideArrowAlt'
import ProductItem from './ProductItem'
import Swiper from '../CustomSwiper'
import Router from 'next/router'
import { useSelector } from 'react-redux'

export default memo(props => {
  const _config = useSelector(state => state.config)
  const [shouldInitSwiper, setShouldInitSwiper] = useState(true)

  let Arrow = SlideArrow
  let { products, openNewWindow = false, slidesToShow = 6, lazy } = props
  let themeSettings = {}

  const config = _config['site/theme/settings']
  if (config) {
    if (config.productsSlider) themeSettings = config.productsSlider
    if (config.sliderArrow && config.sliderArrow === 'slim') Arrow = SlideArrowAlt
  }
  const { destroy } = themeSettings
  const swiperOptions = {
    slidesPerView: slidesToShow,
    slidesPerGroup: 1,
    spaceBetween: 10,
    loop: false,
    freeMode: true,
    breakpoints: {
      1024: {
        slidesPerView: 6,
        slidesPerGroup: 6,
        loop: false
      },
      600: {
        slidesPerView: 2,
        slidesPerGroup: 2,
        loop: false
      },
      0: {
        slidesPerView: 2,
        slidesPerGroup: 2,
        loop: false
      }
    },
    ...themeSettings
  }


  useEffect(() => {
    if (destroy && destroy.paths.includes(Router.pathname) && window.innerWidth <= destroy.breakpoint) {
      setShouldInitSwiper(false)
    }
  }, [])

  if (!shouldInitSwiper) {
    return (
      <div>
        <div className={`products-showcase-${destroy.replace}`}>
          {
            products.map((product, index) => (
              <ProductItem
                openNewWindow={openNewWindow}
                key={index}
                product={product}
                noCol={destroy.replace !== 'flex'}
                type={props.type}
                showAddToCartButton />
            ))
          }
        </div>
      </div>
    )
  }

  return (
    <Swiper options={swiperOptions}>
      <Swiper.Wrapper>
        {
          products.map((product, index) => (
            <ProductItem
              openNewWindow={openNewWindow}
              key={index}
              product={product}
              noCol
              type={props.type}
              lazy
              showAddToCartButton />
          ))
        }
      </Swiper.Wrapper>
      <Swiper.Nav arrowIcon={Arrow} />
    </Swiper>
  )
})
