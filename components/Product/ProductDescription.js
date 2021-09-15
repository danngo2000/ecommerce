import React from 'react'
import renderHTMLFormEditorJS from '../../utils/lib/renderHTMLFormEditorJS'
import { scroller } from 'react-scroll'

export class ProductDescription extends React.Component {
  constructor(props) {
    super(props)
    this.state = { isViewMore: true, hasBtnView: false }
    this.descriptionBox = React.createRef()
  }
  scrollTo = (element, offset = 0) => {
    scroller.scrollTo(element, {
      duration: 800,
      delay: 0,
      smooth: 'easeInOutQuart',
      offset
    })
  }

  handleView = () => {
    this.setState({ isViewMore: !this.state.isViewMore })
    if (!this.state.isViewMore) {
      this.scrollTo('descriptionBox', -200)
    }
  }
  componentDidMount = () => {
    if (!this.descriptionBox.current) return
    const height = this.descriptionBox.current.clientHeight
    if (height > 200) {
      this.setState({ hasBtnView: true })
    }
  }
  componentDidUpdate(prevProps, prevState) {
    if (!this.descriptionBox.current) return
    const height = this.descriptionBox.current.clientHeight
    if (prevProps !== this.props) {
      if (height < 200) {
        this.setState({ hasBtnView: false, isViewMore: true })
      } else {
        this.setState({ hasBtnView: true, isViewMore: true })
      }
    }
  }
  render() {
    const { product } = this.props

    if (
      product.description &&
      Array.isArray(product.description.blocks) &&
      product.description.blocks.length > 0
    ) {
      const { blocks } = product.description
      return (
        <>
          <div
            className={`descriptionBox ${
              this.state.hasBtnView && this.state.isViewMore
                ? 'height-limit description-height'
                : ''
            }`}
            ref={this.descriptionBox}
          >
            {blocks &&
              Array.isArray(blocks) &&
              blocks.length > 0 &&
              blocks.map((elm, index) => renderHTMLFormEditorJS(elm, index))}
          </div>
          {this.state.hasBtnView && (
            <div className='view-description'>
              <button onClick={this.handleView}>
                {!this.state.isViewMore ? 'View Less' : 'View More'}
              </button>
            </div>
          )}
        </>
      )
    }
    return null
  }
}
