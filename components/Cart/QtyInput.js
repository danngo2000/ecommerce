import React from 'react'
import debounce from 'lodash.debounce'
import { connect } from 'react-redux'
import { changeCartItemQuantity } from 'actions/cart'

class QtyInput extends React.PureComponent {
  constructor (props) {
    super(props)
    this.state = {
      item: props.item
    }
  }

  handleQtyChange = debounce((item, value) => {
    this.props.changeCartItemQuantity(item.product_id, value)
  }, 1000)

  static getDerivedStateFromProps (props, state) {
    if (props.item._id !== state.item._id) {
      return { item: props.item }
    } else {
      return { item: state.item }
    }
  }

  render () {
    const { item: { qty } } = this.state
    const { item } = this.props
    return (
      <span className='qtyNumberInput'>
        <input
          disabled={!item.product}
          type='number'
          style={{ height: '35px', width: '40px' }}
          value={qty}
          readOnly
        />
      </span>
    )
  }
}

export default connect(null, { changeCartItemQuantity })(QtyInput)
