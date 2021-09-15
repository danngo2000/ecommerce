import React from "react"

const Banner = () => {
  return (
    <div className='banner text-right'>
      <div
        className='banner-wrap'
        style={{ backgroundImage: 'url("/banner.jpg")' }}
      >
        <div className='container'>
          <h2>Office Collection</h2>
          <p>
            Design your office with our durable chairs and sleek desk. Mesh
            office chairs 30% off for a limited time!
          </p>
          <a className='btn btn-shopnow'>Shop now</a>
        </div>
      </div>
    </div>
  )
}

export default Banner
