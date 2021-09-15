import React from 'react'
import WriteReview from './WriteReview'
import Rating from 'react-rating'
import Router from 'next/router'
import ImagePopup from './ImagePopup'
import { connect, useSelector } from 'react-redux'
import AllImagePopup from './AllImagePopup/index'
import Link from 'next/link'
import { toggleLoginDialog } from 'actions/ui'
import ReviewTab from './ReviewTab'
import { scroller } from 'react-scroll'

const RenderStats = React.memo((props) => {
  const {
    product,
    reviews,
    ratingStatisticsCount,
    getRatingCount,
    handleStarClick,
    activeProps
  } = props
  let emptyStarColor = '#eff0f5'
  let fullStarColor = '#faca51'
  const _config = useSelector((state) => state.config)
  const theme = _config['site/theme']
  return (
    <div className='col-md-7'>
      {
        <div className='row ratingStatistics'>
          <div className='average'>
            {product.rating.count == 0 ? (
              <h3 className='percent-zero'>{product.rating.count}</h3>
            ) : (
              <h3 className='percent'>{`${product.rating.avg.toFixed(1)}`}</h3>
            )}
            <div className='rating'>
              <Rating
                emptySymbol={
                  <div
                    className='ratingIcon emptyStarIcon'
                    fill={emptyStarColor}
                  />
                }
                fullSymbol={<div className='ratingIcon' fill={fullStarColor} />}
                initialRating={product.rating.avg}
                readonly
              />
            </div>
            {reviews?.count == 0 ? (
              ''
            ) : (
              <div className='count-avg'>{reviews.count} Reviews</div>
            )}
          </div>
          <div className='Reviews-star-percent'>
            {[5, 4, 3, 2, 1].map((i) => {
              let count = getRatingCount(i)
              let percent =
                (!count
                  ? '0'
                  : ((count / ratingStatisticsCount) * 100).toFixed(1)) + '%'
              return (
                <Link
                  key={i}
                  href={`/product?slug=${product.slug}&star=${i}`}
                  as={`/p/${product.slug}&star=${i}`}
                  replace
                >
                  <a key={i} href='#' onClick={(e) => handleStarClick(e, i)}>
                    <div
                      className={`counter ${activeProps === i ? 'active' : ''}`}
                    >
                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          marginRight: '0'
                        }}
                      >
                        <span
                          style={{
                            marginRight: '5px',
                            minWidth: '10px',
                            color: '#333'
                          }}
                        >
                          {i}
                        </span>
                        <span style={{ color: '#333' }}>Start</span>
                      </div>
                      <div className='progress-bar bp3-progress-bar bp3-intent-success bp3-no-stripes bp3-no-animation'>
                        <div
                          className='bp3-progress-meter'
                          style={{ width: percent }}
                        />
                      </div>
                      <div className='itemPercent'>{count}</div>
                    </div>
                  </a>
                </Link>
              )
            })}
          </div>
        </div>
      }
    </div>
  )
})

class ReviewsIndex extends React.PureComponent {
  constructor(props) {
    super(props)

    const { ratingStatistics = [] } = this.props
    let ratingStatisticsCount = 0

    if (ratingStatistics.length) {
      ratingStatistics.forEach((i) => {
        ratingStatisticsCount += i.count
      })
    }
    this.state = {
      isReview: false,
      ratingStatisticsCount,
      openAllImgDialog: false,
      userReviewsKey: Date.now(),
      selectedImage: null,
      active: null
    }
  }

  static getDerivedStateFromProps() {
    return { userReviewsKey: Date.now() }
  }

  getRatingCount = (key) => {
    const { ratingStatistics = [] } = this.props
    if (ratingStatistics.length) {
      for (let i = 0, l = ratingStatistics.length; i < l; i++) {
        if (ratingStatistics[i]._id === key) {
          return ratingStatistics[i].count
        }
      }
    }
    return 0
  }

  toggleReview = () => {
    this.setState((prevState, props) => {
      return { isReview: !prevState.isReview }
    })
  }

  renderStar = (list, type) => {
    let star = []
    for (let i = 0; i < list; i++) {
      star.push(<div key={i} className={`label ${type}`} />)
    }

    return star
  }

  handleStarClick = (event, star) => {
    event.preventDefault()
    const { product } = this.props
    Router.push(
      `/product?slug=${product.slug}&reviewStar=${star}&reviewType=${this.props.reviewType}`,
      `/p/${product.slug}?reviewStar=${star}&reviewType=${this.props.reviewType}`
    )
    this.setState({ active: star })
  }

  handleStarClose = (event, star) => {
    event.preventDefault()
    const { product } = this.props
    Router.push(
      `/product?slug=${product.slug}`,
      `/p/${product.slug}?reviewStar=${star}`
    )
  }

  handleImgClick = (data) => {
    this.handleImageClick(data)
  }

  handleCloseImgPopup = () => {
    this.handleImageClick(null)
  }

  handleSeeAllImg = (e) => {
    e.preventDefault()
    this.setState({ openAllImgDialog: true })
  }

  handleCloseAllImgPopup = () => {
    this.setState({ openAllImgDialog: false })
  }

  handleImageClick = (payload) => {
    if (payload) {
      const { review, index } = payload
      this.setState({ selectedImage: { review, index } })
    } else {
      this.setState({ selectedImage: null })
    }
  }

  scrollTo = (element, offset = 0) => {
    scroller.scrollTo(element, {
      duration: 800,
      delay: 0,
      smooth: 'easeInOutQuart',
      offset
    })
  }
  render() {
    const {
      product,
      reviews,
      reviewsHaveImages,
      toggleLoginDialog,
      isGuest,
      isLoading,
      setLoading
    } = this.props
    const { isReview, openAllImgDialog, selectedImage, active } = this.state
    return (
      <div name='productReviews' className='productReviews main-box'>
        <h2>Customer Reviews</h2>
        <div className='row reviewBtnWrapper'>
          <RenderStats
            product={product}
            reviews={reviews}
            ratingStatisticsCount={this.state.ratingStatisticsCount}
            getRatingCount={(i) => this.getRatingCount(i)}
            handleStarClick={this.handleStarClick}
            activeProps={active}
          />
          <div className='goods-reviews-entry'>
            <button
              className='btn-see-all'
              onClick={() => this.scrollTo('productReviews', 280)}
            >
              See all {reviews.count} reviews
            </button>
            {!isGuest ? (
              <div className=''>
                <button
                  className='btn-reverse'
                  onClick={() => this.toggleReview()}
                >
                  {isReview ? 'Close' : 'Write a Review'}
                </button>
              </div>
            ) : (
              <div className=''>
                <button
                  className='btn-reverse'
                  onClick={() => {
                    toggleLoginDialog(true)
                  }}
                >
                  Login to write review
                </button>
              </div>
            )}
          </div>
        </div>
        {isReview && <WriteReview productId={product._id} />}

        <div className='row'>
          <ReviewTab
            isLoading={isLoading}
            setLoading={setLoading}
            reviewPage={this.props.reviewPage}
            setImageClicked={this.handleImageClick}
            product={product}
            reviews={reviews}
            productId={product._id}
            reviewStar={this.props.reviewStar}
            reviewType={this.props.reviewType}
          />
        </div>
        {selectedImage && (
          <ImagePopup
            image={selectedImage}
            onClose={this.handleCloseImgPopup}
            product={product}
          />
        )}
        {openAllImgDialog && (
          <AllImagePopup
            product={product}
            isOpen={openAllImgDialog}
            setImageClicked={this.handleImageClick}
            onClose={this.handleCloseAllImgPopup}
            data={reviewsHaveImages}
          />
        )}
      </div>
    )
  }
}

const mapState = (state) => ({
  isGuest: state.auth.isGuest
})

export default connect(mapState, { toggleLoginDialog })(ReviewsIndex)
