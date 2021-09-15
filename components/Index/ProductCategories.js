import React, { memo } from 'react'
import Link from 'next/link'
import Swiper from '../CustomSwiper'
import { SlideArrow } from './../Blocks/SlideArrow'
import { SlideArrowAlt } from './../Blocks/SlideArrowAlt'
import config from 'settings'
import Lazy from 'react-lazyload'
import RetinaImage from '../RetinaImage'
import { useSelector } from 'react-redux'

export default memo(props => {
  const _config = useSelector(state => state.config)
  const themeSettings = _config['site/theme/settings'] || {}
  const Arrow = (themeSettings.sliderArrow && themeSettings.sliderArrow === 'slim') ? SlideArrowAlt : SlideArrow
  const swiperOptions = {
    slidesPerView: 6,
    slidesPerGroup: 1,
    spaceBetween: 20,
    loop: false,
    freeMode: true,
    breakpoints: {
      1024: {
        slidesPerView: 6,
        slidesPerGroup: 6,
        lop: true // dot
      },
      600: {
        slidesPerView: 3,
        slidesPerGroup: 3,
        initialSlide: 2
      },
      480: {
        slidesPerView: 2,
        slidesPerGroup: 2
      }
    }
  }

  return (
    <Lazy height='300px' offset={100}>
      <div className='featuredBox productCategoryThumbs'>
        <div className='container'>
          <div className='square-slider'>
            <Swiper options={swiperOptions}>
              <Swiper.Wrapper>
                {
                  Array.isArray(props.data.categories) &&
                  (props.data.categories.map((item, index) => {
                    return (
                      <div className='slider-item' key={index}>
                        <Link as={`/c/${item.link}`} href={`/category?categorySlug=${item.link}`}>
                          <a>
                            <div className='img-wrapper'>
                              <RetinaImage className='swiper-lazy' alt={item.title} src={item.imgUrl} hiresSrc={item.highResImg || item.imgUrl} />
                              <img alt='category thumbnail' data-src={item.imgUrl} className='swiper-lazy' />
                            </div>
                            <div className='title'>{item.title}</div>
                          </a>
                        </Link>
                      </div>
                    )
                  }))
                }
              </Swiper.Wrapper>
              {
                config.theme !== 'pink-theme' &&
                <Swiper.Nav arrowIcon={Arrow} />
              }
            </Swiper>
          </div>
        </div>
      </div>
    </Lazy>
  )
})
