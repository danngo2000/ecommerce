import React from 'react'
import Slider from 'react-slick'
import { SlideArrow } from '../../Blocks/SlideArrow'
import { SlideArrowAlt } from '../../Blocks/SlideArrowAlt'
import { Modal, Tabs } from 'antd'
import { decodeHTML } from 'utils'
import RetinaImage from '../../RetinaImage'
import { connect } from 'react-redux'
import youtube from 'utils/youtube'
import Videos from '../Media/Videos'
import { PlayCircleOutlined } from '@ant-design/icons'

const { TabPane } = Tabs

class Media extends React.Component {
  state = {
    nav1: null,
    nav2: null,
    nav3: null,
    nav4: null,
    isOpen: false,
    currentSlide: 0,
    activeSlide: 0,
    backgroundPosition: '0% 0%',
    backgroundImage: 'none',
    opacity: 1,
    cursor: 'zoom-in',
    count: false,
    images: [],
    highResImages: [],
    productId: null,
    videoId: null,
    defaultKey: 'image'
  }

  static getDerivedStateFromProps(props, state) {
    if (props.product && props.product._id !== state.productId) {
      const newState = {
        productId: props.product._id
      }
      let largeImages = []
      if (props.product.images.length) {
        largeImages = props.product.images.filter(
          (i) => i.size_type === 'large'
        )
      } else if (props.fallback && props.fallback.images.length) {
        largeImages = props.fallback.images.filter(
          (i) => i.size_type === 'large'
        )
      }
      newState.images = largeImages
      newState.highResImages = largeImages
      return newState
    }
    return null
  }

  componentDidMount() {
    this.setState({
      nav1: this.slider1,
      nav2: this.slider2,
      nav3: this.slider3,
      nav4: this.slider4
    })
    if (this.props.product) {
      let largeImages = []
      if (this.props.product.images.length) {
        largeImages = this.props.product.images.filter(
          (i) => i.size_type === 'large'
        )
      } else if (this.props.fallback && this.props.fallback.images.length) {
        largeImages = this.props.fallback.images.filter(
          (i) => i.size_type === 'large'
        )
      }
      this.setState({
        images: largeImages,
        largeImages,
        productId: this.props.product._id
      })
    }
  }

  reset = () => {
    this.setState({
      backgroundPosition: '0% 0%',
      backgroundImage: 'none',
      opacity: 1,
      cursor: 'zoom-in',
      count: false
    })
  }

  onClose = () => {
    this.setState({ isOpen: false })
    this.reset()
    document.body.classList.remove('bodyFixed')
  }

  handleMouseMove = (e) => {
    const { left, top, width, height } = e.target.getBoundingClientRect()
    const x = ((e.pageX - left) / width) * 120
    const y = ((e.pageY - top) / height) * 120
    this.setState({ backgroundPosition: `${x}% ${y}%` })
  }

  handleOnClick = (img) => {
    if (!this.state.count) {
      this.setState({
        backgroundImage: `url(${img})`,
        opacity: 0,
        cursor: 'zoom-out',
        count: true
      })
    } else {
      this.reset()
    }
  }

  disableScroll = () => {
    document.body.classList.add('bodyFixed')
  }

  renderDialog = (videoId, key, callback) => {
    const themeSettings = this.props.config['site/theme/settings'] || {}
    const theme = this.props.config['site/theme']
    const Arrow =
      themeSettings.sliderArrow && themeSettings.sliderArrow === 'slim'
        ? SlideArrowAlt
        : SlideArrow
    const settings = {
      initialSlide: this.state.currentSlide,
      dots: false,
      infinite: true,
      speed: 500,
      slidesToShow: 1,
      slidesToScroll: 1,
      adaptiveHeight: true,
      arrows: false,
      prevArrow: <Arrow {...this.props} />,
      nextArrow: <Arrow {...this.props} />,
      afterChange: (index) => {
        this.setState({ currentSlide: index })
      }
    }

    const settings2 = {
      dots: false,
      infinite: false,
      speed: 500,
      focusOnSelect: true,
      rows: 4,
      slidesPerRow: 6,
      slidesToScroll: 1,
      prevArrow: <Arrow {...this.props} />,
      nextArrow: <Arrow {...this.props} />
    }

    const {
      images,
      highResImages,
      backgroundImage,
      backgroundPosition,
      opacity,
      cursor,
      defaultKey
    } = this.state

    const product = this.props.product
    if (images.length + product.videos?.length === 0) {
      return (
        <div className='productGalleryBox'>
          <img
            alt='no thumbnail'
            className='noThumb'
            src='/static/images/catalog/item_no_img_thumb.png'
          />
        </div>
      )
    }
    return (
      <Modal
        width='80%'
        className={`${theme} bp3-dialog popupLight product-modal product-dialog`}
        visible={
          this.state.isOpen &&
          this.state.images.length + product.videos?.length > 0
        }
        title={null}
        footer={null}
        onCancel={this.onClose}
      >
        <Tabs
          activeKey={key}
          onChange={(key) => callback(key)}
          className='product-img-tab'
        >
          <TabPane tab='Images' key='image'>
            <div className='bp3-dialog-body'>
              <div className='row modal-content'>
                <div className='col-md-9 modal-content-left'>
                  <Slider
                    {...settings}
                    ref={(slider) => (this.slider3 = slider)}
                    className={`small-slider${
                      this.state.images.length + product.videos?.length > 1
                        ? ' big-img-slider'
                        : ''
                    }`}
                  >
                    {images.map((img, k) => (
                      <div className='carousel-img-wrapper' key={k}>
                        <div
                          onClick={() => this.handleOnClick(img.url)}
                          onMouseMove={(e) => this.handleMouseMove(e)}
                          style={{ backgroundImage, backgroundPosition }}
                        >
                          <img
                            alt={product.name}
                            width='100%'
                            src={img.url}
                            style={{ opacity, cursor }}
                          />
                        </div>
                      </div>
                    ))}
                  </Slider>
                </div>
                <div className='col-md-3 small-imgSlider-content'>
                  <h1 className='product-title'>
                    {decodeHTML(this.props.product.name.toLowerCase())}
                  </h1>
                  <Slider
                    {...settings2}
                    ref={(slider) => (this.slider4 = slider)}
                    className='small-slider'
                  >
                    {this.state.images.map((img, k) => (
                      <div
                        className='small-img-slider'
                        key={k}
                        onClick={() => {
                          this.setState({ currentSlide: k })
                          this.slider3.slickGoTo(k)
                          this.reset()
                        }}
                      >
                        <img
                          alt={product.name}
                          width='100%'
                          src={img.url}
                          className={`${
                            this.state.currentSlide === k ? 'img-active' : ''
                          }`}
                        />
                      </div>
                    ))}
                  </Slider>
                </div>
              </div>
            </div>
          </TabPane>
          {product.videos?.length > 0 && (
            <TabPane tab='Video' key='video'>
              <Videos videoId={videoId} product={product} />
            </TabPane>
          )}
        </Tabs>
      </Modal>
    )
  }

  handleImgClick = (current, activeKey) => {
    this.setState({ currentSlide: current, isOpen: true, videoId: current })
    if (activeKey === 'image') {
      this.setState({ defaultKey: activeKey })
      console.log('defaultKey', this.state.defaultKey)
    } else if (activeKey === 'video') {
      this.setState({ defaultKey: activeKey })
      console.log('defaultKey222', this.state.defaultKey)
    }
    this.slider1.slickGoTo(current)
  }

  handleSmallImgHover = (current) => {
    this.setState({ currentSlide: current, isOpen: false })
    this.slider1.slickGoTo(current)
  }

  render() {
    const { product } = this.props
    const { images, currentSlide, defaultKey } = this.state
    const themeSettings = this.props.config['site/theme/settings'] || {}
    const Arrow =
      themeSettings.sliderArrow && themeSettings.sliderArrow === 'slim'
        ? SlideArrowAlt
        : SlideArrow
    if (images.length + product.videos?.length === 0) {
      return (
        <div className='productGalleryBox'>
          <img
            alt='no thumbnail'
            className='noThumb'
            src='/static/images/catalog/item_no_img_thumb.png'
          />
        </div>
      )
    }

    let vertical = false

    const settings1 = {
      initialSlide: this.state.currentSlide,
      dots: false,
      infinite: true,
      speed: 500,
      slidesToShow: 1,
      slidesToScroll: 1,
      vertical: vertical,
      verticalSwiping: vertical,
      adaptiveHeight: true,
      arrows: false,
      afterChange: (index) => {
        this.setState({ currentSlide: index })
      },
      responsive: [
        {
          breakpoint: 1200,
          settings: {
            vertical: false,
            verticalSwiping: false
          }
        }
      ]
    }

    const settings2 = {
      dots: false,
      infinite: false,
      speed: 500,
      slidesToShow: 4,
      focusOnSelect: true,
      vertical: vertical,
      verticalSwiping: vertical,
      prevArrow: <Arrow {...this.props} />,
      nextArrow: <Arrow {...this.props} />,
      afterChange: (index) => {
        this.setState({ currentSlide: index })
      },
      responsive: [
        {
          breakpoint: 1200,
          settings: {
            vertical: false,
            current: { currentSlide },
            verticalSwiping: false
          }
        },
        {
          breakpoint: 1024,
          settings: {
            slidesToShow: 2,
            infinite: true,
            vertical: false,
            verticalSwiping: false
          }
        },
        {
          breakpoint: 720,
          settings: {
            slidesToShow: 1,
            dots: true,
            swipeToSlide: true,
            infinite: true,
            vertical: false,
            verticalSwiping: false
          }
        }
      ]
    }

    return (
      <div className='productGalleryBox'>
        <Slider
          {...settings1}
          ref={(slider) => (this.slider1 = slider)}
          className={'lg-slider multiple-slider'}
        >
          {this.state.images.map((img, k) => (
            <div key={k} onClick={() => this.handleImgClick(k, 'image')}>
              <RetinaImage
                alt={this.name}
                src={img.url}
                hiresSrc={
                  this.state.highResImages[k]
                    ? this.state.highResImages[k].url
                    : img.url
                }
              />
              <p className='carousel-indexing'>
                {k + 1}/{this.state.images.length}
              </p>
            </div>
          ))}
          {Array.isArray(product.videos) &&
            product.videos.map((video) => (
              <div
                key={video._id}
                onClick={() => this.handleImgClick(video._id, 'video')}
                onMouseOver={() => this.handleSmallImgHover(video._id)}
              >
                <img src={youtube.getThumbnail(video.video_id)} alt='' />
                <PlayCircleOutlined className='big-icon-video' />
              </div>
            ))}
        </Slider>
        {product.videos?.length + this.state.images.length > 1 && (
          <Slider
            {...settings2}
            ref={(slider) => (this.slider2 = slider)}
            className='lg-slider'
            current={currentSlide}
          >
            {this.state.images.map((img, k) => (
              <div
                key={k}
                onMouseOver={() => this.handleSmallImgHover(k)}
                onClick={() => this.handleImgClick(k, 'image')}
              >
                <RetinaImage
                  alt={this.name}
                  src={img.url}
                  hiresSrc={
                    this.state.highResImages[k]
                      ? this.state.highResImages[k].url
                      : img.url
                  }
                />
              </div>
            ))}
            {Array.isArray(product.videos) &&
              product.videos.map((video) => (
                <div
                  key={video._id}
                  onClick={() => this.handleImgClick(video._id, 'video')}
                  onMouseOver={() => this.handleSmallImgHover(video._id)}
                >
                  <img
                    className='thumbnail-video'
                    src={youtube.getThumbnail(video.video_id)}
                    alt=''
                  ></img>
                  <PlayCircleOutlined className='small-icon-video' />
                </div>
              ))}
          </Slider>
        )}
        {this.renderDialog(this.state.videoId, this.state.defaultKey, (key) =>
          this.setState({
            defaultKey: key
          })
        )}
      </div>
    )
  }
}
const mapState = (state) => ({
  config: state.config
})

export default connect(mapState)(Media)
