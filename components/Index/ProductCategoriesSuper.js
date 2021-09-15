import Link from 'next/link'
import React, { memo } from 'react'
import { Button } from 'antd'
import Swiper from '../CustomSwiper/index'
import renderHTML from 'react-render-html'
// import { T, t } from 'locales'
import config from 'settings'
import { SlideArrow } from './../Blocks/SlideArrow'
import { SlideArrowAlt } from './../Blocks/SlideArrowAlt'
import { convertUrlAlias } from 'utils'
import { useSelector } from 'react-redux'
import RetinaImage from 'components/RetinaImage'

export default memo((props) => {
  const { data, id } = props
  const swiperOptions = {
    slidesPerView: 1,
    loop: false,
    autoplay: true
  }
  const _config = useSelector((state) => state.config)
  const themeSettings = _config['site/theme/settings'] || {}
  const theme = _config['site/theme']
  const Arrow = (themeSettings.sliderArrow && themeSettings.sliderArrow === 'slim') ? SlideArrowAlt : SlideArrow
  return (
    <div className={`bigSlide ${id || ''}`}>
      <div className='container'>
        <Swiper options={swiperOptions}>
          <Swiper.Wrapper>
            {data.banners.map((banner, index) => (
              <a href={banner.link} key={index}>
                <div className='banner'>
                  <RetinaImage
                    src={banner.imgUrl}
                    hiresSrc={banner.highResImg || banner.imgUrl}
                  />
                  {banner.iconUrl && (
                    <>
                      <div
                        className='icon'
                        style={{
                          order: banner.iconPos === 'right' ? '1' : '0'
                        }}
                      >
                        <img src={banner.iconUrl} alt='icon' />
                      </div>
                    </>
                  )}
                  {!['orange-theme', 'green-theme'].includes(theme) && (
                    <div
                      className={`title-card${
                        !banner.title ? ' no-title' : ''
                      }`}
                    >
                      {banner.title && (
                        <div className='title'>{renderHTML(banner.title)}</div>
                      )}
                      <div className='description'>{banner.description}</div>
                      <Button className='button shop-Now' type='ghost'>
                        {banner.buttonText || t('SHOP NOW')}
                      </Button>
                    </div>
                  )}
                </div>
              </a>
            ))}
          </Swiper.Wrapper>
          <Swiper.Pagination />
          {['pink-theme', 'yellow-theme'].includes(theme) && (
            <Swiper.Nav arrowIcon={Arrow} />
          )}
        </Swiper>
      </div>
    </div>
  )
})
