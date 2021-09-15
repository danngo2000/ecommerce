import React from 'react'

const BadgeBox = ({ data }) => {
  return (
    <div className='featured-banners'>
      <div className='container'>
        <div className='header'>
          <h3>{data.title}</h3>
        </div>
        <div className='content'>
          {data.images.map((img, index) => (
            <div key={index} className='itemBox'>
              <img src={img.imgUrl} />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default BadgeBox
