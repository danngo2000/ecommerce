import React from 'react'

const FeaturedBanners = () => {
  return (
    <div className='featured-banners'>
      <div className='container'>
        <div
          className='banner'
          style={{ backgroundImage: 'url("/mini-banner-1.jpg")' }}
        >
          <div className='title-banner'>
            <div className='title'>Clearance</div>
            <div className='description'>Up to 50% Off</div>
            <button
              type='button'
              className='bp3-button bp3-minimal button'
            ></button>
          </div>
        </div>
        <div
          className='banner'
          style={{ backgroundImage: 'url("/mini-banner-2.jpg")' }}
        >
          <div className='title-banner'>
            <div className='title'>Customer Gallery</div>
            <div className='description'>Be Inspired</div>
          </div>
        </div>
        <div
          className='banner'
          style={{ backgroundImage: 'url("/mini-banner-3.jpg")' }}
        >
          <div className='title-banner'>
            <div className='title'>Trade Discount</div>
            <div className='description'>Exclusive for trade customers</div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default FeaturedBanners
