import React, { useEffect, useState, FC } from 'react'
import Header from './TheHeader/index2'
import TopHeader from './TheHeader/ResponsiveHeader/TopHeader'
import LoginDialog from './Customer/LoginDialog'
import { useSelector } from 'react-redux'
import GoTopButton from 'components/GoTopButton'
import Footer from './Footer'
import Breadcrumb from './Breadcrumb'
interface TypeProps {
  children: any
  pageName: string
  breadcrumb?: any
}

const Layout: FC<TypeProps> = ({ children, pageName, breadcrumb }: any) => {
  const [hideScrollAllCategory, setHideScrollAllCategory] = useState(false)
  const mainRef = React.createRef<any>()
  const config = useSelector((state: any) => state.config)
  const props = useSelector((state: any) => state)

  useEffect(() => {
    mainRef.current.dataset.scroll = 0
    if (pageName === 'homePage') {
      window.addEventListener('scroll', handleScroll, { passive: true })
    }
  }, [])

  const handleScroll = () => {
    if (mainRef.current) {
      mainRef.current.dataset.scroll = window.scrollY
    }
  }

  const handleHideScrollAllCategory = () => {
    setHideScrollAllCategory(!hideScrollAllCategory)
  }
  const theme = config['site/theme']

  return (
    <div
      ref={mainRef}
      className={
        'mainLayout ' +
        theme +
        ' ' +
        pageName +
        ` ${hideScrollAllCategory ? 'hideScroll' : ''}`
      }
    >
      <TopHeader
        mainRef={mainRef}
        hideScrollAllCategory={handleHideScrollAllCategory}
      />
      <Header />
      <GoTopButton />
      <LoginDialog />
      <Breadcrumb breadcrumb={breadcrumb} />
      <div className='main-content'>{children}</div>
      <div style={{ clear: 'both' }} />
      <Footer pageName={pageName} />
    </div>
  )
}

export default Layout
