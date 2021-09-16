import React from 'react'
import 'moment-timezone'
import { connect } from 'react-redux'
import { Row, Col, Button } from 'antd'
import Price from '../../Product/Price'
import { changeShippingMethod } from 'actions/cart'
import produce from 'immer'
import StorePickup from '../../Checkout/Shipping/StorePickup'

const DeliveryDays = ({ method }) => {
  const isCheckVendor = method && method.vendor && method.vendor === 'UPS'
  const serviceApiCode =
    method && method.service_api_code && method.service_api_code.toLowerCase()
  if (serviceApiCode && serviceApiCode.includes('ground') && !isCheckVendor) {
    return <div className='description'>Get it in 4 - 6 days</div>
  }

  if (serviceApiCode && serviceApiCode.includes('smartpost')) {
    return <div className='description'>Get it in 7 - 10 days</div>
  }
  if (isCheckVendor) {
    return <div className='description'>Get it in 3 - 5 days</div>
  }

  if (!method.delivery_time_days) return null

  return (
    <div className='description'>
      {t('Get it in ')}
      {method.delivery_time_days}
      {method.max_delivery_time_days &&
        method.delivery_time_days != method.max_delivery_time_days &&
        ` - ${method.max_delivery_time_days} `}
      {t('days')}
    </div>
  )
}

class GroupItems extends React.PureComponent {
  handleOnChange = (allMethod, shipping, value, seller) => {
    let find = allMethod.find((i) => i.service_api_code === value)
    if (find) {
      const _shipping = produce(shipping, (draft) => {
        draft[seller] = find
      })
      this.props.changeShippingMethod(_shipping)
    }
  }
  state = {
    showDetails: false
  }

  render() {
    let { items, orderNumber, shippingMethods, groupId } = this.props
    let { showDetails } = this.state
    let stores = this.props.config['shipping/store_pickup/stores'] || []
    let siteName = this.props.config['site/name']
    // let freeShipConfig = this.props.config['freeship/storefront_settings']
    const theme = this.props.config['site/theme']
    // const sellerTotal = items.length
    const sellerName = items[0].seller ? items[0].seller.name : siteName
    const isDropship = groupId === 'dropship'
    // const shouldFreeship = groupId === 'freeship'
    let methods = []
    const shippingKey = items[0].seller ? items[0].seller._id : groupId
    if (shippingMethods) methods = shippingMethods[shippingKey]
    const { cart } = this.props
    const canNotShip =
      !Array.isArray(methods) ||
      !methods.length ||
      methods.every((m) => isNaN(m.rate)) ||
      !cart.shipping_methods
    return (
      <div className='sellerGroup'>
        {['pink-theme'].includes(theme) && (
          <h4>
            <img
              src={'/static/images/svg/box.svg'}
              style={{ height: 18, width: 'auto', marginRight: 7 }}
              alt=''
            />
            <span>
              <T>Order</T> {orderNumber}&nbsp;
              {isDropship ? (
                <T>Dropship</T>
              ) : (
                <>
                  <T>Sold by</T> {sellerName}
                </>
              )}
              {/* {
                shouldFreeship
                  ? <div>
                    <p>{freeShipConfig.title}</p>
                    <p>{freeShipConfig.description}</p>
                  </div>
                  : isDropship
                    ? <T>Dropship</T>
                    : <><T>Sold by</T> {sellerName}</>
              } */}
            </span>
          </h4>
        )}
        <div className='groupBody'>
          <div className='rates'>
            {canNotShip ? (
              <p className='errLabel'>
                <T>Can't ship to your address</T>
              </p>
            ) : (
              <ul>
                {Array.isArray(methods) &&
                  methods.map((method, index) => {
                    // let now = new Date()
                    if (isNaN(method.rate)) return null
                    const shipping = cart.shipping_methods[shippingKey]
                    return (
                      <li key={index}>
                        <div className='rateInfo'>
                          <div className='title'>
                            <input
                              onChange={(e) =>
                                this.handleOnChange(
                                  methods,
                                  cart.shipping_methods,
                                  e.target.value,
                                  shippingKey
                                )
                              }
                              checked={
                                shipping &&
                                shipping.service_api_code ===
                                  method.service_api_code
                                  ? true
                                  : false
                              }
                              name={shippingKey}
                              type='radio'
                              value={method.service_api_code}
                              id={`${method.service_api_code}_${index}_${shippingKey}`}
                            />

                            <label
                              htmlFor={`${method.service_api_code}_${index}_${shippingKey}`}
                            >
                              {t(method.service_name)}
                            </label>
                          </div>
                          <DeliveryDays method={method} />
                        </div>
                        <div className='price'>
                          <Price price={method.rate} />
                        </div>
                      </li>
                    )
                  })}
                {stores && !!stores.length && (
                  <StorePickup shippingKey={shippingKey} />
                )}
              </ul>
            )}
          </div>
          <div className='seller-products-group'>
            {showDetails ? (
              <Row type='flex' style={{ paddingLeft: '1rem' }}>
                {items.map((item, ii) => (
                  <Col span={24} key={ii}>
                    <div className='seller-products-group--details'>
                      <img className='thumbnail' src={item.thumbnail} alt='' />
                      <div className='name'>
                        <span>{item.name}</span>
                      </div>
                      <div className='price'>
                        <span>
                          <Price price={item.price && item.price.toFixed(2)} />
                        </span>
                      </div>
                      <div className='quantity'>
                        <span>x{item.qty}</span>
                      </div>
                    </div>
                  </Col>
                ))}
              </Row>
            ) : (
              <Row type='flex' justify='end' style={{ paddingLeft: '1rem' }}>
                {items.map((item, ii) => (
                  <Col
                    className='seller-products-item'
                    sm={12}
                    md={8}
                    lg={6}
                    key={ii}
                  >
                    <img className='thumbnail' src={item.thumbnail} alt='' />
                  </Col>
                ))}
              </Row>
            )}
            <Button
              className='show-details-button'
              type='link'
              onClick={() =>
                this.setState((state) => ({ showDetails: !state.showDetails }))
              }
            >
              {showDetails ? t('Less') : t('Show Detail')}
            </Button>
          </div>
        </div>
      </div>
    )
  }
}

const mapState = (state) => ({
  config: state.config,
  cart: state.cart
})

export default connect(mapState, {
  changeShippingMethod
})(GroupItems)
