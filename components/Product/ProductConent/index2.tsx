import React, { useState, useEffect, FC } from 'react'
import { useSelector } from 'react-redux'
import { Price } from '../Price'
import jwt from 'jsonwebtoken'
import Media from '../Media'
import axios from 'axios'
import { decodeHTML } from 'utils'
import Rating from 'react-rating'
import { Button } from 'antd'
import Link from 'next/link'
import { scroller } from 'react-scroll'
import { FacebookShareButton, TwitterShareButton } from 'react-share'
import WishlistButton from './WishlistButton'
import AddToCartBox from './AddtoCartBox'
import AmazonLinkRefer from '../DropShip/AmazonLinkRefer'
import ReactMarkdown from 'react-markdown'
import ProductDetailTab from './ProductDetailTab'
import ProductSlider from '../ProductSlider'
import RelatedProducts from './RelatedProducts'
import RecentlyViewed from './RecentlyViewed'
import QuestionsAndAnswers from '../QuestionsAndAnswers'
import Reviews from '../Reviews'

interface PriceType {
  originalPrice: any
  price: any
}

const calcDisabledOptions = ({ options, current, products, attributes }) => {
  try {
    const disabled = Object.fromEntries(attributes.map((att) => [att, []]))
    for (let attribute of attributes) {
      options[attribute].forEach((value) => {
        let found = findCfgProducts(
          products,
          {
            ...current,
            [attribute]: value
          },
          false
        )
        if (!found) disabled[attribute].push(value)
      })
    }

    return disabled
  } catch (error) {
    console.log(error.message)
    return {}
  }
}

const findCfgProducts = (products, condition, ignoreDisableds = true) => {
  return products.find((p) =>
    Object.entries(condition).every(
      ([k, v]) =>
        p.attributes[k] === v && (ignoreDisableds || p.status === 'enable')
    )
  )
}

const GuideBox = React.memo((props: any) => {
  const { product, config } = props
  const freeShipLimit = config['cart/freeShippingLimit']
  const currency = config['site/locale_currency_format']
  const warrantyPolicyLink = config['products/warranty_policy_link']
  const guideBoxTable = config['site/footer/guide-box-table'] || []
  let coin = 0
  if (product.bonus_credit) {
    if (!isNaN(+product.bonus_credit)) {
      // bonus_credit is coin
      coin = +product.bonus_credit
    } else {
      // bonus_credit is percent (%)
      const bonus = product.bonus_credit.substring(
        0,
        product.bonus_credit.length - 1
      )
      if (!isNaN(+bonus)) {
        coin = Math.round(
          (+bonus / 100) * (product.special_price || product.price)
        )
      }
    }
  }

  return (
    <div className='guideBox'>
      {guideBoxTable &&
        guideBoxTable.map(
          (item: any, index: number) =>
            item &&
            item.enable && (
              <div key={index} className='guideDetail'>
                <div className='iconGuide'>
                  <div>
                    <img style={{ height: 18, width: 18 }} src={item.icon} />
                  </div>
                </div>
                <div className='textGuide'>
                  {item.content} <a href={item.link}>{item.link}</a>{' '}
                </div>
              </div>
            )
        )}
    </div>
  )
})

const QuantityCaution = React.memo((props: any) => {
  const quantity = props.product.quantity
  if (quantity < 5 && quantity > 0)
    return (
      <div className='productStockStatus'>
        Only {quantity} left in stock - order soon.
      </div>
    )
  return null
})

const getDataForCustomer = async (productId: any) => {
  // try {
  //   const token: any = window.localStorage.getItem('token')
  //   const customerDecoded: any = jwt.decode(token)
  //   if (
  //     customerDecoded &&
  //     customerDecoded.user_role === 'customer' &&
  //     typeof customerDecoded.customer !== 'undefined'
  //   ) {
  //     await axios.post('product-recently-viewed', { productId })
  //   }
  // } catch (error) {
  //   console.log(error.message)
  // }
}

const Pricebox: FC<PriceType> = React.memo(({ originalPrice, price }) => {
  const percent = originalPrice
    ? Math.round(((originalPrice - price) * 100) / originalPrice)
    : 0
  return (
    <div className='priceBox'>
      {originalPrice && originalPrice > price && (
        <div className='original-price'>
          <span>
            <Price price={originalPrice} />
          </span>
          {percent > 0 && (
            <span className='sale-off'>Sale {percent.toFixed(0)}% off</span>
          )}
        </div>
      )}

      <span className={`price ${percent > 0 && 'has-sale-off'}`}>
        <Price price={price} />
        {percent > 0 && (
          <span className='sale-off'>{percent.toFixed(0)}% off</span>
        )}
      </span>
    </div>
  )
})

const ProductContent2 = (props: any) => {
  const {
    qandaShow,
    product,
    reviews,
    short_description,
    customAttributesDetail,
    related,
    reviewsHaveImages,
    reviewPage,
    ratingStatistics,
    reviewStar,
    reviewType
  } = props
  const config = useSelector((state: any) => state.config)
  const [shareUrl, setShareUrl] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [configurable, setConfigurable] = useState<any>({
    selected: null,
    disabled: {}
  })

  const theme = config['site/theme']
  let showTableInformation = config['products/table_information']
  if (product.booking_order?.enable) showTableInformation = false

  const scrollTo = (element: any, offset = 0) => {
    scroller.scrollTo(element, {
      duration: 800,
      delay: 0,
      smooth: 'easeInOutQuart',
      offset
    })
  }

  const renderFacebook = (event: any) => {
    event.preventDefault()
    // this.setState({ shareUrl: window.location.href, openFbTooltip: true })
    // setTimeout(() => this.setState({ openFbTooltip: false }), 1000)
  }

  const renderTwitter = (event: any) => {
    event.preventDefault()
    // this.setState({ shareUrl: window.location.href, openTwitterTooltip: true })
    // setTimeout(() => this.setState({ openTwitterTooltip: false }), 1000)
  }

  const handleConfigClick = (code, value) => {
    const {
      router,
      product: { slug, configurable: cfg }
    } = props
  }

  useEffect(() => {
    getDataForCustomer(product._id)
    if (configurable.selected) {
      const disabled = calcDisabledOptions({
        ...product.configurable,
        current: configurable.selected.attributes
      })
      setConfigurable({
        ...configurable,
        disabled: disabled
      })
    }
  }, [])

  let emptyStarColor = '#eff0f5'
  let fullStarColor = '#faca51'

  const isCfg = product.product_type === 'configurable' && configurable.selected
  return (
    <>
      {qandaShow ? 'QAndAShowFull' : <></>}
      <div
        className='product-container container'
        style={qandaShow ? { display: 'none' } : {}}
      >
        <div className='main-box productImage'>
          <div className='row productDetail'>
            <div className='col1 col-md-5 col-xs-12'>
              <Media
                product={isCfg ? configurable.selected._id : product}
                fallback={product}
              />
            </div>
            <div
              className='col2 col-md-7 col-xs-12'
              style={{ position: 'relative' }}
            >
              <h1 className='product-title' id='product-title'>
                {product.brand_id && (
                  <Link
                    href={`/brand?brandSlug=${product.brand_id.slug}`}
                    as={`/b/${product.brand_id.slug}`}
                  >
                    <a>
                      <p>{product.brand_id.name}</p>
                    </a>
                  </Link>
                )}
                {isCfg
                  ? configurable.selected._id.name
                  : decodeHTML(product.name)}
              </h1>
              <div
                className='grid-container-fluid grid-6 grid-sm-1'
                style={{
                  alignItems: 'center',
                  display: 'flex',
                  justifyContent: 'space-between',
                  flexWrap: 'wrap'
                }}
              >
                <div className='grid-col-1-2 grid-col-sm-1 product-content-rating'>
                  {product.rating && product.rating.avg > 0 && (
                    <a
                      href='#'
                      onClick={() => scrollTo('productReviews', -350)}
                    >
                      <div className='rating'>
                        <Rating
                          emptySymbol={
                            <div
                              className='ratingIcon emptyStarIcon'
                              style={{ fill: emptyStarColor }}
                            />
                          }
                          fullSymbol={
                            <div
                              className='ratingIcon'
                              style={{ fill: fullStarColor }}
                            />
                          }
                          initialRating={product.rating.avg}
                          readonly
                        />
                        <div className='ratingCount'>
                          ({reviews && reviews.countAll ? reviews.countAll : 0})
                        </div>
                      </div>
                    </a>
                  )}
                  <a
                    className='product-review-text'
                    href='#'
                    onClick={() => scrollTo('productReviews', -350)}
                  >
                    Write a Review
                  </a>
                  {product.sold === 0 ? (
                    ''
                  ) : (
                    <>
                      <div style={{ padding: '0 5px', color: '#999' }}>|</div>
                      <div className='product-detail-sold-item'>
                        Sold {product.sold}
                      </div>
                    </>
                  )}
                </div>
                <div className='grid-col-3-5 grid-col-sm-1 sku'>
                  <span>
                    SKU:&nbsp;
                    {isCfg ? configurable.selected._id.sku : product.sku}
                  </span>
                </div>
                <div className='social-group'>
                  <AmazonLinkRefer product />
                  <FacebookShareButton url={shareUrl} quote={product.name}>
                    <a
                      href='#'
                      className='btn-social fb'
                      onMouseUp={(e) => renderFacebook(e)}
                    >
                      <img src='/static/images/svg/facebookF.svg' />
                    </a>
                  </FacebookShareButton>
                  {!['pink-theme'].includes(theme) && (
                    <TwitterShareButton url={shareUrl}>
                      <a
                        href='#'
                        className='btn-social twitter'
                        onMouseUp={(e) => renderTwitter(e)}
                      >
                        <img src='/static/images/svg/twitter.svg' />
                      </a>
                    </TwitterShareButton>
                  )}
                </div>
              </div>
              <Pricebox
                originalPrice={
                  isCfg
                    ? configurable.selected._id.original_price
                    : product.original_price
                }
                price={isCfg ? configurable.selected._id.price : product.price}
              />
              {product.product_type === 'configurable' && product.configurable && (
                <div className='configurable-box'>
                  {Object.entries(product.configurable.options).map(
                    ([code, values]: any) => (
                      <div key={code}>
                        <p>
                          Select {code}:{' '}
                          {configurable.selected &&
                            configurable.selected.attributes[code]}
                        </p>
                        <div className='options-wrapper'>
                          {values.map((value: any) => {
                            const isSelected =
                              configurable.selected &&
                              configurable.selected.attributes[code] === value
                            return (
                              <Button
                                key={value}
                                disabled={isLoading}
                                onClick={() =>
                                  !isSelected && handleConfigClick(code, value)
                                }
                                danger={!!isSelected}
                                type={
                                  isSelected
                                    ? (null as any)
                                    : Array.isArray(
                                        configurable.disabled[code]
                                      ) &&
                                      configurable.disabled[code].includes(
                                        value
                                      )
                                    ? 'dashed'
                                    : 'ghost'
                                }
                              >
                                {value}
                              </Button>
                            )
                          })}
                        </div>
                      </div>
                    )
                  )}
                </div>
              )}
              {product.quantity <= 0 ||
              product.status === 'disable' ||
              product.stock_availability === 'out-of-stock' ? (
                <div className='stockStatus-Wrapper'>
                  <WishlistButton product={product} />
                </div>
              ) : (
                <AddToCartBox
                  product={isCfg ? configurable.selected._id : product}
                  parent={product}
                />
              )}
              <QuantityCaution
                product={isCfg ? configurable.selected._id : product}
              />
              {short_description && (
                <div className='short-description-content'>
                  <h4>Summary</h4>
                  {/* <ReactMarkdown children={short_description} /> */}
                </div>
              )}
              {showTableInformation && (
                <GuideBox product={product} config={config} />
              )}
            </div>
          </div>
        </div>

        <ProductDetailTab
          product={product}
          customAttributesDetail={customAttributesDetail}
        />

        {Array.isArray(related) && related.length > 0 && (
          <div className='main-box'>
            <div className='featuredProducts relatedProductSlider md-slider'>
              <h3>Related Products</h3>
              {/* <ProductSlider products={related} /> */}
            </div>
          </div>
        )}

        {/* <RelatedProducts productId={product._id} /> */}
        {/* <RecentlyViewed product={product} /> */}
        <QuestionsAndAnswers product={product} />
        <Reviews
          reviewsHaveImages={reviewsHaveImages}
          reviewPage={reviewPage}
          product={product}
          reviews={reviews}
          ratingStatistics={ratingStatistics}
          reviewStar={reviewStar}
          reviewType={reviewType}
        />
      </div>
    </>
  )
}

export default ProductContent2
