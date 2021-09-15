import React from 'react'
import Rating from 'react-rating'
import Moment from 'react-moment'
import 'moment-timezone'
import Pagination from 'rc-pagination'
import { animateScroll as scroll } from 'react-scroll'
import { HomeOutlined, PlayCircleOutlined } from '@ant-design/icons';
import LikeArea from './LikeArea'
import config from 'settings'
import Router from 'next/router'
import { connect, useSelector } from 'react-redux'
import ReviewContent from './ReviewContent'
import axios from 'axios'
import { Skeleton } from 'antd'

const RenderUserInfo = React.memo(props => {
  const { review } = props
  let avatar = '/static/images/default_user.png'
  if (review?.user?.avatar) avatar = review.user.avatar
  if (review?.customer?.avatar) avatar = review.customer.avatar
  return (
    <div className='userInfo col-md-2'>
      {
        review.customer ? (
          <>
          <img className='img' src={avatar} />
          <div className='username'>{review.customer.first_name} {review.customer.last_name}</div>
          </>
        ) : (
            <>
              {
                review.user && (
                  <>
                    <img className='img' src={avatar} />
                    <div className='username'>{review.user.name}</div>
                  </>
                )
              }
            </>
          )
      }
    </div>
  )
})
const RenderDefaultUserReviews = React.memo(props => {
  const emptyStarColor = '#eff0f5'
  const fullStarColor = '#faca51'
  const { customerReviews, handleImgClick, userLikedReview } = props
  const _config = useSelector(state => state.config)
  const theme = _config['site/theme']
  return (
    <>
      {customerReviews.map((item, index) => {
        return (
          <div className='reviewRow row' key={index}>
            <div className='Row-id'>{item._id}</div>
            <RenderUserInfo review={item} />
            <div className='col-md-9'>
              <div className='item-review-title'>
                <div className='customerInfo'>
                  <div className='rating'>
                    <Rating
                      emptySymbol={<div className='ratingIcon emptyStarIcon' fill={emptyStarColor} />}
                      fullSymbol={<div className='ratingIcon' fill={fullStarColor} />}
                      initialRating={item.rating}
                      readonly
                    />
                  </div>

                </div>
                {item.title && <div className='reviewTitle'>{item.title}</div>}
                <div className='bought-wrapper'>
                  {
                    item.customer_bought && <span className='bought'><img src='/static/images/svg/check-circle.svg' />Verified Purchase</span>
                  }
                </div>
              </div>
              <ReviewContent content={item.content} />
              <div style={{display: 'flex'}} className='reviewImages'>
                {item.images.map((media, i) => {
                  let videoType = String(media.type).indexOf('video')
                  if (videoType !== 0) {
                    return <img className='image-review' src={media.url} key={i} onClick={() => handleImgClick(item, i)} />
                  } else return <div className='video-review-content'>
                    <PlayCircleOutlined />
                    <video className='video-review'  src={`${media.url}#t=5`} onClick={() => handleImgClick(item, i)}></video>
                    </div> 
                } )}
              </div>
              
              <div className='review-time'>
                {theme === 'pink-theme' ? (
                  <Moment locale='vi' locale='vi' format=' dddd, L'>{item.created_at}</Moment>
                ) : (
                    <Moment format='DD MMM YYYY'>{item.created_at}</Moment>
                  )}
              </div>
            </div>
            <LikeArea review={item} userLikedReview={userLikedReview} customerReviews={customerReviews} />

            {
              item.replies && item.replies.map((i, index) => {
                return (
                  <div key={index} className="replies-review">
                    <div className="replies-content">
                      <div className="title">
                        <HomeOutlined twoToneColor="#eb2f96" />
                        <span><T>Feedback from the seller</T></span> - {theme === 'pink-theme' ? (
                          <Moment locale='vi' fromNow>{i.created_at}</Moment>)
                          : (<Moment fromNow>{i.created_at}</Moment>)}
                      </div>
                      <div className="content">
                        <p>{i.content}</p>
                      </div>
                    </div>
                  </div>
                )
              })
            }
          </div>
        )
      })}
    </>
  )
})

const RenderFoodUserReviews = React.memo(props => {
  const emptyStarColor = '#eff0f5'
  const fullStarColor = '#faca51'
  const { customerReviews, handleImgClick } = props
  const _config = useSelector(state => state.config)
  const theme = _config['site/theme']
  return (
    <>
      {customerReviews.map((item, index) => {
        return (
          <div className='reviewRow row' key={index}>
            <div className='col-md-2 col-sm-2 col-xs-2'>
              <div className='customerInfo'>
                <div className='bought-wrapper'>
                  <RenderUserInfo review={item} />
                </div>
              </div>
            </div>
            <div className='col-md-10 col-sm-10 col-xs-10'>
              <div className='customerRating'>
                <div className='rating'>
                  <Rating
                    emptySymbol={<div className='ratingIcon emptyStarIcon' fill={emptyStarColor} />}
                    fullSymbol={<div className='ratingIcon' fill={fullStarColor} />}
                    initialRating={item.rating}
                    readonly
                  />
                </div>
                {theme === 'pink-theme' ? (
                  <Moment locale='vi' format='HH:mm dddd, L'>{item.created_at}</Moment>
                ) : (
                    <Moment format='DD MMM YYYY HH:mm:ss'>{item.created_at}</Moment>
                  )}
                {console.log(item.created_at)}
                <div className='bought-wrapper'>
                  {
                    item.customer_bought && (
                      <span className='bought'><img src='/static/images/svg/check-circle.svg' />{t('Verified Purchase')}</span>
                    )
                  }
                </div>
              </div>
              {item.title && <p className='reviewTitle'>{item.title}</p>}
              <ReviewContent content={item.content} />
              <div className='reviewImages'>
                {item.images.map((img, i) => (
                  <img src={img.url} key={i} onClick={() => handleImgClick(item, i)} />
                ))}
              </div>
              <LikeArea review={item} />
            </div>
          </div>
        )
      })}
    </>
  )
})

const ReviewsContent = React.memo((props) => {
  const { customerReviews, limit, count, page, handlePageChange, handleImgClick, userLikedReview } = props
  return (
    <div className='productReviews row'>
      <div className='col-md-12 col-sm-12 col-xs-12'>
        {
          config.siteName === 'imex-food' ? (
            <RenderFoodUserReviews customerReviews={customerReviews} handleImgClick={handleImgClick} userLikedReview={userLikedReview} />
          ) : (
              <RenderDefaultUserReviews customerReviews={customerReviews} handleImgClick={handleImgClick} userLikedReview={userLikedReview} />
            )
        }
        <div className='row review-footer'>
          <div className='col-md-6 review-footer-content'>
            {customerReviews.length > 0 && <span className='review-per-page'>{t('Display Reviews')} <strong>{customerReviews.length < limit ? customerReviews.length : limit * page} - {count}</strong></span>}
            <a className='back-to-top' href='' onClick={(e) => {
              e.preventDefault()
              scroll.scrollToTop()
            }}>Back to top</a>
          </div>
          <div className='col-md-6 review-footer-pagination'>
            {
              limit < count && (
                <div className='paginationContainer'>
                  <Pagination
                    onChange={page => handlePageChange(page)}
                    current={page}
                    total={count}
                    pageSize={limit}
                    showLessItems
                    showTitle={false}
                  />
                </div>
              )
            }
          </div>
        </div>
      </div>
    </div>
  )
})

class UserReviews extends React.PureComponent {
  constructor(props) {
    super(props)
    let page = 1
    let limit = 10
    try {
      page = parseInt(this.props.reviewPage)
    } catch (e) {
      console.log(e)
    }
    if (isNaN(page)) page = 1
    this.state = {
      limit,
      count: 0,
      customerReviews: [],
      page,
      isLoadUserLikedReview: false,
      userLikedReview: {}
    }
  }
  async componentDidMount() {
    const { isLoadUserLikedReview, userLikedReview } = this.state
    // reviewBythis.handleLoadUserLikedReview()
    if (!this.props.isGuest && !isLoadUserLikedReview) {
      this.handleLoadUserLikedReview()
    }
  }

  handlePageChange = async (page) => {
    const { product: { slug }, reviewStar, reviewType } = this.props
    let params = `reviewPage=${page}`
    if (reviewStar) {
      params += `&reviewStar=${reviewStar}`
    }
    if (reviewType) {
      params += `&reviewType=${reviewType}`
    }
    Router.push(`/product?slug=${slug}&${params}`, `/p/${slug}?${params}`)
    this.setState({ page })
    let reviewBy = document.getElementById('reviewBy')
    if (reviewBy) reviewBy.scrollIntoView({ block: 'start', behavior: 'smooth' })
  }

  static getDerivedStateFromProps(props, state) {
    const { limit, count, customerReviews } = state
    const { userLikedReview, isLoadUserLikedReview } = state
    if (isLoadUserLikedReview) {
      for (let review of customerReviews) {
        review.liked = userLikedReview[review._id]
        if (!review.helpful) {
          review.helpful = 0
        }
      }
    }
    let page = parseInt(props.reviewPage)
    if (!page || page < 1) page = 1
    return {
      limit,
      count,
      customerReviews: [...customerReviews],
      page
    }
  }

  handleImgClick = (review, index) => {
    this.props.setImageClicked({ review, index })
  }

  handleLoadUserLikedReview = async () => {
    const { data } = await axios.post(`customer-reviews/liked`, {
      reviewIds: this.state.customerReviews.map(i => i._id)
    })
    this.setState({ isLoadUserLikedReview: true, userLikedReview: data })
  }

  render() {
    const { limit, page, userLikedReview } = this.state

    return (
      this.props.isLoading ? <Skeleton /> :
      <ReviewsContent
        limit={limit}
        count={this.props.count}
        customerReviews={this.props.reviews.customerReviews}
        page={page}
        userLikedReview={userLikedReview}
        handlePageChange={page => this.handlePageChange(page, this.props.product._id)}
        handleImgClick={this.handleImgClick} />
    )
  }
}

const mapState = (state) => ({
  isGuest: state.auth.isGuest
})

export { ReviewsContent }
export default connect(mapState)(UserReviews)
