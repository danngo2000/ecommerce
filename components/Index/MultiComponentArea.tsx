import Link from 'next/link'
import React, { FC } from 'react'
import { Button } from 'antd'
import renderHTML from 'react-render-html'
import { convertUrlAlias } from 'utils'
import Lazy from 'react-lazyload'
import RetinaImage from '../RetinaImage'
import { useSelector } from 'react-redux'

interface Type {
  data: any
  id: any
}

const MultiComponentArea: FC<Type> = React.memo((props) => {
  const { data, id } = props
  const _config = useSelector((state: any) => state.config)
  const theme = _config['site/theme']
  return (
    <Lazy height='350px' offset={100}>
      <div className={`featured-banners ${id || ''}`}>
        {data.title && theme === 'imex-food' && (
          <div className='outside-header'>
            <h3>{data.title}</h3>
          </div>
        )}
        <div className={`container of-${data.banners.length}`}>
          {data.title &&
            [
              'orange-theme',
              'pink-theme',
              'yellow-theme',
              'green-theme'
            ].includes(theme) && (
              <div className='header'>
                <h3>{data.title}</h3>
              </div>
            )}
          {data.banners.map((banner, index) =>
            !banner.bgFirst ? (
              <Link
                href={convertUrlAlias(banner.link) || '#'}
                as={banner.link}
                key={index}
              >
                <div
                  className='banner'
                  style={{ background: `url(${banner.imgUrl}) #009f52` }}
                >
                  {banner.iconUrl && (
                    <>
                      <div
                        className='icon'
                        style={{
                          order: banner.iconPos === 'right' ? '1' : '0'
                        } as any}
                      >
                        <img src={banner.iconUrl} alt='icon' />
                      </div>
                    </>
                  )}
                  <div className='title-card'>
                    <div className='title'>{banner.title}</div>
                    <div className='description'>{banner.description}</div>
                    <Button className='button' />
                  </div>
                </div>
              </Link>
            ) : (
              <Link
                href={convertUrlAlias(banner.link) || '#'}
                as={banner.link}
                key={index}
              >
                <div className='bg-first banner'>
                  <a href={banner.link}>
                    <div className='img-mobile'>
                      <RetinaImage
                        alt={banner.description}
                        src={banner.imgUrl1}
                        hiresSrc={banner.highResImg || banner.imgUrl}
                      />
                    </div>
                    <div className='img-desktop'>
                      <RetinaImage
                        alt={banner.description}
                        src={banner.imgUrl2}
                        hiresSrc={banner.highResImg || banner.imgUrl}
                      />
                    </div>
                  </a>
                  <div className='title' style={banner.titleStyle}>
                    {renderHTML(banner.title || '')}
                  </div>
                  {banner.description && (
                    <div className='description'>{banner.description}</div>
                  )}
                  {banner.buttonText && (
                    <Button className='button'>{banner.buttonText}</Button>
                  )}
                </div>
              </Link>
            )
          )}
        </div>
      </div>
    </Lazy>
  )
})

export default MultiComponentArea
