import React from 'react'
import Skeleton from '@material-ui/lab/Skeleton'

const OrderLoading = () => {
  return (
    <div className='content-body'>
      <div className='content-box'>
        <div className='box-header'>
          <Skeleton variant='text' width={400} />
        </div>
        <div className='content-body'>
          <div className='order-item'>
            <div
              className='column column-item-thumbnail'
              style={{
                paddingLeft: '30px'
              }}
            >
              <Skeleton variant='rect' width={120} height={150} />
            </div>
            <div className='column-item-name'>
              <Skeleton variant='text' width={600} />
              <Skeleton variant='text' width={600} />
              <Skeleton variant='text' width={600} />
            </div>
            <div className='column coloumn-qty'>
              <Skeleton variant='text' width={50} />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default OrderLoading
