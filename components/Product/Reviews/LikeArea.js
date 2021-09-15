import React from 'react'
import axios from 'axios'
import { toggleLoginDialog } from '../../../actions/ui'
import { connect } from 'react-redux'
import * as Icon from '@ant-design/icons'

class LikeArea extends React.PureComponent {
  constructor(props) {
    super(props)
    this.state = {
      review: props.review,
      isLoading: false,
      userLikedReview: {}
    }
  }

  async componentDidMount() {
    if (!this.props.isGuest) this.handleLoadUserLikedReview()
  }
  handleLoadUserLikedReview = async () => {
    const { data } = await axios.post(`customer-reviews/liked`, {
      reviewIds: this.props.customerReviews.map((i) => i._id)
    })
    for (let review of this.props.customerReviews) {
      review.liked = data[review._id]
    }
    this.setState({ userLikedReview: data })
  }

  // eslint-disable-next-line camelcase
  UNSAFE_componentWillReceiveProps(nextProps) {
    this.setState({
      review: nextProps.review
    })
  }

  handleLike = async (e, id) => {
    e.preventDefault()

    if (this.props.isGuest) {
      this.props.toggleLoginDialog(true)
    } else {
      try {
        this.setState({ isLoading: true })
        const { data } = await axios.post(`customer-reviews/like/${id}`)
        const { review } = this.state
        if (data.action === 'like') {
          review.helpful += 1
          review.liked = true
        } else {
          review.helpful -= 1
          review.liked = false
        }
        this.setState({ isLoading: false, review })
      } catch (e) {
        console.log(e)
        this.setState({ isLoading: false })
      }
    }
  }

  render() {
    const { review, isLoading } = this.state
    if (!review.helpful) review.helpful = 0
    let helpful = parseInt(review.helpful)
    if (isNaN(helpful)) helpful = 0
    return (
      <div className='like-area'>
        {isLoading ? (
          <img src='/static/images/svg/spinner.svg' className='icon-spin' />
        ) : (
          <a href='#' onClick={(e) => this.handleLike(e, review._id)}>
            <div>
              <img
                src={
                  !review.liked
                    ? '/static/images/svg/thumbs-up.svg'
                    : '/static/images/svg/liked.svg'
                }
                className={
                  review.liked ? 'likeReviewBtn liked' : 'likeReviewBtn'
                }
              />
            </div>
          </a>
        )}
        <span className='helpful' style={{ display: 'none' }}>
          Helpful
        </span>
        <span className='count-like'> Yes({review.helpful || 0})</span>
      </div>
    )
  }
}

const mapState = (state) => ({
  isGuest: state.auth.isGuest,
  customer: state.customer
})

export default connect(mapState, { toggleLoginDialog })(LikeArea)
