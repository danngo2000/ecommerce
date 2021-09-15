import React from 'react'
import { PlayCircleOutlined } from '@ant-design/icons'

const Images = React.memo((props) => {
  const { images, index, onClick } = props
  return (
    Array.isArray(images) && (
      <div className='images'>
        {images.map((img, i) => {
          let videoType = String(img.type).indexOf('video')
          if (videoType !== 0) {
            return (
              <img
                src={img.url}
                key={i}
                onClick={() => onClick(i)}
                className={`img ${i === index ? 'current' : ''}`}
              />
            )
          } else
            return (
              <div className='video-small-content'>
                <PlayCircleOutlined />
                <video
                  frameBorder='0'
                  data-radium='true'
                  src={`${img.url}#t=5`}
                  className={`popup-video-small img ${
                    i === index ? 'current' : ''
                  }`}
                  onClick={() => onClick(i)}
                  key={i}
                ></video>
              </div>
            )
        })}
      </div>
    )
  )
})
export default Images
