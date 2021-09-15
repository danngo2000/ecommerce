import React from 'react'
import ProductSlider from '../Product/ProductSlider'
import Link from 'next/link'
// import { T, t } from 'locales'
import { Statistic } from 'antd'
import { connect } from 'react-redux'

const { Countdown } = Statistic
class DealZone extends React.Component {
  render() {
    const { title, url, products, expiryDate, subUrl } = this.props
    const restHour = 3600000 * 24 - new Date().getHours() * 3600000
    const restMinute = new Date().getMinutes() * 60000
    const deadline = restHour - restMinute
    const theme = this.props.config['site/theme']
    return (
      <div className='container'>
        <div className='content-outside'>
          <h3 className='title-deal-zone'>
            <span>{t(title)}</span>
          </h3>
          <div className='link-outside-deal-zone'>
            <Link href={subUrl} as={url}>
              <a>
                <span> Shop All </span>
              </a>
            </Link>
          </div>
        </div>
        <article className='featuredBox dealZone'>
          <div className='header'>
            <div className='col1'>
              <div className='sub-title-area'>
                <span className={`sub-content ${theme}`}>We are selling</span>
                <div className='count-down'>
                  <p>Ending in</p>
                  <Countdown
                    valueStyle={{
                      color: '#E42646',
                      fontSize: '20px',
                      letterSpacing: '3px'
                    }}
                    value={Date.now() + deadline}
                    format='HH:mm:ss'
                  />
                </div>
              </div>
            </div>
            <div className='col2'>
              <div className='viewAllAction'>
                <Link href={subUrl} as={url}>
                  <a>
                    <span> Shop All </span>
                  </a>
                </Link>
              </div>
            </div>
          </div>
          <div className='content'>
            <ProductSlider products={products} type={'flash-sale'} />
          </div>
        </article>
      </div>
    )
  }
}
const mapState = (state) => ({
  config: state.config
})

export default connect(mapState, null)(DealZone)
