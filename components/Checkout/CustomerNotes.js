
import React from 'react'
import { connect } from 'react-redux'
import debounce from 'lodash.debounce'
import { addCartNote } from 'actions/cart'

class CustomerNote extends React.PureComponent {
  handleNoteChange = debounce((value) => {
    this.props.addCartNote(value)
  }, 1000)
  render () {
    const theme = this.props.config['site/name']
    return (
      <div className='stepContent' style={{ margin: 0, borderTop: '1px solid #ccc', paddingTop: '20px' }}>
        <textarea
          onChange={(e) => this.handleNoteChange(e.target.value)}
          name=''
          id=''
          cols='30'
          rows='10'
          placeholder='Note entry...'
          style={{ height: '120px', backgroundColor: 'rgb(252,246,206)', border: '1px solid rgb(233, 235, 238)' }}
        />
        <div style={{padding: '10px', backgroundColor: 'rgb(240, 242, 245)', border: '1px solid rgb(233, 235, 238)'}}>Messages to  {theme}, Deliverer</div>
      </div>
    )
  }
}
const mapState = (state) => ({
  config: state.config,
  cart: state.cart
})

export default connect(mapState, { addCartNote })(CustomerNote)
