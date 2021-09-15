import React from 'react'
import ImagesUpload from '../../ImagesUpload'
import { connect } from 'react-redux'
import axios from 'axios'
import { Rate, Input, Button, notification, Checkbox, Tooltip } from 'antd'
// import { publicKeysSelector } from 'store/config/config.selector'

const maxContentLength = 3000
const { TextArea } = Input
const ratingTexts = [
  'Not good. Not recommended',
  "There's something missing",
  'Average. Ordinary',
  'Good. Recommended',
  'Great! Highly recommended'
]

const defaultReview = {
  content: '',
  images: [],
  rating: 0,
  customer: {
    first_name: '',
    last_name: ''
  },
  tag: '',
  error: {}
}

class ReviewForm extends React.Component {
  constructor(props) {
    super(props)
    const { review = defaultReview } = props
    let yourName = ''
    if (review.customer && review.customer.first_name) {
      const {
        customer: { first_name = '', last_name = '' }
      } = review
      yourName = (first_name || '') + ' ' + (last_name || '')
    }
    this.state = {
      ratingText: '',
      errorText: '',
      message: '',
      yourName,
      ...review,
      tag: ''
    }
  }

  componentDidMount() {
    let { yourName } = this.state
    if (!yourName) {
      const { customer } = this.props
      if (!customer) return
      yourName = (customer.first_name || '') + ' ' + (customer.last_name || '')
      this.setState({ yourName })
    }
  }

  // imageUploadButtons = React.createRef()

  handleChangeRating = (rating) => {
    if (isNaN(rating)) return
    let ratingText = ratingTexts[+rating - 1] || ''
    this.setState({ ratingText, rating })
  }
  handleSubmit = async () => {
    const { rating, content, yourName, province, images, tag } = this.state
    // let images = this.imageUploadButtons.current.state.
    var error = {}

    if (rating === 0) {
      error.ratingEmpty = 'Please select the rating star'
    }
    if (content === '') {
      error.contentEmpty = 'Please enter content'
    }
    this.setState({
      error
    })
    if (Object.keys(error) && Object.keys(error).length === 0) {
      try {
        await axios.post('customer-reviews/customer', {
          rating,
          content,
          name,
          province,
          images: images && images.filter((i) => i._id && i.url && i.type),
          tag,
          product: this.props.productId,
          type: 'add'
        })
        this.setState({
          message: t(
            'Your review has been sent. It will be published after our approvement'
          ),
          images: [{ url: null, _id: null }]
        })

        if (this.props.onSuccess) {
          this.props.onSuccess()
        }
        this.props.fetchData && this.props.fetchData()
      } catch (e) {
        console.log(e)
        this.setState({
          message: 'An error has occurred, please try again '
        })
      }
    }
  }

  handleUpdate = async () => {
    const { content, rating, images } = this.state
    try {
      // let images = this.imageUploadButtons.current.state.images
      const {
        data: { customerReview, error }
      } = await axios.put(`customer-reviews/customer/${this.state._id}`, {
        ...this.state,
        images: images.filter((i) => i._id && i.url)
      })
      if (customerReview) {
        notification.info({ message: t('Saved') })
        this.props.setOpen(false)
        this.props.getData(1, true)
      }
      ;(customerReview.content = content),
        (customerReview.rating = rating),
        this.setState({
          customerReview,
          rating,
          content
        })
    } catch (e) {
      console.log(e)
    }
  }

  handleUnbox = () => {
    this.setState({
      tag: 'unbox'
    })
  }

  render() {
    const {
      ratingText,
      rating,
      content,
      message,
      province,
      yourName,
      errorText,
      error
    } = this.state
    const { isFetch, handleClose, setOpen } = this.props
    let emptyStarColor = '#eff0f5'
    let fullStarColor = '#faca51'
    const getYoutubeId = () => {
      const regExp =
        /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/
      return url.match(regExp) && url.match(regExp)[7].length === 11
        ? url.match(regExp)[7]
        : false
    }
    return (
      <div className='writeReviewForm row'>
        {message ? (
          <div className='col-md-12 message'>
            <p>{message}</p>
          </div>
        ) : (
          <React.Fragment>
            <div className='col-md-12 col-xs-12'>
              <div className='row rating-wrapper'>
                <div className='col-md-3 col-xs-12'>
                  Rating <span className='required'>*</span>
                </div>
                <div className='col-md-9 col-xs-12'>
                  <div className='rating'>
                    <Rate
                      emptySymbol={
                        <div
                          className='ratingIcon emptyStarIcon'
                          fill={emptyStarColor}
                        />
                      }
                      fullSymbol={
                        <div className='ratingIcon' fill={fullStarColor} />
                      }
                      onChange={this.handleChangeRating}
                      value={rating}
                      defaultValue={0}
                      className='star-ratingIcon'
                    />
                    {ratingText === '' ? (
                      <>
                        {rating === 0 ? (
                          <div className='ratingText warning-text'>
                            {Object.entries(error).length > 0
                              ? error.ratingEmpty
                              : ''}
                          </div>
                        ) : (
                          ''
                        )}
                      </>
                    ) : (
                      <div
                        className={`${
                          rating === 0 ? 'warning-text' : ''
                        } ratingText`}
                      >
                        {ratingText}
                      </div>
                    )}
                  </div>
                </div>
              </div>
              <div className='bp3-form-group modify'>
                <div className='row'>
                  <label
                    className='col-md-3 col-xs-12 bp3-label'
                    label='your-name'
                  >
                    Your name
                    <span className='bp3-text-muted required'>*</span>
                  </label>
                  <div className='col-md-9 col-xs-12 bp3-form-content'>
                    <span>{yourName}</span>
                  </div>
                </div>
              </div>
              <div className='bp3-form-group'>
                <div className='row'>
                  <label className='col-md-3 col-xs-12 bp3-label' label='title'>
                    Your review
                    <span className='bp3-text-muted required'>*</span>
                  </label>
                  <div className='col-md-9 col-xs-12 bp3-form-content'>
                    <div className='bp3-input-group'>
                      <TextArea
                        row={4}
                        className='bp3-input reviewContent'
                        dir='auto'
                        value={content !== 'undefined' ? content : ''}
                        onChange={(e) => {
                          let errorText = ''
                          if (e.target.value.length === 0) {
                            errorText = ''
                          } else if (e.target.value.length < 30) {
                            errorText = t(
                              'Content must be at least 30 characters'
                            )
                          } else if (e.target.value.length > 3000) {
                            errorText = 'Content is too long'
                          } else {
                            errorText = ''
                          }
                          if (rating === 0) {
                            this.setState({
                              content: e.target.value,
                              ratingText: 'Please select the rating star',
                              errorText
                            })
                          } else {
                            this.setState({
                              content: e.target.value,
                              errorText
                            })
                          }
                        }}
                      />
                      <p className='required'>
                        {errorText}{' '}
                        {content === '' ? (
                          <>
                            {Object.entries(error).length > 0
                              ? error.contentEmpty
                              : ''}
                          </>
                        ) : (
                          ''
                        )}
                      </p>
                    </div>
                    <div className='unboxCheckbox'>
                      <Tooltip
                        title={t(
                          'By checked this your review will be considered as an unbox review'
                        )}
                      >
                        <Checkbox onChange={this.handleUnbox}>Unbox</Checkbox>
                      </Tooltip>
                    </div>
                    <div className='imageBtnGroup' style={{ display: 'flex' }}>
                      <ImagesUpload
                        images={this.state.images}
                        handleValueChange={(images) =>
                          this.setState({ images })
                        }
                      />
                    </div>

                    {this.props.editReview ? (
                      <>
                        <Button className='editBtn' onClick={this.handleUpdate}>
                          Edit Review
                        </Button>
                        <Button
                          className='btn-back-review'
                          key='back'
                          onClick={
                            isFetch && isFetch === true
                              ? handleClose
                              : () => {
                                  setOpen(false)
                                }
                          }
                        >
                          Back
                        </Button>
                      </>
                    ) : (
                      <Button
                        disabled={
                          !rating ||
                          !content ||
                          !yourName ||
                          content.length > maxContentLength ||
                          errorText !== ''
                        }
                        className='btn sendBtn'
                        onClick={() => {
                          if (
                            window.grecaptcha &&
                            this.props.publicKeys.recaptcha
                          ) {
                            window.grecaptcha.ready(() => {
                              window.grecaptcha
                                .execute(this.props.publicKeys.recaptcha, {
                                  action: 'login'
                                })
                                .then(async (token) => {
                                  await this.handleSubmit(token)
                                })
                            })
                          } else {
                            this.handleSubmit('')
                          }
                        }}
                      >
                        Submit Review
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </React.Fragment>
        )}
      </div>
    )
  }
}

const mapState = (state) => ({
  // publicKeys: publicKeysSelector(state),
  customer: state.customer
})

export default connect(mapState)(ReviewForm)
