import React, { useState, useMemo } from 'react'
import classNames from 'classnames'
// import { T, t } from 'locales'
// import SellerIcon from 'Seller/Components/SellerIcon'
import RetinaImage from '../RetinaImage'
import { decodeHTML } from 'utils'
import Price from '../Product/Price'
import { Statistic, Tooltip } from 'antd'
import dynamic from 'next/dynamic'
// import Swiper from '../CustomSwiper'
import Router from 'next/router'
import { SlideArrowAlt } from '../Blocks/SlideArrowAlt'
import { useSelector } from 'react-redux'
import { useDispatch } from 'react-redux'
import { showBookingModal, addToCartBooking } from 'actions/booking'
import { toggleLoginDialog } from 'actions/ui'
import {
  addToCart,
  changeCartItemQuantity,
  removeFromCart
} from '../../actions/cart'

const Highlighter = dynamic(() => import('react-highlight-words'))

const Rating = dynamic(() => import('react-rating'))
const { Countdown } = Statistic

const ProductName = React.memo(function (props) {
  let { highlignWords, product } = props
  if (Array.isArray(highlignWords) && highlignWords.length > 0) {
    return (
      <Highlighter
        className='productNameText'
        highlightClassName=''
        searchWords={highlignWords}
        textToHighlight={decodeHTML(product.name)}
        autoEscape
      />
    )
  } else {
    return <div className='productNameText'>{decodeHTML(product.name)}</div>
  }
})

const ProductImage = React.memo(function (props) {
  let { saleOfPercent, product, type } = props
  let smallImg = product.thumb || ''
  let mediumImg = ''
  let smallImgHover = product.thumb || ''
  let mediumImgHover = ''
  if (type && type === 'question') {
    if (product.images.length > 0) {
      product.images.forEach((elm) => {
        if (elm.size_type === 'small') {
          smallImg = elm.url
          smallImgHover = elm.url
        } else if (elm.size_type === 'medium') {
          mediumImg = elm.url
          mediumImgHover = elm.url
        }
      })
    }
  } else {
    if (product.images?.small?.length > 0) {
      smallImg = product.images.small[0]
      smallImgHover = product.images.small[1]
    }
    if (product.images?.medium?.length > 0) {
      mediumImg = product.images.medium[0]
      mediumImgHover = product.images.medium[1]
    }
  }
  if (!mediumImg) {
    mediumImg = smallImg
    mediumImgHover = smallImgHover
  }
  const isHoverImage =
    product.images && product.images.small && product.images.small.length > 1
  return (
    <div className='imgWrap'>
      {saleOfPercent > 0 && (
        <div className='productDeal'>{saleOfPercent}% Off</div>
      )}
      <div className={`image ${isHoverImage && 'has-hover-image'}`}>
        <RetinaImage
          className='product-image'
          src={smallImg}
          hiresSrc={mediumImg}
          alt={product.name}
        />
      </div>
      {isHoverImage && (
        <div className='hover-image'>
          <RetinaImage
            className='product-image'
            src={smallImgHover}
            hiresSrc={mediumImgHover}
            alt={product.name}
          />
        </div>
      )}
    </div>
  )
})

const AddToCartBox = React.memo((props) => {
  const dispatch = useDispatch()
  const { product, productId, quantity, setQuantity } = props
  const cart = useSelector((state) => state.cart)
  const items = cart ? cart.items : []
  const customer = useSelector((state) => state.customer)
  const isGuest = useSelector((state) => state.auth.isGuest)
  const config = useSelector((state) => state.config)
  let quantityInCart = items
    ?.filter((item) => (productId || product._id) === item.product_id)
    .map((item) => item.qty)[0]
  let itemInCart = items?.filter(
    (item) => (productId || product._id) === item.product_id
  )[0]
  let quickMode = config['products/add_to_cart/quick_mode']
  const titleBooking = config['products/booking/booking_button_title']

  const handleAddtoCartBooking = (product) => {
    const shipping_fee = config['products/booking/default_shipping_fee']
    let quantity = 1
    if (isGuest) {
      dispatch(toggleLoginDialog(true))
    } else {
      dispatch(addToCartBooking({ product, quantity, customer, shipping_fee }))
      dispatch(showBookingModal())
    }
  }
  return (
    <>
      {product.quantity <= 0 ||
      product.status === 'disable' ||
      product.stock_availability === 'out-of-stock' ? (
        <button className='btn btn-sm ' disabled intent='danger'>
          {t('Out of stock')}
        </button>
      ) : (
        <div
          className={`add-to-cart-groups addf ${
            quickMode ? 'quick-mode' : 'animation-mode'
          }`}
        >
          {!product.booking_order?.enable ? (
            <div className='addToBox'>
              {quantityInCart > 0 ? (
                <div className='qty-wrapper'>
                  <div className='btn updateQtyGroup'>
                    <span
                      className='btnDecreaseQty'
                      onClick={(e) => {
                        const substract =
                          quantityInCart > 0 ? quantityInCart - 1 : quantity - 1
                        if (substract < 1) dispatch(removeFromCart(itemInCart))
                        else
                          dispatch(
                            changeCartItemQuantity(
                              productId || product._id,
                              substract
                            )
                          )
                        setQuantity(substract)
                      }}
                    >
                      <img src='/static/images/svg/minus.svg' />
                    </span>
                    <span className='qtyNumber'>{quantityInCart}</span>
                    <span
                      className={`btnIncreaseQty ${
                        quantity === product.quantity ||
                        quantityInCart === product.quantity
                          ? 'disabled'
                          : ''
                      }`}
                      onClick={(e) => {
                        const add =
                          quantityInCart > 0 ? quantityInCart + 1 : quantity + 1
                        dispatch(
                          changeCartItemQuantity(productId || product._id, add)
                        )
                        setQuantity(add)
                      }}
                    >
                      <img src='/static/images/svg/plus.svg' />
                    </span>
                  </div>
                </div>
              ) : (
                <div
                  className={`cart-area ${props.type} ${
                    quickMode ? 'quick-mode' : ''
                  }`}
                >
                  {product.quantity === 0 || product.status === 'disable' ? (
                    <button className='btn btn-sm' disabled intent='danger'>
                      Out of stock
                    </button>
                  ) : (
                    <button
                      className='btn btnAddToCart'
                      onClick={() => {
                        dispatch(
                          addToCart(productId || product._id, quantity + 1)
                        )
                        setQuantity(quantity + 1)
                      }}
                    >
                      Add To Cart
                    </button>
                  )}
                </div>
              )}
            </div>
          ) : (
            <div className='addToBox'>
              <div className='cart-area'>
                <button
                  className='btn btnAddToCart'
                  onClick={() => handleAddtoCartBooking(product)}
                >
                  {titleBooking}
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </>
  )
})

const SubProductsSlide = React.memo((props) => {
  const swiperOptions = {
    slidesPerView: 4,
    slidesPerGroup: 1,
    spaceBetween: 3.5,
    loop: false,
    freeMode: true
  }
  const { products, setSelectedSub, sub, parent } = props

  const handleClick = (product) => {
    // Google Analytics: Measure product clicks
    // googleAnalyticEvents('select_content', {
    //   content_type: 'product',
    //   items: [
    //     {
    //       id: product._id,
    //       name: product.name,
    //       quantity: product.quantity,
    //       price: product.price
    //     }
    //   ]
    // })
    Router.push(
      `/product?slug=${parent.slug}&spid=${product._id}`,
      `/p/${parent.slug}?spid=${product._id}`
    )
  }

  return (
    <Swiper
      options={swiperOptions}
      className={
        products.length > 4
          ? 'sub-products-slide'
          : 'sub-products-slide-removeArrow'
      }
    >
      <Swiper.Wrapper>
        {products.length &&
          products.map((product, index) => {
            return (
              <div
                key={index}
                onClick={() => handleClick(product)}
                onMouseEnter={() => setSelectedSub(product)}
                className={classNames(
                  'sub-product-wrapper ',
                  sub && sub.sku === product.sku && 'active'
                )}
              >
                <img src={product.thumb} alt='' />
              </div>
            )
          })}
      </Swiper.Wrapper>
      <Swiper.Nav arrowIcon={SlideArrowAlt} />
    </Swiper>
  )
})

const ProductItem = (props) => {
  const [saleOf, setSaleOf] = useState(0)
  const [quantity, setQuantity] = useState(0)
  const [selectedSub, setSelectedSub] = useState(null)
  const [subs, setSubs] = useState([])
  const config = useSelector((state) => state.config)
  const {
    product,
    noCol,
    showAddToCartButton,
    showSeller,
    productId,
    showCfg = false
  } = props

  let isCfg = product?.product_type === 'configurable'
  let quickMode = config['products/add_to_cart/quick_mode']
  const promotionIcon = config['shipping_promotion/icon']

  let emptyStarColor = '#eff0f5'
  let fullStarColor = '#faca51'

  let percentSold = (product?.sold * 100) / product.maximum_quantity
  if (percentSold > 100) percentSold = 100

  const getValueCountDown = (product) => {
    if (
      product.expiry_date &&
      new Date(product.expiry_date).getTime() > Date.now()
    ) {
      return new Date(product.expiry_date).getTime()
    } else return Date.now() + (Math.floor(Math.random() * 6) + 1) * 86400000
  }

  const handleClick = (product) => {
    Router.push(
      `/product?slug=${product.slug}&spid=${product._id}`,
      `/p/${product.slug}?spid=${product._id}`
    )
  }

  useMemo(() => {
    if (isCfg && props.product.configurable) {
      setSubs(props.product.configurable.products)
      setSelectedSub(props.product.configurable.products[0])
    } else setSelectedSub(null)
  }, [isCfg])

  useMemo(() => {
    if (
      selectedSub &&
      selectedSub.original_price &&
      selectedSub.original_price > selectedSub.price
    ) {
      setSaleOf(
        Math.round(100 - (selectedSub.price / selectedSub.original_price) * 100)
      )
    } else if (
      product.original_price &&
      product.original_price > product.price
    ) {
      setSaleOf(
        Math.round(100 - (product.price / product.original_price) * 100)
      )
    }
  }, [product.original_price, product.price, selectedSub])
  return (
    <div
      className={`productItem${
        noCol ? '' : ' col-xs-6 col-sm-4 col-md-3 col-lg-3'
      }`}
    >
      {!isCfg && !quickMode && <div className='content-product' />}
      <div className={`box ${quickMode ? 'quick-mode' : 'animation-mode'}`}>
        {
          <div onClick={() => handleClick(product)}>
            <ProductImage
              saleOfPercent={saleOf}
              type={props.type}
              product={(isCfg && selectedSub) || product}
            />
          </div>
        }

        {showCfg && isCfg && (
          <SubProductsSlide
            products={subs}
            sub={selectedSub}
            setSelectedSub={setSelectedSub}
            parent={product}
          />
        )}
        <Tooltip
          overlayClassName='product-name-tooltip'
          placement='rightTop'
          title={product.name}
        >
          <div className='productName'>
            {<div onClick={() => handleClick(product)}>{product.name}</div>}
          </div>
        </Tooltip>

        <div className='rating-container'>
          {product.rating && product.rating.avg > 0 && (
            <div className={`rating ${props.type}`}>
              <div className='wrap-rating-content'>
                <Rating
                  emptySymbol={
                    <div
                      className='ratingIcon emptyStarIcon'
                      fill={emptyStarColor}
                    />
                  }
                  fullSymbol={
                    <div className='ratingIcon' fill={fullStarColor} />
                  }
                  initialRating={product.rating.avg}
                  readonly
                />
                <div className='ratingCount'>({product.rating.count})</div>
              </div>
            </div>
          )}
        </div>

        <div className='product-sold-item'>
          {product.sold === 0 ? '' : <>Sold {product.sold}</>}
        </div>
        <div className='saleOfDiv'>
          {saleOf > 0 && (
            <span className='originalPrice'>
              <Price
                price={
                  (selectedSub && selectedSub.original_price) ||
                  product.original_price
                }
              />
            </span>
          )}
        </div>

        <div
          className={`priceWrap ${
            props.type === 'flash-sale' ? props.type : ''
          }`}
        >
          <div className={`price ${saleOf ? 'hasSaleOf' : ''}`}>
            <Price
              price={(selectedSub && selectedSub.price) || product.price}
            />
          </div>
        </div>

        {props.type === 'flash-sale' && (
          <div className='wrap-content-flash-sale'>
            <div className='border-color'>
              <div
                className='border-color-after'
                style={{ width: `${percentSold}%` }}
              />
            </div>
            <div className='sub-content'>
              <div className='sold'>
                <p>
                  {product.sold} <span>{t('Sold')}</span>
                </p>
              </div>
              <div className='count-down'>
                <Countdown
                  valueStyle={{ fontSize: '13px', color: '#999' }}
                  value={getValueCountDown(product)}
                  format='DD:HH:mm:ss'
                />
              </div>
            </div>
          </div>
        )}
        <AddToCartBox
          type={props.type}
          product={product}
          productId={productId}
          quantity={quantity}
          setQuantity={setQuantity}
        />
        {showSeller && <SellerIcon seller={product.seller} />}
      </div>
    </div>
  )
}

export default React.memo(ProductItem)
