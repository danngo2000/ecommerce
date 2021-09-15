import React from 'react'
import { Slider } from 'antd'
import { Price } from '../../Product/Price'

export default class PriceRange extends React.Component {
  state = {
    range: this.props.range
  }

  handleChange = (range) => {
    this.setState({ range })
    this.props.onChange(range)
  }
  componentDidUpdate(prevState) {
    if (this.props.range !== prevState.range) {
      this.setState({
        range: this.props.range
      })
    }
  }
  handleTipFormatter(value) {
    return (
      <div style={{ fontSize: '12px', lineHeight: 'unset' }}>
        <Price price={value} />
      </div>
    )
  }

  static getDerivedStateFromProps(props, state) {
    const { range } = state
    if (range[1] > props.maxPrice) range[1] = props.maxPrice
    if (range[0] < props.minPrice || range[0] > range[1])
      range[0] = props.minPrice
    return { range }
  }

  render() {
    const { minPrice, maxPrice } = this.props
    const { range } = this.state
    const labelStepSize = maxPrice - minPrice
    return (
      <div id='price-range-filter'>
        <Slider
          range={range}
          tipFormatter={this.handleTipFormatter}
          min={minPrice}
          max={maxPrice}
          labelStepSize={labelStepSize > 0 ? labelStepSize : 1}
          onChange={this.handleChange}
          value={range}
          vertical={false}
          tooltipVisible
          tooltipPlacement='bottom'
          getTooltipPopupContainer={() =>
            document.getElementById('price-range-filter')
          }
        />
      </div>
    )
  }
}
