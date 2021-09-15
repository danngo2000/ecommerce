import React from 'react'
import { Modal } from 'antd'
import debounce from 'lodash.debounce'
import axios from 'axios'

const RenderImages = React.memo(props => {
  return (
    props.reviews.map((review) => (
      review.images.map((image, index) => (
        <div className='thumbnailDiv' key={index} style={{ backgroundImage: `url(${image.url})` }} onClick={() => props.onClick(review, index)} />
      ))
    ))
  )
})

class AllImagePopup extends React.PureComponent {
  state = {
    open: true,
    page: 1,
    arrayReviews: []
  }

  isEndPage = false

  getReviews = debounce(async () => {
    if (this.isEndPage === true) return false
    let page = this.state.page + 1
    this.setState({ page })
    const { data } = await axios.get(`customer-reviews/getReviewsHaveImages?productId=${this.props.product._id}&page=${page}`)
    if (data.reviews.length) {
      const arrayReviews = this.state.arrayReviews.concat([data.reviews])
      this.setState({ arrayReviews })
    } else {
      this.isEndPage = true
    }
  }, 300)

  handleScroll = (event) => {
    let element = event.target
    if (element.scrollHeight - element.scrollTop <= element.clientHeight + 50) {
      this.getReviews()
    }
  }

  componentDidMount () {
    window.setTimeout(() => {
      window.document.getElementById('allImgPopupBody').addEventListener('scroll', this.handleScroll)
    }, 400)
    this.setState({ arrayReviews: [this.props.data.reviews] })
  }

  componentWillUnmount () {
    try {
      window.document.getElementById('allImgPopupBody').removeEventListener('scroll', this.handleScroll)
    } catch (e) {
      console.log(e)
    }
  }

  isBottom (el) {
    return el.getBoundingClientRect().bottom <= window.innerHeight
  }

  handleImgClick = (review, index) => {
    this.props.setImageClicked({ review, index })
  }

  render () {
    const { product, onClose, isOpen, data } = this.props
    const { open, arrayReviews } = this.state
    return (
      <Modal
        visible={isOpen}
        title={product ? product.name : ''}
        onCancel={onClose}
        onOk={onClose}
        className='imgDialog'
      >
        <div className={`bp3-dialog-body allImgPopup`} id='allImgPopupBody'>
          {
            arrayReviews.map((reviews, index) => <RenderImages key={index} reviews={reviews} onClick={this.handleImgClick} />)
          }
        </div>
      </Modal>
    )
  }
}

export default AllImagePopup
