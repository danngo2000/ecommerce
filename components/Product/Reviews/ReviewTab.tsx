import React, { useState } from 'react'
import { Tabs } from 'antd';
import Router from 'next/router'
import UserReviews from './UserReviews'

const { TabPane } = Tabs;

const ReviewTab = (props) => {
  const { reviewPage, setImageClicked, reviews, product, productId, reviewStar, reviewType, isLoading, setLoading } = props
  const [type, setType] = useState(reviewType)
  const ReviewStatus = {
    'all': ['All', reviews?.countAll],
    'photo': ['Photo', reviews?.countPhoto],
    'video': ['Video', reviews?.countVideo],
  }

  const handleTabClick = (key: string) => {
    setType(key)
    setLoading()
    Router.push(`/product?slug=${product.slug}&reviewStar=${reviewStar}&reviewType=${key}`, `/p/${product.slug}?reviewStar=${reviewStar}&reviewType=${key}`)
  }

  return (
    <Tabs animated={false} defaultActiveKey='all' className='review-fliter col-md-12 col-sm-12 col-xs-12' onTabClick={handleTabClick} activeKey={type || 'all'}>
      {
        Object.entries(ReviewStatus).map(([key, [name, total]]) => {
          return (
            <TabPane key={key} tab={`${name} (${total})`} >
              <div className='col-md-12 col-sm-12 col-xs-12'>
                <UserReviews isLoading={isLoading} reviewPage={reviewPage} setImageClicked={setImageClicked} product={product}
                   productId={productId} reviewStar={reviewStar} reviewType={reviewType} keyTab={key} reviews={reviews} count={total}/>
              </div>
            </TabPane>
          )
        })
      }
    </Tabs>
  )
}
export default ReviewTab