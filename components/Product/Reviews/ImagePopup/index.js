import React, { useState, useRef } from 'react'
import { Modal } from 'antd'
import Images from './Images'
import Rating from 'react-rating'
import Moment from 'react-moment'
import { useSelector } from 'react-redux'
import { RightOutlined, LeftOutlined } from '@ant-design/icons'
const emptyStarColor = '#eff0f5'
const fullStarColor = '#faca51'

function getUserName(review) {
  let name = ''
  if (review.user && review.user.name) name = review.user.name
  if (review.customer) {
    name = review.customer.first_name ? review.customer.first_name : ''
    name += review.customer.last_name ? review.customer.last_name : ''
  }
  name = name.trim()
  if (!name) name = 'Guest'
  return t(name)
}
const ImagePopup = React.memo((props) => {
  const { image, onClose, product } = props
  const [currentIndex, setCurrentIndex] = useState((image && image.index) || 0)
  const _config = useSelector((state) => state.config)
  const theme = _config['site/theme']
  const sliderRef = useRef(null)
  const imgClick = (index) => {
    setCurrentIndex(index)
  }
  const goToNext = () => {
    let length = image.review.images.length
    if (currentIndex + 1 === length) {
      setCurrentIndex(0)
    } else {
      setCurrentIndex(currentIndex + 1)
    }
  }
  const goToPrev = () => {
    let length = image.review.images.length
    if (currentIndex - 1 < 0) {
      setCurrentIndex(length - 1)
    } else {
      setCurrentIndex(currentIndex - 1)
    }
  }
  const goToStart = () => {
    if (image.review.images[currentIndex].type.indexOf('video') >= 0) {
      if (
        document.getElementById(image.review.images[currentIndex]._id)
          .currentTime == 5
      ) {
        document.getElementById(
          image.review.images[currentIndex]._id
        ).currentTime = 0
      }
    }
  }
  return (
    <Modal
      canOutsideClickClose
      usePortal
      title={product ? product.name : ''}
      onCancel={onClose}
      visible={!!image}
      className='imgDialog'
      width='70%'
      portalClassName='portalImgDialog'
    >
      <div className='bp3-dialog-body'>
        {image && (
          <div className='row dialogRow'>
            <div className='col-md-9 col-sm-12 imgLightBox'>
              <div className='sliderContainer'>
                {image.review.images[currentIndex].type.indexOf('video') < 0 ? (
                  <img src={image.review.images[currentIndex].url} alt='' />
                ) : (
                  <video
                    id={image.review.images[currentIndex]._id}
                    controls
                    autoPlay
                    className='video-popup'
                    src={`${image.review.images[currentIndex].url}`}
                    onClick={goToStart}
                  />
                )}
                {image.review.images.length > 1 && (
                  <>
                    <LeftOutlined className='iconPrev' onClick={goToPrev} />
                    <RightOutlined className='iconNext' onClick={goToNext} />
                  </>
                )}
              </div>
            </div>
            <div className='col-md-3 col-sm-12 reviewBox'>
              <div className='rating'>
                <Rating
                  emptySymbol={
                    <div className='ratingIcon' fill={emptyStarColor} />
                  }
                  fullSymbol={
                    <div className='ratingIcon' fill={fullStarColor} />
                  }
                  initialRating={image.review.rating}
                  readonly
                />
              </div>
              <div className='title'>{image.review.title}</div>
              {theme === 'pink-theme' ? (
                <div className='userAndTime'>
                  By
                  {getUserName(image.review)}, &nbsp;
                  <Moment locale='vi' fromNow>
                    {image.review.created_at}
                  </Moment>
                </div>
              ) : (
                <div className='userAndTime'>
                  By
                  {getUserName(image.review)}, &nbsp;
                  <Moment fromNow>{image.review.created_at}</Moment>
                </div>
              )}
              <p className='content'>{image.review.content}</p>
              <div>Images in this review</div>
              <Images
                index={currentIndex}
                images={image.review.images}
                onClick={imgClick}
              />
            </div>
          </div>
        )}
      </div>
    </Modal>
  )
})
export default ImagePopup
