import React, { useState, memo } from 'react'
// import Menu from '../../Category/AllCategories'

const MobileMenu = memo(({ categories, onShowToolBarClick, showToolBar, hideScrollAllCategory}) => {
  const [isOpen, toggle] = useState(false)
  return <>
    <div className='mm-button' onClick={() => { toggle(!isOpen); onShowToolBarClick(!showToolBar); hideScrollAllCategory()}}>
      <div className={`ham${isOpen ? ' open' : ''}`} />
    </div>
    <div className={`mobile-menu${isOpen ? ' open' : ''}`}>
      {/* <Menu onCategoryClick={() => toggle(false)} /> */}
    </div>
  </>
})

export default MobileMenu
