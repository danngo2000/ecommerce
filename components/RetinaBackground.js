import React from 'react'
import isRetina from 'is-retina'

class RetinaBackground extends React.PureComponent {
  state = {
    url: this.props.src
  }
  componentDidMount () {
    this.retinaCalc()
  }
  componentDidUpdate (prevProps) {
    if (this.props.src !== prevProps.src) {
      this.retinaCalc()
    }
  }
  retinaCalc () {
    let url = ''
    if (isRetina()) {
      url = this.props.hiresSrc
    } else {
      url = this.props.src
    }
    this.setState({ url })
  }

  render () {
    return (
      <div className={this.props.className} style={{ backgroundImage: 'url(' + this.state.url + ')', ...this.props.style }}>
        { this.props.children }
      </div>
    )
  }
}

export default RetinaBackground
