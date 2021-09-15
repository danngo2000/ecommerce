import React from 'react'
import WishlistButton from './WishlistButton'
import ClassNames from 'classnames'
import { CheckOutlined } from '@ant-design/icons'
import { connect, useDispatch, useSelector } from 'react-redux'
import { showBookingModal, addToCartBooking } from 'actions/booking'
import { toggleLoginDialog } from 'actions/ui'
import { addToCart, changeCartItemQuantity, removeFromCart } from 'actions/cart'

const AddToCartQuickMode = ({ product, quantity, setQuantity }) => {
  const { items } = useSelector((state) => state.cart)
  const dispatch = useDispatch()
  let itemInCart = items?.filter((item) => product._id === item.product_id)[0]
  let quantityInCart = items
    ?.filter((item) => product._id === item.product_id)
    .map((item) => item.qty)[0]
  quantity = 0
  return (
    <div className='add-to-cart-groups product-content quick-mode'>
      <div className='addToBox'>
        {quantity > 0 || quantityInCart > 0 ? (
          <div className='qty-wrapper'>
            <div className='btn updateQtyGroup'>
              <span
                className='btnDecreaseQty'
                onClick={(e) => {
                  const substract =
                    quantityInCart > 0 ? quantityInCart - 1 : quantity - 1
                  if (substract < 1) dispatch(removeFromCart(itemInCart))
                  else dispatch(changeCartItemQuantity(product._id, substract))
                  setQuantity(substract)
                }}
              >
                <img src='/static/images/svg/minus.svg' />
              </span>
              <span className='qtyNumber'>
                {quantity === 0 ? quantityInCart : quantity}
              </span>
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
                  dispatch(changeCartItemQuantity(product._id, add))
                  setQuantity(add)
                }}
              >
                <img src='/static/images/svg/plus.svg' />
              </span>
            </div>
          </div>
        ) : (
          <div className='cart-area'>
            {product.quantity === 0 || product.status === 'disable' ? (
              <button className='btn btn-sm' disabled intent='danger'>
                {t('Out of stock')}
              </button>
            ) : (
              <button
                className='btn btnAddToCart'
                onClick={() => {
                  dispatch(addToCart(product._id, quantity + 1))
                  setQuantity(quantity + 1)
                }}
              >
                Add To Cart
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

class AddToCartBox extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      quantity: props.config['products/add_to_cart/quick_mode'] ? 0 : 1,
      position: 'static',
      isClick: false
    }
  }
  wrapperRef = React.createRef()
  componentDidMount() {
    window.addEventListener('scroll', this.handleScroll, { passive: true })
    if (this.props.config['products/add_to_cart/quick_mode']) {
      this.setState({ quantity: 0 })
    } else this.setState({ quantity: 1 })
  }
  componentWillUnmount() {
    window.removeEventListener('scroll', this.handleScroll)
  }
  handleScroll = () => {
    if (!this.wrapperRef.current) return
    const top = this.wrapperRef.current.getBoundingClientRect().top
    if (top + 50 >= 0 && top - 50 <= window.innerHeight) {
      if (this.state.position === 'fixed') {
        this.setState({ position: 'static' })
      }
    } else if (this.state.position === 'static') {
      this.setState({ position: 'fixed' })
    }
  }
  // eslint-disable-next-line camelcase
  UNSAFE_componentWillReceiveProps(nextProps) {
    if (nextProps.product !== this.props.product) {
      if (this.props.quickMode) {
        this.setState({ quantity: 0 })
      } else this.setState({ quantity: 1 })
    }
    return null
  }
  handleDecreaseQty = () => {
    const { quantity } = this.state
    if (quantity > 1) {
      this.setState({
        quantity: quantity - 1
      })
    }
  }
  handleIncreaseQty = () => {
    const { quantity } = this.state
    this.setState({
      quantity: quantity + 1
    })
  }
  handleQtyChange = (value) => {
    this.setState({ quantity: parseInt(value) })
  }
  handleBuyNow = (productId) => {
    const { isGuest } = this.props
    if (0 && isGuest) {
      this.props.toggleLoginDialog(true)
    } else {
      let quantity = 0
      const { cart } = this.props
      if (Array.isArray(cart.items) && cart.items.length) {
        cart.items.forEach((item) => {
          if (item.product_id === productId) quantity = item.qty
        })
      } else if (this.state.quantity && this.state.quantity > 0) {
        quantity = this.state.quantity
      } else quantity = 1
      this.props.addToCart(productId, quantity, { buyNow: true })
    }
  }
  handleAddToCart = (productId) => {
    let { quantity } = this.state
    if (quantity < 0) {
      quantity = 1
      this.setState({ quantity })
    }
    this.setState({ isClick: true }, () => {
      setTimeout(() => {
        this.setState({ isClick: false })
      }, 3000)
    })
    this.props.addToCart(productId, quantity)
  }

  handleAddtoCartBooking = (product) => {
    const shipping_fee =
      this.props.config['products/booking/default_shipping_fee']
    let quantity = 1
    const { showBookingModal, addToCartBooking, customer, isGuest } = this.props
    if (isGuest) {
      this.props.toggleLoginDialog(true)
    } else {
      addToCartBooking({ product, quantity, customer, shipping_fee })
      showBookingModal()
    }
  }
  render() {
    const { product, parent, config } = this.props
    const { quantity, position, isClick } = this.state
    if (
      (product.quantity <= 0 || product.status === 'disable') &&
      !(
        product.product_type === 'gift_card' && product.gift_card.auto_generated
      )
    )
      return null
    let quickMode = config['products/add_to_cart/quick_mode']
    const titleBooking = config['products/booking/booking_button_title']
    const cartOption = this.props.config['sales/cart/layout_option']
    return (
      <div ref={this.wrapperRef}>
        <div
          className={ClassNames(
            'addToBoxWrap',
            'inlineAddtoBox',
            position === 'fixed' ? 'fixed' : 'row',
            quickMode ? 'quick-mode' : ''
          )}
          style={{ position }}
        >
          {!quickMode && (
            <div className='col-lg-12 qty-wrapper'>
              <div className='updateQtyGroup'>
                <span className='quantity-title'>Quantity: </span>
                <span
                  className={`btnDecreaseQty ${
                    quantity === 1 ? 'disabled' : ''
                  }`}
                  onClick={this.handleDecreaseQty}
                >
                  <img src='/static/images/svg/minus.svg' />
                </span>
                <span className='qtyNumberInput'>
                  <input
                    type='number'
                    value={quantity}
                    onChange={(e) => this.handleQtyChange(e.target.value)}
                  />
                </span>
                <span
                  className={`btnIncreaseQty ${
                    quantity === product.quantity ? 'disabled' : ''
                  }`}
                  onClick={this.handleIncreaseQty}
                >
                  <img src='/static/images/svg/plus.svg' />
                </span>
              </div>
            </div>
          )}
          <div className='col-lg-12 cart-area'>
            {product.booking_order?.enable ? (
              <button
                className='btn btnAddToCart btnBuyNow'
                onClick={() => this.handleAddtoCartBooking(product)}
              >
                <span className='text'>{titleBooking}</span>
              </button>
            ) : (
              <>
                {!quickMode ? (
                  <button
                    className={`btn btnAddToCart hide ${
                      isClick ? 'clicked' : ''
                    }`}
                    style={{ padding: 'unset' }}
                    onClick={() => this.handleAddToCart(this.props.product._id)}
                  >
                    <div className='content'>
                      {/* Ready To Add Content */}
                      <span className='text ready'>
                        <img
                          alt='cart icon'
                          src='/static/images/ico-shopping-cart.png'
                          className='icon'
                        />
                        Add To Cart
                      </span>
                      {/* Added Content */}
                      <span className='text added'>
                        <CheckOutlined
                          className='icon'
                          style={{ marginRight: '10px', fontSize: '19px' }}
                        />
                        Added To Cart
                      </span>
                    </div>
                  </button>
                ) : (
                  <AddToCartQuickMode
                    quantity={quantity}
                    product={product}
                    setQuantity={(quantity) => this.setState({ quantity })}
                  />
                )}
                <button
                  className='btn btnAddToCart btnBuyNow'
                  onClick={() =>
                    this.handleBuyNow(
                      this.props.product._id,
                      this.props.product.name
                    )
                  }
                >
                  <span className='text'>Buy Now</span>
                </button>
              </>
            )}
            <WishlistButton product={parent || product} />
          </div>
        </div>
      </div>
    )
  }
}
const mapState = (state) => ({
  config: state.config,
  customer: state.customer,
  isGuest: state.auth.isGuest,
  cart: state.cart
})
export default connect(mapState, {
  showBookingModal,
  addToCartBooking,
  toggleLoginDialog,
  addToCart
})(AddToCartBox)
