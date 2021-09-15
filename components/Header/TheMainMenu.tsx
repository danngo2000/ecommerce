import Link from 'next/link'
import React, { useState, lazy, Suspense } from 'react'
import { useSelector } from 'react-redux'
import { MenuOutlined } from '@ant-design/icons'
import { useAppSelector } from 'utils/redux'

const MenuExpand = lazy(() => import('./MenuExpand'))

function tryGetImageIcon(category) {
  return category && category.menu_settings
    ? category.menu_settings.image_icon
    : ''
}

const ListMenu = (props: any) => {
  const { isOpen, onClose, categories } = props
  const _config = useSelector((state: any) => state.config)
  const themeSettings = _config['site/theme/settings']
  return (
    <React.Fragment>
      <ul className={`nav-category${isOpen ? ' show' : ''}`}>
        {categories.map((category) => (
          <li
            key={category._id}
            className='category-wrapper'
            onClick={onClose}
          >
            <Link
              as={`/c/${category.slug}`}
              href={`/category?categorySlug=${category.slug}`}
            >
              <a>
                <img
                  src={
                    themeSettings && themeSettings.categoryIcons
                      ? themeSettings &&
                        themeSettings.categoryIcons[category.slug]
                      : tryGetImageIcon(category)
                  }
                />
                {category.name}
              </a>
            </Link>
            {isOpen && (
              <Suspense fallback={null}>
                <MenuExpand category={category} />
              </Suspense>
            )}
          </li>
        ))}
      </ul>
    </React.Fragment>
  )
}

const TheMainMenu = (props: any) => {
  const config = useSelector((state: any) => state.config)
  const categories = useAppSelector((state) => state.categories)

  const theme = config['site/theme']
  const [showMenu, setShowMenu] = useState(false)

  const handleMouseOver = () => {
    setShowMenu(true)
  }

  const handleMouseLeave = () => {
    setShowMenu(false)
  }
  const { className } = props

  return (
    <div className={`navigation-box new ${className}`}>
      <div
        className='menu allProducts'
        onMouseLeave={handleMouseLeave}
        onMouseOver={handleMouseOver}
      >
        <Link href='/'>
          <a onClick={handleMouseLeave}>
            <MenuOutlined className={theme} />
            <span>All Categories</span>
          </a>
        </Link>
        <ListMenu
          isOpen={showMenu}
          categories={categories}
          onClose={handleMouseLeave}
        />
      </div>
    </div>
  )
}

export default TheMainMenu
