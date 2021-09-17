import React, { useEffect, useMemo, useState } from 'react'
import axios from 'axios'
import { Checkbox, Button, Input, Tooltip } from 'antd'
import { groupItemsBySeller } from '../Checkout/Shipping/ShippingRatesBySeller'
import QtyInput from './QtyInput'
import classNames from 'classnames'
import Price from '../Product/Price'
// import ProductSlider from '../Product/ProductSlider'
import { useRouter } from 'next/router'
import { ClockCircleOutlined, CloseOutlined } from '@ant-design/icons'
import { useDispatch, useSelector } from 'react-redux'
import { makeOrderItemLink } from 'utils'
import Link from 'next/link'
import Stock from '../Product/Notice/Stock'
import {
  changeCartItemQuantity,
  removeFromCart,
  toggleCartItems
} from 'actions/cart'
import { verifyCarts } from 'store/services/cart'
import { updateCart } from 'actions/cart'
import { changeCheckoutStep, goToCheckout } from 'actions/checkout'
import { CheckoutStep } from '../../store/interfaces'

const NewCartContent = () => {
  const cart = useSelector((state) => state.cart)
  const productsInCart = cart.items.map((item) => item.product_id)
  const config = useSelector((state) => state.config)
  const isGuest = useSelector((state) => state.auth.isGuest)
  const router = useRouter()
  const dispatch = useDispatch()
  let percentDeposit = config['deposit_payment/percent_grand_total']

  const [coupon, setCoupon] = useState('')
  const [isCouponShown, showCoupon] = useState(false)
  const [group, setGroup] = useState({})
  const [groupSelected, setGroupSelected] = useState([])
  const [allSelected, setAllSelected] = useState(true)
  const [products, setProducts] = useState([])

  const [count, setCount] = useState(1)

  useMemo(() => {
    const group = groupItemsBySeller(cart.items, false)

    let allSelected = true
    let groupSelected = []

    Object.entries(group).forEach(([_, gv], gi) => {
      const groupChecked = gv.items
        .filter((i) => {
          if (!i.product) return null
          return (
            i.product.quantity > 0 ||
            i.product.stock_availability !== 'out-of-stock' ||
            i.product.status !== 'disable'
          )
        })
        .every((i) => i.is_selected)
      groupSelected.push(groupChecked)
      if (!groupChecked) allSelected = false
    })

    setGroup(group)
    setGroupSelected(groupSelected)
    setAllSelected(allSelected)
  }, [cart])

  const fetchData = async () => {
    if (!productsInCart.length) return
    const { data } = await axios.post('products/crossSaleProducts', {
      productsInCart
    })
    if (data && data.length) setProducts(data)
  }
  useEffect(() => {
    fetchData()
    let itemElmnt = document.getElementById(router.query.id)
    if (itemElmnt)
      itemElmnt.scrollIntoView({ block: 'start', behavior: 'smooth' })
    window.scrollTo(0, 0)
  }, [router.query.id])

  const handleItemDecrease = (item) => {
    dispatch(changeCartItemQuantity(item.product_id, item.qty - 1))
  }

  const handleItemIncrease = (item) =>
    dispatch(changeCartItemQuantity(item.product_id, item.qty + 1))

  const handleItemCheckboxChange = (e, item) => {
    dispatch(
      toggleCartItems(
        e.target.checked,
        item.originalIndex || cart.items.findIndex((i) => i._id === item._id)
      )
    )
  }

  const handleGroupCheckboxChange = (e, gName) => {
    const indexes = group[gName].items.map((i) => i.originalIndex)
    dispatch(toggleCartItems(e.target.checked, indexes))
  }

  const handleAllCheckboxChange = (e) =>
    dispatch(toggleCartItems(e.target.checked))
  const handleRemoveFromCart = (item) => dispatch(removeFromCart(item))

  const handleApplyCoupon = () => {
    dispatch(applyCoupon(coupon))
    setCoupon('')
  }

  const handleGoToCheckout = async () => {
    if (1 || !isGuest) {
      const { cart } = await verifyCarts()
      if (cart) {
        dispatch(updateCart(cart))
        dispatch(changeCheckoutStep(CheckoutStep.Address))
        if (
          cart.items &&
          cart.items.some(
            (event) => event.product && event.product.quantity > 0
          )
        ) {
          dispatch(goToCheckout())
          router.push('/checkout')
        }
      }
    }
    //  else dispatch(toggleLoginDialog(true))
  }
  return (
    <div className='container new-cart-container'>
      <div className='sub-container'>
        <div className='contentBox item-box header-box'>
          <div className='product'>
            <Checkbox checked={allSelected} onChange={handleAllCheckboxChange}>
              Product
            </Checkbox>
          </div>
          <div className='price'>Price</div>
          <div className='quantity'>Quantity</div>
          <div className='total'>Total</div>
          <div className='action'>Action</div>
        </div>
        {Object.entries(group).map(([groupName, { items, seller }], gi) => {
          return (
            <div key={groupName} className='seller-box'>
              <div className='contentBox seller-box-header'>
                <div>
                  <Checkbox
                    checked={groupSelected[gi]}
                    onChange={(e) => handleGroupCheckboxChange(e, groupName)}
                  />
                  <span className='seller-name'>
                    {seller ? (
                      <Link
                        href={`/seller?sellerSlug=${seller.slug}`}
                        as={'/seller/' + seller.slug}
                      >
                        <a>{seller.name}</a>
                      </Link>
                    ) : groupName === 'dropship' ? (
                      Dropship
                    ) : (
                      config['site/name']
                    )}
                  </span>
                </div>
              </div>
              <div className='contentBox seller-box-body'>
                {items.map((item, ii) => {
                  let isCheckDisabled =
                    item.product <= 0 ||
                    (item.product.stock_availability &&
                      item.product.stock_availability === 'out-of-stock') ||
                    item.product.status === 'disable'
                  let [href, _as] = makeOrderItemLink(item)
                  let link = (
                    <Link href={href} as={_as}>
                      <a className='item-title'>{item.name}</a>
                    </Link>
                  )
                  let thumbnail =
                    item && item.thumbnail
                      ? item.thumbnail
                      : (item.product &&
                          item.product.images[0] &&
                          item.product.images[0].url) ||
                        ''
                  return (
                    <div className='item-box' key={item._id} id={item._id}>
                      <div className='product'>
                        <Checkbox
                          disabled={isCheckDisabled}
                          checked={item.is_selected}
                          onChange={(e) => handleItemCheckboxChange(e, item)}
                        />
                        <img className='thumbnail' src={thumbnail} alt='' />
                        <div className='product-name'>
                          {link}
                          <Stock product={item.product} />
                        </div>
                      </div>
                      <div className='name'>{link}</div>
                      <div className='price'>
                        {item.price < item.original_price && (
                          <span className='originalPrice'>
                            <Price price={item.original_price} />
                          </span>
                        )}
                        <span>
                          <Price price={item.price} />
                        </span>
                      </div>
                      <div className='quantity'>
                        <div className='updateQtyGroup'>
                          <span
                            className={classNames(
                              'btnDecreaseQty',
                              (!item.product || item.qty <= 1) && 'disabled'
                            )}
                            onClick={() =>
                              handleItemDecrease(item, groupName, ii)
                            }
                          >
                            <img src='/static/images/svg/minus.svg' alt='-' />
                          </span>
                          <QtyInput item={item} />
                          <span
                            className={classNames(
                              'btnIncreaseQty',
                              (!item.product ||
                                item.qty >= item.product.quantity) &&
                                'disabled'
                            )}
                            onClick={() =>
                              handleItemIncrease(item, groupName, ii)
                            }
                          >
                            <img src='/static/images/svg/plus.svg' alt='+' />
                          </span>
                        </div>
                      </div>
                      <div className='total'>
                        <Price price={item.row_total} />
                      </div>
                      <div className='action'>
                        <Button
                          type='link'
                          size='small'
                          onClick={() => handleRemoveFromCart(item)}
                        >
                          Delete
                        </Button>
                        {!isGuest && (
                          <Tooltip title={'Save for later'} placement='bottom'>
                            <ClockCircleOutlined
                              className='remove-item'
                              style={{ fontSize: '16px' }}
                              onClick={() => dispatch(saveForLater(item))}
                            />
                          </Tooltip>
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          )
        })}
        <div className='checkout-box'>
          <div className='coupon'>
            <div />
            {cart && cart.promotion && cart.promotion.coupon_code ? (
              <div style={{ padding: '10px 0' }}>
                Coupon:
                <span
                  className='bp3-tag bp3-large'
                  style={{ marginLeft: '10px' }}
                >
                  {cart.promotion.coupon_code}
                  <CloseOutlined
                    onClick={() => dispatch(removeCoupon())}
                    className='coupon-remove'
                  />
                </span>
              </div>
            ) : (
              <div className={classNames(!isCouponShown && 'hide-on-mobile')}>
                <div className='lusso-input-group'>
                  <Input
                    placeholder='Coupon (Optional)'
                    onChange={(e) => setCoupon(e.target.value)}
                    value={coupon}
                  />
                  <Button size='large' onClick={handleApplyCoupon}>
                    Apply
                  </Button>
                </div>
                <div className='error' id='couponError' />
                <p className='coupon-text'>
                  Limited to use of 1 coupon per Checkout
                </p>
              </div>
            )}
          </div>

          <div className='discount'>
            <div className='show-coupon-checkbox'>
              <Checkbox
                checked={isCouponShown}
                onChange={(e) => showCoupon(e.target.checked)}
              >
                Coupon
              </Checkbox>
            </div>
            <div className='input-group-hide-on-mobile'>
              {
                <div className='couponBox'>
                  {cart.promotion && cart.promotion.coupon_code ? (
                    <div>
                      Coupon:
                      <span className='bp3-tag bp3-large'>
                        {cart.promotion.coupon_code}
                        <CloseOutlined
                          onClick={() => dispatch(removeCoupon())}
                          className='coupon-remove'
                        />
                      </span>
                    </div>
                  ) : (
                    <>
                      {
                        <div className='lusso-input-group'>
                          <Input
                            placeholder='Coupon (Optional)'
                            onChange={(e) =>
                              setCoupon(e.target.value.toUpperCase())
                            }
                            value={coupon}
                          />
                          <Button size='large' onClick={handleApplyCoupon}>
                            Apply
                          </Button>
                        </div>
                      }
                    </>
                  )}
                </div>
              }
              <div className='error' id='couponError' />
              <p className='coupon-text'>
                Limited to use of 1 coupon per Checkout
              </p>
            </div>
            <div className='price-checkout'>
              <div className='grid-container-fluid grid-3'>
                <div className='grid-col-1-2'>
                  <span className='checkout-text'>Subtotal</span>
                </div>
                <div className='right'>
                  <span className='checkout-text price'>
                    <Price price={cart.subtotal} />
                  </span>
                </div>
              </div>
              <div className='grid-container-fluid price-discount'>
                <div className='grid-col-1-2'>
                  <span className='checkout-text'>Discount</span>
                </div>
                <div className='right'>
                  <span className='checkout-text price'>
                    -<Price price={cart.discount} />
                  </span>
                </div>
              </div>
              {cart.promotion && cart.promotion.discount > 0 && (
                <div className='grid-container-fluid grid-3'>
                  <div className='grid-col-1-2'>
                    <span className='checkout-text'>
                      Discount&nbsp;(Coupon)
                    </span>
                  </div>
                  <div className='right'>
                    <span className='checkout-text price'>
                      -<Price price={cart.promotion.discount} />
                    </span>
                  </div>
                </div>
              )}
              {cart.tax?.total > 0 && (
                <div className='grid-container-fluid grid-3'>
                  <div className='grid-col-1-2'>
                    <span className='checkout-text'>
                      Tax {cart.tax.name && `(${cart.tax.name})`}
                    </span>
                  </div>
                  <div className='right'>
                    <span className='checkout-text price'>
                      <Price price={cart.tax.total} />
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className='grand-total'>
            <Checkbox checked={allSelected} onChange={handleAllCheckboxChange}>
              Select All&nbsp;
              <span className='count'>({cart.all_items_count})</span>
            </Checkbox>
            <div className='right d-flex align-items-start'>
              <span style={{ marginTop: 5 }}>
                Total&nbsp;
                <span className='count'>({cart.items_count} items)</span>:
              </span>
              <span className='grand-total-price'>
                <Price price={cart.grand_total} />
              </span>
              <button
                className='btn btnCheckout'
                style={{ maxHeight: '47px' }}
                onClick={handleGoToCheckout}
                disabled={cart.items_count <= 0}
              >
                Checkout
              </button>
            </div>
          </div>
          {+percentDeposit && cart.grand_total ? (
            <div className='deposit-payment'>
              <div className='right d-flex align-items-start'>
                <span>Pre-Paid : </span>&nbsp;
                <span className='grand-total-price'>
                  <Price price={(cart.grand_total * +percentDeposit) / 100} />
                </span>
              </div>
            </div>
          ) : (
            ''
          )}
          {cart.items_count <= 0 && (
            <div className='notifi-empty'>
              <p>* Please select at least one item on your cart.</p>
            </div>
          )}
        </div>
      </div>
      {Array.isArray(products) && !!products.length && (
        <div className='cross-sale-products'>
          <div className='title-cross-sale'>
            <h2>Just for you</h2>
          </div>
          <div className='content-cross-sale'>
            {/* <ProductSlider
              slidesToShow={6}
              openNewWindow
              products={products}
              showAddToCartButton
            /> */}
          </div>
        </div>
      )}
    </div>
  )
}

export default NewCartContent
