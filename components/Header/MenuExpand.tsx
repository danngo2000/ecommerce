import React from 'react'
import Link from 'next/link'
// import { SlideArrowAlt } from './../Blocks/SlideArrowAlt'
import renderHTML from 'react-render-html'
// import { T, t } from 'locales'

const MenuExpand = React.memo((props: any) => {
  const { category } = props
  return (
    <div key={category._id} className='subBox'>
      <ul className='nav-subcategory'>
        {category.children &&
          category.children.map((child) => (
            <li key={child._id}>
              <Link
                as={`/c/${child.slug}`}
                href={`/category?categorySlug=${child.slug}`}
              >
                <a>{child.name}</a>
              </Link>
              <ul className='nav-items'>
                {child.children &&
                  child.children
                    .slice(
                      0,
                      child.menu_settings &&
                        child.menu_settings.children_limit > 0
                        ? child.menu_settings.children_limit
                        : child.children.length
                    )
                    .map((grandChild) => (
                      <li key={grandChild._id}>
                        <Link
                          as={`/c/${grandChild.slug}`}
                          href={`/category?categorySlug=${grandChild.slug}`}
                        >
                          <a>
                            {grandChild.name}
                            {grandChild.menu_settings &&
                              grandChild.menu_settings.image_right_icon.trim() !==
                                '' && (
                                <span className='nav-item-right-icon'>
                                  <img
                                    className='nav-item-right-icon-img'
                                    src={
                                      grandChild.menu_settings.image_right_icon
                                    }
                                    alt=''
                                  />
                                </span>
                              )}
                          </a>
                        </Link>
                      </li>
                    ))}
                {child.menu_settings && child.menu_settings.children_limit > 0 && (
                  <li className='nav-items-view-all'>
                    <Link
                      as={`/c/${child.slug}`}
                      href={`/category?categorySlug=${child.slug}`}
                    >
                      <a>{/* <span>{t('View All')}</span> */}</a>
                    </Link>
                  </li>
                )}
              </ul>
            </li>
          ))}
      </ul>
      {category.menu_settings &&
        category.menu_settings.image_banner.trim() !== '' && (
          <div className='nav-banner'>
            <Link href={category.menu_settings.banner_url}>
              <a href={category.menu_settings.banner_url}>
                <div
                  className='nav-banner-img-wrapper'
                  style={{ position: 'relative', cursor: 'pointer' }}
                >
                  <img src={category.menu_settings.image_banner} alt='' />
                  <div
                    style={{
                      position: 'absolute',
                      top: 0,
                      bottom: 0,
                      left: 0,
                      right: 0
                    }}
                  >
                    <div
                      className={`content ${category.menu_settings.class_name}`}
                    >
                      {renderHTML(category.menu_settings.banner_content)}
                    </div>
                  </div>
                </div>
              </a>
            </Link>
          </div>
        )}
    </div>
  )
})

export default MenuExpand
