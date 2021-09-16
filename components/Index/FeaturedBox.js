import Link from 'next/link'
import React from 'react'
import Lazy from 'react-lazyload'
import { useSelector } from 'react-redux'
import { RightOutlined } from '@ant-design/icons'
import ProductSlider from 'components/Product/ProductSlider'

const FeaturedBox = React.memo((props) => {
  const _config = useSelector((state) => state.config)
  const theme = _config['site/theme']
  let quickMode = _config['products/add_to_cart/quick_mode']

  return (
    <Lazy height='50rem' offset={100}>
      <div className='container'>
        {theme === 'imex-food' ? (
          <div className='outside-header'>
            <h3>{props.title}</h3>
            {props.viewAllLink && (
              <div className='viewAllAction'>
                <Link
                  as={`/c/${props.viewAllLink}`}
                  href={`/category?categorySlug=${props.viewAllLink}`}
                >
                  <a href={`/c/${props.viewAllLink}`}>
                    <span>
                      Shop All
                      <RightOutlined />
                    </span>
                  </a>
                </Link>
              </div>
            )}
            {props.seeMoreLink && (
              <div className='viewAllAction'>
                <Link
                  as={props.seeMoreLink}
                  href={convertUrlAlias(props.seeMoreLink) || '#'}
                >
                  <a href={props.seeMoreLink}>
                    <span>
                      See More
                      <RightOutlined />
                    </span>
                  </a>
                </Link>
              </div>
            )}
          </div>
        ) : (
          ''
        )}
        <article className='featuredBox dealZone'>
          {[
            'orange-theme',
            'pink-theme',
            'yellow-theme',
            'green-theme'
          ].includes(theme) ? (
            <div className='header'>
              <div className='heading'>
                {props.title && (
                  <h2>
                    <span>{props.title}</span>
                  </h2>
                )}
              </div>
              {props.viewAllLink && (
                <div className='viewAllAction'>
                  <Link
                    as={`/c/${props.viewAllLink}`}
                    href={`/category?categorySlug=${props.viewAllLink}`}
                  >
                    <a href={`/c/${props.viewAllLink}`}>
                      <span>
                        Shop All
                        <RightOutlined />
                      </span>
                    </a>
                  </Link>
                </div>
              )}
              {props.seeMoreLink && (
                <div className='viewAllAction'>
                  <Link
                    as={props.seeMoreLink}
                    href={convertUrlAlias(props.seeMoreLink) || '#'}
                  >
                    <a href={props.seeMoreLink}>
                      <span>
                        See More
                        <RightOutlined />
                      </span>
                    </a>
                  </Link>
                </div>
              )}
            </div>
          ) : (
            ''
          )}
          <div className='content'>
            <ProductSlider products={props.products} showAddToCartButton={quickMode} />
          </div>
        </article>
      </div>
    </Lazy>
  )
})

export default FeaturedBox
