import React, { memo } from 'react'
import Link from 'next/link'
import { SlideArrow } from '../Blocks/SlideArrow'
import { SlideArrowAlt } from '../Blocks/SlideArrowAlt'
import Swiper from '../CustomSwiper'
import { convertUrlAlias } from 'utils'
import Lazy from 'react-lazyload'
import RetinaImage from '../RetinaImage'
import { useSelector } from 'react-redux'

export default memo((props) => {
  const _config = useSelector((state) => state.config)
  const themeSettings = _config['site/theme/settings'] || {}
  const theme = _config['site/theme']
  const Arrow =
    themeSettings.sliderArrow && themeSettings.sliderArrow === 'slim'
      ? SlideArrowAlt
      : SlideArrow
  const defaultSettings = {
    breakpoints: {
      1536: {
        loop: false,
        slidesPerView: 5,
        slidesPerGroup: 1
      },
      1024: {
        loop: false,
        slidesPerView: 4,
        slidesPerGroup: 1
      },
      768: {
        loop: false,
        slidesPerView: 4,
        slidesPerGroup: 1
      },
      512: {
        loop: false,
        slidesPerView: 2,
        slidesPerGroup: 1
      }
    },
    ...(themeSettings && themeSettings.imagesSlider)
  }

  let swiperOptions = {
    slidesPerView: props.data.slidesPerView || 6,
    slidesPerGroup: 1,
    slidesPerColumn: props.data.slidesPerColumn || 1,
    loop: false,
    freeMode: false,
    autoplay: { delay: 5000 }
  }

  if (
    props.data.className &&
    props.data.className === 'searches' &&
    themeSettings &&
    themeSettings.searchesSlider
  ) {
    swiperOptions = {
      ...swiperOptions,
      ...(themeSettings && themeSettings.searchesSlider)
    }
  } else {
    swiperOptions = { ...swiperOptions, ...defaultSettings }
  }

  return (
    <Lazy height='300px' offset={100}>
      <div className='container image-gallery'>
        {theme === 'imex-food' ? (
          <div className='outside-header'>
            <h3>{props.data.title}</h3>
          </div>
        ) : (
          ''
        )}
        <div
          className={`featuredBox brandSlider ${props.data.className || ''}`}
        >
          {['orange-theme', 'pink-theme', 'yellow-theme'].includes(theme) ? (
            <div className='header'>
              <h3>{props.data.title}</h3>
            </div>
          ) : (
            <></>
          )}
          {props.data.description && (
            <div className='description'>{props.data.description}</div>
          )}
          <Swiper options={swiperOptions}>
            <Swiper.Wrapper>
              {props.data.data.map((item, index) => {
                return (
                  <div key={index}>
                    <Link
                      href={convertUrlAlias(item.link) || '#'}
                      as={item.link}
                    >
                      <a href={item.link || '#'} alt={item.title}>
                        <RetinaImage
                          alt={item.title}
                          src={item.imgUrl}
                          hiresSrc={item.highResImg || item.imgUrl}
                        />
                        {props.data.showTitle && (
                          <div className='title'>{item.title}</div>
                        )}
                      </a>
                    </Link>
                  </div>
                )
              })}
            </Swiper.Wrapper>
            <Swiper.Nav arrowIcon={Arrow} />
          </Swiper>
        </div>
      </div>
    </Lazy>
  )
})
