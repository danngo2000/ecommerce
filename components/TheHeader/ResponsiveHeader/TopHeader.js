import React, { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import * as Icon from '@ant-design/icons'
import { Modal } from 'antd'
import MobileMenu from '../v2/MobileMenu'
import { useSelector } from 'react-redux'
// import { T } from 'locales'
import { useRouter } from 'next/router'
import SearchInput from '../SearchInput'
const shadow = '0 2px 4px 0 rgba(0, 0, 0, 0.2)'

const TopHeader = (props) => {
  const router = useRouter()
  const cart = useSelector(state => state.cart)
  const notification = useSelector(state => state.notification)
  const { isNeedCheck = false } = notification || {}
  const [showSearchBar, setShowSearchBar] = useState(true)
  const [showToolBar, setShowToolBar] = useState(true)
  const [responMobile, setResponMobile] = useState()
  const [isOpen, setIsOpen] = useState(false)
  const [background, setBackground] = useState('unset')
  const [boxShadow, setboxShadow] = useState('none')
  const [opacity, setOpacity] = useState(0)
  const [title, setTitle] = useState('')
  const _config = useSelector(state => state.config)
  const theme = _config['site/theme']
  const wrapperRef = useRef(null)
  const urlIcon = _config['site/small_logo_url'] || '/static/images/logo_white.png'
  let freeShippingText = _config['site/header/freeShippingText']
  const downloadAppURL = _config['app/download_app_url']
  const appLogo = _config['site/logo_app']
  const [isClose, setIsClose] = useState(false)
  const [position, setPosition] = useState('relative')
  const [display, setDisplay] = useState('unset')
  useEffect(() => {
    window.addEventListener('scroll', handleScroll)
    handleScroll()
    return () => window.removeEventListener('scroll', handleScroll)
  }, [background, boxShadow, opacity
  ])
  useEffect(() => {
    const titleElement = document.getElementById('product-title')
    if (titleElement && titleElement.innerText) setTitle(titleElement.innerText)

    return () => setTitle('')
  }, [])

  const handleScroll = () => {
    const scroll = window.scrollY || document.body.scrollTop
    const responDistance = scroll >= 145
    if (responMobile !== responDistance) setResponMobile(responDistance)
    
    // if (!props.mainRef.current) return
    // const top = props.mainRef.current.getBoundingClientRect().top
    if (-top > 385) {
      if (background === 'unset' && boxShadow === 'none' && opacity === 0) {
        setBackground('white')
        setboxShadow(shadow)
        setOpacity(1)
      }
    } else if (-top <= 385 && background === 'white' && boxShadow === shadow) {
      setBackground('unset')
      setboxShadow('none')
      setOpacity(0)
    }
      if (!isClose) {
      if (scroll > 60) {
        setPosition('fixed')
        setDisplay('none')
      } else if (scroll < 60) {
        setPosition('relative')
        setDisplay('unset')
      }
    }
  }
  const handleClose = () => {
    setIsClose(true)
    setDisplay('none')
    setPosition('fixed')
  }
  const toggleSearchBar = () => {
    setShowSearchBar(!showSearchBar)
  }

  return (
    <>
     {
       !isClose && <div style={{ display }} className='download-app-banner text-right'>
       <div>
         <div className='container head-app-download'>
           <div className='head-app-download-left'>
             <img className='head-app-download-logo' src={appLogo} alt=''/>
           </div>
           <div className='head-app-download-center'>
             <p>Download app</p>
             <p className='coupon-content'>{freeShippingText}</p>
           </div>
           <div className='head-app-download-right'>
               <a href={downloadAppURL} className='btn btnShopNow'>Open</a>
           </div>                      
         </div>
       </div>
     </div>
     }
      <div className={`header-wrap-content-res ${props.pageName} ${!showToolBar ? 'unShowToolBar' : ''}`} ref={wrapperRef} style={{
        background: `${props.pageName === 'productPage' ? background : ''}`,
        boxShadow: `${props.pageName === 'productPage' ? boxShadow : ''}`,
        position
      }}
      >
        <div className='flex-box'>
          <MobileMenu onShowToolBarClick={setShowToolBar} showToolBar={showToolBar} hideScrollAllCategory={props.hideScrollAllCategory} />
          <div className='iconHeaderHome'>
            <a onClick={() => router.back()}><Icon.ArrowLeftOutlined /></a>
          </div>
          <div className='header-product-title' ref={wrapperRef} style={{ opacity: `${props.pageName === 'productPage' ? opacity : ''}` }}>
            <span>{title}</span>
          </div>
          <div className='logo'>
            <Link href='/'>
              <a>
                <img src={urlIcon} alt='' />
              </a>
            </Link>
          </div>
          <div className={`searchInputMobile`}>
            <div id='searchBarBox' className='col2 searchBarBox'>
              <div className='searchShowBtn' onClick={toggleSearchBar}><Icon.SearchOutlined /></div>
              <div className={'searchBar' + (showSearchBar ? ' show' : '')}>
                <SearchInput q={props.q} />
              </div>
            </div>
          </div>
          <div className='icon'>
            <Link href='/cart'>
              <a>
                <div className={`countNumber ${theme}`}>
                  {
                    cart && cart.items_count && cart.items_count > 0
                      ? <span>{cart.items_count}</span> : ''
                  }
                </div>
                <Icon.ShoppingCartOutlined />
              </a>
            </Link>
          </div>
          <div className='mobileAccount'>
            <Link href='/customer'>
              <a className='myAccountLink'>
                {
                  isNeedCheck && <span className='notification-dot' />
                }
                <Icon.UserOutlined />
              </a>
            </Link>
          </div>
          <div className='dropdownIcon'>
            <Modal
              title={null}
              visible={isOpen}
              onCancel={() => setIsOpen(false)}
              footer={null}
              className='modalTopHeader'
              closable={false}
            >
              <p><a href='/customer'><Icon.UserOutlined style={{ marginRight: 10 }} />My Account</a></p>
              <p><a href='/customer/orders'><Icon.FileTextOutlined style={{ marginRight: 10 }} />My Order</a></p>
              <p><a href='/'><Icon.HomeOutlined style={{ marginRight: 10 }} />Home</a></p>
              <p><a href='/page/help-center'><Icon.QuestionCircleOutlined style={{ marginRight: 10 }} />Help Center</a></p>
            </Modal>
            <div >
              <a className='ant-dropdown-link' onClick={e => setIsOpen(true)}>
                <Icon.EllipsisOutlined />
              </a>
            </div>
          </div>
        </div>
      </div>
    </>

  )

}

export default TopHeader
