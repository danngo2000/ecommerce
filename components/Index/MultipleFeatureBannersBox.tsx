import Link from 'next/link'
import React, { FC } from 'react'
import { useSelector } from 'react-redux'
import { convertUrlAlias } from 'utils'
import { Button } from 'antd'
import RetinaImage from 'components/RetinaImage'
import renderHTML from 'react-render-html'

interface Type {
  data?: any
  id?: any
}

const MultipleFeatureBannersBox: FC<Type> = React.memo(({ data, id }) => {
  const _config = useSelector((state: any) => state.config)
  const theme = _config['site/theme']

  return (
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
        {data.banners.map((banner: any, index: any) =>
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
                        style={{ order: banner.iconPos === 'right' ? '1' : '0' } as any}
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
                  <RetinaImage
                    alt={banner.description}
                    src={banner.imgUrl}
                    hiresSrc={banner.highResImg || banner.imgUrl}
                  />
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
  )
})

export default MultipleFeatureBannersBox
