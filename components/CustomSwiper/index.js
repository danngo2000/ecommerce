import React, { useEffect, useRef, useState } from 'react'
import Swiper from 'swiper'
import classNames from 'classnames'

const SwiperNav = React.forwardRef(
  ({ arrowIcon: Arrow, displayArrow = true }, ref) => {
    if (Arrow) {
      return (
        <>
          <Arrow
            className={`swiper-button-prev ${
              displayArrow ? 'display-arrow' : 'hide-arrow'
            }`}
            ref={ref.prev}
            rotate={180}
          />
          <Arrow
            className={`swiper-button-next ${
              displayArrow ? 'display-arrow' : 'hide-arrow'
            }`}
            ref={ref.next}
          />
        </>
      )
    }
    return (
      <>
        <div className='swiper-button-prev' ref={ref.prev} />
        <div className='swiper-button-next' ref={ref.next} />
      </>
    )
  }
)
SwiperNav.displayName = 'SwiperNav'

const SwiperPagination = React.forwardRef((props, ref) => {
  return <div className='swiper-pagination' ref={ref} />
})
SwiperPagination.displayName = 'SwiperPagination'

const SwiperWrapper = ({ children }) => {
  return (
    <div className='swiper-wrapper'>
      {React.Children.map(children, (child, index) => (
        <div className='swiper-slide swiper-lazy' key={index}>
          {child}
        </div>
      ))}
    </div>
  )
}
SwiperWrapper.displayName = 'SwiperWrapper'

const SwiperContainer = React.memo((props) => {
  const {
    children: propsChildren,
    options,
    className,
    containerClassName,
    paginationProps = {},
    navigationProps = {}
  } = props
  const swiperRef = useRef(null)
  const swipeNextRef = useRef(null)
  const swipePrevRef = useRef(null)
  const paginationRef = useRef(null)

  const [isReady, setReady] = useState(false)

  useEffect(() => {
    const swiper = new Swiper(swiperRef.current, {
      ...options,
      navigation: {
        nextEl: swipeNextRef.current,
        prevEl: swipePrevRef.current,
        ...navigationProps
      },
      pagination: {
        el: paginationRef.current,
        type: 'bullets',
        clickable: true,
        ...paginationProps
      },
      init: false
    })
    swiper.on('init', () => setReady(true))
    swiper.init()
  }, [])

  const children = React.Children.toArray(propsChildren)
  const wrapper = children.find(
    (child) => child.type.displayName === 'SwiperWrapper'
  )
  const nav = children.find((child) => child.type.displayName === 'SwiperNav')
  const pagination = children.find(
    (child) => child.type.displayName === 'SwiperPagination'
  )

  let modifiedNav
  if (nav) {
    modifiedNav = React.cloneElement(nav, {
      ref: {
        next: swipeNextRef,
        prev: swipePrevRef
      }
    })
  }

  let modifiedPagination
  if (pagination) {
    modifiedPagination = React.cloneElement(pagination, {
      ref: paginationRef
    })
  }

  return (
    <div
      className={className}
      style={{
        position: 'relative',
        height: isReady ? 'inherit' : 0,
        overflow: isReady ? 'unset' : 'hidden'
      }}
    >
      <div
        className={classNames('swiper-container', containerClassName)}
        ref={swiperRef}
      >
        {wrapper}
        {modifiedPagination}
      </div>
      {modifiedNav}
    </div>
  )
})

SwiperContainer.Wrapper = SwiperWrapper
SwiperContainer.Nav = SwiperNav
SwiperContainer.Pagination = SwiperPagination

export { SwiperNav, SwiperWrapper, SwiperPagination }
export default SwiperContainer
