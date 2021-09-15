import React from 'react'
import Rating from 'react-rating'
// import { T, t } from 'locales'
import { Checkbox } from 'antd'
export default class Ratings extends React.PureComponent {
  constructor(props) {
    super(props)
    this.state = {
      1: false,
      2: false,
      3: false,
      4: false,
      5: false,
    }
  }

  handleChange = (e, index) => {
    const newState = { ...this.state }
    for (let i = 1; i <= 5; i++) {
      if (i !== index) newState[i] = false
      else {
        newState[i] = e.target.checked
        this.props.onRatingChange(e.target.checked ? i : undefined)
      }
    }

    this.setState(newState)
  }

  render() {
    return (
      <div className='filterBlock ratingBlock'>
        <h4>Review rating</h4>
        {
          [5, 4, 3, 2, 1].map(i => (
            <div key={i}>
              <Checkbox onChange={e => this.handleChange(e, i)} checked={this.state[i]}>
                <Rating
                  emptySymbol={<img src='/static/images/stars/grey.png' className='ratingIcon' />}
                  fullSymbol={<img src='/static/images/stars/yellow.png' className='ratingIcon' />}
                  initialRating={i}
                  readonly
                />
                <span className='text-rating'>{i < 5 ? 'and up' : ''}</span>
              </Checkbox>
            </div>
          ))
        }
      </div>
    )
  }
}
