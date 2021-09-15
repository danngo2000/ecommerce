import React, { Fragment } from 'react'
import ReviewForm from './ReviewForm'
import { useSelector } from 'react-redux'

const WriteReview = (props) => {
  const { customer } = useSelector((state: any) => state)
  const { isGuest } = useSelector((state: any) => state.auth)
  return (
    <div className='col-md-10 col-xs-12 writeReview'>
      {!isGuest && (
        <Fragment>
          <h3>Write a Review</h3>
          <div className='col-md-12'>
            <p style={{ fontSize: '12px' }}>
              <span className='required'>*</span> Required question
            </p>
            <ReviewForm productId={props.productId} customer={customer} />
          </div>
        </Fragment>
      )}
    </div>
  )
}

export default WriteReview
