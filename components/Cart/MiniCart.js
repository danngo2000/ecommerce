import React, { Component } from 'react'
import { Tooltip } from 'antd'
import {
  DeleteOutlined,
  ShoppingCartOutlined,
  ClockCircleOutlined
} from '@ant-design/icons'
import Link from 'next/link'
// import { Price } from 'Product/Price'
import { connect, useDispatch, useSelector } from 'react-redux'
import FreeShipping from './FreeShipping'
// import { t, T } from 'locales'
// import NoticeStock from 'Product/Notice/Stock'
import axios from 'axios'
import Router from 'next/router'
import { makeOrderItemLink } from 'utils'
import CartDrawer from '../Cart/CartDrawer'
import CartNotifier from './CartNotifier'
import { toggleCartDrawer, toggleLoginDialog } from 'actions/ui'
// import { changeCartItemQuantity, removeFromCart, saveForLater, updateCart } from '../../actions/cart'
// import { goToCheckout } from '../../actions/checkout'

const Cart = React.memo((props) => {
  return (
    <div className='minicart-panel'>
      <CartHeading />
      <FreeShipping freeShippingLimit={props.freeShippingLimit} />
      <div className='cart-item-wrapper'>
        <CartItem emptyThumbImg={props.emptyThumbImg} />
      </div>
      <CartSubtotal />
    </div>
  )
})

const CartHeading = React.memo(() => {
  const dispatch = useDispatch()
  const handleGoToCheckout = async () => {
    const {
      data: { cart }
    } = await axios.post('quotes/verify')
    if (cart) {
      dispatch(updateCart(cart))
      dispatch(toggleCartDrawer(false))
      dispatch(goToCheckout())
    }
  }
  const isGuest = useSelector((state) => state.auth.isGuest)
  return (
    <div className='goto-wrapper'>
      <Link href='/cart' as='/cart'>
        <a className='btn btn-gray view-cart'>View Cart</a>
      </Link>
      {0 && isGuest ? (
        <a
          className='btn btn-gray checkout-btn'
          onClick={() => dispatch(toggleLoginDialog(true))}
        >
          {t('Login')}
        </a>
      ) : (
        <a
          onClick={handleGoToCheckout}
          className='btn btn-gray checkout-btn'
          intent='danger'
        >
          {t('Checkout')}
        </a>
      )}
    </div>
  )
})

const CartSubtotal = React.memo(function () {
  const cart = useSelector((state) => state.cart)
  return (
    <div className='grid-container-fluid grid-2 subtotal-wrapper'>
      <div className='text-left'>
        <strong>{t('Grandtotal')}</strong> ({cart.items_count}{' '}
        {cart.items_count > 1 ? t('items') : t('item')})
      </div>
      <div className='subtotal-price-cart'>
        <Price price={cart.grand_total} />
      </div>
    </div>
  )
})

const CartItem = React.memo((props) => {
  let { emptyThumbImg } = props
  const { cartData } = useAppSelector((state) => state.cart);
  const isGuest = useSelector((state) => state.auth.isGuest)
  const dispatch = useDispatch()

  return (
    Array.isArray(cartData.items) &&
    cartData.items.map((item, index) => {
      if (!item.product) return null
      let saleOfPercent = Math.round(
        100 - (item.price / item.original_price) * 100
      )

      let imgThumbTag = item.thumbnail ? (
        <img className='item-thumb' src={item.thumbnail} />
      ) : (
        <img className='item-thumb noImgThumb' src={emptyThumbImg} />
      )

      let [href, _as] = makeOrderItemLink(item)

      return (
        <div
          className='grid-container-fluid grid-4 grid-sm-3 cart-item'
          key={index}
        >
          <div>{imgThumbTag}</div>
          <div className='grid-col-2-3 grid-col-sm-2-3 item-detail'>
            {item.brand && <p className='item-brand'>{item.brand}</p>}
            {!item.product ? (
              item.name
            ) : (
              <Link href={href || '#'} as={_as || '#'}>
                <a className='item-title'>{item.name}</a>
              </Link>
            )}
            <div className='priceWrap'>
              {item.original_price > item.price && (
                <div className='original-price'>
                  <Price price={item.original_price} />
                </div>
              )}
              <div className={`price${saleOfPercent ? ' hasSaleOf' : ''}`}>
                <Price price={item.price} />
              </div>
            </div>
            <NoticeStock product={item.product} />

            <div className='actions-wrapper'>
              <Tooltip title='Remove' placement='top'></Tooltip>
            </div>
          </div>
          <div className='grid-col-sm-1-3 actions-group'>
            <div className='updateQtyGroup'>
              <span
                className={
                  'btnDecreaseQty ' + (item.qty === 1 ? 'disabled' : '')
                }
                onClick={() => {
                  if (item.qty > 1) {
                    dispatch(
                      changeCartItemQuantity(item.product_id, item.qty - 1)
                    )
                  }
                }}
              >
                <img src='/static/images/svg/minus.svg' />
              </span>
              <span className='qtyNumber'>{item.qty}</span>
              <span
                className={`btnIncreaseQty ${
                  item.qty >= item.product.quantity ? 'disabled' : ''
                }`}
                onClick={() =>
                  dispatch(
                    changeCartItemQuantity(item.product_id, item.qty + 1)
                  )
                }
              >
                <img src='/static/images/svg/plus.svg' />
              </span>
            </div>
            <div className='actions-wrapper'>
              <Tooltip title='Remove' placement='top'>
                <DeleteOutlined
                  className='remove-item'
                  style={{ fontSize: '18px' }}
                  onClick={() => dispatch(removeFromCart(item))}
                />
              </Tooltip>
              {!isGuest && (
                <Tooltip title='Save for later' placement='bottom'>
                  <ClockCircleOutlined
                    className='remove-item'
                    style={{ fontSize: '16px' }}
                    onClick={() => dispatch(saveForLater(item))}
                  />
                </Tooltip>
              )}
            </div>
            <div className='priceWrap'>
              {
                <div className='price'>
                  <Price price={item.row_total} />
                </div>
              }
            </div>
          </div>
        </div>
      )
    })
  )
})

const EmptyCart = React.memo(function () {
  return (
    <div className='minicart-panel'>
      <div className='center'>
        <div className='CartEmptyPage'>
          <img src='/static/images/shopping-cart.svg' width='100px' />
          <p className='EmptyTxt'>{t('Shopping Cart is Empty')}</p>
          <p>{t('You have no items in your shopping cart')}.</p>
        </div>
      </div>
    </div>
  )
})

class MiniCart extends Component {
  state = {
    visible: false
  }

  render() {
    const { cart } = this.props
    // const checkQty = cart.items.filter(i => !i.product || i.product.quantity <= 0)
    const freeShippingLimit = this.props.config['cart/freeShippingLimit']
    const theme = this.props.config['site/theme']
    const cartOption = this.props.config['sales/cart/layout_option']
    return (
      <>
        {cartOption === 'drawer' ? (
          <div className='miniCartBox-drawer'>
            <button className='drawer-cart-btn header-main'>
              <span className='countNumber'>
                {typeof cartData !== 'undefined' && cartData.items_count > 0 && (
                  <span className='drawer-cart-number'>{cartData.items_count}</span>
                )}
              </span>
              <ShoppingCartOutlined
                type={this.props.icon}
                style={{ fontSize: '25px' }}
              />
            </button>
            <CartDrawer />
            <CartNotifier />
          </div>
        ) : (
          <div
            className={
              theme === 'yellow-theme'
                ? 'miniCartBox header-main miniCartImex'
                : 'miniCartBox header-main'
            }
          >
            <Link href='/cart'>
              <a>
                <span className='countNumber'>
                  {typeof cartData !== 'undefined' && cartData.items_count > 0 && (
                    <span>{cartData.items_count}</span>
                  )}
                </span>
                <ShoppingCartOutlined
                  type={this.props.icon}
                  style={{ fontSize: '25px', margin: '-15px' }}
                />
              </a>
            </Link>
            {/* {
              cart.items.length > 0
              ? <Cart freeShippingLimit={freeShippingLimit}
                emptyThumbImg={this.props.config['product/image/no_img_thumb']} />
              : <EmptyCart />
            } */}
            {/* <CartNotifier /> */}
            {/* {
              checkQty.length > 0 && (
                <div className='cartNotifier show cartNotiOfStock'>
                  <div style={{ color: 'red' }} className='cartError'><T>At least one product is out of stock in your cart</T></div>
                </div>
              )
            } */}
          </div>
        )}
      </>
    )
  }
}

const mapState = (state) => ({
  config: state.config,
})

export { Cart, CartItem, EmptyCart, CartHeading, CartSubtotal }
export default connect(mapState)(MiniCart)
