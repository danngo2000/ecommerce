import React from 'react'
import { connect } from 'react-redux'

class CreditCardIcons extends React.Component {
  render() {
    const creditCard = this.props.config['site/footer/creditcard_icons']
    return (
      <>
        <ul className='creditCardIcons'>
          {creditCard &&
            creditCard.map((item, index) => {
              return (
                <li key={index}>
                  <img alt={item.alt} src={item.src} />
                </li>
              )
            })}
        </ul>
      </>
    )
  }
}

const mapState = (state) => ({
  config: state.config
})

export default connect(mapState)(CreditCardIcons)
