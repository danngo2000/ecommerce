import React, { useEffect, useRef } from 'react'
import axios from 'axios'
import { connect } from 'react-redux'
import { Radio } from 'antd'
import anime from 'animejs'
import { paymentMethodsVisibilitySelector, publicKeysSelector } from "store/config.selector"
import { loadStripeScript } from 'utils/dom'

const CardError = ({ children }) => {
  const target = useRef()
  useEffect(() => {
    if (!children) return
    anime({
      targets: target.current,
      translateX: ['-20%', '0%'],
      duration: 500
    })
  }, [children])
  return (
    <p className='error' ref={target}>{children}</p>
  )
}

class CardForm extends React.PureComponent {
  state = {
    valid: false,
    error: '',
    loading: false,
    testMode: false,
    sources: {
      data: [],
      has_more: false,
      total_count: 0
    },
    selectedSourceId: null
  }

  // error = React.createRef()

  componentDidMount () {
    loadStripeScript(this.scriptLoaded)
    if (this.props.isGuest) return

    axios.get('/customers/stripe')
        .then(res => res.data)
        .then(sc => {
          const { sources, default_source } = sc
          const newState = { }
          if (default_source) newState.selectedSourceId = default_source
          if (sources) newState.sources = sources
          this.setState(newState)
        })
        .catch(console.error)
  }

  scriptLoaded = async () => {
    if (!window.Stripe) {
      loadStripeScript(this.scriptLoaded)
      return
    }
    const { customer, publicKeys, cart } = this.props
    let testMode = false

    if (!customer && cart.address && cart.address.shipping) {
      const email = cart.address.shipping.email;
      ({ data: testMode } = await axios.post('customers/dev', { email }))
    } else {
      testMode = customer && customer.test_mode
    }
    let actualKey = publicKeys.stripe
    if (publicKeys.stripeSandbox && !!testMode) {
      actualKey = publicKeys.stripeSandbox
      this.setState({ testMode: true })
    } else {
      this.setState({ testMode: false })
    }
    console.log(actualKey, testMode)
    this.stripe = window.Stripe(actualKey)
    const elements = this.stripe.elements()
    const style = {
      base: {
        color: '#32325d',
        fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
        fontSmoothing: 'antialiased',
        fontSize: '16px',
        '::placeholder': {
          color: '#333333'
        }
      },
      invalid: {
        color: '#fa755a',
        iconColor: '#fa755a'
      }
    }

    this.card = elements.create('card', { style, hidePostalCode: true })
    this.card.mount('#card-element')
    // this.card.addEventListener('change', (e) => this.setState({ valid: !e.error }))
  }

  getCardAddress = () => {
    const { customer, cart } = this.props
    const addressBooks = (customer && customer.addressBooks) || []
    const address = cart.address || {}
    let addressId = null
    if (address.billing_id) addressId = address.billing_id
    if (!addressId && address.shipping_id) addressId = address.shipping_id
    if (addressId) {
      let find = addressBooks.find(i => i._id === addressId)
      if (find) return find
    }
    if (address.billing) {
      if (address.billing.first_name && address.billing.last_name) return address.billing
    }
    if (address.shipping) {
      if (address.shipping.first_name && address.shipping.last_name) return address.shipping
    }
    return null
  }

  handlePlaceOrder = async (e) => {
    try {
      let errorMessage = ''
      this.setState({ loading: true, error: '' })

      const cardAddress = this.getCardAddress()
      const extraData = {}
      if (cardAddress) {
        if (cardAddress.zip_code) extraData.address_zip = cardAddress.zip_code
        if (cardAddress.city) extraData.address_city = cardAddress.city
        if (cardAddress.country) extraData.address_country = cardAddress.country
        if (cardAddress.state) extraData.address_state = cardAddress.state
        if (cardAddress.street) extraData.address_line1 = cardAddress.street
        if (cardAddress.first_name) extraData.name = cardAddress.first_name
        if (cardAddress.last_name) {
          if (extraData.name) extraData.name += ' ' + cardAddress.last_name
          else extraData.name = cardAddress.last_name
        }
      }

      const isNewCard = !this.state.selectedSourceId
      const { error, token } = isNewCard
        ? await this.stripe.createToken(this.card, extraData)
        : { token: { id: this.state.selectedSourceId }}

      // if (error) this.error.current.innerHTML = t(error.message)
      if (error) errorMessage = error.message
      else await this.props.onToken(token, isNewCard)
      this.setState({ loading: false, error: errorMessage })
    } catch (e) {
      console.error(e.message)
      this.setState({ loading: false, error: 'Internal Server Error' })
    }
  }

  onSourceChange = (e) => {
    this.setState({
      selectedSourceId: e.target.value,
    });
  }

  render () {
    const { loading, testMode, sources, selectedSourceId } = this.state
    return (<React.Fragment>
      { testMode && <div style={{ color: 'red' }}>Test mode</div> }
      {
        !this.props.isGuest && (
            <Radio.Group onChange={this.onSourceChange} value={selectedSourceId}>
              {Array.isArray(sources.data) && sources.data.map(source => {
                return (
                    <Radio style={{display: 'block', height: '30px', lineHeight: '30px'}} value={source.id} key={source.id}>
                      {source.brand} **** {source.last4}
                    </Radio>
                )
              })}
              <Radio style={{display: 'block', height: '30px', lineHeight: '30px'}} value={null}>
                Add New Card
              </Radio>
            </Radio.Group>
        )
      }
      <div id='card-element' style={selectedSourceId ? { visibility: 'hidden', height: 0 } : { visibility: 'visible', height: 'auto' }}/>
      <CardError>{this.state.error}</CardError>
      <div className='checkoutCardBtnGroup row'>
        <div className='col-md-7 col-12'>
          {
            loading
              ? <img src='/static/images/loading-icon.gif' />
              : <button onClick={this.handlePlaceOrder} className='btn'>Place Order Now</button>
          }
        </div>
        {
          typeof this.props.onGoBack === 'function' &&
          <div className='col-md-5 col-12' style={{ textAlign: 'right' }}>
            <span style={{ marginTop: '5px' }} className='goBackBtn'
              onClick={_ => this.props.onGoBack()}>Go back</span>
          </div>
        }
      </div>
    </React.Fragment>)
  }
}

const mapState = (state) => ({
  isGuest: state.auth.isGuest,
  customer: state.customer,
  cart: state.cart,
  publicKeys: publicKeysSelector(state),
  enabledMethods: paymentMethodsVisibilitySelector(state)
})

export default connect(mapState)(CardForm)
