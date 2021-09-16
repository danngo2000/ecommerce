import React from 'react'
import { useState } from 'react'
import classNames from 'classnames'
import { Button, Popover, Carousel } from 'antd'
import * as Icon from '@ant-design/icons'
import Link from 'next/link'
import Logo from 'components/Logo'
import { useSelector } from 'react-redux'
import TheMainMenu from 'components/Header/TheMainMenu'
import SearchInput from './SearchInput'
import settings from '../../config/settings'
import AccountTooltip from './AccountTooltip'
import MiniCart from 'components/Cart/MiniCart'
import { toggleLoginDialog } from '../../actions/ui'

const Header = () => {
  const [scrolled, setScrolled] = useState(false)
  const [fixed, setFixed] = useState(false)
  const [active, setActive] = useState(false)
  const [showSearchBar, setShowSearchBar] = useState(true)
  const { isGuest } = useSelector((state: any) => state.auth)
  const customer = useSelector((state: any) => state.customer)
  const config = useSelector((state: any) => state.config)
  const props = useSelector((state: any) => state)

  let topBarMessenger = config['site/header/topBarMessenger']
  let headerContent = config['site/header/headerContent']
  let cartText = ''
  let themeSettings = config['site/theme/settings']

  let freeShippingText = config['site/header/freeShippingText']
  let topBarText = config['site/header/topBarText']
  let topMenu = config['site/header/top-menus']
  const theme = config['site/theme']

  const toggleSearchBar = () => {
    setShowSearchBar(!showSearchBar)
  }

  if (['yellow-theme', 'pink-theme'].includes(theme)) cartText = 'Cart'
  const as =
    theme === 'green-theme' ? '/page/stores-for-you' : '/page/flash-sale'
  const href =
    theme === 'green-theme'
      ? '/page?slug=stores-for-you'
      : '/page?slug=flash-sale'

  return (
    <div className='header'>
      <div className='headerBox'>
        <div
          className={classNames('headerWrap fixed-container', {
            scrolled,
            fixed,
            active: active || ''
          })}
        >
          <div className='topMenu hideOnMobile'>
            <div className='container top-bar-messenge'>
              <Carousel autoplay>
                <span className='topBarText top-bar-text'>
                  {theme !== 'yellow-theme' && topBarMessenger}
                  {theme === 'yellow-theme' && (
                    <ul className='topCenterMenu'>
                      {topBarText.map((item: any, index: any) => (
                        <li>
                          <div className='topBarText' key={index}>
                            <Link href={`${item.slug}`}>
                              <a>{item.title}</a>
                            </Link>
                          </div>
                        </li>
                      ))}
                    </ul>
                  )}
                </span>
                {freeShippingText === '' ? (
                  ''
                ) : (
                  <span className='free-shipping-top-bar top-bar-text'>
                    {freeShippingText}
                  </span>
                )}
              </Carousel>
              <ul className='topSecondaryMenu'>
                {topMenu &&
                  topMenu.map((item, index) =>
                    ['/customer/register', '/customer/login'].includes(
                      item.as
                    ) && !isGuest ? null : (
                      <li key={index}>
                        <Link href={`${item.href}`} as={`${item.as}`}>
                          <a>{item.title}</a>
                        </Link>
                      </li>
                    )
                  )}
              </ul>
            </div>
            <div className='clearfix' />
          </div>
          <div className='container'>
            <div className='headerMain'>
              <div
                className={classNames('row', config.imexglobal)}
                id='headerRow'
              >
                <div
                  id='logoBox'
                  className={`col1 logoBox ${showSearchBar && 'hideOnMobile'}`}
                >
                  <Logo />
                </div>
                <div
                  className={
                    theme === 'yellow-theme'
                      ? 'mainMenuLogo logoImex'
                      : 'mainMenuLogo '
                  }
                >
                  <TheMainMenu />
                </div>
                <div id='searchBarBox' className='col2 searchBarBox'>
                  <div className='searchShowBtn' onClick={toggleSearchBar}>
                    <Icon.SearchOutlined />
                  </div>
                  <div className={'searchBar' + (showSearchBar ? ' show' : '')}>
                    <SearchInput q={props.q} />
                  </div>
                </div>
                <div className='col3 user-nav hideOnMobile'>
                  {!['yellow-theme'].includes(theme) && (
                    <>
                      {settings.theme && settings.theme === 'blue' ? (
                        ''
                      ) : (
                        <Link as={as} href={href}>
                          <a className='flashSaleBtn'>
                            <img
                              src='/static/images/svg/white-flash-sale.svg'
                              alt=''
                            />
                            <button className={`btnFS ${theme}`}>
                              Flash Sale
                            </button>
                          </a>
                        </Link>
                      )}
                    </>
                  )}

                  {settings.theme && settings.theme === 'blue' ? (
                    ''
                  ) : (
                    <Link href='/community' as='/community'>
                      <div className='notificationHeaderBlock'>
                        <Button className=' notification-button'>
                          <Icon.CommentOutlined />
                          <p className='title'>Community</p>
                        </Button>
                      </div>
                    </Link>
                  )}
                  {!isGuest ? (
                    <Link
                      as='/customer/dashboard'
                      href='/customer?subPage=dashboard'
                    >
                      <a
                        className={
                          theme === 'yellow-theme'
                            ? 'myAccountLink myAccountImex'
                            : 'myAccountLink'
                        }
                      >
                        {!isGuest && (
                          <label className='my-account-text'>
                            Hi,
                            {customer.first_name
                              ? customer.first_name
                              : customer.last_name}
                          </label>
                        )}
                        <Popover
                          overlayClassName={`popover-notification myAccountNotification ${
                            scrolled ? 'scrolled' : ''
                          }`}
                          placement='bottomRight'
                          content={<AccountTooltip />}
                          trigger='hover'
                        >
                          <Button type='ghost'>
                            <Icon.UserOutlined />
                            My Account
                          </Button>
                        </Popover>
                      </a>
                    </Link>
                  ) : (
                    <div
                      className={
                        theme === 'yellow-theme'
                          ? 'myAccountLink myAccountImex'
                          : 'myAccountLink'
                      }
                    >
                      <Button onClick={() => toggleLoginDialog}>
                        <Icon.UserOutlined />
                        My Account
                      </Button>
                    </div>
                  )}
                  <Link href='/customer/myWishlist'>
                    <a className='wishlistLink'>
                      <Button icon={<Icon.HeartOutlined />}>Wishlist</Button>
                    </a>
                  </Link>
                  <MiniCart icon={'shopping-cart'} text={cartText} />
                </div>
              </div>
            </div>
          </div>
        </div>
        {themeSettings && themeSettings.mainMenuPosition === 'under' && (
          <div className='mainMenu'>
            <div className='container'>
              <TheMainMenu />
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default Header
